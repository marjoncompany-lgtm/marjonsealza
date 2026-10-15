import React from 'react';
import { X, ExternalLink, Download, FileText, HardDrive, Share2, Check } from 'lucide-react';
import { DriveAsset } from '../types';
import { StorageService } from '../services/storageService';

interface AssetLightboxProps {
  asset: DriveAsset | null;
  onClose: () => void;
  onToggleCache?: (assetId: string) => void;
}

export const AssetLightbox: React.FC<AssetLightboxProps> = ({ asset, onClose, onToggleCache }) => {
  const [copied, setCopied] = React.useState(false);

  if (!asset) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(asset.googleDriveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Background dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {asset.name}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{StorageService.formatBytes(asset.sizeBytes)}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="capitalize">{asset.category}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{asset.lastModified}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title="Copy Drive Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <a
              href={asset.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </a>

            <a
              href={asset.googleDriveUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title="Open Directly in Google Drive"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Document / Media Viewer */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
          {/* Iframe with Google Drive preview mode */}
          <iframe
            src={asset.previewUrl}
            title={asset.name}
            className="w-full h-full border-none"
            allow="autoplay"
          />

          {/* Fallback notice strip in case Drive frame encounters embed restrictions */}
          <div className="px-4 py-2 bg-slate-900/90 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 truncate">
              <HardDrive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">
                Synced from Google Drive Folder: <span className="font-mono text-slate-300">{asset.driveFolderId}</span>
              </span>
            </div>
            <a
              href={asset.googleDriveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 shrink-0 ml-3"
            >
              <span>Drive Native View</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="text-slate-400 max-w-xl truncate">
            {asset.description}
          </p>
          <div className="flex items-center gap-2">
            {onToggleCache && (
              <button
                onClick={() => onToggleCache(asset.id)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  asset.isCachedLocally
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                {asset.isCachedLocally ? '✓ Offline Cached' : '+ Cache in Browser'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
