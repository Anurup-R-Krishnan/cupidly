import React, { useState } from 'react';
import { AgentProfile } from '../types';
import {
  X,
  ExternalLink,
  Flame,
  Award,
  Heart,
  Sparkles,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

interface ProfileModalProps {
  profile: AgentProfile;
  onClose: () => void;
  onStartDating: (profile: AgentProfile) => void;
  onViewRankings: (profile: AgentProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onStartDating,
  onViewRankings,
}) => {
  const [activeTab, setActiveTab] = useState<'reading' | 'quotes'>('reading');

  return (
    <div className="fixed inset-0 z-50 bg-[#361a96]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#361a96] text-white border-4 border-[#00fcfd] rounded-[48px] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b-2 border-white/10 bg-[#2b147d] gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-wide text-[#00fcfd]">
              Candidate Dossier · Extracted Facts
            </span>
            <span className="text-[11px] font-bold text-[#361a96] bg-[#ff7dec] px-2.5 py-0.5 rounded-full shrink-0">
              2 Public Sources
            </span>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center bg-[#361a96] p-1 rounded-full border border-white/20">
              <button
                onClick={() => setActiveTab('reading')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors shrink-0 ${
                  activeTab === 'reading' ? 'bg-[#00fcfd] text-[#361a96]' : 'text-white/80 hover:text-white'
                }`}
              >
                Analysis
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors shrink-0 ${
                  activeTab === 'quotes' ? 'bg-[#00fcfd] text-[#361a96]' : 'text-white/80 hover:text-white'
                }`}
              >
                Exact Quotes
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:text-[#00fcfd] p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-[28px] sm:rounded-[36px] object-cover border-4 border-[#00fcfd] shrink-0 shadow-lg"
            />

            <div className="flex-1 min-w-0 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight break-words">
                {profile.name}
              </h2>
              <p className="text-xs font-black uppercase tracking-wider text-[#00fcfd] bg-white/10 px-3 py-1 rounded-full inline-block">
                {profile.archetype}
              </p>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed break-words">
                {profile.headline}
              </p>

              {}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#361a96] bg-[#00fcfd] font-bold px-3.5 py-1.5 rounded-full hover:bg-white transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
                <a
                  href={`https://www.picuki.com/profile/${profile.instagramUrl.replace(/.*instagram\.com\/([^/?#]+).*/,'$1').replace(/^@/,'')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#361a96] bg-[#ff7dec] font-bold px-3.5 py-1.5 rounded-full hover:bg-white transition-colors shrink-0"
                  title="View on Picuki (no login needed)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Instagram ↗ Picuki</span>
                </a>
                <a
                  href={`https://imginn.com/${profile.instagramUrl.replace(/.*instagram\.com\/([^/?#]+).*/,'$1').replace(/^@/,'')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/80 bg-white/10 font-bold px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors shrink-0"
                  title="View on Imginn (no login needed)"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Imginn</span>
                </a>
                <span className="text-xs text-white/70 font-semibold truncate">
                  Voice: {profile.communicationStyle}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-[#2b147d] border-2 border-white/15 p-6 rounded-[36px] text-sm leading-relaxed text-white">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00fcfd] block mb-1.5">
              In Two Sentences:
            </span>
            <p className="text-base text-white/95">{profile.summary}</p>
          </div>

          {}
          <div className="bg-white/10 px-5 py-3 rounded-full flex items-center justify-between text-xs text-[#00fcfd] font-bold">
            <span>Grounded strictly in public LinkedIn and Instagram.</span>
            <span className="hidden sm:inline text-white/70">Zero hallucinated claims.</span>
          </div>

          {}
          {activeTab === 'reading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {}
              <div className="bg-[#2b147d] border-2 border-white/10 p-6 rounded-[36px] space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#ff7dec] flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>What They Need from a Partner</span>
                </h4>
                <ul className="space-y-3 pt-1">
                  {profile.needs.map((claim, idx) => (
                    <li key={idx} className="text-xs space-y-1">
                      <div className="text-white font-bold text-sm">
                        • {claim.text}
                      </div>
                      <div className="text-[11px] text-white/70 bg-black/20 p-2 rounded-[16px] border border-white/10">
                        <span className="font-bold text-[#00fcfd] uppercase text-[10px] mr-1">
                          [{claim.source}]:
                        </span>
                        <span>&ldquo;{claim.evidence}&rdquo;</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {}
              <div className="bg-[#2b147d] border-2 border-white/10 p-6 rounded-[36px] space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#00fcfd] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>How They Spend Free Time (Instagram)</span>
                </h4>
                <ul className="space-y-3 pt-1">
                  {profile.hobbies.map((claim, idx) => (
                    <li key={idx} className="text-xs space-y-1">
                      <div className="text-white font-bold text-sm">
                        • {claim.text}
                      </div>
                      <div className="text-[11px] text-white/70 bg-black/20 p-2 rounded-[16px] border border-white/10">
                        <span className="font-bold text-[#ff7dec] uppercase text-[10px] mr-1">
                          [{claim.source}]:
                        </span>
                        <span>&ldquo;{claim.evidence}&rdquo;</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {}
              <div className="bg-[#2b147d] border-2 border-white/10 p-6 rounded-[36px] space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#00fcfd] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>What They Care About at Work (LinkedIn)</span>
                </h4>
                <ul className="space-y-3 pt-1">
                  {profile.interests.map((claim, idx) => (
                    <li key={idx} className="text-xs space-y-1">
                      <div className="text-white font-bold text-sm">
                        • {claim.text}
                      </div>
                      <div className="text-[11px] text-white/70 bg-black/20 p-2 rounded-[16px] border border-white/10">
                        <span className="font-bold text-[#00fcfd] uppercase text-[10px] mr-1">
                          [{claim.source}]:
                        </span>
                        <span>&ldquo;{claim.evidence}&rdquo;</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {}
              <div className="bg-[#2b147d] border-2 border-white/10 p-6 rounded-[36px] space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#ff7dec] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Dealbreakers &amp; Non-Negotiables</span>
                </h4>
                <ul className="space-y-3 pt-1">
                  {profile.dealbreakers.map((claim, idx) => (
                    <li key={idx} className="text-xs space-y-1">
                      <div className="text-[#ff7dec] font-bold text-sm">
                        ✕ {claim.text}
                      </div>
                      <div className="text-[11px] text-white/70 bg-black/20 p-2 rounded-[16px] border border-white/10">
                        <span className="font-bold text-white uppercase text-[10px] mr-1">
                          [{claim.source}]:
                        </span>
                        <span>&ldquo;{claim.evidence}&rdquo;</span>
                      </div>
                    </li>
                  ))}
                  {profile.values.map((claim, idx) => (
                    <li key={`val_${idx}`} className="text-xs space-y-1">
                      <div className="text-[#00fcfd] font-bold text-sm">
                        ✓ {claim.text}
                      </div>
                      <div className="text-[11px] text-white/70 bg-black/20 p-2 rounded-[16px] border border-white/10">
                        <span className="font-bold text-white uppercase text-[10px] mr-1">
                          [{claim.source}]:
                        </span>
                        <span>&ldquo;{claim.evidence}&rdquo;</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {}
          {activeTab === 'quotes' && (
            <div className="bg-[#2b147d] border-2 border-white/10 p-6 rounded-[36px] space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#00fcfd]">
                Exact Quotes Extracted from Their Public Profiles
              </h4>
              <div className="space-y-3">
                {[...profile.needs, ...profile.hobbies, ...profile.interests, ...profile.dealbreakers, ...profile.values].map((claim, i) => (
                  <div key={i} className="bg-black/25 p-4 rounded-[24px] border border-white/10 space-y-1 text-xs">
                    <span className="font-black text-[#00fcfd] uppercase text-[10px] bg-white/10 px-2 py-0.5 rounded-full inline-block">
                      {claim.source}
                    </span>
                    <p className="text-sm font-semibold text-white pt-1">&ldquo;{claim.evidence}&rdquo;</p>
                    <p className="text-white/70 text-xs">&rarr; Shows: {claim.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {}
        <div className="p-6 border-t-2 border-white/10 bg-[#2b147d] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/70 font-semibold">
            Their agent dates on their behalf.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onViewRankings(profile);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-full text-xs font-black uppercase text-white bg-white/15 hover:bg-white/25 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-[#00fcfd]" />
              <span>Best Matches</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onStartDating(profile);
              }}
              className="flex-1 sm:flex-none px-8 py-3 rounded-full text-xs font-black uppercase text-[#361a96] bg-[#00fcfd] hover:bg-[#33fdfe] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>Start Date</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
