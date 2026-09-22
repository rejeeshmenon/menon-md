# menon.md: CV website design spec

Date: 2026-09-21. Owner: Rejeesh Menon, MD. Canonical URL: https://menon.md

## Problem in one sentence

Rejeesh needs one URL that a recruiter at an AI company can read as a credible academic CV, that an LLM reading the URL can extract clean facts from, and that offers a grounded chat which cannot hallucinate or be prompt-injected.

## Hard constraints

1. Single source of truth: `src/content/cv.yaml`. Every surface is generated from it at build time.
2. Accuracy over flash. Every credential links to its primary source. Roles stated precisely (built, designed, led, contributed).
3. Anti-slop design: white background, navy #1F3A5F, restrained gold, Georgia/serif headings, system sans body. No gradients, glassmorphism, emoji, or em dashes.
4. Chat asserts only facts in its grounding context, cites the CV section, treats visitor input as untrusted. Full-context grounding, no RAG.
5. Static-first: every page prerendered; exactly one server endpoint, `/api/chat`. Site works with JavaScript disabled, chat excepted.
6. No secrets in repo or git history. `.dev.vars` gitignored before first commit.

## Decisions that deviate from the original brief, and why

| Brief said | Decision | Reason |
|---|---|---|
| Astro 5 | Astro 7.3 (current stable) | The only adapter that supports Astro 5 is `@astrojs/cloudflare` 12.x, two majors behind. New production work on a two-major-old framework is not senior-engineer practice. |
| Cloudflare Pages, `wrangler.toml` with `pages_build_output_dir` | Cloudflare Workers with static assets, `wrangler.jsonc` with `main` + `assets` | The current `@astrojs/cloudflare` adapter dropped Pages support (docs: "no longer supports deployment on Cloudflare Pages"). Workers static assets is the same free tier, same custom-domain flow. `CHAT_KV` binding and `CHAT_MODEL` var are unchanged. |
| `npx wrangler pages secret put` / `pages deploy` / `pages dev` | `npx wrangler secret put` / `wrangler deploy` / `astro dev` (workerd via Cloudflare Vite plugin) or `wrangler dev` | Follows from the above. |
| Licenses: WA, OR, CA | WA, OR, CA (all active) | Confirmed against the 2026-09-21 master CV in `G:\My Drive\CV MAKING 2026`. An older June 2026 CV listed Texas; superseded. |
| Chat model "claude-haiku-class" | `CHAT_MODEL = "claude-haiku-4-5"` | Current Haiku model ID. Configurable via var. |

## Facts reconciliation

Scholar export (Sep 2026): 223 citations, h-index 6, i10-index 6, 96 since 2021. Matches brief.
Publication identifiers verified against master CV: AIM Clinical Cases doi:10.7326/aimcc.2023.0565; AJP Cell PMID 24477233 doi:10.1152/ajpcell.00174.2013; IJR doi:10.1016/S0973-3698(10)60189-6.
ABIM certified October 2016; ECFMG 2012. Adjunct clinical faculty PNWU since 2018. Hospice physician Chaplaincy Health Care since Feb 2022. Editorial boards of three journals.

## Architecture

```
cv.yaml ──> src/lib/cv.ts (typed loader, validation: required sections, no em dash, no emoji)
              │
              ├─> src/lib/markdown.ts (single deterministic serializer)
              │      ├─> /llms-full.txt
              │      ├─> /plain (rendered as semantic HTML from the same section model)
              │      └─> chat grounding (imported by /api/chat at build)
              ├─> src/lib/jsonld.ts  ──> Person JSON-LD in <head>
              ├─> src/lib/jsonresume.ts ──> /cv.json
              ├─> src/pages/index.astro, /for/[slug].astro (HTML)
              ├─> /llms.txt, /robots.txt, /sitemap.xml
              └─> scripts/og-image.mjs (SVG template -> sharp -> public/og.png at prebuild)

/api/chat (Worker route, prerender=false)
  guards: JSON schema, 1,000 chars/msg, 8 msgs, same-origin, per-IP 10/hour via CHAT_KV (fail closed 429)
  grounding: full CV markdown + optional audience jdContext in system prompt (cache_control ephemeral)
  model: env CHAT_MODEL, key env ANTHROPIC_API_KEY, streamed text/event-stream
  logging: log:{ts}:{rand} -> CHAT_KV, TTL 90 days, IP as SHA-256 prefix with daily salt

scripts/verify-outputs.mjs: post-build assertion of canonical facts across dist outputs; exit 1 on drift
```

## Components

- `src/content/cv.yaml`: identity, links, stats, sections (projects, clinical, ventures, research, publications, teaching, skills, education, credentials, honors), chat starter questions.
- `src/content/audiences/*.yaml`: slug, company, role, greeting, emphasize[], bullets[3], jdContext.
- `src/lib/cv.ts`: zod schema, YAML parse, forbidden-character scan, exported `cv` constant.
- `src/lib/markdown.ts`: `renderCvMarkdown(cv)` deterministic output; `sectionIds` list.
- `src/lib/jsonld.ts`, `src/lib/jsonresume.ts`, `src/lib/seo.ts` (site constants, analytics token constant).
- `src/layouts/Base.astro`: head meta, OG, JSON-LD slot, tokens CSS, print CSS, nav, chat launcher.
- `src/components/*`: Hero, StatTiles, Section, Project, Role, Publication, ChatWidget (island loaded on click), ChatPage.
- `src/pages/`: index, plain, chat, for/[slug], llms.txt.ts, llms-full.txt.ts, cv.json.ts, robots.txt.ts, sitemap.xml.ts, api/chat.ts.
- `src/chat/system-prompt.ts`: the rule text, shared by Worker.
- `public/chat.js`: the lazy widget (plain TS compiled by Vite as a separate entry, or a small hand-written script).

## Design tokens

Light: bg #FFFFFF, ink #14181F, navy #1F3A5F, gold #A8853A (rules, section labels), muted #5B6470, hairline #E3E6EA.
Dark (prefers-color-scheme only): bg #0E1420, ink #EDE8DF, navy #7FA3D1, gold #C9A85C, muted #9AA3B2, hairline #22304A.
Type: Georgia, "Times New Roman", serif for headings and display numbers; system-ui sans for body. Max prose width 72ch. Small-caps letterspaced section labels.

## Error handling

- Build fails on: missing required section, em dash or emoji in YAML, verify-outputs drift.
- Chat Worker: malformed body 400; too long 413; rate limit 429 with friendly text; upstream error 502 with friendly text; KV failure on rate limit = deny (fail closed). Never echo the system prompt.
- Chat UI: network failure shows a mailto fallback line.

## Testing and verification

- `npm run build` runs: prebuild OG image, astro build, verify-outputs.
- Unit checks in `scripts/verify-outputs.mjs` (facts drift) and a small vitest suite for `cv.ts` validation and `markdown.ts` determinism and the chat guards (pure functions extracted to `src/chat/guards.ts`).
- Grep dist for em dashes and emoji in visible copy: zero.
- Lighthouse on / and /plain: target 95+ all categories.
- JS byte count on / excluding lazy chat widget: under 50 KB (target near zero).
- Secret scan of repo and history before push.

## Out of scope (recommended follow-ups)

- CV-as-MCP-server endpoint (research recommends as a competence signal for AI-company audiences).
- Automated JD-matching (rejected: adds injection surface, low traffic).
