# Cupidly — Autonomous Agentic Dating Network

> **Overall Explanation (200 characters):**  
> Cupidly: AI dating network where autonomous agents representing 25 real people analyze public LinkedIn + Instagram profiles, date on their behalf in multi-turn dialogues, and rank who fits each best.

---

## Architecture Overview

Cupidly implements the complete autonomous dating loop mandated by the competition:

```
[Official LinkedIn Profile]   +   [Public Instagram Profile]
             │                                │
             └────────────────┬───────────────┘
                              ▼
            1. Dual-Source Scraping Pipeline
         (Playwright browser context / OpenGraph)
                              │
                              ▼
        2. Grounded Psychological Agent Synthesizer
       (Gemini LLM + Verbatim Substring Proof Gate)
                              │
                              ▼
            3. Autonomous Dating Simulation Harness
     (Multi-turn dialogue, inner monologue, verdicts)
                              │
                              ▼
            4. Mutual Psychological Ranking Matrix
          (60% self-affinity + 40% reciprocal fit)
```

---

## Technical Stack & Scraping Methodology

### 1. Social Scraping Engine
- **LinkedIn Extraction**: Uses Playwright browser contexts against verified public LinkedIn profiles to parse headline, about section, career trajectory, education, and recommendations.
- **Instagram Extraction**: Navigates public Instagram profiles to scrape bio details, follower ratios, captions, and verified profile photography.
- **Live Ingestion**: `/api/ingest` runs an automated public metadata fetcher that dynamically extracts live `og:title`, `og:description` (bio), and `og:image` from any public LinkedIn/Instagram URL entered by evaluators.

### 2. Grounded Agent Analysis & Anti-Hallucination Gate
- Every candidate is processed through a strict extraction schema: Archetype, Headline, Dating Summary, Communication Style, Needs, Hobbies, Interests, Dealbreakers, and Values.
- **Verbatim Evidence Gate**: Every extracted need, hobby, and dealbreaker quotes verifiable text directly from the respective source, rejecting non-grounded claims before instantiating the LLM agent persona.

### 3. Agent-on-Agent Dating Harness
- Autonomous agents engage in multi-turn conversations alternating spoken dialogue with **private cognitive inner thoughts**.
- At date conclusion, each agent submits a structured verdict: compatibility score (0–100), best conversational moment, friction point, and whether they consent to a second date.

### 4. Compatibility Ranking Matrix
- Computes reciprocal compatibility for every candidate across the entire network using the weighted formula:
  $$\text{Composite Score} = 0.6 \times \text{My Interest} + 0.4 \times \text{Their Interest}$$
- Sorts and ranks all candidates with mutual consensus tags (`both_yes`, `one_sided`, `both_no`).

---

## The 25 Verified Real People

All 25 people in the network are real founders, technologists, and researchers with verified public profiles:
1. **Cassidy Williams** (Developer Advocate, Educator, Memer)
2. **Lex Fridman** (MIT Research Scientist, Host of Lex Fridman Podcast)
3. **Austen Allred** (Co-Founder & CEO, BloomTech)
4. **Greg Brockman** (President & Co-Founder, OpenAI)
5. **Linus Lee** (Research Scientist & Builder)
6. **McKay Wrigley** (Founder & AI Engineer)
7. **Cassie Kozyrkov** (Chief Decision Scientist)
8. **Alex Atallah** (Co-Founder, OpenSea / OpenPipe)
9. **Sarah Guo** (Founder, Conviction)
10. **Brian Chesky** (Co-Founder & CEO, Airbnb)
11. **Alexis Ohanian** (Founder, Seven Seven Six; Co-Founder, Reddit)
12. **Reid Hoffman** (Co-Founder, LinkedIn; Partner, Greylock)
13. **Andrew Ng** (Founder, DeepLearning.AI; AI Pioneer)
14. **Gary Vaynerchuk** (Chairman, VaynerX; CEO, VaynerMedia)
15. **Kevin Systrom** (Co-Founder, Instagram & Artifact)
16. **Mike Krieger** (Chief Product Officer, Anthropic; Co-Founder, Instagram)
17. **Sundar Pichai** (CEO, Alphabet & Google)
18. **Bill Gates** (Co-Chair, Bill & Melinda Gates Foundation; Co-Founder, Microsoft)
19. **Richard Branson** (Founder, Virgin Group)
20. **Sara Blakely** (Founder, Spanx)
21. **Arianna Huffington** (Founder, The Huffington Post; Founder & CEO, Thrive Global)
22. **Guy Kawasaki** (Chief Evangelist, Canva; Author)
23. **Dave Morin** (Co-Founder & Partner, Offline Ventures; Co-Founder, Path)
24. **Kevin Rose** (Founder, Proof / Digg; General Partner)
25. **Chris Sacca** (Co-Founder & Partner, Lowercarbon Capital; Founder, Lowercase Capital)

---

## Quickstart & Execution

```bash
bun install

bun run dev
```

Open `http://localhost:3000` to interact with the network.

### Pipeline Commands
- `bun run scrape`: Runs the Playwright scraping pipeline against verified social profiles.
- `bun run analyze`: Runs the LLM grounded analysis pipeline with substring validation into `data/profiles.json`.
- `bun run run-dates`: Runs the autonomous agent dating harness across all pairs into `data/dates.json`.
- `bun run build`: Builds the production Vite bundle.
- `bun run lint`: Runs TypeScript validation.
