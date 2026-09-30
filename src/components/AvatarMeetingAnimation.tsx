import React, { useEffect, useState } from 'react';
import { AgentProfile } from '../types';
import { Heart, Sparkles, Flame, Wine, Zap, ArrowRight } from 'lucide-react';

interface AvatarMeetingAnimationProps {
  agentA: AgentProfile;
  agentB: AgentProfile;
  onAnimationComplete: () => void;
  onSkip?: () => void;
}

export const AvatarMeetingAnimation: React.FC<AvatarMeetingAnimationProps> = ({
  agentA,
  agentB,
  onAnimationComplete,
  onSkip,
}) => {
  const [phase, setPhase] = useState<'swiping' | 'colliding' | 'connected'>('swiping');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('colliding'), 700);
    const t2 = setTimeout(() => setPhase('connected'), 1500);
    const t3 = setTimeout(() => onAnimationComplete(), 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onAnimationComplete]);

  return (
    <div className="relative overflow-hidden bg-[#361a96] text-white rounded-[48px] p-8 sm:p-12 border-4 border-[#361a96] shadow-2xl min-h-[460px] flex flex-col items-center justify-center">
      {}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {}
        {phase !== 'swiping' && (
          <>
            <div className="absolute w-72 h-72 rounded-full border-4 border-[#00fcfd]/60 animate-shockwave" />
            <div className="absolute w-96 h-96 rounded-full border-4 border-[#ff7dec]/50 animate-shockwave" style={{ animationDelay: '0.3s' }} />
            <div className="absolute w-[480px] h-[480px] rounded-full border-2 border-white/20 animate-shockwave" style={{ animationDelay: '0.6s' }} />
          </>
        )}

        {}
        {phase !== 'swiping' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="absolute -top-12 -left-16 text-2xl animate-particle-1">❤️</span>
            <span className="absolute -bottom-10 -right-20 text-2xl animate-particle-2">⚡</span>
            <span className="absolute -top-16 right-12 text-2xl animate-particle-3">🍸</span>
            <span className="absolute bottom-8 left-14 text-2xl animate-particle-1">✨</span>
          </div>
        )}
      </div>

      {}
      <div className="relative z-10 text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#00fcfd] text-[#361a96] shadow-lg">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>
            {phase === 'swiping'
              ? 'Agents Ingesting & Swiping...'
              : phase === 'colliding'
              ? "It's a Match! Avatars Meeting..."
              : 'Commencing Automated Date'}
          </span>
        </div>
        <h3 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
          {phase === 'connected' ? 'Date in Session' : 'Autonomous Matchup'}
        </h3>
        <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-medium">
          Their LinkedIn + Instagram profiles have been analyzed. Their agents are now sitting down face-to-face.
        </p>
      </div>

      {}
      <div className="relative z-10 w-full max-w-2xl flex items-center justify-center gap-4 sm:gap-8 my-4">
        {}
        <div
          className={`flex flex-col items-center transition-all duration-500 ${
            phase === 'swiping'
              ? 'animate-swipe-left'
              : phase === 'colliding'
              ? 'translate-x-2 scale-105'
              : 'translate-x-0 scale-100'
          }`}
        >
          <div className="relative">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[36px] overflow-hidden border-4 border-[#00fcfd] shadow-2xl bg-[#25106b]">
              <img
                src={agentA.avatarUrl}
                alt={agentA.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#00fcfd] text-[#361a96] text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
              Player 1
            </div>
          </div>
          <h4 className="font-heading font-black text-base sm:text-lg text-white mt-4 text-center">
            {agentA.name}
          </h4>
          <span className="text-xs text-[#00fcfd] font-bold">
            @{agentA.id}
          </span>
        </div>

        {}
        <div className="relative flex flex-col items-center justify-center px-2">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
              phase === 'colliding'
                ? 'bg-[#ff7dec] text-[#361a96] scale-125 ring-8 ring-[#00fcfd]'
                : phase === 'connected'
                ? 'bg-[#00fcfd] text-[#361a96] scale-110'
                : 'bg-white/20 text-white scale-90'
            }`}
          >
            {phase === 'colliding' ? (
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-current animate-heart-pulse" />
            ) : phase === 'connected' ? (
              <Wine className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
            ) : (
              <Flame className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
            )}
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-white/80 mt-2 whitespace-nowrap">
            {phase === 'connected' ? 'Seated at Bar' : 'Chemistry Pulse'}
          </span>
        </div>

        {}
        <div
          className={`flex flex-col items-center transition-all duration-500 ${
            phase === 'swiping'
              ? 'animate-swipe-right'
              : phase === 'colliding'
              ? '-translate-x-2 scale-105'
              : 'translate-x-0 scale-100'
          }`}
        >
          <div className="relative">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[36px] overflow-hidden border-4 border-[#ff7dec] shadow-2xl bg-[#25106b]">
              <img
                src={agentB.avatarUrl}
                alt={agentB.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#ff7dec] text-[#361a96] text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
              Player 2
            </div>
          </div>
          <h4 className="font-heading font-black text-base sm:text-lg text-white mt-4 text-center">
            {agentB.name}
          </h4>
          <span className="text-xs text-[#ff7dec] font-bold">
            @{agentB.id}
          </span>
        </div>
      </div>

      {}
      <div className="relative z-10 w-full max-w-md mt-6 space-y-3">
        {}
        <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00fcfd] via-white to-[#ff7dec] transition-all duration-1000 ease-out"
            style={{
              width: phase === 'swiping' ? '35%' : phase === 'colliding' ? '75%' : '100%',
            }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Verifying Public Socials</span>
          <button
            onClick={() => (onSkip ? onSkip() : onAnimationComplete())}
            className="text-white hover:text-[#00fcfd] font-bold underline flex items-center gap-1 cursor-pointer"
          >
            <span>Skip to Conversation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
