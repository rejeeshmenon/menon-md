# Research: How to write a credible "how I actually built this with AI" narrative

Prepared for Rejeesh Menon, MD. Purpose: ground a build-narrative about SuperHuman, DermaVue
Clinic OS, DermaVue Commerce, and dermavue.com in real, cited patterns of what makes
AI-assisted-development write-ups read as credible engineering documentation versus "AI
bullshit" — for an audience of hiring managers and engineers at AI companies/startups.

All facts about Rejeesh used below come from `src/content/cv.yaml` (read in full before
writing this report) plus the "zero formal software engineering training" fact stated
directly in the task brief. No new biographical facts about him are invented anywhere in
this document, including in the example sentences at the end.

---

## 1. What separates a credible "built this with AI" write-up from an inflated one

The clearest, most citable real-world model is **Simon Willison** (co-creator of Django,
creator of Datasette, the person who coined "prompt injection" and popularized "AI slop"
and "agentic engineering"). His methodology, documented across his blog and newsletter,
converges on five concrete, repeatable practices:

- **Testing is the one thing that can't be delegated.** Willison: "the one thing you
  absolutely cannot outsource to the machine is testing that the code actually works,"
  and "if you haven't seen it run, it's not a working system." Credible write-ups describe
  *how* the author verified the AI's output, not just that they asked for something.
- **Specificity of instruction, not vague delegation.** His example prompts are
  narrow and technical ("Write a Python function that uses asyncio httpx with this
  signature...") — the opposite of "I asked Claude to build me a CRM."
- **Transparency about the model's mistakes**, framed as expected and useful, not
  embarrassing: "will absolutely make mistakes — sometimes subtle, sometimes huge,"
  treated as "useful lessons."
- **Documented, reproducible trails** — commit-linked transcripts and colophons showing
  the actual sequence of prompts and corrections, not a retrospective, cleaned-up summary.
- **Visible iteration.** His public examples show a first pass that didn't work, followed
  by a fix — establishing that competence, not perfection on try one, is the credibility
  signal.
  (Simon Willison, "How I use LLMs to help me write code," simonw.substack.com;
  simonwillison.net/tags/ai-assisted-programming/)

**Addy Osmani** (Google Chrome engineering leadership, author of *Beyond Vibe Coding*)
draws the line the same way from the reviewer's side: "if an LLM wrote the code, and you
reviewed it, tested it properly, and can explain how it works to someone else, that is not
vibe coding — that is software development that happened to use an LLM." His stated
differentiator between vibe coding and AI-assisted engineering is testing discipline: "with
a solid test suite, an AI agent can iterate in a loop until tests pass, giving high
confidence in the result." (Addy Osmani, "Vibe coding is not the same as AI-Assisted
engineering," medium.com/@addyosmani; addyosmani.com/blog/agentic-engineering/;
newsletter.pragmaticengineer.com/p/beyond-vibe-coding-with-addy-osmani)

**Named red flags**, consistent across multiple sources on AI-generated resumes/portfolios
(Rezi, Enhancv, KraftCV, The Connors Group — all 2025/2026 pieces aimed at recruiters):
generic buzzwords ("leverage," "synergize," "results-driven"), unnaturally uniform tone
across every section, tools/skills listed with no evidence of how they were used, and
vague superlative metrics with no method behind them ("increased efficiency by 200%").
The unifying diagnostic recruiters use: *could this sentence be copy-pasted into someone
else's write-up without changing a word?* If yes, it's a red flag regardless of whether AI
wrote it.

**Bottom line for Rejeesh's narrative:** the credible version names the actual failure
mode ("the responder answered a drug-interaction question it should have escalated"), the
actual fix, and the actual verification step. The inflated version says "leveraged
cutting-edge AI to build a HIPAA-compliant platform" and stops there.

Sources:
- [How I use LLMs to help me write code — Simon Willison](https://simonw.substack.com/p/how-i-use-llms-to-help-me-write-code)
- [Simon Willison on ai-assisted-programming](https://simonwillison.net/tags/ai-assisted-programming/)
- [Vibe coding is not the same as AI-Assisted engineering — Addy Osmani](https://medium.com/@addyosmani/vibe-coding-is-not-the-same-as-ai-assisted-engineering-3f81088d5b98)
- [Agentic Engineering — AddyOsmani.com](https://addyosmani.com/blog/agentic-engineering/)
- [Beyond Vibe Coding with Addy Osmani — Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/beyond-vibe-coding-with-addy-osmani)
- [How to Tell if a Resume Is AI-Generated — Rezi](https://www.rezi.ai/posts/how-to-tell-if-a-resume-is-ai-generated)
- [How to Tell if a Resume Was Written with AI: 7 Red Flags for 2026 — Enhancv](https://enhancv.com/blog/signs-of-ai-generated-resume/)

---

## 2. What hiring managers actually want to see: prompts, decisions, or debugging?

The strongest, most directly on-point source is **Canva's own engineering blog**, which
explicitly redesigned interviews to let candidates use AI and then published what they
grade on. Canva looks for, verbatim:

- Strategic AI use: "Do they understand when and how to leverage AI effectively?"
- Problem decomposition: "How well do they break down complex, ambiguous requirements?"
- Technical judgment: "Can they make sound technical decisions while using AI as a
  productivity multiplier?"
- Code review skill: "Can they identify and fix issues in AI-generated code?"
- Production standards: "Can they ensure AI-generated solutions meet production
  standards?"

Their explicit finding: the strongest candidates "didn't just prompt AI and accept
whatever it generated" — they questioned it, delegated tasks strategically while keeping
overall control, and debugged when the AI's solution had problems. The weak signal is a
candidate who lacks "the judgment to guide AI effectively or identify when its suggestions
were suboptimal." (Canva Engineering Blog, "Yes, You Can Use AI in Our Interviews. In
fact, we insist," canva.dev/blog/engineering)

A second concrete, well-specified source is **HelloInterview's write-up on AI-enabled
coding interviews**: interviewers evaluate whether "candidates treat AI output as the
finished solution rather than a draft to review and accept or reject," whether they
"redirect when the AI drifts into a different approach than the one they planned," and
whether the interviewer "would be comfortable directing a junior engineer pair programmer
in the same way." Their framing: "candidates who treat AI like a vending machine fail,
while candidates who treat it like a junior pair programmer succeed." They also note the
strongest candidates "spend the first 5-10 minutes reading the codebase and forming a
plan — no code, no prompts" before using AI to execute a strategy already formed in their
head. (hellointerview.com/learn/ai-coding/overview/introduction)

A third, sharper source specific to non-engineers using AI to build real products is
**YC Roaster's 2026 piece on whether YC still requires a technical cofounder**. It
describes the exact interrogation pattern partners use to separate real ownership from
delegation: "we chose Postgres over a vector DB for the first version because our
retrieval volume was tiny and we wanted one fewer moving part" is the kind of answer that
signals ownership; the red flag is when a founder "gets asked a basic question about how
the auth flow works or why they chose a particular data model, and freezes, because the
agent made those decisions and they never looked." The article's summary line is the most
quotable finding for this whole research task: partners care "whether you understand the
product they helped you build" — not whether you personally typed every line.
(ycroaster.com/blog/yc-technical-cofounder-ai-writes-code-2026)

**Answer to the research question directly:** hiring managers want the *decisions* and
the *debugging*, with prompts only as supporting evidence of how the decision got
executed. A transcript of prompts with no decision narrative around it is not the signal
they're grading; a decision narrative with zero mention of how it was executed or
verified is also not credible. The two need to travel together.

Sources:
- [Yes, You Can Use AI in Our Interviews — Canva Engineering Blog](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)
- [AI Interview Success: An Interviewer's Inside Guide — Canva Engineering Blog](https://www.canva.dev/blog/engineering/ai-interview-success/)
- [Introduction to AI-Enabled Coding Interviews — Hello Interview](https://www.hellointerview.com/learn/ai-coding/overview/introduction)
- [Does YC Still Require a Technical Co-Founder Now That AI Writes Code? — YC Roaster](https://www.ycroaster.com/blog/yc-technical-cofounder-ai-writes-code-2026)

---

## 3. The "physician who codes" genre — a directly on-point real example

The single best, most directly analogous real source found is a **April 2026 profile of
a radiology resident, Yoojin Nam, M.D., who built 22 research-automation "skills" using
Claude Code with no programming background** — published by Aperivue. It is close enough
to Rejeesh's situation (physician, zero formal engineering training, agentic coding tool,
real clinical stakes) to function almost as a template for register, not content.

Key patterns from that piece, directly quoted:

- **Leads with the credibility-establishing admission, stated plainly, not apologetically:**
  "My training is in reading CT scans and placing catheters, not in writing Python
  scripts." Later, self-deprecating but not self-undermining: "built by a doctor who
  still cannot explain what a decorator does in Python."
- **Draws the line between what he owns and what the tool did, explicitly:** "AI provides
  the execution; you provide the judgment," and frames his real contribution as domain
  expertise — "the fact that you know a bivariate model is appropriate."
- **Names concrete failure and iteration, not a smooth success story:** "The PDF
  retrieval skill went through three versions before it worked reliably," and "PMC's
  website blocked the download with a JavaScript challenge. So I described that problem
  too, and we iterated."
- **States his verification method, not just the outcome:** "Every skill was tested on
  actual papers I was writing. When [tools] missed items ... I described the error and we
  fixed it."

This is strong evidence that the "honest physician-builder" register isn't hypothetical —
it already exists, was published, and reads as credible specifically because it keeps the
admission of limits (no engineering training) *paired with* a specific, named failure and
fix, rather than either bragging or hedging into vagueness.

The broader "clinician-technologist career narrative" literature is thinner and mostly
generic career-advice content (portfolio-career framing, "clinical credibility is
valuable — tech companies cannot hire 'medical thinking' without doctors" from iatrox.com's
2026 alternative-careers toolkit), which is directionally useful but not citable at the
level of specificity the Aperivue piece offers.

Sources:
- [How a Non-Programmer Doctor Built 22 Research Automation Skills with Claude Code — Aperivue (Yoojin Nam, M.D., April 7, 2026)](https://aperivue.com/en/blog/doctor-built-research-skills-claude-code)
- [Alternative Careers for Doctors: The 2026 Landscape — iatrox.com](https://www.iatrox.com/academy/toolkits/alternative-careers-for-doctors-2026)
- [Clinicians as Builders: How Claude Code Changes Everything](https://www.clinicalproductthinking.com/p/clinicians-as-builders-how-claude)

Flagging honestly: I could not find a rigorous, large-sample academic or journalistic study
specifically on "how physician-builders should frame technical credibility" — this is a
thin genre with mostly single-case blog posts and vendor-adjacent content (Anthropic's own
"Claude Code in Healthcare" webinar series, which is marketing material and should be
treated as such, not as independent evidence). Treat the Aperivue piece as one strong
analogous data point, not as a validated formula.

---

## 4. The honest middle register for describing an AI agent's role

No single canonical "best practice" document exists for this — it has to be triangulated
from the interview-signal research (Section 2) and the vibe-coding-vs-engineering
distinction (Section 1). Triangulating them gives a concrete rule, not just a vibe:

**Overclaiming failure mode** (sounds like the AI did everything, candidate is a fraud):
describing the tool's output as the finished artifact with no review step named. Signal
red flag per Canva: "didn't just prompt AI and accept whatever it generated" — the
inverse of what strong candidates do.

**Underclaiming/downplaying failure mode** (implies every line was hand-typed, which reads
as dishonest once anyone asks a follow-up question, and also erases the actual skill being
demonstrated): omitting the tool's name and role entirely. The "lying by omission" framing
appears directly in the AI-credit-attribution research: "avoiding being explicit about how
you used AI to find a solution can constitute lying by omission."

**The honest middle**, synthesized from Sections 1-3: name the tool plainly (Rejeesh's own
cv.yaml already does this correctly — "Claude Code CLI and agentic tooling"), then
immediately attach the *decision* that was his and the *verification* that was his. The
YC Roaster line is the cleanest test to write to: could he answer, unscripted, "why did you
choose X over Y" and "how did you know it was wrong when it was wrong" for every named
system? If yes for a given claim, the sentence is honest at any level of AI involvement.
If no, the sentence should not be in the narrative, however AI-generated or hand-written it
is.

Practically: use tool + version/mode where known ("Claude Code CLI," "agentic workflows,"
consistent with his existing skills section), pair every mention of what the agent did with
what he decided or checked, and never let a paragraph end on "and Claude built it" — end it
on the verification or the consequence of getting it wrong.

Sources: see Canva, HelloInterview, YC Roaster citations above; also
[People Are Audaciously Taking Undue Credit For AI-Generated Brainy Outputs — Forbes](https://www.forbes.com/sites/lanceeliot/2026/05/11/people-are-audaciously-and-deceitfully-taking-undue-credit-for-ai-generated-brainy-outputs/)
(useful mainly as evidence the opposite failure mode — undue credit-taking — is a live,
named professional-reputation risk in 2026, reinforcing why specificity protects him).

---

## 5. ADR/decision-record style documentation used to demonstrate judgment in a hiring context

The canonical ADR format itself (context / decision / alternatives considered /
consequences) comes from the standard architecture-decision-record community
(adr.github.io; Microsoft's own internal engineering playbook, which publishes its ADR
template publicly). Microsoft's Engineering Fundamentals Playbook frames the artifact's
purpose in a way that transfers directly to a hiring document: it exists to make explicit
"the context, justifications, and implications of a decision" and — critically for a
portfolio use — "alternatives that you ruled out" are treated as part of the record, not an
afterthought.

The most directly relevant hiring-specific source found, from a developer-portfolio
advice piece: "A brief architecture note or decision log in your README can turn a decent
project into a compelling one. Document the decisions you made and why. What approaches did
you consider? What tradeoffs did you weigh?" Its stated rationale is exactly the thing
Rejeesh needs cited: "hiring managers are looking for proof that you can define a real
problem, make thoughtful decisions, and ship something that works," and a decision log
"demonstrates your judgment and decision-making ability — exactly what hiring managers want
to see." (refactortalent.com/developer-portfolio-projects-that-impress)

**Flagging honestly:** I did not find a well-documented, named, verifiable case of a
candidate's ADR-style portfolio artifact being cited by an employer as the deciding factor
in a hire — the "ADR-in-a-portfolio" pattern is a widely *recommended* practice in
career-advice and engineering-playbook writing, but I could not verify it with a concrete,
attributable before/after hiring outcome. Treat it as a well-reasoned, low-risk format
choice, not as a proven-effective tactic with data behind it.

Sources:
- [Architectural Decision Records (ADRs)](https://adr.github.io/)
- [Decision Log — Microsoft Engineering Fundamentals Playbook](https://microsoft.github.io/code-with-engineering-playbook/design/design-reviews/decision-log/)
- [Developer Portfolio Projects That Impress Hiring Managers — Refactor Talent](https://refactortalent.com/developer-portfolio-projects-that-impress/)

---

## A concrete recommended structure and tone for Rejeesh's build-narrative

**Format note:** four systems, one audience (AI-company/startup hiring managers), one
throughline (a physician who owns clinical and compliance judgment while directing
AI-assisted engineering). Target 1,200-1,800 words total — long enough to carry real
specifics per system, short enough that a hiring manager reads the whole thing.

**1. Opening frame — "What this is and isn't" (60-90 words)**
State plainly: ten years as a hospitalist, zero formal software engineering training,
built four shipped systems with Claude Code and a small engineering team, owns the
clinical logic and compliance decisions on all of them. Name the tool once, here, cleanly
— matching the register cv.yaml already uses ("Claude Code CLI and agentic tooling") —
and don't return to justifying it again; let the rest of the piece prove it through
specifics.

**2. Four short case sections, one per system (150-250 words each)**
For each of SuperHuman, DermaVue Clinic OS, DermaVue Commerce, dermavue.com: name the
real stack (already in cv.yaml — Next.js/Supabase/Postgres/Vultr/AWS for SuperHuman;
NestJS/Next.js/Python/Twenty CRM/Chatwoot/WhatsApp Business API/Docker for Clinic OS;
Astro/Vendure/Postgres for Commerce), state one specific decision he made and why, one
specific thing that went wrong or had to be redesigned, and one specific way he verified
correctness before it touched a real patient or customer. Every section should be
answerable, unscripted, to a "why did you choose X" follow-up — that is the test from
Section 4 above.

**3. "How I actually work with the tool" (150-200 words)**
One section, once, stating the honest middle register directly: what he directs, what he
delegates, what he never delegates (per cv.yaml: the autonomy boundary, the forbidden-topic
list for Priya, the BAA/synthetic-data/FDA-scoping compliance calls). This is the section
that answers Research Question 4 head-on so it doesn't need re-litigating elsewhere.

**4. Three decisions I'd defend under questioning — mini ADRs (100-150 words each)**
Pick three genuinely consequential calls already implied by cv.yaml (the autonomy boundary
in SuperHuman; the red-flag escalation design for Priya; the compliance scoping that kept
SuperHuman outside FDA device rules). Format each as: the problem, what he decided,
what he considered and rejected, and how he verified it was right. This is the section a
hiring manager will trust most, per the Section 2 and Section 5 research above.

**5. One real failure, told straight (80-120 words)**
Mandatory, per Section 1's research. A version that didn't work, why, and what changed.
This single section does more credibility work than anything else in the document.

**6. Close — what this predicts about how he'd work on their team (40-60 words)**
Short. Tie the pattern (owns judgment, directs execution, verifies before shipping to real
people) to the target roles in cv.yaml (clinical AI evaluation/safety, medical director of
clinical AI, AI research faculty, technical cofounder).

### Example sentences in the right register

These are drafted for tone calibration only, grounded strictly in facts already in
cv.yaml plus the "zero formal training" fact given in the task brief. They are not
verified quotes from Rejeesh and should be checked against what actually happened before
use.

1. "I have no formal training in software engineering. What I have is ten years of
   deciding what a physician is allowed to tell a patient at 2 a.m., and that turned out to
   be the more transferable skill when I wrote the rule for what our WhatsApp responder,
   Priya, is never allowed to answer on its own."
2. "Claude Code wrote the webhook handlers that route and de-duplicate leads coming in
   from five different sources across seven clinics. I own the definition of what counts as
   a duplicate, because getting that wrong either double-books a patient or silently drops
   a lead, and that's a clinical-operations judgment call before it's a code problem."
3. "SuperHuman's first pass let generated guidance go out without a check against the
   underlying labs. I changed that after reviewing pilot logs, and every recommendation is
   now checked against source data before a physician sees it. That's not a nice-to-have
   feature; it's the actual autonomy boundary the tool has to respect."
4. "I could not tell you, unprompted, what a Docker volume is. I can tell you exactly why
   the commerce site's ingredient database has to link every product claim to the evidence
   behind it, because an unsupported skincare claim is a regulatory exposure I understand
   better than most engineers I could hire to write the query."
5. "Building software that runs across seven live clinics means a bug isn't a broken
   build, it's a message that reached a real patient. The log review I do after every
   release is the same reflex as a chart review on the floor, pointed at a release instead
   of a discharge summary."

---

## Sources used (full list)

- [How I use LLMs to help me write code — Simon Willison](https://simonw.substack.com/p/how-i-use-llms-to-help-me-write-code)
- [Simon Willison on ai-assisted-programming](https://simonwillison.net/tags/ai-assisted-programming/)
- [Vibe coding is not the same as AI-Assisted engineering — Addy Osmani](https://medium.com/@addyosmani/vibe-coding-is-not-the-same-as-ai-assisted-engineering-3f81088d5b98)
- [Agentic Engineering — AddyOsmani.com](https://addyosmani.com/blog/agentic-engineering/)
- [Beyond Vibe Coding with Addy Osmani — Pragmatic Engineer (Gergely Orosz)](https://newsletter.pragmaticengineer.com/p/beyond-vibe-coding-with-addy-osmani)
- [How to Tell if a Resume Is AI-Generated — Rezi](https://www.rezi.ai/posts/how-to-tell-if-a-resume-is-ai-generated)
- [How to Tell if a Resume Was Written with AI: 7 Red Flags for 2026 — Enhancv](https://enhancv.com/blog/signs-of-ai-generated-resume/)
- [Yes, You Can Use AI in Our Interviews — Canva Engineering Blog](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)
- [AI Interview Success: An Interviewer's Inside Guide — Canva Engineering Blog](https://www.canva.dev/blog/engineering/ai-interview-success/)
- [Introduction to AI-Enabled Coding Interviews — Hello Interview](https://www.hellointerview.com/learn/ai-coding/overview/introduction)
- [Does YC Still Require a Technical Co-Founder Now That AI Writes Code? — YC Roaster](https://www.ycroaster.com/blog/yc-technical-cofounder-ai-writes-code-2026)
- [How a Non-Programmer Doctor Built 22 Research Automation Skills with Claude Code — Aperivue (Yoojin Nam, M.D.)](https://aperivue.com/en/blog/doctor-built-research-skills-claude-code)
- [Alternative Careers for Doctors: The 2026 Landscape — iatrox.com](https://www.iatrox.com/academy/toolkits/alternative-careers-for-doctors-2026)
- [Clinicians as Builders: How Claude Code Changes Everything](https://www.clinicalproductthinking.com/p/clinicians-as-builders-how-claude)
- [People Are Audaciously Taking Undue Credit For AI-Generated Brainy Outputs — Forbes](https://www.forbes.com/sites/lanceeliot/2026/05/11/people-are-audaciously-and-deceitfully-taking-undue-credit-for-ai-generated-brainy-outputs/)
- [Architectural Decision Records (ADRs)](https://adr.github.io/)
- [Decision Log — Microsoft Engineering Fundamentals Playbook](https://microsoft.github.io/code-with-engineering-playbook/design/design-reviews/decision-log/)
- [Developer Portfolio Projects That Impress Hiring Managers — Refactor Talent](https://refactortalent.com/developer-portfolio-projects-that-impress/)

## What I could not verify (flagged rather than guessed)

- No large-sample academic or journalistic study specifically on "physician-technologist
  career narrative framing" exists that I could find; the genre is thin and mostly
  single-case blog posts. The Aperivue/Nam piece is the strongest single analog found, not
  a validated formula.
- No verified case of an ADR-style portfolio artifact being named by an employer as the
  deciding factor in an actual hire — the practice is widely recommended in
  career-advice/engineering-playbook writing but not backed by a documented outcome I
  could confirm.
- Some AI-generated-resume "red flag" statistics circulating (e.g., "78% of hiring
  managers actively look for personalized details") come from vendor/SEO-content sites
  (KraftCV, Enhancv, The Connors Group) without a visible primary survey methodology.
  Treat the *direction* of these findings as credible (specificity beats buzzwords) but
  do not cite the specific percentages as rigorous statistics in Rejeesh's own writing.
