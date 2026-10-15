import React, { useState } from 'react';
import { SKILL_QUADRANTS } from '../data/portfolioData';
import { Code2, Server, Cloud, Database } from 'lucide-react';

export const SkillsMatrix: React.FC = () => {
  const [highlightOnly, setHighlightOnly] = useState(false);

  const getQuadrantIcon = (title: string) => {
    if (title.includes('Frontend')) return <Code2 className="w-4 h-4 text-cyan-400" />;
    if (title.includes('Backend')) return <Server className="w-4 h-4 text-blue-400" />;
    if (title.includes('Cloud')) return <Cloud className="w-4 h-4 text-amber-400" />;
    return <Database className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <section id="skills" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              Capabilities Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Technical Proficiencies & Systems
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Engineered with depth across reactive frontends, distributed cloud services, and persistent database architectures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightOnly(!highlightOnly)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                highlightOnly
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {highlightOnly ? 'Showing Core Stack Only' : 'Show All Proficiencies'}
            </button>
          </div>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SKILL_QUADRANTS.map((quadrant, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-6 hover:border-white/20 transition-colors"
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-white/10">
                    {getQuadrantIcon(quadrant.title)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{quadrant.title}</h3>
                    <p className="text-xs text-slate-400">{quadrant.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Skills List with Tabular Numerals */}
              <div className="space-y-4">
                {quadrant.skills
                  .filter((s) => !highlightOnly || s.featured)
                  .map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200 flex items-center gap-1.5">
                          {skill.name}
                          {skill.featured && (
                            <span className="text-[10px] text-cyan-400 font-mono">· Core</span>
                          )}
                        </span>
                        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] tabular-nums">
                          <span>{skill.experienceYears} yrs</span>
                          <span className="text-slate-200 font-semibold">{skill.level}%</span>
                        </div>
                      </div>

                      {/* Level meter bar */}
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/[0.04]">
                        <div
                          style={{ width: `${skill.level}%` }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
