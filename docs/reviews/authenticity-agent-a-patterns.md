# Authenticity Patterns for AI-Assisted Builders (2025-2026) — Research Report

Prepared for: Rejeesh Menon, MD — physician-builder positioning himself to hiring managers at AI
companies and startups as a real, hands-on director of AI-assisted engineering work (clinical
intelligence tool, patient-CRM live across seven clinics, e-commerce storefront, CV site), not as
someone who "just prompted an AI." Research method: live web search (WebSearch/WebFetch), September
2026. Every factual claim below is sourced; anything I could not verify is flagged explicitly rather
than invented.

---

## 1. How credible solo builders / "vibe coders" demonstrate real engineering judgment, not AI slop

The discourse has clearly split into two camps, and the split itself is useful evidence for
Rejeesh's positioning.

**The term "vibe coding" has fractured into three meanings by 2026**, per industry analysis: (1)
Andrej Karpathy's original 2025 sense — building by vibes with no review, meant for throwaway
prototypes; (2) a "drift" sense that now means *any* AI-assisted development, even fully reviewed
work; and (3) a pejorative sense tied to "AI slop" — AI-generated code shipped without adequate
verification, blamed for outages and security incidents (Collins Dictionary named "vibe coding"
its 2025 Word of the Year, alongside "slop") — [phys.org](https://phys.org/news/2025-12-slop-vibe-coding-glazing-ai.html), [Kingy AI — State of Vibe Coding 2026](https://kingy.ai/news/the-state-of-vibe-coding-2026/), [Hashnode — State of vibe coding 2026](https://hashnode.com/blog/state-of-vibe-coding-2026).

Because the word itself is now ambiguous/pejorative-leaning, **the credible builders in 2025-2026
distance themselves from the label and instead show artifacts.** Concrete patterns found:

- **Commit history and structured docs, not vibes.** A widely-circulated 2026 guide to Claude
  Code portfolio projects states plainly: "The commit history tells a story. Reviewers at serious
  companies check whether you commit in logical increments, write descriptive commit messages, and
  separate concerns," and recommends a `SPEC.md` that shows "thinking beyond implementation" plus a
  README documenting architectural decisions, deliberately-accepted limitations, and what you'd
  change with more time — [Claude Code Developer Portfolio Guide, 2026](https://claudecodeguides.com/claude-code-developer-portfolio-projects-guide/).
- **Domain-specific hardening as a tell.** On the Hacker News "Vibe Coding Wall of Shame" thread,
  commenters distinguish credible AI-assisted work by whether it shows *learned, scar-tissue*
  engineering — rate limiting, auth middleware, correct CORS — "because they got burned before,"
  versus AI-slop repos that consistently show "no auth on admin routes, API keys hardcoded in
  client JS, CORS wide open." The same thread also warns that "AI slop" accusations themselves are
  frequently unverifiable ("there is no documentary evidence the code was never touched by a
  human"), which cuts both ways — it means an unsubstantiated slop *accusation* is also weak, but
  it raises the bar for what counts as *proof of authorship* — [HN #47566491](https://news.ycombinator.com/item?id=47566491).
- **Build-in-public as the dominant credibility strategy among solo builders/founders.** Pieter
  Levels (@levelsio) is repeatedly cited as the reference case: daily public updates of code,
  metrics, and mistakes on X and his blog, self-taught, 40+ solo-built projects, no employees, no
  VC — "making the challenge public created accountability" — [Indie Hackers](https://www.indiehackers.com/post/how-pieter-levels-learned-to-code-f61c0019a3), [levels.io — MVP process](https://levels.io/how-i-build-my-minimum-viable-products), [levels.io — projects list](https://levels.io/projects). Other cited 2025-2026 examples: Shlomo Base44 (solo-built, sold to Wix ~$80M) and Marc Lou (ShipFast/CodeFast/DataFast, >$1M revenue, "zero employees") both attributed their credibility partly to transparent, documented build processes — [fi.co](https://fi.co/insight/how-solo-founders-are-building-unicorns-with-ai-tools-in-2026-and-where-to-learn-it-live), [Ascero AI](https://asceroai.com/news/solo-founder-1m-arr-ai-coded-2026).
- **New "proof of work" tooling has emerged specifically for this trust gap.** Services like
  Devlog explicitly pitch themselves as solving the "did you actually build this" problem by
  reading real commit history rather than letting people hand-type claims: "verified totals and
  language breakdowns inferred from repositories you actually commit to, refreshed as your work
  changes rather than typed in by hand" — [devlogg.co](https://www.devlogg.co/). This is a direct
  signal that the market has recognized "claims vs. verifiable commit data" as the exact
  credibility gap Rejeesh is worried about.

**Bottom line for Q1:** the credible-builder playbook in 2025-2026 is not "avoid saying AI helped"
— it's "make the human judgment layer inspectable": real commit history, a decision log, an
explicit account of what you rejected/changed, and public/dated documentation of the build process,
rather than a single retrospective claim.

---

## 2. Hiring-manager / technical-evaluator sentiment toward AI-disclosed candidates (2025-2026)

**Sentiment is bifurcated and specificity is explicitly the deciding factor**, which directly
supports the thesis that vague claims read as slop while evidenced claims read as skill.

- **Official employer policy has moved toward disclosure-and-evaluate, not penalize.** GitLab's
  public interview-process guidance instructs candidates to "Disclose when you've used AI in the
  interview process, and which tools you leveraged" and states the company is "evaluating your
  skills and judgment, including how you appropriately leverage AI" — with the one hard line being
  that candidates must engage authentically rather than "reading from AI-produced answers" —
  [GitLab — Using AI in the interview process](https://about.gitlab.com/jobs/ai-interview-process/).
- **The distinguishing question hiring managers ask is "do you understand it," not "did you use
  AI."** Reporting on Claude Code-specific interviews states the interviewer is checking three
  things: "can you use it, do you understand how it thinks, and can you measure if it helps," and
  that "candidates will be rejected for pasting raw AI output" while being rewarded for showing
  they can "debug, reject bad suggestions, and ship code they understand line by line."
- **Real-world hiring-manager account (Blind/TeamBlind):** in one documented case a hiring manager
  suspected AI-assisted cheating in a live interview but chose to hire anyway because the candidate
  "answered follow-up questions well and seemed to understand everything" and "could learn in real
  time" — despite an official company policy against AI use in interviews. The manager reportedly
  argued there are "different levels of cheating" and preferred candidates using live AI prompting
  over candidates who had memorized leaked interview questions — [TeamBlind thread](https://www.teamblind.com/post/meta-ai-assisted-coding-round-jgtyo8v2). This is a single anecdotal data point (not a survey), and I flag it as such, but it's a real, current example of "specificity/demonstrated understanding overriding a blanket anti-AI stance."
- **Underlying trust numbers are low across the industry, which raises the bar for anyone claiming
  AI-assisted work is high quality.** Sonar's 2025-2026 State of Code survey found ~42% of
  committed code is now AI-assisted, but 96% of developers say they have difficulty fully trusting
  that AI-generated code is functionally correct, and only 48% always review AI-assisted code
  before committing — [Sonar State of Code Developer Survey 2026 (PDF)](https://www.sonarsource.com/state-of-code-developer-survey-report.pdf), [ShiftMag summary](https://shiftmag.dev/state-of-code-2025-7978/). Stack Overflow's 2025-2026 data shows a related trust *decline*: 84%+ use AI tools, but only 29% trust the output — down 11 points from 2024 — [Stack Overflow Blog, "Closing the developer AI trust gap," Feb 2026](https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/).
- **On the recruiting/hiring-process side specifically**, a 2026 Pollfish survey of 1,000 US hiring
  managers found 91% actively use AI somewhere in recruiting and 85% say they trust AI to assess
  candidates "regardless of background," but there is "no consistent standard for informing
  candidates when AI is used in the hiring process" — a trust/adoption gap on the employer side that
  mirrors the developer-side gap — [ResumeGenius, AI's Impact on Hiring 2026](https://resumegenius.com/blog/job-hunting/ai-impact-on-hiring-2026).
- **Enterprise leadership itself is skeptical of AI-generated code quality even while shipping it.**
  CloudBees' 2026 "State of Code Abundance" report found 81% of enterprise tech leaders saw *more*
  production issues tied to AI-generated code even though 92% felt confident shipping it — a
  striking confidence/quality gap cited repeatedly in 2026 commentary — [Level Up Coding summary](https://levelup.gitconnected.com/vibe-slop-ai-coding-crisis-b7096e1cfd68), [AITrove summary](https://www.aitrove.ai/blog/vibe-slop-crisis-ai-coding-quality-2026). I was not able to independently pull CloudBees' primary report; these are secondary summaries and I flag the stat as coming from that report via press coverage, not the source document itself.

**Bottom line for Q2:** vague "I built this with AI" claims land in an environment already primed
for skepticism (low developer trust in AI code, rising "vibe slop" incident narratives). But the
explicit, repeated finding across employer policy (GitLab), interview-prep analysis, and anecdotal
hiring-manager accounts is that **specificity and demonstrated understanding, not AI use itself, is
what evaluators are actually screening for.** A candidate who can narrate *why* a decision was made,
what broke, and what they rejected converts a liability disclosure into a competency signal.

---

## 3. Real examples: physicians / non-traditional builders using AI coding tools, publicly documented

Verified examples found, with an honest accounting of how thin the record is:

- **Dr. Graham Walker, MD** — emergency physician, co-founder of MDCalc (clinical decision-support
  tool used widely by clinicians) and Offcall (financial tool for physicians). He appeared in an
  Anthropic-hosted webinar/on-demand video, **"Claude Code in Healthcare: How Physicians are
  Building with AI,"** discussing using Claude Code to build and to "get people more excited and
  engaged in the clinician community about building and creating" — [Anthropic webinar landing page](https://anthropic.ondemand.goldcast.io/on-demand/ee5e1e18-1ace-4c7f-a20f-c4a69bb7247f), [Substack interview, "From MDCalc to Offcall"](https://thesurgeonsrecord.substack.com/p/from-mdcalc-to-offcall-a-conversation). This is the single clearest, most directly comparable example to Rejeesh's positioning: a practicing physician, publicly and by name, attached to an Anthropic-branded case study about physician-built software. **This is worth Rejeesh directly investigating/referencing** — it is close to a template for "physician + Claude Code + credible healthcare product" framing that Anthropic itself has already validated.
- **Dr. Michał Nedoszytko** — named in secondary reporting alongside Dr. Walker as another physician
  using Claude Code/Claude Cowork to build clinical applications "without extensive coding
  backgrounds," per a Medium roundup on 2026 AI coding agents in healthcare — [Kevin Gabeci, Medium, "AI Coding Agents in 2026"](https://kgabeci.medium.com/ai-coding-agents-in-2026-claude-code-cursor-and-how-we-actually-use-them-d76d9c397d82). I could not independently verify details of what Dr. Nedoszytko built beyond this secondary mention — flagging as **could not fully verify**.
- **What reads as inauthentic / risky in this specific population:** a discussion thread on
  openhealthhub.org (Clinicians Who Code community) describes a physician who had built "several
  health-related applications through 'vibe-coding'" but, lacking "further knowledge on how to build
  robust health tech," was "sharing the unversioned HTML with colleagues via Dropbox" rather than
  through any real deployment/versioning pipeline. The community's own framing is that clinician-
  builders often "lack formal training on proper development practices" and should "teach each
  other" — i.e., **the community's own honest self-assessment is that unversioned, undocumented,
  informally-shared code is the failure mode that reads as amateur/unsafe**, not the mere fact of
  being a physician-coder — [openhealthhub.org thread](https://openhealthhub.org/t/video-claude-code-in-healthcare-how-physicians-are-building-with-ai/2979). This is directly useful: it tells you the bar clinician-builder peers themselves are already applying (versioning, documentation, deployment discipline), which is exactly the bar Rejeesh should be visibly clearing.
- **One source I attempted to verify could not be reached**: a page titled "Doctor-led AI coding
  sparks security concerns" (sherringford.org) surfaced in search results but the domain does not
  resolve (DNS failure on fetch) — I am **flagging this as unverifiable/likely not a legitimate,
  reachable source** and have not used any claim from it in this report.

**Bottom line for Q3:** the pool of *publicly documented* physician/AI-coder examples is small but
real, and Anthropic itself has already produced a case-study frame (the Graham Walker webinar) that
Rejeesh's positioning can sit directly alongside — this is likely the single most useful concrete
precedent found in this research. The clearest "what reads as inauthentic" signal from the
physician-coder community itself is informal, unversioned, undocumented sharing — the opposite of
what Rejeesh is already doing by building a CV site with structured docs and a review pipeline.

---

## 4. What artifacts/evidence types are cited as proof of real understanding (vs. just claiming it)

Ranked by how frequently and concretely each was cited across sources:

1. **Real, readable commit history** — "logical increments," descriptive messages, separated
   concerns — repeatedly cited as the first thing serious reviewers check — [Claude Code Portfolio Guide](https://claudecodeguides.com/claude-code-developer-portfolio-projects-guide/), [Devlog](https://www.devlogg.co/).
2. **A written decision log / ADR-style record of trade-offs and rejected alternatives.**
   Architecture Decision Records are explicitly framed in 2025-2026 sources as the mechanism that
   "preserves judgment" in AI-assisted work — capturing "the business context, alternatives
   considered, the trade-offs evaluated, and the final decision," with dedicated new templates
   emerging specifically for AI-assisted development (stable ID, context, rejected alternatives,
   consequences, reconsideration triggers) — [adr.github.io](https://adr.github.io/), [Glukhov — Decision Records for AI-Driven Software Development](https://www.glukhov.org/app-architecture/documentation/decision-records-ai-driven-development/), [ADR template for AI-assisted development](https://asdecided.com/notes/adr-template-for-ai-assisted-development), [nexapp.ca — ADRs in Practice](https://www.nexapp.ca/en/blog/architecture-decision-records-adr).
3. **A SPEC.md / README documenting requirements, known limitations, and "what I'd change with more
   time"** — cited as proof of "thinking beyond implementation" — [Claude Code Portfolio Guide](https://claudecodeguides.com/claude-code-developer-portfolio-projects-guide/).
4. **Documented debugging stories / postmortems.** Multiple sources converge on this as a strong
   signal precisely because it cannot be faked without real understanding: "debugging real
   production failures step-by-step," explaining "how bugs emerged from system design" and "which
   assumptions were wrong" — [Towards Explainable AI, Medium](https://medium.com/towards-explainable-ai/ai-is-writing-the-code-who-watches-what-it-breaks-b6230c906fdb). One commentator frames the stakes bluntly: "If AI writes the code and AI fixes the failures, junior engineers never learn to debug, and senior engineers lose touch with what the system actually does" — reinforcing that a *narrated* debugging incident is disproportionately convincing evidence of ownership.
5. **Domain-specific hardening visible in the code/architecture** (auth, rate limiting, correct
   CORS, edge-case handling) as a proxy for "this person has been burned before and knows why it
   matters" — [HN Wall of Shame thread](https://news.ycombinator.com/item?id=47566491).
6. **A short recorded walkthrough (Loom-style) narrating architecture and decisions live.**
   Cited as increasingly common in async hiring pipelines specifically because it's hard to fake:
   "a three-minute video talking through your architecture while demo-ing the app" is something
   "very few applicants provide," and is used by hiring managers to answer "what did you build, how
   do you think, and can they trust you with real work" — [MentorCruise](https://mentorcruise.com/blog/how-to-build-a-software-engineer-portfolio-that-survives-code-review/), [Fueler — Proof of Work Portfolios](https://fueler.io/blog/proof-of-work-portfolios-real-examples-that-open-doors), [Loom Blog — Video Resume](https://www.loom.com/blog/video-resume).
7. **Explicit disclosure of AI tool use plus ability to discuss it under follow-up questioning** —
   this is what GitLab's formal policy and the anecdotal hiring-manager case both actually reward,
   more than the tool-use disclosure itself — [GitLab](https://about.gitlab.com/jobs/ai-interview-process/), [TeamBlind](https://www.teamblind.com/post/meta-ai-assisted-coding-round-jgtyo8v2).
8. **Verified/live production evidence** (real users, real incidents, real scale — e.g., "live
   across seven clinics") ranks implicitly high across every source, though no single source names
   "production deployment scale" as a discrete checklist item the way it names commits or ADRs —
   this is my own synthesis, not a direct citation, and I flag it as such. It logically follows from
   the repeated theme that *verifiable, third-party-checkable facts beat self-reported narrative.*

Notably *absent* or only weakly evidenced in what I found: formal "test coverage percentage" as a
named credibility signal for solo/AI-assisted builders specifically (it appears in general SWE
portfolio advice, but not as something search results emphasized in the vibe-coding-authenticity
discourse specifically) — flagging this as a **plausible but not strongly source-supported**
recommendation, use with that caveat if included.

---

## 5. "Build logs" / "changelog as narrative" as a credibility device

- **The core mechanism**: generate a build log from real git history plus human annotation, so every
  claim links to a real, inspectable commit — a portfolio feature request thread describes exactly
  this pattern: "a build log page shows how a site was built, day by day, from generated JSON,
  allowing readers to click through to every commit on GitHub" — [GitHub — portfolio build log issue #22](https://github.com/emkataumre/portfolio/issues/22), [GitHub — build log generation script issue #21](https://github.com/emkataumre/portfolio/issues/21).
- **Automated changelogs from commit history are treated as inherently more trustworthy than
  hand-written summaries** because they can't misrepresent what happened: "an always-current,
  versioned change history at near-zero ongoing cost," generated by "the repo's existing release
  pipeline, never by hand" — [Daniel Rotter, "Automatically generate changelogs with git," 2025](https://danielrotter.at/2025/03/05/automatically-generate-changelogs-with-git.html), [devantler-tech monorepo issue #2269](https://github.com/devantler-tech/monorepo/issues/2269).
- **Dated, public, cumulative logs beat a single polished case-study paragraph because they show
  process, not just outcome** — this is the explicit mechanism behind Pieter Levels' "build in
  public" reputation: daily public updates over years, which "created accountability" and let
  "unfinished market evidence" be checked by anyone in real time, rather than a retrospective claim
  written after the fact — [Indie Hackers](https://www.indiehackers.com/post/how-pieter-levels-learned-to-code-f61c0019a3), [Streakr — How Pieter Levels Turned Public Shipping Into a Feedback System](https://streakr.co/playbook/pieter-levels).
- **New "proof of work" products are being built around exactly this idea** — turning commit
  history into a narrated profile ("Devlog can scan git history and build a dev diary from commits,
  turning commit history into readable notes") specifically because a one-time claim is weaker
  evidence than a dated, cumulative, externally-verifiable record — [devlogg.co](https://www.devlogg.co/), [GitHub — DevLog tool](https://github.com/unseasonable-deposer640/DevLog).
- **Why a dated log reads as more credible than a polished paragraph (synthesis across sources,
  not a single direct citation):** a single case-study paragraph is retrospective, can be edited to
  smooth over mistakes, and gives the reader no way to check the timeline. A dated build log (a)
  is falsifiable — timestamps and commits can be checked against reality, (b) shows iteration and
  reversals, which a polished narrative usually edits out but which is exactly the "engineering
  judgment" signal evaluators say they're looking for, and (c) mirrors the format every source in
  this research treats as maximally credible: real commit history.

---

## Top 5 concrete, actionable recommendations for Rejeesh specifically

1. **Publish a dated build log per product, not just a finished case-study page.** For each of the
   four products (clinical-intelligence tool, patient-CRM/DermaVue Clinic OS, e-commerce storefront,
   this CV site), add a chronological, dated log of what was built/changed/broken and why — ideally
   generated from real commit history (git log → structured entries) rather than hand-written after
   the fact, per the pattern in the GitHub build-log threads and Daniel Rotter's changelog-from-git
   approach above. This is the single most-repeated "credible vs. slop" differentiator found in this
   research, and it's the one artifact type Rejeesh can produce immediately from data he already has
   (git history across all four repos).

2. **Write 3-5 ADR-style decision records per major product** — not full architecture docs, just
   short "context / options considered / what I chose / why / what I'd revisit" entries for the
   real hard calls (e.g., why DermaVue Clinic OS routes leads the way it does, a clinical-safety
   boundary decision in the clinical-intelligence tool, a schema or vendor choice in the CRM). This
   directly targets the #1 fear stated in the brief — being seen as someone who "just prompted" —
   because an ADR is evidence of judgment that an AI transcript alone doesn't provide.

3. **Write up one real, specific debugging/incident story per product** (a production bug in the
   live-across-seven-clinics CRM is ideal — it's the highest-stakes, most verifiable system he has).
   Multiple independent sources single out narrated debugging/postmortem stories as disproportionately
   convincing precisely because they can't be faked without real understanding — this is a higher-
   leverage artifact per unit of effort than a general "about me" narrative.

4. **Reference the existing physician/Claude-Code precedent directly rather than inventing framing
   from scratch.** Dr. Graham Walker's Anthropic-hosted case study ("Claude Code in Healthcare: How
   Physicians are Building with AI") is a close, already-validated template for exactly Rejeesh's
   positioning — a practicing physician using Claude Code to build real healthcare software,
   endorsed in an Anthropic-branded context. Rejeesh should look at how that case study is framed
   (and possibly find a way to be part of that same community/conversation, e.g., via the
   "Clinicians Who Code" community referenced in the openhealthhub.org thread) rather than trying to
   invent a positioning with no comparable precedent.

5. **Explicitly disclose the AI-assisted process and be ready to go deep on it, rather than
   downplaying or over-explaining it.** Every source on hiring-manager sentiment — GitLab's formal
   policy, the Claude Code interview-prep analysis, and the anecdotal hiring-manager account —
   converges on the same finding: disclosure itself is not the risk; inability to explain the *why*
   under follow-up is. Given the trust numbers found (only 29% of developers trust AI-generated code,
   96% say they struggle to trust its correctness, 81% of enterprise leaders report more production
   issues from AI code despite high shipping confidence), Rejeesh should expect real skepticism by
   default — and treat the build logs, ADRs, and debugging story above as the specific, falsifiable
   evidence that converts a "just prompted it" first impression into a "directed real engineering
   work" conclusion.

---

## Sources not used / explicitly flagged as unverifiable

- `sherringford.org/post/doctor-led-ai-coding-sparks-security-concerns` — surfaced in search
  results but the domain does not resolve (DNS failure). Not used for any claim in this report.
- Dr. Michał Nedoszytko's specific projects — only found via a single secondary Medium roundup with
  no primary source located; treat as unverified if cited elsewhere.
- The CloudBees "State of Code Abundance" 81%/92% statistic — sourced from secondary coverage
  (Level Up Coding, AITrove), not CloudBees' own report directly; flagged as secondary-sourced.
