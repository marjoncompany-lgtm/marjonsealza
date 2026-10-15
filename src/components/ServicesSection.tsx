import React, { useState } from 'react';
import {
  Globe,
  Code,
  Smartphone,
  Cog,
  Palette,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  X,
  Send,
} from 'lucide-react';
import { USER_EMAIL } from '../data/portfolioData';

interface ServiceItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  categoryTag: string;
  summary: string;
  deliverables: string[];
  gradient: string;
}

interface ServicesSectionProps {
  onNavigateToContact: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigateToContact }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [quoteRequestSent, setQuoteRequestSent] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  const servicesList: ServiceItem[] = [
    {
      id: 'website-dev',
      icon: <Globe className="w-5 h-5" />,
      title: 'Website Development',
      categoryTag: 'Web Systems',
      summary: 'Custom high-performance web applications, portfolio platforms, company portals, and modern SPAs.',
      deliverables: ['Custom Responsive Frontend', 'API & Database Integration', 'SEO & Performance Optimization', 'Cloud Hosting Deployment'],
      gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    },
    {
      id: 'software-dev',
      icon: <Code className="w-5 h-5" />,
      title: 'Software Development',
      categoryTag: 'Full-Stack',
      summary: 'Tailored desktop, server-side, and full-stack software built to solve specific operational bottlenecks.',
      deliverables: ['Custom Backend Architecture', 'REST & GraphQL APIs', 'Database Design & Migration', 'Automated Unit & Integration Tests'],
      gradient: 'from-fuchsia-500/20 via-purple-500/10 to-transparent',
    },
    {
      id: 'mobile-dev',
      icon: <Smartphone className="w-5 h-5" />,
      title: 'Mobile App Development',
      categoryTag: 'Cross-Platform',
      summary: 'Intuitive, native-feel mobile applications for iOS and Android with offline-first caching.',
      deliverables: ['Cross-Platform Mobile Apps', 'Push Notifications & Auth', 'Offline-First Local Storage', 'App Store & Play Store Prep'],
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    },
    {
      id: 'system-automation',
      icon: <Cog className="w-5 h-5" />,
      title: 'System & Automation',
      categoryTag: 'DevOps & Scripts',
      summary: 'End-to-end workflow automation, data synchronization, scheduled bots, and cloud pipelines.',
      deliverables: ['Cloud Storage Synchronizers', 'Automated Cron & Webhooks', 'Data Scraping & Extraction', 'CI/CD Pipeline Configurations'],
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    },
    {
      id: 'design-media',
      icon: <Palette className="w-5 h-5" />,
      title: 'Design & Media',
      categoryTag: 'UI/UX & Assets',
      summary: 'Visual brand identity, UI/UX prototyping, design systems, and multimedia presentation assets.',
      deliverables: ['High-Fidelity UI/UX Mockups', 'Accessible Component Libraries', 'Graphic & Banner Assets', 'Multimedia Optimization'],
      gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    },
    {
      id: 'consultation-support',
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Consultation & Support',
      categoryTag: 'Engineering Advisory',
      summary: 'Technical architecture reviews, code audits, infrastructure optimization, and continuous support.',
      deliverables: ['Architecture Audits & Roadmaps', 'Security & Reliability Reviews', 'Bug Triage & Refactoring', 'Dedicated Ongoing SLA Support'],
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    },
  ];

  const valueGuarantees = [
    'Professional',
    'Reliable',
    'Affordable',
    'On-Time',
    'Ongoing Support',
  ];

  const handleRequestService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim()) return;
    setQuoteRequestSent(true);
    setTimeout(() => {
      setQuoteRequestSent(false);
      setSelectedService(null);
      setClientEmail('');
      setClientNotes('');
    }, 2500);
  };

  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner matching Store Page Images (Services Only) */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#090e1f] mb-12">
          {/* Ambient Lighting Gradients & Services Banner WebP Asset */}
          <img
            src="/images/store/services-banner.webp"
            alt="Custom Digital Solutions by Marjon Sealza Services Banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen pointer-events-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b18]/95 via-[#121230]/80 to-[#250d24]/85 pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 md:p-14">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              {/* Left Side: Title & Subtitle */}
              <div className="max-w-2xl">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Digital Solutions</span>
                </div>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                  SERVICES{' '}
                  <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
                    ONLY
                  </span>
                </h2>

                <p className="text-base sm:text-xl text-slate-200 font-medium mt-3">
                  Custom <span className="text-cyan-300 font-semibold">Digital Solutions</span> by{' '}
                  <span className="text-fuchsia-400 font-semibold">Marjon Sealza</span>
                </p>

                <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
                  Tailored engineering solutions designed for businesses, creators, and teams seeking reliable development with zero fluff.
                </p>
              </div>

              {/* Right Side: Exact Value Guarantees Checklist from the image */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-xl w-full lg:w-72 shrink-0">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-white/[0.08]">
                  Service Standard
                </div>
                <div className="space-y-2.5">
                  {valueGuarantees.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The 6 Core Service Cards (Matching bottom icons of Store Page) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service) => (
            <div
              key={service.id}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-fuchsia-500/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 text-cyan-400 group-hover:text-fuchsia-400 group-hover:scale-110 border border-white/10 transition-all">
                    {service.icon}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{service.categoryTag}</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {service.summary}
                </p>

                {/* Deliverables */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Custom Scope</span>
                <button
                  onClick={() => setSelectedService(service)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Requesting a Quote */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 text-slate-100 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <div className="text-[11px] font-mono text-cyan-400">Inquiry Dispatcher</div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Request {selectedService.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {quoteRequestSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Inquiry Dispatched</h4>
                  <p className="text-xs text-slate-300">
                    Thank you! Marjon has received your request regarding {selectedService.title} and will respond at <span className="text-cyan-400">{clientEmail}</span> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestService} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Project Details or Timeline</label>
                    <textarea
                      rows={4}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="Briefly describe your objectives, deadlines, or existing stack..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Direct recipient: {USER_EMAIL} (24-hour turnaround)</span>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:opacity-90 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Send Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
