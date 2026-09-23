# Safe disclosure of proof-of-work for a physician-builder in regulated health tech

Prepared for: Rejeesh Menon, MD
Scope: public/portfolio disclosure risk for menon.md (this repo) and for the three
regulated/proprietary products referenced in `src/content/cv.yaml` (SuperHuman, DermaVue
Clinic OS, DermaVue Commerce, dermavue.com).

This is research plus first-principles analysis, not legal advice. Where HIPAA specifics
matter for a go/no-go decision, the recommendation is to have DermaVue's counsel or
compliance officer sign off before publishing anything about SuperHuman or Clinic OS beyond
what is already in `cv.yaml` today.

---

## 1. How health-tech engineers and founders showcase PHI-adjacent work

Across the industry the pattern is consistent and has no real exceptions worth noting:

- **Describe the system, don't display the data.** Portfolios that survive scrutiny talk in
  terms of architecture, scale, and decisions ("built a webhook-based lead router across
  three CRMs," "designed the escalation boundary between AI-generated and physician-reviewed
  guidance") rather than screenshots of live product with real records. This is exactly the
  register `cv.yaml` already uses for SuperHuman and Clinic OS (see the `bullets` under those
  two `projects.items` entries) — it states responsibilities and design decisions, not
  workflows or data.
- **Redact or fully synthesize before showing UI.** When a screenshot is unavoidable (for a
  design portfolio, a case study, or an interview), practice is either (a) redact the
  specific fields that carry identity — name, DOB, phone, MRN, address, photo — with solid
  blocks, not blur (blur is reversible), or (b) run the demo against synthetic/seeded data
  (fake patients, fake phone numbers, fake conversation transcripts) so nothing shown was
  ever a real patient interaction. Synthetic-data demo environments are treated as
  industry-standard for pre-sales and portfolio use in health tech specifically because they
  let you show full-fidelity UI with zero disclosure risk.
- **Never show the algorithm as differentiator.** Competitive/clinical logic (e.g. GLP-1
  dosing heuristics, red-flag escalation phrase lists, BMI eligibility thresholds tuned for
  an Indian population) is treated as trade secret / IP, separate from privacy risk. The
  standard move is to describe *that* such logic exists and *who owns it* ("author of the
  clinical logic and the autonomy boundary"), never to publish the logic itself.
- **Certifications and compliance posture substitute for specifics.** SOC 2 / HIPAA-program
  language, BAA-boundary descriptions, and "decision-support scoped outside FDA device
  rules" (all already present in `cv.yaml`) are exactly the vocabulary recruiters and
  technical evaluators at serious AI/health companies expect and can verify the *shape* of
  without needing to see the system.

Sources: [Drata — HIPAA Compliance: How Healthtech Companies Can Remain Compliant](https://drata.com/learn/hipaa/remain-compliant-healthtech), [Syntho — Synthetic demo data for perfect product demos](https://www.syntho.ai/demo-data-for-product-demos/), [Tonic.ai — How Quality Synthetic Data Transforms the Healthcare Industry](https://www.tonic.ai/guides/how-synthetic-healthcare-data-transforms-healthcare-industry), [MDClone — Synthetic Data for Healthcare Innovation](https://www.mdclone.com/wp-content/uploads/2024/02/Synthetic_Data_for_Healthcare_Innovation_by_MDClone.pdf).

## 2. The standard low-risk pattern for describing architecture

The pattern that keeps showing up, and that maps cleanly onto what's already in this repo:

1. **Stack and role, not code.** Name the technologies (NestJS, Twenty CRM, Chatwoot,
   WhatsApp Business API, Next.js/Supabase/Vultr/AWS) and the role played (`Designed and
   built`, `Built and shipped`) — this is free to disclose; it's a fact about the builder,
   not the business. `cv.yaml` already does this for all four products.
2. **Data flow described in words, generic diagram if any.** "Inbound lead integration via
   webhooks with clinic routing and de-duplication" is safe. A diagram of that flow with
   boxes labeled "WhatsApp," "Webhook," "Dedup," "CRM" and no real phone numbers, patient
   names, endpoint URLs, or API keys is equally safe. The line is crossed only when the
   diagram includes production hostnames, real credentials, actual clinic identifiers tied
   to output, or a level of implementation detail that functions as a build manual for a
   competitor.
3. **Decisions and boundaries, not thresholds and rules.** "Owns the autonomy boundary
   between AI-generated guidance and physician sign-off" is safe. The literal GLP-1 dosing
   protocol, the Indian BMI eligibility cutoffs, or Priya's exact forbidden-topic/escalation
   phrase list are not — those are the parts of the product that are actually hard to build
   and are the competitive/clinical-safety IP.
4. **Redacted screenshots with fake identities**, when used at all, are for the *conversation
   UI shape* (e.g., "here is what an escalation looks like to a clinician") — every name,
   phone number, and photo in the frame must be fabricated before the screenshot is taken,
   not blurred after.
5. **Aggregate/anonymized metrics are fine; per-record data is not.** "7 clinics, 100+ staff,
   7,200+ public patient reviews" (already in `cv.yaml`) is aggregate and already public via
   Google reviews — safe. A chart of message volume or lead-conversion rate with no
   underlying identities is safe. A CRM export, a chat transcript, or a single patient's
   record — even with the name changed — is not safe unless it has gone through a real
   Safe-Harbor de-identification pass, because dates, rare conditions, or free-text notes can
   re-identify a person even after the name is removed.

Source on de-identification mechanics: [HIPAA Safe Harbor: 18 identifiers](https://www.accountablehq.com/post/complete-list-of-the-18-hipaa-identifiers-for-de-identification-safe-harbor) — removing "name" alone is not sufficient; dates other than year, geography smaller than a 3-digit ZIP with population thresholds, phone/device/record numbers, and photos all also have to go.

## 3. Should the menon.md repo itself go fully public? — Verified against the actual repo

**Verification performed** (not asserted — commands run against the live repo at
`C:\Code\REJEESH-CV BUILD`):

- `git log --oneline`: two commits only —
  `e0a58f7 feat: scaffold Astro 7 + Cloudflare Workers project and typed cv.yaml content layer`
  and `ae686f5 feat: human CV page, machine-readable layer, grounded chat, recruiter routes, CI guard, docs`.
  Small, clean history; nothing to silently carry forward from abandoned experiments.
- `git ls-files`: full tracked file list confirmed. Notably, `.dev.vars` (the real local
  secrets file) is **not** in the tracked list — only `.dev.vars.example` is tracked, and its
  key value is the literal placeholder string `sk-ant-REPLACE_ME`, not a real key.
- `git check-ignore -v .dev.vars` confirms `.dev.vars` is excluded by `.gitignore` line 2 and
  has never been committed (consistent with only two commits existing and both being feature
  commits, not "oops, remove secret" commits).
- `git grep -iE "sk-ant|api[_-]?key|secret|password|BEGIN (RSA|PRIVATE)"` across tracked
  files returned only: comments instructing *how* to set secrets via `wrangler secret put`
  (README.md, wrangler.jsonc, docs/superpowers/*), the variable *name*
  `ANTHROPIC_API_KEY` in `src/pages/api/chat.ts` (an env var reference, not a value), an
  unrelated `@azure/keyvault-secrets` dependency string inside `package-lock.json`, and the
  word "secretion" in a real, already-published journal citation in `cv.yaml`
  (`Yin L... Glucose stimulates calcium-activated chloride secretion...`). No actual key,
  token, password, or private key material appears anywhere in tracked history.
- `wrangler.jsonc` contains one identifier of note: a Cloudflare KV namespace ID
  (`0b9fba301754443796b3ddbacad64d66`). This is an account-scoped resource identifier, not a
  credential — it cannot be used to read or write the namespace without the Cloudflare
  account's own auth (API token/session), which is never in the repo. Low sensitivity, but if
  Rejeesh wants zero residue he can rotate/recreate the KV namespace after making the repo
  public, purely as hygiene.
- `.gitignore` correctly excludes `.dev.vars*` (except the example), `.env*` (except the
  example), build output, and — notably — several **local strategy/reference documents**
  (`compass_artifact_*.md`, `Menon.md_ 2026 CV Website Strategy.md`, `AI CV Website
  Development 2026.md`, `*.docx`, `*.pdf`) that exist on disk but are correctly never tracked.
- `src/content/cv.yaml` contains only facts that are independently, publicly verifiable
  already: WSU faculty profile, Google Scholar, LinkedIn, license verification URLs for WA/OR/CA
  medical boards, ABIM board certification, ECFMG certification, and DOIs/PMIDs for three
  published, already-public papers. Nothing in it is a patient name, a clinic-internal
  metric that isn't already public (7,200+ reviews is a public Google number), or a
  proprietary algorithm. The `/api/chat` system prompt (`src/chat/prompt.ts`) is itself
  designed to refuse anything not literally in this file, so there is no exposure surface via
  the chat feature beyond what's already public in the YAML.
- The only non-trivial thing this repo actually runs in production is `POST /api/chat`,
  a Cloudflare Worker calling the Anthropic API with a server-held secret and KV-based
  rate limiting/logging (visitor questions + a salted, rotating IP hash, 90-day TTL) —
  described candidly in the README. That's an operational detail about *this website*, not
  about DermaVue or SuperHuman, and it's already the kind of thing a technical evaluator at
  an AI company would want to see engineered correctly.

**Verdict: yes, safe to make this specific repository fully public**, with two small, cheap
hardening steps first (neither is a reason to delay, both are 5-minute tasks):

1. Rotate/recreate the Cloudflare KV namespace ID in `wrangler.jsonc` after going public, or
   accept it as-is (it is not independently exploitable) — treat as optional hygiene, not a
   blocker.
2. Do a final `git log -p | grep -iE "sk-ant|BEGIN|password"` pass (or `gitleaks`/`trufflehog`
   if available) right before flipping the repo to public, as a second, independent
   confirmation beyond this review — cheap insurance against anything introduced in a future
   commit before publish day.

This repo is in fact close to the *ideal* shape of a "safe disclosure" artifact: it is the
CV site itself, its content is by definition meant to be public (a CV), its only backend
capability is scoped and guarded, and its `docs/superpowers/` design docs even show the
review discipline used to build it (secret-scan-before-commit was a stated build requirement,
and verification above confirms it held).

## 4. Safe-disclosure tiers for the two regulated/proprietary products

Neither SuperHuman nor DermaVue Clinic OS can be open-sourced — they are live systems
handling PHI-adjacent data under a BAA, and the actual codebases carry both privacy risk and
competitive-IP risk that the menon.md repo does not have. The applicable framework, reasoned
from HIPAA Safe Harbor practice, standard trade-secret handling, and how the CV site already
talks about them:

**Tier 1 — Always safe to state publicly (already in `cv.yaml`, and should stay there):**
stack names, role verbs (`Designed and built`, `Built and shipped`), status/scale statements
that are independently public or purely aggregate (7 clinics, 100+ staff, live since 2025),
named compliance postures ("HIPAA-conscious architecture," "BAA-covered data boundary,"
"decision-support scoping outside FDA device rules"), and ownership statements about
decisions ("author of the clinical logic and the autonomy boundary").

**Tier 2 — Safe only after redaction/synthesis, and only worth doing for a serious,
qualified evaluator (a written case study, an interview whiteboard session, or a
recruiter-specific page under `/for/<slug>`):** a genericized architecture diagram of the
webhook/CRM/dedup flow with no real endpoints; a screenshot of the Priya chat interface
where every name, phone number, and clinic identifier has been swapped for fabricated ones
*before* the screenshot is taken (never blurred after); a description in prose of what
"forbidden clinical topics" and "red-flag escalation" mean structurally (e.g., "the bot
declines to answer X and instead routes to a human within Y minutes") without the actual
phrase list; an anonymized commit-frequency or release-cadence chart with no diff content,
useful as "evidence of sustained engineering velocity" without revealing what changed.

**Tier 3 — Never share, under any framing, with any recruiter:** real patient names,
photos, phone numbers, or any of the 18 HIPAA Safe Harbor identifiers, even redacted after
the fact (redaction of a live screenshot is reversible/incomplete and is not an accepted
de-identification method — only synthetic-before-capture or a proper Safe Harbor/expert
determination pass is); production credentials, API keys, database connection strings, or
infrastructure hostnames; the actual clinical decision logic (GLP-1 dosing rules, BMI
eligibility thresholds, the literal escalation rule set) — this is both a privacy exposure
vector and the competitive IP of the clinic business; real client/patient names or any
data export, however small, from Twenty CRM, Chatwoot, or the SuperHuman pilot; anything that
would require DermaVue's or SuperHuman's BAA counterparties to be notified as a disclosure
event.

## 5. Is NDA-lite / time-limited private access to recruiters a real pattern?

Yes — this is an established, named gap in current tooling, not a hypothetical:

- The default GitHub answer (add the recruiter as a repo collaborator) is considered
  overkill because it grants persistent read/write-capable account access rather than
  scoped, time-boxed, revocable viewing.
- Purpose-built tools exist specifically for this gap (e.g. GitShare) that generate
  shareable, optionally password-protected, optionally expiring links to a private repo's
  contents, viewable without the recipient needing a GitHub account of their own — explicitly
  marketed at exactly this "share NDA'd or unpublished work with a recruiter" scenario.
- GitHub's own primitives support the underlying access-control need even without a
  third-party tool: a private repo can be shared with a specific person as a **read-only
  collaborator**, and that access can be revoked immediately after the interview process
  ends. For finer-grained, auto-expiring access, a GitHub App issuing short-lived
  installation tokens (as short as one hour, revocable via API) is the documented
  higher-control alternative to a bare deploy key, which has no built-in expiry.
- For DermaVue Clinic OS / SuperHuman specifically, the practical equivalent of
  "NDA-lite" is not code access at all (the code is the least useful thing to show a
  non-engineer recruiter, and the most legally sensitive thing to show anyone) — it is a
  **private, time-limited walkthrough**: a recorded screen-share or live demo against the
  synthetic-data pilot environment already described in `cv.yaml` for SuperHuman
  ("synthetic-data development" is explicitly named as a compliance decision there), shown
  live so nothing persists, to a named individual at a named company, optionally after a
  one-paragraph mutual confidentiality acknowledgment by email — which is lighter-weight than
  a formal NDA but establishes the same "don't redistribute what you're about to see" intent.

Sources: [GitShare — How to Share Private Repos with Multiple Recruiters](https://gitshare.me/blog/how-to-share-private-repos-with-multiple-recruiters-without-the-access-control-headache), [GitHub Docs — Managing deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys), [GitHub — Restricting deploy keys in your organization](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/restricting-deploy-keys-in-your-organization).

---

## Recommended disclosure tiers for Rejeesh, repo by repo

| Product (per `cv.yaml`) | Fully public | Redacted / synthetic-only, serious evaluators | Never show anyone outside the BAA | Reasoning tied to `cv.yaml` facts |
|---|---|---|---|---|
| **menon.md (this CV site)** | The entire repository, as-is, after the two 5-minute hygiene steps in Section 3 (optional KV rotation, final secret-scan pass). | N/A — nothing here needs redaction. | N/A — no PHI, no client data, no proprietary business logic exists in this repo (verified via `git log`, `git ls-files`, `git grep`, `.gitignore`, and a full read of `cv.yaml`). | The site's entire purpose is public CV facts already independently verifiable (WSU, Scholar, LinkedIn, state license lookups, DOIs). Its only server code is a scoped, guarded, already-documented chat endpoint with the real API key correctly gitignored and never committed. |
| **DermaVue Clinic OS** | Stack list, role (`Built and shipped`), scale statement ("Live across seven clinics, 2025 to present," "100+ staff"), the existing three `bullets` describing capability at the level already written (patient messaging across three channels into one CRM; designed "Priya" including the *existence* of forbidden-topic and escalation rules; webhook-based lead routing with dedup). | A genericized architecture diagram (WhatsApp/IG/Messenger to Priya to escalation-or-CRM, no real endpoints); a screenshot of the Priya conversation UI built entirely from fabricated names/numbers, captured fresh for this purpose (never a redacted real screenshot); a prose description of *how* escalation decisions get made (thresholds/timing categories, not the literal phrase list); an anonymized release-cadence chart. Share only under Tier-2 handling (private page, or NDA-lite/time-limited access per Section 5). | Any real patient or lead name, phone number, or WhatsApp/Instagram/Messenger conversation content; the actual forbidden-topic and red-flag phrase lists (this is both the clinical-safety control and the IP); Twenty CRM or Chatwoot data exports of any kind; production credentials, webhook secrets, or clinic-internal routing/dedup rules at implementation level. | `cv.yaml` already states this is a live 7-clinic system integrating three real messaging channels for real patients — the escalation logic is a patient-safety control (mishandling it is a clinical risk, not just a confidentiality one), and clinic routing/dedup logic plus the CRM integration are the operational core of a live business that competitors could copy. |
| **SuperHuman** | Stack list, role (`Designed and built`), status ("In pilot, 2026"), the existing `bullets` at their current level of abstraction (consolidates labs/wearables/prescription history; owns the autonomy boundary; every guidance output checked against source data during pilot; compliance decisions named: BAA-covered boundary, synthetic-data development, decision-support scoped outside FDA device rules; piloting inside DermaVue). | A synthetic-data live demo or recorded walkthrough of the guidance UI (this is explicitly already the development approach per `cv.yaml`, so it requires no new redaction work — just showing the existing synthetic environment to a named evaluator); a description of the autonomy-boundary decision framework in the abstract (what classes of decisions the tool can surface vs. what always requires physician sign-off) without the literal clinical/dosing rules; an architecture diagram of the labs/wearable/prescription ingestion pipeline with no real lab values or device IDs. | The literal GLP-1 dosing or metabolic protocol logic and the India-specific BMI eligibility thresholds (stated in `ventures` as a real, currently-run clinical program — this is both patient-safety-sensitive and the clinical IP of the SuperHuman Program); any real lab result, wearable data point, or prescription history, synthetic-labeled or not, that could be traced to the pilot's actual participants; anything that would look like an FDA-regulated clinical claim, since the whole point of the stated compliance posture is staying outside device-rule scope — publishing algorithm specifics could itself undermine that scoping argument. | `cv.yaml` states SuperHuman is "in pilot" with real physicians reviewing real guidance against real source data, and separately that the SuperHuman Program applies "Indian BMI eligibility thresholds" as an actual live clinical protocol — the dosing/eligibility logic is simultaneously a regulatory-scoping question (staying outside FDA device rules depends on how the tool is described and constrained) and the clinic group's competitive differentiation in metabolic care. |
| **DermaVue Commerce** | Everything — stack, role, status, the ingredient-database bullet. It is a public storefront by design. | N/A in practice, though avoid highlighting unpublished sales/conversion figures if not already public. | Backend admin credentials, supplier costs/margins, or unpublished sales data (not currently described in `cv.yaml`, and shouldn't be added). | This is a live public e-commerce site; everything a recruiter could see by visiting it is already public. The only new risk would be internal business metrics not meant for competitors, which `cv.yaml` correctly does not include. |
| **dermavue.com (public web platform)** | Everything currently in `cv.yaml` — it is a live public site already indexed and reviewed by search engines. | N/A. | Backend CMS credentials, unpublished SEO/indexing strategy documents if they contain competitive keyword/ranking data not meant for public reuse (the `dermavue-seo-indexing` tooling referenced in project config, not the public site itself). | Public-facing by definition; the only exposure risk is infrastructure-level (CMS access), not content-level. |

**Bottom line:** the menon.md repository is safe to make fully public today as the primary
proof-of-work artifact — it is verified clean of secrets and PHI and its only real content
is already-public biography and research. For DermaVue Clinic OS and SuperHuman, keep the
public claim at the level `cv.yaml` already uses (stack, role, scale, named compliance
decisions), and reserve anything more concrete — diagrams, redacted/synthetic screenshots,
live synthetic-data walkthroughs — for a private, time-limited channel (a recruiter-specific
`/for/<slug>` page, a scoped/expiring GitHub share, or a live screen-share under a one-
paragraph confidentiality acknowledgment) offered only to a named individual at a named
company, late in a real hiring process.
