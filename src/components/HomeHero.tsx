import React from 'react';
import { Code, Monitor, Smartphone, Cog, Palette, ArrowRight, HardDrive } from 'lucide-react';
import { MarjonLogo } from './MarjonLogo';
import { StorageStats } from '../types';

interface HomeHeroProps {
  stats: StorageStats;
  onNavigate: (sectionId: string) => void;
  onOpenResumePreview: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ stats, onNavigate, onOpenResumePreview }) => {
  const serviceCategories = [
    { id: 'web', icon: <Code className="w-5 h-5" />, label: 'Web Development', target: 'services' },
    { id: 'software', icon: <Monitor className="w-5 h-5" />, label: 'Software Development', target: 'services' },
    { id: 'mobile', icon: <Smartphone className="w-5 h-5" />, label: 'Mobile Apps', target: 'services' },
    { id: 'system', icon: <Cog className="w-5 h-5" />, label: 'System & Automation', target: 'services' },
    { id: 'design', icon: <Palette className="w-5 h-5" />, label: 'Design & Media', target: 'services' },
  ];

  return (
    <section id="home" className="relative pt-6 pb-16 md:pt-10 md:pb-24 overflow-hidden">
      {/* Cinematic Golden Sunset & Dusk Atmosphere Backing (matching Home Page Banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#090d19]">
          {/* Sunset Horizon Ambient Gradients & Hero WebP Asset */}
          <img
            src="/images/home/hero.webp"
            alt="Marjon Sealza - Computer Engineer Home Hero Banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen pointer-events-none"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b16]/90 via-[#10142b]/80 to-[#281329]/75 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#f59e0b]/20 via-[#ec4899]/15 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Main Hero Container */}
          <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 md:py-20 lg:px-14 flex flex-col justify-between min-h-[540px]">
            {/* Top row with Logo and status */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <MarjonLogo className="w-9 h-9 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
                <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                  Official Portfolio & Digital Solutions
                </span>
              </div>
              <button
                onClick={() => onNavigate('drive-storage')}
                className="hidden sm:flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full cursor-pointer hover:bg-amber-500/20 transition-colors"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Google Drive Synced ({stats.totalAssets} Files)</span>
              </button>
            </div>

            {/* Center Typographic Display (Exact layout from Home Page Images) */}
            <div className="my-8 md:my-12 flex flex-col items-center text-center max-w-4xl mx-auto">
              {/* Silhouette / Profile Badge on the left look */}
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-300">Open for Freelance & Systems Engineering</span>
              </div>

              {/* Bold Title: MARJON SEALZA */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none">
                MARJON{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                  SEALZA
                </span>
              </h1>

              {/* Subtitle: COMPUTER ENGINEER */}
              <div className="mt-4 text-xs sm:text-sm md:text-base font-bold tracking-[0.35em] text-cyan-300 uppercase">
                C O M P U T E R &nbsp; E N G I N E E R
              </div>

              {/* Quotation: "Turning ideas into useful digital solutions." */}
              <p className="mt-4 text-base sm:text-xl md:text-2xl text-slate-200 italic font-medium max-w-2xl font-serif">
                “Turning ideas into useful digital solutions.”
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="px-7 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 hover:opacity-95 rounded-xl shadow-lg shadow-fuchsia-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-slate-900/80 hover:bg-white/10 border border-white/15 rounded-xl transition-all cursor-pointer"
                >
                  View Services
                </button>

                <button
                  onClick={onOpenResumePreview}
                  className="px-5 py-3 text-xs sm:text-sm font-medium text-cyan-300 hover:text-white transition-colors cursor-pointer"
                >
                  Resume PDF
                </button>
              </div>
            </div>

            {/* Bottom 5 Core Service Tiles (Exact strip from Home Page Images) */}
            <div className="pt-6 border-t border-white/[0.08]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                {serviceCategories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.target)}
                    className="group p-3.5 sm:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.08] hover:border-cyan-400/50 backdrop-blur-md transition-all duration-200 flex flex-col items-center text-center cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:text-fuchsia-400 group-hover:scale-110 transition-all mb-2">
                      {item.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
