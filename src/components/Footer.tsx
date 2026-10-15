import React from 'react';
import { HardDrive, ArrowUp, Github, Mail, MapPin } from 'lucide-react';
import { DRIVE_FOLDER_URL, USER_EMAIL } from '../data/portfolioData';
import { MarjonLogo } from './MarjonLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#050811] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          {/* Brand with Logo */}
          <div className="space-y-1 text-center md:text-left">
            <div className="text-white font-black text-base tracking-tight flex items-center justify-center md:justify-start gap-2">
              <MarjonLogo className="w-5 h-5" />
              <span>MARJON </span>
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                SEALZA
              </span>
            </div>
            <p className="text-cyan-400 text-[11px] font-semibold tracking-wider uppercase font-mono">
              Computer Engineer · Bataan, Philippines
            </p>
          </div>

          {/* Quick Nav Links matching design board */}
          <nav className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-300 font-medium">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors cursor-pointer">
              Portfolio
            </button>
            <button onClick={() => onNavigate('services')} className="hover:text-fuchsia-400 transition-colors cursor-pointer">
              Services
            </button>
            <button onClick={() => onNavigate('resume')} className="hover:text-white transition-colors cursor-pointer">
              Resume
            </button>
            <button onClick={() => onNavigate('vlog')} className="hover:text-rose-400 transition-colors cursor-pointer">
              Vlog
            </button>
            <button
              onClick={() => onNavigate('drive-storage')}
              className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Drive Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
              Contact
            </button>
          </nav>

          {/* Scroll to Top */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom copyright & citations */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Marjon Sealza. All rights reserved. “Turning ideas into useful digital solutions.”
          </div>

          <div className="flex items-center gap-4">
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-mono"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Drive: 1kc6rIok...</span>
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Bataan, PH</span>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a
              href={`mailto:${USER_EMAIL}`}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-mono"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{USER_EMAIL}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
