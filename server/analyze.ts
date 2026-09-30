import type { RawPerson } from '../src/lib/scraper';
import type { AgentProfile, ProfileClaim } from '../src/types';
import { llmJSON } from './llm';

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();

export function buildCorpus(raw: RawPerson): string {
  const li = raw.linkedin, ig = raw.instagram;
  const parts = [
    '=== LINKEDIN (public profile) ===',
    li.ok ? [li.text, li.experience && `--- EXPERIENCE ---\n${li.experience}`, li.posts && `--- RECENT ACTIVITY ---\n${li.posts}`].filter(Boolean).join('\n').slice(0, 14000) : `(unavailable: ${li.error})`,
    '=== INSTAGRAM (public profile) ===',
    ig.ok ? [`Handle: @${ig.handle}`, ig.name && `Name: ${ig.name}`, ig.stats, ig.bio && `Bio: ${ig.bio}`, ig.externalLinks.length ? `Links: ${ig.externalLinks.join(', ')}` : '',
      ...ig.posts.map((p, i) => `Post ${i + 1}${p.date ? ' (' + p.date.slice(0, 10) + ')' : ''}${p.location ? ' @ ' + p.location : ''}: ${p.caption || ''}${p.alt ? ' [image: ' + p.alt + ']' : ''}`)].filter(Boolean).join('\n') : `(unavailable: ${ig.error})`,
  ];
  return parts.join('\n');
}

const SYSTEM = `You are the analyst inside Cupidly, an agentic dating product. You read exactly two public sources about ONE person — their LinkedIn and their Instagram (text and photos) — and infer who they are as a dating partner. Never invent facts. Every claim needs a short verbatim-ish evidence quote copied from the sources (or a concrete description of what a photo shows, prefixed "photo:"). Prefer specific over generic. Return JSON only.`;

const claimShape = `{ "text": "...", "source": "linkedin" | "instagram", "evidence": "quote from the source" }`;

export async function analyzePerson(id: string, name: string, raw: RawPerson): Promise<AgentProfile> {
  const corpus = buildCorpus(raw);
  const images = raw.instagram.posts.filter((p) => p.localImage).map((p) => ({ path: p.localImage! }));
  const user = `Person: ${name || raw.linkedin.name || raw.instagram.name}\n\n${corpus}\n\nReturn JSON:
{
 "archetype": "2-4 evocative words",
 "headline": "one punchy sentence",
 "summary": "2-3 sentences, warm dating-profile voice, grounded in facts above",
 "communicationStyle": "3-5 words",
 "age_or_stage": "career stage / life stage inferred",
 "location": "where they are based",
 "needs": [4 x ${claimShape}],
 "hobbies": [4 x ${claimShape}],
 "interests": [4 x ${claimShape}],
 "dealbreakers": [2-3 x ${claimShape}],
 "values": [3 x ${claimShape}],
 "qualities": [3-4 x { "text": "other quality: humor, ambition, social energy, taste, etc.", "source": "...", "evidence": "..." }],
 "datingStyle": "how their agent should behave on a date: tone, what they ask about, what they avoid"
}
Hobbies mostly come from Instagram; interests, career drive and needs from LinkedIn — but use whichever source truly supports the claim.`;
  const p: any = await llmJSON(SYSTEM, user, { images, maxTokens: 4000 });

  const hay = norm(corpus + ' ' + raw.instagram.posts.map((x) => x.alt).join(' '));
  const verify = (c: ProfileClaim): ProfileClaim & { verified: boolean } => {
    const ev = norm(c.evidence || '');
    let ok = /^photo:/i.test(c.evidence || '') && images.length > 0;
    if (!ok && ev.length > 8) {
      const words = ev.split(' ').filter((w) => w.length > 3);
      const hits = words.filter((w) => hay.includes(w)).length;
      ok = words.length > 0 && hits / words.length >= 0.6;
    }
    return { ...c, source: c.source === 'instagram' ? 'instagram' : 'linkedin', verified: ok };
  };
  let total = 0, good = 0;
  const clean = (arr: any[] = []) => arr.map(verify).map((c) => { total++; if (c.verified) good++; return c; }).filter((c) => c.verified);
  const first = raw.instagram.posts.find((x) => x.image)?.image;

  return {
    id, name: name || raw.linkedin.name || raw.instagram.name,
    avatarUrl: raw.instagram.avatar || '',
    linkedinUrl: raw.linkedin.url, instagramUrl: raw.instagram.url,
    archetype: p.archetype, headline: p.headline, summary: p.summary, communicationStyle: p.communicationStyle,
    needs: clean(p.needs), hobbies: clean(p.hobbies), interests: clean(p.interests), dealbreakers: clean(p.dealbreakers), values: clean(p.values),
    qualities: clean(p.qualities), datingStyle: p.datingStyle, location: p.location, stage: p.age_or_stage,
    confidence: total ? Math.round((good / total) * 100) / 100 : 0,
    scrapedAt: raw.scrapedAt, isCustom: true,
    sources: { linkedin: raw.linkedin.ok, instagram: raw.instagram.ok, igPosts: raw.instagram.posts.length },
  } as AgentProfile;
}
