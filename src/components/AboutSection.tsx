import React from 'react';
import { Cpu, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { MarjonLogo } from './MarjonLogo';

export const AboutSection: React.FC = () => {
  const corePrinciples = [
    { title: 'Computer Engineering Foundation', desc: 'Hardware understanding blended with modern high-level software architectures, algorithms, and system optimization.' },
    { title: 'Practical Digital Solutions', desc: 'Prioritizing functional, reliable, and user-centric systems over unnecessary technical complexity.' },
    { title: 'Continuous Iteration', desc: 'Constantly testing, refining, benchmarking, and improving software based on real-world requirements.' },
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner matching About Page Images */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#090d1c] mb-12">
          {/* Ambient Studio Neon Lighting & Profile Banner Asset */}
          <img
            src="/images/about/profile-banner.webp"
            alt="Marjon Sealza - Computer Engineer Studio and Engineering Cycle"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen pointer-events-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d22]/90 via-[#101032]/80 to-[#1c0c28]/85 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Handwritten Cursive Loop (Ideas Code Design Build Improve Repeat) */}
              <div className="lg:col-span-3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
                  Engineering Cycle
                </div>
                <div className="font-['Caveat'] text-3xl sm:text-4xl text-cyan-200/90 leading-tight space-y-1">
                  <div className="text-cyan-300 font-bold">Ideas</div>
                  <div className="text-blue-300">Code</div>
                  <div className="text-indigo-300">Design</div>
                  <div className="text-purple-300 font-bold">Build</div>
                  <div className="text-fuchsia-300">Improve</div>
                  <div className="text-pink-400 font-bold">Repeat</div>
                </div>
              </div>

              {/* Center: Coding Workstation Visual Card */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-5 shadow-inner space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-slate-300 font-bold">marjon.engineer.ts</span>
                    </div>
                    <span className="text-cyan-400">TypeScript / Node</span>
                  </div>

                  <div className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                    <span className="text-fuchsia-400 font-bold">interface</span> <span className="text-cyan-300">ComputerEngineer</span> {'{'}<br />
                    &nbsp;&nbsp;name: <span className="text-amber-300">'Marjon Sealza'</span>;<br />
                    &nbsp;&nbsp;origin: <span className="text-amber-300">'Bataan, Philippines'</span>;<br />
                    &nbsp;&nbsp;mission: <span className="text-emerald-300">'Turning ideas into useful digital solutions'</span>;<br />
                    &nbsp;&nbsp;education: <span className="text-amber-300">'BS Computer Engineering · Eastwoods (2015-2020)'</span>;<br />
                    &nbsp;&nbsp;domains: [<span className="text-cyan-300">'Web'</span>, <span className="text-cyan-300">'Software'</span>, <span className="text-cyan-300">'Mobile'</span>, <span className="text-cyan-300">'Automation'</span>];<br />
                    &nbsp;&nbsp;driveStorageSync: <span className="text-blue-400 font-semibold">true</span>;<br />
                    {'}'}
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>Zero compiler warnings</span>
                    </span>
                    <span className="text-emerald-400">STATUS: READY TO DEPLOY</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Quote & Handwritten Signature (Matching About Page Images) */}
              <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>

                <blockquote className="text-base sm:text-lg md:text-xl font-medium text-slate-100 leading-relaxed italic font-serif">
                  “A computer engineer who turns ideas into practical digital solutions for people and businesses.”
                </blockquote>

                {/* Handwritten Cursive Signature */}
                <div className="pt-2 flex flex-col">
                  <span className="font-['Caveat'] text-4xl sm:text-5xl text-cyan-300 font-bold tracking-wider -rotate-2 select-none">
                    Marjon Sealza
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 mt-1">
                    Computer Engineer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Philosophy & Background Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {corePrinciples.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md transition-colors space-y-3"
            >
              <div className="p-2.5 rounded-xl bg-slate-950 text-cyan-400 w-fit border border-white/10">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
