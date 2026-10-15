import React, { useState } from 'react';
import { HardDrive, Menu, X, ArrowUpRight } from 'lucide-react';
import { MarjonLogo } from './MarjonLogo';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'resume', label: 'Resume' },
    { id: 'vlog', label: 'Vlog' },
    { id: 'drive-storage', label: 'Drive Storage' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#070a13]/90 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark with iconic M Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
        >
          <MarjonLogo className="w-8 h-8 group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]" />
          <div className="flex flex-col">
            <div className="text-base sm:text-lg font-black tracking-tight leading-none text-white">
              <span>MARJON </span>
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                SEALZA
              </span>
            </div>
            <span className="text-[9px] font-semibold tracking-[0.2em] text-cyan-400 uppercase mt-0.5">
              Computer Engineer
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-300">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-all whitespace-nowrap shrink-0 relative py-1 px-1 cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'hover:text-white text-slate-300'
                }`}
              >
                {item.label}
                {item.id === 'drive-storage' && (
                  <span className="inline-block ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Quick Drive Link */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('drive-storage')}
            className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title="Google Drive Storage Hub"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Drive Hub</span>
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 hover:opacity-90 rounded-lg shadow-md shadow-fuchsia-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Let's Work</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="xl:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-white/10 bg-[#070a13]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                activeSection === item.id
                  ? 'bg-fuchsia-500/10 text-cyan-400 border border-fuchsia-500/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              {item.id === 'drive-storage' && (
                <span className="text-[10px] text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/25">
                  Drive Synced
                </span>
              )}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full py-2.5 px-4 text-center text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 rounded-lg"
            >
              Let's Work Together
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
