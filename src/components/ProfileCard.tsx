import React from 'react';
import { AgentProfile } from '../types';
import { ExternalLink, Flame, ArrowUpRight } from 'lucide-react';

interface ProfileCardProps {
  profile: AgentProfile;
  onSelect: (profile: AgentProfile) => void;
  onDateWith: (profile: AgentProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSelect, onDateWith }) => {
  return (
    <div
      onClick={() => onSelect(profile)}
      className="group relative bg-[#361a96] text-white rounded-[48px] p-6 transition-all duration-200 flex flex-col justify-between cursor-pointer border-4 border-[#361a96] hover:border-[#00fcfd] shadow-xl hover:-translate-y-1"
    >
      <div>
        {}
        <div className="relative aspect-[4/3] w-full rounded-[36px] overflow-hidden mb-5 bg-[#25106b] border-2 border-white/20">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 bg-[#361a96] text-[#00fcfd] font-bold text-[10px] uppercase px-3 py-1 rounded-full border border-[#00fcfd]/40">
            {profile.archetype}
          </div>
          {profile.isCustom && (
            <span className="absolute top-3 right-3 bg-[#00fcfd] text-[#361a96] font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              NEW
            </span>
          )}
        </div>

        {}
        <div className="space-y-1.5 mb-4">
          <h3 className="font-heading font-black text-2xl text-white tracking-tight leading-snug group-hover:text-[#00fcfd] transition-colors">
            {profile.name}
          </h3>
          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
            {profile.summary}
          </p>
        </div>

        {}
        <div className="space-y-2 pt-3 border-t-2 border-white/10 text-xs">
          <div className="flex items-baseline gap-2 text-white/90 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00fcfd] bg-white/10 px-2 py-0.5 rounded-full shrink-0">
              LOOKING FOR
            </span>
            <span className="truncate font-semibold min-w-0 flex-1">{profile.needs[0]?.text || 'Space to focus'}</span>
          </div>

          <div className="flex items-baseline gap-2 text-white/90 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7dec] bg-white/10 px-2 py-0.5 rounded-full shrink-0">
              WEEKENDS
            </span>
            <span className="truncate font-semibold min-w-0 flex-1">{profile.hobbies[0]?.text || 'Coffee & outdoor walks'}</span>
          </div>

          <div className="flex items-baseline gap-2 text-white/90 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00fcfd] bg-white/10 px-2 py-0.5 rounded-full shrink-0">
              VIBE
            </span>
            <span className="truncate italic text-white/80 min-w-0 flex-1">{profile.communicationStyle}</span>
          </div>
        </div>
      </div>

      {}
      <div className="pt-4 border-t-2 border-white/10 space-y-3 mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#00fcfd]">
          <div className="flex items-center gap-3">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span className="text-white/40">·</span>
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-[#ff7dec] shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Instagram</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/60 shrink-0">
            2 Links
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onSelect(profile)}
            className="py-3 px-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-full text-xs transition-colors text-center"
          >
            View profile
          </button>
          <button
            onClick={() => onDateWith(profile)}
            className="py-3 px-3 bg-[#00fcfd] hover:bg-[#33fdfe] text-[#361a96] font-black rounded-full text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-md"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Go on date</span>
          </button>
        </div>
      </div>
    </div>
  );
};
