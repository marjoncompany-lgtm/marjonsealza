import React, { useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight, Terminal, HardDrive } from 'lucide-react';
import { PortfolioProject, ProjectCategory } from '../types';
import { MarjonLogo } from './MarjonLogo';

interface ProjectShowcaseProps {
  projects: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
  onNavigateToDrive: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  projects,
  onSelectProject,
  onNavigateToDrive,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Full-Stack', 'Cloud & DevOps', 'APIs & Storage', 'Systems'];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === (activeCategory as ProjectCategory));

  return (
    <section id="portfolio" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner matching Portfolio Page Images */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#080d1e] mb-12">
          {/* Ambient Lighting Gradients & Portfolio Banner WebP Asset */}
          <img
            src="/images/portfolio/portfolio-banner.webp"
            alt="Marjon Sealza - Engineering Portfolio Banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen pointer-events-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b16]/95 via-[#10132d]/80 to-[#1f0d25]/85 pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 md:p-14">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              {/* Left Side: MY PORTFOLIO with scope tags */}
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MarjonLogo className="w-5 h-5" />
                  <span>Workstation & Engineering Works</span>
                </div>

                <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white">
                  MY{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                    PORTFOLIO
                  </span>
                </h2>

                {/* Scope lines from image: Web · Software · Mobile Apps / Systems · UI/UX · Media */}
                <div className="mt-4 space-y-1 text-sm sm:text-base font-semibold font-mono text-slate-300">
                  <div className="text-cyan-300">Web · Software · Mobile Apps</div>
                  <div className="text-fuchsia-300">Systems · UI/UX · Media</div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl leading-relaxed">
                  Explore production full-stack systems, cloud synchronization software, and high-performance applications designed with precision.
                </p>
              </div>

              {/* Right Side: Category Filter Segmented Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950/80 border border-white/10 rounded-2xl backdrop-blur-md">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-white border border-cyan-400/50 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat === 'all' ? 'All Projects' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout (Wide featured cards + Standard cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => {
            const isWide = project.featured;

            return (
              <div
                key={project.id}
                className={`group relative rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md overflow-hidden hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between ${
                  isWide ? 'md:col-span-2' : 'col-span-1'
                }`}
              >
                {/* Visual Header Banner with Gradient & Logo element */}
                <div
                  className={`h-48 sm:h-52 w-full relative overflow-hidden bg-gradient-to-br ${project.gradientTheme} border-b border-white/[0.08] flex items-center justify-between p-6`}
                >
                  {/* Subtle technical background grid */}
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* Icon badge & category */}
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-cyan-400 backdrop-blur-md">
                        {project.category === 'APIs & Storage' ? (
                          <HardDrive className="w-5 h-5 text-amber-400" />
                        ) : project.category === 'Systems' ? (
                          <Terminal className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <Layers className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      {project.driveAssetIds.length > 0 && (
                        <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          Drive Blueprint Attached
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono text-slate-300">
                      {project.category}
                    </div>
                  </div>

                  {/* Interactive Quick Action */}
                  <div className="relative z-10 self-start">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="p-2 rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors cursor-pointer"
                      title="View Architecture Details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    {/* Project Title */}
                    <h3
                      onClick={() => onSelectProject(project)}
                      className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Performance metrics row */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06]">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="bg-slate-950/40 p-2 rounded-lg border border-white/[0.04]">
                        <div className="text-[10px] text-slate-400 truncate">{m.label}</div>
                        <div className="text-xs font-bold font-mono tabular-nums text-slate-200 mt-0.5">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack metadata (clean unboxed text with middots) */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-400 font-mono text-[11px] overflow-hidden">
                      {project.technologies.slice(0, 4).map((tech, idx) => (
                        <React.Fragment key={tech}>
                          <span className="text-slate-300">{tech}</span>
                          {idx < Math.min(project.technologies.length, 4) - 1 && (
                            <span className="text-slate-600">·</span>
                          )}
                        </React.Fragment>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-slate-500">+{project.technologies.length - 4}</span>
                      )}
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ml-3"
                    >
                      <span>Deep Dive</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
