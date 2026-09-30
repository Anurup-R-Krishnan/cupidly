import React, { useState, useEffect, useRef } from 'react';
import { AgentProfile, DateResult } from '../types';
import { getDateResult } from '../lib/rankingEngine';
import { DatingLog } from './DatingLog';
import { AvatarMeetingAnimation } from './AvatarMeetingAnimation';
import {
  Flame,
  Play,
  RotateCcw,
  FastForward,
  CheckCircle,
  AlertCircle,
  Wine,
  Shuffle,
  Heart,
  MessageSquare,
  ListOrdered,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DateArenaProps {
  profiles: AgentProfile[];
  initialAgentAId?: string;
  initialAgentBId?: string;
  onOpenProfile: (profile: AgentProfile) => void;
}

export const DateArena: React.FC<DateArenaProps> = ({
  profiles,
  initialAgentAId,
  initialAgentBId,
  onOpenProfile,
}) => {
  const [agentAId, setAgentAId] = useState<string>(
    initialAgentAId || profiles[0]?.id || ''
  );
  const [agentBId, setAgentBId] = useState<string>(
    initialAgentBId || profiles[1]?.id || ''
  );

  const agentA = profiles.find((p) => p.id === agentAId) || profiles[0];
  const agentB = profiles.find((p) => p.id === agentBId) || profiles[1];

  const [dateResult, setDateResult] = useState<DateResult | null>(() => {
    if (agentA && agentB && agentA.id !== agentB.id) {
      return getDateResult(agentA, agentB);
    }
    return null;
  });
  const [visibleTurnsCount, setVisibleTurnsCount] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1800);
  const [showInnerThoughts, setShowInnerThoughts] = useState<boolean>(true);

  const [isSwipingMeeting, setIsSwipingMeeting] = useState<boolean>(false);

  const [activeViewMode, setActiveViewMode] = useState<'log' | 'bubbles' | 'both'>('log');

  const turnsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialAgentAId && initialAgentAId !== agentAId) setAgentAId(initialAgentAId);
  }, [initialAgentAId]);

  useEffect(() => {
    if (initialAgentBId && initialAgentBId !== agentBId) setAgentBId(initialAgentBId);
  }, [initialAgentBId]);

  const handleLaunchDate = () => {
    if (!agentA || !agentB || agentA.id === agentB.id) return;
    const result = getDateResult(agentA, agentB);
    setDateResult(result);
    setIsSwipingMeeting(true);
  };

  const handleAnimationComplete = () => {
    setIsSwipingMeeting(false);
    setVisibleTurnsCount(1);
    setIsPlaying(true);
  };

  const handleRandomDate = () => {
    if (profiles.length < 2) return;
    const idxA = Math.floor(Math.random() * profiles.length);
    let idxB = Math.floor(Math.random() * (profiles.length - 1));
    if (idxB >= idxA) idxB += 1;

    setAgentAId(profiles[idxA].id);
    setAgentBId(profiles[idxB].id);
    const result = getDateResult(profiles[idxA], profiles[idxB]);
    setDateResult(result);
    setIsSwipingMeeting(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && dateResult && !isSwipingMeeting) {
      if (visibleTurnsCount < dateResult.turns.length) {
        timer = setTimeout(() => {
          setVisibleTurnsCount((prev) => prev + 1);
        }, playbackSpeed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, visibleTurnsCount, dateResult, playbackSpeed, isSwipingMeeting]);

  useEffect(() => {
    if (activeViewMode === 'bubbles' || activeViewMode === 'both') {
      turnsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleTurnsCount, activeViewMode]);

  const handleFastForward = () => {
    if (dateResult) {
      setVisibleTurnsCount(dateResult.turns.length);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setVisibleTurnsCount(0);
    setDateResult(null);
    setIsPlaying(false);
    setIsSwipingMeeting(false);
  };

  const isCompleted = dateResult && visibleTurnsCount >= dateResult.turns.length;

  const quickPairs = React.useMemo(() => {
    if (!profiles || profiles.length < 2) return [];
    const pairs = [];
    for (let i = 0; i < Math.min(profiles.length - 1, 10); i += 2) {
      if (profiles[i] && profiles[i + 1]) {
        pairs.push({
          a: profiles[i].id,
          b: profiles[i + 1].id,
          label: `${profiles[i].name.split(' ')[0]} × ${profiles[i + 1].name.split(' ')[0]}`,
        });
      }
    }
    return pairs;
  }, [profiles]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {}
      <div className="bg-[#361a96] text-white p-8 sm:p-10 rounded-[48px] space-y-4 shadow-xl border-4 border-[#361a96]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#361a96] bg-[#00fcfd] px-3.5 py-1 rounded-full">
              <Wine className="w-3.5 h-3.5" />
              <span>Simulated Date</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight mt-2">
              Watch the date unfold
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed mt-1">
              Two agents grab drinks on their person&apos;s behalf. They talk in real voices, test for dealbreakers, and confess what they&apos;re actually thinking in private.
            </p>
          </div>

          <button
            onClick={handleRandomDate}
            className="px-6 py-3 rounded-full text-xs font-black uppercase text-[#361a96] bg-[#00fcfd] hover:bg-[#33fdfe] transition-all flex items-center gap-2 shrink-0 shadow-md"
          >
            <Shuffle className="w-4 h-4" />
            <span>Surprise Match</span>
          </button>
        </div>

        {}
        <div className="pt-3 flex flex-wrap items-center gap-2 border-t-2 border-white/10">
          <span className="text-xs font-black uppercase text-[#00fcfd] mr-1 shrink-0">
            Quick pairs:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {quickPairs.map((m, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAgentAId(m.a);
                  setAgentBId(m.b);
                  handleReset();
                }}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 ${
                  agentAId === m.a && agentBId === m.b
                    ? 'bg-[#00fcfd] text-[#361a96] font-black'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#361a96] text-white p-6 sm:p-8 rounded-[48px] border-4 border-[#361a96] shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {}
          <div className="md:col-span-2 bg-[#2b147d] border-2 border-white/10 p-5 rounded-[36px] flex items-center gap-4 min-w-0">
            <img
              src={agentA.avatarUrl}
              alt={agentA.name}
              className="w-16 h-16 rounded-[24px] object-cover border-2 border-[#00fcfd] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase text-[#00fcfd] block">
                PLAYER 1
              </span>
              <h3 className="font-heading font-black text-xl text-white truncate">
                {agentA.name}
              </h3>
              <p className="text-xs text-white/70 truncate">{agentA.archetype}</p>
              <select
                value={agentAId}
                onChange={(e) => {
                  setAgentAId(e.target.value);
                  handleReset();
                }}
                className="mt-2 bg-[#361a96] text-white text-xs font-bold rounded-full px-3 py-1.5 w-full border border-white/20 focus:outline-none truncate"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    Switch: {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center py-2 sm:py-0">
            <div className="h-12 w-12 rounded-full bg-[#ff7dec] text-[#361a96] flex items-center justify-center font-black shadow-lg mb-1">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#00fcfd] truncate max-w-full">
              {dateResult && visibleTurnsCount > 0
                ? `${dateResult.turns[Math.min(visibleTurnsCount - 1, dateResult.turns.length - 1)]?.cumulativeScore ?? dateResult.mutualScore}% Match`
                : 'Speed Date'}
            </span>
          </div>

          {}
          <div className="md:col-span-2 bg-[#2b147d] border-2 border-white/10 p-5 rounded-[36px] flex items-center gap-4 min-w-0">
            <img
              src={agentB.avatarUrl}
              alt={agentB.name}
              className="w-16 h-16 rounded-[24px] object-cover border-2 border-[#ff7dec] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase text-[#ff7dec] block">
                PLAYER 2
              </span>
              <h3 className="font-heading font-black text-xl text-white truncate">
                {agentB.name}
              </h3>
              <p className="text-xs text-white/70 truncate">{agentB.archetype}</p>
              <select
                value={agentBId}
                onChange={(e) => {
                  setAgentBId(e.target.value);
                  handleReset();
                }}
                className="mt-2 bg-[#361a96] text-white text-xs font-bold rounded-full px-3 py-1.5 w-full border border-white/20 focus:outline-none truncate"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === agentAId}>
                    Switch: {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t-2 border-white/10">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleLaunchDate}
              disabled={agentAId === agentBId}
              className="px-6 sm:px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider text-[#361a96] bg-[#00fcfd] hover:bg-[#33fdfe] transition-all flex items-center gap-2 shadow-lg disabled:opacity-40 shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{dateResult ? 'Replay Date' : 'Start Date'}</span>
            </button>

            {dateResult && !isCompleted && !isSwipingMeeting && (
              <button
                onClick={handleFastForward}
                className="px-4 py-3 rounded-full text-xs font-bold uppercase text-white bg-white/15 hover:bg-white/25 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <FastForward className="w-4 h-4" />
                <span>Show All Turns</span>
              </button>
            )}

            {dateResult && (
              <button
                onClick={handleReset}
                className="px-3.5 py-3 rounded-full text-xs font-bold uppercase text-white/70 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}

            {}
            {dateResult && !isSwipingMeeting && (
              <button
                onClick={() => setIsSwipingMeeting(true)}
                className="px-4 py-3 rounded-full text-xs font-bold uppercase text-[#00fcfd] bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 shrink-0"
                title="Watch the two avatars swipe and meet again"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Replay Match</span>
              </button>
            )}
          </div>

          {}
          {dateResult && !isSwipingMeeting && (
            <div className="flex items-center gap-1.5 bg-[#2b147d] p-1.5 rounded-full border border-white/15 self-start sm:self-auto shrink-0">
              <button
                onClick={() => setActiveViewMode('log')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                  activeViewMode === 'log'
                    ? 'bg-[#00fcfd] text-[#361a96] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Dating Log</span>
              </button>

              <button
                onClick={() => setActiveViewMode('bubbles')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                  activeViewMode === 'bubbles'
                    ? 'bg-[#00fcfd] text-[#361a96] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat View</span>
              </button>

              <button
                onClick={() => setActiveViewMode('both')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all hidden sm:flex ${
                  activeViewMode === 'both'
                    ? 'bg-[#00fcfd] text-[#361a96] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>Split</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {}
      {isSwipingMeeting && (
        <AvatarMeetingAnimation
          agentA={agentA}
          agentB={agentB}
          onAnimationComplete={handleAnimationComplete}
          onSkip={handleAnimationComplete}
        />
      )}

      {}
      {!isSwipingMeeting && dateResult && (
        <div className="space-y-6">
          {}
          {(activeViewMode === 'log' || activeViewMode === 'both') && (
            <DatingLog
              dateResult={dateResult}
              agentA={agentA}
              agentB={agentB}
              visibleTurnsCount={visibleTurnsCount}
              onSetVisibleTurnsCount={setVisibleTurnsCount}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              showInnerThoughts={showInnerThoughts}
              onToggleInnerThoughts={() => setShowInnerThoughts(!showInnerThoughts)}
              onFastForward={handleFastForward}
              onReset={handleReset}
            />
          )}

          {}
          {(activeViewMode === 'bubbles' || activeViewMode === 'both') && (
            <div className="bg-[#ffffff] text-[#361a96] border-4 border-[#361a96] rounded-[48px] p-6 sm:p-8 min-h-[380px] space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b-2 border-[#361a96]/15 pb-4">
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#5f2dfe]" />
                  <span className="font-heading font-black text-xl text-[#361a96]">
                    Table Conversation Stream
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <label className="cursor-pointer flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={showInnerThoughts}
                      onChange={(e) => setShowInnerThoughts(e.target.checked)}
                      className="accent-[#5f2dfe] rounded"
                    />
                    <span>Private thoughts</span>
                  </label>
                  <span className="text-[#666666]">·</span>
                  <span className="text-[#5f2dfe] font-black">
                    Turn {visibleTurnsCount} of {dateResult.turns.length}
                  </span>
                </div>
              </div>

              {}
              <div className="space-y-6">
                {dateResult.turns.slice(0, visibleTurnsCount).map((turn, idx) => {
                  const isSpeakerA = turn.speakerId === agentA.id;
                  const speaker = isSpeakerA ? agentA : agentB;

                  return (
                    <div
                      key={idx}
                      className={`flex gap-4 items-start ${
                        isSpeakerA ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {isSpeakerA && (
                        <img
                          src={speaker.avatarUrl}
                          alt={speaker.name}
                          className="w-11 h-11 rounded-[20px] object-cover border-2 border-[#361a96] shrink-0 mt-1"
                        />
                      )}

                      <div className={`max-w-[82%] sm:max-w-[72%] space-y-2`}>
                        {}
                        <div
                          className={`p-5 rounded-[32px] text-xs sm:text-sm leading-relaxed shadow-sm ${
                            isSpeakerA
                              ? 'bg-[#361a96] text-white rounded-tl-none'
                              : 'bg-[#ff7dec] text-[#361a96] font-semibold rounded-tr-none'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase mb-1.5 opacity-80">
                            <span>{turn.speakerName}</span>
                            <span>{turn.topic}</span>
                          </div>
                          <p className="text-sm">{turn.dialogue}</p>
                        </div>

                        {}
                        {showInnerThoughts && turn.innerThought && (
                          <div
                            className={`text-xs p-3.5 rounded-[24px] border-2 flex items-start gap-2.5 ${
                              isSpeakerA
                                ? 'bg-[#eef2ff] border-[#361a96]/20 text-[#361a96] ml-2'
                                : 'bg-[#fff5fc] border-[#ff7dec]/60 text-[#361a96] mr-2'
                            }`}
                          >
                            <span className="text-sm shrink-0">💭</span>
                            <div className="space-y-0.5">
                              <span className="text-[10px] uppercase font-black tracking-wider text-[#5f2dfe] block">
                                What {turn.speakerName} thought in private:
                              </span>
                              <span className="italic font-medium leading-relaxed">&ldquo;{turn.innerThought}&rdquo;</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {!isSpeakerA && (
                        <img
                          src={speaker.avatarUrl}
                          alt={speaker.name}
                          className="w-11 h-11 rounded-[20px] object-cover border-2 border-[#ff7dec] shrink-0 mt-1"
                        />
                      )}
                    </div>
                  );
                })}

                {}
                {isPlaying && visibleTurnsCount < dateResult.turns.length && (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5f2dfe] pl-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-[#5f2dfe] animate-ping" />
                    <span>Agent is replying...</span>
                  </div>
                )}

                <div ref={turnsEndRef} />
              </div>
            </div>
          )}
        </div>
      )}

      {}
      {!dateResult && !isSwipingMeeting && (
        <div className="bg-[#ffffff] text-[#361a96] border-4 border-[#361a96] rounded-[48px] p-8 sm:p-12 min-h-[380px] flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
          <div className="h-16 w-16 rounded-full bg-[#ff7dec] text-[#361a96] flex items-center justify-center shadow-md">
            <Wine className="w-8 h-8" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-heading font-black text-[#361a96]">
            {agentA.name} and {agentB.name} are ready to meet
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-[#666666] max-w-md leading-relaxed">
            Hit &ldquo;Start Date&rdquo; to watch the meeting animation and follow their 8-turn conversation with live chemistry updates.
          </p>
          <button
            onClick={handleLaunchDate}
            className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-[#361a96] bg-[#00fcfd] hover:bg-[#33fdfe] transition-all flex items-center gap-2 shadow-lg mt-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Date</span>
          </button>
        </div>
      )}

      {}
      {isCompleted && dateResult && !isSwipingMeeting && (
        <div className="bg-[#361a96] text-white p-8 sm:p-10 rounded-[48px] space-y-6 shadow-xl border-4 border-[#361a96]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-white/10 pb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#00fcfd]">
                How the date went
              </span>
              <h3 className="text-3xl sm:text-4xl font-heading font-black text-white flex items-center gap-3 mt-1">
                <span>{dateResult.mutualScore}% Mutual Chemistry</span>
                <span className="text-xs font-black px-3.5 py-1 rounded-full bg-[#00fcfd] text-[#361a96] uppercase">
                  {dateResult.chemistryRating}
                </span>
              </h3>
            </div>

            {dateResult.dealbreakerTriggered ? (
              <span className="px-4 py-2 rounded-full bg-[#ff7dec] text-[#361a96] text-xs font-black flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Hit a dealbreaker</span>
              </span>
            ) : (
              <span className="px-4 py-2 rounded-full bg-[#00fcfd] text-[#361a96] text-xs font-black flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Clean run · No red flags</span>
              </span>
            )}
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#2b147d] p-5 rounded-[32px] border-2 border-white/10">
              <span className="text-xs font-black uppercase text-[#00fcfd] block">VALUES &amp; OUTLOOK</span>
              <span className="text-3xl font-black text-white mt-1 block">{dateResult.valuesAlignment}%</span>
              <span className="text-xs text-white/70">Shared ambitions &amp; priorities</span>
            </div>

            <div className="bg-[#2b147d] p-5 rounded-[32px] border-2 border-white/10">
              <span className="text-xs font-black uppercase text-[#ff7dec] block">WEEKEND RHYTHMS</span>
              <span className="text-3xl font-black text-white mt-1 block">{dateResult.lifestyleCadence}%</span>
              <span className="text-xs text-white/70">How downtime aligns</span>
            </div>

            <div className="bg-[#2b147d] p-5 rounded-[32px] border-2 border-white/10">
              <span className="text-xs font-black uppercase text-[#00fcfd] block">BANTER &amp; FLOW</span>
              <span className="text-3xl font-black text-white mt-1 block">{dateResult.conversationalFlow}%</span>
              <span className="text-xs text-white/70">Effortless spark &amp; dialogue</span>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {}
            <div className="bg-[#2b147d] p-6 rounded-[36px] border-2 border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-sm font-black uppercase text-white">
                  {agentA.name}&apos;s take on {agentB.name}
                </h4>
                <span className="text-base font-black text-[#00fcfd]">
                  {dateResult.verdicts[agentA.id]?.interest}/100
                </span>
              </div>

              <div className="text-xs space-y-2 text-white/90">
                <p><strong className="text-[#00fcfd]">Highlight:</strong> {dateResult.verdicts[agentA.id]?.bestMoment}</p>
                <p><strong className="text-[#ff7dec]">Friction point:</strong> {dateResult.verdicts[agentA.id]?.friction}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                <span className="text-white/70">Second date?</span>
                <span className="text-sm font-black text-[#00fcfd]">
                  {dateResult.verdicts[agentA.id]?.again ? 'YES' : 'NO'}
                </span>
              </div>
            </div>

            {}
            <div className="bg-[#2b147d] p-6 rounded-[36px] border-2 border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-sm font-black uppercase text-white">
                  {agentB.name}&apos;s take on {agentA.name}
                </h4>
                <span className="text-base font-black text-[#ff7dec]">
                  {dateResult.verdicts[agentB.id]?.interest}/100
                </span>
              </div>

              <div className="text-xs space-y-2 text-white/90">
                <p><strong className="text-[#00fcfd]">Highlight:</strong> {dateResult.verdicts[agentB.id]?.bestMoment}</p>
                <p><strong className="text-[#ff7dec]">Friction point:</strong> {dateResult.verdicts[agentB.id]?.friction}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                <span className="text-white/70">Second date?</span>
                <span className="text-sm font-black text-[#ff7dec]">
                  {dateResult.verdicts[agentB.id]?.again ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
