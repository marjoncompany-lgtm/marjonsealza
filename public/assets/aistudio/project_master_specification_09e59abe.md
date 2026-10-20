# MARJON SEALZA · EANUXX EMPORIUM
## Master Project Requirements, Architecture, & Technical Specifications (2026 Edition)

---

## 1. Executive Vision & Core Paradigm

The platform is engineered as a high-performance, single-file dual-mode web ecosystem representing **Marjon Sealza** (Computer Engineer, Multidisciplinary Builder, and Executive Strategist) and **Eanuxx Emporium** (Commerce & Engineering Studio).

### The Two Core Modes
1. **LIFE Mode (Career Magazine · Master Edition 2026)**
   * **Visual Identity:** Luxury print-editorial publication layout with physical magazine binder styling, center crease shading, running folio page counters, gold rules, and two-page spreads.
   * **Role:** Professional portfolio, academic capstone showcase, engineering telemetry, video transmissions, verified archives, and multidisciplinary thought leadership.
2. **STORE Mode (Eanuxx Emporium · Products & Services)**
   * **Visual Identity:** Executive studio desk atmosphere with rich walnut wood, ambient warm task lighting, physical boxed collector merchandise on the left, and digital hardware/software terminals on the right.
   * **Role:** Commercial storefront for physical-only tangible goods, branded stationery, engineering consultations, and a live courier fulfillment tracking pipeline.

---

## 2. Global Navigation & Two-Way Switching System

* **Top Masthead Switcher:** A persistent, hardware-style segmented pill slider (`01 LIFE` vs. `02 STORE`) anchored in the sticky navigation bar, transitioning states with smooth CSS transforms and zero page reloads.
* **Default Landing State:** The website strictly lands on the **LIFE** mode upon first visit.
* **Pervasive Two-Way Cross-Links:**
  * **From STORE to LIFE:** Every single section of the store (the Studio Desk Hero, Commercial Catalog, Live Fulfillment Tracker, Tablet Services Console, and Footer) features explicit `← Switch to Life Edition` buttons.
  * **From LIFE to STORE:** Every single spread and section of the magazine (Top Banner, Running Spread Folios, Cover badge, Capstone hardware box, Toolkit formation block, Media vault, Turner bar, and Footer) features reciprocal `Switch to Store Edition →` triggers.
* **Browser-Style History Trail & Auto-Dismissing Popover:**
  * Top-left masthead features Back (`◀`), Forward (`▶`), and `HISTORY ▾` controls.
  * Captures every in-app transition (Spreads 01–04, Store catalog, Command Office) with human-readable titles, timestamps, and view tags (`MAGAZINE` vs. `COMMERCE`).
  * **Auto-Dismiss Behavior:** Hovering over the cluster opens the history menu; moving the mouse pointer outside the cluster immediately closes it.
  * **Hardware Shortcuts:** Supports standard browser hotkeys (`Alt + ArrowLeft` for Back, `Alt + ArrowRight` for Forward).
  * **Contextual In-Page Back Buttons:** Compact `← Back to Previous Page` buttons integrated into sub-navigation ribbons across both views.

---

## 3. "LIFE" Mode — Editorial Magazine Structure

Built page-by-page to mirror the physical 7-page / multi-spread Career Magazine format:

### Spread 01: Cover & The Professional Profile (Pages 01 – 02)
* **Page 01 (Magazine Cover):**
  * Masthead display typography: *MARJON SEALZA*.
  * Edition kicker: *CAREER MAGAZINE · MASTER EDITION 2026*.
  * Barcode metadata, issue number, volume tags, and verified credential callout chips.
  * In-cover direct commerce banner linking to Eanuxx Emporium.
* **Page 02 (The Professional Profile):**
  * Narrative lead: Computer Engineer & Multidisciplinary Builder operating across Engineering, Business, Communication, and Digital execution.
  * 4 Core Pillars of Knowledge:
    1. *Engineering:* Computer engineering, Arduino systems thinking, hardware architecture.
    2. *Business:* Executive marketing leadership, retail operations, investment advisory.
    3. *Communication:* Technical documentation, ESL cross-cultural instruction, public speaking.
    4. *Digital:* BI dashboards (Google Data Studio), video post-production (Adobe Premiere Pro).
  * Professional Summary statement and verified credentials scorecard.

### Spread 02: Career Timeline & Featured Capstone (Pages 03 – 04)
* **Page 03 (Chronology of Roles):**
  * Complete career trajectory from 2018 to Present:
    * *2023 – Present:* Marketing Adviser · Xia Investment Corp.
    * *2020 – Present:* Manager / Marketing Head (Part-time) · Maderuse General Merchandise.
    * *2022 – 2023:* ESL Teacher · E-Core English Tutoring Services Inc.
    * *2021 – 2022:* Sales & Marketing Assistant → CMO 3 · Jaychen Marketing Solutions Inc.
    * *2018 – 2021:* HR Assistant → HR Officer 1 · De Rueda Design & Construction.
* **Page 04 (Capstone Thesis Research — CODEX 4):**
  * Title: *Automated Wheelchair and Stretcher for Bahay-Puso Elderly*.
  * Applied electromechanical conversion solution combining joystick wheelchair control with motorized bed transformation.
  * Hardware Specifications Grid:
    * *Supervisory Core:* Arduino Mega 2560 microcontroller & analog joystick.
    * *Locomotion & Drive:* Dual 24V DC geared hub motors + dual linear actuators.
    * *Performance Targets:* 250 kg gross payload capacity · ~5 km/h top velocity.
    * *Power System:* 24V LiFePO4 battery chemistry with dedicated isolation relays.
  * Direct callout to purchase physical engineering hardware kits in the Store.

### Spread 03: The Toolkit & Formation (Pages 05 – 06)
* **Page 05 (The Multidisciplinary Toolkit):**
  * Technical & Hardware: C++, Arduino IDE, MATLAB, Multisim, PCB Prototyping, Circuit Simulation.
  * Business & Operations: Google Data Studio, Financial Modeling, POS/Inventory Architectures, Franchise Auditing.
  * Production & Media: Adobe Premiere Pro, Technical Editing, Copywriting, Publishing.
* **Page 06 (Academic Formation & Credentials):**
  * Bachelor of Science in Computer Engineering (BSCpE) · Eastwoods Professional College of Science and Technology (EPCST).
  * Professional certifications, institutional honors, and direct consultation booking triggers.

### Spread 04: Visual Transmissions & Media Vault (Pages 07 – 08)
* **Vlogs & Technical Chronicles:**
  * 16:9 media cards with duration and resolution badges (`1080p60`):
    * *VLOG // 01:* Inside the CODEX 4 Mobility Architecture (Linear actuators & safety loops).
    * *VLOG // 02:* From Engineering to CMO: The Dual Mindset (Algorithmic funnel optimization).
    * *VLOG // 03:* Premiere Pro Post-Production Workflows (Technical pacing and editing).
* **Completed Projects Portfolio:**
  * *PRJ::HW-01:* Mobility Core (CODEX 4 automated wheelchair-stretcher).
  * *PRJ::SYS-02:* Enterprise Inventory Core (POS architecture for retail operations).
  * *PRJ::DAT-03:* Marketing Analytics Suite (Google Data Studio campaign dashboards).
* **Public File Vault (REPOSITORY::DIR):**
  * Downloadable documents with SHA-256 cryptographic hashes:
    * `Marjon_Sealza_Career_Magazine_2026.pdf` (4.2 MB · SHA256: `d8a1c9`)
    * `Automated_Wheelchair_Stretcher_Thesis_Draft.pdf` (12.8 MB · SHA256: `4f83e2`)
    * `Arduino_Mega2560_Supervisory_Firmware.ino` (142 KB · SHA256: `7bc201`)
    * Direct trigger to order physical bound editions in the store.

---

## 4. "STORE" Mode — Eanuxx Emporium

* **Executive Studio Hero:**
  * Large, bold centered masthead: `MARJON SEALZA` with sub-strap `PRODUCTS & SERVICES`.
  * Warm tan `Explore Store` CTA paired with `← Switch to Life Edition`.
* **Desk Layout Metaphor:**
  * **Left Wing (Physical Tangibles):** Boxed collector kits, luxury hardcover notebooks in camel and navy bindings, and gold-embossed sleeves.
  * **Right Wing (Digital Consoles):** Interactive laptop showing real-time business telemetry and an interactive tablet console with service icons.
* **Product Catalog (100% Tangible & Consultative):**
  * `SKU::EJ-01` — Hardbound Engineering Journal ($34.00): Archival-grade grid paper, leather cover with gold-foil seal.
  * `SKU::MP-04` — Hardware Dev Merch Pack ($58.00): Custom desk mat, matte black aluminum pen, collector box.
  * `SRV::CNS-01` — Architecture Consultation ($180.00): 1-on-1 systems audit and deployment advisory.
* **Live Fulfillment Tracking Pipeline:**
  * Public pipeline table displaying parcel tracking codes, manifest descriptions, timestamps, and real-time status badges (`Pending: Packing` in amber, `Delivered: Signed` in emerald green).

---

## 5. Security & Authentication Infrastructure

* **Multi-Role Support:**
  * **Customer:** Basic access to track orders, schedule sessions, and manage physical deliveries.
  * **Owner (Marjon Sealza):** Privileged executive access enforcing Two-Factor Authentication.
* **Modal Dialog Views:**
  1. *Sign In:* Email and password authentication with owner auto-detection.
  2. *Sign Up:* Registration form (Name, Email, Passphrase) with immediate 2FA onboarding.
  3. *Two-Factor Verification (2FA / TOTP):* RFC 6238-compliant 6-digit verification code input.
  4. *Forgot Password:* Email recovery token generator.
  5. *Reset Password:* Cryptographic passphrase update.
* **Air-Gapped Private Command Office:**
  * **Zero Public Footprint:** The management UI is not rendered to unauthenticated users.
  * **Authentication Barrier:** Unlocks only after valid Owner 2FA verification.
  * **Secret Shortcut:** `Ctrl + Shift + O` opens the privileged login console from anywhere.
  * **Emergency Lock:** Pressing `Escape` or clicking `LOCK SESSION` immediately purges the session and unmounts the office from the DOM.
  * **Store Management Engine:** Allows updating order statuses in real time (e.g., changing `ENX-9082-PH` from `Pending: Packing` to `Delivered: Signed`), printing thermal waybill PDFs, and batching courier dispatches.
  * **Life Management Engine:** Checklist for CODEX 4 research milestones, private milestone entries, and media file vault re-indexing.

---

## 6. Build, Deployment, & Engineering Standards

* **Tooling Standardization:** Exclusively standardized on **npm** and **Vite**.
* **Zero Bun Artifacts:** Complete removal of `bun.lock` and `bun.lockb`.
* **Single-File Architecture:** The production runtime is unified in a single, high-efficiency `index.html` file combining all HTML, CSS, and vanilla JavaScript.
* **Hosting Pipeline:** Configured for **Cloudflare Pages**:
  * Build command: `npm run build`
  * Publish directory: `dist`
  * Runtime Node version: `20.18.0` LTS
  * Edge Security: Configured via `public/_headers` (DENY framing, CSP font allowances, nosniff, strict referrers).
* **Asset Packaging:** Includes `scripts/bundle-zip.js` to compile the entire project into a `.zip` archive via `npm run bundle:zip`.