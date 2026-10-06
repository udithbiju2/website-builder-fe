/**
 * Stylesheet for rendered client websites. Every rule is scoped under
 * `.wb-site` so it can't leak into (or be overridden by) the builder UI, and
 * responsive rules use container queries so the editor's tablet/mobile preview
 * frames behave exactly like real devices on the published site.
 */
const NOT_CHROME = ":not(.wb-editor-chrome, .wb-editor-chrome *)";

export const SITE_CSS = `
.wb-site {
  container: wb-site / inline-size;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  background: var(--wb-bg);
  color: var(--wb-text);
  font-family: var(--wb-font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  --wb-border: color-mix(in srgb, var(--wb-text) 12%, transparent);
}
.wb-site > main {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
/* Reset: :where() keeps these at class-level specificity so component classes below always win.
   .wb-editor-chrome marks builder controls drawn inside the preview; they keep the builder's own styles. */
.wb-site :where(*${NOT_CHROME}, *${NOT_CHROME}::before, *${NOT_CHROME}::after) { box-sizing: border-box; margin: 0; padding: 0; border: 0 solid; }
.wb-site :where(img${NOT_CHROME}) { display: block; max-width: 100%; height: auto; }
.wb-site :where(a${NOT_CHROME}) { color: inherit; text-decoration: none; }
.wb-site :where(ul${NOT_CHROME}) { list-style: none; }
.wb-site :where(button${NOT_CHROME}, input${NOT_CHROME}, textarea${NOT_CHROME}) { font: inherit; color: inherit; }
.wb-site h1, .wb-site h2, .wb-site h3 {
  font-family: var(--wb-font-heading);
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-weight: 700;
}
.wb-site h1 { font-size: 48px; }
.wb-site h2 { font-size: 34px; }
.wb-site h3 { font-size: 19px; font-weight: 600; }

.wb-container { width: 100%; max-width: var(--wb-container); margin: 0 auto; padding: 0 24px; }
.wb-section { padding: var(--wb-section-y) 0; }
.wb-bg-surface { background: var(--wb-surface); }
.wb-bg-primary { background: var(--wb-primary); color: var(--wb-on-primary); }
.wb-bg-primary .wb-muted { color: inherit; opacity: 0.85; }
.wb-muted { color: var(--wb-muted); }
.wb-eyebrow { font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--wb-primary); }
.wb-bg-primary .wb-eyebrow { color: inherit; }
.wb-section-head { max-width: 680px; margin: 0 auto 48px; text-align: center; }
.wb-section-head p { margin-top: 12px; font-size: 18px; }

.wb-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 44px; padding: 10px 22px;
  border-radius: var(--wb-radius);
  font-weight: 600; font-size: 15px; line-height: 1.2;
  cursor: pointer; transition: opacity 0.15s ease, background-color 0.15s ease;
}
.wb-btn:hover { opacity: 0.9; }
.wb-btn-primary { background: var(--wb-primary); color: var(--wb-on-primary); border: 2px solid var(--wb-primary); }
.wb-btn-secondary { background: transparent; color: var(--wb-text); border: 2px solid var(--wb-border); }
.wb-site.wb-buttons-outline .wb-btn-primary { background: transparent; color: var(--wb-primary); }
.wb-bg-primary .wb-btn-primary { background: var(--wb-on-primary); color: var(--wb-primary); border-color: var(--wb-on-primary); }
.wb-bg-primary .wb-btn-secondary { color: inherit; border-color: currentColor; }
.wb-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
.wb-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }

.wb-card { background: var(--wb-bg); border-radius: var(--wb-radius); padding: 28px; color: var(--wb-text); }
.wb-site.wb-cards-border .wb-card { border: 1px solid var(--wb-border); }
.wb-site.wb-cards-shadow .wb-card { box-shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.08); }
.wb-site.wb-cards-flat .wb-card { background: var(--wb-surface); }
.wb-site.wb-cards-flat .wb-bg-surface .wb-card { background: var(--wb-bg); }
.wb-card h3 { margin-bottom: 8px; }
.wb-card p { color: var(--wb-muted); }

.wb-grid {
  display: grid; gap: 24px;
  grid-template-columns: repeat(var(--wb-cols, 3), minmax(0, 1fr));
}

.wb-icon {
  display: inline-grid; place-items: center; width: 44px; height: 44px; margin-bottom: 16px;
  border-radius: var(--wb-radius);
  background: color-mix(in srgb, var(--wb-primary) 12%, transparent);
  color: var(--wb-primary);
}
.wb-icon svg { width: 22px; height: 22px; }

/* Header */
.wb-announcement { background: var(--wb-text); color: var(--wb-bg); text-align: center; font-size: 13px; padding: 8px 24px; font-weight: 500; }
.wb-announcement a { text-decoration: underline; text-underline-offset: 2px; margin-left: 6px; }
.wb-header { background: var(--wb-bg); border-bottom: 1px solid var(--wb-border); position: relative; z-index: 40; transition: background 150ms ease, box-shadow 150ms ease; }
.wb-header.wb-sticky { position: -webkit-sticky; position: sticky; top: 0; z-index: 40; width: 100%; }
.wb-header.wb-fixed { position: fixed; top: 0; left: 0; right: 0; z-index: 40; width: 100%; }
.wb-header.wb-transparent { position: absolute; top: 0; left: 0; right: 0; background: transparent; border-bottom: 1px solid rgba(255, 255, 255, 0.15); z-index: 40; width: 100%; }
.wb-header.wb-floating { position: -webkit-sticky; position: sticky; top: 12px; background: transparent; border-bottom: none; padding: 8px 16px; z-index: 40; width: 100%; }
.wb-header-floating-pill { max-width: 1100px; margin: 0 auto; background: color-mix(in srgb, var(--wb-bg) 90%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid var(--wb-border); border-radius: 9999px; box-shadow: 0 10px 28px -6px rgb(0 0 0 / 0.12); padding: 8px 20px; display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 56px; }
.wb-header-inner { display: flex; align-items: center; gap: 28px; min-height: 72px; }
.wb-brand { display: inline-flex; align-items: center; gap: 10px; font-family: var(--wb-font-heading); font-weight: 700; font-size: 20px; text-decoration: none; shrink-0; }
.wb-brand img { max-height: 38px; width: auto; object-fit: contain; }
.wb-brand-text { font-family: var(--wb-font-heading); font-weight: 700; font-size: 20px; line-height: 1.2; letter-spacing: -0.01em; color: inherit; }
.wb-brand-combo { display: inline-flex; align-items: center; gap: 10px; }
.wb-brand-logo-left { flex-direction: row; }
.wb-brand-logo-right { flex-direction: row; }
.wb-brand-logo-top { flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.wb-brand-logo-top .wb-brand-text { font-size: 13px; font-weight: 600; line-height: 1.15; }
.wb-nav { display: flex; align-items: center; gap: 24px; font-size: 14px; font-weight: 500; }
.wb-nav a { text-decoration: none; transition: color 120ms ease; }
.wb-nav a:hover { color: var(--wb-primary); }
.wb-header-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
.wb-header-cta { display: inline-flex; align-items: center; gap: 8px; }
.wb-header-classical .wb-nav { margin: 0 auto; }
.wb-header-minimalist .wb-header-inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
.wb-header-minimalist .wb-nav-left { display: flex; align-items: center; gap: 24px; }
.wb-header-minimalist .wb-brand-center { display: flex; justify-content: center; }
.wb-header-minimalist .wb-actions-right { display: flex; align-items: center; gap: 12px; justify-content: flex-end; }
.wb-header-comprehensive .wb-nav { margin-left: 8px; }
.wb-header-ecommerce { border-bottom: 1px solid var(--wb-border); }
.wb-header-ecommerce .wb-ecommerce-top { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 64px; }
.wb-header-ecommerce .wb-ecommerce-bottom { display: flex; align-items: center; justify-content: center; gap: 28px; padding: 10px 0 12px; border-top: 1px solid var(--wb-border); font-size: 14px; font-weight: 500; overflow-x: auto; }
.wb-ecommerce-tab { position: relative; padding: 4px 6px; text-decoration: none; white-space: nowrap; }
.wb-ecommerce-tab:hover, .wb-ecommerce-tab.active { color: var(--wb-primary); }
.wb-ecommerce-tab.active::after { content: ""; position: absolute; bottom: -8px; left: 0; right: 0; height: 2px; background: var(--wb-primary); border-radius: 2px; }
.wb-dropdown { position: relative; display: inline-flex; align-items: center; }
.wb-dropdown-trigger { display: inline-flex; align-items: center; gap: 4px; background: transparent; border: none; font: inherit; font-size: inherit; font-weight: inherit; color: inherit; cursor: pointer; padding: 6px 0; }
.wb-dropdown-trigger svg { width: 14px; height: 14px; opacity: 0.65; transition: transform 150ms ease; }
.wb-dropdown:hover .wb-dropdown-trigger svg, .wb-dropdown:focus-within .wb-dropdown-trigger svg { transform: rotate(180deg); }
.wb-dropdown-menu { display: none; position: absolute; top: calc(100% + 8px); left: -16px; min-width: 240px; background: var(--wb-bg); border: 1px solid var(--wb-border); border-radius: var(--wb-radius); box-shadow: 0 16px 36px -8px rgb(0 0 0 / 0.16); padding: 8px; z-index: 50; flex-direction: column; gap: 2px; }
.wb-dropdown:hover .wb-dropdown-menu, .wb-dropdown:focus-within .wb-dropdown-menu { display: flex; animation: wbFadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1); }
.wb-dropdown-item { display: flex; flex-direction: column; gap: 2px; padding: 8px 12px; border-radius: calc(var(--wb-radius) - 2px); text-decoration: none; transition: background 120ms ease; }
.wb-dropdown-item:hover { background: var(--wb-surface); color: var(--wb-primary); }
.wb-dropdown-item-title { display: flex; align-items: center; justify-content: space-between; font-weight: 600; font-size: 14px; }
.wb-dropdown-desc { font-size: 12px; color: var(--wb-muted); line-height: 1.4; font-weight: normal; }
.wb-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; background: color-mix(in srgb, var(--wb-primary) 15%, transparent); color: var(--wb-primary); text-transform: uppercase; letter-spacing: 0.04em; }
.wb-header-icon-btn { display: inline-grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--wb-border); background: transparent; color: inherit; position: relative; cursor: pointer; transition: all 120ms ease; text-decoration: none; }
.wb-header-icon-btn:hover { background: var(--wb-surface); color: var(--wb-primary); }
.wb-header-icon-btn svg { width: 17px; height: 17px; }
.wb-cart-badge { position: absolute; top: -3px; right: -3px; background: #ef4444; color: white; font-size: 10px; font-weight: 700; border-radius: 9999px; min-width: 16px; height: 16px; padding: 0 4px; display: grid; place-items: center; line-height: 1; }
.wb-search-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 9999px; border: 1px solid var(--wb-border); background: var(--wb-surface); font-size: 13px; color: var(--wb-muted); cursor: pointer; min-width: 180px; }
.wb-search-pill svg { width: 14px; height: 14px; opacity: 0.6; }
.wb-header-centered .wb-header-inner { flex-direction: column; gap: 12px; padding: 20px 24px 16px; }
.wb-header-centered .wb-nav { margin-left: 0; }
.wb-mobile-nav { display: none; margin-left: auto; }
.wb-mobile-nav > summary {
  list-style: none; cursor: pointer; display: grid; place-items: center;
  width: 42px; height: 42px; border-radius: var(--wb-radius); border: 1px solid var(--wb-border);
}
.wb-mobile-nav > summary::-webkit-details-marker { display: none; }
.wb-mobile-nav > summary svg { width: 22px; height: 22px; }
.wb-mobile-nav[open] .wb-mobile-panel {
  position: absolute; left: 0; right: 0; top: 100%;
  display: flex; flex-direction: column; gap: 8px; padding: 16px 20px 24px;
  background: var(--wb-bg); border-bottom: 1px solid var(--wb-border);
  box-shadow: 0 16px 32px rgb(0 0 0 / 0.12); max-height: 80vh; overflow-y: auto;
}
.wb-mobile-panel a { padding: 8px 0; font-weight: 500; font-size: 15px; }
.wb-mobile-submenu { margin: 4px 0 8px 8px; padding-left: 12px; border-left: 2px solid var(--wb-border); display: flex; flex-direction: column; gap: 4px; }
.wb-mobile-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; pt: 12px; border-top: 1px solid var(--wb-border); }
@keyframes wbFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

/* Hero Builder Styles */
.wb-hero { position: relative; overflow: hidden; padding: calc(var(--wb-section-y) * 1.1) 0; }
.wb-hero-min-screen { min-height: calc(100vh - 80px); display: flex; align-items: center; }
.wb-hero-min-tall { min-height: 700px; display: flex; align-items: center; }
.wb-hero-min-compact { padding: calc(var(--wb-section-y) * 0.6) 0; }

.wb-hero-copy { display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 2; }
.wb-hero h1 { margin: 0; font-size: 52px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; }
.wb-hero-sub { font-size: 19px; line-height: 1.55; max-width: 640px; margin: 0; }
.wb-hero-desc { font-size: 15px; line-height: 1.6; max-width: 580px; margin: 0; }
.wb-hero-badge {
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 9999px;
  font-size: 13px; font-weight: 600; width: fit-content;
  background: color-mix(in srgb, var(--wb-primary) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--wb-primary) 25%, transparent);
  color: var(--wb-primary);
}
.wb-text-gradient {
  background: linear-gradient(135deg, var(--wb-primary), #ec4899, #8b5cf6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

/* Hero Action Buttons */
.wb-hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 8px; }
.wb-btn-video-play {
  display: inline-flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600;
  padding: 10px 18px; border-radius: 9999px; background: color-mix(in srgb, var(--wb-text) 6%, transparent);
  border: 1px solid var(--wb-border); color: inherit; cursor: pointer; text-decoration: none; transition: all 0.2s ease;
}
.wb-btn-video-play:hover { background: color-mix(in srgb, var(--wb-text) 12%, transparent); transform: scale(1.02); }
.wb-play-icon-pill {
  width: 28px; height: 28px; border-radius: 50%; background: var(--wb-primary); color: var(--wb-on-primary, #ffffff);
  display: inline-grid; place-items: center; flex-shrink: 0;
}
.wb-play-icon-pill svg { width: 12px; height: 12px; margin-left: 1px; }

/* Social Proof Rating & Avatars */
.wb-hero-rating { display: flex; align-items: center; gap: 12px; margin-top: 12px; font-size: 13px; font-weight: 500; }
.wb-avatar-stack { display: flex; align-items: center; }
.wb-avatar-circle {
  width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--wb-bg);
  background: color-mix(in srgb, var(--wb-primary) 20%, #64748b);
  display: inline-grid; place-items: center; font-size: 11px; font-weight: 700; color: #ffffff;
  margin-left: -8px; first-of-type:margin-left-0;
}
.wb-avatar-circle:first-child { margin-left: 0; }
.wb-stars-row { display: flex; gap: 2px; }
.wb-stars-row svg { width: 14px; height: 14px; }

/* Trusted By Logo Strip */
.wb-hero-trusted-by { margin-top: 36px; padding-top: 24px; border-top: 1px solid color-mix(in srgb, var(--wb-border) 60%, transparent); }
.wb-trusted-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--wb-muted); margin-bottom: 12px; }
.wb-trusted-logos { display: flex; flex-wrap: wrap; align-items: center; gap: 24px 36px; }
.wb-trusted-logo-item { font-size: 14px; font-weight: 700; letter-spacing: -0.01em; opacity: 0.6; transition: opacity 0.15s ease; }
.wb-trusted-logo-item:hover { opacity: 1; }

/* Hero Media & Device Mockup */
.wb-hero-media { position: relative; z-index: 1; }
.wb-hero-media img { width: 100%; border-radius: var(--wb-radius); object-fit: cover; }
.wb-hero-media-mockup {
  border-radius: calc(var(--wb-radius) * 1.3); border: 1px solid var(--wb-border);
  background: var(--wb-bg); box-shadow: 0 24px 60px -12px rgb(0 0 0 / 0.18);
  overflow: hidden;
}
.wb-mockup-header {
  height: 34px; background: color-mix(in srgb, var(--wb-text) 5%, var(--wb-surface));
  border-bottom: 1px solid var(--wb-border); display: flex; align-items: center; padding: 0 14px; gap: 6px;
}
.wb-mockup-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
.wb-mockup-dot-red { background: #ff5f56; }
.wb-mockup-dot-yellow { background: #ffbd2e; }
.wb-mockup-dot-green { background: #27c93f; }
.wb-hero-media-glow { position: relative; }
.wb-hero-media-glow::before {
  content: ""; position: absolute; inset: -15%; background: radial-gradient(circle, color-mix(in srgb, var(--wb-primary) 35%, transparent) 0%, transparent 70%);
  z-index: -1; filter: blur(32px); border-radius: 50%; opacity: 0.75;
}

/* Hero Playable Video Player & Poster */
.wb-hero-video-wrap {
  width: 100%; border-radius: var(--wb-radius); overflow: hidden; background: #000000;
  box-shadow: 0 20px 48px -10px rgb(0 0 0 / 0.22);
}
.wb-hero-video-element {
  width: 100%; height: auto; max-height: 520px; display: block; border-radius: var(--wb-radius); object-fit: cover;
}
.wb-hero-video-iframe-wrap {
  position: relative; width: 100%; padding-bottom: 56.25%; height: 0;
  overflow: hidden; border-radius: var(--wb-radius); background: #000000;
  box-shadow: 0 20px 48px -10px rgb(0 0 0 / 0.22);
}
.wb-hero-video-iframe {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;
}
.wb-hero-video-poster-wrap {
  position: relative; width: 100%; cursor: pointer; border-radius: var(--wb-radius);
  overflow: hidden; box-shadow: 0 20px 48px -10px rgb(0 0 0 / 0.18);
}
.wb-hero-video-poster {
  width: 100%; display: block; object-fit: cover; transition: transform 0.3s ease;
}
.wb-hero-video-poster-wrap:hover .wb-hero-video-poster {
  transform: scale(1.02);
}
.wb-hero-video-play-btn {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 68px; height: 68px; border-radius: 50%; background: var(--wb-primary);
  color: var(--wb-on-primary, #ffffff); border: 3px solid #ffffff;
  display: grid; place-items: center; cursor: pointer;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.3); transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.wb-hero-video-play-btn svg { width: 26px; height: 26px; fill: currentColor; margin-left: 2px; }
.wb-hero-video-play-btn:hover {
  transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 12px 32px color-mix(in srgb, var(--wb-primary) 50%, black);
}

/* Floating Cards & Mockup Showcase */
.wb-floating-card-wrap {
  position: relative; width: 100%; min-height: 240px;
  display: flex; align-items: center; justify-content: center;
}
.wb-hero-mockup-placeholder {
  width: 100%; min-height: 240px; border-radius: var(--wb-radius); border: 1px solid var(--wb-border);
  background: color-mix(in srgb, var(--wb-surface) 60%, var(--wb-bg));
  box-shadow: 0 20px 48px -12px rgb(0 0 0 / 0.08); padding: 22px;
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative; overflow: hidden;
}
.wb-placeholder-glow {
  position: absolute; top: -30px; right: -30px; width: 120px; height: 120px;
  background: radial-gradient(circle, color-mix(in srgb, var(--wb-primary) 30%, transparent) 0%, transparent 70%);
  border-radius: 50%; filter: blur(20px); pointer-events: none;
}
.wb-placeholder-card-header { display: flex; align-items: center; gap: 12px; }
.wb-placeholder-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: color-mix(in srgb, var(--wb-primary) 20%, var(--wb-border));
}
.wb-placeholder-bars { display: flex; flex-direction: column; gap: 6px; }
.wb-placeholder-bar-title {
  width: 110px; height: 12px; border-radius: 6px; background: color-mix(in srgb, var(--wb-text) 15%, transparent);
}
.wb-placeholder-bar-sub {
  width: 70px; height: 8px; border-radius: 4px; background: color-mix(in srgb, var(--wb-muted) 20%, transparent);
}
.wb-placeholder-chart {
  display: flex; align-items: flex-end; gap: 10px; height: 100px; padding-top: 14px;
  border-top: 1px dashed var(--wb-border);
}
.wb-chart-bar {
  flex: 1; border-radius: 6px 6px 2px 2px;
  background: linear-gradient(180deg, var(--wb-primary), color-mix(in srgb, var(--wb-primary) 30%, transparent));
  opacity: 0.85; transition: opacity 0.2s ease;
}
.wb-chart-bar:hover { opacity: 1; }

.wb-hero-floating-card {
  position: absolute; background: color-mix(in srgb, var(--wb-bg) 92%, transparent);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--wb-border); border-radius: calc(var(--wb-radius) + 4px);
  padding: 12px 18px; box-shadow: 0 20px 40px -8px rgb(0 0 0 / 0.16);
  display: flex; align-items: center; gap: 12px; z-index: 10;
  animation: wbFloat 4s ease-in-out infinite alternate;
}
.wb-hero-floating-card-1 { top: -10px; left: -10px; }
.wb-hero-floating-card-2 { bottom: -10px; right: -10px; animation-delay: 2s; }
.wb-floating-icon {
  width: 36px; height: 36px; border-radius: 10px; background: var(--wb-primary); color: var(--wb-on-primary, #ffffff);
  display: grid; place-items: center; font-size: 16px; flex-shrink: 0;
}
.wb-floating-card-text strong { display: block; font-size: 14px; font-weight: 700; }
.wb-floating-card-text span { display: block; font-size: 11px; color: var(--wb-muted); }
@keyframes wbFloat { from { transform: translateY(0); } to { transform: translateY(-8px); } }

/* Hero Layout Variants */
.wb-hero-centered { text-align: center; }
.wb-hero-centered .wb-hero-copy { max-width: 820px; margin: 0 auto; align-items: center; }
.wb-hero-centered .wb-hero-actions { justify-content: center; }
.wb-hero-centered .wb-hero-media { margin-top: 48px; max-width: 1000px; margin-left: auto; margin-right: auto; }
.wb-hero-centered .wb-hero-rating { justify-content: center; }
.wb-hero-centered .wb-trusted-logos { justify-content: center; }

.wb-hero-split .wb-hero-grid, .wb-hero-split-left .wb-hero-grid {
  display: grid; grid-template-columns: 1.1fr 1fr; gap: 56px; align-items: center;
}
.wb-hero-split-left .wb-hero-media { order: -1; }

.wb-hero-asymmetric .wb-hero-grid {
  display: grid; grid-template-columns: 1.3fr 0.9fr; gap: 48px; align-items: center;
}
.wb-hero-asymmetric .wb-hero-media { margin-top: 24px; transform: rotate(1deg); transition: transform 0.3s ease; }
.wb-hero-asymmetric .wb-hero-media:hover { transform: rotate(0deg); }

.wb-hero-soft-card { padding: calc(var(--wb-section-y) * 0.8) 0; }
.wb-hero-card-container {
  background: color-mix(in srgb, var(--wb-surface) 70%, var(--wb-bg));
  border: 1px solid var(--wb-border); border-radius: calc(var(--wb-radius) * 2);
  padding: 64px 48px; box-shadow: 0 20px 48px -12px rgb(0 0 0 / 0.08);
}

.wb-hero-gradient {
  background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--wb-primary) 18%, transparent) 0%, transparent 60%),
              radial-gradient(circle at 100% 100%, color-mix(in srgb, #ec4899 12%, transparent) 0%, transparent 50%),
              var(--wb-bg);
}

.wb-hero-minimal-typography h1 { font-size: 68px; font-weight: 900; letter-spacing: -0.04em; }

/* Full Image / Video Background Overlay & High Contrast Text */
.wb-hero-has-bg-media {
  position: relative; overflow: hidden;
}
.wb-hero-has-bg-media .wb-hero-copy {
  position: relative; z-index: 2;
}

.wb-hero-dark-overlay,
.wb-hero-background-image,
.wb-hero-video-bg {
  color: #ffffff !important;
  position: relative;
}
.wb-hero-dark-overlay h1,
.wb-hero-dark-overlay h2,
.wb-hero-dark-overlay h3,
.wb-hero-background-image h1,
.wb-hero-video-bg h1 {
  color: #ffffff !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}
.wb-hero-dark-overlay .wb-hero-sub,
.wb-hero-dark-overlay .wb-hero-desc,
.wb-hero-dark-overlay .wb-muted,
.wb-hero-background-image .wb-muted,
.wb-hero-video-bg .wb-muted {
  color: #e2e8f0 !important;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
}
.wb-hero-dark-overlay .wb-hero-badge,
.wb-hero-background-image .wb-hero-badge,
.wb-hero-video-bg .wb-hero-badge {
  background: rgba(255, 255, 255, 0.18) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.wb-hero-dark-overlay .wb-btn-secondary,
.wb-hero-background-image .wb-btn-secondary,
.wb-hero-video-bg .wb-btn-secondary {
  background: rgba(255, 255, 255, 0.16) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.wb-hero-dark-overlay .wb-btn-secondary:hover,
.wb-hero-background-image .wb-btn-secondary:hover,
.wb-hero-video-bg .wb-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.28) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
}
.wb-hero-dark-overlay .wb-btn-video-play,
.wb-hero-video-bg .wb-btn-video-play {
  color: #ffffff !important;
}
.wb-hero-dark-overlay .wb-play-icon-pill,
.wb-hero-video-bg .wb-play-icon-pill {
  background: #ffffff !important;
  color: #0f172a !important;
}

.wb-hero-bg-media {
  position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; overflow: hidden; pointer-events: none;
}
.wb-hero-bg-media img, .wb-hero-bg-media video {
  width: 100%; height: 100%; border: 0;
}
.wb-hero-bg-iframe-container {
  position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none;
}
.wb-hero-bg-iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 56.25vw; /* 16:9 */
  min-height: 100vh;
  min-width: 177.77vh; /* 16:9 */
  transform: translate(-50%, -50%);
  pointer-events: none;
  border: 0;
}
.wb-bg-pos-bottom img, .wb-bg-pos-bottom video {
  object-fit: contain; object-position: bottom center;
}
.wb-bg-pos-cover img, .wb-bg-pos-cover video {
  object-fit: cover; object-position: center;
}
.wb-bg-pos-top img, .wb-bg-pos-top video {
  object-fit: cover; object-position: top center;
}
.wb-bg-pos-center img, .wb-bg-pos-center video {
  object-fit: cover; object-position: center;
}

.wb-hero-overlay {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
}
.wb-overlay-dark { background: #000000; }
.wb-overlay-light { background: #ffffff; }
.wb-overlay-gradient {
  background: linear-gradient(180deg, var(--wb-bg) 0%, color-mix(in srgb, var(--wb-bg) 60%, transparent) 45%, transparent 100%);
}

/* Bottom Anchored Character/Community Illustration (matching Myna UI reference) */
.wb-hero-bottom-illustration {
  min-height: 640px !important;
  padding-top: 56px !important;
  padding-bottom: 340px !important;
  position: relative !important;
  overflow: hidden !important;
}
.wb-hero-bottom-illustration .wb-hero-copy {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}
.wb-hero-bottom-illustration .wb-hero-bg-media {
  position: absolute !important;
  top: auto !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 380px !important;
  z-index: 1 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: flex-end !important;
  pointer-events: none !important;
}
.wb-hero-bottom-illustration .wb-hero-bg-media img {
  width: 100% !important;
  max-width: 1120px !important;
  height: 100% !important;
  object-fit: contain !important;
  object-position: bottom center !important;
}

/* Community 3D Avatar Illustration SVG */
.wb-community-illustration-wrap {
  width: 100%;
  max-width: 1040px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.wb-community-svg {
  width: 100%;
  height: auto;
  max-height: 360px;
  display: block;
}

/* Video Background Hero Polish */
.wb-hero-video-bg {
  background: radial-gradient(circle at 50% 15%, #1e1b4b 0%, #0f172a 60%, #020617 100%) !important;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.wb-hero-video-bg .wb-hero-copy {
  max-width: 840px;
  margin: 0 auto;
  align-items: center;
  position: relative;
  z-index: 2;
}
.wb-hero-video-bg .wb-hero-actions {
  justify-content: center;
}
.wb-hero-video-bg .wb-hero-media {
  margin-top: 40px;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
}

/* Bottom Shape Divider SVG */
.wb-shape-divider {
  position: absolute; bottom: 0; left: 0; right: 0; width: 100%; overflow: hidden; line-height: 0; z-index: 3;
  color: var(--wb-surface);
}
.wb-shape-divider svg { display: block; width: 100%; height: 50px; }

/* Services */
.wb-service { overflow: hidden; padding: 0; display: flex; flex-direction: column; }
.wb-service img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }
.wb-service-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
.wb-service-link { margin-top: auto; padding-top: 16px; font-weight: 600; color: var(--wb-primary); }

/* Testimonials */
.wb-quote blockquote { font-size: 17px; color: var(--wb-text); }
.wb-quote figcaption { margin-top: 20px; font-size: 14px; }
.wb-quote figcaption strong { display: block; font-size: 15px; color: var(--wb-text); }

/* FAQ */
.wb-faq { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
.wb-faq details { border: 1px solid var(--wb-border); border-radius: var(--wb-radius); background: var(--wb-bg); color: var(--wb-text); }
.wb-faq summary {
  list-style: none; cursor: pointer; padding: 18px 22px; font-weight: 600;
  display: flex; justify-content: space-between; gap: 16px;
}
.wb-faq summary::-webkit-details-marker { display: none; }
.wb-faq summary::after { content: "+"; font-size: 20px; line-height: 1; color: var(--wb-primary); }
.wb-faq details[open] summary::after { content: "\\2212"; }
.wb-faq details p { padding: 0 22px 20px; color: var(--wb-muted); }

/* CTA */
.wb-cta { text-align: center; }
.wb-cta .wb-container { max-width: 760px; }
.wb-cta p { margin-top: 16px; font-size: 18px; }
.wb-cta .wb-actions { justify-content: center; }

/* Contact */
.wb-contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; align-items: start; }
.wb-contact-grid.wb-contact-solo { grid-template-columns: 1fr; max-width: 680px; margin: 0 auto; text-align: center; }
.wb-contact-intro { margin-top: 12px; font-size: 18px; }
.wb-contact-list { margin-top: 28px; display: flex; flex-direction: column; gap: 14px; }
.wb-contact-list dt { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--wb-muted); }
.wb-contact-list dd { font-size: 17px; }
.wb-form { display: grid; gap: 16px; }
.wb-form label { display: grid; gap: 6px; font-size: 14px; font-weight: 500; }
.wb-form input, .wb-form textarea {
  width: 100%; padding: 12px 14px; background: var(--wb-bg);
  border: 1px solid var(--wb-border); border-radius: var(--wb-radius);
}
.wb-form textarea { min-height: 130px; resize: vertical; }
.wb-form input:focus, .wb-form textarea:focus { outline: 2px solid var(--wb-primary); outline-offset: 1px; }

/* Text */
.wb-text { max-width: 760px; margin: 0 auto; }
.wb-text h2 { margin-bottom: 20px; }
.wb-text p + p { margin-top: 16px; }
.wb-text p { font-size: 17px; }

/* Gallery */
.wb-gallery img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--wb-radius); }
.wb-gallery-head { margin-bottom: 32px; text-align: center; }

/* Footer Builder Styles */
.wb-footer { background: var(--wb-surface); border-top: 1px solid var(--wb-border); padding: 56px 0 32px; font-size: 14px; position: relative; }
.wb-footer-dark { background: #0c0d12 !important; color: #f1f5f9 !important; border-top: 1px solid rgba(255, 255, 255, 0.08) !important; }
.wb-footer-dark .wb-muted, .wb-footer-dark p, .wb-footer-dark .wb-footer-contact-block { color: #94a3b8 !important; }
.wb-footer-dark a { color: #cbd5e1; }
.wb-footer-dark a:hover { color: #ffffff !important; }
.wb-footer-dark .wb-footer-bottom { border-top: 1px solid rgba(255, 255, 255, 0.08) !important; }
.wb-footer-dark .wb-social-circle-btn { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.12); color: #f1f5f9; }
.wb-footer-dark .wb-social-circle-btn:hover { background: var(--wb-primary); color: #ffffff; border-color: var(--wb-primary); }
.wb-footer-dark .wb-newsletter-input { background: rgba(255, 255, 255, 0.07); border-color: rgba(255, 255, 255, 0.15); color: #ffffff; }
.wb-footer-dark .wb-newsletter-input::placeholder { color: #64748b; }
.wb-footer-dark .wb-payment-badge { background: rgba(255, 255, 255, 0.95); border-color: rgba(255, 255, 255, 0.2); }

.wb-footer-light { background: #ffffff !important; color: #0f172a !important; border-top: 1px solid rgba(0, 0, 0, 0.08) !important; }
.wb-footer-light .wb-muted, .wb-footer-light p { color: #64748b !important; }

/* Grid & Column Layouts */
.wb-footer-grid { display: grid; grid-template-columns: 1.3fr repeat(var(--wb-footer-cols, 3), 1fr); gap: 40px; }
.wb-footer-mega-grid { display: grid; grid-template-columns: 1.2fr repeat(var(--wb-footer-cols, 3), 1fr) 1.2fr; gap: 36px; align-items: start; }
.wb-footer-split-grid { display: grid; grid-template-columns: 1.1fr 1.6fr 1.1fr; gap: 36px; align-items: start; }
.wb-footer-newsletter-grid { display: grid; grid-template-columns: 1.1fr 1.4fr 1.3fr; gap: 40px; align-items: start; }

.wb-footer h3, .wb-footer h4, .wb-footer-col-title {
  font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;
}
.wb-footer ul { list-style: none; padding: 0; margin: 0; }
.wb-footer li + li { margin-top: 10px; }
.wb-footer a { text-decoration: none; transition: color 0.15s ease, opacity 0.15s ease; }
.wb-footer a:hover { color: var(--wb-primary); }

.wb-footer-about { display: flex; flex-direction: column; gap: 14px; }
.wb-footer-about .wb-brand { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; display: inline-flex; align-items: center; gap: 8px; }
.wb-footer-about p { margin: 0; font-size: 14px; line-height: 1.6; max-width: 320px; }
.wb-footer-tagline { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.75; }

/* Social Icons */
.wb-social { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.wb-social-circle-btn {
  width: 34px; height: 34px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--wb-text) 5%, transparent);
  border: 1px solid var(--wb-border);
  color: var(--wb-text);
  transition: all 0.2s ease;
  flex-shrink: 0;
  text-decoration: none;
}
.wb-social-circle-btn svg { width: 15px; height: 15px; }
.wb-social-circle-btn:hover {
  background: var(--wb-primary);
  border-color: var(--wb-primary);
  color: var(--wb-on-primary, #ffffff);
  transform: translateY(-2px);
}

/* Horizontal Nav Rows */
.wb-footer-nav-row { display: flex; flex-wrap: wrap; gap: 20px 28px; list-style: none; padding: 0; margin: 0; }
.wb-footer-nav-row a { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
.wb-footer-nav-row a.wb-active-nav { color: var(--wb-primary); font-weight: 700; }

/* Contact Details Block */
.wb-footer-contact-block { display: flex; flex-direction: column; gap: 8px; font-size: 13px; line-height: 1.5; }
.wb-footer-contact-item { display: flex; align-items: flex-start; gap: 8px; }

/* Newsletter Form */
.wb-newsletter-box { display: flex; flex-direction: column; gap: 12px; }
.wb-newsletter-box h4 { margin-bottom: 2px; }
.wb-newsletter-box p { font-size: 13px; margin: 0; }
.wb-newsletter-form { display: flex; gap: 0; max-width: 360px; width: 100%; }
.wb-newsletter-input {
  flex: 1; height: 40px; padding: 0 14px; font-size: 13px;
  background: var(--wb-bg); border: 1px solid var(--wb-border);
  border-right: none; border-radius: var(--wb-radius) 0 0 var(--wb-radius);
  outline: none; transition: border-color 0.15s ease;
}
.wb-newsletter-input:focus { border-color: var(--wb-primary); }
.wb-newsletter-btn {
  height: 40px; padding: 0 18px; font-size: 13px; font-weight: 600;
  background: var(--wb-primary); color: var(--wb-on-primary, #ffffff);
  border: 1px solid var(--wb-primary); border-radius: 0 var(--wb-radius) var(--wb-radius) 0;
  cursor: pointer; transition: opacity 0.15s ease; white-space: nowrap;
}
.wb-newsletter-btn:hover { opacity: 0.9; }

/* Payment Methods Badges */
.wb-payment-badges { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.wb-payment-badge {
  height: 24px; min-width: 38px; padding: 0 6px; border-radius: 4px;
  background: #ffffff; border: 1px solid #e2e8f0;
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); flex-shrink: 0;
}
.wb-pay-text { font-size: 10px; letter-spacing: -0.02em; user-select: none; }
.wb-pay-mc-circles { display: inline-flex; position: relative; width: 20px; height: 12px; align-items: center; }
.wb-pay-mc-red { width: 12px; height: 12px; border-radius: 9999px; background: #eb001b; display: inline-block; }
.wb-pay-mc-yellow { width: 12px; height: 12px; border-radius: 9999px; background: #ff5f00; display: inline-block; margin-left: -5px; opacity: 0.9; }

/* Inline Footer */
.wb-footer-inline-bar {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px;
}

/* Centered Footer */
.wb-footer-centered-wrap {
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 20px; max-width: 680px; margin: 0 auto;
}

/* CTA Top Banner on Footer */
.wb-footer-cta-card {
  padding: 40px; margin-bottom: 48px; border-radius: calc(var(--wb-radius) * 1.5);
  background: color-mix(in srgb, var(--wb-primary) 8%, var(--wb-surface));
  border: 1px solid color-mix(in srgb, var(--wb-primary) 20%, var(--wb-border));
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px;
}
.wb-footer-cta-card h3 { font-size: 24px; font-weight: 700; text-transform: none; letter-spacing: -0.02em; margin: 0 0 6px 0; }
.wb-footer-cta-card p { font-size: 15px; margin: 0; }

/* Bottom Bar */
.wb-footer-bottom {
  margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--wb-border);
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; font-size: 13px;
}
.wb-footer-bottom-left { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.wb-legal-links { display: flex; flex-wrap: wrap; gap: 14px; list-style: none; padding: 0; margin: 0; }
.wb-legal-links a { font-size: 12px; text-decoration: none; opacity: 0.8; }
.wb-legal-links a:hover { opacity: 1; }

.wb-footer-simple { padding: 28px 0; }
.wb-footer-simple .wb-footer-bottom { margin-top: 0; padding-top: 0; border-top: 0; align-items: center; }

/* Section settings */
.wb-bg-dark { background: var(--wb-text); color: var(--wb-bg); }
.wb-bg-dark .wb-muted { color: inherit; opacity: 0.75; }
.wb-bg-dark .wb-card { background: color-mix(in srgb, var(--wb-bg) 8%, var(--wb-text)); color: inherit; }
.wb-bg-dark .wb-btn-secondary { color: inherit; border-color: currentColor; }
.wb-space-none { padding: 0; }
.wb-space-compact { padding: calc(var(--wb-section-y) * 0.5) 0; }
.wb-space-relaxed { padding: calc(var(--wb-section-y) * 1.4) 0; }
.wb-align-left .wb-section-head, .wb-align-left.wb-cta, .wb-align-left .wb-hero-copy, .wb-align-left .wb-gallery-head { text-align: left; margin-left: 0; }
.wb-align-left .wb-actions { justify-content: flex-start; }
.wb-empty { padding: 32px; text-align: center; font-size: 14px; color: var(--wb-muted); border: 1px dashed var(--wb-border); border-radius: var(--wb-radius); }
.wb-media-placeholder { background: color-mix(in srgb, var(--wb-text) 6%, transparent); border-radius: var(--wb-radius); min-height: 240px; display: grid; place-items: center; }
.wb-media-placeholder .wb-empty { border: 0; }

/* Logo cloud */
.wb-logos-head { text-align: center; font-size: 14px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 28px; }
.wb-logos-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 24px 48px; }
.wb-logos-row img { max-height: 40px; width: auto; object-fit: contain; }
.wb-logos-gray .wb-logos-row img { filter: grayscale(1); opacity: 0.7; transition: opacity 0.15s ease, filter 0.15s ease; }
.wb-logos-gray .wb-logos-row img:hover { filter: none; opacity: 1; }

/* Split content */
.wb-split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.wb-split-left .wb-split-media { order: -1; }
.wb-split-copy h2 { margin: 12px 0 16px; }
.wb-split-copy p + p { margin-top: 12px; }
.wb-split-media img, .wb-split-media .wb-media-placeholder { width: 100%; border-radius: var(--wb-radius); aspect-ratio: 4 / 3; object-fit: cover; }
.wb-split-list, .wb-plan-features { display: grid; gap: 10px; margin-top: 20px; }
.wb-split-list li, .wb-plan-features li { display: flex; align-items: flex-start; gap: 10px; }
.wb-split-list .wb-icon, .wb-plan-features .wb-icon { width: 22px; height: 22px; margin: 2px 0 0; flex-shrink: 0; border-radius: 999px; }
.wb-split-list .wb-icon svg, .wb-plan-features .wb-icon svg { width: 14px; height: 14px; }

/* Statistics */
.wb-stat { display: flex; flex-direction: column-reverse; gap: 6px; text-align: center; padding: 8px; }
.wb-stat dd { font-family: var(--wb-font-heading); font-size: 44px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
.wb-stat dt { font-size: 15px; }
.wb-align-left .wb-stat { text-align: left; }

/* Pricing */
.wb-plan { display: flex; flex-direction: column; gap: 4px; position: relative; }
.wb-plan-featured { outline: 2px solid var(--wb-primary); outline-offset: -2px; }
.wb-plan-badge { position: absolute; top: 16px; right: 16px; font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 999px; background: var(--wb-primary); color: var(--wb-on-primary) !important; }
.wb-plan-price { margin: 8px 0 4px; color: var(--wb-text) !important; }
.wb-plan-price strong { font-family: var(--wb-font-heading); font-size: 36px; letter-spacing: -0.02em; }
.wb-plan-features { margin: 16px 0 8px; color: var(--wb-text); font-size: 15px; }
.wb-plan-cta { margin-top: auto; padding-top: 16px; }
.wb-plan-cta .wb-btn { width: 100%; }

/* Media */
.wb-media-contained figure { max-width: 880px; margin: 0 auto; }
.wb-media-head { text-align: center; margin-bottom: 32px; }
.wb-media-frame { position: relative; overflow: hidden; border-radius: var(--wb-radius); }
.wb-media-frame img, .wb-media-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border: 0; }
.wb-aspect-video { aspect-ratio: 16 / 9; }
.wb-aspect-classic { aspect-ratio: 4 / 3; }
.wb-aspect-square { aspect-ratio: 1 / 1; }
.wb-media figcaption { margin-top: 12px; text-align: center; font-size: 14px; }

/* Team */
.wb-member { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
.wb-member-photo { width: 120px; height: 120px; border-radius: 999px; object-fit: cover; margin-bottom: 12px; }
.wb-member-initials { display: grid; place-items: center; font-size: 32px; font-weight: 600; background: color-mix(in srgb, var(--wb-primary) 14%, transparent); color: var(--wb-primary); }
.wb-member-role { font-size: 14px; font-weight: 500; color: var(--wb-primary); }
.wb-member .wb-muted { font-size: 15px; margin-top: 6px; }
.wb-member-link { margin-top: 8px; font-size: 14px; font-weight: 600; color: var(--wb-primary); }

@container wb-site (min-width: 601px) {
  .wb-hide-desktop { display: none; }
}

/* Tablet */
@container wb-site (max-width: 900px) {
  .wb-split-grid { grid-template-columns: 1fr; gap: 40px; }
  .wb-split-left .wb-split-media { order: 0; }
  .wb-stat dd { font-size: 36px; }
  .wb-site h1 { font-size: 38px; }
  .wb-site h2 { font-size: 28px; }
  .wb-grid { grid-template-columns: repeat(var(--wb-cols-tablet, 2), minmax(0, 1fr)); }
  .wb-hero-split .wb-hero-grid, .wb-contact-grid { grid-template-columns: 1fr; gap: 40px; }
  .wb-footer-grid { grid-template-columns: repeat(2, 1fr); }
  .wb-nav { gap: 18px; }
}

/* Mobile */
@container wb-site (max-width: 600px) {
  .wb-site h1 { font-size: 32px; }
  .wb-site h2 { font-size: 25px; }
  .wb-section { padding: calc(var(--wb-section-y) * 0.6) 0; }
  .wb-container { padding: 0 20px; }
  .wb-grid { grid-template-columns: repeat(var(--wb-cols-mobile, 1), minmax(0, 1fr)); gap: 16px; }
  .wb-hide-mobile { display: none; }
  .wb-nav, .wb-header-cta { display: none; }
  .wb-mobile-nav { display: block; }
  .wb-header-centered .wb-header-inner { flex-direction: row; padding: 0 20px; }
  .wb-hero-sub, .wb-section-head p, .wb-cta p { font-size: 17px; }
  .wb-section-head { margin-bottom: 32px; }
  .wb-footer-grid { grid-template-columns: 1fr; gap: 28px; }
  .wb-actions .wb-btn { flex: 1 1 100%; }
  .wb-member-photo { width: 96px; height: 96px; }
}

@media (prefers-reduced-motion: reduce) {
  .wb-site *, .wb-site *::before, .wb-site *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
}
`;
