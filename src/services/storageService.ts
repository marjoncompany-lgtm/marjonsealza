import { AssetCategory, DriveAsset, StorageStats } from '../types';
import { DRIVE_FOLDER_ID, INITIAL_DRIVE_ASSETS } from '../data/portfolioData';

const STORAGE_KEY_ASSETS = 'marjon_portfolio_drive_assets_v1';
const STORAGE_KEY_STATS = 'marjon_portfolio_storage_stats_v1';

export class StorageService {
  /**
   * Retrieves all Drive assets, checking local cache first with fallback to initial registry.
   */
  static getAssets(): DriveAsset[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_ASSETS);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // In case localStorage is blocked or fails
    }
    this.saveAssets(INITIAL_DRIVE_ASSETS);
    return INITIAL_DRIVE_ASSETS;
  }

  /**
   * Persists assets to local storage cache.
   */
  static saveAssets(assets: DriveAsset[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
    } catch {
      // Fallback
    }
  }

  /**
   * Calculates real-time storage statistics.
   */
  static getStats(): StorageStats {
    const assets = this.getAssets();
    const totalSizeBytes = assets.reduce((acc, curr) => acc + curr.sizeBytes, 0);

    const categoryCounts: Record<AssetCategory, number> = {
      resume: 0,
      'project-media': 0,
      architecture: 0,
      certificate: 0,
      'case-study': 0,
    };

    assets.forEach((item) => {
      if (categoryCounts[item.category] !== undefined) {
        categoryCounts[item.category] += 1;
      }
    });

    const cachedAssetsCount = assets.filter((a) => a.isCachedLocally).length;
    const cacheHitRatio = assets.length > 0 ? Math.round((cachedAssetsCount / assets.length) * 100) : 0;

    let lastSyncedAt = new Date().toISOString();
    try {
      const storedStats = localStorage.getItem(STORAGE_KEY_STATS);
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        if (parsed.lastSyncedAt) lastSyncedAt = parsed.lastSyncedAt;
      }
    } catch {
      // Continue
    }

    return {
      totalAssets: assets.length,
      totalSizeBytes,
      lastSyncedAt,
      cacheHitRatio,
      categoryCounts,
      folderId: DRIVE_FOLDER_ID,
    };
  }

  /**
   * Simulates an active sync with the Google Drive folder, refreshing cache metadata.
   */
  static syncWithDriveFolder(): Promise<{ success: boolean; syncedCount: number; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentAssets = this.getAssets();
        // Mark all as cached locally after explicit sync
        const updated = currentAssets.map((asset) => ({
          ...asset,
          isCachedLocally: true,
          lastModified: new Date().toISOString().split('T')[0],
        }));

        this.saveAssets(updated);

        const now = new Date().toISOString();
        try {
          localStorage.setItem(
            STORAGE_KEY_STATS,
            JSON.stringify({
              lastSyncedAt: now,
            })
          );
        } catch {
          // Ignore
        }

        resolve({
          success: true,
          syncedCount: updated.length,
          message: `Successfully synchronized ${updated.length} assets with Google Drive folder ${DRIVE_FOLDER_ID}`,
        });
      }, 700);
    });
  }

  /**
   * Toggle local caching for a specific asset to demonstrate offline storage optimization.
   */
  static toggleAssetCache(assetId: string): DriveAsset[] {
    const assets = this.getAssets();
    const updated = assets.map((a) => (a.id === assetId ? { ...a, isCachedLocally: !a.isCachedLocally } : a));
    this.saveAssets(updated);
    return updated;
  }

  /**
   * Adds a new file reference into the Drive storage manager.
   */
  static addAsset(asset: Omit<DriveAsset, 'id' | 'driveFolderId' | 'isCachedLocally'>): DriveAsset[] {
    const assets = this.getAssets();
    const newAsset: DriveAsset = {
      ...asset,
      id: `asset-${Date.now()}`,
      driveFolderId: DRIVE_FOLDER_ID,
      isCachedLocally: true,
    };
    const updated = [newAsset, ...assets];
    this.saveAssets(updated);
    return updated;
  }

  /**
   * Formats raw bytes into readable strings (e.g. 1.4 MB).
   */
  static formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  /**
   * Returns Google Drive preview embed URL from file ID or full URL.
   */
  static getEmbedUrl(fileIdOrUrl: string): string {
    if (fileIdOrUrl.startsWith('http')) {
      if (fileIdOrUrl.includes('/preview')) return fileIdOrUrl;
      if (fileIdOrUrl.includes('/view')) return fileIdOrUrl.replace('/view', '/preview');
      return fileIdOrUrl;
    }
    return `https://drive.google.com/file/d/${fileIdOrUrl}/preview`;
  }
}
