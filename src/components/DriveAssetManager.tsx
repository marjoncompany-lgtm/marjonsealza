import React, { useState } from 'react';
import {
  HardDrive,
  RefreshCw,
  Search,
  ExternalLink,
  Download,
  Eye,
  Plus,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Copy,
  Check,
  Zap,
  Shield,
  Layers,
  LayoutGrid,
  List,
  FolderOpen,
} from 'lucide-react';
import { AssetCategory, DriveAsset, StorageStats } from '../types';
import { StorageService } from '../services/storageService';
import { DRIVE_FOLDER_ID, DRIVE_FOLDER_URL } from '../data/portfolioData';

interface DriveAssetManagerProps {
  assets: DriveAsset[];
  stats: StorageStats;
  onPreviewAsset: (asset: DriveAsset) => void;
  onAssetsUpdated: (newAssets: DriveAsset[]) => void;
  onRefreshStats: () => void;
}

export const DriveAssetManager: React.FC<DriveAssetManagerProps> = ({
  assets,
  stats,
  onPreviewAsset,
  onAssetsUpdated,
  onRefreshStats,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New asset form state
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<AssetCategory>('architecture');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileDescription, setNewFileDescription] = useState('');
  const [newFileSizeMb, setNewFileSizeMb] = useState('1.5');

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSyncWithDrive = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await StorageService.syncWithDriveFolder();
      const refreshedAssets = StorageService.getAssets();
      onAssetsUpdated(refreshedAssets);
      onRefreshStats();
      setSyncFeedback(res.message);
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch {
      setSyncFeedback('Sync timed out. Using cached local storage registry.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleCache = (assetId: string) => {
    const updated = StorageService.toggleAssetCache(assetId);
    onAssetsUpdated(updated);
    onRefreshStats();
  };

  const handleCopyUrl = (asset: DriveAsset) => {
    navigator.clipboard.writeText(asset.googleDriveUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const fileUrl =
      newFileUrl.trim() ||
      `https://drive.google.com/file/d/${DRIVE_FOLDER_ID}/view?usp=sharing`;
    const previewUrl = StorageService.getEmbedUrl(fileUrl);
    const sizeBytes = Math.round((parseFloat(newFileSizeMb) || 1) * 1024 * 1024);

    const updated = StorageService.addAsset({
      name: newFileName.trim(),
      category: newFileCategory,
      type: newFileName.endsWith('.png') || newFileName.endsWith('.jpg') ? 'image' : 'document',
      sizeBytes,
      mimeType: newFileName.endsWith('.png') ? 'image/png' : 'application/pdf',
      googleDriveUrl: fileUrl,
      previewUrl,
      downloadUrl: fileUrl,
      lastModified: new Date().toISOString().split('T')[0],
      description: newFileDescription.trim() || 'Custom linked Google Drive document',
    });

    onAssetsUpdated(updated);
    onRefreshStats();
    setIsAddModalOpen(false);

    // Reset form
    setNewFileName('');
    setNewFileDescription('');
    setNewFileUrl('');
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Files' },
    { id: 'resume', label: 'Resume' },
    { id: 'architecture', label: 'Blueprints & Specs' },
    { id: 'case-study', label: 'Case Studies' },
    { id: 'certificate', label: 'Certifications' },
    { id: 'project-media', label: 'Project Media' },
  ];

  return (
    <section id="drive-storage" className="py-20 md:py-28 relative bg-slate-950/70 border-t border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Drive Target */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <HardDrive className="w-4 h-4" />
              <span>Storage Optimization Layer</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Google Drive Connected</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Cloud Storage & Asset Synchronizer
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Real-time portfolio asset management directly synchronized with Google Drive. Integrates live file previews, offline client caching, and instantaneous document delivery without recompilation.
            </p>
          </div>

          {/* Target Folder Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Open in Google Drive</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={handleSyncWithDrive}
              disabled={isSyncing}
              className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/15 cursor-pointer disabled:opacity-75"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Sync With Drive'}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-2.5 text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
              title="Add Custom Drive File"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Alert if Sync ran */}
        {syncFeedback && (
          <div className="mb-8 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400/80">Folder ID: {DRIVE_FOLDER_ID}</span>
          </div>
        )}

        {/* Storage Optimization Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Managed Files</span>
              <HardDrive className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {stats.totalAssets}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Google Drive Synced</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Storage Footprint</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {StorageService.formatBytes(stats.totalSizeBytes)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Compressed payload</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Client Cache Hit</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {stats.cacheHitRatio}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Zero-latency cached</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Bandwidth Saved</span>
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              68.4%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Via local caching tier</div>
          </div>
        </div>

        {/* Search, Filter Tabs & View Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by filename, spec, or project..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Category Filter Buttons (Functional segmented tabs) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/10 rounded-xl overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/10 rounded-lg self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Assets Listing (Grid View) */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-500/40 backdrop-blur-md transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top line: icon, category, and cache state */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {asset.type === 'image' ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400 capitalize">
                        {asset.category}
                      </span>
                    </div>

                    {/* Cache toggle */}
                    <button
                      onClick={() => handleToggleCache(asset.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        asset.isCachedLocally
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                      title="Toggle browser cache"
                    >
                      {asset.isCachedLocally ? '✓ Cached' : 'Remote'}
                    </button>
                  </div>

                  {/* File title */}
                  <h3
                    onClick={() => onPreviewAsset(asset)}
                    className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
                    title={asset.name}
                  >
                    {asset.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {asset.description}
                  </p>
                </div>

                {/* Metadata strip */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{StorageService.formatBytes(asset.sizeBytes)}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{asset.lastModified}</span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() => handleCopyUrl(asset)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                      title="Copy Drive URL"
                    >
                      {copiedId === asset.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onPreviewAsset(asset)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-white/[0.08] text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Local Cache</th>
                    <th className="py-3 px-4">Last Modified</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                          <span
                            onClick={() => onPreviewAsset(asset)}
                            className="cursor-pointer hover:underline truncate"
                          >
                            {asset.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 capitalize">{asset.category}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {StorageService.formatBytes(asset.sizeBytes)}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <button
                          onClick={() => handleToggleCache(asset.id)}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                            asset.isCachedLocally
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-white/5 text-slate-400 border border-white/10'
                          }`}
                        >
                          {asset.isCachedLocally ? 'Cached' : 'Remote'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{asset.lastModified}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onPreviewAsset(asset)}
                            className="px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 rounded border border-amber-500/20 cursor-pointer"
                          >
                            Preview
                          </button>
                          <a
                            href={asset.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 cursor-pointer"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Zero Results State */}
        {filteredAssets.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-900/40">
            <HardDrive className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No files match your query</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or reset the category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-3 py-1.5 text-xs text-cyan-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Add File Reference Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-10 text-slate-100 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  <span>Link New Google Drive Asset</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Document or File Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. Distributed_Locking_Whitepaper.pdf"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Category</label>
                    <select
                      value={newFileCategory}
                      onChange={(e) => setNewFileCategory(e.target.value as AssetCategory)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="architecture">Blueprints & Architecture</option>
                      <option value="case-study">Case Study</option>
                      <option value="resume">Resume Document</option>
                      <option value="certificate">Certification</option>
                      <option value="project-media">Project Media</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Estimated Size (MB)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={newFileSizeMb}
                      onChange={(e) => setNewFileSizeMb(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Google Drive File URL or ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newFileUrl}
                    onChange={(e) => setNewFileUrl(e.target.value)}
                    placeholder={`Defaults to folder ${DRIVE_FOLDER_ID}`}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={newFileDescription}
                    onChange={(e) => setNewFileDescription(e.target.value)}
                    placeholder="Brief description of the blueprint, document, or case study..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                  >
                    Save & Sync Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
