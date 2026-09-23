# Showing the build is real: a GitHub and evidence strategy for menon.md

Synthesis of four independent research passes: `docs/reviews/authenticity-agent-a-patterns.md` (broad patterns and hiring-manager sentiment), `-b-github.md` (GitHub mechanisms), `-c-narrative.md` (credible write-up conventions), `-d-safe-disclosure.md` (what's safe to expose from a HIPAA-adjacent business). Every claim below is sourced in those files. Research and documentation only; nothing here has been implemented.

## The core finding, stated once

Every one of the four research passes converged on the same reframe, from different angles: **disclosure of AI-assisted development is not the risk. Vagueness is.** GitLab's own published interview policy requires AI-use disclosure but grades "how you appropriately leverage AI," not whether you used it. A real hiring-manager account on record: a candidate got hired despite suspected AI use in the interview itself, specifically because they could explain their answers under follow-up questions. Meanwhile, general trust in AI-written code is low and dropping (Stack Overflow: 29% of developers trust AI output, down from 40%) — so skepticism should be the expected default, which is exactly why hard, checkable evidence outperforms a confident paragraph.

The test every credible example converges on: **for every claim, could you unscripted answer "why this decision over the alternative" and "how did you know when the AI was wrong"?** If yes, the claim survives regardless of how it's worded. If no, cut it — no amount of specific-sounding language rescues a claim you can't defend live.

## A direct precedent worth citing, not inventing framing from scratch

Dr. Graham Walker, MD (MDCalc/Offcall co-founder), has been featured in an Anthropic-hosted webinar specifically on physicians building with Claude Code. A second, closely comparable case: an April 2026 profile of a radiology resident who built 22 research-automation Claude Code skills with zero programming background, explicit about the lack of formal training, and specific about failures ("the PDF retrieval skill went through three versions"). Both use the same register: name the lack of formal engineering training plainly, once, then immediately pair it with specific decisions and specific failures. That register is the template — not because it's the only option, but because it's already the credibility precedent this exact audience has seen and accepted.

## Concrete GitHub mechanisms, ranked by leverage

1. **Make the menon.md repository itself fully public.** This was independently verified as safe: a scan of the actual repo (`git log`, `git ls-files`, a secret-pattern grep) found two clean commits, no tracked secrets (`.dev.vars` is gitignored and was never tracked; only the placeholder `.dev.vars.example` is tracked), and `cv.yaml` contains only independently-verifiable public facts. This repo is the one piece of real, inspectable, zero-risk evidence available today — it should be the anchor.
2. **Keep the `Co-Authored-By: Claude <noreply@anthropic.com>` commit trailer visible.** This is a real, current Claude Code convention using GitHub's native co-authorship trailer syntax. It is genuinely contested in one narrow context (a closed GitHub issue arguing it complicates US Copyright Office authorship filings), but that dispute is about copyright registration, not hiring credibility — for this purpose it is truthful, low-risk, and functions as a positive "here's exactly what the tool did and when" signal rather than something to hide.
3. **Enable commit signing (GPG or SSH)** so commits carry GitHub's "Verified" badge — cheap, standard, and removes any doubt about who actually authored the history.
4. **Turn on "Include private contributions on my profile"** (GitHub Settings → Public profile → Contributions & Activity). This shows that real commit activity happened in the private DermaVue/SuperHuman repos, as green squares on the public contribution graph, without ever exposing the code itself — the single highest-leverage lever for proving real, sustained work on the systems that can't be open-sourced.
5. **Wire a real CI badge** (tests passing, build status) into the menon.md README — this repo already has a working `npm run build` verification pipeline and a vitest suite; a badge makes that visible at a glance rather than requiring someone to clone and run it.
6. **Link specific commits or PRs in outreach, not a bare repo link.** Verified pattern: linking one specific commit that shows a real decision outperforms a generic "here's my GitHub" link.
7. **For the two regulated products specifically (SuperHuman, DermaVue Clinic OS), do not attempt to make the repos public.** Use the disclosure-tier model below instead.
8. **`workproof`** (`npx workproof`) is a small, purpose-built community tool that generates a code-free, git-metadata-only report (commit share, tenure, cadence) with cryptographic attestation, explicitly designed for "my best work is in private repos, prove it anyway" situations. Worth trying for the DermaVue/SuperHuman repos specifically; flagged as a niche tool, not an established norm, so treat it as a supplement, not a centerpiece.

## What's safe to show, repo by repo

| Repo | Public code? | What can be shown | What must never be shown |
|---|---|---|---|
| **menon.md** (this site) | **Yes — fully public** | Everything: full source, commit history, `verify-outputs.mjs`/`scan-dist.mjs` guards, the AI-authorship trailers themselves as a live example | N/A — nothing sensitive exists in this repo |
| **DermaVue Clinic OS** | No | Architecture description in prose; a redacted screenshot of Priya's escalation logic with fabricated patient names (never real names blurred after the fact — always synthetic before the screenshot is taken); the private-contributions green-square signal; an aggregate commit-frequency chart with no diffs shown | Real patient data or names, real WhatsApp/Instagram message content, actual escalation-rule thresholds if they're considered competitive logic, credentials, client identities |
| **SuperHuman** | No | The autonomy-boundary description already in `cv.yaml`, verbatim; a synthetic-data demo walkthrough (recorded or live, to a specific named recruiter) | Real patient labs/wearable data, the actual GLP-1 eligibility algorithm if it's treated as IP, real clinic operational metrics |
| **DermaVue Commerce** | Possibly, with review | Storefront code is lower-risk than the clinical products; the ingredient-evidence database logic may still be worth keeping private if it's a competitive differentiator | Actual customer data, real order/transaction data |

For a specific serious hiring process that wants to see more than the public evidence allows, the verified pattern is a **time-limited, revocable arrangement**: GitHub Apps with short-lived installation tokens (as short as one hour) or a recorded/live synthetic-data walkthrough to a named individual under a lightweight confidentiality acknowledgment — not open code access, and not a persistent collaborator grant.

## The write-up itself: structure and register

Recommended outline, per the narrative research pass, all grounded in facts already in `cv.yaml` (no new claims invented):

1. **Opening frame** (short): name the tools plainly once — "Claude Code CLI and agentic tooling," already the exact phrase in `cv.yaml` — and state the lack of formal engineering training directly, immediately followed by ownership language ("AI provides the execution; the clinical logic, the autonomy boundary, and the compliance decisions are mine").
2. **One section per product** (SuperHuman, Clinic OS, Commerce, dermavue.com): what it does, one real decision defended with the alternative considered and rejected, one real friction/failure encountered.
3. **A short "how I actually work with the tool" section**: decisions and verification, not prompts — prompts are supporting evidence at most, never the headline.
4. **Two or three mini architecture-decision records** ("decisions I'd defend under questioning") — context, decision, alternative, consequence, in the standard ADR shape.
5. **One mandatory failure or debugging section.** Every credible example found in this research names a real thing that broke and how it was fixed. The natural candidate given his stack is a real incident from the live seven-clinic CRM — something that actually happened, not a hypothetical.
6. **A short close** tying back to the target roles already stated in `cv.yaml`.

The single sentence-level test to apply throughout, per the research: if a sentence could be copy-pasted into anyone else's AI-build write-up without changing a word, cut it. Specificity is the only thing that reads as real.

## What this changes about the redesign audit

This doesn't add a new must-ship feature to `docs/portfolio-audit.md`'s priority list — it's a parallel, mostly off-site workstream (GitHub settings, a build-log write-up, possibly a new page). The one place it does intersect: Section 16 of the audit already recommends `view-source`-friendly documentation of the AI-assisted build process as a genuinely valuable (A-rated) idea. This research substantiates exactly how to do that well, and suggests it's worth more real estate than a single line — potentially its own page or a linked write-up, not just a footnote comment.
