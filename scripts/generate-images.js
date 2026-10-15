import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const imagesDir = path.join(publicDir, 'images');

const directories = [
  path.join(imagesDir, 'home'),
  path.join(imagesDir, 'about'),
  path.join(imagesDir, 'portfolio'),
  path.join(imagesDir, 'portfolio', 'project-thumbnails'),
  path.join(imagesDir, 'resume'),
  path.join(imagesDir, 'vlog'),
  path.join(imagesDir, 'vlog', 'thumbnails'),
  path.join(imagesDir, 'store'),
  path.join(imagesDir, 'contact'),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to convert SVG string to WebP
async function createWebPFromSvg(svgString, outputPath, width, height) {
  const buffer = Buffer.from(svgString);
  await sharp(buffer)
    .resize(width, height)
    .webp({ quality: 90 })
    .toFile(outputPath);
  console.log(`Generated: ${outputPath}`);
}

async function generateAllImages() {
  console.log('Generating production WebP image assets for all 7 pages...');

  // 1. Home Hero Banner (1920x650)
  const homeHeroSvg = `
  <svg width="1920" height="650" viewBox="0 0 1920 650" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="650" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0B132B"/>
        <stop offset="35%" stopColor="#1C2541"/>
        <stop offset="65%" stopColor="#4A1942"/>
        <stop offset="85%" stopColor="#B33951"/>
        <stop offset="100%" stopColor="#E07A5F"/>
      </linearGradient>
      <linearGradient id="neonLogo" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00E5FF"/>
        <stop offset="50%" stopColor="#9D00FF"/>
        <stop offset="100%" stopColor="#FF007A"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00E5FF"/>
        <stop offset="50%" stopColor="#D946EF"/>
        <stop offset="100%" stopColor="#EC4899"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Sky Background -->
    <rect width="1920" height="650" fill="url(#skyGrad)"/>

    <!-- Mountain Silhouettes -->
    <path d="M0 500 Q 250 420 500 480 T 1000 440 T 1500 460 T 1920 420 L 1920 650 L 0 650 Z" fill="#151226" opacity="0.8"/>
    <path d="M0 540 Q 300 490 600 530 T 1200 510 T 1800 520 L 1920 530 L 1920 650 L 0 650 Z" fill="#0D0A18"/>

    <!-- Ocean Reflection -->
    <rect y="550" width="1920" height="100" fill="#080711" opacity="0.95"/>
    <ellipse cx="600" cy="560" rx="400" ry="15" fill="#E07A5F" opacity="0.3" filter="url(#glow)"/>
    <ellipse cx="1200" cy="570" rx="300" ry="10" fill="#EC4899" opacity="0.25" filter="url(#glow)"/>

    <!-- Left Silhouette: Marjon looking at sunset in hoodie with glowing M logo -->
    <g transform="translate(180, 240)">
      <ellipse cx="140" cy="60" rx="55" ry="65" fill="#0A0B12"/>
      <!-- Face profile -->
      <path d="M140 10 Q 185 30 180 80 Q 170 125 130 130 Q 110 130 95 100 Q 90 40 140 10 Z" fill="#0A0B12"/>
      <!-- Hoodie Back -->
      <path d="M60 110 Q 140 100 220 120 L 260 380 L 10 380 L 60 110 Z" fill="#0A0B12"/>
      <!-- Glowing geometric M Logo on hoodie -->
      <g transform="translate(110, 160) scale(0.7)" filter="url(#glow)">
        <path d="M15 85V15L50 55L85 15V85H70V42L50 65L30 42V85H15Z" fill="url(#neonLogo)"/>
      </g>
    </g>

    <!-- Center/Right Typography: MARJON SEALZA COMPUTER ENGINEER -->
    <g transform="translate(720, 190)">
      <text x="350" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="74" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">
        MARJON <tspan fill="url(#textGrad)">SEALZA</tspan>
      </text>
      <text x="350" y="125" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="20" fill="#00E5FF" text-anchor="middle" letter-spacing="10">
        COMPUTER ENGINEER
      </text>
      <text x="350" y="180" font-family="serif" font-style="italic" font-weight="400" font-size="28" fill="#F1F5F9" text-anchor="middle">
        “Turning ideas into useful digital solutions.”
      </text>
    </g>

    <!-- Bottom 5 Core Service Tiles -->
    <g transform="translate(480, 520)">
      <!-- Web Dev -->
      <g transform="translate(0, 0)">
        <rect width="170" height="70" rx="14" fill="#0A0F1D" stroke="#00E5FF" stroke-opacity="0.3" stroke-width="1"/>
        <text x="85" y="32" font-family="monospace" font-size="16" fill="#00E5FF" text-anchor="middle" font-weight="bold">&lt;/&gt;</text>
        <text x="85" y="52" font-family="sans-serif" font-size="12" fill="#E2E8F0" text-anchor="middle" font-weight="600">Web Development</text>
      </g>
      <!-- Software Dev -->
      <g transform="translate(190, 0)">
        <rect width="180" height="70" rx="14" fill="#0A0F1D" stroke="#38BDF8" stroke-opacity="0.3" stroke-width="1"/>
        <text x="90" y="32" font-family="sans-serif" font-size="14" fill="#38BDF8" text-anchor="middle">🖥</text>
        <text x="90" y="52" font-family="sans-serif" font-size="12" fill="#E2E8F0" text-anchor="middle" font-weight="600">Software Development</text>
      </g>
      <!-- Mobile Apps -->
      <g transform="translate(390, 0)">
        <rect width="160" height="70" rx="14" fill="#0A0F1D" stroke="#A855F7" stroke-opacity="0.3" stroke-width="1"/>
        <text x="80" y="32" font-family="sans-serif" font-size="14" fill="#A855F7" text-anchor="middle">📱</text>
        <text x="80" y="52" font-family="sans-serif" font-size="12" fill="#E2E8F0" text-anchor="middle" font-weight="600">Mobile Apps</text>
      </g>
      <!-- System & Automation -->
      <g transform="translate(570, 0)">
        <rect width="180" height="70" rx="14" fill="#0A0F1D" stroke="#EC4899" stroke-opacity="0.3" stroke-width="1"/>
        <text x="90" y="32" font-family="sans-serif" font-size="14" fill="#EC4899" text-anchor="middle">⚙️</text>
        <text x="90" y="52" font-family="sans-serif" font-size="12" fill="#E2E8F0" text-anchor="middle" font-weight="600">System &amp; Automation</text>
      </g>
      <!-- Design & Media -->
      <g transform="translate(770, 0)">
        <rect width="160" height="70" rx="14" fill="#0A0F1D" stroke="#F59E0B" stroke-opacity="0.3" stroke-width="1"/>
        <text x="80" y="32" font-family="sans-serif" font-size="14" fill="#F59E0B" text-anchor="middle">🎨</text>
        <text x="80" y="52" font-family="sans-serif" font-size="12" fill="#E2E8F0" text-anchor="middle" font-weight="600">Design &amp; Media</text>
      </g>
    </g>
  </svg>
  `;
  await createWebPFromSvg(homeHeroSvg, path.join(imagesDir, 'home', 'hero.webp'), 1920, 650);

  // 2. About Profile Banner (1920x650)
  const aboutBannerSvg = `
  <svg width="1920" height="650" viewBox="0 0 1920 650" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aboutBg" x1="0" y1="0" x2="1920" y2="650" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#050814"/>
        <stop offset="40%" stopColor="#0B132B"/>
        <stop offset="80%" stopColor="#1A092B"/>
        <stop offset="100%" stopColor="#050814"/>
      </linearGradient>
      <linearGradient id="cyanPurple" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00E5FF"/>
        <stop offset="100%" stopColor="#D946EF"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="650" fill="url(#aboutBg)"/>

    <!-- Left: Handwritten Engineering Cycle -->
    <g transform="translate(120, 140)">
      <text x="0" y="40" font-family="cursive, sans-serif" font-size="44" fill="#38BDF8" font-weight="bold">Ideas</text>
      <text x="0" y="100" font-family="cursive, sans-serif" font-size="44" fill="#818CF8">Code</text>
      <text x="0" y="160" font-family="cursive, sans-serif" font-size="44" fill="#A78BFA">Design</text>
      <text x="0" y="220" font-family="cursive, sans-serif" font-size="44" fill="#C084FC" font-weight="bold">Build</text>
      <text x="0" y="280" font-family="cursive, sans-serif" font-size="44" fill="#E879F9">Improve</text>
      <text x="0" y="340" font-family="cursive, sans-serif" font-size="48" fill="#F43F5E" font-weight="bold">Repeat</text>
    </g>

    <!-- Center: Coding Monitor Setup -->
    <g transform="translate(480, 110)">
      <!-- Main Monitor -->
      <rect x="0" y="0" width="580" height="380" rx="16" fill="#080C1A" stroke="#38BDF8" stroke-opacity="0.3" stroke-width="2"/>
      <rect x="15" y="15" width="550" height="320" rx="8" fill="#040711"/>
      <circle cx="35" cy="35" r="5" fill="#EF4444"/>
      <circle cx="50" cy="35" r="5" fill="#F59E0B"/>
      <circle cx="65" cy="35" r="5" fill="#10B981"/>
      <!-- Code lines -->
      <rect x="35" y="60" width="160" height="10" rx="4" fill="#A855F7" opacity="0.9"/>
      <rect x="35" y="85" width="280" height="8" rx="4" fill="#38BDF8" opacity="0.8"/>
      <rect x="55" y="105" width="340" height="8" rx="4" fill="#E2E8F0" opacity="0.7"/>
      <rect x="55" y="125" width="240" height="8" rx="4" fill="#F59E0B" opacity="0.8"/>
      <rect x="55" y="145" width="300" height="8" rx="4" fill="#10B981" opacity="0.8"/>
      <rect x="35" y="175" width="120" height="8" rx="4" fill="#EC4899" opacity="0.9"/>
      <rect x="35" y="200" width="420" height="8" rx="4" fill="#38BDF8" opacity="0.6"/>
      <rect x="55" y="220" width="260" height="8" rx="4" fill="#E2E8F0" opacity="0.7"/>
      <rect x="35" y="250" width="180" height="10" rx="4" fill="#A855F7" opacity="0.9"/>
      <!-- Stand -->
      <rect x="250" y="380" width="80" height="70" fill="#1E293B"/>
      <rect x="200" y="440" width="180" height="14" rx="7" fill="#334155"/>
    </g>

    <!-- Right Side: Practical quote & signature -->
    <g transform="translate(1180, 210)">
      <text x="0" y="30" font-family="serif" font-style="italic" font-size="28" fill="#F8FAFC" width="600">
        “A computer engineer
      </text>
      <text x="0" y="70" font-family="serif" font-style="italic" font-size="28" fill="#F8FAFC">
        who turns ideas into
      </text>
      <text x="0" y="110" font-family="serif" font-style="italic" font-size="28" fill="#F8FAFC">
        practical digital solutions
      </text>
      <text x="0" y="150" font-family="serif" font-style="italic" font-size="28" fill="#F8FAFC">
        for people and businesses.”
      </text>
      <!-- Handwritten Signature -->
      <text x="60" y="250" font-family="cursive, sans-serif" font-size="60" fill="#00E5FF" transform="rotate(-3 60 250)">
        Marjon Sealza
      </text>
    </g>
  </svg>
  `;
  await createWebPFromSvg(aboutBannerSvg, path.join(imagesDir, 'about', 'profile-banner.webp'), 1920, 650);

  // 3. Portfolio Banner (1920x650)
  const portfolioBannerSvg = `
  <svg width="1920" height="650" viewBox="0 0 1920 650" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="portBg" x1="0" y1="0" x2="1920" y2="650" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#060914"/>
        <stop offset="50%" stopColor="#0F172A"/>
        <stop offset="100%" stopColor="#1E0B2B"/>
      </linearGradient>
      <linearGradient id="portText" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00E5FF"/>
        <stop offset="100%" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="650" fill="url(#portBg)"/>

    <g transform="translate(160, 200)">
      <text x="0" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="52" fill="#FFFFFF">
        MY
      </text>
      <text x="0" y="140" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="80" fill="url(#portText)">
        PORTFOLIO
      </text>
      <text x="0" y="210" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="600" fill="#E2E8F0">
        Web · Software · Mobile Apps
      </text>
      <text x="0" y="245" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="600" fill="#94A3B8">
        Systems · UI/UX · Media
      </text>
    </g>

    <!-- Workstation Graphic on Right (Dual monitor + Laptop with M logo) -->
    <g transform="translate(900, 120)">
      <!-- Desktop Monitor -->
      <rect x="220" y="20" width="620" height="380" rx="14" fill="#030712" stroke="#38BDF8" stroke-width="2"/>
      <rect x="235" y="35" width="590" height="320" rx="6" fill="#0B132B"/>
      <!-- Grid items on screen -->
      <rect x="255" y="55" width="170" height="120" rx="6" fill="#1E293B"/>
      <rect x="445" y="55" width="170" height="120" rx="6" fill="#1E293B"/>
      <rect x="635" y="55" width="170" height="120" rx="6" fill="#1E293B"/>
      <rect x="255" y="195" width="170" height="130" rx="6" fill="#1E293B"/>
      <rect x="445" y="195" width="170" height="130" rx="6" fill="#1E293B"/>
      <rect x="635" y="195" width="170" height="130" rx="6" fill="#1E293B"/>
      <!-- Laptop on the left with glowing M -->
      <rect x="40" y="190" width="280" height="180" rx="10" fill="#030712" stroke="#A855F7" stroke-width="1.5"/>
      <rect x="50" y="200" width="260" height="150" rx="4" fill="#090D1A"/>
      <!-- M logo inside laptop -->
      <g transform="translate(155, 250) scale(0.6)">
        <path d="M15 85V15L50 55L85 15V85H70V42L50 65L30 42V85H15Z" fill="#00E5FF"/>
      </g>
      <rect x="0" y="370" width="360" height="16" rx="8" fill="#1E293B"/>
    </g>
  </svg>
  `;
  await createWebPFromSvg(portfolioBannerSvg, path.join(imagesDir, 'portfolio', 'portfolio-banner.webp'), 1920, 650);

  // Project Thumbnails
  const projects = [
    { id: 'nexus', title: 'NexusCloud Storage', cat: 'APIs &amp; Storage', color: '#00E5FF' },
    { id: 'aetheria', title: 'Aetheria Telemetry', cat: 'Systems Pipeline', color: '#818CF8' },
    { id: 'quantum', title: 'QuantumVault', cat: 'Security Storage', color: '#F59E0B' },
    { id: 'hyperion', title: 'Hyperion UI System', cat: 'Design System', color: '#10B981' },
    { id: 'meshpulse', title: 'MeshPulse Observer', cat: 'Cloud Mesh', color: '#EC4899' },
  ];

  for (const p of projects) {
    const thumbSvg = `
    <svg width="800" height="500" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="500" fill="#080D1A"/>
      <rect x="20" y="20" width="760" height="460" rx="16" fill="#0B132B" stroke="${p.color}" stroke-opacity="0.3" stroke-width="2"/>
      <circle cx="80" cy="80" r="30" fill="${p.color}" fill-opacity="0.2"/>
      <text x="80" y="87" font-family="monospace" font-size="20" fill="${p.color}" text-anchor="middle">&lt;/&gt;</text>
      <text x="80" y="240" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="36" fill="#FFFFFF">${p.title}</text>
      <text x="80" y="280" font-family="'JetBrains Mono', monospace" font-size="16" fill="${p.color}">${p.cat}</text>
      <rect x="80" y="320" width="640" height="8" rx="4" fill="#1E293B"/>
      <rect x="80" y="340" width="480" height="8" rx="4" fill="#1E293B"/>
      <text x="80" y="420" font-family="sans-serif" font-size="14" fill="#94A3B8">High Performance Systems Engineering · Google Drive Synced</text>
    </svg>
    `;
    await createWebPFromSvg(thumbSvg, path.join(imagesDir, 'portfolio', 'project-thumbnails', `${p.id}.webp`), 800, 500);
  }

  // 4. Resume Banner (1920x650)
  const resumeBannerSvg = `
  <svg width="1920" height="650" viewBox="0 0 1920 650" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="resBg" x1="0" y1="0" x2="1920" y2="650" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0B132B"/>
        <stop offset="50%" stopColor="#31102A"/>
        <stop offset="100%" stopColor="#080711"/>
      </linearGradient>
      <linearGradient id="resGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00E5FF"/>
        <stop offset="100%" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="650" fill="url(#resBg)"/>

    <g transform="translate(180, 160)">
      <text x="0" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="90" fill="url(#resGrad)">
        RESUME
      </text>
      <text x="0" y="140" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="36" fill="#FFFFFF">
        MARJON SEALZA
      </text>
      <text x="0" y="175" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="16" fill="#00E5FF" letter-spacing="8">
        COMPUTER ENGINEER
      </text>

      <!-- Left Checklist items from image -->
      <g transform="translate(0, 230)">
        <text x="35" y="20" font-family="sans-serif" font-size="18" fill="#F1F5F9" font-weight="600">🎓  Education (Eastwoods BSCpE)</text>
        <text x="35" y="60" font-family="sans-serif" font-size="18" fill="#F1F5F9" font-weight="600">💼  Work Experience</text>
        <text x="35" y="100" font-family="sans-serif" font-size="18" fill="#F1F5F9" font-weight="600">⚙️  Skills &amp; Technologies</text>
        <text x="35" y="140" font-family="sans-serif" font-size="18" fill="#F1F5F9" font-weight="600">🏅  Certifications</text>
      </g>

      <!-- Right Checklist items from image -->
      <g transform="translate(420, 230)">
        <text x="35" y="20" font-family="sans-serif" font-size="18" fill="#F1F5F9" font-weight="600">👤  Professional Summary</text>
        <text x="35" y="60" font-family="sans-serif" font-size="18" fill="#F1F5F9" font-weight="600">&lt;/&gt;  Projects</text>
        <text x="35" y="100" font-family="sans-serif" font-size="18" fill="#F1F5F9" font-weight="600">🌐  Languages</text>
        <text x="35" y="140" font-family="sans-serif" font-size="18" fill="#F1F5F9" font-weight="600">❤️  Interests</text>
      </g>
    </g>
  </svg>
  `;
  await createWebPFromSvg(resumeBannerSvg, path.join(imagesDir, 'resume', 'resume-banner.webp'), 1920, 650);

  // 5. Vlog Banner (1920x650)
  const vlogBannerSvg = `
  <svg width="1920" height="650" viewBox="0 0 1920 650" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vlogBg" x1="0" y1="0" x2="1920" y2="650" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0B132B"/>
        <stop offset="40%" stopColor="#31102A"/>
        <stop offset="80%" stopColor="#B33951"/>
        <stop offset="100%" stopColor="#E07A5F"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="650" fill="url(#vlogBg)"/>

    <!-- Center: VLOG with play button in O -->
    <g transform="translate(680, 180)">
      <text x="0" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="120" fill="#FFFFFF">
        VL
      </text>
      <!-- Stylized O with play button -->
      <circle cx="210" cy="75" r="50" fill="none" stroke="#FFFFFF" stroke-width="18"/>
      <polygon points="200,60 200,90 230,75" fill="#EF4444"/>
      <text x="275" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="120" fill="#FFFFFF">
        G
      </text>

      <text x="200" y="180" font-family="'JetBrains Mono', monospace" font-size="20" font-weight="700" fill="#F8FAFC" text-anchor="middle">
        Ideas · Projects · Tutorials
      </text>
      <text x="200" y="215" font-family="'JetBrains Mono', monospace" font-size="20" font-weight="700" fill="#CBD5E1" text-anchor="middle">
        Life · Travel · Tech
      </text>
    </g>

    <!-- Right Side: Handwritten cursive -->
    <g transform="translate(1320, 190)">
      <text x="0" y="40" font-family="cursive, sans-serif" font-size="46" fill="#FDE68A" font-weight="bold">Document</text>
      <text x="0" y="100" font-family="cursive, sans-serif" font-size="46" fill="#FDBA74">Create</text>
      <text x="0" y="160" font-family="cursive, sans-serif" font-size="46" fill="#F87171" font-weight="bold">Share</text>
      <text x="0" y="220" font-family="cursive, sans-serif" font-size="46" fill="#F472B6" font-weight="bold">Inspire</text>
    </g>
  </svg>
  `;
  await createWebPFromSvg(vlogBannerSvg, path.join(imagesDir, 'vlog', 'vlog-banner.webp'), 1920, 650);

  // Vlog Episode Thumbnails (4 files)
  for (let i = 1; i <= 4; i++) {
    const vThumbSvg = `
    <svg width="800" height="450" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="450" fill="#0A0F1D"/>
      <circle cx="400" cy="200" r="45" fill="#EF4444"/>
      <polygon points="390,185 390,215 420,200" fill="#FFFFFF"/>
      <text x="400" y="320" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
        Episode 0${i}: Engineering &amp; Creative Insights
      </text>
      <text x="400" y="360" font-family="sans-serif" font-size="16" fill="#94A3B8" text-anchor="middle">
        Filmed in Bataan, Philippines · Marjon Sealza
      </text>
    </svg>
    `;
    await createWebPFromSvg(vThumbSvg, path.join(imagesDir, 'vlog', 'thumbnails', `episode-${i}.webp`), 800, 450);
  }

  // 6. Store Banner (Services Only) (1920x650)
  const servicesBannerSvg = `
  <svg width="1920" height="650" viewBox="0 0 1920 650" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="servBg" x1="0" y1="0" x2="1920" y2="650" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#050814"/>
        <stop offset="50%" stopColor="#1E0B2B"/>
        <stop offset="100%" stopColor="#0B132B"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="650" fill="url(#servBg)"/>

    <g transform="translate(240, 180)">
      <text x="0" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="80" fill="#FFFFFF">
        SERVICES <tspan fill="#EC4899">ONLY</tspan>
      </text>
      <text x="0" y="140" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="28" fill="#F1F5F9">
        Custom <tspan fill="#00E5FF">Digital Solutions</tspan> by <tspan fill="#F472B6">Marjon Sealza</tspan>
      </text>

      <g transform="translate(0, 180)">
        <text x="0" y="40" font-family="sans-serif" font-size="16" fill="#E2E8F0">🖥 Website Development</text>
        <text x="240" y="40" font-family="sans-serif" font-size="16" fill="#E2E8F0">&lt;/&gt; Software Development</text>
        <text x="490" y="40" font-family="sans-serif" font-size="16" fill="#E2E8F0">📱 Mobile App Development</text>
      </g>
    </g>

    <!-- Right Checklist: Professional, Reliable, Affordable, On-Time, Ongoing Support -->
    <g transform="translate(1300, 160)">
      <rect width="360" height="300" rx="20" fill="#030712" stroke="#EC4899" stroke-opacity="0.4" stroke-width="2"/>
      <g transform="translate(40, 60)">
        <text x="0" y="0" font-family="sans-serif" font-size="20" fill="#00E5FF">✓ Professional</text>
        <text x="0" y="45" font-family="sans-serif" font-size="20" fill="#00E5FF">✓ Reliable</text>
        <text x="0" y="90" font-family="sans-serif" font-size="20" fill="#00E5FF">✓ Affordable</text>
        <text x="0" y="135" font-family="sans-serif" font-size="20" fill="#00E5FF">✓ On-Time</text>
        <text x="0" y="180" font-family="sans-serif" font-size="20" fill="#00E5FF">✓ Ongoing Support</text>
      </g>
    </g>
  </svg>
  `;
  await createWebPFromSvg(servicesBannerSvg, path.join(imagesDir, 'store', 'services-banner.webp'), 1920, 650);

  // 7. Contact Banner (1920x650)
  const contactBannerSvg = `
  <svg width="1920" height="650" viewBox="0 0 1920 650" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="contactBg" x1="0" y1="0" x2="1920" y2="650" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0B132B"/>
        <stop offset="50%" stopColor="#31102A"/>
        <stop offset="100%" stopColor="#E07A5F"/>
      </linearGradient>
      <linearGradient id="contactGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00E5FF"/>
        <stop offset="100%" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="650" fill="url(#contactBg)"/>

    <g transform="translate(180, 160)">
      <text x="0" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="64" fill="#FFFFFF">
        LET'S WORK
      </text>
      <text x="0" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="74" fill="url(#contactGrad)">
        TOGETHER
      </text>
      <text x="0" y="180" font-family="sans-serif" font-size="20" fill="#F1F5F9">
        Have a project in mind? Send me a message and let's turn your ideas into reality.
      </text>

      <!-- Center Contact Badges -->
      <g transform="translate(0, 220)">
        <rect width="320" height="60" rx="12" fill="#030712" stroke="#38BDF8" stroke-width="1"/>
        <text x="20" y="36" font-family="monospace" font-size="14" fill="#38BDF8">✉️ engineersealza@gmail.com</text>
      </g>
      <g transform="translate(340, 220)">
        <rect width="240" height="60" rx="12" fill="#030712" stroke="#10B981" stroke-width="1"/>
        <text x="20" y="36" font-family="monospace" font-size="14" fill="#10B981">📞 +63 9XX XXX XXXX</text>
      </g>
      <g transform="translate(600, 220)">
        <rect width="240" height="60" rx="12" fill="#030712" stroke="#F59E0B" stroke-width="1"/>
        <text x="20" y="36" font-family="monospace" font-size="14" fill="#F59E0B">📍 Bataan, Philippines</text>
      </g>
    </g>

    <!-- Road signs on Right -->
    <g transform="translate(1450, 140)">
      <!-- Post -->
      <rect x="180" y="40" width="16" height="420" fill="#78350F"/>
      <!-- Sign 1: BATAAN -->
      <polygon points="60,60 280,60 310,90 280,120 60,120" fill="#92400E" stroke="#FBBF24" stroke-width="2"/>
      <text x="170" y="98" font-family="sans-serif" font-weight="900" font-size="22" fill="#FEF3C7" text-anchor="middle">BATAAN</text>
      <!-- Sign 2: MANILA -->
      <polygon points="60,140 280,140 310,170 280,200 60,200" fill="#92400E" stroke="#FBBF24" stroke-width="2"/>
      <text x="170" y="178" font-family="sans-serif" font-weight="900" font-size="22" fill="#FEF3C7" text-anchor="middle">MANILA</text>
      <!-- Sign 3: POSSIBILITIES -->
      <polygon points="30,220 290,220 320,250 290,280 30,280" fill="#92400E" stroke="#FBBF24" stroke-width="2"/>
      <text x="165" y="258" font-family="sans-serif" font-weight="900" font-size="20" fill="#FEF3C7" text-anchor="middle">POSSIBILITIES</text>
      <!-- Sign 4: A BRIGHTER TOMORROW -->
      <polygon points="10,300 290,300 320,330 290,360 10,360" fill="#92400E" stroke="#FBBF24" stroke-width="2"/>
      <text x="155" y="338" font-family="sans-serif" font-weight="900" font-size="16" fill="#FEF3C7" text-anchor="middle">A BRIGHTER TOMORROW</text>
    </g>
  </svg>
  `;
  await createWebPFromSvg(contactBannerSvg, path.join(imagesDir, 'contact', 'contact-banner.webp'), 1920, 650);

  console.log('All WebP production image assets created successfully!');
}

generateAllImages().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
