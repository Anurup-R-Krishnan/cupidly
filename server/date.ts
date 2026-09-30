import type { AgentProfile, DateResult, DateTurn, AgentVerdict } from '../src/types';
import { llmJSON } from './llm';

const brief = (p: AgentProfile) => `NAME: ${p.name}
ARCHETYPE: ${p.archetype} — ${p.headline}
SUMMARY: ${p.summary}
STYLE: ${p.communicationStyle}. ${(p as any).datingStyle || ''}
NEEDS: ${p.needs.map((c) => c.text).join('; ')}
HOBBIES: ${p.hobbies.map((c) => c.text).join('; ')}
INTERESTS: ${p.interests.map((c) => c.text).join('; ')}
VALUES: ${p.values.map((c) => c.text).join('; ')}
DEALBREAKERS: ${p.dealbreakers.map((c) => c.text).join('; ')}
OTHER: ${((p as any).qualities || []).map((c: any) => c.text).join('; ')}`;

const SYS = (me: AgentProfile) => `You are the dating agent of ${me.name}, on a first date with another person's agent. You ARE ${me.name} in voice, and know ONLY what is in your profile (built from LinkedIn + Instagram). Be specific, human, a little witty, no corporate-speak; 1-3 sentences. React to what the other actually said; probe your needs; be honest about friction — don't be sycophantic. Never invent biography beyond your profile. Return JSON only.\n\n== YOUR PROFILE ==\n${brief(me)}`;

export const TURNS = 8;
export type TurnHook = (t: DateTurn) => void;

export async function runDate(a: AgentProfile, b: AgentProfile, onTurn?: TurnHook, turns = TURNS): Promise<DateResult> {
  const transcript: DateTurn[] = [];
  const sides = [a, b];
  const interest: Record<string, number> = { [a.id]: 55, [b.id]: 55 };
  for (let i = 0; i < turns; i++) {
    const me = sides[i % 2], other = sides[(i + 1) % 2];
    const log = transcript.map((t) => `${t.speakerName}: ${t.dialogue}`).join('\n') || '(the date is just starting)';
    const ask = i === 0 ? 'Open the date.' : i === turns - 1 ? 'Wrap up the date honestly (say whether you want a second date).' : 'Continue naturally; steer to a topic that reveals compatibility.';
    const r: any = await llmJSON(SYS(me), `Other agent's public-facing profile you can perceive (they are ${other.name}; you only learn more via conversation, but you have skimmed this):\n${other.headline}\n\nTranscript so far:\n${log}\n\n${ask}\nReturn {"dialogue":"what you say aloud","innerThought":"private honest reaction, 1 sentence","topic":"3-5 word topic","interest":0-100 (your current interest in ${other.name}),"reason":"why interest moved"}`, { fast: true, maxTokens: 500 });
    const cur = Math.max(0, Math.min(100, Math.round(Number(r.interest) || interest[me.id])));
    const turn: DateTurn = { turnIndex: i + 1, speakerId: me.id, speakerName: me.name, dialogue: String(r.dialogue || ''), innerThought: String(r.innerThought || ''), topic: r.topic, cumulativeScore: Math.round((cur + interest[other.id]) / 2), scoreDelta: cur - interest[me.id], scoreReason: r.reason };
    interest[me.id] = cur;
    transcript.push(turn);
    onTurn?.(turn);
  }
  const log = transcript.map((t) => `${t.speakerName}: ${t.dialogue}`).join('\n');
  const verdicts: Record<string, AgentVerdict> = {};
  const scores: Record<string, { values: number; lifestyle: number; flow: number; dealbreaker: boolean }> = {};
  for (let k = 0; k < 2; k++) {
    const me = sides[k], other = sides[1 - k];
    const v: any = await llmJSON(SYS(me), `The date is over.\n${log}\n\nGive your honest verdict on ${other.name}. Return {"interest":0-100,"bestMoment":"one sentence","friction":"one sentence","again":true|false,"valuesAlignment":0-100,"lifestyleFit":0-100,"conversationFlow":0-100,"dealbreakerHit":true|false}`, { fast: true, maxTokens: 500 });
    verdicts[me.id] = { interest: clamp(v.interest), bestMoment: String(v.bestMoment || ''), friction: String(v.friction || ''), again: !!v.again };
    scores[me.id] = { values: clamp(v.valuesAlignment), lifestyle: clamp(v.lifestyleFit), flow: clamp(v.conversationFlow), dealbreaker: !!v.dealbreakerHit };
  }
  const mutual = Math.round(Math.sqrt(verdicts[a.id].interest * verdicts[b.id].interest));
  const avg = (f: (s: (typeof scores)[string]) => number) => Math.round((f(scores[a.id]) + f(scores[b.id])) / 2);
  transcript[transcript.length - 1].cumulativeScore = mutual;
  return {
    id: `date_${a.id}_${b.id}`, agentAId: a.id, agentBId: b.id, turns: transcript, verdicts, mutualScore: mutual,
    chemistryRating: mutual >= 85 ? 'Electric' : mutual >= 72 ? 'High' : mutual >= 55 ? 'Balanced' : mutual >= 40 ? 'Friction' : 'Incompatible',
    valuesAlignment: avg((s) => s.values), lifestyleCadence: avg((s) => s.lifestyle), conversationalFlow: avg((s) => s.flow),
    dealbreakerTriggered: scores[a.id].dealbreaker || scores[b.id].dealbreaker, timestamp: new Date().toISOString(),
  };
}
const clamp = (n: any) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
