/**
 * POST /api/mcp: a public, read-only Model Context Protocol server exposing
 * the CV, for MCP clients (Claude Desktop, Claude Code, or any other MCP
 * client) to connect to directly rather than reading the page.
 *
 * Spec: MCP 2026-07-28 (the stateless-core revision), Streamable HTTP
 * transport, no sessions. A fresh McpServer + transport is created per
 * request per the SDK's own documented stateless pattern; nothing is held
 * in memory between requests.
 *
 * Every tool is a pure read of the same `cv` object and `renderCvMarkdown`
 * serializer /api/chat and /llms-full.txt already use — no second data
 * model, no new hallucination surface. The one generative tool,
 * why_fit_for_role, calls buildSystemPrompt() from src/chat/prompt.ts
 * unmodified, so this surface and the chat can never give divergently
 * grounded answers to the same question.
 *
 * This is a demonstration of protocol fluency, not a promised recruiting
 * channel: nothing on the site claims hiring teams query this (see
 * docs/reviews/ai-native-agent-1-mcp.md for why that claim would be
 * unsupported).
 */
import type { APIRoute } from 'astro';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { env } from 'cloudflare:workers';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { cv, doiUrl, pmidUrl } from '../../lib/cv';
import { renderCvMarkdown } from '../../lib/markdown';
import { buildSystemPrompt } from '../../chat/prompt';
import { SITE } from '../../lib/site';
import { hashIp, nextRateState, rateLimitKey } from '../../chat/guards';

export const prerender = false;

const CV_MARKDOWN = renderCvMarkdown(cv);
const DEFAULT_MODEL = 'claude-haiku-4-5';
const MAX_OUTPUT_TOKENS = 600;
const MCP_PER_HOUR = 30;
const MAX_BODY_BYTES = 32 * 1024;

interface McpEnv {
  ANTHROPIC_API_KEY?: string;
  CHAT_MODEL?: string;
  CHAT_KV?: KVNamespace;
  IP_HASH_SALT?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, mcp-protocol-version',
  'Access-Control-Expose-Headers': 'mcp-protocol-version',
  // Every response on this route must never be cached at the edge: a stale
  // cached 404 from before this route existed is exactly the class of bug
  // this caused once already (see docs/build for the write-up).
  'Cache-Control': 'no-store',
} as const;

function jsonRpcError(status: number, message: string, code = -32000): Response {
  return new Response(
    JSON.stringify({ jsonrpc: '2.0', id: null, error: { code, message } }),
    { status, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } },
  );
}

function text(payload: unknown) {
  return { content: [{ type: 'text' as const, text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2) }] };
}

/** Sections searched by name (mirrors the citation headings /api/chat cites). */
interface SearchRole {
  section: string;
  title: string;
  organization: string;
  start: string;
  end?: string;
  bullets: readonly string[];
}

function role(section: string, title: string, organization: string, start: string, end: string | undefined, bullets: readonly string[]): SearchRole {
  return end === undefined ? { section, title, organization, start, bullets } : { section, title, organization, start, end, bullets };
}

function searchableRoles(): SearchRole[] {
  const roles: SearchRole[] = [];
  for (const r of cv.clinical) roles.push(role('Clinical Practice', r.title, r.organization, r.start, r.end, r.bullets));
  for (const r of cv.ventures) roles.push(role('Entrepreneurship', r.title, r.organization, r.start, r.end, r.bullets));
  for (const r of cv.research.positions) roles.push(role('Research', r.title, r.organization, r.start, r.end, r.bullets));
  for (const t of cv.teaching) roles.push(role('Teaching and Recognition', t.title, t.organization, t.start ?? '', t.end, []));
  return roles;
}

function buildServer(runtime: McpEnv): McpServer {
  const server = new McpServer({ name: 'menon-md-cv', version: '1.0.0' }, {
    instructions:
      'Read-only CV data for Rejeesh Menon, MD, sourced from a single YAML file. ' +
      'Every fact returned here matches the live page at https://menon.md and /llms-full.txt exactly. ' +
      'why_fit_for_role is the only tool that generates text; every other tool returns cv.yaml data verbatim.',
  });

  server.registerTool(
    'get_profile',
    { title: 'Get profile', description: 'Identity, current title, employer, location and target roles.' },
    async () => text({
      name: cv.identity.displayName,
      headline: cv.identity.headline,
      currentTitle: cv.identity.currentTitle,
      employer: cv.identity.employer.name,
      location: `${cv.identity.location.city}, ${cv.identity.location.region}, ${cv.identity.location.country}`,
      workAuthorization: cv.identity.workAuthorization,
      targets: cv.identity.targets,
      summary: cv.summary,
      links: cv.links.map((l) => ({ label: l.label, url: l.url })),
    }),
  );

  server.registerTool(
    'search_experience',
    {
      title: 'Search experience',
      description: 'Full-text search across clinical practice, entrepreneurship, research and teaching entries.',
      inputSchema: { query: z.string().min(1).max(200).describe('Search term, e.g. "hospitalist" or "chikungunya"') },
    },
    async ({ query }) => {
      const q = query.toLowerCase();
      const matches = searchableRoles().filter(
        (r) => r.title.toLowerCase().includes(q) || r.organization.toLowerCase().includes(q) || r.bullets.some((b) => b.toLowerCase().includes(q)),
      );
      return text({ query, count: matches.length, results: matches });
    },
  );

  server.registerTool(
    'get_projects',
    { title: 'Get projects', description: 'The clinical AI and software projects, with role, stack, status and safety/compliance detail.' },
    async () => text({
      intro: cv.projects.intro,
      disclosure: cv.projects.disclosure,
      items: cv.projects.items.map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        status: p.status,
        role: p.role,
        url: p.url,
        stack: p.stack,
        bullets: p.bullets,
      })),
    }),
  );

  server.registerTool(
    'get_project',
    {
      title: 'Get one project',
      description: 'One project by id (superhuman, clinic-os, commerce, dermavue-web), including the safety-claims disclosure.',
      inputSchema: { id: z.string().describe('Project id, e.g. "superhuman"') },
    },
    async ({ id }) => {
      const p = cv.projects.items.find((x) => x.id === id);
      if (!p) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: `No project with id "${id}". Valid ids: ${cv.projects.items.map((x) => x.id).join(', ')}.` }],
        };
      }
      return text({ ...p, disclosure: cv.projects.disclosure });
    },
  );

  server.registerTool(
    'get_publications',
    { title: 'Get publications', description: 'Publications with DOI/PMID links and citation metrics, sourced and dated exactly as in the CV.' },
    async () => text({
      narrative: cv.research.narrative,
      lineage: cv.research.lineage,
      metrics: cv.research.metrics,
      publications: cv.publications.map((p) => ({
        authors: p.authors,
        title: p.title,
        journal: p.journal,
        year: p.year,
        doi: p.doi,
        doiUrl: p.doi ? doiUrl(p.doi) : undefined,
        pmid: p.pmid,
        pmidUrl: p.pmid ? pmidUrl(p.pmid) : undefined,
        citations: p.citations,
        note: p.note,
      })),
    }),
  );

  server.registerTool(
    'get_verifiable_credentials',
    { title: 'Get verifiable credentials', description: 'Board certification, medical licenses, education and honors, each with a primary-source verification link where one exists.' },
    async () => text({
      education: cv.education,
      boardCertification: cv.credentials.boards,
      certifications: cv.credentials.certifications,
      licenses: cv.credentials.licenses,
      honors: cv.honors,
    }),
  );

  server.registerTool(
    'why_fit_for_role',
    {
      title: 'Why is he a fit for this role?',
      description:
        'The one generative tool. Compares the CV against a role description you provide. Grounded only on the CV, same rules as the on-site chat: cites a CV section for every claim, declines anything the CV does not say, no medical advice.',
      inputSchema: { role_description: z.string().min(1).max(4000).describe('The role or job description to compare the CV against') },
    },
    async ({ role_description }) => {
      const apiKey = runtime.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return text(`This tool is not configured right now. Email Rejeesh directly at ${cv.identity.email}.`);
      }
      const system = buildSystemPrompt({
        cvMarkdown: CV_MARKDOWN,
        fallback: cv.chat.fallback,
        jdContext: role_description,
        audienceLabel: 'the role described by the MCP client caller',
      });
      try {
        const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 30_000 });
        const response = await client.messages.create({
          model: runtime.CHAT_MODEL || DEFAULT_MODEL,
          max_tokens: MAX_OUTPUT_TOKENS,
          system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
          messages: [{ role: 'user', content: 'Evaluate his fit for the role described above.' }],
        });
        const block = response.content.find((b) => b.type === 'text');
        return text(block && block.type === 'text' ? block.text : cv.chat.fallback);
      } catch (err) {
        console.error('MCP why_fit_for_role error', err);
        return text(`Could not answer right now. Email Rejeesh at ${cv.identity.email}.`);
      }
    },
  );

  server.registerResource(
    'cv-full',
    'cv://full',
    { title: 'Full CV (markdown)', mimeType: 'text/markdown', description: 'The complete CV as markdown, identical to /llms-full.txt and the on-site chat grounding.' },
    async () => ({ contents: [{ uri: 'cv://full', mimeType: 'text/markdown', text: CV_MARKDOWN }] }),
  );

  return server;
}

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: CORS_HEADERS });

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'menon-md-cv',
      protocol: 'Model Context Protocol, 2026-07-28 (stateless Streamable HTTP)',
      description: 'Public, read-only, no authentication. POST JSON-RPC 2.0 requests here to query the CV.',
      note: 'This demonstrates protocol fluency; it is not a promised recruiting channel.',
      humans: `${SITE.url}/build`,
    }, null, 2),
    { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } },
  );

export const DELETE: APIRoute = () => jsonRpcError(405, 'This is a stateless server; there is no session to delete.');

export const POST: APIRoute = async ({ request }) => {
  const runtime = env as unknown as McpEnv;

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) return jsonRpcError(413, 'Request body too large.');

  const kv = runtime.CHAT_KV;
  if (!kv) {
    console.error('MCP: CHAT_KV binding missing; refusing request (fail closed).');
    return jsonRpcError(429, 'Rate limiter unavailable; try again shortly.');
  }
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = await hashIp(ip, runtime.IP_HASH_SALT ?? 'menon-md');
  const key = rateLimitKey(ipHash, new Date(), 'mcp');
  try {
    const state = nextRateState(await kv.get(key), MCP_PER_HOUR);
    if (!state.allowed) return jsonRpcError(429, `Rate limit exceeded: ${MCP_PER_HOUR} requests per hour per IP.`);
    await kv.put(key, String(state.count), { expirationTtl: 3600 });
  } catch (err) {
    console.error('MCP rate limit store unavailable; refusing request (fail closed).', err);
    return jsonRpcError(429, 'Rate limiter unavailable; try again shortly.');
  }

  const server = buildServer(runtime);
  const transport = new WebStandardStreamableHTTPServerTransport();
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  for (const [k, v] of Object.entries(CORS_HEADERS)) response.headers.set(k, v);
  return response;
};
