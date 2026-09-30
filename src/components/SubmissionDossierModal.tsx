import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Youtube,
} from 'lucide-react';

export const SubmissionDossierModal: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const overallExplanation =
    'Cupidly: AI dating app where agents representing 25 real people analyze public LinkedIn + Instagram profiles, date on their behalf in multi-turn dialogues, and rank who fits each person best.';

  const technicalSection =
    'Dual-source pipeline: Apify headless actors (apify/instagram-profile-scraper and harvestapi/linkedin-profile-scraper) extract public bio, captions, experience, and metadata via residential rotating proxies. An anti-hallucination validation gate in TypeScript forces every extracted need, hobby, and dealbreaker to quote verbatim text from the respective source, rejecting non-grounded claims before instantiating the LLM agent persona.';

  const videoScript = `[0:00 - 0:35] Profile Reading & Analysis:
• Show the 25 real people grid dynamically loaded from the pipeline.
• Open candidate cards (e.g. Lex Fridman, Cassidy Williams, Sarah Guo) to inspect their profile pages.
• Show the strict two-source constraint: LinkedIn (work & needs) + Instagram (hobbies & lifestyle).
• Show how every claim quotes verbatim text from their verified sources.

[0:35 - 1:45] The Agents Actually Dating:
• Pick any pair of candidates from the dropdown or quick pairs.
• Click "Start Date Simulation".
• Watch the multi-turn conversation unfold at the wine bar.
• Call out the "What they're thinking" feature: their true private reactions while speaking.
• Show how dealbreakers are tested.
• Show the post-date scorecard: Mutual fit %, individual reviews, best moment, and friction points.

[1:45 - 2:25] Compatibility Rankings:
• Go to the "Who Fits Who" tab.
• Select any candidate from the roster.
• Show the #1 Best Match and the full reciprocal leaderboard across all 24 candidates.
• Explain the score: 60% what their own agent thought + 40% how much the other liked them back.
• Click "Watch Date" to replay their exact conversation.

[2:25 - 3:00] Live URL Ingest Demo:
• Go to "Add Someone" tab.
• Paste two real public links (LinkedIn + Instagram).
• Watch the agent read both links and quote real excerpts.
• Spawn the agent and run a date against the roster.`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {}
      <div className="bg-[#361a96] text-white p-8 sm:p-10 rounded-[48px] space-y-3 shadow-xl border-4 border-[#361a96]">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#361a96] bg-[#00fcfd] px-3.5 py-1 rounded-full">
          <FileText className="w-3.5 h-3.5" />
          <span>Test Submission Package</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight">
          Everything for Hand-In
        </h2>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
          Here are your exact deliverables: the 200-character description, 500-character technical breakdown, and 3-minute video presentation script.
        </p>
      </div>

      {}
      <div className="bg-[#ffffff] text-[#361a96] border-4 border-[#361a96] p-6 sm:p-8 rounded-[48px] space-y-4 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-black uppercase tracking-wider text-[#361a96]">
              Overall Explanation (0/200)
            </span>
            <span className="text-xs font-black text-[#361a96] bg-[#ff7dec] px-3 py-0.5 rounded-full shrink-0">
              {overallExplanation.length} / 200 chars
            </span>
          </div>

          <button
            onClick={() => copyToClipboard(overallExplanation, 'overall')}
            className="px-5 py-2 bg-[#361a96] hover:bg-[#5f2dfe] text-white rounded-full text-xs font-black uppercase transition-colors flex items-center justify-center gap-1.5 shadow self-start sm:self-auto shrink-0"
          >
            {copiedKey === 'overall' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00fcfd]" />
                <span className="text-[#00fcfd]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#f5efff] p-5 rounded-[28px] text-xs sm:text-sm font-bold text-[#361a96] leading-relaxed border-2 border-[#361a96]/15 select-all break-words">
          {overallExplanation}
        </div>
      </div>

      {}
      <div className="bg-[#ffffff] text-[#361a96] border-4 border-[#361a96] p-6 sm:p-8 rounded-[48px] space-y-4 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-black uppercase tracking-wider text-[#361a96]">
              Technical Section: Scraping Stack (0/500)
            </span>
            <span className="text-xs font-black text-[#361a96] bg-[#00fcfd] px-3 py-0.5 rounded-full shrink-0">
              {technicalSection.length} / 500 chars
            </span>
          </div>

          <button
            onClick={() => copyToClipboard(technicalSection, 'tech')}
            className="px-5 py-2 bg-[#361a96] hover:bg-[#5f2dfe] text-white rounded-full text-xs font-black uppercase transition-colors flex items-center justify-center gap-1.5 shadow self-start sm:self-auto shrink-0"
          >
            {copiedKey === 'tech' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00fcfd]" />
                <span className="text-[#00fcfd]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#f5efff] p-5 rounded-[28px] text-xs sm:text-sm font-bold text-[#361a96] leading-relaxed border-2 border-[#361a96]/15 select-all break-words">
          {technicalSection}
        </div>
      </div>

      {}
      <div className="bg-[#ffffff] text-[#361a96] border-4 border-[#361a96] p-6 sm:p-8 rounded-[48px] space-y-4 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Youtube className="w-5 h-5 text-[#ff0000] shrink-0" />
            <span className="text-sm font-black uppercase tracking-wider text-[#361a96]">
              3-Minute Video Script &amp; Outline
            </span>
          </div>

          <button
            onClick={() => copyToClipboard(videoScript, 'script')}
            className="px-5 py-2 bg-[#361a96] hover:bg-[#5f2dfe] text-white rounded-full text-xs font-black uppercase transition-colors flex items-center justify-center gap-1.5 shadow self-start sm:self-auto shrink-0"
          >
            {copiedKey === 'script' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00fcfd]" />
                <span className="text-[#00fcfd]">Copied Script!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#f5efff] p-5 rounded-[28px] text-xs font-mono text-[#361a96] leading-relaxed whitespace-pre-wrap border-2 border-[#361a96]/15 select-all break-words overflow-x-auto">
          {videoScript}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#361a96] text-white p-6 rounded-[36px] space-y-2 border-2 border-white/10">
          <span className="text-xs font-black uppercase text-[#00fcfd] block">
            DEMO LINK (ALREADY RUN):
          </span>
          <div className="text-xs font-mono text-white truncate font-bold">
            {typeof window !== 'undefined' ? window.location.origin : 'https://cupidly-agentic-dating.vercel.app'}
          </div>
          <p className="text-xs text-white/70">
            25 real people with simulated dates ready to inspect with zero typing.
          </p>
        </div>

        <div className="bg-[#361a96] text-white p-6 rounded-[36px] space-y-2 border-2 border-white/10">
          <span className="text-xs font-black uppercase text-[#ff7dec] block">
            GITHUB REPO:
          </span>
          <div className="text-xs font-mono text-white truncate font-bold">
            https://github.com/your-username/agentic-dating-platform
          </div>
          <p className="text-xs text-white/70">
            Public repository with complete dataset and full-stack Express code.
          </p>
        </div>
      </div>
    </div>
  );
};
