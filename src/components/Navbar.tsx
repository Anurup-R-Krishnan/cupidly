import React from 'react';
import { Users, Flame, Trophy, PlusCircle, FileText, Heart } from 'lucide-react';

interface NavbarProps {
  activeTab: 'roster' | 'date' | 'rankings' | 'ingest' | 'dossier';
  setActiveTab: (tab: 'roster' | 'date' | 'rankings' | 'ingest' | 'dossier') => void;
  profilesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, profilesCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#ff7dec]/90 backdrop-blur-md px-6 py-4 border-b-2 border-[#361a96]/15">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('roster')}
          >
            <div className="h-11 w-11 rounded-full bg-[#361a96] flex items-center justify-center text-[#00fcfd] shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-current text-[#00fcfd]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-tight text-[#361a96]">
                  CUPIDLY
                </span>
                <span className="text-[11px] font-black uppercase bg-[#00fcfd] text-[#361a96] px-2.5 py-0.5 rounded-full shadow-sm">
                  Agent Dating
                </span>
              </div>
              <p className="text-xs font-bold text-[#361a96]/80">
                Your agent goes on the dates for you
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#361a96] bg-white px-4 py-1.5 rounded-full border-2 border-[#361a96] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#5f2dfe]" />
            <span>LinkedIn + Instagram only</span>
          </div>
        </div>

        {}
        <nav className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'roster'
                ? 'bg-[#361a96] text-[#00fcfd] shadow-lg scale-105'
                : 'bg-white text-[#361a96] hover:bg-[#361a96] hover:text-white border-2 border-[#361a96]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>The 25 People</span>
          </button>

          <button
            onClick={() => setActiveTab('date')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'date'
                ? 'bg-[#361a96] text-[#00fcfd] shadow-lg scale-105'
                : 'bg-white text-[#361a96] hover:bg-[#361a96] hover:text-white border-2 border-[#361a96]'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Dating Log</span>
          </button>

          <button
            onClick={() => setActiveTab('rankings')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'rankings'
                ? 'bg-[#361a96] text-[#00fcfd] shadow-lg scale-105'
                : 'bg-white text-[#361a96] hover:bg-[#361a96] hover:text-white border-2 border-[#361a96]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Best Matches</span>
          </button>

          <button
            onClick={() => setActiveTab('ingest')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'ingest'
                ? 'bg-[#361a96] text-[#00fcfd] shadow-lg scale-105'
                : 'bg-white text-[#361a96] hover:bg-[#361a96] hover:text-white border-2 border-[#361a96]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Someone</span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all flex items-center gap-2 whitespace-nowrap border-2 border-[#361a96] shrink-0 ${
              activeTab === 'dossier'
                ? 'bg-[#00fcfd] text-[#361a96] shadow-lg'
                : 'bg-[#5f2dfe] text-white hover:bg-[#4b1ecc]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Hand-In</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
