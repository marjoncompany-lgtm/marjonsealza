import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Send,
  Copy,
  Check,
  MessageSquare,
  Navigation,
  Compass,
} from 'lucide-react';
import { USER_EMAIL, DRIVE_FOLDER_URL } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('Web & Software Development');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const displayEmail = 'engineersealza@gmail.com';
  const displayPhone = '+63 9XX XXX XXXX';
  const displayLocation = 'Bataan, Philippines';

  const freelanceServices = [
    'Web Development',
    'Software Development',
    'Mobile Apps',
    'System & Automation',
    'Design & Media',
    'Consultation & Support',
  ];

  const roadSigns = ['BATAAN', 'MANILA', 'POSSIBILITIES', 'A BRIGHTER TOMORROW'];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(displayEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(displayPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (!formEmail.includes('@') || !formEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    }, 700);
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner matching Contact Page Images */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#090d19] mb-12">
          {/* Sunset Horizon Lighting & Contact Banner WebP Asset */}
          <img
            src="/images/contact/contact-banner.webp"
            alt="Let's Work Together - Marjon Sealza Contact Banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen pointer-events-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b16]/95 via-[#12132d]/80 to-[#28111e]/85 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#f59e0b]/20 via-[#ec4899]/15 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column (5 cols): LET'S WORK TOGETHER Title */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  Let's Connect
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                  LET’S WORK{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                    TOGETHER
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Have a project in mind? Send me a message and let’s turn your ideas into reality.
                </p>

                {/* Road signs pointing right from Contact Page Images */}
                <div className="pt-3">
                  <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Regional Milestones</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roadSigns.map((sign, idx) => (
                      <div
                        key={sign}
                        className={`text-[11px] font-bold font-mono px-3 py-1 rounded-md border flex items-center gap-1 shadow-sm ${
                          idx === 0
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : idx === 1
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : idx === 2
                            ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        <span>{sign}</span>
                        <Navigation className="w-3 h-3 rotate-45" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Column (4 cols): Exact Info Cards (Email, Phone, Location) */}
              <div className="lg:col-span-4 space-y-3">
                {/* Email Card with one-click copy button & immediate visual feedback */}
                <div
                  className={`p-3.5 rounded-2xl backdrop-blur-md transition-all duration-300 flex items-center justify-between gap-3 ${
                    copiedEmail
                      ? 'bg-emerald-950/60 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] scale-[1.02]'
                      : 'bg-blue-950/60 border border-blue-500/30 hover:border-cyan-400/50'
                  }`}
                >
                  <div
                    onClick={handleCopyEmail}
                    className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1 group"
                    title="Click to copy email address"
                  >
                    <div
                      className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                        copiedEmail
                          ? 'bg-emerald-500/30 text-emerald-300'
                          : 'bg-blue-500/20 text-cyan-300 group-hover:bg-blue-500/30'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">Email</span>
                        {copiedEmail && (
                          <span className="text-[10px] font-bold text-emerald-400 animate-pulse font-mono">
                            Copied to clipboard!
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white truncate font-mono select-all group-hover:text-cyan-300 transition-colors">
                        {displayEmail}
                      </div>
                    </div>
                  </div>

                  {/* One-click copy button with immediate visual feedback */}
                  <button
                    onClick={handleCopyEmail}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm ${
                      copiedEmail
                        ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)] scale-105'
                        : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 border border-cyan-500/40 active:scale-95'
                    }`}
                    title="Copy email to clipboard"
                    aria-label="Copy email to clipboard"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Phone Card */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] font-mono text-slate-400">Phone</div>
                      <div className="text-xs font-semibold text-white truncate font-mono select-all">
                        {displayPhone}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyPhone}
                    className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                    title="Copy Phone"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Location Card */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">Location</div>
                    <div className="text-xs font-semibold text-white font-mono">
                      {displayLocation}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (3 cols): Open for Freelance Projects Checklist */}
              <div className="lg:col-span-3 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-xl space-y-2.5">
                <div className="text-xs font-bold text-slate-200 pb-2 border-b border-white/[0.08]">
                  Open for Freelance Projects
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {freelanceServices.map((service) => (
                    <div key={service} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Direct Message Form */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {submitted ? (
            <div className="py-10 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Transmission Received</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for your message! Marjon Sealza has received your transmission and will review your project requirements within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-xl"
              >
                Send Another Transmission
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Send a Direct Message to Marjon
                </h3>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. sarah@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Interested Service / Subject
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="Web & Software Development">Web & Software Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="System & Cloud Automation">System & Cloud Automation</option>
                  <option value="Design & Media Solutions">Design & Media Solutions</option>
                  <option value="Consultation & Technical Support">Consultation & Technical Support</option>
                  <option value="Google Drive Storage Integration">Google Drive Storage Integration</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Message / Project Goals *
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formMessage.length}/1000
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tell me about your project, target launch dates, or ideas..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Location: Bataan, Philippines
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 hover:opacity-90 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-fuchsia-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Dispatching...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
