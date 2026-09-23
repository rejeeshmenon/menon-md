/**
 * Pure guard functions for the chat Worker. No I/O here so they are unit
 * testable; the route in src/pages/api/chat.ts wires them to the request, KV
 * and the model.
 */
import { z } from 'zod';

export const LIMITS = {
  maxMessageChars: 1000,
  maxMessages: 8,
  perHour: 10,
  logTtlSeconds: 90 * 24 * 60 * 60,
  rateWindowSeconds: 60 * 60,
} as const;

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(LIMITS.maxMessageChars),
});

export const chatBodySchema = z
  .object({
    messages: z.array(messageSchema).min(1).max(LIMITS.maxMessages),
    audience: z
      .string()
      .regex(/^[a-z0-9-]{1,40}$/)
      .optional(),
  })
  .strict();

export type ChatBody = z.infer<typeof chatBodySchema>;
export type ChatMessage = ChatBody['messages'][number];

export type GuardResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

/** Validate the parsed JSON body: shape, sizes, and that the last turn is from the visitor. */
export function validateChatBody(input: unknown): GuardResult<ChatBody> {
  const parsed = chatBodySchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const tooLong = parsed.error.issues.some((i) => i.code === 'too_big');
    return {
      ok: false,
      status: tooLong ? 413 : 400,
      error: tooLong
        ? `Messages are limited to ${LIMITS.maxMessageChars} characters and ${LIMITS.maxMessages} turns.`
        : `Invalid request${first ? `: ${first.path.join('.')} ${first.message}` : ''}.`,
    };
  }
  const messages = parsed.data.messages;
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') {
    return { ok: false, status: 400, error: 'The last message must come from the visitor.' };
  }
  if (messages[0]?.role !== 'user') {
    return { ok: false, status: 400, error: 'The conversation must start with a visitor message.' };
  }
  for (let i = 1; i < messages.length; i++) {
    if (messages[i]!.role === messages[i - 1]!.role) {
      return { ok: false, status: 400, error: 'Messages must alternate between visitor and assistant.' };
    }
  }
  return { ok: true, value: parsed.data };
}

/**
 * Same-origin check. Browsers send Origin on cross-site POSTs; a missing Origin
 * with a matching Sec-Fetch-Site of same-origin is also accepted. Anything else
 * is rejected so third-party pages cannot drive the endpoint from a visitor's browser.
 */
export function isSameOrigin(headers: Headers, allowedOrigins: readonly string[]): boolean {
  const origin = headers.get('origin');
  const fetchSite = headers.get('sec-fetch-site');
  if (origin) return allowedOrigins.includes(origin);
  return fetchSite === 'same-origin' || fetchSite === 'none';
}

/**
 * Origins a request may come from: the canonical site plus the origin the
 * request itself was served from (covers the workers.dev preview URL and
 * local development without ever accepting a third-party origin).
 */
export function allowedOriginsFor(requestUrl: string, siteOrigin: string): string[] {
  const own = new URL(requestUrl).origin;
  return own === siteOrigin ? [siteOrigin] : [siteOrigin, own];
}

/** Coarse, non-reversible IP identifier: SHA-256 of ip + daily salt, first 16 hex chars. */
export async function hashIp(ip: string, salt: string, now: Date = new Date()): Promise<string> {
  const day = now.toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${salt}|${day}|${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** KV key for the current hourly rate-limit bucket. `prefix` namespaces separate budgets (e.g. chat vs. MCP) in the same KV. */
export function rateLimitKey(ipHash: string, now: Date = new Date(), prefix = 'rl'): string {
  const bucket = Math.floor(now.getTime() / (LIMITS.rateWindowSeconds * 1000));
  return `${prefix}:${ipHash}:${bucket}`;
}

/** KV key for a Q&A log entry. */
export function logKey(now: Date = new Date()): string {
  const rand = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(rand)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `log:${now.toISOString()}:${suffix}`;
}

/** Given the stored count, decide whether this request is allowed and the new count. `limit` defaults to the chat budget; pass a different one for a separate surface (e.g. MCP). */
export function nextRateState(
  storedCount: string | null,
  limit: number = LIMITS.perHour,
): { allowed: boolean; count: number } {
  const current = storedCount ? Number.parseInt(storedCount, 10) || 0 : 0;
  if (current >= limit) return { allowed: false, count: current };
  return { allowed: true, count: current + 1 };
}
