import precomputedDates from '../../data/dates.json';
import { AgentProfile, CandidateRanking, DateResult } from '../types';
import { generateScriptedDate } from './datingEngine';

const liveDateCache = new Map<string, DateResult>();

export function getPairKey(aId: string, bId: string): string {
  return [aId, bId].sort().join('___');
}

export function getDateResult(a: AgentProfile, b: AgentProfile): DateResult {
  const key = getPairKey(a.id, b.id);
  if (liveDateCache.has(key)) return liveDateCache.get(key)!;
  if ((precomputedDates as Record<string, DateResult>)[key]) {
    return (precomputedDates as Record<string, DateResult>)[key];
  }
  const result = generateScriptedDate(a, b);
  liveDateCache.set(key, result);
  return result;
}

export function cacheDateResult(result: DateResult) {
  const key = getPairKey(result.agentAId, result.agentBId);
  liveDateCache.set(key, result);
}

export function computeRankingsForTarget(
  target: AgentProfile,
  allProfiles: AgentProfile[]
): CandidateRanking[] {
  const candidates = allProfiles.filter((p) => p.id !== target.id);

  const rankings: CandidateRanking[] = candidates.map((candidate) => {
    const dateRes = getDateResult(target, candidate);
    const myVerdict = dateRes.verdicts?.[target.id];
    const theirVerdict = dateRes.verdicts?.[candidate.id];

    const myInterest = myVerdict?.interest ?? 70;
    const theirInterest = theirVerdict?.interest ?? 70;
    const mutualScore = dateRes.mutualScore || Math.round(Math.sqrt(myInterest * theirInterest));

    const score = Math.round(0.6 * myInterest + 0.4 * theirInterest);

    let againConsensus: CandidateRanking['againConsensus'] = 'both_no';
    if (myVerdict?.again && theirVerdict?.again) againConsensus = 'both_yes';
    else if (myVerdict?.again || theirVerdict?.again) againConsensus = 'one_sided';

    return {
      rank: 0,
      candidate,
      score,
      myAgentInterest: myInterest,
      theirAgentInterest: theirInterest,
      mutualScore,
      synergy: myVerdict?.bestMoment || dateRes.chemistryRating,
      friction: myVerdict?.friction || (dateRes.dealbreakerTriggered ? 'Dealbreaker clash' : 'None'),
      againConsensus,
      dateResult: dateRes,
    };
  });

  rankings.sort((a, b) => b.score - a.score);

  return rankings.map((r, idx) => ({
    ...r,
    rank: idx + 1,
  }));
}
