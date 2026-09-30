import { AgentProfile, DateResult, DateTurn, AgentVerdict } from '../types';

export function evaluatePairCompatibility(
  a: AgentProfile,
  b: AgentProfile
): {
  mutualScore: number;
  scoreA: number;
  scoreB: number;
  bestMomentA: string;
  bestMomentB: string;
  frictionA: string;
  frictionB: string;
  againA: boolean;
  againB: boolean;
  chemistryRating: DateResult['chemistryRating'];
  valuesAlignment: number;
  lifestyleCadence: number;
  conversationalFlow: number;
  dealbreakerTriggered: boolean;
} {
  const aHobbies = a.hobbies.map((h) => h.text.toLowerCase());
  const bHobbies = b.hobbies.map((h) => h.text.toLowerCase());
  let hobbySynergy = 0;
  for (const ha of aHobbies) {
    for (const hb of bHobbies) {
      if (
        ha.includes(hb.slice(0, 5)) ||
        hb.includes(ha.slice(0, 5)) ||
        ha.split(' ').some((w) => w.length > 4 && hb.includes(w))
      ) {
        hobbySynergy += 14;
      }
    }
  }

  const aInterests = a.interests.map((i) => i.text.toLowerCase());
  const bInterests = b.interests.map((i) => i.text.toLowerCase());
  let interestSynergy = 0;
  for (const ia of aInterests) {
    for (const ib of bInterests) {
      if (
        ia.includes(ib.slice(0, 5)) ||
        ib.includes(ia.slice(0, 5)) ||
        ia.split(' ').some((w) => w.length > 4 && ib.includes(w))
      ) {
        interestSynergy += 12;
      }
    }
  }

  let aDealbreakerClash = false;
  let bDealbreakerClash = false;
  const aSummaryAndNeeds = (a.summary + ' ' + a.needs.map((n) => n.text).join(' ')).toLowerCase();
  const bSummaryAndNeeds = (b.summary + ' ' + b.needs.map((n) => n.text).join(' ')).toLowerCase();

  for (const d of a.dealbreakers) {
    const dt = d.text.toLowerCase();
    if (
      bSummaryAndNeeds.includes('nomad') && dt.includes('residency') ||
      bSummaryAndNeeds.includes('bureaucracy') && dt.includes('corporate') ||
      bSummaryAndNeeds.includes('slow') && dt.includes('speed')
    ) {
      aDealbreakerClash = true;
    }
  }

  for (const d of b.dealbreakers) {
    const dt = d.text.toLowerCase();
    if (
      aSummaryAndNeeds.includes('nomad') && dt.includes('residency') ||
      aSummaryAndNeeds.includes('bureaucracy') && dt.includes('corporate') ||
      aSummaryAndNeeds.includes('slow') && dt.includes('speed')
    ) {
      bDealbreakerClash = true;
    }
  }

  const pairKey = [a.id, b.id].sort().join(':');
  let hash = 0;
  for (let i = 0; i < pairKey.length; i++) {
    hash = (hash << 5) - hash + pairKey.charCodeAt(i);
    hash |= 0;
  }
  const variance = Math.abs(hash % 16) - 8;

  let scoreA = 68 + Math.min(hobbySynergy, 20) + Math.min(interestSynergy, 16) + variance;
  let scoreB = 68 + Math.min(hobbySynergy, 20) + Math.min(interestSynergy, 16) - variance;

  if (aDealbreakerClash) scoreA -= 24;
  if (bDealbreakerClash) scoreB -= 24;

  scoreA = Math.max(32, Math.min(96, Math.round(scoreA)));
  scoreB = Math.max(32, Math.min(96, Math.round(scoreB)));

  const mutualScore = Math.round(Math.sqrt(scoreA * scoreB));

  let chemistryRating: DateResult['chemistryRating'] = 'Balanced';
  if (mutualScore >= 85) chemistryRating = 'Electric';
  else if (mutualScore >= 74) chemistryRating = 'High';
  else if (mutualScore >= 56) chemistryRating = 'Balanced';
  else if (mutualScore >= 44) chemistryRating = 'Friction';
  else chemistryRating = 'Incompatible';

  const bestMomentA = `When ${b.name} described their dedication to ${b.hobbies[0]?.text.toLowerCase() || 'their craft'}, there was an instant spark of authentic respect.`;
  const bestMomentB = `When ${a.name} spoke about ${a.interests[0]?.text.toLowerCase() || 'first principles'}, the conversation shifted into effortless high gear.`;

  const frictionA = aDealbreakerClash
    ? `Concern that ${b.name}'s lifestyle pacing brushes uncomfortably close to a known dealbreaker.`
    : `Slight divergence in how they decompress on unstructured weekends (${a.hobbies[0]?.text.slice(0, 28)} vs ${b.hobbies[0]?.text.slice(0, 28)}).`;

  const frictionB = bDealbreakerClash
    ? `Guarded reservation about whether ${a.name} can accommodate long-term relationship autonomy.`
    : `Communication pacing mismatch: ${b.communicationStyle} sparring with ${a.communicationStyle}.`;

  const againA = scoreA >= 60;
  const againB = scoreB >= 60;

  return {
    mutualScore,
    scoreA,
    scoreB,
    bestMomentA,
    bestMomentB,
    frictionA,
    frictionB,
    againA,
    againB,
    chemistryRating,
    valuesAlignment: Math.min(96, Math.max(40, Math.round(65 + interestSynergy + variance))),
    lifestyleCadence: Math.min(96, Math.max(35, Math.round(62 + hobbySynergy - (aDealbreakerClash ? 20 : 0)))),
    conversationalFlow: Math.min(98, Math.max(45, Math.round(70 + variance * 2))),
    dealbreakerTriggered: aDealbreakerClash || bDealbreakerClash,
  };
}

export function generateScriptedDate(a: AgentProfile, b: AgentProfile): DateResult {
  const comp = evaluatePairCompatibility(a, b);

  const targetMutual = comp.mutualScore;
  const startBase = Math.max(30, Math.min(65, Math.round(targetMutual * 0.65)));
  const totalChange = targetMutual - startBase;

  const deltaFactors = [
    { factor: 0.15, reason: 'Warm first impression & curiosity' },
    { factor: 0.18, reason: 'Complementary weekend habits & rhythm' },
    { factor: 0.16, reason: 'Deep mutual respect for autonomy' },
    { factor: 0.14, reason: 'Calm emotional composure tested' },
    { factor: comp.dealbreakerTriggered ? -0.15 : 0.15, reason: comp.dealbreakerTriggered ? 'Lifestyle boundary clash detected' : 'Clear boundaries respected' },
    { factor: 0.16, reason: 'Vulnerable & candid communication' },
    { factor: -0.05, reason: 'Realistic friction acknowledged' },
    { factor: 0.11, reason: comp.againB ? 'Mutual chemistry confirmed' : 'Polite parting divergence' },
  ];

  let runningScore = startBase;

  const turns: DateTurn[] = [
    {
      turnIndex: 1,
      speakerId: a.id,
      speakerName: a.name,
      dialogue: `Hey ${b.name}. Glad we could grab this corner table. I was actually just reading about your work around ${b.interests[0]?.text.toLowerCase() || 'systems'}—how do you switch off your brain after a week like that?`,
      innerThought: `They look relaxed, not stiff. Good eye contact. Let's see if they talk like a corporate brochure or a real human being.`,
      topic: 'Icebreaker & First Impressions',
      cumulativeScore: (runningScore = Math.max(20, Math.min(99, Math.round(runningScore + totalChange * deltaFactors[0].factor)))),
      scoreDelta: Math.round(totalChange * deltaFactors[0].factor),
      scoreReason: deltaFactors[0].reason,
    },
    {
      turnIndex: 2,
      speakerId: b.id,
      speakerName: b.name,
      dialogue: `Honestly, usually with ${b.hobbies[0]?.text.toLowerCase() || 'solitude'} and a strong espresso. If I don't carve out that physical silence, everything turns into noise. What about you—does your Saturday have a structure, or is it pure chaos?`,
      innerThought: `Direct opener without generic small talk. I like that they know what I actually care about.`,
      topic: 'Weekend Cadence & Daily Rhythm',
      cumulativeScore: (runningScore = Math.max(20, Math.min(99, Math.round(runningScore + totalChange * deltaFactors[1].factor)))),
      scoreDelta: Math.round(totalChange * deltaFactors[1].factor),
      scoreReason: deltaFactors[1].reason,
    },
    {
      turnIndex: 3,
      speakerId: a.id,
      speakerName: a.name,
      dialogue: `Total autonomy for me. For instance, with ${a.hobbies[0]?.text.toLowerCase() || 'my time'}, I need hours where nobody is expecting an immediate reply. People mistake independence for detachment, but to me it's oxygen.`,
      innerThought: `Testing to see if they flinch at the word 'autonomy'. If they need daily hand-holding, this ends tonight.`,
      topic: 'Sovereignty & Focus States',
      cumulativeScore: (runningScore = Math.max(20, Math.min(99, Math.round(runningScore + totalChange * deltaFactors[2].factor)))),
      scoreDelta: Math.round(totalChange * deltaFactors[2].factor),
      scoreReason: deltaFactors[2].reason,
    },
    {
      turnIndex: 4,
      speakerId: b.id,
      speakerName: b.name,
      dialogue: `I actually agree with that. The worst dynamic is having to perform availability just to soothe someone else's anxiety. But tell me: when a project or life throws a crisis at you, do you pull inward or share the load?`,
      innerThought: `Checking their emotional resilience under pressure. Dealing with fragile panic is my biggest turn-off.`,
      topic: 'Crisis Response & Emotional Grounding',
      cumulativeScore: (runningScore = Math.max(20, Math.min(99, Math.round(runningScore + totalChange * deltaFactors[3].factor)))),
      scoreDelta: Math.round(totalChange * deltaFactors[3].factor),
      scoreReason: deltaFactors[3].reason,
    },
    {
      turnIndex: 5,
      speakerId: a.id,
      speakerName: a.name,
      dialogue: `I dissect it analytically first, then discuss it plainly. What I can't tolerate is ${a.dealbreakers[0]?.text.toLowerCase() || 'passive games'}. If there's an issue, put it on the table so we can solve it together.`,
      innerThought: `Their voice is measured. No defensive posturing. This is surprisingly high-bandwidth.`,
      topic: 'Dealbreakers & Transparency',
      cumulativeScore: (runningScore = Math.max(20, Math.min(99, Math.round(runningScore + totalChange * deltaFactors[4].factor)))),
      scoreDelta: Math.round(totalChange * deltaFactors[4].factor),
      scoreReason: deltaFactors[4].reason,
    },
    {
      turnIndex: 6,
      speakerId: b.id,
      speakerName: b.name,
      dialogue: `That is rare. Most people run on subtext and expect mind-reading. For me, what I really need from a partner is ${b.needs[0]?.text.toLowerCase() || 'real mutual respect'}. Without that, chemistry is just temporary fireworks.`,
      innerThought: `They aren't just reciting a script. There's real self-awareness behind their eyes.`,
      topic: 'Core Relational Needs',
      cumulativeScore: (runningScore = Math.max(20, Math.min(99, Math.round(runningScore + totalChange * deltaFactors[5].factor)))),
      scoreDelta: Math.round(totalChange * deltaFactors[5].factor),
      scoreReason: deltaFactors[5].reason,
    },
    {
      turnIndex: 7,
      speakerId: a.id,
      speakerName: a.name,
      dialogue: `Where I think we might clash is pacing—my style is ${a.communicationStyle.toLowerCase()}, and I can get completely consumed when I'm in flow. You'd have to call me out if I drift too far into my own orbit.`,
      innerThought: `Admitting a flaw early to see how they handle realistic friction.`,
      topic: 'Potential Clashes & Friction',
      cumulativeScore: (runningScore = Math.max(20, Math.min(99, Math.round(runningScore + totalChange * deltaFactors[6].factor)))),
      scoreDelta: Math.round(totalChange * deltaFactors[6].factor),
      scoreReason: deltaFactors[6].reason,
    },
    {
      turnIndex: 8,
      speakerId: b.id,
      speakerName: b.name,
      dialogue: comp.againB
        ? `Don't worry, I have zero hesitation calling things out. But this was genuinely refreshing, ${a.name}. Let's do this again soon—next time somewhere with better wine.`
        : `I appreciate the directness, ${a.name}. While I think we operate on slightly different life wavelengths long-term, I really enjoyed this conversation tonight.`,
      innerThought: comp.againB
        ? `I definitely want to see them again without our agent proxies. High compatibility.`
        : `Fascinating mind, but our daily rhythms would grate on each other after a month.`,
      topic: 'Closing Verdict',
      cumulativeScore: targetMutual,
      scoreDelta: Math.round(targetMutual - runningScore),
      scoreReason: deltaFactors[7].reason,
    },
  ];

  const verdicts: Record<string, AgentVerdict> = {
    [a.id]: {
      interest: comp.scoreA,
      bestMoment: comp.bestMomentA,
      friction: comp.frictionA,
      again: comp.againA,
    },
    [b.id]: {
      interest: comp.scoreB,
      bestMoment: comp.bestMomentB,
      friction: comp.frictionB,
      again: comp.againB,
    },
  };

  return {
    id: `date_${a.id}_${b.id}`,
    agentAId: a.id,
    agentBId: b.id,
    turns,
    verdicts,
    mutualScore: comp.mutualScore,
    chemistryRating: comp.chemistryRating,
    valuesAlignment: comp.valuesAlignment,
    lifestyleCadence: comp.lifestyleCadence,
    conversationalFlow: comp.conversationalFlow,
    dealbreakerTriggered: comp.dealbreakerTriggered,
    timestamp: new Date().toISOString(),
  };
}
