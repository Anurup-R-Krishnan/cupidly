import React, { useState } from 'react';
import { AgentProfile, DateResult, DateTurn } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Brain,
  Sliders,
} from 'lucide-react';

interface DatingLogProps {
  dateResult: DateResult;
  agentA: AgentProfile;
  agentB: AgentProfile;
  visibleTurnsCount: number;
  onSetVisibleTurnsCount: (count: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  showInnerThoughts: boolean;
  onToggleInnerThoughts: () => void;
  onFastForward: () => void;
  onReset: () => void;
}

export const DatingLog: React.FC<DatingLogProps> = ({
  dateResult,
  agentA,
  agentB,
  visibleTurnsCount,
  onSetVisibleTurnsCount,
  isPlaying,
  onTogglePlay,
  showInnerThoughts,
  onToggleInnerThoughts,
  onFastForward,
  onReset,
}) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

  const turns = dateResult.turns;
  const currentTurn = turns[Math.min(visibleTurnsCount - 1, turns.length - 1)] || turns[0];
  const currentScore = currentTurn?.cumulativeScore ?? dateResult.mutualScore;
  const initialBaseScore = turns[0]?.cumulativeScore ? Math.max(30, turns[0].cumulativeScore - (turns[0].scoreDelta || 0)) : 50;

  const activeFocusTurn = selectedStepIndex !== null && selectedStepIndex < visibleTurnsCount
    ? turns[selectedStepIndex]
    : currentTurn;

  return (
    <div className="bg-white border-4 border-[#361a96] rounded-[44px] p-6 sm:p-8 space-y-6 shadow-2xl text-[#361a96]">
      {}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#361a96]/15 pb-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase text-[#5f2dfe]">
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Turn-by-Turn Date Transcript</span>
            <span>·</span>
            <span>Turn {visibleTurnsCount} of {turns.length}</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#361a96] mt-1 break-words">
            Live Date Transcript
          </h3>
          <p className="text-xs font-medium text-[#666666] mt-0.5">
            Watch chemistry shift in real time across 8 rounds of conversation.
          </p>
        </div>

        {}
        <div className="bg-[#361a96] text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-[28px] border-2 border-[#361a96] shadow-md flex items-center justify-between sm:justify-start gap-4 sm:gap-5 w-full md:w-auto shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00fcfd] block">
              SCORE RIGHT NOW
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-heading font-black text-2xl sm:text-4xl text-white">
                {currentScore}%
              </span>
              {currentTurn?.scoreDelta !== undefined && (
                <span
                  className={`text-xs font-black flex items-center gap-0.5 px-2 py-0.5 rounded-full shrink-0 ${
                    currentTurn.scoreDelta >= 0
                      ? 'bg-[#00fcfd] text-[#361a96]'
                      : 'bg-[#ff7dec] text-[#361a96]'
                  }`}
                >
                  {currentTurn.scoreDelta >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {currentTurn.scoreDelta >= 0 ? `+${currentTurn.scoreDelta}%` : `${currentTurn.scoreDelta}%`}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="h-10 w-[2px] bg-white/20 shrink-0" />

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7dec] block">
              VIBE
            </span>
            <span className="text-xs sm:text-sm font-black text-white capitalize block mt-0.5 whitespace-nowrap">
              {currentScore >= 80 ? 'Strong spark' : currentScore >= 65 ? 'Good banter' : currentScore >= 50 ? 'Polite talk' : 'Awkward silence'}
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#f7f4ff] border-2 border-[#361a96]/20 rounded-[32px] p-4 sm:p-5 space-y-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          <span className="text-[#361a96] flex items-center gap-1.5 uppercase font-black tracking-wide text-[11px] shrink-0">
            <Sliders className="w-3.5 h-3.5 text-[#5f2dfe]" />
            <span>Turn-by-Turn Trajectory</span>
          </span>
          <span className="text-[#666666] text-[11px] truncate">
            Start: {initialBaseScore}% → Current: {currentScore}% → Final: {dateResult.mutualScore}%
          </span>
        </div>

        {}
        <div className="overflow-x-auto pb-1.5 scrollbar-none">
          <div className="grid grid-cols-8 gap-2 pt-1 min-w-[560px] md:min-w-0">
            {turns.map((turn, index) => {
              const isRevealed = index < visibleTurnsCount;
              const isCurrent = index === visibleTurnsCount - 1;
              const isSelected = selectedStepIndex === index;
              const delta = turn.scoreDelta ?? 0;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (isRevealed) {
                      setSelectedStepIndex(index);
                    } else {
                      onSetVisibleTurnsCount(index + 1);
                      setSelectedStepIndex(index);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-[20px] transition-all border-2 text-center min-w-0 ${
                    isSelected
                      ? 'bg-[#361a96] text-[#00fcfd] border-[#361a96] ring-2 ring-[#00fcfd] scale-105 shadow-md'
                      : isCurrent
                      ? 'bg-[#5f2dfe] text-white border-[#5f2dfe] shadow-md animate-pulse'
                      : isRevealed
                      ? 'bg-white text-[#361a96] border-[#361a96]/30 hover:border-[#361a96]'
                      : 'bg-white/50 text-[#361a96]/40 border-dashed border-[#361a96]/20 cursor-pointer hover:bg-white'
                  }`}
                  title={`Step ${index + 1}: ${turn.topic || 'Dialogue'}`}
                >
                  <span className="text-[10px] font-black uppercase">
                    T{index + 1}
                  </span>
                  <span className="font-heading font-black text-xs sm:text-sm mt-0.5">
                    {isRevealed ? `${turn.cumulativeScore}%` : '—'}
                  </span>
                  {isRevealed && (
                    <span
                      className={`text-[9px] font-black leading-none mt-1 ${
                        delta >= 0 ? 'text-[#059669]' : 'text-[#dc2626]'
                      }`}
                    >
                      {delta >= 0 ? `+${delta}%` : `${delta}%`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {}
        {activeFocusTurn && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#361a96]/10 text-xs font-semibold">
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-[#361a96] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shrink-0">
                Step {activeFocusTurn.turnIndex} Catalyst
              </span>
              <span className="text-[#361a96] font-bold truncate">
                {activeFocusTurn.scoreReason || activeFocusTurn.topic}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#666666] shrink-0">
              <span>Speaker: <strong className="text-[#361a96]">{activeFocusTurn.speakerName}</strong></span>
              <span>·</span>
              <span>Topic: <strong className="text-[#361a96]">{activeFocusTurn.topic}</strong></span>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-[28px] border-2 border-[#361a96]/15">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#5f2dfe] hover:bg-[#4b1ecc] transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{visibleTurnsCount >= turns.length ? 'Replay Date' : 'Play Date'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (visibleTurnsCount > 1) {
                onSetVisibleTurnsCount(visibleTurnsCount - 1);
                setSelectedStepIndex(null);
              }
            }}
            disabled={visibleTurnsCount <= 1}
            className="px-3 py-2 rounded-full text-xs font-bold text-[#361a96] bg-[#f0eaff] hover:bg-[#e4d8ff] transition-colors disabled:opacity-40 flex items-center gap-1 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Turn</span>
          </button>

          <button
            onClick={() => {
              if (visibleTurnsCount < turns.length) {
                onSetVisibleTurnsCount(visibleTurnsCount + 1);
                setSelectedStepIndex(null);
              }
            }}
            disabled={visibleTurnsCount >= turns.length}
            className="px-3 py-2 rounded-full text-xs font-bold text-[#361a96] bg-[#f0eaff] hover:bg-[#e4d8ff] transition-colors disabled:opacity-40 flex items-center gap-1 shrink-0"
          >
            <span className="hidden sm:inline">Next Turn</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onFastForward}
            className="px-3 py-2 rounded-full text-xs font-bold text-[#361a96] bg-[#f0eaff] hover:bg-[#e4d8ff] transition-colors flex items-center gap-1 shrink-0"
            title="Reveal all 8 turns immediately"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Turns</span>
          </button>

          <button
            onClick={() => {
              onReset();
              setSelectedStepIndex(null);
            }}
            className="px-3 py-2 rounded-full text-xs font-bold text-[#666666] hover:text-[#361a96] transition-colors flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer flex items-center gap-2 text-xs font-black text-[#361a96] bg-[#f7f4ff] px-3.5 py-2 rounded-full border border-[#361a96]/20 shrink-0">
            <input
              type="checkbox"
              checked={showInnerThoughts}
              onChange={onToggleInnerThoughts}
              className="accent-[#5f2dfe] rounded w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-[#5f2dfe]" />
              <span>Private Thoughts</span>
            </span>
          </label>
        </div>
      </div>

      {}
      <div className="space-y-4">
        {turns.slice(0, visibleTurnsCount).map((turn, index) => {
          const isSpeakerA = turn.speakerId === agentA.id;
          const speaker = isSpeakerA ? agentA : agentB;
          const isLatest = index === visibleTurnsCount - 1;
          const isSelected = selectedStepIndex === index;
          const delta = turn.scoreDelta ?? 0;

          return (
            <div
              key={index}
              onClick={() => setSelectedStepIndex(index)}
              className={`rounded-[32px] p-5 sm:p-6 transition-all duration-200 border-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#361a96] text-white border-[#361a96] ring-4 ring-[#00fcfd]/40 shadow-xl'
                  : isLatest && isPlaying
                  ? 'bg-[#fcfaff] border-[#5f2dfe] shadow-md ring-2 ring-[#5f2dfe]/20'
                  : 'bg-[#ffffff] border-[#361a96]/20 hover:border-[#361a96]/60 shadow-sm'
              }`}
            >
              {}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-4 border-current/15">
                <div className="flex items-center gap-3">
                  <img
                    src={speaker.avatarUrl}
                    alt={speaker.name}
                    className="w-10 h-10 rounded-[18px] object-cover border-2 border-current shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider opacity-70">
                        Step {turn.turnIndex} of {turns.length}
                      </span>
                      <span>·</span>
                      <span className="font-heading font-black text-base">
                        {speaker.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-current/10">
                        {isSpeakerA ? 'Player 1' : 'Player 2'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold opacity-80 block">
                      Topic: {turn.topic || 'Dialogue'}
                    </span>
                  </div>
                </div>

                {}
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm ${
                    isSelected
                      ? 'bg-[#00fcfd] text-[#361a96]'
                      : 'bg-[#361a96] text-white'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Score: {turn.cumulativeScore}%</span>
                  </div>

                  {delta !== 0 && (
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        delta > 0
                          ? isSelected ? 'bg-[#00fcfd] text-[#361a96]' : 'bg-[#e6fffa] text-[#059669]'
                          : isSelected ? 'bg-[#ff7dec] text-[#361a96]' : 'bg-[#fff1f2] text-[#dc2626]'
                      }`}
                    >
                      {delta > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
                    </span>
                  )}
                </div>
              </div>

              {}
              <div className="space-y-3">
                <div className="text-sm sm:text-base leading-relaxed font-medium pl-1">
                  &ldquo;{turn.dialogue}&rdquo;
                </div>

                {}
                {showInnerThoughts && turn.innerThought && (
                  <div
                    className={`text-xs p-3.5 rounded-[22px] border flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-white/10 border-white/20 text-white'
                        : isSpeakerA
                        ? 'bg-[#f4f2ff] border-[#5f2dfe]/20 text-[#361a96]'
                        : 'bg-[#fff5fc] border-[#ff7dec]/50 text-[#361a96]'
                    }`}
                  >
                    <Brain className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-black tracking-wider opacity-75 block">
                        What {turn.speakerName} thought in private:
                      </span>
                      <p className="italic font-medium leading-relaxed">
                        &ldquo;{turn.innerThought}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {}
                {turn.scoreReason && (
                  <div className="flex items-center gap-2 text-[11px] font-bold opacity-80 pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    <span>Trigger: {turn.scoreReason}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {}
      {visibleTurnsCount >= turns.length && (
        <div className="bg-[#361a96] text-white p-6 sm:p-8 rounded-[36px] border-4 border-[#361a96] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-black uppercase text-[#00fcfd] tracking-wider">
              Date Completed · 8 Turns Logged
            </span>
            <h4 className="font-heading font-black text-2xl text-white">
              Final Compatibility: {dateResult.mutualScore}% ({dateResult.chemistryRating})
            </h4>
            <p className="text-xs text-white/80">
              {dateResult.dealbreakerTriggered
                ? 'Clashed slightly on schedules, but the mutual interest was real.'
                : 'Zero red flags. Natural conversation flow and shared values.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onReset}
              className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#00fcfd] hover:bg-[#33fdfe] text-[#361a96] transition-all flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Simulate Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
