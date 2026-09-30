import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { AgentProfile, DateResult } from '../src/types';

dotenv.config();

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('API_KEY not found in .env');
}

const ai = new GoogleGenAI({ apiKey });

export function getPairKey(aId: string, bId: string): string {
  return [aId, bId].sort().join('___');
}

async function simulatePair(agentA: AgentProfile, agentB: AgentProfile): Promise<DateResult> {
  const key = getPairKey(agentA.id, agentB.id);

  const prompt = `You are the autonomous dating simulation harness for Cupidly.
Simulate a vivid, grounded first date conversation between these two real autonomous dating agents:

AGENT A: ${agentA.name}
Archetype: ${agentA.archetype}
Headline: ${agentA.headline}
Communication Style: ${agentA.communicationStyle}
Needs: ${agentA.needs.map((n) => n.text).join('; ')}
Hobbies: ${agentA.hobbies.map((h) => h.text).join('; ')}
Interests: ${agentA.interests.map((in_) => in_.text).join('; ')}
Dealbreakers: ${agentA.dealbreakers.map((d) => d.text).join('; ')}
Values: ${agentA.values.map((v) => v.text).join('; ')}

AGENT B: ${agentB.name}
Archetype: ${agentB.archetype}
Headline: ${agentB.headline}
Communication Style: ${agentB.communicationStyle}
Needs: ${agentB.needs.map((n) => n.text).join('; ')}
Hobbies: ${agentB.hobbies.map((h) => h.text).join('; ')}
Interests: ${agentB.interests.map((in_) => in_.text).join('; ')}
Dealbreakers: ${agentB.dealbreakers.map((d) => d.text).join('; ')}
Values: ${agentB.values.map((v) => v.text).join('; ')}

Generate a 6-turn date conversation (3 turns each, alternating starting with Agent A).
For each turn:
- speakerId: "${agentA.id}" or "${agentB.id}"
- speakerName
- dialogue: natural, intellectual, grounded in their real life and work
- innerThought: secret unfiltered reaction to what the other person said or did
- scoreDelta: integer between -6 and +6
- scoreReason: short explanation of why the rating shifted

Then output final verdicts for both agents:
- interest (0-100)
- bestMoment
- friction
- again (boolean)
- mutualScore (0-100)
- chemistryRating ("Electric" | "High" | "Balanced" | "Friction" | "Incompatible")
- dealbreakerTriggered (boolean)
- valuesAlignment (0-100)
- lifestyleCadence (0-100)
- conversationalFlow (0-100)

Return JSON strictly matching schema.`;

  const models = ['gemini-3.1-flash-lite-preview', 'gemini-flash-lite-latest', 'gemini-3.8-flash'];
  let lastErr = null;

  for (const m of models) {
    try {
      const response = await ai.models.generateContent({
        model: m,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              turns: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    turnIndex: { type: Type.INTEGER },
                    speakerId: { type: Type.STRING },
                    speakerName: { type: Type.STRING },
                    dialogue: { type: Type.STRING },
                    innerThought: { type: Type.STRING },
                    scoreDelta: { type: Type.INTEGER },
                    scoreReason: { type: Type.STRING },
                  },
                  required: ['turnIndex', 'speakerId', 'speakerName', 'dialogue', 'innerThought'],
                },
              },
              verdictA: {
                type: Type.OBJECT,
                properties: {
                  interest: { type: Type.INTEGER },
                  bestMoment: { type: Type.STRING },
                  friction: { type: Type.STRING },
                  again: { type: Type.BOOLEAN },
                },
                required: ['interest', 'bestMoment', 'friction', 'again'],
              },
              verdictB: {
                type: Type.OBJECT,
                properties: {
                  interest: { type: Type.INTEGER },
                  bestMoment: { type: Type.STRING },
                  friction: { type: Type.STRING },
                  again: { type: Type.BOOLEAN },
                },
                required: ['interest', 'bestMoment', 'friction', 'again'],
              },
              mutualScore: { type: Type.INTEGER },
              chemistryRating: { type: Type.STRING },
              valuesAlignment: { type: Type.INTEGER },
              lifestyleCadence: { type: Type.INTEGER },
              conversationalFlow: { type: Type.INTEGER },
              dealbreakerTriggered: { type: Type.BOOLEAN },
            },
            required: ['turns', 'verdictA', 'verdictB', 'mutualScore', 'chemistryRating'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      return {
        id: `date_${key}`,
        agentAId: agentA.id,
        agentBId: agentB.id,
        turns: parsed.turns || [],
        verdicts: {
          [agentA.id]: parsed.verdictA || { interest: 70, bestMoment: 'Good chat', friction: 'None', again: true },
          [agentB.id]: parsed.verdictB || { interest: 70, bestMoment: 'Good chat', friction: 'None', again: true },
        },
        mutualScore: parsed.mutualScore || 75,
        chemistryRating: (parsed.chemistryRating as any) || 'Balanced',
        valuesAlignment: parsed.valuesAlignment || 75,
        lifestyleCadence: parsed.lifestyleCadence || 70,
        conversationalFlow: parsed.conversationalFlow || 80,
        dealbreakerTriggered: Boolean(parsed.dealbreakerTriggered),
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  throw lastErr;
}

async function runDates() {
  const profilesPath = path.join(process.cwd(), 'data', 'profiles.json');
  if (!fs.existsSync(profilesPath)) {
    throw new Error('data/profiles.json not found! Run analyze script first.');
  }

  const profiles: AgentProfile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  console.log(`Loaded ${profiles.length} profiles from data/profiles.json`);

  const datesPath = path.join(process.cwd(), 'data', 'dates.json');
  let datesCache: Record<string, DateResult> = {};
  if (fs.existsSync(datesPath)) {
    try {
      datesCache = JSON.parse(fs.readFileSync(datesPath, 'utf8'));
    } catch {}
  }

  const pairs: [AgentProfile, AgentProfile][] = [];
  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      pairs.push([profiles[i], profiles[j]]);
    }
  }

  const uncompleted = pairs.filter(([a, b]) => !datesCache[getPairKey(a.id, b.id)]);
  console.log(`Total pairs: ${pairs.length}. Already cached: ${pairs.length - uncompleted.length}. Remaining: ${uncompleted.length}`);

  const CONCURRENCY = 4;
  for (let i = 0; i < uncompleted.length; i += CONCURRENCY) {
    const chunk = uncompleted.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async ([a, b], idx) => {
        const pairNum = i + idx + 1;
        try {
          const res = await simulatePair(a, b);
          const key = getPairKey(a.id, b.id);
          datesCache[key] = res;
          console.log(`[${pairNum}/${uncompleted.length}] ${a.name} x ${b.name}: mutual=${res.mutualScore} (${res.chemistryRating})`);
        } catch (err: any) {
          console.log(`[${pairNum}/${uncompleted.length}] Failed ${a.name} x ${b.name}: ${err.message}`);
        }
      })
    );

    fs.writeFileSync(datesPath, JSON.stringify(datesCache, null, 2));
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`Dating harness simulation complete! Total dates stored: ${Object.keys(datesCache).length}`);
}

runDates().catch(console.error);
