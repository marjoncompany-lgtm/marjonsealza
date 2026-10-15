/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { AboutSection } from './components/AboutSection';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ServicesSection } from './components/ServicesSection';
import { ResumeSection } from './components/ResumeSection';
import { VlogSection } from './components/VlogSection';
import { DriveAssetManager } from './components/DriveAssetManager';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { AssetLightbox } from './components/AssetLightbox';

import { PORTFOLIO_PROJECTS } from './data/portfolioData';
import { DriveAsset, PortfolioProject, StorageStats } from './types';
import { StorageService } from './services/storageService';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [driveAssets, setDriveAssets] = useState<DriveAsset[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats>(() => StorageService.getStats());
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [previewAsset, setPreviewAsset] = useState<DriveAsset | null>(null);

  useEffect(() => {
    const assets = StorageService.getAssets();
    setDriveAssets(assets);
    setStorageStats(StorageService.getStats());
  }, []);

  const handleRefreshStats = () => {
    setStorageStats(StorageService.getStats());
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 65;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const resumeAsset = driveAssets.find((a) => a.category === 'resume');

  const handleOpenResumePreview = () => {
    if (resumeAsset) {
      setPreviewAsset(resumeAsset);
    } else if (driveAssets.length > 0) {
      setPreviewAsset(driveAssets[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans selection:bg-fuchsia-500/30 selection:text-cyan-200">
      {/* 3-Zone Sticky Navigation Bar */}
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Main Portfolio Layout mirroring the 7-panel design board + Drive Storage */}
      <main className="flex-1">
        {/* 1. Home Page Banner */}
        <HomeHero
          stats={storageStats}
          onNavigate={handleNavigate}
          onOpenResumePreview={handleOpenResumePreview}
        />

        {/* 2. About Page Banner & Philosophy */}
        <AboutSection />

        {/* 3. Portfolio Page Banner & Bento Showcase */}
        <ProjectShowcase
          projects={PORTFOLIO_PROJECTS}
          onSelectProject={(project) => setSelectedProject(project)}
          onNavigateToDrive={() => handleNavigate('drive-storage')}
        />

        {/* 4. Store Page (Services Only) */}
        <ServicesSection onNavigateToContact={() => handleNavigate('contact')} />

        {/* 5. Resume Page Banner & Dual Columns */}
        <ResumeSection
          onPreviewResume={handleOpenResumePreview}
          resumeAsset={resumeAsset}
        />

        {/* 6. Vlog Page Banner & Video Episodes */}
        <VlogSection />

        {/* 7. Google Drive Cloud Storage & Asset Synchronizer */}
        <DriveAssetManager
          assets={driveAssets}
          stats={storageStats}
          onPreviewAsset={(asset) => setPreviewAsset(asset)}
          onAssetsUpdated={(newAssets) => setDriveAssets(newAssets)}
          onRefreshStats={handleRefreshStats}
        />

        {/* 8. Contact Page Banner, Info Cards & Road Signs */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Project Deep-Dive Modal */}
      <ProjectModal
        project={selectedProject}
        driveAssets={driveAssets}
        onClose={() => setSelectedProject(null)}
        onPreviewAsset={(asset) => setPreviewAsset(asset)}
        onNavigateToDrive={() => handleNavigate('drive-storage')}
      />

      {/* Google Drive Document & Media Lightbox */}
      <AssetLightbox
        asset={previewAsset}
        onClose={() => setPreviewAsset(null)}
        onToggleCache={(assetId) => {
          const updated = StorageService.toggleAssetCache(assetId);
          setDriveAssets(updated);
          handleRefreshStats();
          const refreshed = updated.find((a) => a.id === assetId);
          if (refreshed) setPreviewAsset(refreshed);
        }}
      />
    </div>
  );
}
