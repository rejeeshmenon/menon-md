# Authenticity Agent B — GitHub Provenance Research

**Date:** 2026-09-22
**Scope:** Live web research (not recalled from training) into current (2025–2026) GitHub mechanisms Rejeesh Menon, MD could use to demonstrate real engineering provenance — given that his most impressive work (DermaVue Clinic OS, SuperHuman) is proprietary/HIPAA-adjacent and cannot be open-sourced, while his CV site repo (`C:\Code\REJEESH-CV BUILD`, local, git-initialized, no remote yet) can be made fully public with zero risk.

Every claim below is sourced from a live search or fetch performed during this task. Where a claim could not be verified, it is flagged explicitly as **UNVERIFIED**.

---

## 1. Features that prove authorship/activity on a repo you make PUBLIC

These all apply directly to the CV site once it's pushed to GitHub and made public.

### 1.1 Commit signature verification (GPG / SSH / S/MIME, and Sigstore)
- GitHub marks commits/tags as **"Verified"** or **"Partially verified"** when they carry a cryptographically valid GPG, SSH, or S/MIME signature. ([GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification))
- Once a signature is verified at push time, GitHub stores an immutable verification record alongside the commit — it stays "Verified" even if the signing key is later rotated or revoked. ([GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification))
- **Sigstore/keyless signing (gitsign)** is also supported for signature verification, but as of this research **GitHub's web UI does NOT show the green "Verified" badge for gitsign/Fulcio-based commits the way it does for GPG** — there's no first-class UI badge for keyless signatures yet. ([SumGuy's Ramblings](https://sumguy.com/sigstore-gitsign-signed-commits/), [Chainguard Academy](https://edu.chainguard.dev/chainguard/guardener/github/commit-verification/))
- **Practical implication for Rejeesh:** use plain GPG or SSH commit signing (SSH signing is the simplest — same key type as SSH auth) on the CV repo. Sigstore is not worth the complexity here since it doesn't render a badge on GitHub.com today.

### 1.2 Contribution graph / heatmap
- The green square contribution graph is native to every GitHub public profile and updates automatically from public-repo activity (commits, PRs, issues, reviews). No special setup needed beyond pushing real commits with an email tied to the GitHub account.
- Third-party embeds exist to make it more visually prominent inside a README (e.g., `github-readme-activity-graph`, Pac-Man/snake-eating-contributions GitHub Actions that animate the graph). These are cosmetic add-ons on top of the same underlying data — not a new authenticity signal, just presentation. ([github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph), [dev.to: snake-eating contribution graph](https://dev.to/mishmanners/how-to-enable-github-actions-on-your-profile-readme-for-a-contribution-graph-4l66))
- **Caveat:** a hiring manager who has seen these "cute" contribution-graph gimmicks (snake, Pac-Man) before may read them as decorative rather than substantive — use sparingly if at all; the plain, real graph is the credible artifact, not the animation.

### 1.3 Repo Insights (Pulse, Contributors, Commits, Code frequency)
- GitHub's native **Insights** tab on any repo (public or private, visible to those with access) provides:
  - **Pulse** — summary of recent activity.
  - **Contributors** graph — additions/deletions per contributor over time.
  - **Commits** graph — commit volume by week for the past year, plus by day-of-week.
  - **Code frequency** — weekly additions/deletions across the repo's whole history.
  - These are only available for repos under 10,000 commits, and GitHub recently (per the 2023 changelog, still current in 2025–2026) rebuilt them as SVG-based charts with CSV/PNG export and legend-based series toggling. ([GitHub Docs](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/analyzing-changes-to-a-repositorys-content), [GitHub Changelog](https://github.blog/changelog/2023-11-29-upcoming-changes-to-repository-insights/))
- **Practical implication:** once the CV repo is public, its Insights tab is visible to anyone — this is a legitimate, unfakeable (short of history rewriting) chart of real work-over-time. Worth linking directly (`github.com/<user>/<repo>/graphs/commit-activity`) from a portfolio page or CV, since most people never click a repo's Insights tab on their own.

### 1.4 README badges (CI status, coverage, deploy)
- **shields.io** is the standard badge service. Current (verified via direct fetch) syntax for a GitHub Actions workflow status badge:
  ```
  https://img.shields.io/github/actions/workflow/status/{user}/{repo}/{workflow-file}.yml?branch=main
  ```
  Markdown:
  ```markdown
  ![Build](https://img.shields.io/github/actions/workflow/status/rejeesh/cv-site/deploy.yml?branch=main)
  ```
  ([shields.io GitHub Actions Workflow Status](https://shields.io/badges/git-hub-actions-workflow-status))
- Coverage badges pull from Codecov (`img.shields.io/codecov/c/github/user/repo`) or Coveralls (`img.shields.io/coveralls/github/user/repo`). ([badges/shields on GitHub](https://github.com/badges/shields))
- A "dynamic badges" GitHub Action can also surface custom JSON-driven badges (e.g., test count, deploy timestamp) that update on every CI run. ([Schneegans/dynamic-badges-action](https://github.com/Schneegans/dynamic-badges-action/))
- **Practical implication:** wire up a real GitHub Actions workflow on the CV site (Astro build + deploy) and drop one honest "Build" badge and, if tests exist, one "Tests" badge at the top of the README. Do not add a coverage badge unless there is real test coverage to report — a badge with no underlying substance is worse than no badge (see Section 5, "avoid overclaiming").

---

## 2. Showing private-repo activity WITHOUT exposing proprietary code

This is the mechanism set relevant to DermaVue Clinic OS and SuperHuman, which stay private.

### 2.1 "Include private contributions on my profile" — the key native GitHub setting
- Location: **Settings → Public profile → Contributions & Activity → "Include private contributions on my profile."**
- When enabled, GitHub's public contribution graph counts commits, PRs, issues, and code-review activity made in private repositories — but shows **only that a contribution happened on a given day**. It does **not** reveal the repo name, commit message, diff, or any code. ([GitHub Community Discussion #188892](https://github.com/orgs/community/discussions/188892), [Commit History: private contributions](https://commit-history.com/-/metrics/private-contributions))
- This setting is **opt-in and off by default** — many developers with heavy private-repo activity show a sparse-looking public graph simply because they never flipped this toggle. ([GitHub Community Discussion #51677](https://github.com/orgs/community/discussions/51677))
- **Important limitation surfaced in research:** GitHub only counts private contributions to repos **you don't personally own** (i.e., org repos, or repos owned by someone else) toward this setting in some documented cases — commits to your own personal private repos have historically had inconsistent counting behavior reported by users in community threads. This is a real point of confusion in GitHub's own community forums and should be **treated as partially unverified** — Rejeesh should test it directly: flip the setting, make a commit to a private repo he owns, and check the next day whether the square appears.
- **Practical implication:** This is the single highest-leverage, zero-effort authenticity signal available for DermaVue/SuperHuman. If not already enabled, turning it on immediately makes years of private DermaVue/SuperHuman commit history visible as green squares on the public profile — proving sustained, real engineering cadence without exposing a single line of patient-adjacent code.

### 2.2 Read-only collaborator access
- **Verified limitation:** on GitHub Free (personal-account-owned private repos), you **cannot** grant a collaborator "read-only" — collaborators on a personal private repo get read/write by default; restricting to read-only requires **GitHub Team or Enterprise Cloud**, or moving the repo into an **Organization** (where fine-grained roles, including read-only, are available on paid org plans). ([GitHub Community Discussion #160042](https://github.com/orgs/community/discussions/160042), [GitHub Docs: permission levels](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository))
- **Practical implication:** if Rejeesh wants a specific hiring manager or recruiter to actually browse DermaVue's private code (not just prove activity), the clean path is: move the org's repos under a GitHub **Organization** (DermaVue likely should have one anyway for team/billing reasons), and grant a named individual a **read-only Team/Enterprise** role scoped to one repo, with an expiry reminder to revoke after the interview loop. This is a real, supported mechanism — not a workaround.
- Alternative not requiring a paid plan: **deploy keys** (SSH keys without write access) — but these are designed for CI/CD pull access, not human browsing, and are clunkier for a recruiter to use than a normal collaborator invite.

### 2.3 "Architecture-only" public mirror / sanitized case-study repo
- No single official GitHub feature exists for this — it is a **practiced pattern**, not a product feature, so it must be flagged as pattern-level rather than platform-level evidence.
- Verified real-world precedent: a solutions architect publicly documented open-sourcing a "Solutions Architect Portfolio" of **sanitized case studies** from real client work, explicitly stating the rule "Sanitize aggressively: replace real names and sensitive data with neutral placeholders." ([dev.to — I Open-Sourced My Solutions Architect Portfolio](https://dev.to/aws-builders/i-open-sourced-my-solutions-architect-portfolio-real-world-case-studies-1i0c))
- **Practical implication:** for DermaVue Clinic OS and SuperHuman, the credible version of this is a **separate, purpose-built public repo** (not a literal git-history mirror, which risks leaking real commit content/diffs even after redaction) containing: system architecture diagrams, the tech-stack decision rationale, anonymized data-flow descriptions ("lead → webhook → dedup → CRM," no real clinic names/PHI/API keys), and a written case study of specific engineering decisions (e.g., HIPAA-conscious data segregation choices, dedup logic design). This is safer than trying to strip a real git history, which is fragile against forgotten secrets/PII in old commits.

### 2.4 Redacted git log / verifiable engineering report — a real, existing tool class
- Verified via direct fetch: a purpose-built tool, **`workproof`** (`npx workproof`, multiple GitHub forks e.g. `shivam-070208/workproof`, `Bubblegunn/workproof`), exists specifically for this use case. Its own description: **"Your best work is in private repos. Prove it anyway. A verifiable engineering report from git, without showing code."** It was built for a UK Global Talent visa application, where private-repo work needed objective evidence. ([workproof on GitHub](https://github.com/shivam-070208/workproof))
- Mechanism (verified from the README): it reads only git **metadata** — `git log --numstat`, `git blame -w -M` — never file contents. It outputs a `workproof-report.md` (human-readable, pastable into a portfolio/résumé) and a `workproof-report.json` (machine-verifiable), with metrics like tenure window, share of commits, commit cadence, "surviving lines" (code still alive at HEAD), file footprint, and AI-assisted-work indicators. It supports three verification tiers: `check` (hash validation from the file alone), `verify` (a reviewer re-runs it against the actual repo to confirm reproducibility), and `attest` (cryptographic signing via SSH keys or Sigstore). It explicitly documents its own gameable metrics and mitigations (e.g., excludes `linguist-generated` files to stop machine-generated-line padding).
- **This is a genuinely novel, directly-on-point finding for Rejeesh's situation** — it is designed exactly for "prove years of real private-repo engineering without exposing patient-adjacent code." **Caveat:** this is a small, community-maintained tool (not a GitHub product), so treat it as "worth trying," not as an established industry norm a hiring manager will already recognize — the report should be framed in plain English regardless of whether the tool is used, since the reviewer may never have heard of `workproof` itself.

### 2.5 GitHub Codespaces / recorded terminal sessions as an alternate proof channel
- GitHub itself has publicly documented **using Codespaces for technical interviews** — pairing candidates in a live, ephemeral cloud dev environment as an alternative to whiteboard coding. ([GitHub Engineering Blog — Technical interviews via Codespaces](https://github.blog/engineering/engineering-principles/technical-interviews-via-codespaces/))
- **Asciinema** is a real, actively maintained terminal-session recorder that captures a lightweight, replayable, and even copy-pasteable text stream (not a heavyweight video) of a real coding session, publishable to asciinema.org or embeddable in a webpage. ([asciinema.org](https://asciinema.org/), [asciinema GitHub](https://github.com/asciinema/asciinema))
- **Practical implication:** neither of these is a "proof of past work" mechanism on its own — Codespaces-for-interviews is about live evaluation, and asciinema records new sessions going forward. Their relevance to Rejeesh is **forward-looking**: he could record a short, real asciinema session of himself (with Claude Code) building or debugging a real feature on the CV site or on a sanitized DermaVue architecture repo, and link that alongside the repo as "here is unedited, real terminal work," which is a stronger, harder-to-fake artifact than a screenshot.

---

## 3. Does `Co-Authored-By: Claude <noreply@anthropic.com>` count as real, recognized evidence?

**Verified: yes, this is a real, current, and widely recognized git convention — but it is also actively contested, and Rejeesh should know both sides before leaning on it.**

- Claude Code adds `Co-Authored-By: Claude <noreply@anthropic.com>` as a git **trailer** to commits by default, and a "Generated with Claude Code" line plus footer to PR descriptions it opens. GitHub natively recognizes the `Co-authored-by:` trailer format (this convention predates AI tools — it's the same mechanism used for human pair-programming co-authorship) and renders it in the commit's "co-authors" UI. ([DeployHQ — Claude Code Git Guide](https://www.deployhq.com/blog/how-to-use-git-with-claude-code-understanding-the-co-authored-by-attribution), [Crash Override — Attributing AI-Authored Commits in Git](https://crashoverride.com/resources/knowledge-base/code-ownership/attributing-ai-commits-git))
- Different AI coding tools handle this differently: **Claude Code** adds the `Co-Authored-By` trailer by default; **Aider** appends `(aider)` to the author name and lists the model as co-author; **GitHub Copilot, OpenAI Codex CLI, and Cursor do not add any automatic attribution.** This makes Claude Code's convention comparatively unusual/more transparent among competitors, which cuts in Rejeesh's favor as a "look, I disclose AI use" signal.
- **The controversy (verified via GitHub Issue #66602 on anthropics/claude-code):** a filed bug report argues the trailer is legally imprecise — the **U.S. Copyright Office's** guidance ("Copyright Registration Guidance: Works Containing Material Generated by Artificial Intelligence," 88 Fed. Reg. 16190, Mar. 16, 2023) states applicants "should not list an AI technology or the company that provided it as an author or co-author simply because they used it when creating their work." The issue was **closed as "not planned"/duplicate**, with no visible official Anthropic rebuttal in the thread — meaning the default behavior stands, but the critique is a live, documented point of dispute, not settled consensus.
- Settings exist to customize or disable it: Claude Code's `attribution` setting (JSON, with separate `commit` and `pr` keys) and `includeCoAuthoredBy: false` let a user turn the trailer off or replace it with custom text (e.g., an `AI-Assisted: true` trailer some teams prefer, per one source found).
- **Interpretation for a hiring manager, based on research (not fabricated):** among engineers, `Co-Authored-By: <tool>` is legible as "this developer used an AI pair programmer and left the paper trail intact rather than hiding it" — several sources frame this explicitly as a positive signal of honest, auditable process (the git history literally shows what was AI-touched vs. not, useful for "post-incident analysis" per one source). It is **not** a red flag among technically literate reviewers; it is closer to "shows their work." The legal/copyright argument against it is about formal authorship attribution on copyright filings, not about whether it's suspicious in a hiring context — these are different concerns, and conflating them would be a mistake in how Rejeesh frames it.
- **Recommendation:** keep the trailer on for the CV site repo (it is truthful and low-risk there), and use it as a talking point: "every commit shows exactly which parts were AI-assisted and which were my own direction/review" — turning a potential objection ("did the AI write this?") into a demonstrated, git-native answer.

---

## 4. "Build with AI, show your work" — public repo as a hiring-pitch artifact

- Verified pattern: outreach or portfolio material that references **a specific pull request or a specific design decision in a specific repo performs meaningfully better than generic outreach** — i.e., "look at PR #14, here's the tradeoff I made" beats "I have a GitHub, here's the link." ([SOLTECH — What Do Hiring Managers Actually Look For in a GitHub Portfolio](https://soltech.net/what-do-hiring-managers-actually-look-for-in-a-github-portfolio/))
- Verified: hiring managers explicitly weigh **commit history authenticity** — "a messy but real commit history is more convincing than a suspiciously clean one," because it shows an incremental, timestamped record of how the work actually happened (as opposed to a single squashed "initial commit" that looks assembled the night before an interview). ([dev.to — Developer Portfolio Checklist](https://dev.to/_d7eb1c1703182e3ce1782/developer-portfolio-checklist-20-things-hiring-managers-look-for-388p))
- Reviewers reportedly look for: what's pinned at the top of the profile, whether the contribution graph shows a real pattern vs. a single spike, whether READMEs explain anything, and whether commit history reads as a genuine working process. (Same source as above.)
- **Practical implication — concrete artifact types Rejeesh can point to directly in a pitch:**
  1. A specific commit URL (`github.com/user/repo/commit/<sha>`) showing a meaningful refactor or bug fix, with a clear commit message.
  2. A specific PR (even a self-merged one on a solo repo) with a description explaining the "why," not just the "what" — this is the artifact type research shows performs best in outreach.
  3. A link straight to the repo's Insights → Commits graph (Section 1.3) as objective, third-party-rendered (i.e., not self-reported) proof of sustained cadence.
  4. One or two test files or a small CI workflow file linked directly, as concrete "this isn't just a demo, there's rigor" evidence.
- **Framing caution grounded in research:** the goal per multiple sources is quality and narrative (problem → decisions → tradeoffs → outcome) over volume — one well-documented repo beats five empty ones.

---

## 5. Best-practice README/repo structure for a small, real, technically substantive personal project read by a technical hiring manager

Verified findings converge on the following, cited structure and tone guidance:

**Structure (sections that recur across sources):**
1. One-paragraph overview — what the project is, and *why* it was built (what real problem it solves), not a marketing tagline. ([Refonte Learning](https://www.refontelearning.com/blog/enhancing-your-professional-profile-building-and-showcasing-full-stack-projects-on-github))
2. Tech stack, stated plainly (framework, language, deploy target).
3. Live demo link and/or screenshot — reviewers skim, they don't run a dev server. ([Resumly.ai — How to Organize GitHub Repos for Recruiter Review](https://www.resumly.ai/blog/how-to-organize-github-repos-for-recruiter-review))
4. Setup/run instructions — proves it's a real, buildable project, not just static text.
5. A short "decisions/tradeoffs" or case-study section: the problem addressed, what was actually done, technologies/process applied, any measurable outcome, and what was learned or traded off. This is the section hiring managers say they actually stop and read. ([opendoorscareers — How to Write a Strong Case Study for Your Portfolio](https://blog.opendoorscareers.com/p/how-to-write-a-strong-case-study-for-your-portfolio-in-2025-a14b))
6. CI/build status badge(s) if genuinely wired up (Section 1.4) — small, honest, at the top.

**Tone / what NOT to include (synthesized from multiple sources, consistent across them):**
- Do not use marketing language ("revolutionary," "cutting-edge," "game-changing") — hiring managers explicitly read this as a negative signal versus plain engineering description.
- Do not overclaim scale or impact that can't be substantiated by the repo itself — a personal CV site should be described as a personal CV site, not inflated.
- Do not fabricate metrics (fake user counts, fake "production" claims) — since the CV repo genuinely has zero PHI/business-secret risk, the correct move is full, plain honesty: "this is my personal site, built solo with Claude Code as a pair-programming tool, deployed via GitHub Actions to [host]."
- Do not paper over AI-assisted authorship — sources indicate transparency about tool use (Section 3) reads better than silence, given the git trailers already disclose it.
- Prefer **quality over quantity**: 4–6 well-documented repos beat a large number of empty ones. ([Hakia — Developer Portfolio Guide 2026](https://hakia.com/skills/building-portfolio/))
- Keep it scannable: hiring managers skim, they don't read case studies end-to-end — front-load the one or two sentences that matter (problem, decision, outcome) rather than burying them in prose.

---

## Concrete GitHub setup steps Rejeesh could actually take this week

All of these are grounded in the verified findings above; nothing here is speculative beyond what was confirmed.

1. **Push the CV site repo to GitHub and make it public.** It has zero PHI/business-secret risk per the task brief — this is the one repo where "just make it public" is the entire strategy. Use a real remote (`git remote add origin ...`, `git push -u origin main`).
2. **Turn on commit signing for the CV repo.** Use SSH or GPG commit signing (not Sigstore/gitsign, since GitHub's UI doesn't render a "Verified" badge for it yet — Section 1.1). This gets the green "Verified" badge on every commit going forward with minimal setup (`git config commit.gpgsign true` or SSH signing via `gpg.format ssh`).
3. **Flip on "Include private contributions on my profile"** in GitHub Settings → Public profile → Contributions & Activity. This is the single highest-leverage action: it should immediately backfill the public contribution graph with (anonymized) squares from years of DermaVue/SuperHuman private-repo work, at zero disclosure risk. Verify it actually populates within a day or two of a new private commit — community reports on this setting's exact scope are inconsistent (Section 2.1), so confirm empirically rather than assuming.
4. **Wire up a real GitHub Actions workflow on the CV repo** (build + deploy for the Astro site) and add one honest shields.io badge to the README: `https://img.shields.io/github/actions/workflow/status/<user>/<repo>/<workflow-file>.yml?branch=main`. Do not add a coverage badge unless real test coverage exists.
5. **Rewrite the CV repo's README** using the structure in Section 5: one-paragraph problem/purpose statement, tech stack, live link, setup instructions, and a short "how this was built" section that plainly states Claude Code was used as a pair-programming tool — leaning into the git trailer disclosure rather than avoiding it (Section 3).
6. **Keep the `Co-Authored-By: Claude <noreply@anthropic.com>` trailer on** for the CV repo's commits (it already appears by default) and reference it explicitly in the README or in interview conversation as "the git history shows exactly which commits were AI-paired." Do not strip it out purely on the copyright-office controversy (Section 3) — that argument concerns copyright filings, not hiring-context credibility.
7. **Link a specific commit or PR from the CV repo directly in outreach/resume**, not just the repo root — research shows this performs better than a bare repo link (Section 4). Pick one commit that shows a real, non-trivial decision (e.g., a refactor, a fix, a deploy-pipeline change) and link its permalink URL.
8. **Link the repo's Insights → Commits graph directly** (`github.com/<user>/<repo>/graphs/commit-activity`) somewhere in the CV or portfolio page as an objective, GitHub-rendered (not self-reported) chart of real activity over time (Section 1.3).
9. **For DermaVue/SuperHuman (private, stays private):**
   a. If a GitHub Organization doesn't already exist for DermaVue's repos, consider creating one and moving relevant private repos into it — this unlocks true **read-only** collaborator roles (not available on personal-account private repos under GitHub Free) for the rare case a specific recruiter needs actual code access under NDA (Section 2.2).
   b. Build one small, **separate, purpose-written public repo** — not a redacted mirror of the real history — containing architecture diagrams, a written case study of specific engineering decisions (e.g., HIPAA-conscious data segregation, webhook dedup design), and anonymized data-flow descriptions, with zero real clinic names, PHI, or credentials (Section 2.3).
   c. Try `npx workproof` (or `git log --numstat` / `git blame -w` manually, if wary of a third-party tool) against the DermaVue/SuperHuman repos to generate a metadata-only, code-free engineering report (tenure, commit share, cadence, surviving-lines) that can be pasted directly into a CV or shared as a PDF/markdown attachment — the tool is explicitly built for exactly this "private repo, need proof" scenario (Section 2.4). Review its own documented gameable-metrics caveats before presenting the numbers.
10. **Optional, lower priority:** record one short, real `asciinema` terminal session of an actual Claude-Code-paired debugging or feature-build session (on the CV repo or the sanitized DermaVue architecture repo) and link it — a harder-to-fake artifact than a screenshot (Section 2.5).

---

## Sources consulted (live, this session)

- GitHub Docs — [About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification), [Managing commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [Chainguard Academy — Guardener Commit Verification](https://edu.chainguard.dev/chainguard/guardener/github/commit-verification/)
- [SumGuy's Ramblings — Sigstore + Gitsign](https://sumguy.com/sigstore-gitsign-signed-commits/)
- [github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph); [dev.to — snake-eating contribution graph](https://dev.to/mishmanners/how-to-enable-github-actions-on-your-profile-readme-for-a-contribution-graph-4l66)
- GitHub Docs — [Analyzing changes to a repository's content](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/analyzing-changes-to-a-repositorys-content); [GitHub Changelog — Upcoming changes to repository insights](https://github.blog/changelog/2023-11-29-upcoming-changes-to-repository-insights/)
- [shields.io — GitHub Actions Workflow Status](https://shields.io/badges/git-hub-actions-workflow-status); [badges/shields](https://github.com/badges/shields); [Schneegans/dynamic-badges-action](https://github.com/Schneegans/dynamic-badges-action/)
- GitHub Community Discussions: [#188892](https://github.com/orgs/community/discussions/188892), [#51677](https://github.com/orgs/community/discussions/51677), [#160042](https://github.com/orgs/community/discussions/160042); [Commit History — private contributions](https://commit-history.com/-/metrics/private-contributions)
- GitHub Docs — [Permission levels for a personal account repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository)
- [dev.to — I Open-Sourced My Solutions Architect Portfolio](https://dev.to/aws-builders/i-open-sourced-my-solutions-architect-portfolio-real-world-case-studies-1i0c)
- [workproof (shivam-070208/workproof)](https://github.com/shivam-070208/workproof), [workproof (Bubblegunn/workproof)](https://github.com/Bubblegunn/workproof)
- [anthropics/claude-code Issue #66602](https://github.com/anthropics/claude-code/issues/66602)
- [DeployHQ — Claude Code Git Guide](https://www.deployhq.com/blog/how-to-use-git-with-claude-code-understanding-the-co-authored-by-attribution); [Crash Override — Attributing AI-Authored Commits in Git](https://crashoverride.com/resources/knowledge-base/code-ownership/attributing-ai-commits-git)
- [GitHub Engineering Blog — Technical interviews via Codespaces](https://github.blog/engineering/engineering-principles/technical-interviews-via-codespaces/); [asciinema.org](https://asciinema.org/); [asciinema GitHub](https://github.com/asciinema/asciinema)
- [SOLTECH — What Do Hiring Managers Actually Look For in a GitHub Portfolio?](https://soltech.net/what-do-hiring-managers-actually-look-for-in-a-github-portfolio/); [dev.to — Developer Portfolio Checklist](https://dev.to/_d7eb1c1703182e3ce1782/developer-portfolio-checklist-20-things-hiring-managers-look-for-388p)
- [Resumly.ai — How to Organize GitHub Repos for Recruiter Review](https://www.resumly.ai/blog/how-to-organize-github-repos-for-recruiter-review); [opendoorscareers — How to Write a Strong Case Study for Your Portfolio in 2025](https://blog.opendoorscareers.com/p/how-to-write-a-strong-case-study-for-your-portfolio-in-2025-a14b); [Hakia — Developer Portfolio Guide 2026](https://hakia.com/skills/building-portfolio/); [Refonte Learning](https://www.refontelearning.com/blog/enhancing-your-professional-profile-building-and-showcasing-full-stack-projects-on-github)

## Items flagged as unverified / needing empirical confirmation by Rejeesh directly
- Exact scope of "Include private contributions" for commits to **personal-account-owned** private repos (vs. org-owned) — GitHub's own community forum shows user confusion here; test directly rather than assume (Section 2.1).
- Whether `workproof` (a small, community-maintained npm tool, not a GitHub product) is something a given hiring manager will already recognize — treat its output as a self-explanatory report, not an appeal to a known brand (Section 2.4).
- No official Anthropic statement was found confirming or denying the copyright-office critique of the `Co-Authored-By: Claude` trailer (Issue #66602 was closed without a visible official rebuttal) — treat the controversy as open, not resolved, when discussing it (Section 3).
