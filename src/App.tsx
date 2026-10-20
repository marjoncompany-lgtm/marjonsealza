import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import type { OrderLookup, Product } from './types';

type Cart = Record<string, number>;
const money = (amount: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

function getQuery(name: string) {
  return new URLSearchParams(window.location.search).get(name);
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

const FEATURED_PROJECTS: Project[] = [
  {
    id: 'PRJ::SYS-01',
    title: 'Cloud Infrastructure Telemetry Hub',
    category: 'Full-Stack & Cloud Systems',
    description: 'Real-time serverless telemetry, distributed edge routing, and automated error tracing built on Cloudflare Workers and Edge SQL.',
    tags: ['React', 'TypeScript', 'Cloudflare Workers', 'Edge SQL', 'Tailwind']
  },
  {
    id: 'PRJ::HW-02',
    title: 'Autonomous Electromechanical Mobility Core',
    category: 'Computer Engineering & Robotics',
    description: 'Embedded microcontroller architecture with dual linear actuator synchronization, analog joystick supervisory core, and isolation relays.',
    tags: ['Arduino C++', 'Embedded Systems', 'Microcontrollers', 'Relay Logic']
  },
  {
    id: 'PRJ::DAT-03',
    title: 'Distributed Enterprise Workflow Engine',
    category: 'Systems & Automation',
    description: 'High-throughput transactional reconciliation pipelines, live operational reporting, and secure cryptographic audit logging.',
    tags: ['Node.js', 'REST APIs', 'Data Architecture', 'Automation']
  }
];

const FULFILLMENT_PIPELINE = [
  { code: 'ENX-9082-PH', manifest: 'Hardbound Engineering Journal (SKU::EJ-01) × 1', destination: 'Bataan, PH', status: 'Delivered: Signed' },
  { code: 'ENX-4120-NCR', manifest: 'Hardware Dev Merch Pack (SKU::MP-04) × 2', destination: 'Manila, PH', status: 'In Transit' },
  { code: 'ENX-7731-VIS', manifest: 'Architecture Consultation (SRV::CNS-01)', destination: 'Cebu, PH', status: 'Pending: Packing' }
];

interface Vlog {
  id: string;
  title: string;
  duration: string;
  resolution: string;
  platform: 'YouTube' | 'TikTok';
  channelHandle: string;
  channelUrl: string;
  description: string;
  tags: string[];
  thumbnailGradient: string;
}

const FEATURED_VLOGS: Vlog[] = [
  {
    id: 'VLOG-01',
    title: 'Inside the CODEX 4 Mobility Architecture: Linear Actuators & Safety Loops',
    duration: '14:28',
    resolution: '1080p60',
    platform: 'YouTube',
    channelHandle: '@marjon_human',
    channelUrl: 'https://www.youtube.com/@marjon_human',
    description: 'Hardware bench test of the automated wheelchair-stretcher transformation mechanism, Arduino Mega 2560 supervisory firmware, and dual 24V linear actuator isolation relays.',
    tags: ['Robotics', 'Arduino C++', 'Actuators', 'CODEX 4'],
    thumbnailGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)'
  },
  {
    id: 'VLOG-02',
    title: 'From Computer Engineer to High-Scale Distributed Cloud Systems',
    duration: '18:45',
    resolution: '1080p60',
    platform: 'YouTube',
    channelHandle: '@marjon_human',
    channelUrl: 'https://www.youtube.com/@marjon_human',
    description: 'Deep dive into serverless edge function execution, Cloudflare Workers D1 SQL storage, automated telemetry logging, and deterministic backend deployment architecture.',
    tags: ['Cloudflare Workers', 'TypeScript', 'Edge SQL', 'Systems'],
    thumbnailGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
  },
  {
    id: 'VLOG-03',
    title: 'Embedded Microcontroller Hardware Lab: 24V Motors & Relay Logic',
    duration: '11:32',
    resolution: '1080p60',
    platform: 'YouTube',
    channelHandle: '@marjon_human',
    channelUrl: 'https://www.youtube.com/@marjon_human',
    description: 'Step-by-step oscilloscope telemetry, analog joystick deadband filtering, and power distribution diagnostics in our Bataan engineering workstation.',
    tags: ['Electronics', 'Relays', 'Microcontrollers', 'Lab'],
    thumbnailGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)'
  },
  {
    id: 'VLOG-04',
    title: 'Daily Tech Chronicles: Micro-Prototyping & Developer Routine',
    duration: '01:45',
    resolution: '1080p',
    platform: 'TikTok',
    channelHandle: '@marjon.mb',
    channelUrl: 'https://www.tiktok.com/@marjon.mb',
    description: 'Bite-sized engineering routines: PCB inspection, terminal keyboard workflows, and quick troubleshooting tips from Marjon Sealza (@marjon.mb).',
    tags: ['Shorts', 'Workstation', 'PCB', 'TechLife'],
    thumbnailGradient: 'linear-gradient(135deg, #4a044e 0%, #701a75 50%, #86198f 100%)'
  }
];

interface SocialProfile {
  name: string;
  handle: string;
  platform: string;
  url: string;
  color: string;
  icon: string;
  role: string;
}

const SOCIAL_PROFILES: SocialProfile[] = [
  {
    name: 'YouTube Channel',
    handle: '@marjon_human',
    platform: 'YouTube',
    url: 'https://www.youtube.com/@marjon_human',
    color: '#ef4444',
    icon: '▶',
    role: 'Engineering Vlogs, Tech Demos & Hardware Builds'
  },
  {
    name: 'X (Twitter)',
    handle: '@eanuxx',
    platform: 'X',
    url: 'https://x.com/eanuxx',
    color: '#e2e8f0',
    icon: '𝕏',
    role: 'Computer Engineering Insights & Telemetry Updates'
  },
  {
    name: 'Facebook',
    handle: '@eanuxx',
    platform: 'Facebook',
    url: 'https://www.facebook.com/eanuxx',
    color: '#3b82f6',
    icon: 'f',
    role: 'Official Personal & Engineering Updates'
  },
  {
    name: 'Instagram',
    handle: '@eanuxx',
    platform: 'Instagram',
    url: 'https://www.instagram.com/eanuxx',
    color: '#ec4899',
    icon: '📸',
    role: 'Visual Design, Behind-The-Scenes & Workstation'
  },
  {
    name: 'TikTok',
    handle: '@marjon.mb',
    platform: 'TikTok',
    url: 'https://www.tiktok.com/@marjon.mb',
    color: '#06b6d4',
    icon: '♬',
    role: 'Short-Form Tech Chronicles & Prototyping Reels'
  },
  {
    name: 'Official Domain',
    handle: 'marjonsealza.life',
    platform: 'Web Property',
    url: 'https://www.marjonsealza.life',
    color: '#10b981',
    icon: '🌐',
    role: 'Verified Google Search Console Identity Domain'
  }
];

interface AuthUser {
  name: string;
  email: string;
  role: 'customer' | 'owner';
}

type AuthTab = 'login' | 'signup' | '2fa' | 'forgot' | 'renew';

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const standaloneStore = pathname === '/store';
  const standaloneCheckout = pathname === '/checkout';

  // Strict separation of LIFE (default) and STORE
  const [mode, setMode] = useState<'life' | 'store'>(() => {
    if (standaloneStore || standaloneCheckout) return 'store';
    try {
      const saved = sessionStorage.getItem('ms-active-mode');
      return saved === 'store' ? 'store' : 'life';
    } catch { return 'life'; }
  });

  // Authentication & 2FA State for STORE Mode
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('ms-auth-user');
      return saved ? JSON.parse(saved) as AuthUser : null;
    } catch { return null; }
  });

  const [storeUnlocked, setStoreUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ms-store-unlocked') === 'true';
    } catch { return false; }
  });

  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [authFeedback, setAuthFeedback] = useState<{ error?: string; success?: string }>({});

  // Auth Form Fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);

  // 2FA Fields
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [expected2FA, setExpected2FA] = useState('482910');

  // Password Recovery / Renewal Fields
  const [recoveryToken, setRecoveryToken] = useState('');
  const [expectedToken, setExpectedToken] = useState('RST-7942');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>(() => {
    try {
      const saved = sessionStorage.getItem('ms-life-store-cart');
      return saved ? JSON.parse(saved) as Cart : {};
    } catch { return {}; }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<OrderLookup | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  // Store Controls
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVlog, setSelectedVlog] = useState<Vlog | null>(null);
  const [profileView, setProfileView] = useState<'fb' | 'grad'>('fb');

  // Contact Form State for LIFE
  const [contactState, setContactState] = useState({ name: '', email: '', projectType: 'Full-Stack Development', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  const reference = getQuery('reference');
  const page = getQuery('page');

  const isStoreMode = standaloneStore || standaloneCheckout || mode === 'store';

  const switchMode = (newMode: 'life' | 'store') => {
    setMode(newMode);
    try { sessionStorage.setItem('ms-active-mode', newMode); } catch { /* ignore */ }
    if (newMode === 'store' && !standaloneStore && !standaloneCheckout) {
      window.location.hash = 'store';
      if (!authUser) {
        const authEl = document.getElementById('store-login-landing');
        if (authEl) authEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (newMode === 'life' && window.location.hash) {
      window.location.hash = '';
    }
  };

  const scrollToAuth = () => {
    const el = document.getElementById('store-login-landing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    try { sessionStorage.setItem('ms-life-store-cart', JSON.stringify(cart)); } catch { /* storage may be disabled */ }
  }, [cart]);

  useEffect(() => {
    if (authUser) {
      setCustomer(prev => ({
        ...prev,
        name: prev.name || authUser.name,
        email: prev.email || authUser.email
      }));
    }
  }, [authUser]);

  useEffect(() => {
    api.products()
      .then(data => {
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      })
      .catch(e => {
        setError(e instanceof Error ? e.message : 'Could not load products');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!reference || page !== 'success') return;
    setOrderLoading(true);
    api.order(reference).then(data => setOrder(data.order))
      .catch(e => setError(e.message))
      .finally(() => setOrderLoading(false));
  }, [reference, page]);

  const cartItems = useMemo(() => (products || [])
    .filter(p => p && (cart[p.id] || 0) > 0)
    .map(product => ({ product, quantity: cart[product.id] })), [products, cart]);

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const add = (id: string) => {
    if (!authUser || !storeUnlocked) {
      setAuthFeedback({
        error: !authUser
          ? 'Store Locked: Please sign in or register with 2FA to add items to cart and unlock inside store purchasing.'
          : 'Store Locked: Please click the "✦ EXPLORE STORE ✦" button above to unlock inside store purchasing.'
      });
      scrollToAuth();
      return;
    }
    setCart(prev => ({ ...prev, [id]: Math.min(20, (prev[id] || 0) + 1) }));
  };

  const remove = (id: string) => setCart(prev => {
    const next = { ...prev };
    if ((next[id] || 0) <= 1) delete next[id]; else next[id] -= 1;
    return next;
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach(p => { if (p.category) set.add(p.category); });
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  async function checkout(event: React.FormEvent) {
    event.preventDefault();
    setError(''); setNotice('');
    if (!authUser || !storeUnlocked) {
      setAuthFeedback({
        error: !authUser
          ? 'Store Locked: Sign in with 2FA required to proceed with PayMongo checkout.'
          : 'Store Locked: Please click "✦ EXPLORE STORE ✦" on the landing page to unlock checkout access.'
      });
      scrollToAuth();
      return;
    }
    if (!cartItems.length) { setError('Add at least one item to your cart.'); return; }
    if (!customer.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      setError('Enter your name and a valid email address.'); return;
    }
    setBusy(true);
    try {
      const result = await api.createCheckout({
        items: cartItems.map(({ product, quantity }) => ({ productId: product.id, quantity })),
        customer
      });
      window.location.assign(result.checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start checkout.');
      setBusy(false);
    }
  }

  // Auth Actions for STORE
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback({});
    if (!authEmail.trim() || !authPassword) {
      setAuthFeedback({ error: 'Please provide both email and password.' });
      return;
    }
    const role: 'owner' | 'customer' = (authEmail.toLowerCase().includes('marjon') || authEmail.toLowerCase() === 'engineersealza@gmail.com') ? 'owner' : 'customer';
    const user: AuthUser = {
      name: role === 'owner' ? 'Marjon Sealza' : (authName.trim() || authEmail.split('@')[0]),
      email: authEmail.trim(),
      role
    };
    setPendingUser(user);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpected2FA(code);
    setTwoFactorCode('');
    setAuthTab('2fa');
    setAuthFeedback({ success: `Credentials accepted. Generated 2FA TOTP code: ${code}` });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback({});
    if (!authName.trim() || !authEmail.trim() || !authPassword) {
      setAuthFeedback({ error: 'Please fill in all registration fields.' });
      return;
    }
    const role: 'owner' | 'customer' = (authEmail.toLowerCase().includes('marjon') || authEmail.toLowerCase() === 'engineersealza@gmail.com') ? 'owner' : 'customer';
    const user: AuthUser = {
      name: authName.trim(),
      email: authEmail.trim(),
      role
    };
    setPendingUser(user);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpected2FA(code);
    setTwoFactorCode('');
    setAuthTab('2fa');
    setAuthFeedback({ success: `Account prepared! Enter the 6-digit TOTP code (${code}) to finalize 2FA setup.` });
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.trim() !== expected2FA.trim()) {
      setAuthFeedback({ error: 'Invalid 2FA code. Please verify the 6-digit security code.' });
      return;
    }
    if (pendingUser) {
      setAuthUser(pendingUser);
      setStoreUnlocked(false);
      try {
        sessionStorage.setItem('ms-auth-user', JSON.stringify(pendingUser));
        sessionStorage.removeItem('ms-store-unlocked');
      } catch { /* ignore */ }
    }
    setAuthTab('login');
    setAuthFeedback({ success: 'Two-factor authentication verified! Click the "✦ EXPLORE STORE ✦" button below to unlock access.' });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthFeedback({ error: 'Please enter your registered email address.' });
      return;
    }
    const token = `RST-${Math.floor(1000 + Math.random() * 9000)}`;
    setExpectedToken(token);
    setRecoveryToken(token);
    setAuthFeedback({ success: `Recovery code generated for ${authEmail}: ${token}` });
    setAuthTab('renew');
  };

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryToken.trim() !== expectedToken.trim()) {
      setAuthFeedback({ error: 'Invalid recovery token.' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setAuthFeedback({ error: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAuthFeedback({ error: 'Passwords do not match.' });
      return;
    }
    setAuthPassword(newPassword);
    setAuthFeedback({ success: 'Password renewed successfully! Please sign in with your new credentials.' });
    setAuthTab('login');
  };

  const handleSignOut = () => {
    setAuthUser(null);
    setStoreUnlocked(false);
    try {
      sessionStorage.removeItem('ms-auth-user');
      sessionStorage.removeItem('ms-store-unlocked');
    } catch { /* ignore */ }
    setAuthFeedback({ success: 'Signed out. The store is now locked.' });
  };

  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="/" aria-label="Marjon Sealza home">
        <span className="brand-mark" style={{ borderColor: isStoreMode ? '#ec4899' : '#22d3ee', color: isStoreMode ? '#ec4899' : '#22d3ee' }}>MS</span>
        <span>MARJON SEALZA<small style={{ color: isStoreMode ? '#fb7185' : '#22d3ee' }}>{isStoreMode ? 'EANUXX EMPORIUM · STORE' : 'COMPUTER ENGINEER · BATAAN'}</small></span>
      </a>

      {/* Segmented Two-Way Switcher */}
      <div className="mode-switcher" aria-label="Edition Switcher">
        <button
          className={`mode-btn ${!isStoreMode ? 'active' : ''}`}
          style={!isStoreMode ? { background: '#22d3ee', color: '#070a13' } : {}}
          onClick={() => switchMode('life')}
          title="Switch to Marjon Sealza Computer Engineering Portfolio"
        >
          01 LIFE
        </button>
        <button
          className={`mode-btn ${isStoreMode ? 'active' : ''}`}
          style={isStoreMode ? { background: '#ec4899', color: '#ffffff' } : {}}
          onClick={() => switchMode('store')}
          title="Switch to Eanuxx Emporium Store"
        >
          02 STORE
        </button>
      </div>

      <nav aria-label="Main navigation">
        {!isStoreMode ? (
          <>
            <a href="/#about">About</a>
            <a href="/#pillars">Expertise</a>
            <a href="/#experience">Experience</a>
            <a href="/#education">Education</a>
            <a href="/#projects">Projects</a>
            <a href="/#vlogs">Vlogs</a>
            <a href="/#socials">Socials</a>
            <a href="/#contact">Contact</a>
            <a href="/store">Store</a>
            <a href="/checkout">Checkout</a>
          </>
        ) : (
          <>
            <button className="button button-small button-ghost" style={{ padding: '6px 12px' }} onClick={() => switchMode('life')}>
              ← Switch to Life Edition
            </button>
            <a href="/store">Store</a>
            <a href="/checkout">Checkout</a>
            {authUser ? (
              <span
                className="auth-chip"
                style={{
                  border: `1px solid ${storeUnlocked ? '#10b981' : '#38bdf8'}`,
                  color: storeUnlocked ? '#34d399' : '#38bdf8',
                  cursor: 'pointer'
                }}
                onClick={() => { switchMode('store'); scrollToAuth(); }}
                title="Click to view Account / Explore Store"
              >
                ● {authUser.name.split(' ')[0]} ({storeUnlocked ? 'Unlocked' : '2FA Verified'})
              </span>
            ) : (
              <button
                className="button button-small"
                style={{ background: '#ec4899', color: '#fff', padding: '6px 12px', border: 'none' }}
                onClick={() => { switchMode('store'); scrollToAuth(); }}
              >
                Sign In / 2FA
              </button>
            )}
          </>
        )}
      </nav>
    </header>

    <main>
      {page === 'cancel' && (
        <section className="notice-panel">
          <h2>Checkout cancelled</h2>
          <p>Your order has not been marked as paid. You can return to the store and try again.</p>
          <a className="button" href="/store">Return to store</a>
        </section>
      )}

      {page === 'success' ? (
        <section className="notice-panel">
          <h2>Payment status</h2>
          {orderLoading ? (
            <p>Checking the latest order status…</p>
          ) : order ? (
            <>
              <p>Reference: <strong>{order.referenceNumber}</strong></p>
              <p>Total: <strong>{money(order.totalAmount)}</strong></p>
              <p>Status: <span className={`status status-${order.status}`}>{order.status}</span></p>
              {order.status === 'paid' ? (
                <p>Payment is confirmed. Thank you for your order.</p>
              ) : (
                <p>Payment is not yet confirmed. This page does not confirm payment by itself; status updates when the verified PayMongo webhook is received.</p>
              )}
            </>
          ) : (
            <p>Payment confirmation is being checked. If it remains pending, contact support with your order reference.</p>
          )}
          <a className="button" href="/store">Continue browsing</a>
        </section>
      ) : null}

      {/* =========================================================================
          LIFE MODE: MARJON SEALZA OFFICIAL COMPUTER ENGINEER PORTFOLIO
          (Based on marjonsealza.life · Facebook @eanuxx · Zero Store Elements)
          ========================================================================= */}
      {!standaloneStore && !standaloneCheckout && <>
        {!isStoreMode && (
          <div className="life-container">
            {/* HERO SECTION — MARJONSEALZA.LIFE DESIGN */}
            <section className="hero" style={{ minHeight: '520px', padding: '60px 0 80px' }}>
              <div className="hero-copy">
                <p className="eyebrow" style={{ color: '#22d3ee' }}>COMPUTER ENGINEER · BATAAN, PHILIPPINES</p>
                <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', lineHeight: 1.05, margin: '0 0 20px', letterSpacing: '-0.04em' }}>
                  Marjon Sealza<br />
                  <span style={{ color: '#38bdf8' }}>“Turning ideas into useful digital solutions.”</span>
                </h1>
                <p className="muted" style={{ maxWidth: '520px', lineHeight: 1.8 }}>
                  Computer Engineer with 6+ years of specialized experience architecting reliable full-stack applications, high-concurrency cloud systems, and edge automation. Based in Bataan, Philippines.
                </p>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                  <a href="https://www.youtube.com/@marjon_human" target="_blank" rel="noopener noreferrer" className="social-hero-badge" style={{ background: '#dc2626' }}>
                    <span>▶</span> YouTube @marjon_human
                  </a>
                  <a href="https://x.com/eanuxx" target="_blank" rel="noopener noreferrer" className="social-hero-badge" style={{ background: '#0f172a' }}>
                    <span>𝕏</span> @eanuxx
                  </a>
                  <a href="https://www.facebook.com/eanuxx" target="_blank" rel="noopener noreferrer" className="social-hero-badge" style={{ background: '#1877f2' }}>
                    <span>f</span> Facebook @eanuxx
                  </a>
                  <a href="https://www.instagram.com/eanuxx" target="_blank" rel="noopener noreferrer" className="social-hero-badge" style={{ background: '#db2777' }}>
                    <span>📸</span> @eanuxx
                  </a>
                  <a href="https://www.tiktok.com/@marjon.mb" target="_blank" rel="noopener noreferrer" className="social-hero-badge" style={{ background: '#0891b2' }}>
                    <span>♬</span> TikTok @marjon.mb
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                  <a className="button" style={{ background: '#22d3ee', color: '#070a13' }} href="#vlogs">
                    ▶ Watch Video Vlogs
                  </a>
                  <a className="button button-ghost" href="#projects">
                    View Engineering Works
                  </a>
                  <a className="button button-ghost" href="#contact">
                    Get in Touch
                  </a>
                </div>

                <div className="stats-row" style={{ marginTop: '35px' }}>
                  <div className="stat-item" style={{ background: '#090d19', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="stat-number" style={{ color: '#22d3ee' }}>BSCpE</div>
                    <div className="stat-label">Computer Engineering</div>
                  </div>
                  <div className="stat-item" style={{ background: '#090d19', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="stat-number" style={{ color: '#34d399' }}>6+ Yrs</div>
                    <div className="stat-label">Engineering Systems</div>
                  </div>
                  <div className="stat-item" style={{ background: '#090d19', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="stat-number" style={{ color: '#f59e0b' }}>Bataan</div>
                    <div className="stat-label">Origin & Headquarters</div>
                  </div>
                </div>
              </div>

              {/* Code Terminal Widget */}
              <div className="code-terminal">
                <div className="terminal-header">
                  <div className="terminal-dot red"></div>
                  <div className="terminal-dot yellow"></div>
                  <div className="terminal-dot green"></div>
                  <span className="terminal-title">marjon_sealza.ts</span>
                </div>
                <pre style={{ margin: 0, color: '#cbd5e1', overflowX: 'auto' }}>
{`const engineer = {
  name: 'Marjon Sealza',
  title: 'Computer Engineer',
  origin: 'Bataan, Philippines',
  primaryHandle: '@eanuxx',
  education: 'BS Computer Engineering · Eastwoods (2015-2020)',
  verifiedCreatorProfiles: {
    youtube: '@marjon_human',
    x_twitter: '@eanuxx',
    facebook: '@eanuxx',
    instagram: '@eanuxx',
    tiktok: '@marjon.mb',
    website: 'https://www.marjonsealza.life'
  },
  domains: [
    'Web & Full-Stack Systems',
    'Cloud Architecture (Cloudflare Workers, D1)',
    'Microprocessors & Robotics (Arduino Mega 2560)',
    'Systems & Automation'
  ],
  email: 'engineersealza@gmail.com',
  mindset: '#bigthinking #growth #fearless'
};`}
                </pre>
              </div>
            </section>

            {/* ABOUT & 3 CORE ENGINEERING PILLARS */}
            <section id="about" className="content-section about-grid">
              <div>
                <p className="eyebrow" style={{ color: '#22d3ee' }}>ABOUT MARJON SEALZA</p>
                <h2>Engineering foundation with practical business execution.</h2>
                <div className="signature-font" style={{ margin: '10px 0 16px' }}>
                  Marjon Sealza
                </div>
                <p className="muted">
                  I am a Computer Engineer based in Bataan, Philippines. My work focuses on solving real-world challenges through resilient software architectures, low-level hardware design, and cloud-native digital platforms.
                </p>
              </div>
              <div>
                <p className="muted" style={{ lineHeight: 1.8 }}>
                  Grounded in rigorous hardware fundamentals from Eastwoods Professional College of Science and Technology, I build systems that operate reliably at scale. From microcontrollers and linear actuator safety loops to high-throughput serverless APIs on Cloudflare Workers, each solution is built with purpose.
                </p>
                <div className="skills-wrap" style={{ marginTop: '20px' }}>
                  <span className="skill-pill">TypeScript & JavaScript (ES6+)</span>
                  <span className="skill-pill">React & Next.js</span>
                  <span className="skill-pill">Node.js & Express</span>
                  <span className="skill-pill">Cloudflare Workers & D1</span>
                  <span className="skill-pill">Tailwind CSS</span>
                  <span className="skill-pill">MongoDB & SQL</span>
                  <span className="skill-pill">Arduino C++</span>
                  <span className="skill-pill">Microprocessors</span>
                  <span className="skill-pill">Systems Architecture</span>
                </div>
              </div>
            </section>

            {/* 3 CORE PILLARS */}
            <section id="pillars" className="content-section">
              <p className="eyebrow" style={{ color: '#22d3ee' }}>CORE DISCIPLINES</p>
              <h2>Pillars of Engineering</h2>
              <div className="pillar-grid">
                <div className="pillar-card">
                  <span className="card-number" style={{ color: '#22d3ee' }}>01 // FOUNDATION</span>
                  <h3>Computer Engineering Foundation</h3>
                  <p>Hardware understanding blended with modern software architecture, low-level microcontroller systems, sensor loops, and circuit design.</p>
                </div>
                <div className="pillar-card">
                  <span className="card-number" style={{ color: '#34d399' }}>02 // ARCHITECTURE</span>
                  <h3>Full-Stack & Cloud Systems</h3>
                  <p>Scalable web applications, high-concurrency APIs, distributed edge databases, and resilient cloud integration architectures.</p>
                </div>
                <div className="pillar-card">
                  <span className="card-number" style={{ color: '#f59e0b' }}>03 // AUTOMATION</span>
                  <h3>System & Process Automation</h3>
                  <p>Automating complex operational pipelines, point-of-sale inventory tracking, and deterministic diagnostic audit logs.</p>
                </div>
              </div>
            </section>

            {/* EXPERIENCE & CAREER TRAJECTORY */}
            <section id="experience" className="content-section">
              <p className="eyebrow" style={{ color: '#22d3ee' }}>CAREER TRAJECTORY</p>
              <h2>Professional Experience</h2>

              <div style={{ marginTop: '25px' }}>
                <div className="exp-card">
                  <div>
                    <span className="card-number" style={{ color: '#34d399' }}>PRESENT ROLE</span>
                    <h3 style={{ margin: '6px 0 4px', fontSize: '18px' }}>Lead Full-Stack & Cloud Systems Engineer</h3>
                    <p style={{ color: 'var(--accent2)', margin: '0 0 10px', fontSize: '13px' }}>
                      Sealza Software Solutions / Enterprise Clients · Remote
                    </p>
                    <p className="muted" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                      Architecting distributed web applications, serverless edge functions, real-time telemetry, and high-concurrency cloud pipelines.
                    </p>
                    <div className="skills-wrap" style={{ marginTop: '12px' }}>
                      <span className="tag">React</span>
                      <span className="tag">TypeScript</span>
                      <span className="tag">Cloudflare Workers</span>
                      <span className="tag">Node.js</span>
                      <span className="tag">MongoDB</span>
                      <span className="tag">Tailwind CSS</span>
                    </div>
                  </div>
                  <div className="exp-period">2023 – PRESENT</div>
                </div>

                <div className="exp-card">
                  <div>
                    <span className="card-number" style={{ color: '#22d3ee' }}>ENGINEERING & OPERATIONS</span>
                    <h3 style={{ margin: '6px 0 4px', fontSize: '18px' }}>Computer Engineering Systems Consultant</h3>
                    <p style={{ color: 'var(--accent2)', margin: '0 0 10px', fontSize: '13px' }}>
                      Technology Advisory & Hardware Integration · Bataan, Philippines
                    </p>
                    <p className="muted" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                      Applied microcontroller firmware engineering, inventory automation systems, and executive technical decision consulting.
                    </p>
                    <div className="skills-wrap" style={{ marginTop: '12px' }}>
                      <span className="tag">Arduino C++</span>
                      <span className="tag">Microprocessors</span>
                      <span className="tag">System Design</span>
                      <span className="tag">Inventory Logic</span>
                    </div>
                  </div>
                  <div className="exp-period">2018 – 2023</div>
                </div>
              </div>
            </section>

            {/* EDUCATION & CREDENTIALS */}
            <section id="education" className="content-section">
              <p className="eyebrow" style={{ color: '#22d3ee' }}>ACADEMIC FORMATION</p>
              <h2>Education & Institutional Honors</h2>

              <div className="exp-card" style={{ marginTop: '25px', borderColor: 'rgba(34,211,238,0.2)' }}>
                <div>
                  <span className="card-number" style={{ color: '#22d3ee' }}>DEGREE QUALIFICATION</span>
                  <h3 style={{ margin: '8px 0 4px', fontSize: '20px' }}>Bachelor of Science in Computer Engineering (BSCpE)</h3>
                  <p style={{ color: '#38bdf8', margin: '0 0 12px', fontSize: '14px' }}>
                    Eastwoods Professional College of Science and Technology (EPCST)
                  </p>
                  <p className="muted" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                    Honors: <strong>Excellence in Computer Engineering & Systems Design</strong>
                  </p>
                  <p className="muted" style={{ fontSize: '13px', lineHeight: 1.7, marginTop: '8px' }}>
                    Coursework: Computer Systems Architecture, Microprocessors & Embedded Systems, Circuit Simulation, Object-Oriented Software Design, Engineering Mathematics.
                  </p>
                </div>
                <div className="exp-period" style={{ color: '#34d399', background: 'rgba(16,185,129,0.1)' }}>2015 – 2020</div>
              </div>
            </section>

            {/* VERIFIED PROJECTS SHOWCASE */}
            <section id="projects" className="content-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow" style={{ color: '#22d3ee' }}>PORTFOLIO OF WORK</p>
                  <h2>Featured Engineering Solutions</h2>
                  <p className="muted">Verified software, system architectures, and embedded hardware solutions.</p>
                </div>
              </div>

              <div className="project-grid">
                {FEATURED_PROJECTS.map(proj => (
                  <div className="project-card" key={proj.id} style={{ background: '#090d19', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div>
                      <span className="card-number" style={{ color: '#22d3ee' }}>{proj.id} // {proj.category}</span>
                      <h3 style={{ marginTop: '8px' }}>{proj.title}</h3>
                      <p>{proj.description}</p>
                    </div>
                    <div>
                      <div className="project-tags">
                        {proj.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* VIDEO TRANSMISSIONS & VLOGS (YouTube @marjon_human & TikTok @marjon.mb) */}
            <section id="vlogs" className="content-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow" style={{ color: '#ef4444' }}>VIDEO TRANSMISSIONS & VLOGS</p>
                  <h2>Engineering Chronicles & Tech Vlogs</h2>
                  <p className="muted">Official video broadcasts from YouTube <strong>@marjon_human</strong> and short-form hardware reels from TikTok <strong>@marjon.mb</strong>.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="https://www.youtube.com/@marjon_human"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-small"
                    style={{ background: '#dc2626', color: '#fff', border: 'none' }}
                  >
                    ▶ Subscribe on YouTube
                  </a>
                  <a
                    href="https://www.tiktok.com/@marjon.mb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-small button-ghost"
                  >
                    ♬ TikTok @marjon.mb
                  </a>
                </div>
              </div>

              {/* Channel Stats & Featured Kicker Banner */}
              <div className="vlog-channel-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 900, flexShrink: 0 }}>
                    ▶
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                      Primary Video Transmission Hub
                    </span>
                    <h3 style={{ margin: '2px 0 4px', fontSize: '18px' }}>YouTube Channel: @marjon_human</h3>
                    <p className="muted" style={{ fontSize: '12px', margin: 0 }}>
                      Hardware robotics demonstrations, linear actuator synchronization, full-stack systems engineering, and lab builds.
                    </p>
                  </div>
                </div>
                <div>
                  <a
                    href="https://www.youtube.com/@marjon_human"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-small"
                    style={{ background: '#dc2626', color: '#fff', border: 'none' }}
                  >
                    Open YouTube Channel ↗
                  </a>
                </div>
              </div>

              {/* Vlog Cards Grid */}
              <div className="vlog-grid">
                {FEATURED_VLOGS.map(vlog => (
                  <article
                    key={vlog.id}
                    className="vlog-card"
                    onClick={() => setSelectedVlog(vlog)}
                    title={`Click to view ${vlog.title}`}
                  >
                    <div className="vlog-thumb" style={{ background: vlog.thumbnailGradient }}>
                      <div className="vlog-play-icon">▶</div>
                      <div className="vlog-badges-bar">
                        <span className="vlog-duration-badge">⏱ {vlog.duration}</span>
                        <span className="vlog-res-badge">{vlog.resolution}</span>
                      </div>
                    </div>
                    <div className="vlog-content">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            color: vlog.platform === 'YouTube' ? '#f87171' : '#38bdf8'
                          }}>
                            {vlog.platform === 'YouTube' ? '▶ YOUTUBE' : '♬ TIKTOK'} · {vlog.channelHandle}
                          </span>
                          <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                            {vlog.id}
                          </span>
                        </div>
                        <h3>{vlog.title}</h3>
                        <p>{vlog.description}</p>
                      </div>

                      <div>
                        <div className="project-tags" style={{ marginBottom: '14px' }}>
                          {vlog.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                        <div className="vlog-footer">
                          <button
                            type="button"
                            className="button button-small"
                            style={{ background: '#22d3ee', color: '#070a13', border: 'none' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVlog(vlog);
                            }}
                          >
                            Watch Episode Details
                          </button>
                          <a
                            href={vlog.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button-small button-ghost"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open {vlog.platform} ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* CREATOR NETWORK & SOCIAL MEDIA ECOSYSTEM */}
            <section id="socials" className="content-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow" style={{ color: '#38bdf8' }}>CREATOR NETWORK & VERIFIED PROPERTIES</p>
                  <h2>Official Social Media Ecosystem</h2>
                  <p className="muted">Verified creator accounts and web properties for Marjon Sealza based on Google Search Console Insights.</p>
                </div>
              </div>

              <div className="social-grid">
                {SOCIAL_PROFILES.map(social => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-card"
                    style={{ '--social-color': social.color } as React.CSSProperties}
                  >
                    <div>
                      <div className="social-card-top">
                        <div className="social-icon-circle" style={{ background: `${social.color}20`, color: social.color, border: `1px solid ${social.color}40` }}>
                          {social.icon}
                        </div>
                        <div>
                          <div className="social-handle-text">{social.handle}</div>
                          <span style={{ fontSize: '11px', color: social.color, fontWeight: 700 }}>
                            {social.platform}
                          </span>
                        </div>
                      </div>
                      <p className="social-role-text">{social.role}</p>
                    </div>
                    <div className="social-link-action" style={{ color: social.color }}>
                      Visit {social.name} →
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* DIRECT CONTACT & COMMUNICATIONS (Zero Store Mention) */}
            <section id="contact" className="content-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow" style={{ color: '#22d3ee' }}>LET'S CONNECT</p>
                  <h2>Get in Touch with Marjon Sealza</h2>
                  <p className="muted">Reach out for engineering contracts, systems architecture consulting, or technical inquiries.</p>
                </div>
              </div>

              <div className="contact-layout">
                <div className="contact-info" style={{ background: '#090d19', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="contact-item">
                    <strong>Direct Email</strong>
                    <a href="mailto:engineersealza@gmail.com" style={{ color: '#38bdf8' }}>engineersealza@gmail.com</a>
                  </div>
                  <div className="contact-item">
                    <strong>YouTube Channel</strong>
                    <a href="https://www.youtube.com/@marjon_human" target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444' }}>youtube.com/@marjon_human</a>
                  </div>
                  <div className="contact-item">
                    <strong>X (Twitter)</strong>
                    <a href="https://x.com/eanuxx" target="_blank" rel="noopener noreferrer" style={{ color: '#e2e8f0' }}>x.com/eanuxx</a>
                  </div>
                  <div className="contact-item">
                    <strong>Official Facebook</strong>
                    <a href="https://www.facebook.com/eanuxx" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}>facebook.com/eanuxx</a>
                  </div>
                  <div className="contact-item">
                    <strong>Instagram</strong>
                    <a href="https://www.instagram.com/eanuxx" target="_blank" rel="noopener noreferrer" style={{ color: '#ec4899' }}>instagram.com/eanuxx</a>
                  </div>
                  <div className="contact-item">
                    <strong>TikTok</strong>
                    <a href="https://www.tiktok.com/@marjon.mb" target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>tiktok.com/@marjon.mb</a>
                  </div>
                  <div className="contact-item">
                    <strong>Verified Domain</strong>
                    <a href="https://www.marjonsealza.life" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981' }}>marjonsealza.life</a>
                  </div>
                  <div className="contact-item">
                    <strong>Location</strong>
                    <p>Bataan, Philippines · Remote Global Availability</p>
                  </div>
                  <div className="contact-item">
                    <strong>Degree & Institutional Background</strong>
                    <p>BSCpE · Eastwoods Professional College of Science and Tech</p>
                  </div>
                </div>

                <form className="checkout-form" style={{ background: '#090d19', borderColor: 'rgba(255,255,255,0.08)' }} onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); }}>
                  <h3>Send a message to Marjon</h3>
                  {contactSuccess ? (
                    <div className="notice-panel" style={{ background: 'rgba(34,211,238,0.1)', borderColor: '#22d3ee' }}>
                      <p style={{ color: '#22d3ee', fontWeight: 700 }}>Transmission received!</p>
                      <p>Thank you! Marjon Sealza has received your transmission and will review your requirements within 24 hours.</p>
                    </div>
                  ) : (
                    <>
                      <label>Your Name<input required value={contactState.name} onChange={e => setContactState({ ...contactState, name: e.target.value })} /></label>
                      <label>Your Email<input required type="email" value={contactState.email} onChange={e => setContactState({ ...contactState, email: e.target.value })} /></label>
                      <label>Project / Inquiry Scope<input required value={contactState.projectType} onChange={e => setContactState({ ...contactState, projectType: e.target.value })} /></label>
                      <label>Message<textarea required rows={4} style={{ width: '100%', background: '#070a13', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', color: '#fff' }} value={contactState.message} onChange={e => setContactState({ ...contactState, message: e.target.value })} /></label>
                      <button type="submit" className="button button-wide" style={{ background: '#22d3ee', color: '#070a13' }}>Send Transmission</button>
                    </>
                  )}
                </form>
              </div>
            </section>
          </div>
        )}
      </>}

      {/* =========================================================================
          STORE MODE: EANUXX EMPORIUM · SHOPEE-STYLE BLUE, GREEN & PINK LANDING
          (Visible only when switching to STORE or visiting /store /checkout)
          ========================================================================= */}
      {!standaloneCheckout && <section id="store" className="content-section store-section" style={{ display: isStoreMode ? 'block' : 'none' }}>
        
        {/* SHOPEE-STYLE STORE LOGIN LANDING (BLUE, GREEN & PINK THEME) */}
        <div className="shopee-hero" id="store-login-landing">
          <div className="shopee-grid">
            {/* Left Column: Shopee Banner, Vouchers & Guarantees */}
            <div>
              <div className="shopee-kicker">
                <span></span> MEGA STORE OPENING · EANUXX EMPORIUM 2026
              </div>
              <h1 className="shopee-title">
                The Whole Store is <span className="pink-txt">Locked</span>.<br />
                <span className="blue-txt">Sign In with 2FA</span> to <span className="green-txt">Unlock Access</span>.
              </h1>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.7, maxWidth: '480px' }}>
                Welcome to Eanuxx Emporium. To maintain collector integrity and direct advisory verification, the entire store catalog and checkout are gated. Create an account or sign in with Two-Factor Authentication to unlock all inside products and services.
              </p>

              {/* Shopee Vouchers Row */}
              <div className="vouchers-row">
                <div className="voucher-card pink-voucher">
                  <strong>₱500 OFF</strong>
                  <small>Min. Spend ₱2,500</small>
                </div>
                <div className="voucher-card green-voucher">
                  <strong>FREE COURIER</strong>
                  <small>All Physical Tangibles</small>
                </div>
                <div className="voucher-card blue-voucher">
                  <strong>1-ON-1 PRIORITY</strong>
                  <small>Systems Consultation</small>
                </div>
              </div>

              {/* Trust Seals Bar */}
              <div className="trust-seals">
                <span className="trust-seal pink">★ 100% Authentic Tangibles</span>
                <span className="trust-seal green">🛡 Cloudflare D1 Security</span>
                <span className="trust-seal blue">⚡ PayMongo Hosted Checkout</span>
              </div>
            </div>

            {/* Right Column: Shopee-Style Auth Box */}
            <div className="shopee-auth-box">
              {authUser ? (
                /* Authenticated State: Explore Store Button Triggers Inside Access */
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{
                    display: 'inline-block',
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: storeUnlocked ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)',
                    border: `2px solid ${storeUnlocked ? '#10b981' : '#38bdf8'}`,
                    color: storeUnlocked ? '#10b981' : '#38bdf8',
                    fontSize: '24px',
                    lineHeight: '48px',
                    margin: '0 auto 12px'
                  }}>
                    {storeUnlocked ? '✓' : '✦'}
                  </div>
                  <span className="eyebrow" style={{ color: storeUnlocked ? '#10b981' : '#38bdf8' }}>
                    {storeUnlocked ? 'INSIDE STORE UNLOCKED & ACTIVE' : '2FA AUTHENTICATED VIP MEMBER'}
                  </span>
                  <h3 style={{ margin: '6px 0 8px', fontSize: '20px' }}>Welcome, {authUser.name}!</h3>
                  <p className="muted" style={{ fontSize: '12px', marginBottom: '18px', lineHeight: 1.6 }}>
                    {storeUnlocked
                      ? `Your session is verified with Two-Factor Authentication (${authUser.role.toUpperCase()}). The full store is completely unlocked! You can now add items to cart, manage orders, and checkout.`
                      : `You have successfully authenticated with 2FA (${authUser.role.toUpperCase()}). The store remains locked until you click the button below to enter!`}
                  </p>

                  <button
                    className="explore-store-btn"
                    style={{ width: '100%', marginBottom: '10px', fontSize: '14px', padding: '14px' }}
                    onClick={() => {
                      setStoreUnlocked(true);
                      try { sessionStorage.setItem('ms-store-unlocked', 'true'); } catch { /* ignore */ }
                      setAuthFeedback({ success: '✦ Store access unlocked! Welcome inside Eanuxx Emporium.' });
                      const el = document.getElementById('catalog-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {storeUnlocked ? '✦ EXPLORE STORE (ACTIVE) · VIEW INSIDE COLLECTION ↓ ✦' : '✦ EXPLORE STORE (CLICK TO UNLOCK ACCESS) ✦'}
                  </button>

                  <button
                    className="button button-small button-ghost"
                    style={{ width: '100%', marginTop: '6px' }}
                    onClick={handleSignOut}
                  >
                    Lock Store & Sign Out
                  </button>
                </div>
              ) : (
                /* Unauthenticated State: Sign In / Sign Up / 2FA / Password Tabs */
                <div>
                  {/* Tabs */}
                  <div className="shopee-tabs">
                    <button
                      className={`shopee-tab ${authTab === 'login' ? 'active pink-tab' : ''}`}
                      onClick={() => { setAuthFeedback({}); setAuthTab('login'); }}
                    >
                      SIGN IN
                    </button>
                    <button
                      className={`shopee-tab ${authTab === 'signup' ? 'active green-tab' : ''}`}
                      onClick={() => { setAuthFeedback({}); setAuthTab('signup'); }}
                    >
                      NEW SIGN UP
                    </button>
                  </div>

                  {/* Feedback Banners */}
                  {authFeedback.error && (
                    <div style={{ background: '#290f19', border: '1px solid #ec4899', padding: '10px 12px', borderRadius: '8px', color: '#fca5a5', fontSize: '12px', marginBottom: '14px' }}>
                      {authFeedback.error}
                    </div>
                  )}
                  {authFeedback.success && (
                    <div style={{ background: '#0b261a', border: '1px solid #10b981', padding: '10px 12px', borderRadius: '8px', color: '#6ee7b7', fontSize: '12px', marginBottom: '14px' }}>
                      {authFeedback.success}
                    </div>
                  )}

                  {/* TAB 1: SIGN IN */}
                  {authTab === 'login' && (
                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                      <label>
                        Email Address
                        <input
                          required
                          type="email"
                          placeholder="name@example.com"
                          value={authEmail}
                          onChange={e => setAuthEmail(e.target.value)}
                        />
                      </label>
                      <label>
                        Passphrase
                        <input
                          required
                          type="password"
                          placeholder="••••••••"
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                        />
                      </label>

                      <button type="submit" className="shopee-btn-pink">
                        Sign In & Proceed to 2FA →
                      </button>

                      <div className="auth-links">
                        <button type="button" onClick={() => { setAuthFeedback({}); setAuthTab('forgot'); }}>
                          Forgot password?
                        </button>
                        <button type="button" onClick={() => { setAuthFeedback({}); setAuthTab('signup'); }}>
                          Create free account
                        </button>
                      </div>
                    </form>
                  )}

                  {/* TAB 2: SIGN UP */}
                  {authTab === 'signup' && (
                    <form className="auth-form" onSubmit={handleSignupSubmit}>
                      <label>
                        Full Name
                        <input
                          required
                          placeholder="Maria Santos"
                          value={authName}
                          onChange={e => setAuthName(e.target.value)}
                        />
                      </label>
                      <label>
                        Email Address
                        <input
                          required
                          type="email"
                          placeholder="maria@example.com"
                          value={authEmail}
                          onChange={e => setAuthEmail(e.target.value)}
                        />
                      </label>
                      <label>
                        Passphrase
                        <input
                          required
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                        />
                      </label>

                      <button type="submit" className="shopee-btn-green">
                        Register Account & Setup 2FA ✦
                      </button>

                      <div className="auth-links">
                        <button type="button" onClick={() => { setAuthFeedback({}); setAuthTab('login'); }}>
                          Already have an account? Sign In
                        </button>
                      </div>
                    </form>
                  )}

                  {/* TAB 3: 2-FACTOR AUTHENTICATION (2FA) */}
                  {authTab === '2fa' && (
                    <div>
                      <span className="eyebrow" style={{ color: '#38bdf8' }}>SECURITY CHECKPOINT</span>
                      <h4 style={{ margin: '4px 0 10px', fontSize: '15px' }}>Verify 6-Digit TOTP Code</h4>
                      <p className="muted" style={{ fontSize: '11px', margin: '0 0 10px' }}>
                        Authenticating {pendingUser?.email} ({pendingUser?.role.toUpperCase()}).
                      </p>

                      <div className="two-factor-display" style={{ border: '1px dashed #38bdf8' }}>
                        <span style={{ fontSize: '10px', color: '#93c5fd', display: 'block' }}>
                          Generated 2FA Code (Auto-Detected)
                        </span>
                        <div className="two-factor-code" style={{ color: '#38bdf8' }}>{expected2FA}</div>
                        <button
                          type="button"
                          className="button button-small button-ghost"
                          style={{ marginTop: '6px', padding: '3px 8px', fontSize: '10px' }}
                          onClick={() => setTwoFactorCode(expected2FA)}
                        >
                          Auto-Fill Code
                        </button>
                      </div>

                      <form className="auth-form" onSubmit={handle2FASubmit}>
                        <input
                          required
                          maxLength={6}
                          className="two-factor-input"
                          placeholder="000000"
                          value={twoFactorCode}
                          onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                        />

                        <button type="submit" className="shopee-btn-blue">
                          Verify 2FA & Unlock Store ✦
                        </button>

                        <div className="auth-links">
                          <button type="button" onClick={() => setAuthTab('login')}>
                            ← Cancel & Back to Sign In
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* TAB 4: FORGOT PASSWORD */}
                  {authTab === 'forgot' && (
                    <div>
                      <span className="eyebrow" style={{ color: '#ec4899' }}>ACCOUNT RECOVERY</span>
                      <h4 style={{ margin: '4px 0 10px', fontSize: '15px' }}>Reset Passphrase</h4>
                      <form className="auth-form" onSubmit={handleForgotSubmit}>
                        <label>
                          Enter Registered Email
                          <input
                            required
                            type="email"
                            placeholder="your-email@example.com"
                            value={authEmail}
                            onChange={e => setAuthEmail(e.target.value)}
                          />
                        </label>
                        <button type="submit" className="shopee-btn-pink">
                          Generate Recovery Code →
                        </button>
                        <div className="auth-links">
                          <button type="button" onClick={() => setAuthTab('login')}>
                            ← Back to Sign In
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* TAB 5: RENEW / RESET PASSWORD */}
                  {authTab === 'renew' && (
                    <div>
                      <span className="eyebrow" style={{ color: '#10b981' }}>NEW PASSPHRASE</span>
                      <h4 style={{ margin: '4px 0 10px', fontSize: '15px' }}>Renew Account Access</h4>
                      <form className="auth-form" onSubmit={handleRenewSubmit}>
                        <label>
                          Recovery Token
                          <input
                            required
                            value={recoveryToken}
                            onChange={e => setRecoveryToken(e.target.value)}
                          />
                        </label>
                        <label>
                          New Passphrase
                          <input
                            required
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                          />
                        </label>
                        <label>
                          Confirm New Passphrase
                          <input
                            required
                            type="password"
                            placeholder="Repeat passphrase"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                          />
                        </label>
                        <button type="submit" className="shopee-btn-green">
                          Renew Password & Sign In ✦
                        </button>
                        <div className="auth-links">
                          <button type="button" onClick={() => setAuthTab('login')}>
                            ← Back to Sign In
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CATALOG HEADER & SEARCH */}
        <div className="section-heading" id="catalog-grid">
          <div>
            <p className="eyebrow" style={{ color: (authUser && storeUnlocked) ? '#10b981' : '#ec4899' }}>
              {(authUser && storeUnlocked) ? '✦ INSIDE CATALOG (UNLOCKED & ACTIVE) ✦' : 'CATALOG PREVIEW (VIEWING ONLY · STORE LOCKED)'}
            </p>
            <h2>Products & Services Collection</h2>
            <p className="muted">
              {(authUser && storeUnlocked) ? (
                'Full inside ordering access is active. Click "Add to cart" on any available item to prepare your order.'
              ) : (
                'Catalog is currently locked for viewing only. Sign in above with 2FA and click "Explore Store" to unlock cart, checkout, and direct courier fulfillment.'
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="button button-small button-ghost" onClick={() => switchMode('life')}>
              ← Switch to Life Edition
            </button>
            <div className="cart-badge">
              <a href="/checkout" style={{ color: 'inherit' }}>Cart · {cartItems.reduce((n, i) => n + i.quantity, 0)} items</a>
            </div>
          </div>
        </div>

        {/* Store Controls: Category Filter & Search */}
        <div className="store-controls">
          <div className="filter-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="store-search">
            <input
              type="search"
              placeholder="Search catalog products…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading products…</p>
        ) : error && (!products || !products.length) ? (
          <p className="error">{error}</p>
        ) : (!products || products.length === 0) ? (
          <p className="muted">No products are published yet. Add products to the server-side catalog to display them here.</p>
        ) : filteredProducts.length === 0 ? (
          <div className="notice-panel">
            <p>No products match "{searchQuery}" in category "{activeCategory}".</p>
            <button className="button button-small" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => {
              const isUnlocked = Boolean(authUser && storeUnlocked);
              return (
                <article className={`product-card ${!isUnlocked ? 'locked-card' : ''}`} key={product.id}>
                  {!isUnlocked && <span className="locked-badge-pill">🔒 STORE LOCKED</span>}
                  <div className="product-art" onClick={() => setSelectedProduct(product)} title="Click for details">
                    <span>{product.category.toUpperCase()}</span>
                    <div>{product.name.slice(0, 1)}</div>
                    <span className="quick-view-hint">Quick View</span>
                  </div>
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-bottom">
                      <strong>{money(product.price)}</strong>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="button button-small button-ghost"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Details
                        </button>
                        <button
                          className="button button-small"
                          style={isUnlocked ? { background: '#10b981', color: '#042116' } : { background: '#ec4899', color: '#fff', border: 'none' }}
                          onClick={() => add(product.id)}
                          disabled={!product.available && isUnlocked}
                        >
                          {isUnlocked ? (product.available ? 'Add to cart' : 'Unavailable') : (!authUser ? 'Sign In to Unlock' : 'Click Explore Store')}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Live Courier Fulfillment Tracking Pipeline */}
        <div id="fulfillment" style={{ marginTop: '55px', background: 'var(--panel)', padding: '26px', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <span className="eyebrow" style={{ color: '#38bdf8' }}>LIVE OPERATIONS</span>
          <h3 style={{ margin: '6px 0 14px' }}>Courier Fulfillment & Delivery Pipeline</h3>
          <p className="muted" style={{ fontSize: '13px' }}>
            Real-time manifest tracking for dispatched physical orders and booked engineering advisory sessions.
          </p>

          <table className="fulfillment-table">
            <thead>
              <tr>
                <th>Tracking Code</th>
                <th>Manifest Description</th>
                <th>Destination</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {FULFILLMENT_PIPELINE.map((item, idx) => (
                <tr key={idx}>
                  <td className="tracking-code">{item.code}</td>
                  <td>{item.manifest}</td>
                  <td>{item.destination}</td>
                  <td>
                    <span className={`status ${item.status.includes('Delivered') ? 'status-paid' : 'status-pending'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>}

      {/* STORE — CHECKOUT SECTION */}
      {!standaloneStore && <section className="content-section checkout-section" style={{ display: isStoreMode ? 'grid' : 'none' }}>
        <div>
          <p className="eyebrow" style={{ color: '#ec4899' }}>SECURE CHECKOUT</p>
          <h2>Your order</h2>
          <p className="muted">Itemized order review. You will be redirected to PayMongo Hosted Checkout with secure payment confirmation.</p>
          
          <div className="cart-lines">
            {cartItems.length ? (
              cartItems.map(({ product, quantity }) => (
                <div className="cart-line" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <small>{money(product.price)} each · {product.category}</small>
                  </div>
                  <div className="quantity">
                    <button aria-label={`Remove one ${product.name}`} onClick={() => remove(product.id)}>−</button>
                    <span>{quantity}</span>
                    <button aria-label={`Add one ${product.name}`} onClick={() => add(product.id)}>+</button>
                  </div>
                  <strong>{money(product.price * quantity)}</strong>
                </div>
              ))
            ) : (
              <div className="notice-panel" style={{ margin: '15px 0' }}>
                <p>Your cart is empty. Add a product or service from the collection above to proceed.</p>
                <a className="button button-small" href="#store">Browse collection</a>
              </div>
            )}
          </div>

          <div className="total-line">
            <span>Estimated total</span>
            <strong>{money(total)}</strong>
          </div>
          <p className="muted" style={{ fontSize: '11px', marginTop: '10px' }}>
            Taxes & digital fulfillment included. Final total calculated and verified server-side.
          </p>
        </div>

        <form className="checkout-form" onSubmit={checkout}>
          <h3>Customer details</h3>
          {(!authUser || !storeUnlocked) && (
            <div style={{ background: '#290f19', border: '1px solid #ec4899', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px', fontSize: '12px', color: '#fbcfe8' }}>
              <strong>Store Locked:</strong> {!authUser ? 'Sign in with 2FA required on the store landing page to proceed with PayMongo checkout.' : 'Please click "✦ Explore Store ✦" on the landing page to unlock inside store checkout.'}
              <div style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  className="button button-small"
                  style={{ background: '#ec4899', color: '#fff', border: 'none' }}
                  onClick={scrollToAuth}
                >
                  {!authUser ? 'Go to Sign In / 2FA' : 'Go to Explore Store'}
                </button>
              </div>
            </div>
          )}
          <label>
            Full name
            <input
              required
              maxLength={100}
              autoComplete="name"
              placeholder="e.g. Maria Santos"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
            />
          </label>
          <label>
            Email address
            <input
              required
              type="email"
              maxLength={254}
              autoComplete="email"
              placeholder="name@company.com"
              value={customer.email}
              onChange={e => setCustomer({ ...customer, email: e.target.value })}
            />
          </label>
          <label>
            Phone (optional)
            <input
              type="tel"
              maxLength={30}
              autoComplete="tel"
              placeholder="+63 9XX XXX XXXX"
              value={customer.phone}
              onChange={e => setCustomer({ ...customer, phone: e.target.value })}
            />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          {notice && <p role="status">{notice}</p>}
          <button
            className="button button-wide"
            style={(authUser && storeUnlocked) ? { background: '#10b981', color: '#042116' } : { background: '#ec4899', color: '#fff' }}
            type="submit"
            disabled={busy || !cartItems.length}
          >
            {busy ? 'Preparing secure checkout…' : ((authUser && storeUnlocked) ? 'Continue to PayMongo' : (!authUser ? 'Sign In & Unlock to Checkout' : 'Click Explore Store to Checkout'))}
          </button>
          <p className="fine-print">
            By continuing, you agree to the store’s applicable terms, privacy, and refund policies. Read our <a href="/terms.html" style={{ color: 'var(--accent)' }}>Terms</a> and <a href="/refunds.html" style={{ color: 'var(--accent)' }}>Refund Policy</a>.
          </p>
        </form>
      </section>}

      {/* STORE — PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close dialog">×</button>
            <span className="eyebrow" style={{ color: '#38bdf8' }}>{selectedProduct.category.toUpperCase()}</span>
            <h2 style={{ margin: '8px 0 12px' }}>{selectedProduct.name}</h2>
            <div className="modal-price" style={{ color: '#ec4899' }}>{money(selectedProduct.price)}</div>
            <p className="muted">{selectedProduct.description}</p>
            
            <h4 style={{ margin: '20px 0 8px', fontSize: '12px', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Scope & Deliverables
            </h4>
            <ul className="modal-features">
              <li>Verified collector item or authenticated consulting session</li>
              <li>Official serialized certificate & packaging seal</li>
              <li>Direct coordination with Marjon Sealza / Eanuxx Emporium</li>
              <li>Courier tracking code assigned upon fulfillment</li>
            </ul>

            <div style={{ padding: '14px', background: '#0b1423', borderRadius: '10px', fontSize: '11px', color: 'var(--muted)', margin: '15px 0' }}>
              <strong>Fulfillment terms:</strong> Physical items are dispatched via registered courier within 1-2 business days. Digital consulting sessions are confirmed via email within 24 hours.
            </div>

            <div className="modal-footer">
              <button
                className="button button-wide"
                style={(authUser && storeUnlocked) ? { background: '#10b981', color: '#042116' } : { background: '#ec4899', color: '#fff' }}
                disabled={!selectedProduct.available && Boolean(authUser && storeUnlocked)}
                onClick={() => {
                  if (!authUser || !storeUnlocked) {
                    setSelectedProduct(null);
                    setAuthFeedback({
                      error: !authUser
                        ? 'Store Locked: Please sign in with 2FA on the landing page to purchase.'
                        : 'Store Locked: Click "✦ EXPLORE STORE ✦" on the landing page to unlock purchasing.'
                    });
                    scrollToAuth();
                    return;
                  }
                  add(selectedProduct.id);
                  setSelectedProduct(null);
                }}
              >
                {(authUser && storeUnlocked)
                  ? (selectedProduct.available ? 'Add to cart' : 'Currently Unavailable (Waitlist)')
                  : (!authUser ? 'Sign In with 2FA to Buy' : 'Click Explore Store to Unlock')}
              </button>
              <button className="button button-ghost" onClick={() => setSelectedProduct(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VLOG EPISODE MODAL */}
      {selectedVlog && (
        <div className="modal-backdrop" onClick={() => setSelectedVlog(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedVlog(null)} aria-label="Close dialog">×</button>
            <span className="eyebrow" style={{ color: selectedVlog.platform === 'YouTube' ? '#ef4444' : '#38bdf8' }}>
              {selectedVlog.platform.toUpperCase()} TRANSMISSION · {selectedVlog.id}
            </span>
            <h2 style={{ margin: '8px 0 12px', fontSize: '22px' }}>{selectedVlog.title}</h2>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className="vlog-duration-badge">⏱ {selectedVlog.duration}</span>
              <span className="vlog-res-badge">{selectedVlog.resolution}</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                Channel: {selectedVlog.channelHandle}
              </span>
            </div>

            <p className="muted" style={{ lineHeight: 1.7 }}>{selectedVlog.description}</p>

            <div style={{ padding: '14px', background: '#09121f', borderRadius: '10px', margin: '18px 0', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ color: '#ef4444', fontWeight: 900 }}>▶</span>
                <strong style={{ fontSize: '13px' }}>Official Creator Channel Broadcast</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                This episode is hosted on Marjon Sealza's official {selectedVlog.platform} channel ({selectedVlog.channelHandle}). Click below to watch the full transmission, participate in engineering discussions, or subscribe for future releases.
              </p>
            </div>

            <div className="project-tags" style={{ marginBottom: '20px' }}>
              {selectedVlog.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <div className="modal-footer">
              <a
                href={selectedVlog.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-wide"
                style={{
                  background: selectedVlog.platform === 'YouTube' ? '#dc2626' : '#0891b2',
                  color: '#fff',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                Watch on {selectedVlog.platform} ({selectedVlog.channelHandle}) ↗
              </a>
              <button className="button button-ghost" onClick={() => setSelectedVlog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>

    <footer className="footer" style={{ borderTopColor: 'rgba(255,255,255,0.08)' }}>
      <span>© {new Date().getFullYear()} Marjon Sealza · {isStoreMode ? 'Eanuxx Emporium' : 'Computer Engineer · Bataan, Philippines'}</span>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#vlogs">Vlogs</a>
        <a href="https://www.youtube.com/@marjon_human" target="_blank" rel="noopener noreferrer">YouTube @marjon_human</a>
        <a href="https://x.com/eanuxx" target="_blank" rel="noopener noreferrer">X @eanuxx</a>
        <a href="https://www.facebook.com/eanuxx" target="_blank" rel="noopener noreferrer">Facebook @eanuxx</a>
        <a href="https://www.instagram.com/eanuxx" target="_blank" rel="noopener noreferrer">Instagram @eanuxx</a>
        <a href="https://www.tiktok.com/@marjon.mb" target="_blank" rel="noopener noreferrer">TikTok @marjon.mb</a>
        <a href="/store">Store</a>
        <a href="/checkout">Checkout</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/refunds.html">Refunds</a>
      </div>
    </footer>
  </div>;
}
