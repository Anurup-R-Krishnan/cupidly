import React, { useState, useEffect } from 'react';
import { cacheDateResult } from './lib/rankingEngine';
import { AgentProfile } from './types';
import { Navbar } from './components/Navbar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileModal } from './components/ProfileModal';
import { DateArena } from './components/DateArena';
import { RankingsMatrix } from './components/RankingsMatrix';
import { LiveIngest } from './components/LiveIngest';
import { SubmissionDossierModal } from './components/SubmissionDossierModal';
import {
  Search,
  Flame,
  PlusCircle,
  Shuffle,
  Trophy,
  Heart,
} from 'lucide-react';

export default function App() {
  const [profiles, setProfiles] = useState<AgentProfile[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'date' | 'rankings' | 'ingest' | 'dossier'>('roster');
  const [selectedProfile, setSelectedProfile] = useState<AgentProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'founders' | 'researchers' | 'builders'>('all');

  const [datePair, setDatePair] = useState<{ agentAId: string; agentBId: string }>({
    agentAId: '',
    agentBId: '',
  });

  const [rankingTargetId, setRankingTargetId] = useState<string>('');

  useEffect(() => {
    fetch('/api/demo')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
          (data.dates || []).forEach(cacheDateResult);
          setLoaded(true);
          setProfiles(data.profiles);
          setDatePair((prev) => ({
            agentAId: prev.agentAId || data.profiles[0]?.id || '',
            agentBId: prev.agentBId || data.profiles[1]?.id || '',
          }));
          setRankingTargetId((prev) => prev || data.profiles[0]?.id || '');
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenProfile = (p: AgentProfile) => {
    setSelectedProfile(p);
  };

  const handleStartDating = (p: AgentProfile) => {
    const other = profiles.find((candidate) => candidate.id !== p.id) || profiles[1];
    setDatePair({
      agentAId: p.id,
      agentBId: other.id,
    });
    setActiveTab('date');
  };

  const handleRandomDate = () => {
    if (profiles.length < 2) return;
    const idxA = Math.floor(Math.random() * profiles.length);
    let idxB = Math.floor(Math.random() * (profiles.length - 1));
    if (idxB >= idxA) idxB += 1;

    setDatePair({
      agentAId: profiles[idxA].id,
      agentBId: profiles[idxB].id,
    });
    setActiveTab('date');
  };

  const handleViewRankings = (p: AgentProfile) => {
    setRankingTargetId(p.id);
    setActiveTab('rankings');
  };

  const handleSelectDatePair = (agentA: AgentProfile, agentB: AgentProfile) => {
    setDatePair({
      agentAId: agentA.id,
      agentBId: agentB.id,
    });
    setActiveTab('date');
  };

  const handleProfileCreated = (newProfile: AgentProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
    setSelectedProfile(newProfile);
  };

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.archetype.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.needs.some((n) => n.text.toLowerCase().includes(q)) ||
      p.hobbies.some((h) => h.text.toLowerCase().includes(q)) ||
      p.interests.some((i) => i.text.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (categoryFilter === 'all') return true;
    const arch = p.archetype.toLowerCase();
    const sum = p.summary.toLowerCase();

    if (categoryFilter === 'founders') {
      return arch.includes('founder') || arch.includes('builder') || sum.includes('founder') || sum.includes('ceo');
    }
    if (categoryFilter === 'researchers') {
      return arch.includes('theorist') || arch.includes('polymath') || arch.includes('scientist') || sum.includes('research');
    }
    if (categoryFilter === 'builders') {
      return arch.includes('architect') || arch.includes('craftsman') || arch.includes('hacker') || arch.includes('engineer');
    }

    return true;
  });

  if (!loaded) return <div className="min-h-screen bg-[#ff7dec] text-[#361a96] flex items-center justify-center font-black text-2xl">Loading agents…</div>;

  return (
    <div className="min-h-screen bg-[#ff7dec] text-[#361a96] flex flex-col selection:bg-[#00fcfd] selection:text-[#361a96]">
      {}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profilesCount={profiles.length}
      />

      {}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8 min-w-0">
        {}
        {activeTab === 'roster' && (
          <div className="space-y-8">
            {}
            <div className="bg-[#361a96] text-white p-6 sm:p-12 rounded-[40px] sm:rounded-[48px] space-y-6 relative overflow-hidden shadow-2xl border-4 border-[#361a96]">
              <div className="relative z-10 space-y-5 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#361a96] bg-[#00fcfd] px-4 py-1.5 rounded-full">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Agent Dating</span>
                </div>

                <h1 className="text-3xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-white leading-tight break-words">
                  Meet someone you actually want to talk to.
                </h1>

                <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium max-w-2xl break-words">
                  Two public links: LinkedIn and Instagram. Your agent reads both, goes on dates on your behalf, and figures out who is actually worth your time.
                </p>

                {}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={handleRandomDate}
                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#00fcfd] hover:bg-[#33fdfe] text-[#361a96] rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg hover:scale-105 shrink-0"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Set up a blind date</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rankings')}
                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#5f2dfe] hover:bg-[#4b1ecc] text-white rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shrink-0"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>See who fits best</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ingest')}
                    className="px-5 sm:px-6 py-3.5 sm:py-4 bg-white/15 hover:bg-white/25 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add someone new</span>
                  </button>
                </div>
              </div>

              {}
              <div className="pt-6 border-t-2 border-white/10 flex flex-wrap items-center gap-4 text-xs font-bold text-white/80">
                <span className="flex items-center gap-2 shrink-0">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00fcfd]" />
                  <span>25 Real People Roster</span>
                </span>
                <span>·</span>
                <span className="shrink-0">300 Dates Simulated</span>
                <span>·</span>
                <span className="shrink-0">LinkedIn + Instagram verified</span>
              </div>
            </div>

            {}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all border-2 border-[#361a96] shrink-0 ${
                    categoryFilter === 'all'
                      ? 'bg-[#361a96] text-[#00fcfd] shadow-md'
                      : 'bg-white text-[#361a96] hover:bg-[#361a96] hover:text-white'
                  }`}
                >
                  All ({profiles.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('founders')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all border-2 border-[#361a96] shrink-0 ${
                    categoryFilter === 'founders'
                      ? 'bg-[#361a96] text-[#00fcfd] shadow-md'
                      : 'bg-white text-[#361a96] hover:bg-[#361a96] hover:text-white'
                  }`}
                >
                  Founders &amp; CEOs
                </button>
                <button
                  onClick={() => setCategoryFilter('researchers')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all border-2 border-[#361a96] shrink-0 ${
                    categoryFilter === 'researchers'
                      ? 'bg-[#361a96] text-[#00fcfd] shadow-md'
                      : 'bg-white text-[#361a96] hover:bg-[#361a96] hover:text-white'
                  }`}
                >
                  Researchers
                </button>
                <button
                  onClick={() => setCategoryFilter('builders')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all border-2 border-[#361a96] shrink-0 ${
                    categoryFilter === 'builders'
                      ? 'bg-[#361a96] text-[#00fcfd] shadow-md'
                      : 'bg-white text-[#361a96] hover:bg-[#361a96] hover:text-white'
                  }`}
                >
                  Builders
                </button>
              </div>

              {}
              <div className="relative w-full sm:w-80 shrink-0">
                <Search className="w-4 h-4 text-[#361a96] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search someone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-[#361a96] font-bold border-2 border-[#361a96] rounded-full pl-11 pr-5 py-2.5 text-xs placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#5f2dfe]"
                />
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.map((p) => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  onSelect={handleOpenProfile}
                  onDateWith={handleStartDating}
                />
              ))}
            </div>

            {filteredProfiles.length === 0 && (
              <div className="text-center py-20 space-y-3 bg-white border-4 border-[#361a96] rounded-[48px]">
                <p className="text-sm font-bold text-[#361a96]">Nobody found matching &ldquo;{searchQuery}&rdquo;</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                  }}
                  className="text-xs text-[#5f2dfe] font-black underline uppercase tracking-wider"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}

        {}
        {activeTab === 'date' && (
          <DateArena
            profiles={profiles}
            initialAgentAId={datePair.agentAId}
            initialAgentBId={datePair.agentBId}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {}
        {activeTab === 'rankings' && (
          <RankingsMatrix
            profiles={profiles}
            initialTargetId={rankingTargetId}
            onSelectDatePair={handleSelectDatePair}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {}
        {activeTab === 'ingest' && (
          <LiveIngest
            onProfileCreated={handleProfileCreated}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {}
        {activeTab === 'dossier' && <SubmissionDossierModal />}
      </main>

      {}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onStartDating={handleStartDating}
          onViewRankings={handleViewRankings}
        />
      )}

      {}
      <footer className="border-t-2 border-[#361a96]/15 bg-[#361a96] text-white py-8 px-6 text-center text-xs space-y-2">
        <p className="font-heading font-black text-sm uppercase tracking-wider">
          CUPIDLY · MEET SOMEONE YOU ACTUALLY WANT TO TALK TO
        </p>
        <p className="text-xs text-white/70">
          Two public links per person: LinkedIn + Instagram. Your agent handles the awkward first dates.
        </p>
      </footer>
    </div>
  );
}
