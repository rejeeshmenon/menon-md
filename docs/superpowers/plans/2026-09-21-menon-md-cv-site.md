# menon.md CV Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the menon.md CV website: human CV page, machine-readable layer, grounded chat Worker, recruiter routes, CI guard, docs.

**Architecture:** One YAML source (`src/content/cv.yaml`) feeds a typed loader; a single markdown serializer feeds llms-full.txt, /plain and the chat grounding; Astro prerenders every page and exposes one Worker route `/api/chat` on Cloudflare Workers with static assets. A post-build script asserts canonical facts across all outputs.

**Tech Stack:** Astro 7.3, TypeScript strict, Tailwind CSS v4 via `@tailwindcss/vite`, `@astrojs/cloudflare` 14, `yaml`, `zod`, `@anthropic-ai/sdk`, `sharp`, `vitest`, Wrangler 4.

**Spec:** `docs/superpowers/specs/2026-09-21-menon-md-cv-site-design.md`

## Global Constraints

- Canonical URL `https://menon.md`. Deploy target Cloudflare Workers (static assets + one route).
- No em dash (U+2014) or emoji anywhere in cv.yaml, audiences, or rendered copy. Loader fails the build on either.
- Colors: white bg, navy `#1F3A5F`, gold accents; Georgia/serif headings, system sans body. No gradients, no glassmorphism, no icons in stat tiles.
- Exactly one non-prerendered route: `src/pages/api/chat.ts`.
- Secrets only via Cloudflare secret `ANTHROPIC_API_KEY` and local `.dev.vars` (gitignored before first commit).
- Chat: max 1,000 chars per message, max 8 messages, 10 messages/hour/IP via `CHAT_KV`, fail closed with 429, same-origin check, logs `log:{timestamp}:{random}` TTL 90 days, IP stored as coarse hash only.
- JS on `/` under 50 KB excluding lazy chat widget. Lighthouse 95+ on `/` and `/plain`.

---

## File map

```
package.json, astro.config.mjs, tsconfig.json, wrangler.jsonc, .gitignore, .dev.vars.example, README.md
src/content/cv.yaml
src/content/audiences/health-system.yaml, ai-startup.yaml
src/lib/cv.ts            loadCv(): Cv (zod-validated, forbidden-char scan)
src/lib/markdown.ts      renderCvMarkdown(cv): string, SECTION_ORDER
src/lib/jsonld.ts        buildPersonGraph(cv): object
src/lib/jsonresume.ts    buildJsonResume(cv): object
src/lib/audiences.ts     loadAudiences(): Audience[]
src/lib/site.ts          SITE constants (url, analyticsToken)
src/lib/text.ts          forbidden-char helpers (shared by loader and verify script)
src/chat/guards.ts       validateChatBody, rateLimitKey, hashIp (pure)
src/chat/prompt.ts       buildSystemPrompt(cvMarkdown, jdContext?)
src/styles/global.css    tokens, base, print
src/layouts/Base.astro
src/components/*.astro   Nav, Hero, StatTiles, section components, ChatLauncher, Footer, CvBody
src/pages/index.astro, plain.astro, chat.astro, for/[slug].astro
src/pages/llms.txt.ts, llms-full.txt.ts, cv.json.ts, robots.txt.ts, sitemap.xml.ts
src/pages/api/chat.ts
public/chat-widget.js (lazy)
scripts/og-image.mjs, scripts/verify-outputs.mjs, scripts/scan-dist.mjs
tests/*.test.ts (vitest)
```

## Tasks

### Task 0: Scaffold (Stage 0)
- [ ] package.json with astro 7, @astrojs/cloudflare 14, tailwindcss 4, @tailwindcss/vite, TypeScript strict tsconfig.
- [ ] astro.config.mjs: site https://menon.md, output static, cloudflare adapter with imageService compile, tailwind vite plugin.
- [ ] wrangler.jsonc: name menon-md, main ./dist/_worker.js/index.js, nodejs_compat, assets binding ASSETS directory ./dist, kv_namespaces CHAT_KV, vars CHAT_MODEL claude-haiku-4-5.
- [ ] .gitignore includes .dev.vars, node_modules, dist, .wrangler, .astro.
- [ ] git init, first commit. Verify: npm run build on a hello page succeeds.

### Task 1: Content layer (Stage 1)
- [ ] src/lib/text.ts: forbidden regex for U+2014 and Extended_Pictographic; findForbidden(text).
- [ ] src/content/cv.yaml with every fact from the brief.
- [ ] src/lib/cv.ts: zod schema for all sections; throws on missing section or forbidden char.
- [ ] src/lib/markdown.ts: deterministic markdown, sections in SECTION_ORDER, headings matching HTML ids.
- [ ] Tests: tests/cv.test.ts (loads; rejects em dash; rejects emoji), tests/markdown.test.ts (stable; all headings; contains 223 and ABIM 2016).
- [ ] Commit.

### Task 2: Human page (Stage 2)
- [ ] global.css tokens light/dark, print stylesheet, base typography.
- [ ] Base layout with head meta, JSON-LD slot, nav, footer, chat launcher (link to /chat, upgraded by lazy script).
- [ ] Components and index page; semantic HTML (header, nav, main, section aria-labelledby, address, time datetime).
- [ ] Inline nav script under 1 KB using IntersectionObserver.
- [ ] Verify: build, inspect dist/index.html; scan-dist reports zero forbidden chars.
- [ ] Commit.

### Task 3: Machine layer (Stage 3)
- [ ] jsonld.ts graph: WebSite, ProfilePage (mainEntity Person), Person (jobTitle, worksFor WSU, hasOccupation x2 with O*NET codes, hasCredential MD/ABIM/WA/OR/CA, alumniOf x3, knowsAbout, sameAs x4), ScholarlyArticle x3.
- [ ] llms.txt.ts, llms-full.txt.ts, cv.json.ts (JSON Resume), plain.astro, robots.txt.ts (allow all plus explicit AI fetchers, Sitemap line), sitemap.xml.ts (excludes /for/*), OG meta, scripts/og-image.mjs (SVG to sharp to public/og.png).
- [ ] Tests: tests/jsonld.test.ts, tests/jsonresume.test.ts.
- [ ] Commit.

### Task 4: Grounded chat (Stage 4)
- [ ] src/chat/guards.ts plus tests: body schema, length limits, message count, role alternation, origin check, hashIp.
- [ ] src/chat/prompt.ts plus test: rule sentences present, CV markdown present, jdContext appended when given.
- [ ] src/pages/api/chat.ts: prerender false; env via cloudflare:workers; KV rate limit (rl:{hash}:{hourBucket}, TTL 3600, fail closed); Anthropic SDK messages.stream with cache_control on system; SSE text deltas; Q&A log to KV with 90-day TTL.
- [ ] public/chat-widget.js (lazy, vanilla) and chat.astro with noscript mailto fallback, 4 starter questions, experimental label.
- [ ] Verify locally with wrangler dev and .dev.vars; curl; confirm 429 after 10.
- [ ] Commit.

### Task 5: Recruiter routes (Stage 5)
- [ ] src/lib/audiences.ts plus zod schema (exactly 3 bullets, emphasize subset of SECTION_ORDER), two YAML files.
- [ ] for/[slug].astro: banner, reordered sections, disclosure line, noindex nofollow, chat launcher passes data-audience.
- [ ] Worker appends jdContext when slug valid.
- [ ] Tests: tests/audiences.test.ts.
- [ ] Commit.

### Task 6: Analytics, CI guard, docs (Stage 6)
- [ ] Analytics snippet with defer, token constant in site.ts.
- [ ] scripts/verify-outputs.mjs: parse dist outputs, assert canonical facts; wired into npm run build.
- [ ] scripts/scan-dist.mjs: fail on em dash or emoji in visible HTML text; report JS bytes.
- [ ] README with editing, audiences, KV and secret setup, local dev, deploy, .md domain notes.
- [ ] Full build green; Lighthouse on preview; secret scan; final commit.
