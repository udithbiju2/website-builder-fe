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
  background: var(--wb-bg);
  color: var(--wb-text);
  font-family: var(--wb-font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  --wb-border: color-mix(in srgb, var(--wb-text) 12%, transparent);
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
.wb-announcement { background: var(--wb-text); color: var(--wb-bg); text-align: center; font-size: 14px; padding: 8px 24px; }
.wb-header { background: var(--wb-bg); border-bottom: 1px solid var(--wb-border); position: relative; z-index: 20; }
.wb-header.wb-sticky { position: sticky; top: 0; }
.wb-header-inner { display: flex; align-items: center; gap: 32px; min-height: 72px; }
.wb-brand { display: inline-flex; align-items: center; gap: 10px; font-family: var(--wb-font-heading); font-weight: 700; font-size: 20px; }
.wb-brand img { max-height: 40px; width: auto; }
.wb-nav { display: flex; align-items: center; gap: 28px; margin-left: auto; font-size: 15px; font-weight: 500; }
.wb-nav a:hover { color: var(--wb-primary); }
.wb-header-cta { margin-left: 4px; }
.wb-header-centered .wb-header-inner { flex-direction: column; gap: 12px; padding: 20px 24px 16px; }
.wb-header-centered .wb-nav { margin-left: 0; }
.wb-mobile-nav { display: none; margin-left: auto; }
.wb-mobile-nav > summary {
  list-style: none; cursor: pointer; display: grid; place-items: center;
  width: 44px; height: 44px; border-radius: var(--wb-radius); border: 1px solid var(--wb-border);
}
.wb-mobile-nav > summary::-webkit-details-marker { display: none; }
.wb-mobile-nav > summary svg { width: 22px; height: 22px; }
.wb-mobile-nav[open] .wb-mobile-panel {
  position: absolute; left: 0; right: 0; top: 100%;
  display: flex; flex-direction: column; gap: 4px; padding: 16px 24px 24px;
  background: var(--wb-bg); border-bottom: 1px solid var(--wb-border);
  box-shadow: 0 12px 24px rgb(0 0 0 / 0.08);
}
.wb-mobile-panel a { padding: 10px 0; font-weight: 500; }
.wb-mobile-panel .wb-btn { margin-top: 8px; }

/* Hero */
.wb-hero-centered { text-align: center; }
.wb-hero-centered .wb-hero-copy { max-width: 760px; margin: 0 auto; }
.wb-hero-centered .wb-actions { justify-content: center; }
.wb-hero h1 { margin-top: 12px; }
.wb-hero-sub { margin-top: 20px; font-size: 19px; }
.wb-hero-centered .wb-hero-media { margin-top: 48px; }
.wb-hero-split .wb-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.wb-hero-media img { width: 100%; border-radius: var(--wb-radius); object-fit: cover; }

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

/* Footer */
.wb-footer { background: var(--wb-surface); border-top: 1px solid var(--wb-border); padding: 64px 0 32px; font-size: 15px; }
.wb-footer-grid { display: grid; grid-template-columns: 1.4fr repeat(var(--wb-footer-cols, 3), 1fr); gap: 40px; }
.wb-footer h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; }
.wb-footer li + li { margin-top: 8px; }
.wb-footer a:hover { color: var(--wb-primary); }
.wb-footer-about p { margin-top: 12px; max-width: 320px; }
.wb-footer-bottom {
  margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--wb-border);
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; font-size: 14px;
}
.wb-social { display: flex; flex-wrap: wrap; gap: 16px; }
.wb-footer-simple { padding: 32px 0; }
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
