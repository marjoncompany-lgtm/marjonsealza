export type AssetType = 'document' | 'image' | 'archive' | 'code' | 'video';

export type AssetCategory = 'resume' | 'project-media' | 'architecture' | 'certificate' | 'case-study';

export interface DriveAsset {
  id: string;
  name: string;
  type: AssetType;
  sizeBytes: number;
  mimeType: string;
  googleDriveUrl: string;
  previewUrl: string;
  downloadUrl: string;
  lastModified: string;
  category: AssetCategory;
  description: string;
  associatedProjectId?: string;
  driveFolderId: string;
  isCachedLocally?: boolean;
}

export type ProjectCategory = 'Full-Stack' | 'Cloud & DevOps' | 'APIs & Storage' | 'Systems';

export interface PortfolioProject {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  featured: boolean;
  technologies: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  repoUrl?: string;
  driveAssetIds: string[];
  architecturePoints: string[];
  gradientTheme: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0 - 100
  experienceYears: number;
  featured?: boolean;
}

export interface SkillQuadrant {
  title: string;
  subtitle: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  achievements: string[];
  technologies: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  honors?: string;
  relevantCoursework: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  credentialId?: string;
  driveAssetId?: string;
  verifyUrl?: string;
}

export interface StorageStats {
  totalAssets: number;
  totalSizeBytes: number;
  lastSyncedAt: string;
  cacheHitRatio: number;
  categoryCounts: Record<AssetCategory, number>;
  folderId: string;
}
