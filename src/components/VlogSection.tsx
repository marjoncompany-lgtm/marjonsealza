import React, { useState } from 'react';
import { Play, Video, Eye, Clock, Sparkles, ExternalLink, X } from 'lucide-react';

interface VlogEpisode {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  publishDate: string;
  summary: string;
  gradient: string;
  videoUrl?: string;
}

export const VlogSection: React.FC = () => {
  const [activeEpisode, setActiveEpisode] = useState<VlogEpisode | null>(null);

  const episodes: VlogEpisode[] = [
    {
      id: 'vlog-1',
      title: 'Building a Cloud Storage Sync Engine from Scratch with Google Drive API',
      category: 'Tutorials & Code',
      duration: '18:42',
      views: '12.4k',
      publishDate: 'Oct 2026',
      summary: 'Architecting zero-latency client caches, handling token rotation, and syncing files directly with Google Drive.',
      gradient: 'from-cyan-600/30 via-blue-600/20 to-purple-800/20',
    },
    {
      id: 'vlog-2',
      title: 'A Day in the Life of a Computer Engineer in Bataan, Philippines',
      category: 'Life & Tech',
      duration: '14:15',
      views: '28.9k',
      publishDate: 'Sep 2026',
      summary: 'Exploring remote engineering workflows, coastal scenery, workspace setup, and balancing client systems.',
      gradient: 'from-amber-600/30 via-orange-600/20 to-rose-800/20',
    },
    {
      id: 'vlog-3',
      title: 'Designing Accessible Enterprise Dashboards with Zero-Pill Typography',
      category: 'Projects & Design',
      duration: '16:08',
      views: '9.8k',
      publishDate: 'Aug 2026',
      summary: 'Why AI-slop UI design hurts usability, and how to structure production React applications with clean tabular hierarchy.',
      gradient: 'from-fuchsia-600/30 via-purple-600/20 to-indigo-800/20',
    },
    {
      id: 'vlog-4',
      title: 'Cinematic Drone Filmmaking & Tech Gear Breakdown for Engineers',
      category: 'Travel & Gear',
      duration: '11:55',
      views: '15.1k',
      publishDate: 'Jul 2026',
      summary: 'My portable creator setup: mirrorless camera rig, directional audio, drone capture, and rapid video editing.',
      gradient: 'from-emerald-600/30 via-teal-600/20 to-blue-800/20',
    },
  ];

  const tags = ['Ideas', 'Projects', 'Tutorials', 'Life', 'Travel', 'Tech'];

  return (
    <section id="vlog" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner matching Vlog Page Images */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#090d1a] mb-12">
          {/* Sunset Horizon Backing & Vlog Banner WebP Asset */}
          <img
            src="/images/vlog/vlog-banner.webp"
            alt="Marjon Sealza - Vlog Document Create Share Inspire Banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen pointer-events-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b16]/95 via-[#1a0e1c]/80 to-[#2b1016]/85 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f59e0b]/25 via-[#ec4899]/15 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 md:p-14">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Side: VLOG Title with stylized red play button inside the 'O' */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 mb-4 text-xs font-mono text-cyan-400">
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Media, Tutorials & Creative Journey</span>
                </div>

                {/* VLOG Title with play button inside O */}
                <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight flex items-center justify-center lg:justify-start gap-1">
                  <span>VL</span>
                  {/* Styled O with red/magenta play button */}
                  <span className="relative inline-flex items-center justify-center w-[0.85em] h-[0.85em] rounded-full border-[0.14em] border-white mx-0.5">
                    <span className="w-0 h-0 border-y-[0.25em] border-y-transparent border-l-[0.45em] border-l-rose-500 ml-1" />
                  </span>
                  <span>G</span>
                </h2>

                {/* Subtitle Tags: Ideas · Projects · Tutorials · Life · Travel · Tech */}
                <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-300 font-semibold font-mono">
                  {tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span className="hover:text-cyan-400 transition-colors">{tag}</span>
                      {idx < tags.length - 1 && <span className="text-slate-600">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Right Side: Handwritten Cursive Loop (Document Create Share Inspire) */}
              <div className="text-center lg:text-right border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-10">
                <div className="font-['Caveat'] text-3xl sm:text-4xl text-amber-200/95 leading-tight space-y-1">
                  <div className="text-amber-300 font-bold">Document</div>
                  <div className="text-orange-300">Create</div>
                  <div className="text-rose-300 font-bold">Share</div>
                  <div className="text-pink-400 font-bold">Inspire</div>
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-2">
                  Content Philosophy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Episodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              onClick={() => setActiveEpisode(ep)}
              className="group rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 backdrop-blur-md overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div
                className={`h-40 w-full relative bg-gradient-to-br ${ep.gradient} p-4 flex flex-col justify-between overflow-hidden border-b border-white/[0.08]`}
              >
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono text-slate-200 bg-black/60 px-2 py-0.5 rounded">
                    {ep.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-200 bg-black/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ep.duration}</span>
                  </span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="self-center z-10 w-11 h-11 rounded-full bg-rose-600/90 group-hover:scale-125 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-white" />
                </div>

                <div className="flex items-center justify-between z-10 text-[10px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{ep.views} views</span>
                  </span>
                  <span>{ep.publishDate}</span>
                </div>
              </div>

              {/* Title & Summary */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                    {ep.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {ep.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-rose-400 font-semibold">
                  <span>Watch Episode</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Player Preview */}
        {activeEpisode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 text-slate-100">
              <div className="px-5 py-3 border-b border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400">{activeEpisode.category}</span>
                <button
                  onClick={() => setActiveEpisode(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated Responsive Video Frame */}
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                    <Play className="w-8 h-8 ml-1 fill-white" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white max-w-md">
                    {activeEpisode.title}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Full HD episode recorded in Bataan, Philippines · Production workflow, code walkthrough, and creative insights.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 flex items-center justify-between text-xs">
                <span className="text-slate-400">{activeEpisode.publishDate} · {activeEpisode.duration}</span>
                <button
                  onClick={() => setActiveEpisode(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-rose-500 hover:bg-rose-400 rounded-lg"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
