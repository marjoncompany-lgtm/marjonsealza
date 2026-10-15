import React from 'react';
import { X, ExternalLink, Github, HardDrive, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { PortfolioProject, DriveAsset } from '../types';

interface ProjectModalProps {
  project: PortfolioProject | null;
  driveAssets: DriveAsset[];
  onClose: () => void;
  onPreviewAsset: (asset: DriveAsset) => void;
  onNavigateToDrive: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  driveAssets,
  onClose,
  onPreviewAsset,
  onNavigateToDrive,
}) => {
  if (!project) return null;

  // Find associated Drive assets
  const linkedAssets = driveAssets.filter((a) => project.driveAssetIds.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-slate-100 space-y-6">
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
              <span>{project.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Production Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Summary & Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">System Overview</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Performance Metric Strip */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/60 border border-white/[0.06]">
          {project.metrics.map((metric, i) => (
            <div key={i} className="text-center">
              <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white">
                {metric.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Architectural Rationale & Key Solutions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">Architectural Highlights & Engineering Decisions</h3>
          <ul className="space-y-2.5">
            {project.architecturePoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Stack (Clean unboxed tags) */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-200">Core Technologies</h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-400 font-mono">
            {project.technologies.map((tech, index) => (
              <React.Fragment key={tech}>
                <span className="text-slate-300">{tech}</span>
                {index < project.technologies.length - 1 && <span className="text-slate-600">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Linked Google Drive Documentation Assets */}
        {linkedAssets.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>Linked Google Drive Documents & Blueprints</span>
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDrive();
                }}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>All Drive Assets</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {linkedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 rounded-xl bg-slate-950/50 border border-white/[0.06] hover:border-amber-500/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-medium text-slate-200 truncate">{asset.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{asset.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onPreviewAsset(asset)}
                      className="px-2.5 py-1 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                    >
                      Preview
                    </button>
                    <a
                      href={asset.googleDriveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-md transition-colors"
                      title="Open in Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
            {project.liveUrl && project.liveUrl.startsWith('http') && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Live Showcase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
