import React, { useState } from 'react';
import { AgentProfile } from '../types';
import {
  PlusCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface LiveIngestProps {
  onProfileCreated: (profile: AgentProfile) => void;
  onOpenProfile: (profile: AgentProfile) => void;
}

export const LiveIngest: React.FC<LiveIngestProps> = ({
  onProfileCreated,
  onOpenProfile,
}) => {
  const [name, setName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [createdProfile, setCreatedProfile] = useState<AgentProfile | null>(null);

  const presets = [
    {
      name: 'Sam Altman',
      linkedin: 'https://www.linkedin.com/in/samaltman',
      instagram: 'https://www.instagram.com/sama',
      label: 'Sam Altman',
      notes: 'OpenAI co-founder, YC partner, loves nuclear fusion, fast cars, and building AGI.',
    },
    {
      name: 'Claire Vo',
      linkedin: 'https://www.linkedin.com/in/clairevo',
      instagram: 'https://www.instagram.com/clairevo',
      label: 'Claire Vo',
      notes: 'CPO at LaunchDarkly, creator of ChatPRD, product builder, runner, loves high speed.',
    },
    {
      name: 'Palmer Luckey',
      linkedin: 'https://www.linkedin.com/in/palmer-luckey-37299a45',
      instagram: 'https://www.instagram.com/palmerluckey',
      label: 'Palmer Luckey',
      notes: 'Oculus founder, Anduril defense builder, cosplay enthusiast, hardware geek.',
    },
    {
      name: 'Vitalik Buterin',
      linkedin: 'https://www.linkedin.com/in/vitalik-buterin-a131b793',
      instagram: 'https://www.instagram.com/vitalik.eth',
      label: 'Vitalik Buterin',
      notes: 'Ethereum creator, writes on longevity, math, quadratic voting, and decentralization.',
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setName(preset.name);
    setLinkedinUrl(preset.linkedin);
    setInstagramUrl(preset.instagram);
    setPastedText(preset.notes);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl || !instagramUrl) {
      setError('Please enter both a public LinkedIn and public Instagram link.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCreatedProfile(null);

    try {
      setCurrentStep('Reading public LinkedIn profile...');
      await new Promise((r) => setTimeout(r, 600));

      setCurrentStep('Reading public Instagram photos & bio...');
      await new Promise((r) => setTimeout(r, 700));

      setCurrentStep('Building dating persona from real facts...');

      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'New Candidate',
          linkedinUrl,
          instagramUrl,
          pastedText,
        }),
      });

      if (!res.ok) {
        throw new Error('Could not read profiles. Please check the links.');
      }

      const data = await res.json();
      const profile: AgentProfile = data.profile;

      setCurrentStep('Spawning dating agent...');
      await new Promise((r) => setTimeout(r, 500));

      setCreatedProfile(profile);
      onProfileCreated(profile);
    } catch (err: any) {
      console.error('Ingestion error:', err);
      setError(err.message || 'Could not analyze links. Please try again.');
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {}
      <div className="bg-[#361a96] text-white p-8 sm:p-10 rounded-[48px] space-y-4 shadow-xl border-4 border-[#361a96]">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#361a96] bg-[#00fcfd] px-3.5 py-1 rounded-full">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add a Real Person</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight">
          Paste two links. Build an agent.
        </h2>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
          Enter any real person&apos;s public LinkedIn and Instagram. Their agent reads both profiles, joins the roster, and immediately starts speed dating against the other 25 people.
        </p>

        {}
        <div className="pt-3 border-t-2 border-white/10">
          <span className="text-xs font-black uppercase text-[#00fcfd] block mb-2">
            Try someone with one click:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-white/15 hover:bg-white/25 transition-colors"
              >
                + {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {}
      <form onSubmit={handleSubmit} className="bg-[#ffffff] text-[#361a96] border-4 border-[#361a96] p-6 sm:p-10 rounded-[48px] space-y-6 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-black uppercase text-[#361a96] block mb-2">
              Full Name:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sam Altman"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#f5efff] border-2 border-[#361a96]/20 rounded-full px-4 py-3 text-xs text-[#361a96] font-bold placeholder-[#888888] focus:outline-none focus:border-[#361a96]"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-[#361a96] block mb-2">
              LinkedIn Profile Link:
            </label>
            <input
              type="url"
              required
              placeholder="https://linkedin.com/in/..."
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full bg-[#f5efff] border-2 border-[#361a96]/20 rounded-full px-4 py-3 text-xs text-[#361a96] font-bold placeholder-[#888888] focus:outline-none focus:border-[#361a96]"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-[#361a96] block mb-2">
              Public Instagram Link:
            </label>
            <input
              type="url"
              required
              placeholder="https://instagram.com/..."
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full bg-[#f5efff] border-2 border-[#361a96]/20 rounded-full px-4 py-3 text-xs text-[#361a96] font-bold placeholder-[#888888] focus:outline-none focus:border-[#361a96]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-black uppercase text-[#361a96] block mb-2">
            Optional Notes or Bio:
          </label>
          <textarea
            rows={2}
            placeholder="Paste any extra bio lines or recent posts here..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            className="w-full bg-[#f5efff] border-2 border-[#361a96]/20 rounded-[24px] p-4 text-xs text-[#361a96] font-medium placeholder-[#888888] focus:outline-none focus:border-[#361a96]"
          />
        </div>

        {}
        {isLoading && (
          <div className="p-4 bg-[#ff7dec]/30 border-2 border-[#361a96] rounded-[24px] flex items-center gap-3 font-bold text-xs text-[#361a96]">
            <Loader2 className="w-5 h-5 animate-spin text-[#361a96] shrink-0" />
            <span className="truncate">{currentStep}</span>
          </div>
        )}

        {error && (
          <p className="text-xs font-bold text-red-600 bg-red-100 p-4 rounded-[24px] border border-red-300 break-words">
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t-2 border-[#361a96]/15">
          <span className="text-xs font-bold text-[#666666]">
            Only public profiles. No passwords needed.
          </span>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 rounded-full text-xs font-black uppercase text-white bg-[#5f2dfe] hover:bg-[#4b1ecc] transition-all flex items-center gap-2 shadow-lg disabled:opacity-40 shrink-0 w-full sm:w-auto justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reading...</span>
              </>
            ) : (
              <span>Build their agent</span>
            )}
          </button>
        </div>
      </form>

      {}
      {createdProfile && (
        <div className="bg-[#361a96] text-white border-4 border-[#00fcfd] p-6 sm:p-8 rounded-[48px] space-y-4 shadow-xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00fcfd]">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Agent is live and added to the roster</span>
            </div>
            <span className="text-xs font-bold text-white/70">
              {Math.round(createdProfile.confidence * 100)}% Verified
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#2b147d] p-5 sm:p-6 rounded-[32px] border-2 border-white/10">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <img
                src={createdProfile.avatarUrl}
                alt={createdProfile.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] sm:rounded-[24px] object-cover border-2 border-[#00fcfd] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-heading font-black text-white truncate">
                  {createdProfile.name}
                </h3>
                <p className="text-xs text-[#00fcfd] font-bold uppercase truncate">{createdProfile.archetype}</p>
                <p className="text-xs text-white/80 line-clamp-1 italic mt-0.5 break-words">
                  {createdProfile.summary}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenProfile(createdProfile)}
              className="px-6 py-2.5 bg-[#00fcfd] hover:bg-[#33fdfe] text-[#361a96] text-xs font-black uppercase rounded-full transition-colors shrink-0 w-full sm:w-auto text-center"
            >
              Open Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
