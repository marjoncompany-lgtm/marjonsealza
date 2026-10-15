import React from 'react';
import { ArrowRight, Download, ExternalLink, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { DRIVE_FOLDER_URL, USER_EMAIL } from '../data/portfolioData';
import { StorageStats } from '../types';

interface HeroProps {
  stats: StorageStats;
  onNavigate: (sectionId: string) => void;
  onOpenResumePreview: () => void;
}

export const Hero: React.FC<HeroProps> = ({ stats, onNavigate, onOpenResumePreview }) => {
  return (
    <section id="about" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Split-screen Hero (Left: Typographic punch, Right: Interactive Live Status & Storage Console) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column (7 cols): Typographic hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Quiet 1-line kicker (NO PILL BADGE) */}
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 tracking-wider uppercase mb-4">
              <span>Full-Stack Systems Engineer</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Cloud Storage Architect</span>
            </div>

            {/* Display Headline with balanced line wrap */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.12] mb-6 [text-wrap:balance]">
              Building resilient cloud systems & high-performance storage architectures.
            </h1>

            {/* Lead Prose (65-75ch measure) */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              Hi, I’m <span className="text-white font-semibold">Marjon Sealza</span>. I architect distributed web platforms, high-throughput data pipelines, and responsive frontend systems. Currently engineering modern hybrid storage synchronizers powered by Google Drive cloud backends and zero-latency client caches.
            </p>

            {/* Primary & Secondary Action Group */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('projects')}
                className="px-6 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl shadow-lg shadow-cyan-500/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('drive-storage')}
                className="px-5 py-3 text-sm font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>Drive Storage Hub</span>
              </button>

              <button
                onClick={onOpenResumePreview}
                className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Resume PDF</span>
              </button>
            </div>

            {/* Unboxed inline contact helper */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span>Direct Inquiries:</span>
              <a
                href={`mailto:${USER_EMAIL}`}
                className="text-cyan-400 hover:underline font-mono"
              >
                {USER_EMAIL}
              </a>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Remote / Worldwide</span>
            </div>
          </div>

          {/* Right Column (5 cols): Live Interactive Status & Cloud Storage Hub Monitor */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Subtle top ambient glow */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Cloud Storage Node</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Synced Real-Time</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Drive Folder Connection status */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.06]">
                    <div className="text-slate-400 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                        <span>Google Drive Storage Target</span>
                      </span>
                      <a
                        href={DRIVE_FOLDER_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>Open Folder</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="font-mono text-slate-200 truncate text-[11px]">
                      folderId: {stats.folderId}
                    </p>
                  </div>

                  {/* Performance metrics grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-white/[0.05]">
                      <div className="text-slate-400 text-[11px] mb-1">Cache Hit Rate</div>
                      <div className="text-lg font-bold font-mono tabular-nums text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>{stats.cacheHitRatio}%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Zero-latency hits</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/40 border border-white/[0.05]">
                      <div className="text-slate-400 text-[11px] mb-1">Managed Assets</div>
                      <div className="text-lg font-bold font-mono tabular-nums text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{stats.totalAssets} Files</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">PDFs, blueprints, media</div>
                    </div>
                  </div>

                  {/* Dynamic storage category breakdown */}
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/[0.05] space-y-2">
                    <div className="text-slate-400 text-[11px] flex justify-between">
                      <span>Synchronized Asset Categories</span>
                      <span className="font-mono text-slate-300">5 active scopes</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden flex">
                      <div style={{ width: '35%' }} className="bg-cyan-500 h-full" title="Architecture" />
                      <div style={{ width: '25%' }} className="bg-blue-500 h-full" title="Case Studies" />
                      <div style={{ width: '20%' }} className="bg-amber-500 h-full" title="Project Media" />
                      <div style={{ width: '12%' }} className="bg-emerald-500 h-full" title="Certificates" />
                      <div style={{ width: '8%' }} className="bg-purple-500 h-full" title="Resume" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                      <span>Blueprints & Specs</span>
                      <span>Case Studies</span>
                      <span>Resume & Media</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Console Footer */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-slate-400">Offline-first client cache ready</span>
                <button
                  onClick={() => onNavigate('drive-storage')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width row below the split: 4-column KPI metric strip (Section 2.B portfolio rule) */}
        <div className="mt-14 pt-10 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">6+ Years</div>
            <div className="text-xs text-slate-400">Full-Stack & Systems Engineering</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">18+ Shipped</div>
            <div className="text-xs text-slate-400">Production Systems & Platforms</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">99.98%</div>
            <div className="text-xs text-slate-400">Reliability & SLA Standard</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-400">100% Synced</div>
            <div className="text-xs text-slate-400">Google Drive Cloud Storage Hub</div>
          </div>
        </div>
      </div>
    </section>
  );
};
