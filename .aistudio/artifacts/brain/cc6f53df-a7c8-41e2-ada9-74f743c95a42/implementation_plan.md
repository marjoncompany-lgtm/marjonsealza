# Marjon Sealza Developer Portfolio & Google Drive Cloud Storage Hub

A high-performance personal portfolio and interactive asset management system for Marjon Sealza, combining sleek dark glassmorphism with an intelligent Google Drive storage engine that syncs, previews, caches, and binds cloud files to projects and resume documents.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions below incorporate your confirmed selections from Phase 1. Review the key features and workflow before proceeding to execution.

- **Confirmed Decision 1 (Storage Strategy)**: Interactive Google Drive asset manager integrated with folder ID `1kc6rIokV3ucs5iVedUmKr3kgUz_mj-_i`, featuring direct Drive file previews, local cache persistence, and one-click binding to portfolio projects.
- **Confirmed Decision 2 (Portfolio Scope)**: Complete full-stack developer portfolio highlighting featured projects, tech skill matrix, interactive resume viewer, project modal deep dives, and validated contact hub.
- **Confirmed Decision 3 (Visual Aesthetic)**: Modern dark sleek glassmorphism with refined cyberpunk accents (deep slate `#0a0f1d` background, translucent frosted surfaces, cyan and amber focal points, smooth motion, and zero AI-slop anti-pill typography).

---

## 1. Overview & Core Concept

### What It Does
This application serves a dual purpose:
1. **Marjon Sealza's Flagship Portfolio**: A professional showcase highlighting full-stack engineering accomplishments, interactive live demos, technical architecture breakdowns, categorized skill fluencies, and an integrated resume.
2. **Intelligent Cloud Storage Hub**: Connects directly to Marjon's Google Drive storage folder (`1kc6rIokV3ucs5iVedUmKr3kgUz_mj-_i`), enabling real-time asset browsing, document/image preview lightboxes, local cache acceleration, and dynamic asset linking without requiring code redeployments to update media or documents.

### Target Audience & Persona
- **Hiring Managers & Engineering Leads**: Seeking senior-caliber full-stack engineering talent with clean presentation, verified project achievements, and accessible credentials.
- **Clients & Collaborators**: Exploring technical case studies, design documentation, and communication channels.
- **Marjon Sealza (Site Owner)**: Utilizing the built-in Drive Asset Manager to manage project media, upload/link new case study artifacts, and monitor portfolio assets effortlessly.

### Key Value
- **Zero-Redeployment Media Updates**: Update resumes, screenshots, architecture diagrams, and project demos by simply dropping them into the linked Google Drive folder.
- **Instantaneous Load Times**: Offline-ready client caching layer prevents redundant network roundtrips to external storage.
- **Production Polish**: Human-crafted, high-contrast visual design following strict anti-slop rules, single-elevation glass surfaces, and responsive layout standards.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Hero & First Impression**:
   - Visitors arrive at a split-screen desktop hero ($1440\text{px}$) featuring Marjon's core title, brief engineering bio, quick action buttons (*"View Projects"*, *"Explore Drive Assets"*, *"Download CV"*), and a real-time interactive technical summary card.
   - An adjacent full-width metrics ribbon highlights key career data points (Years of Experience, Projects Shipped, Technologies Mastered, Cloud Storage Assets Managed).
2. **Project Showcase & Deep-Dive Lightbox**:
   - Curated Bento grid layout with hero featured projects and secondary initiatives.
   - Filterable by domain (Full-Stack, Cloud & DevOps, APIs & Storage, Systems).
   - Clicking any project opens a full-screen slide-over modal containing architectural rationale, tech stack tags, live preview/demo, and linked Drive assets (e.g., spec sheets, screenshots).
3. **Interactive Tech Matrix**:
   - Organized skill quadrants (Frontend, Backend & Systems, Cloud & Infrastructure, Databases & Storage).
   - Interactive proficiency filters and interactive tech cards displaying active usage context.
4. **Google Drive Asset & Storage Manager**:
   - Dedicated interactive console connected to folder `1kc6rIokV3ucs5iVedUmKr3kgUz_mj-_i`.
   - Grid and table view of synced files (PDF documents, project screenshots, architectural blueprints, certificates).
   - Built-in preview lightbox for Drive PDFs and images with direct open/download options.
   - Storage health monitor displaying asset counts, categorized storage utilization, and cache status.
5. **Interactive Resume & Contact**:
   - In-app tabbed resume viewer (Experience timeline, Education, Certifications) with one-click Drive PDF sync.
   - Contact form with client-side validation, direct email copy helper (`marjoncompany@gmail.com`), and feedback toast.

### Visual Identity & Theme
- **Aesthetic Direction**: Refined Dark Glassmorphic & Cyber-Engineered. Clean, high-contrast, professional, and devoid of neon slop or decorative pulsing dots.
- **Color Palette & Discipline (60-30-10 Rule)**:
  - **60% Dominant Canvas**: Deep Obsidian Slate (`#080c14` / `#0b1120`).
  - **30% Structural Surfaces**: Translucent frosted panels (`rgba(17, 24, 39, 0.75)` with `backdrop-blur-md` and crisp `1px` borders in `rgba(255, 255, 255, 0.08)`).
  - **10% High-Intent Accents**: Electric Cyan (`#06b6d4` / `#38bdf8`) for primary CTAs and active states, paired with Amber Gold (`#f59e0b`) for storage/document badges.
- **Typography & Scale**:
  - *Display / Headings*: Plus Jakarta Sans / Outfit with tight tracking (`tracking-tight`) and balanced line wraps.
  - *Body Prose*: DM Sans / Manrope (15px–16px, 1.6 line height) for effortless legibility.
  - *Data & Metrics*: JetBrains Mono with tabular figures (`font-mono tabular-nums`).
- **Zero-Pill Discipline**:
  - Metadata (categories, dates, file sizes, role titles) rendered as clean unboxed text separated by typographic middots (`·`).
  - Interactive filter controls styled as clean segmented tab bars, never colorful candy badges.
- **Top Bar Contract**:
  - Strict 3-zone layout: `Marjon Sealza` wordmark (Zone 1) — Single-line nav links: `About`, `Projects`, `Skills`, `Drive Storage`, `Resume`, `Contact` (Zone 2) — Primary CTA `Get in Touch` (Zone 3).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Hybrid Google Drive & Client Cache Storage Engine
- **Chosen Approach**: Combine direct Google Drive resource resolution (folder `1kc6rIokV3ucs5iVedUmKr3kgUz_mj-_i`) with a reactive local storage and IndexedDB metadata caching tier.
- **Why**: Allows instant rendering of assets on repeat visits, avoids CORS and quota restrictions on public drive embeds, and enables offline viewing of cached asset registries.
- **Alternatives Considered**: Direct Google Workspace OAuth vs. Static hardcoding. Pure static hardcoding is rigid and violates the user's explicit storage improvement brief; a hybrid manager delivers immediate utility while offering seamless Drive deep linking and folder synchronization.

### Decision 2: Curated Bento Grid vs. Infinite List
- **Chosen Approach**: Dynamic Bento Box grid for projects, featuring 2 wide flagship cards and 4 standard cards, coupled with an interactive drawer modal for deep dives.
- **Why**: Balances visual hierarchy and cognitive pacing without overwhelming the user. Meets the portfolio domain guidelines for desktop $1440\text{px}$ presence.

### Decision 3: Motion & Animation Discipline
- **Chosen Approach**: Compositor-only motion via `motion` (transform, opacity) with $\le 200\text{ms}$ transitions and full `prefers-reduced-motion` compliance.
- **Why**: Keeps navigation snappy, fluid, and professional without distracting layout shifts or laggy scroll traps.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│      [Marjon Sealza]  ──  [About · Projects · Skills · Drive · Contact] ── [Connect] │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             Hero Section                               │
│  ┌────────────────────────────────────┐  ┌───────────────────────────┐ │
│  │ Typographic Identity & Value Pitch │  │ Live Interactive Status & │ │
│  │ Primary CTAs: Projects / Drive Hub │  │ Cloud Storage Health Card │ │
│  └────────────────────────────────────┘  └───────────────────────────┘ │
│  ────────────────────────────────────────────────────────────────────  │
│         Career KPI Metric Strip (Years · Projects · Stack · Drive)     │
└────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Project Showcase │      │   Tech Matrix    │      │ Drive Asset Hub  │
│  - Bento Grid    │      │  - Frontend      │      │  - Synced Files  │
│  - Deep Dives    │      │  - Backend/Cloud │      │  - Lightbox Previews
│  - Live Demos    │      │  - Databases     │      │  - Cache Engine  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Experience Timeline & Resume Tab                      │
│      Work History  ·  Certifications  ·  Direct Drive PDF Link         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Validated Contact & Inquiry Form                   │
│         Quick Messaging  ·  Direct Email Copy  ·  Social Links         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Unified State & Storage Provider                     │
│  ┌───────────────────────┐              ┌───────────────────────────┐  │
│  │  Drive Storage Engine │ ◄──────────► │ LocalStorage/Cache Layer  │  │
│  │  (Folder ID: 1kc6r...) │              │ (Metadata, Previews, Sync)│  │
│  └───────────────────────┘              └───────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models

```typescript
export interface DriveAsset {
  id: string;
  name: string;
  type: 'document' | 'image' | 'archive' | 'code' | 'video';
  sizeBytes: number;
  mimeType: string;
  googleDriveUrl: string;
  previewUrl: string;
  downloadUrl: string;
  lastModified: string;
  category: 'resume' | 'project-media' | 'architecture' | 'certificate';
  description?: string;
  associatedProjectId?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: 'Full-Stack' | 'Cloud Architecture' | 'API & Systems' | 'AI & Storage';
  featured: boolean;
  technologies: string[];
  metrics: string[];
  liveUrl?: string;
  repoUrl?: string;
  driveAssetIds: string[];
  architecturePoints: string[];
}

export interface StorageStats {
  totalAssets: number;
  totalSizeBytes: number;
  lastSyncedAt: string;
  cacheHitRatio: number;
  categoryBreakdown: Record<string, number>;
}
```

### Interactive State Transitions & Event Flow
1. **Asset Filter & Search**: Real-time debounce query search across Drive asset names, extensions, and categories.
2. **Drive Asset Lightbox Modal**: Triggers when an asset card or project preview is clicked; mounts responsive modal with Drive preview iframe, copy share link, and direct Drive download button.
3. **Drive Sync & Refresh**: Simulates immediate sync with Google Drive folder `1kc6rIokV3ucs5iVedUmKr3kgUz_mj-_i`, updates cache timestamps, and recalculates storage metrics.
4. **Project Deep Dive Drawer**: Displays comprehensive project specs, system architecture notes, and associated Drive assets.
5. **Contact Form Validation**: Full client-side check (name, email, message length) with confirmation toast and copy-to-clipboard fallback.

---

## 5. Verification & Delivery Steps

1. **Asset & Schema Setup**: Verify type declarations and establish structured mock Drive assets matching Marjon Sealza's portfolio projects and documents.
2. **Component Implementation**: Construct clean modular components (`Navbar`, `Hero`, `ProjectsGrid`, `ProjectModal`, `SkillsMatrix`, `DriveAssetManager`, `AssetLightbox`, `ResumeTimeline`, `ContactSection`, `Footer`).
3. **Drive Integration & Caching**: Connect the Google Drive folder link, build file viewer helpers, and implement local caching.
4. **Code Compilation**: Run `compile_applet` to confirm zero TypeScript, React, and build errors.
