import React, { useState } from 'react';
import {
  WORK_EXPERIENCE,
  EDUCATION_LIST,
  CERTIFICATIONS_LIST,
  PORTFOLIO_PROJECTS,
  DRIVE_FOLDER_URL,
} from '../data/portfolioData';
import {
  Download,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Cog,
  Award,
  User,
  Code,
  Globe2,
  Heart,
  FileText,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { DriveAsset } from '../types';

interface ResumeSectionProps {
  onPreviewResume: () => void;
  resumeAsset?: DriveAsset;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onPreviewResume, resumeAsset }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'education' | 'skills' | 'certifications'>('all');

  const languages = [
    { name: 'English', proficiency: 'Professional Working Fluency / Technical' },
    { name: 'Filipino / Tagalog', proficiency: 'Native / Bilingual' },
  ];

  const interests = [
    'Distributed Systems & Cloud Caching',
    'Google Drive API & Hybrid Storage',
    'Drone Cinematography & Aerial Video',
    'Open-Source Automation & Scripting',
    'Accessible Human-Centered UI/UX',
  ];

  return (
    <section id="resume" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner matching Resume Page Images */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#090d1a] mb-12">
          {/* Sunset Horizon Ambient & Resume Banner WebP Asset */}
          <img
            src="/images/resume/resume-banner.webp"
            alt="Marjon Sealza - Computer Engineer Resume Banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen pointer-events-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b16]/95 via-[#10142b]/90 to-[#2a1024]/85 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#f59e0b]/20 via-[#ec4899]/15 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 md:p-14">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              {/* Left Side: RESUME MARJON SEALZA COMPUTER ENGINEER */}
              <div>
                <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                    RESUME
                  </span>
                </div>

                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mt-2">
                  MARJON SEALZA
                </div>

                <div className="text-xs sm:text-sm font-bold tracking-[0.3em] text-cyan-400 uppercase mt-1">
                  C O M P U T E R &nbsp; E N G I N E E R
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-xl leading-relaxed">
                  Comprehensive professional background, academic achievements, technical proficiencies, and verified credentials.
                </p>
              </div>

              {/* Right Side: Quick Action & Drive Synced PDF */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onPreviewResume}
                  className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 hover:opacity-95 rounded-xl shadow-lg shadow-fuchsia-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Preview PDF Resume</span>
                </button>

                {resumeAsset && (
                  <a
                    href={resumeAsset.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-white/10 border border-white/10 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    title="Download Direct from Google Drive"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download PDF</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dual Column Layout matching the 8 items from Resume Page Images:
            Left: Education, Work Experience, Skills & Tech, Certifications
            Right: Professional Summary, Projects, Languages, Interests
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (6 cols): Education, Experience, Skills, Certifications */}
          <div className="lg:col-span-6 space-y-8">
            {/* 1. Education */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Education</h3>
              </div>

              {EDUCATION_LIST.map((edu, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{edu.degree}</h4>
                      <div className="text-xs text-cyan-400 font-medium">{edu.institution}</div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{edu.period}</span>
                  </div>
                  {edu.honors && (
                    <div className="text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded w-fit">
                      {edu.honors}
                    </div>
                  )}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Coursework: {edu.relevantCoursework.join(' · ')}
                  </p>
                </div>
              ))}
            </div>

            {/* 2. Work Experience */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Work Experience</h3>
              </div>

              <div className="space-y-6">
                {WORK_EXPERIENCE.map((exp) => (
                  <div key={exp.id} className="space-y-2 pb-4 border-b border-white/[0.04] last:border-b-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <span>{exp.role}</span>
                        {exp.current && (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                            Present
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">{exp.period}</span>
                    </div>
                    <div className="text-xs text-cyan-400 font-medium">{exp.organization} · {exp.location}</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{exp.summary}</p>
                    <ul className="space-y-1.5 pt-1">
                      {exp.achievements.slice(0, 2).map((ach, aIdx) => (
                        <li key={aIdx} className="text-xs text-slate-400 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Skills & Technologies */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Cog className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Skills & Technologies</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold mb-1">Programming & Frameworks</div>
                  <div className="text-slate-300 font-mono">TypeScript, JavaScript, Go, Python, React, Next.js, Node.js, Express</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold mb-1">Cloud & Infrastructure</div>
                  <div className="text-slate-300 font-mono">Google Cloud Platform (GCP), Google Drive API, Docker, Kubernetes, CI/CD</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold mb-1">Databases & Caching</div>
                  <div className="text-slate-300 font-mono">PostgreSQL, TimescaleDB, Redis, IndexedDB, Firestore</div>
                </div>
              </div>
            </div>

            {/* 4. Certifications */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Certifications</h3>
              </div>

              <div className="space-y-3">
                {CERTIFICATIONS_LIST.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.04] last:border-b-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-slate-200">{cert.name}</div>
                      <div className="text-[11px] text-slate-400">{cert.issuer} · {cert.issuedDate}</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Summary, Projects, Languages, Interests */}
          <div className="lg:col-span-6 space-y-8">
            {/* 5. Professional Summary */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Professional Summary</h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Computer Engineer with 6+ years of specialized experience architecting reliable full-stack applications, high-concurrency cloud pipelines, and persistent hybrid storage systems. Dedicated to transforming complex client requirements into clean, maintainable, and high-performance digital products.
              </p>
            </div>

            {/* 6. Projects Highlight */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Selected Engineering Projects</h3>
              </div>

              <div className="space-y-3.5">
                {PORTFOLIO_PROJECTS.slice(0, 3).map((proj) => (
                  <div key={proj.id} className="space-y-1 pb-3 border-b border-white/[0.04] last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{proj.title}</span>
                      <span className="text-[11px] font-mono text-cyan-400">{proj.category}</span>
                    </div>
                    <p className="text-xs text-slate-400">{proj.summary}</p>
                    <div className="text-[10px] font-mono text-slate-500">
                      Tech: {proj.technologies.slice(0, 4).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Languages */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Languages</h3>
              </div>

              <div className="space-y-2.5">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{lang.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Interests */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Interests & Pursuits</h3>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/[0.06] text-slate-300 font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
