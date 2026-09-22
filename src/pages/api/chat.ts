/**
 * POST /api/chat: the only server route on the site.
 *
 * Grounded chat about the CV. The whole CV markdown (same serializer as
 * /llms-full.txt) is injected into the system prompt on every request; no
 * retrieval. Guards run before the model is called: body schema, size limits,
 * same-origin check, and a per-IP hourly rate limit in CHAT_KV that fails
 * closed. Each Q&A pair is logged to CHAT_KV with a 90-day TTL and a coarse
 * IP hash only.
 */
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { env } from 'cloudflare:workers';
import { cv } from '../../lib/cv';
import { renderCvMarkdown } from '../../lib/markdown';
import { getAudience } from '../../lib/audiences';
import { SITE } from '../../lib/site';
import { buildSystemPrompt } from '../../chat/prompt';
import {
  LIMITS,
  allowedOriginsFor,
  hashIp,
  isSameOrigin,
  logKey,
  nextRateState,
  rateLimitKey,
  validateChatBody,
} from '../../chat/guards';

export const prerender = false;

// Serialized once at build time; the grounding text never varies per request,
// which also keeps the prompt-cache prefix stable.
const CV_MARKDOWN = renderCvMarkdown(cv);
const DEFAULT_MODEL = 'claude-haiku-4-5';
const MAX_OUTPUT_TOKENS = 600;

interface ChatEnv {
  ANTHROPIC_API_KEY?: string;
  CHAT_MODEL?: string;
  CHAT_KV?: KVNamespace;
  IP_HASH_SALT?: string;
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

const FRIENDLY_429 =
  'You have reached the limit of 10 messages per hour for this chat. Please try again later, or email Rejeesh directly at ' +
  cv.identity.email +
  '.';

export const POST: APIRoute = async ({ request }) => {
  const runtime = env as unknown as ChatEnv;

  // 1. Same-origin check: the canonical site, or the origin this request was served from.
  if (!isSameOrigin(request.headers, allowedOriginsFor(request.url, SITE.url))) {
    return json(403, { error: 'This endpoint only accepts requests from menon.md.' });
  }

  // 2. Body schema and limits.
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, { error: 'Request body must be JSON.' });
  }
  const validated = validateChatBody(raw);
  if (!validated.ok) return json(validated.status, { error: validated.error });
  const body = validated.value;

  // 3. Rate limit, fail closed.
  const kv = runtime.CHAT_KV;
  if (!kv) {
    console.error('CHAT_KV binding missing; refusing request (fail closed).');
    return json(429, { error: FRIENDLY_429 });
  }
  const ip =
    request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = await hashIp(ip, runtime.IP_HASH_SALT ?? 'menon-md');
  const rlKey = rateLimitKey(ipHash);
  let count: number;
  try {
    const state = nextRateState(await kv.get(rlKey));
    if (!state.allowed) return json(429, { error: FRIENDLY_429 });
    count = state.count;
    await kv.put(rlKey, String(count), { expirationTtl: LIMITS.rateWindowSeconds });
  } catch (err) {
    console.error('Rate limit store unavailable; refusing request (fail closed).', err);
    return json(429, { error: FRIENDLY_429 });
  }

  // 4. Model configuration.
  const apiKey = runtime.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY secret is not set.');
    return json(503, { error: `The chat is not configured yet. Email Rejeesh at ${cv.identity.email}.` });
  }
  const model = runtime.CHAT_MODEL || DEFAULT_MODEL;
  const audience = getAudience(body.audience);
  const system = buildSystemPrompt({
    cvMarkdown: CV_MARKDOWN,
    fallback: cv.chat.fallback,
    jdContext: audience?.jdContext,
    audienceLabel: audience ? `${audience.role} at ${audience.company}` : undefined,
  });

  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 45_000 });
  const messages: Anthropic.MessageParam[] = body.messages.map((m) => ({ role: m.role, content: m.content }));
  const question = body.messages[body.messages.length - 1]!.content;

  // 5. Stream the answer as Server-Sent Events, then log the pair.
  const encoder = new TextEncoder();
  let answer = '';
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      try {
        const run = client.messages.stream({
          model,
          max_tokens: MAX_OUTPUT_TOKENS,
          system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
          messages,
        });
        run.on('text', (delta) => {
          answer += delta;
          send('delta', { text: delta });
        });
        const final = await run.finalMessage();
        if (final.stop_reason === 'refusal') {
          answer = cv.chat.fallback;
          send('delta', { text: cv.chat.fallback });
        }
        send('done', { stop_reason: final.stop_reason, truncated: final.stop_reason === 'max_tokens' });
      } catch (err) {
        const status = err instanceof Anthropic.APIError ? err.status : undefined;
        console.error('Upstream model error', status, err instanceof Error ? err.message : err);
        send('error', {
          error:
            err instanceof Anthropic.RateLimitError
              ? 'The model is busy right now. Please try again in a minute.'
              : `The chat could not answer just now. Email Rejeesh at ${cv.identity.email}.`,
        });
      } finally {
        controller.close();
        try {
          await kv.put(
            logKey(),
            JSON.stringify({
              t: new Date().toISOString(),
              ip: ipHash,
              n: count,
              audience: audience?.slug ?? null,
              model,
              q: question,
              a: answer,
              turns: body.messages.length,
            }),
            { expirationTtl: LIMITS.logTtlSeconds },
          );
        } catch (err) {
          console.error('Failed to write chat log', err);
        }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};

export const GET: APIRoute = () => json(405, { error: 'Use POST with a JSON body: { messages: [{ role, content }] }.' });
