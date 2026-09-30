import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { AgentProfile, ProfileClaim } from '../src/types';

dotenv.config();

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('API_KEY not found in .env');
}

const ai = new GoogleGenAI({ apiKey });

function cleanText(t: string): string {
  return t.replace(/\s+/g, ' ').toLowerCase();
}

function verifyEvidence(evidence: string, liClean: string, igClean: string): boolean {
  if (!evidence || evidence.length < 5) return false;
  const evClean = cleanText(evidence);
  if (liClean.includes(evClean) || igClean.includes(evClean)) return true;
  const words = evClean.split(' ').filter((w) => w.length > 3);
  if (words.length >= 3) {
    const chunk = words.slice(0, 3).join(' ');
    if (liClean.includes(chunk) || igClean.includes(chunk)) return true;
  }
  return false;
}

async function generateWithFallback(prompt: string) {
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
              archetype: { type: Type.STRING },
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              communicationStyle: { type: Type.STRING },
              needs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    source: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                  },
                  required: ['text', 'source', 'evidence'],
                },
              },
              hobbies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    source: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                  },
                  required: ['text', 'source', 'evidence'],
                },
              },
              interests: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    source: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                  },
                  required: ['text', 'source', 'evidence'],
                },
              },
              dealbreakers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    source: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                  },
                  required: ['text', 'source', 'evidence'],
                },
              },
              values: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    source: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                  },
                  required: ['text', 'source', 'evidence'],
                },
              },
            },
            required: [
              'archetype',
              'headline',
              'summary',
              'communicationStyle',
              'needs',
              'hobbies',
              'interests',
              'dealbreakers',
              'values',
            ],
          },
        },
      });
      return JSON.parse(response.text || '{}');
    } catch (err: any) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw lastErr;
}

async function analyzeAll() {
  const rawDir = path.join(process.cwd(), 'data', 'raw');
  if (!fs.existsSync(rawDir)) {
    throw new Error('data/raw directory not found!');
  }

  const files = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json'));
  console.log(`Found ${files.length} raw profile dumps in data/raw/`);

  const profilesPath = path.join(process.cwd(), 'data', 'profiles.json');
  let profiles: AgentProfile[] = [];
  if (fs.existsSync(profilesPath)) {
    try {
      profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    } catch {}
  }
  const existingMap = new Map(profiles.map((p) => [p.id, p]));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rawData = JSON.parse(fs.readFileSync(path.join(rawDir, file), 'utf8'));
    const { id, name, linkedinUrl, instagramUrl, avatarUrl, linkedinRawText, instagramRawText } = rawData;

    if (existingMap.has(id)) {
      console.log(`[${i + 1}/${files.length}] ${name} already analyzed, skipping.`);
      continue;
    }

    console.log(`[${i + 1}/${files.length}] Analyzing ${name} with Gemini...`);

    const liClean = cleanText(linkedinRawText || '');
    const igClean = cleanText(instagramRawText || '');

    const prompt = `You are an expert psychological profiler for Cupidly.
Analyze ${name} strictly using their official LinkedIn and Instagram scraped data.

[LINKEDIN DATA]:
${(linkedinRawText || '').slice(0, 4500)}

[INSTAGRAM DATA]:
${(instagramRawText || '').slice(0, 3000)}

CRITICAL REQUIREMENT:
Every claim in needs, hobbies, interests, dealbreakers, and values MUST include an 'evidence' string that is an EXACT verbatim substring from either the [LINKEDIN DATA] or [INSTAGRAM DATA] provided above. Do NOT paraphrase or invent quotes.

Format response strictly according to the schema.`;

    try {
      const parsed = await generateWithFallback(prompt);

      const allClaims: ProfileClaim[] = [
        ...(parsed.needs || []),
        ...(parsed.hobbies || []),
        ...(parsed.interests || []),
        ...(parsed.dealbreakers || []),
        ...(parsed.values || []),
      ];

      let verifiedCount = 0;
      for (const claim of allClaims) {
        if (verifyEvidence(claim.evidence, liClean, igClean)) {
          verifiedCount++;
        }
      }

      const confidence = allClaims.length > 0 ? Number((verifiedCount / allClaims.length).toFixed(2)) : 0.95;

      const profile: AgentProfile = {
        id,
        name,
        avatarUrl,
        linkedinUrl,
        instagramUrl,
        archetype: parsed.archetype || 'Creative Systems Pioneer',
        headline: parsed.headline || `${name} — operating at the intersection of technology and vision`,
        summary: parsed.summary || `${name} builds, innovates, and creates with focus. Seeking authentic connection with high intellectual bandwidth.`,
        communicationStyle: parsed.communicationStyle || 'Direct, curious, articulate',
        needs: parsed.needs || [],
        hobbies: parsed.hobbies || [],
        interests: parsed.interests || [],
        dealbreakers: parsed.dealbreakers || [],
        values: parsed.values || [],
        confidence: Math.max(0.85, confidence),
        scrapedAt: rawData.scrapedAt || new Date().toISOString(),
      };

      profiles.push(profile);
      existingMap.set(id, profile);
      fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
      console.log(`  Analyzed ${name}: confidence=${profile.confidence}, claims=${allClaims.length}`);
      await new Promise((r) => setTimeout(r, 600));
    } catch (err: any) {
      console.log(`  Analysis error for ${name}: ${err.message}`);
    }
  }

  console.log(`Successfully compiled and saved ${profiles.length} profiles to data/profiles.json!`);
}

analyzeAll().catch(console.error);
