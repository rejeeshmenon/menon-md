# Product

## Register

brand

The site is a personal CV. Design is the product: it is the first thing a recruiter, hiring manager or technical cofounder sees, and it has to read as credible before anyone reads a word.

## Users

1. Recruiters and hiring managers at AI companies and startups (clinical AI evaluation and safety, medical director of clinical AI, AI research faculty, technical cofounder). They open the URL from an application or a LinkedIn message, skim for 30 to 90 seconds on a laptop, and decide whether to forward it.
2. Large language models reading the URL on a recruiter's behalf ("is this person a fit for X?"). They need identity and credentials in the first viewport as plain text, plus structured data.
3. Technical evaluators who look under the hood: view source, the repo, the chat guardrails. They judge craft.

## Product Purpose

One URL that presents Rejeesh Menon, MD as an academic internal medicine physician and clinical AI physician-builder, with every credential checkable at its primary source. Success: a recruiter can verify board certification, licenses, faculty appointment and publications in two clicks, an LLM summarizes the person accurately from the page alone, and the grounded chat never asserts anything the CV does not say.

## Brand Personality

Precise, credible, understated. Three words: verified, calm, exacting. The tone of a printed academic CV from a serious institution, executed with modern web craft. Never salesy, never gimmicky, never "AI-first" in presentation. The AI features are quiet demonstrations of the owner's craft, framed as experimental.

## Anti-references

- AI-generated developer portfolios: gradient hero, glassmorphism cards, emoji bullet points, "passionate about" copy.
- SaaS landing pages: hero metric templates with colored deltas and icons, identical card grids, tracked uppercase eyebrows over every section.
- Over-designed dark "hacker" themes. Dark mode exists only as a system-preference response.
- Any copy with em dashes or marketing verbs (leverage, empower, transform).

## Design Principles

1. Accuracy before flash. Every claim links to its source. Roles are stated exactly (built, designed, led, contributed).
2. Identity front-loaded. Name, degree, title, institution, location and links are the first thing on the page, in plain text, before any design flourish.
3. Paper first. It should print to a clean two-page CV. If a visual device would not survive print, it probably does not belong.
4. One source of truth. Nothing on the screen exists outside cv.yaml.
5. Progressive enhancement. The page is complete with JavaScript off. The chat is the one exception and degrades to a link.

## Accessibility & Inclusion

WCAG 2.2 AA. Body text contrast at least 4.5:1 in both color schemes. Semantic landmarks (header, nav, main, section with labels, address), time elements with datetime, visible focus rings, reduced-motion respected (the only motion is nav highlight and a widget fade). Lighthouse accessibility 95+ on / and /plain. /plain exists specifically for ATS parsers and text browsers.
