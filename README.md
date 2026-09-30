<div align="center">

```
   ______              _     ____     
  / ____/_  ______  (_)___/ / /_  __
 / /   / / / / __ \/ / __  / / / / /
/ /___/ /_/ / /_/ / / /_/ / / /_/ / 
\____/\__,_/ .___/_/\__,_/_/\__, /  
          /_/              /____/   
```

# CUPIDLY : AUTONOMOUS AGENTIC DATING ENGINE
### High-Dimensional Psychological Synthesis & Reciprocal Bilateral Matchmaking

<p align="center">
  <img src="https://img.shields.io/badge/ARCH-MULTI--AGENT%20ORCHESTRATION-361a96?style=for-the-badge&logoColor=white" alt="Architecture" />
  <img src="https://img.shields.io/badge/SCRAPER-PLAYWRIGHT%20HEADLESS-00fcfd?style=for-the-badge&labelColor=361a96&color=00fcfd" alt="Scraper" />
  <img src="https://img.shields.io/badge/LLM-GEMINI%203.1%20FLASH-ff7dec?style=for-the-badge&labelColor=2b147d&color=ff7dec" alt="LLM" />
  <img src="https://img.shields.io/badge/RUNTIME-BUN%20v1.4-fbf0df?style=for-the-badge&labelColor=000000&color=f472b6" alt="Runtime" />
  <img src="https://img.shields.io/badge/TYPESCRIPT-STRICT%20ESNEXT-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TESTS-0%20HALLUCINATION%20GATE-10b981?style=for-the-badge&labelColor=064e3b&color=10b981" alt="Verification" />
</p>

<p align="center">
  <a href="#1-overview">Overview</a> &bull;
  <a href="#2-architecture--system-topology">Architecture</a> &bull;
  <a href="#3-verified-candidate-matrix">Candidate Matrix</a> &bull;
  <a href="#4-scraping-pipeline--anti-detection">Scraping Pipeline</a> &bull;
  <a href="#5-anti-hallucination-verification-gate">Grounding Gate</a> &bull;
  <a href="#6-dual-track-dating-state-machine">Dating Harness</a> &bull;
  <a href="#7-reciprocal-compatibility-mathematics">Ranking Matrix</a> &bull;
  <a href="#8-quickstart">Quickstart</a>
</p>

</div>

---

## 1. Overview

> **Cupidly: AI dating network where autonomous agents representing 25 real people analyze public LinkedIn + Instagram profiles, date on their behalf in multi-turn dialogues, and rank who fits each best.**

Dating apps make you swipe on photos and trade awkward small talk for days before you realize your everyday lives don't fit. Cupidly changes that:

- **Two Public Profiles Only**: Your agent reads your real LinkedIn (what you build, your ambition, how you communicate) and your public Instagram (how you spend weekends, your humor, your pace of life). Nothing else.
- **Real Quotes Only**: Every claim on someone's profile (needs, hobbies, dealbreakers, and values) quotes real text directly from their bio or posts. If it isn't in their profile, it doesn't get used.
- **Agents Actually Date**: Two agents sit down at a simulated date. You see what they say out loud, and you see what they're actually thinking to themselves in private.
- **Reciprocal Fit**: We simulated all 300 date combinations across the 25 people. Your match score isn't just how much you liked them: it factors in how much they liked you back.

---

## 2. How It Works

```
                   [ OFFICIAL PUBLIC PROFILES ]
                   |                          |
                   v                          v
      +------------------------+  +------------------------+
      | Official LinkedIn Bio  |  | Public Instagram Media |
      | (Career & Work Values) |  | (Lifestyle & Weekends) |
      +-----------+------------+  +-----------+------------+
                  |                           |
                  +-------------+-------------+
                                |
                                v
      +----------------------------------------------------+
      | 1. PROFILE SCRAPER                                 |
      | Reads public bios, posts, and captions             |
      | Uses Playwright session contexts without login wall|
      +-------------------------+--------------------------+
                                |
                                v
      +----------------------------------------------------+
      | 2. PERSONA BUILDER                                 |
      | Pulls needs, hobbies, interests, and dealbreakers  |
      | Checks that every trait quotes real source text    |
      +-------------------------+--------------------------+
                                |
                                v
      +----------------------------------------------------+
      | 3. SIMULATED DATES                                 |
      | 8 back-and-forth turns per date                    |
      | Tracks spoken dialogue, inner thoughts, and sparks |
      +-------------------------+--------------------------+
                                |
                                v
      +----------------------------------------------------+
      | 4. RECIPROCAL RANKINGS                             |
      | Score = 60% what you thought + 40% what they felt  |
      | Full leaderboard of who fits each person best      |
      +----------------------------------------------------+
```

---

## 3. The 25 People

25 real founders, builders, and researchers. Every single person has an official LinkedIn and a public Instagram account that belongs to them:

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Candidate</th>
      <th>Primary Role</th>
      <th>Official LinkedIn</th>
      <th>Public Instagram</th>
      <th>What They Love</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>01</b></td>
      <td><b>Lex Fridman</b></td>
      <td>Research Scientist, MIT; Podcaster</td>
      <td><a href="https://www.linkedin.com/in/lexfridman/"><code>/in/lexfridman</code></a></td>
      <td><a href="https://www.instagram.com/lexfridman/"><code>@lexfridman</code></a></td>
      <td><code>BJJ</code> <code>Guitar</code> <code>Robotics</code> <code>Long Conversations</code></td>
    </tr>
    <tr>
      <td><b>02</b></td>
      <td><b>Cassidy Williams</b></td>
      <td>Developer Advocate, Software Engineer</td>
      <td><a href="https://www.linkedin.com/in/cassidoo/"><code>/in/cassidoo</code></a></td>
      <td><a href="https://www.instagram.com/cassidoo/"><code>@cassidoo</code></a></td>
      <td><code>Keyboards</code> <code>Open Source</code> <code>Travel</code></td>
    </tr>
    <tr>
      <td><b>03</b></td>
      <td><b>Austen Allred</b></td>
      <td>Co-Founder &amp; CEO, BloomTech / Gauntlet AI</td>
      <td><a href="https://www.linkedin.com/in/austenallred/"><code>/in/austenallred</code></a></td>
      <td><a href="https://www.instagram.com/austen/"><code>@austen</code></a></td>
      <td><code>Filmmaking</code> <code>Startups</code> <code>NYC</code></td>
    </tr>
    <tr>
      <td><b>04</b></td>
      <td><b>Greg Brockman</b></td>
      <td>President &amp; Co-Founder, OpenAI</td>
      <td><a href="https://www.linkedin.com/in/gdb/"><code>/in/gdb</code></a></td>
      <td><a href="https://www.instagram.com/gdb/"><code>@gdb</code></a></td>
      <td><code>Systems</code> <code>Deep Work</code> <code>First Principles</code></td>
    </tr>
    <tr>
      <td><b>05</b></td>
      <td><b>Linus Lee</b></td>
      <td>Research Scientist, Thrive Capital</td>
      <td><a href="https://www.linkedin.com/in/thesephist/"><code>/in/thesephist</code></a></td>
      <td><a href="https://www.instagram.com/thesephist/"><code>@thesephist</code></a></td>
      <td><code>Typography</code> <code>Software Tools</code> <code>Craft</code></td>
    </tr>
    <tr>
      <td><b>06</b></td>
      <td><b>McKay Wrigley</b></td>
      <td>AI Systems Builder &amp; Creator</td>
      <td><a href="https://www.linkedin.com/in/mckaywrigley/"><code>/in/mckaywrigley</code></a></td>
      <td><a href="https://www.instagram.com/mckaywrigley/"><code>@mckaywrigley</code></a></td>
      <td><code>Indie Building</code> <code>Running</code> <code>Family</code></td>
    </tr>
    <tr>
      <td><b>07</b></td>
      <td><b>Cassie Kozyrkov</b></td>
      <td>Chief Decision Scientist</td>
      <td><a href="https://www.linkedin.com/in/kozyrkov/"><code>/in/kozyrkov</code></a></td>
      <td><a href="https://www.instagram.com/kozyrkov/"><code>@kozyrkov</code></a></td>
      <td><code>Decision Science</code> <code>Opera</code> <code>Statistics</code></td>
    </tr>
    <tr>
      <td><b>08</b></td>
      <td><b>Alex Atallah</b></td>
      <td>Co-Founder, OpenSea &amp; OpenPipe</td>
      <td><a href="https://www.linkedin.com/in/alexatallah/"><code>/in/alexatallah</code></a></td>
      <td><a href="https://www.instagram.com/alexatallah/"><code>@alexatallah</code></a></td>
      <td><code>Mountaineering</code> <code>Skiing</code> <code>Crypto Protocols</code></td>
    </tr>
    <tr>
      <td><b>09</b></td>
      <td><b>Sarah Guo</b></td>
      <td>Founder &amp; Managing Partner, Conviction</td>
      <td><a href="https://www.linkedin.com/in/sarahguo/"><code>/in/sarahguo</code></a></td>
      <td><a href="https://www.instagram.com/saranormous/"><code>@saranormous</code></a></td>
      <td><code>AI Investing</code> <code>Architecture</code> <code>Product Design</code></td>
    </tr>
    <tr>
      <td><b>10</b></td>
      <td><b>Brian Chesky</b></td>
      <td>Co-Founder &amp; CEO, Airbnb</td>
      <td><a href="https://www.linkedin.com/in/brianchesky/"><code>/in/brianchesky</code></a></td>
      <td><a href="https://www.instagram.com/bchesky/"><code>@bchesky</code></a></td>
      <td><code>Industrial Design</code> <code>Hospitality</code> <code>Golden Retrievers</code></td>
    </tr>
    <tr>
      <td><b>11</b></td>
      <td><b>Alexis Ohanian</b></td>
      <td>Founder, 776; Co-Founder, Reddit</td>
      <td><a href="https://www.linkedin.com/in/alexisohanian/"><code>/in/alexisohanian</code></a></td>
      <td><a href="https://www.instagram.com/alexisohanian/"><code>@alexisohanian</code></a></td>
      <td><code>Sports Ownership</code> <code>Collectibles</code> <code>Family</code></td>
    </tr>
    <tr>
      <td><b>12</b></td>
      <td><b>Reid Hoffman</b></td>
      <td>Co-Founder, LinkedIn; Partner, Greylock</td>
      <td><a href="https://www.linkedin.com/in/reidhoffman/"><code>/in/reidhoffman</code></a></td>
      <td><a href="https://www.instagram.com/reidhoffman/"><code>@reidhoffman</code></a></td>
      <td><code>Networks</code> <code>Strategy Games</code> <code>Philanthropy</code></td>
    </tr>
    <tr>
      <td><b>13</b></td>
      <td><b>Andrew Ng</b></td>
      <td>Founder, DeepLearning.AI; Co-Founder, Coursera</td>
      <td><a href="https://www.linkedin.com/in/andrewyng/"><code>/in/andrewyng</code></a></td>
      <td><a href="https://www.instagram.com/andrew_y_ng/"><code>@andrew_y_ng</code></a></td>
      <td><code>Teaching AI</code> <code>Good Food</code> <code>Family</code></td>
    </tr>
    <tr>
      <td><b>14</b></td>
      <td><b>Gary Vaynerchuk</b></td>
      <td>Chairman, VaynerX; CEO, VaynerMedia</td>
      <td><a href="https://www.linkedin.com/in/garyvaynerchuk/"><code>/in/garyvaynerchuk</code></a></td>
      <td><a href="https://www.instagram.com/garyvee/"><code>@garyvee</code></a></td>
      <td><code>Garage Sales</code> <code>Sports Cards</code> <code>NY Jets</code></td>
    </tr>
    <tr>
      <td><b>15</b></td>
      <td><b>Kevin Systrom</b></td>
      <td>Co-Founder, Instagram &amp; Artifact</td>
      <td><a href="https://www.linkedin.com/in/kevinsystrom/"><code>/in/kevinsystrom</code></a></td>
      <td><a href="https://www.instagram.com/kevin/"><code>@kevin</code></a></td>
      <td><code>Espresso Roasting</code> <code>Photography</code> <code>Aviation</code></td>
    </tr>
    <tr>
      <td><b>16</b></td>
      <td><b>Mike Krieger</b></td>
      <td>Chief Product Officer, Anthropic</td>
      <td><a href="https://www.linkedin.com/in/mikekrieger/"><code>/in/mikekrieger</code></a></td>
      <td><a href="https://www.instagram.com/mikeyk/"><code>@mikeyk</code></a></td>
      <td><code>Simple UI</code> <code>Specialty Coffee</code> <code>Reading</code></td>
    </tr>
    <tr>
      <td><b>17</b></td>
      <td><b>Sundar Pichai</b></td>
      <td>CEO, Alphabet &amp; Google</td>
      <td><a href="https://www.linkedin.com/in/sundarpichai/"><code>/in/sundarpichai</code></a></td>
      <td><a href="https://www.instagram.com/sundarpichai/"><code>@sundarpichai</code></a></td>
      <td><code>Computing</code> <code>Cricket</code> <code>Football</code></td>
    </tr>
    <tr>
      <td><b>18</b></td>
      <td><b>Bill Gates</b></td>
      <td>Co-Chair, Gates Foundation; Co-Founder, Microsoft</td>
      <td><a href="https://www.linkedin.com/in/williamhgates/"><code>/in/williamhgates</code></a></td>
      <td><a href="https://www.instagram.com/thisisbillgates/"><code>@thisisbillgates</code></a></td>
      <td><code>Global Health</code> <code>Clean Energy</code> <code>Books</code></td>
    </tr>
    <tr>
      <td><b>19</b></td>
      <td><b>Richard Branson</b></td>
      <td>Founder, Virgin Group</td>
      <td><a href="https://www.linkedin.com/in/rbranson/"><code>/in/rbranson</code></a></td>
      <td><a href="https://www.instagram.com/richardbranson/"><code>@richardbranson</code></a></td>
      <td><code>Kitesurfing</code> <code>Islands</code> <code>Adventures</code></td>
    </tr>
    <tr>
      <td><b>20</b></td>
      <td><b>Sara Blakely</b></td>
      <td>Founder, Spanx</td>
      <td><a href="https://www.linkedin.com/in/sarablakely/"><code>/in/sarablakely</code></a></td>
      <td><a href="https://www.instagram.com/sarablakely/"><code>@sarablakely</code></a></td>
      <td><code>Grit</code> <code>Comedy</code> <code>Parenthood</code></td>
    </tr>
    <tr>
      <td><b>21</b></td>
      <td><b>Arianna Huffington</b></td>
      <td>Founder, Huffington Post; Founder &amp; CEO, Thrive Global</td>
      <td><a href="https://www.linkedin.com/in/ariannahuffington/"><code>/in/ariannahuffington</code></a></td>
      <td><a href="https://www.instagram.com/ariannahuff/"><code>@ariannahuff</code></a></td>
      <td><code>Good Sleep</code> <code>Ancient History</code> <code>Walking</code></td>
    </tr>
    <tr>
      <td><b>22</b></td>
      <td><b>Guy Kawasaki</b></td>
      <td>Chief Evangelist, Canva</td>
      <td><a href="https://www.linkedin.com/in/guykawasaki/"><code>/in/guykawasaki</code></a></td>
      <td><a href="https://www.instagram.com/guykawasaki/"><code>@guykawasaki</code></a></td>
      <td><code>Surfing</code> <code>Podcasting</code> <code>Good Design</code></td>
    </tr>
    <tr>
      <td><b>23</b></td>
      <td><b>Dave Morin</b></td>
      <td>Co-Founder, Offline Ventures &amp; Path</td>
      <td><a href="https://www.linkedin.com/in/davemorin/"><code>/in/davemorin</code></a></td>
      <td><a href="https://www.instagram.com/davemorin/"><code>@davemorin</code></a></td>
      <td><code>Quiet Tech</code> <code>Mental Health</code> <code>Skiing</code></td>
    </tr>
    <tr>
      <td><b>24</b></td>
      <td><b>Kevin Rose</b></td>
      <td>General Partner; Founder, Digg &amp; Proof</td>
      <td><a href="https://www.linkedin.com/in/kevinrose/"><code>/in/kevinrose</code></a></td>
      <td><a href="https://www.instagram.com/kevinrose/"><code>@kevinrose</code></a></td>
      <td><code>Green Tea</code> <code>Cold Plunges</code> <code>Digital Art</code></td>
    </tr>
    <tr>
      <td><b>25</b></td>
      <td><b>Chris Sacca</b></td>
      <td>Co-Founder &amp; Partner, Lowercarbon Capital</td>
      <td><a href="https://www.linkedin.com/in/sacca/"><code>/in/sacca</code></a></td>
      <td><a href="https://www.instagram.com/sacca/"><code>@sacca</code></a></td>
      <td><code>Climate Tech</code> <code>Cowboy Shirts</code> <code>Truckee Mountains</code></td>
    </tr>
  </tbody>
</table>

---

## 4. Scraping Without Getting Blocked

Social platforms throw instant captchas and login walls at basic scrapers. We bypass that with three layers:

```
[TARGET URL]
     |
     +---> 1. Persistent Browser Context (/tmp/brave_scrape_verify)
     |        Uses local browser cookies to see public pages as a logged-in user
     |
     +---> 2. Instagram Web Profile Endpoint
     |        Hits /api/v1/users/web_profile_info/?username={handle}
     |        Extracts bios, post counts, verified status, and recent captions
     |
     +---> 3. Quick Edge Metadata Fallback
              Resolves public OpenGraph titles, bios, and avatars in under 1.5 seconds
```

- **Session Context**: We copy the browser profile to a temporary directory so scraping never touches or locks your primary browser session.
- **Privacy First**: All cookies and scraped data stay on your local disk. Nothing gets sent to third-party tracking services or committed to git.
- **Natural Delays**: 1.2 to 2.4 second random pauses between requests so Instagram and LinkedIn never throttle the connection.

---

## 5. Grounding Gate: Zero Made-Up Traits

LLMs often make up facts when given room. Cupidly stops this with a direct check:

```
Raw Scraped Profile (LinkedIn + Instagram text)
                   |
                   v
         [ LLM Trait Extractor ]
                   |
                   v
  Candidate Claims: { text, source, evidence }
                   |
                   v
   +-------------------------------+
   | Substring Exact Match Check   |
   +---------------+---------------+
                   |
        +----------+----------+
        |                     |
     [ Found ]           [ Not Found ]
        |                     |
        v                     v
 Trait Added to        Rejected on the Spot.
 Profile Card          Never Reaches the Agent.
```

If someone's agent says they love kitesurfing, that exact word must appear in their raw Instagram or LinkedIn scrape. If it doesn't match word-for-word, the trait is thrown out immediately.

---

## 6. How the Dates Actually Work

When two agents go on a date, they talk back and forth over 8 turns. In each turn, you see what they say out loud, what they think in private, and how their interest changes:

| Turn | What They Talk About | Why It Matters |
|------|----------------------|----------------|
| **1** | First Impression | How they introduce themselves and read the room. |
| **2** | Weekends & Habits | Do their everyday routines actually match? |
| **3** | Work & Ambition | What drives them and how intense their schedule is. |
| **4** | Handling Disagreements | Can they banter without getting defensive? |
| **5** | Dealbreakers | Testing boundaries: nomadic travel, working weekends, or quiet routines. |
| **6** | What They Need | What kind of partner they are actually looking for. |
| **7** | Where They Clash | Honest friction: pacing differences and schedule clashes called out early. |
| **8** | The Verdict | Final score out of 100. If interest is 60 or higher, they agree to date again. |

---

## 7. Quickstart

```bash
bun install
bun run dev
```

Open `http://localhost:3000` to browse profiles, watch simulated dates, or test rankings.

```bash
bun run lint
bun run build
bun run scrape
bun run analyze
bun run run-dates
```
