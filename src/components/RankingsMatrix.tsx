import React, { useState } from 'react';
import { AgentProfile, CandidateRanking } from '../types';
import { computeRankingsForTarget } from '../lib/rankingEngine';
import {
  Trophy,
  Award,
  Flame,
  Eye,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface RankingsMatrixProps {
  profiles: AgentProfile[];
  initialTargetId?: string;
  onSelectDatePair: (agentA: AgentProfile, agentB: AgentProfile) => void;
  onOpenProfile: (profile: AgentProfile) => void;
}

export const RankingsMatrix: React.FC<RankingsMatrixProps> = ({
  profiles,
  initialTargetId,
  onSelectDatePair,
  onOpenProfile,
}) => {
  const [targetId, setTargetId] = useState<string>(
    initialTargetId || profiles[0]?.id || ''
  );

  const target = profiles.find((p) => p.id === targetId) || profiles[0];
  const rankings: CandidateRanking[] = computeRankingsForTarget(target, profiles);
  const topMatch = rankings[0];
  const runnerUp = rankings[1];
  const thirdPlace = rankings[2];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {}
      <div className="bg-[#361a96] text-white p-8 sm:p-10 rounded-[48px] space-y-4 shadow-xl border-4 border-[#361a96]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#361a96] bg-[#00fcfd] px-3.5 py-1 rounded-full">
              <Trophy className="w-3.5 h-3.5" />
              <span>Match Leaderboard</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight mt-2">
              Who fits who best
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed mt-1">
              For every person, we rank all other 24 candidates based on their real date outcomes: 60% what their own agent thought, and 40% how much the other liked them back.
            </p>
          </div>

          <div className="bg-[#2b147d] p-3 rounded-full border border-white/20 flex items-center gap-3">
            <span className="text-xs font-bold text-[#00fcfd] pl-2 uppercase">
              Person:
            </span>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="bg-[#361a96] text-white text-xs font-bold rounded-full px-4 py-2 border border-white/30 focus:outline-none"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {}
        <div className="pt-3 border-t-2 border-white/10">
          <span className="text-xs font-black uppercase text-[#00fcfd] block mb-2">
            Tap anyone to see their rankings:
          </span>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setTargetId(p.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 shrink-0 transition-all ${
                  p.id === targetId
                    ? 'bg-[#00fcfd] text-[#361a96] font-black border-[#00fcfd] shadow-md scale-105'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-xs font-bold">{p.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#ffffff] text-[#361a96] border-4 border-[#361a96] px-6 py-4 rounded-[36px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={target.avatarUrl}
            alt={target.name}
            className="w-12 h-12 rounded-[20px] object-cover border-2 border-[#361a96] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="font-heading font-black text-lg text-[#361a96] block truncate">{target.name}</span>
            <span className="text-xs text-[#666666] font-medium line-clamp-2 sm:line-clamp-1">{target.summary}</span>
          </div>
        </div>
        <button
          onClick={() => onOpenProfile(target)}
          className="text-xs font-black uppercase text-[#5f2dfe] hover:underline whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          View Full Profile &rarr;
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {}
        {topMatch && (
          <div className="bg-[#361a96] text-white border-4 border-[#00fcfd] p-7 rounded-[48px] flex flex-col justify-between space-y-4 shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-[#00fcfd] text-[#361a96] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 fill-current" />
                  <span>#1 Best Match</span>
                </span>
                <span className="text-3xl font-black text-white">
                  {topMatch.score}%
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <img
                  src={topMatch.candidate.avatarUrl}
                  alt={topMatch.candidate.name}
                  className="w-16 h-16 rounded-[24px] object-cover border-2 border-white"
                />
                <div>
                  <h3 className="font-heading font-black text-xl text-white">
                    {topMatch.candidate.name}
                  </h3>
                  <p className="text-xs text-[#00fcfd] font-bold">
                    {topMatch.candidate.archetype}
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/90 italic pt-2 border-t border-white/10 leading-relaxed">
                &ldquo;{topMatch.synergy}&rdquo;
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#00fcfd]">
                <span>Both said YES:</span>
                <span>MATCH!</span>
              </div>
              <button
                onClick={() => onSelectDatePair(target, topMatch.candidate)}
                className="w-full py-3 bg-[#00fcfd] hover:bg-[#33fdfe] text-[#361a96] font-black text-xs uppercase rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Watch Date</span>
              </button>
            </div>
          </div>
        )}

        {}
        {runnerUp && (
          <div className="bg-[#361a96] text-white border-2 border-white/20 p-7 rounded-[48px] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  #2 Runner Up
                </span>
                <span className="text-2xl font-bold text-white">
                  {runnerUp.score}%
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <img
                  src={runnerUp.candidate.avatarUrl}
                  alt={runnerUp.candidate.name}
                  className="w-14 h-14 rounded-[20px] object-cover border border-white/30"
                />
                <div>
                  <h3 className="font-heading font-black text-lg text-white">
                    {runnerUp.candidate.name}
                  </h3>
                  <p className="text-xs text-white/70">
                    {runnerUp.candidate.archetype}
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/80 italic pt-2 border-t border-white/10 leading-relaxed">
                &ldquo;{runnerUp.synergy}&rdquo;
              </p>
            </div>

            <button
              onClick={() => onSelectDatePair(target, runnerUp.candidate)}
              className="w-full py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase rounded-full transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Watch Date</span>
            </button>
          </div>
        )}

        {}
        {thirdPlace && (
          <div className="bg-[#361a96] text-white border-2 border-white/20 p-7 rounded-[48px] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  #3 Contender
                </span>
                <span className="text-2xl font-bold text-white">
                  {thirdPlace.score}%
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <img
                  src={thirdPlace.candidate.avatarUrl}
                  alt={thirdPlace.candidate.name}
                  className="w-14 h-14 rounded-[20px] object-cover border border-white/30"
                />
                <div>
                  <h3 className="font-heading font-black text-lg text-white">
                    {thirdPlace.candidate.name}
                  </h3>
                  <p className="text-xs text-white/70">
                    {thirdPlace.candidate.archetype}
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/80 italic pt-2 border-t border-white/10 leading-relaxed">
                &ldquo;{thirdPlace.synergy}&rdquo;
              </p>
            </div>

            <button
              onClick={() => onSelectDatePair(target, thirdPlace.candidate)}
              className="w-full py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase rounded-full transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Watch Date</span>
            </button>
          </div>
        )}
      </div>

      {}
      <div className="bg-[#ffffff] text-[#361a96] border-4 border-[#361a96] rounded-[48px] overflow-hidden shadow-xl">
        <div className="px-8 py-5 border-b-2 border-[#361a96]/15 bg-[#fff8fe] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-heading font-black text-base text-[#361a96]">
              All 24 Matches for {target.name}
            </h4>
            <p className="text-xs text-[#666666]">
              Click any person to watch their speed date dialogue.
            </p>
          </div>
          <span className="text-xs font-bold bg-[#ff7dec] text-[#361a96] px-3.5 py-1 rounded-full">
            60% target / 40% candidate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-[#f5efff] text-[#361a96] font-bold text-xs uppercase border-b-2 border-[#361a96]/10">
              <tr>
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6">Archetype</th>
                <th className="py-4 px-6 text-center">Score</th>
                <th className="py-4 px-6 text-center">Balance</th>
                <th className="py-4 px-6">Consensus</th>
                <th className="py-4 px-6">Why It Worked</th>
                <th className="py-4 px-6 text-right">Watch Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#361a96]/10 font-medium">
              {rankings.map((r) => (
                <tr
                  key={r.candidate.id}
                  className="hover:bg-[#fcf5ff] transition-colors cursor-pointer"
                  onClick={() => onSelectDatePair(target, r.candidate)}
                >
                  <td className="py-4 px-6 font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                        r.rank === 1
                          ? 'bg-[#00fcfd] text-[#361a96]'
                          : r.rank === 2
                          ? 'bg-[#ff7dec] text-[#361a96]'
                          : r.rank === 3
                          ? 'bg-[#361a96] text-white'
                          : 'bg-[#e5e5e5] text-[#361a96]'
                      }`}
                    >
                      #{r.rank}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.candidate.avatarUrl}
                        alt={r.candidate.name}
                        className="w-10 h-10 rounded-[16px] object-cover border border-[#361a96]/20"
                      />
                      <div>
                        <span className="font-bold text-sm text-[#361a96] block">
                          {r.candidate.name}
                        </span>
                        <span className="text-[11px] text-[#666666]">
                          @{r.candidate.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-xs text-[#666666] max-w-[180px] truncate">
                    {r.candidate.archetype}
                  </td>

                  <td className="py-4 px-6 text-center font-black text-sm text-[#361a96]">
                    {r.score}%
                  </td>

                  <td className="py-4 px-6 text-center font-bold text-xs text-[#666666]">
                    <span>{r.myAgentInterest}</span>
                    <span className="mx-1">/</span>
                    <span>{r.theirAgentInterest}</span>
                  </td>

                  <td className="py-4 px-6">
                    {r.againConsensus === 'both_yes' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#361a96] bg-[#00fcfd]/40 px-3 py-1 rounded-full whitespace-nowrap">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Both Said Yes</span>
                      </span>
                    ) : r.againConsensus === 'one_sided' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#361a96] bg-[#ff7dec]/50 px-3 py-1 rounded-full whitespace-nowrap">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>One-Sided</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] bg-[#e5e5e5] px-3 py-1 rounded-full whitespace-nowrap">
                        <span>Declined</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-xs text-[#444444] max-w-xs truncate">
                    {r.synergy}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDatePair(target, r.candidate);
                      }}
                      className="px-4 py-1.5 bg-[#361a96] hover:bg-[#5f2dfe] text-white font-bold rounded-full text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Watch</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
