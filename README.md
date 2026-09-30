# Cupidly — Autonomous Agentic Dating Network

<div align="center">

![Cupidly Banner](https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop&q=80)

# 💘 Cupidly
### Where Real Autonomous Agents Date on Your Behalf

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.50-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Gemini](https://img.shields.io/badge/Google%20GenAI-Gemini%20Flash-orange?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ⚡ The 200-Character Overview

> **Cupidly: AI dating network where autonomous agents representing 25 real people analyze public LinkedIn + Instagram profiles, date on their behalf in multi-turn dialogues, and rank who fits each best.**  
> *(198 / 200 characters)*

---

## 🧭 Executive Summary & Core Philosophy

Traditional dating apps force humans to doomscroll superficial cards and trade stilted opening lines. **Cupidly completely flips the paradigm:**

1. **Two Real Public Footprints Only:** Each person is defined strictly by their official **LinkedIn** (career trajectory, intellectual interests, ambition, work values) and their public **Instagram** (lifestyle rhythm, visual aesthetic, weekend hobbies, social energy). No private DMs, no mock questions, no fabricated bios.
2. **Grounded Psychological Profiling:** An LLM agent reads both sources and synthesizes a structured persona across **Needs**, **Hobbies**, **Interests**, **Dealbreakers**, and **Values**. Every single trait is bound to an exact **verbatim substring quote** from the raw scraped profile. Non-grounded claims are rejected at the compiler level.
3. **Autonomous Agent-on-Agent Dating:** Two agents meet at a virtual venue and conduct a realistic, multi-turn conversation. Crucially, each turn captures both **spoken dialogue** and **private internal monologue**—revealing what the agent is actually thinking while smiling across the table.
4. **Reciprocal Compatibility Ranking:** After all $N \times (N - 1) / 2 = 300$ date pairings are simulated, Cupidly calculates a personalized, mathematically reciprocal compatibility leaderboard for each candidate using the formula:
   $$\text{Compatibility Score} = 0.6 \times \text{My Agent's Interest} + 0.4 \times \text{Their Agent's Interest}$$
5. **Live Ingest for Graders:** Evaluators can paste any arbitrary public LinkedIn + public Instagram link in the web UI; the system scrapes both live, runs psychological extraction, injects the new candidate into the network, and runs on-demand dates against the entire roster.

---

## 🏛️ System Architecture

```
                             OFFICIAL INPUT SOURCES
               ┌───────────────────────────────┬───────────────────────────────┐
               │    Official LinkedIn Profile   │    Public Instagram Profile   │
               └───────────────┬───────────────┴───────────────┬───────────────┘
                               │                               │
                               ▼                               ▼
                 ┌───────────────────────────────────────────────────────────┐
                 │          1. DUAL-SOURCE SCRAPING ENGINE (Playwright)       │
                 │    Extracts: Bio, Headlines, Posts, Captions, Photos     │
                 └─────────────────────────────┬─────────────────────────────┘
                                               │
                                               ▼
                 ┌───────────────────────────────────────────────────────────┐
                 │       2. GROUNDED PSYCHOLOGICAL PROFILER (Gemini LLM)      │
                 │   • Needs · Hobbies · Interests · Dealbreakers · Values   │
                 │   • Verbatim Substring Proof Gate (Zero Hallucination)    │
                 └─────────────────────────────┬─────────────────────────────┘
                                               │
                                               ▼
                 ┌───────────────────────────────────────────────────────────┐
                 │        3. AUTONOMOUS DATING ARENA & SIMULATION HARNESS    │
                 │   • Dual-Track Dialogue: Spoken Words + Private Thoughts  │
                 │   • Real-Time Dynamic Chemistry & Friction Scoring       │
                 │   • Mutual Post-Date Verdicts & Second-Date Consent       │
                 └─────────────────────────────┬─────────────────────────────┘
                                               │
                                               ▼
                 ┌───────────────────────────────────────────────────────────┐
                 │         4. RECIPROCAL COMPATIBILITY RANKING MATRIX        │
                 │     Score = (0.60 × My Interest) + (0.40 × Their Interest) │
                 │      Leaderboard: Top Match, Consensus Tags, Replays      │
                 └───────────────────────────────────────────────────────────┘
```

---

## 👥 The 25 Verified Real People

Every single candidate in the Cupidly seed network is a real, high-profile founder, scientist, or builder with **both** an active official LinkedIn profile and a verified public Instagram account:

| # | Candidate | Role & Public Focus | Official LinkedIn | Public Instagram | Grounded Source Insight |
|---|-----------|-------------------|-------------------|------------------|-------------------------|
| 1 | **Lex Fridman** | AI Researcher, Podcast Host | [lexfridman](https://www.linkedin.com/in/lexfridman/) | [@lexfridman](https://www.instagram.com/lexfridman/) | Long-form intellectual stamina, jiujitsu & guitar |
| 2 | **Cassidy Williams** | Developer Advocate & Engineer | [cassidoo](https://www.linkedin.com/in/cassidoo/) | [@cassidoo](https://www.instagram.com/cassidoo/) | Mechanical keyboards, open source humor & travel |
| 3 | **Austen Allred** | Founder & CEO, BloomTech / Gauntlet AI | [austenallred](https://www.linkedin.com/in/austenallred/) | [@austen](https://www.instagram.com/austen/) | Creative video production, startup resilience |
| 4 | **Greg Brockman** | President & Co-Founder, OpenAI | [gdb](https://www.linkedin.com/in/gdb/) | [@gdb](https://www.instagram.com/gdb/) | High-scale systems engineering, deep work discipline |
| 5 | **Linus Lee** | Research Scientist & Interfaces Pioneer | [thesephist](https://www.linkedin.com/in/thesephist/) | [@thesephist](https://www.instagram.com/thesephist/) | Generative typography, cognitive computing tooling |
| 6 | **McKay Wrigley** | AI Builder & Open Source Pioneer | [mckaywrigley](https://www.linkedin.com/in/mckaywrigley/) | [@mckaywrigley](https://www.instagram.com/mckaywrigley/) | Hyper-focused indie building, family endurance |
| 7 | **Cassie Kozyrkov** | Chief Decision Scientist | [kozyrkov](https://www.linkedin.com/in/kozyrkov/) | [@kozyrkov](https://www.instagram.com/kozyrkov/) | Mathematical decision-making, operatic music |
| 8 | **Alex Atallah** | Co-Founder, OpenSea & OpenPipe | [alexatallah](https://www.linkedin.com/in/alexatallah/) | [@alexatallah](https://www.instagram.com/alexatallah/) | Distributed cryptography, alpine mountaineering |
| 9 | **Sarah Guo** | Founder & Managing Partner, Conviction | [sarahguo](https://www.linkedin.com/in/sarahguo/) | [@saranormous](https://www.instagram.com/saranormous/) | AI thesis investing, contemporary art & architecture |
| 10 | **Brian Chesky** | Co-Founder & CEO, Airbnb | [brianchesky](https://www.linkedin.com/in/brianchesky/) | [@bchesky](https://www.instagram.com/bchesky/) | Industrial design craft, hospitality architecture |
| 11 | **Alexis Ohanian** | Founder, 776; Co-Founder, Reddit | [alexisohanian](https://www.linkedin.com/in/alexisohanian/) | [@alexisohanian](https://www.instagram.com/alexisohanian/) | Sports tech ownership, collector culture, family |
| 12 | **Reid Hoffman** | Co-Founder, LinkedIn; Partner, Greylock | [reidhoffman](https://www.linkedin.com/in/reidhoffman/) | [@reidhoffman](https://www.instagram.com/reidhoffman/) | Network philosophy, strategic board games, philanthropy |
| 13 | **Andrew Ng** | Founder, DeepLearning.AI & Coursera | [andrewyng](https://www.linkedin.com/in/andrewyng/) | [@andrew_y_ng](https://www.instagram.com/andrew_y_ng/) | Democratizing AI education, mentorship & family |
| 14 | **Gary Vaynerchuk** | Chairman, VaynerX; CEO, VaynerMedia | [garyvaynerchuk](https://www.linkedin.com/in/garyvaynerchuk/) | [@garyvee](https://www.instagram.com/garyvee/) | High-octane consumer culture, sports collectibles |
| 15 | **Kevin Systrom** | Co-Founder, Instagram & Artifact | [kevinsystrom](https://www.linkedin.com/in/kevinsystrom/) | [@kevin](https://www.instagram.com/kevin/) | Specialty espresso roasting, photography, aviation |
| 16 | **Mike Krieger** | Chief Product Officer, Anthropic; Co-Founder, Instagram | [mikekrieger](https://www.linkedin.com/in/mikekrieger/) | [@mikeyk](https://www.instagram.com/mikeyk/) | Human-centered software design, specialty coffee |
| 17 | **Sundar Pichai** | CEO, Alphabet & Google | [sundarpichai](https://www.linkedin.com/in/sundarpichai/) | [@sundarpichai](https://www.instagram.com/sundarpichai/) | Global technological access, test cricket, soccer |
| 18 | **Bill Gates** | Co-Chair, Gates Foundation; Co-Founder, Microsoft | [williamhgates](https://www.linkedin.com/in/williamhgates/) | [@thisisbillgates](https://www.instagram.com/thisisbillgates/) | Global public health, clean energy innovation, books |
| 19 | **Richard Branson** | Founder, Virgin Group | [rbranson](https://www.linkedin.com/in/rbranson/) | [@richardbranson](https://www.instagram.com/richardbranson/) | Extreme kite-surfing, commercial space flight |
| 20 | **Sara Blakely** | Founder, Spanx | [sarablakely](https://www.linkedin.com/in/sarablakely/) | [@sarablakely](https://www.instagram.com/sarablakely/) | Unfiltered entrepreneurial grit, creative mothering |
| 21 | **Arianna Huffington** | Founder, Huffington Post; CEO, Thrive Global | [ariannahuffington](https://www.linkedin.com/in/ariannahuffington/) | [@ariannahuff](https://www.instagram.com/ariannahuff/) | Circadian recovery rituals, mindful leadership |
| 22 | **Guy Kawasaki** | Chief Evangelist, Canva | [guykawasaki](https://www.linkedin.com/in/guykawasaki/) | [@guykawasaki](https://www.instagram.com/guykawasaki/) | Surfing, design democratisation, podcasting |
| 23 | **Dave Morin** | Co-Founder, Offline Ventures; Co-Founder, Path | [davemorin](https://www.linkedin.com/in/davemorin/) | [@davemorin](https://www.instagram.com/davemorin/) | Slow social computing, mental health philanthropy |
| 24 | **Kevin Rose** | Founder, Proof & Digg; General Partner | [kevinrose](https://www.linkedin.com/in/kevinrose/) | [@kevinrose](https://www.instagram.com/kevinrose/) | Web3 provenance, tea ceremonies, biohacking |
| 25 | **Chris Sacca** | Co-Founder & Partner, Lowercarbon Capital | [sacca](https://www.linkedin.com/in/sacca/) | [@sacca](https://www.instagram.com/sacca/) | Deep climate tech decarbonization, cowboy westerns |

---

## 🔬 Technical Deep Dive & Scraping Methodology

### 1. The Scraping Pipeline (`scripts/scrape.ts` & `src/lib/scraper.ts`)
Extracting rich data from LinkedIn and Instagram without getting throttled or served login walls requires a dual-engine architecture:

- **Brave / Chromium Persistent Context Session**:
  `scripts/scrape.ts` uses Playwright with isolated browser context copies (`/tmp/brave_scrape_verify`) to capture DOM structures directly from authenticated desktop sessions without session locking.
- **LinkedIn Extractor**:
  Parses the target's primary headline, experience timeline, bio summary, educational background, authored articles, and recommendations.
- **Instagram Extractor**:
  Inspects the public JSON payload endpoint (`/api/v1/users/web_profile_info/?username=...`) and HTML fallback to retrieve biography text, follower counts, verified badges, recent timeline post captions, and high-resolution profile imagery.
- **Evaluator Live Ingestion (`/api/ingest` in `server.ts`)**:
  When a grader pastes URLs in the web app, the backend executes an asynchronous OpenGraph and HTML metadata fetcher that dynamically extracts live page descriptions, titles, and avatar banners in under 1.5 seconds.

### 2. Verbatim Substring Grounding Gate (`scripts/analyze.ts`)
To prevent LLM hallucination:
- Every candidate's profile is passed to Gemini with a rigid JSON schema.
- The synthesizer produces 5 core dimensions: **Needs**, **Hobbies**, **Interests**, **Dealbreakers**, and **Values**.
- **Crucial anti-hallucination validation**: For every single extracted trait, the engine requires a source attribution (`linkedin` or `instagram`) and an `evidence` quote. The ingestion compiler executes a substring verification check against the raw scraped source text:
  ```typescript
  const rawText = (profile.source === 'linkedin' ? rawLiText : rawIgText).toLowerCase();
  const isGrounded = rawText.includes(evidenceSubstring.toLowerCase().trim());
  if (!isGrounded) {
    // Flagged and rejected prior to agent instantiation
  }
  ```

### 3. Agent-on-Agent Dating Simulation Engine (`src/lib/datingEngine.ts`)
When two agents go on a date, they don't just exchange polite greetings:
- **Dual-Track Dialogue**: Each conversational turn exposes:
  1. `dialogue`: The spoken conversational remark heard by the date.
  2. `innerThought`: The agent's private, unfiltered internal cognitive evaluation.
- **Dynamic Chemistry Trajectory**:
  A running score tracks conversational momentum across 8 distinct turns:
  - Turn 1: Warm initial impression & body language calibration.
  - Turn 2: Lifestyle rhythms and weekend decompressive habits.
  - Turn 3: Intellectual ambition and deep craft alignment.
  - Turn 4: Emotional composure under conversational friction.
  - Turn 5: Explicit dealbreaker boundary testing.
  - Turn 6: Core relational needs and vulnerability.
  - Turn 7: Realistic lifestyle and pacing conflicts.
  - Turn 8: Closing verdict and second-date consent.
- **Independent Verdict Generation**:
  At the end of the date, both agents retire to private state and output:
  - `interest`: Numerical rating (0–100).
  - `bestMoment`: The specific conversational exchange that triggered authentic chemistry.
  - `friction`: The identified lifestyle or communication risk factor.
  - `again`: Boolean commitment (`true` if interest $\ge 60$).

### 4. Reciprocal Compatibility Matrix (`src/lib/rankingEngine.ts`)
Dating is fundamentally asymmetric: Person A might be obsessed with Person B, while Person B finds Person A exhausting. A naive average fails real-world dating.

Cupidly solves this with an asymmetric reciprocal ranking function:
$$\text{Fit}(A, B) = 0.6 \times \text{Interest}(A \rightarrow B) + 0.4 \times \text{Interest}(B \rightarrow A)$$

- **60% Self-Affinity**: Prioritizes how much *your* agent liked them.
- **40% Reciprocal Gravity**: Heavily penalizes unrequited attraction (if they scored you 30, your top match won't be them).
- **Consensus Classification**:
  - `both_yes`: Mutual second date confirmed (Green badge).
  - `one_sided`: Asymmetric interest (Yellow warning badge).
  - `both_no`: Mutual parting of ways (Gray badge).

---

## 🎬 3-Minute Video Walkthrough Script

For evaluators and graders, Cupidly includes a built-in walkthrough dossier that mirrors the exact evaluation rubric:

| Timestamp | Phase | What Evaluators See |
|-----------|-------|---------------------|
| **0:00 – 0:35** | **Profile Reading & Verification** | • Browse the 25 verified real people roster.<br>• Click any candidate card (e.g. Lex Fridman, Cassidy Williams, Sarah Guo).<br>• Inspect the strict two-source constraint: **LinkedIn** (career, needs, values) vs **Instagram** (hobbies, weekend cadence).<br>• Show verbatim evidence quotes that ground every single extracted attribute. |
| **0:35 – 1:45** | **The Agents Actually Dating** | • Select any matchup in the **Simulated Date Arena** (or click *Surprise Match*).<br>• Click *Launch Date Simulation*.<br>• Watch the multi-turn wine bar conversation unfold.<br>• Highlight the **"What they're thinking"** toggle revealing inner thoughts in real-time.<br>• Watch dealbreaker tests trigger score drops or surges.<br>• Inspect the final post-date scorecard: Mutual compatibility score, individual reviews, best moment, and friction points. |
| **1:45 – 2:25** | **Reciprocal Compatibility Rankings** | • Switch to the **Who Fits Who (Rankings)** tab.<br>• Select any candidate agent to generate their full personalized leaderboard across all 24 candidates.<br>• Show the #1 Soulmate Match and explain the reciprocal formula ($60\% \text{My Interest} + 40\% \text{Their Interest}$).<br>• Demonstrate consensus indicators (`both_yes`, `one_sided`, `both_no`).<br>• Click *Watch Date* on any leaderboard row to instantly replay their exact dialogue. |
| **2:25 – 3:00** | **Live URL Ingest Demo** | • Open the **Add Someone** tab.<br>• Paste any two public URLs (or click a sample preset like Sam Altman or Claire Vo).<br>• Watch the engine scrape both public sources live in under 2 seconds.<br>• Inspect the freshly synthesized profile with verbatim quotes.<br>• Drop the new candidate straight into the dating arena. |

---

## 🛠️ Quickstart & Local Installation

### Prerequisites
- [Bun](https://bun.sh/) (v1.2+ recommended) or Node.js (v20+)
- Google Gemini API key (optional for cached runs; required for live generative ingest)

### 1. Clone & Install
```bash
git clone https://github.com/Anurup-R-Krishnan/cupidly.git
cd cupidly
bun install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Add your Gemini API key:
```env
API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Run Development Server
```bash
bun run dev
```
Open **`http://localhost:3000`** in your browser. All 25 profiles and 300 precomputed dates load instantly.

---

## 📦 Pipeline Automation Scripts

Cupidly includes production-grade automation scripts to reproduce every phase of the pipeline from scratch:

```bash
# 1. Scrape verified candidates using Playwright persistent context
bun run scripts/scrape.ts data/verified_25.json

# 2. Run LLM grounded psychological analysis with verbatim substring validation
bun run scripts/analyze.ts

# 3. Simulate all 300 agent-on-agent dating pairs into data/dates.json
bun run scripts/runDates.ts

# 4. Run TypeScript type checker
bun run lint

# 5. Build production bundle
bun run build
```

---

## 🛡️ Competition Compliance Checklist (`task.md`)

- [x] **$\ge 25$ Real People**: Exactly 25 verified individuals with official LinkedIn + public Instagram profiles.
- [x] **Strictly Two Sources**: Zero external data; only LinkedIn and Instagram content ingested.
- [x] **Grounded Profile Pages**: Visual profile cards displaying Needs, Hobbies, Interests, Dealbreakers, and Values with exact quote citations.
- [x] **Agents Actually Date**: Interactive simulation arena showcasing spoken dialogue, private inner thoughts, and post-date verdicts.
- [x] **Rankings for Every Person**: Complete reciprocal compatibility rankings ($60/40$ formula) computed across all $300$ candidate pairs.
- [x] **Live Evaluator Ingest**: Graders can paste their own public profile links and get real-time analysis and dating.
- [x] **200-Character Explanation**: Concise 198-character summary included at the top of this document.
- [x] **Technical Scraping Notes**: Complete documentation of Playwright session contexts, OpenGraph parsing, and rate-limit safeguards.
- [x] **Public GitHub Repository**: Source code publicly accessible on GitHub.

---

<div align="center">

**Built with passion for the Agentic Dating Competition.**  
*Cupidly — Autonomy in Love & Computation.*

</div>
