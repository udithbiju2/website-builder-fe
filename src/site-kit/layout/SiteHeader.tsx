import { useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  CommandIcon,
  IconSvg,
  MenuIcon,
  SearchIcon,
  SiteButton,
  SiteImage,
  SiteLink,
} from "../primitives.tsx";
import {
  HEADER_STATUS_COLORS,
  type BrandDisplayMode,
  type HeaderData,
  type HeaderDesign,
  type HeaderFeatured,
  type HeaderMenuItem,
  type HeaderStatusColor,
  type ImageRef,
  type LinkRef,
} from "../types.ts";

const PREMIUM_DESIGNS: ReadonlySet<HeaderDesign> = new Set<HeaderDesign>([
  "glass-dock",
  "split-stacked",
  "command-bar",
  "mega-menu-grid",
  "side-drawer",
  "headline-ticker",
  "luxury-editorial",
  "saas-console",
]);

function toStatusColor(value: string | undefined, fallback: HeaderStatusColor = "green"): HeaderStatusColor {
  return HEADER_STATUS_COLORS.find((color) => color === value) ?? fallback;
}

function indexLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function linkKey(link: LinkRef): string {
  return `${link.label}-${link.href}`;
}

/** An explicit `showSearch` wins; otherwise search shows once a placeholder is set. */
function isSearchEnabled(header: HeaderData): boolean {
  return header.showSearch ?? Boolean(header.searchPlaceholder);
}

export function SiteBrand({
  siteName,
  logo,
  displayMode = "auto",
  className = "",
}: {
  siteName: string;
  logo?: ImageRef;
  displayMode?: BrandDisplayMode;
  className?: string;
}) {
  const hasLogo = Boolean(logo?.url);
  const mode = displayMode ?? "auto";

  let content: ReactNode = null;

  if (mode === "text_only" || (!hasLogo && mode !== "logo_only")) {
    content = <span className="wb-brand-text">{siteName}</span>;
  } else if (mode === "logo_only") {
    content = hasLogo ? <SiteImage image={logo!} /> : <span className="wb-brand-text">{siteName}</span>;
  } else if (mode === "logo_right") {
    content = (
      <span className="wb-brand-combo wb-brand-logo-right">
        {siteName && <span className="wb-brand-text">{siteName}</span>}
        {hasLogo && <SiteImage image={logo!} />}
      </span>
    );
  } else if (mode === "logo_top") {
    content = (
      <span className="wb-brand-combo wb-brand-logo-top">
        {hasLogo && <SiteImage image={logo!} />}
        {siteName && <span className="wb-brand-text">{siteName}</span>}
      </span>
    );
  } else if (mode === "logo_left") {
    content = (
      <span className="wb-brand-combo wb-brand-logo-left">
        {hasLogo && <SiteImage image={logo!} />}
        {siteName && <span className="wb-brand-text">{siteName}</span>}
      </span>
    );
  } else {
    content = hasLogo ? <SiteImage image={logo!} /> : <span className="wb-brand-text">{siteName}</span>;
  }

  return (
    <a href="/" className={`wb-brand ${className}`.trim()}>
      {content}
    </a>
  );
}

function NavItem({ item }: { item: HeaderMenuItem }) {
  if (item.children && item.children.length > 0) {
    return (
      <div className="wb-dropdown">
        <button type="button" className="wb-dropdown-trigger" aria-haspopup="true">
          <span>{item.label}</span>
          {item.badge && <span className="wb-badge">{item.badge}</span>}
          <ChevronDownIcon />
        </button>
        <div className="wb-dropdown-menu" role="menu">
          {item.children.map((sub) => (
            <SiteLink key={linkKey(sub)} link={sub} className="wb-dropdown-item">
              <span className="wb-dropdown-item-title">
                <span>{sub.label}</span>
                {sub.badge && <span className="wb-badge">{sub.badge}</span>}
              </span>
              {sub.description && <span className="wb-dropdown-desc">{sub.description}</span>}
            </SiteLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <SiteLink link={item} className="wb-nav-item">
      <span>{item.label}</span>
      {item.badge && <span className="wb-badge">{item.badge}</span>}
    </SiteLink>
  );
}

function MegaNavItem({ item, featured }: { item: HeaderMenuItem; featured?: HeaderFeatured }) {
  if (!item.children || item.children.length === 0) return <NavItem item={item} />;
  const feature = featured?.title ? featured : undefined;

  return (
    <div className="wb-mega-dropdown">
      <button type="button" className="wb-dropdown-trigger wb-mega-trigger" aria-haspopup="true">
        <span>{item.label}</span>
        {item.badge && <span className="wb-badge">{item.badge}</span>}
        <ChevronDownIcon />
      </button>
      <div className="wb-mega-panel">
        <div className={`wb-mega-card${feature ? " wb-mega-card-featured" : ""}`}>
          <div className="wb-mega-links">
            <div className="wb-mega-heading">
              <span className="wb-mega-title">{item.label}</span>
              {item.description && <p className="wb-mega-intro">{item.description}</p>}
            </div>
            <div className="wb-mega-grid">
              {item.children.map((sub) => (
                <SiteLink key={linkKey(sub)} link={sub} className="wb-mega-item">
                  <span className="wb-mega-item-icon">
                    <IconSvg name={sub.icon} fallback="layers" />
                  </span>
                  <span className="wb-mega-item-text">
                    <span className="wb-mega-item-label">
                      <span>{sub.label}</span>
                      {sub.badge && <span className="wb-badge">{sub.badge}</span>}
                    </span>
                    {sub.description && <span className="wb-mega-item-desc">{sub.description}</span>}
                  </span>
                </SiteLink>
              ))}
            </div>
          </div>
          {feature && (
            <div className="wb-mega-feature">
              {feature.badge && <span className="wb-mega-feature-badge">{feature.badge}</span>}
              <span className="wb-mega-feature-title">{feature.title}</span>
              {feature.description && <p className="wb-mega-feature-desc">{feature.description}</p>}
              {feature.link && (
                <SiteLink link={feature.link} className="wb-mega-feature-link">
                  <span>{feature.link.label}</span>
                  <ArrowRightIcon />
                </SiteLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusDot({ color }: { color: HeaderStatusColor }) {
  return <span className={`wb-status-beacon wb-status-${color}`} aria-hidden="true" />;
}

function SearchTrigger({
  placeholder,
  shortcut = "command",
  className = "",
}: {
  placeholder: string;
  shortcut?: "command" | "slash";
  className?: string;
}) {
  return (
    <button type="button" className={`wb-hd-search ${className}`.trim()} aria-label={placeholder}>
      <SearchIcon />
      <span className="wb-hd-search-label">{placeholder}</span>
      {shortcut === "command" ? (
        <kbd className="wb-kbd">
          <CommandIcon />
          <span>K</span>
        </kbd>
      ) : (
        <kbd className="wb-kbd">/</kbd>
      )}
    </button>
  );
}

function ActionButtons({ header }: { header: HeaderData }) {
  if (!header.cta && !header.secondaryCta) return null;
  return (
    <div className="wb-header-cta">
      {header.secondaryCta && <SiteButton link={header.secondaryCta} tone="secondary" />}
      {header.cta && <SiteButton link={header.cta} tone="primary" />}
    </div>
  );
}

function DrawerActions({ header, onClose, className }: { header: HeaderData; onClose: () => void; className: string }) {
  if (!header.cta && !header.secondaryCta) return null;
  return (
    <div className={className}>
      {header.secondaryCta && (
        <div onClick={onClose}>
          <SiteButton link={header.secondaryCta} tone="secondary" />
        </div>
      )}
      {header.cta && (
        <div onClick={onClose}>
          <SiteButton link={header.cta} tone="primary" />
        </div>
      )}
    </div>
  );
}

function MobileDrawer({
  isOpen,
  onClose,
  header,
}: {
  isOpen: boolean;
  onClose: () => void;
  header: HeaderData;
}) {
  if (!isOpen) return null;
  const utilityLinks = header.utilityLinks ?? [];

  return (
    <div className="wb-drawer-portal">
      <div className="wb-drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="wb-drawer-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="wb-drawer-header">
          <SiteBrand siteName={header.siteName} logo={header.logo} displayMode={header.logoDisplay} />
          <button type="button" onClick={onClose} className="wb-drawer-close-btn" aria-label="Close navigation menu">
            <CloseIcon />
          </button>
        </div>

        <div className="wb-drawer-body">
          <nav className="wb-drawer-nav" aria-label="Mobile navigation">
            {header.menu.map((item) => (
              <div key={linkKey(item)} className="wb-drawer-item-group">
                <SiteLink link={item} className="wb-drawer-link" onClick={onClose}>
                  <span>{item.label}</span>
                  {item.badge && <span className="wb-badge">{item.badge}</span>}
                </SiteLink>
                {item.children && item.children.length > 0 && (
                  <div className="wb-drawer-submenu">
                    {item.children.map((sub) => (
                      <SiteLink key={linkKey(sub)} link={sub} className="wb-drawer-sublink" onClick={onClose}>
                        <span className="wb-drawer-sublink-title">
                          <span>{sub.label}</span>
                          {sub.badge && <span className="wb-badge">{sub.badge}</span>}
                        </span>
                        {sub.description && <span className="wb-drawer-sublink-desc">{sub.description}</span>}
                      </SiteLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {utilityLinks.length > 0 && (
            <div className="wb-drawer-utility">
              {utilityLinks.map((link) => (
                <SiteLink key={linkKey(link)} link={link} className="wb-drawer-utility-link" onClick={onClose} />
              ))}
            </div>
          )}

          <DrawerActions header={header} onClose={onClose} className="wb-drawer-actions" />
        </div>
      </div>
    </div>
  );
}

function CurtainDrawer({
  isOpen,
  onClose,
  header,
}: {
  isOpen: boolean;
  onClose: () => void;
  header: HeaderData;
}) {
  if (!isOpen) return null;
  const contactEmail = header.contactEmail?.trim();

  return (
    <div className="wb-curtain-portal">
      <div className="wb-curtain-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="wb-curtain-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="wb-curtain-header">
          <SiteBrand siteName={header.siteName} logo={header.logo} displayMode={header.logoDisplay} />
          <button type="button" onClick={onClose} className="wb-curtain-close-btn" aria-label="Close navigation menu">
            <CloseIcon />
          </button>
        </div>
        <div className="wb-curtain-body">
          <nav className="wb-curtain-nav" aria-label="Site navigation">
            {header.menu.map((item, idx) => (
              <SiteLink key={linkKey(item)} link={item} className="wb-curtain-link" onClick={onClose}>
                <span className="wb-curtain-link-num">{indexLabel(idx)}</span>
                <span className="wb-curtain-link-body">
                  <span className="wb-curtain-link-text">
                    {item.label}
                    {item.badge && <span className="wb-badge">{item.badge}</span>}
                  </span>
                  {item.description && <span className="wb-curtain-link-desc">{item.description}</span>}
                </span>
                <ArrowRightIcon className="wb-curtain-link-arrow" />
              </SiteLink>
            ))}
          </nav>
        </div>
        {(contactEmail || header.cta || header.secondaryCta) && (
          <div className="wb-curtain-footer">
            {contactEmail && (
              <div className="wb-curtain-meta">
                <span className="wb-curtain-meta-title">{header.contactLabel || "Get in touch"}</span>
                <SiteLink link={{ label: contactEmail, href: `mailto:${contactEmail}` }} className="wb-curtain-email" />
              </div>
            )}
            <DrawerActions header={header} onClose={onClose} className="wb-curtain-actions" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SiteHeader({ header }: { header: HeaderData }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (header.hidden) return null;

  const position = header.position ?? (header.sticky ? "sticky" : "static");

  let posClass = "wb-pos-static";
  if (position === "fixed") {
    posClass = "wb-pos-fixed";
  } else if (position === "floating") {
    posClass = "wb-pos-floating";
  } else if (position === "sticky") {
    posClass = "wb-pos-sticky";
  }

  const isTransparent = position === "static" && (header.design === "transparent" || header.overlay);
  const designClass = isTransparent ? "wb-header-transparent" : `wb-header-${header.design}`;
  const classes = ["wb-header", designClass, posClass, PREMIUM_DESIGNS.has(header.design) && "wb-hd"]
    .filter(Boolean)
    .join(" ");

  const hasMenu = header.menu.length > 0;
  const closeMenu = () => setMobileOpen(false);

  const brand = <SiteBrand siteName={header.siteName} logo={header.logo} displayMode={header.logoDisplay} />;

  const announcement = header.announcement && (
    <div className="wb-announcement">
      <span>{header.announcement}</span>
      {header.announcementLink && (
        <SiteLink link={header.announcementLink} className="wb-announcement-link">
          <span>{header.announcementLink.label}</span>
          <ArrowRightIcon />
        </SiteLink>
      )}
    </div>
  );

  const mobileToggle = (
    <button
      type="button"
      onClick={() => setMobileOpen(true)}
      className="wb-mobile-toggle-btn"
      aria-label="Open menu"
      aria-expanded={mobileOpen}
    >
      <MenuIcon />
    </button>
  );

  const navLinks = (className: string, label = "Main") =>
    hasMenu && (
      <nav className={className} aria-label={label}>
        {header.menu.map((item) => (
          <NavItem key={linkKey(item)} item={item} />
        ))}
      </nav>
    );

  const drawer = <MobileDrawer isOpen={mobileOpen} onClose={closeMenu} header={header} />;

  // =========================================================================
  // 1. FLOATING PILL DESIGN
  // =========================================================================
  if (header.design === "floating") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-header-floating-pill">
            {brand}
            {navLinks("wb-nav")}
            <div className="wb-header-actions">
              <ActionButtons header={header} />
              {mobileToggle}
            </div>
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 2. MINIMALIST DESIGN
  // =========================================================================
  if (header.design === "minimalist") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container wb-header-inner">
            <div className="wb-nav-left">
              {header.menu.map((item) => (
                <NavItem key={linkKey(item)} item={item} />
              ))}
            </div>
            <div className="wb-brand-center">{brand}</div>
            <div className="wb-actions-right">
              <ActionButtons header={header} />
              {mobileToggle}
            </div>
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 3. E-COMMERCE DESIGN
  // =========================================================================
  if (header.design === "ecommerce") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container">
            <div className="wb-ecommerce-top">
              {brand}
              {header.showSearch && (
                <div className="wb-search-pill" role="search">
                  <SearchIcon />
                  <span>{header.searchPlaceholder || "Search products & categories..."}</span>
                </div>
              )}
              <div className="wb-header-actions">
                {header.showAccount && (
                  <a href="/account" className="wb-header-icon-btn" aria-label="Account">
                    <IconSvg name="user" />
                  </a>
                )}
                {header.showCart && (
                  <a href="/cart" className="wb-header-icon-btn" aria-label="Cart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                    </svg>
                    {typeof header.cartCount === "number" && <span className="wb-cart-badge">{header.cartCount}</span>}
                  </a>
                )}
                <ActionButtons header={header} />
                {mobileToggle}
              </div>
            </div>
            {hasMenu && (
              <div className="wb-ecommerce-bottom">
                {header.menu.map((item, idx) => (
                  <SiteLink
                    key={linkKey(item)}
                    link={item}
                    className={`wb-ecommerce-tab ${idx === 0 ? "active" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 4. GLASS DOCK: floating frosted capsule with segmented navigation
  // =========================================================================
  if (header.design === "glass-dock") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-dock">
            <div className="wb-dock-brand">
              {brand}
              {header.badge && (
                <span className="wb-dock-badge" title={header.statusText}>
                  <StatusDot color={toStatusColor(header.statusColor)} />
                  <span>{header.badge}</span>
                </span>
              )}
            </div>
            {navLinks("wb-hd-nav wb-dock-nav")}
            <div className="wb-hd-actions">
              {isSearchEnabled(header) && (
                <SearchTrigger placeholder={header.searchPlaceholder || "Search"} className="wb-dock-search" />
              )}
              <ActionButtons header={header} />
              {mobileToggle}
            </div>
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 5. SPLIT STACKED: inverse utility strip above the primary navigation
  // =========================================================================
  if (header.design === "split-stacked") {
    const utilityLinks = header.utilityLinks ?? [];
    const hasTopBar = Boolean(header.statusText || utilityLinks.length > 0 || header.currency);
    return (
      <>
        {announcement}
        <header className={classes}>
          {hasTopBar && (
            <div className="wb-stacked-top">
              <div className="wb-container wb-stacked-top-inner">
                {header.statusText ? (
                  <span className="wb-stacked-status">
                    <StatusDot color={toStatusColor(header.statusColor)} />
                    <span>{header.statusText}</span>
                  </span>
                ) : (
                  <span />
                )}
                <div className="wb-stacked-utility">
                  {utilityLinks.map((link) => (
                    <SiteLink key={linkKey(link)} link={link} className="wb-stacked-utility-link" />
                  ))}
                  {header.currency && <span className="wb-stacked-currency">{header.currency}</span>}
                </div>
              </div>
            </div>
          )}
          <div className="wb-container wb-stacked-main">
            <div className="wb-stacked-brand">
              {brand}
              {header.tagline && <span className="wb-stacked-tagline">{header.tagline}</span>}
            </div>
            {navLinks("wb-hd-nav wb-stacked-nav")}
            <div className="wb-hd-actions">
              <ActionButtons header={header} />
              {mobileToggle}
            </div>
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 6. COMMAND BAR: spotlight search front and centre
  // =========================================================================
  if (header.design === "command-bar") {
    const showSearch = header.showSearch !== false;
    const placeholder = header.searchPlaceholder || "Search";
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container wb-cmd">
            <div className="wb-cmd-brand">
              {brand}
              {header.badge && <span className="wb-hd-chip">{header.badge}</span>}
            </div>
            {showSearch && (
              <div className="wb-cmd-search">
                <SearchTrigger placeholder={placeholder} />
              </div>
            )}
            <div className="wb-cmd-end">
              {navLinks("wb-hd-nav wb-cmd-nav")}
              {showSearch && (
                <button type="button" className="wb-hd-icon-btn wb-cmd-search-compact" aria-label={placeholder}>
                  <SearchIcon />
                </button>
              )}
              <ActionButtons header={header} />
              {mobileToggle}
            </div>
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 7. MEGA MENU GRID: full-width bento dropdown panels
  // =========================================================================
  if (header.design === "mega-menu-grid") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container wb-mega-bar">
            {brand}
            {hasMenu && (
              <nav className="wb-hd-nav wb-mega-nav" aria-label="Main">
                {header.menu.map((item) => (
                  <MegaNavItem key={linkKey(item)} item={item} featured={header.featured} />
                ))}
              </nav>
            )}
            <div className="wb-hd-actions">
              {isSearchEnabled(header) && (
                <button type="button" className="wb-hd-icon-btn" aria-label={header.searchPlaceholder || "Search"}>
                  <SearchIcon />
                </button>
              )}
              <ActionButtons header={header} />
              {mobileToggle}
            </div>
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 8. SIDE DRAWER: quiet bar that opens a full-height curtain menu
  // =========================================================================
  if (header.design === "side-drawer") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container wb-side-bar">
            <div className="wb-side-brand">{brand}</div>
            {header.tagline && (
              <span className="wb-side-tagline">
                <span className="wb-side-tagline-dot" aria-hidden="true" />
                <span>{header.tagline}</span>
              </span>
            )}
            <div className="wb-side-actions">
              {header.cta && (
                <span className="wb-side-cta">
                  <SiteButton link={header.cta} tone="primary" />
                </span>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="wb-side-trigger"
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <span className="wb-side-trigger-label">{header.menuLabel || "Menu"}</span>
                <span className="wb-side-trigger-icon">
                  <MenuIcon />
                </span>
              </button>
            </div>
          </div>
        </header>
        <CurtainDrawer isOpen={mobileOpen} onClose={closeMenu} header={header} />
      </>
    );
  }

  // =========================================================================
  // 9. HEADLINE TICKER: seamless broadcast strip above a clean bar
  // =========================================================================
  if (header.design === "headline-ticker") {
    const tickerItems = (header.announcement ?? "")
      .split(/\s*[•|]\s*/)
      .map((text) => text.trim())
      .filter(Boolean);
    const tickerStyle = {
      "--wb-ticker-duration": `${Math.max(24, tickerItems.join(" ").length * 0.3)}s`,
    } as CSSProperties;

    return (
      <>
        {tickerItems.length > 0 && (
          <div className="wb-ticker" style={tickerStyle}>
            <div className="wb-container wb-ticker-inner">
              <span className="wb-ticker-label">
                <StatusDot color={toStatusColor(header.statusColor, "red")} />
                <span>{header.statusText || "Live"}</span>
              </span>
              <div className="wb-ticker-viewport">
                <div className="wb-ticker-track">
                  {[0, 1].map((copy) => (
                    <div key={copy} className="wb-ticker-group" aria-hidden={copy === 1 ? true : undefined}>
                      {tickerItems.map((text, idx) => (
                        <span key={`${copy}-${idx}`} className="wb-ticker-item">
                          <span className="wb-ticker-sep" aria-hidden="true" />
                          <span>{text}</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {header.announcementLink && (
                <SiteLink link={header.announcementLink} className="wb-ticker-link">
                  <span>{header.announcementLink.label}</span>
                  <ArrowRightIcon />
                </SiteLink>
              )}
            </div>
          </div>
        )}
        <header className={classes}>
          <div className="wb-container wb-ticker-bar">
            {brand}
            {navLinks("wb-hd-nav wb-ticker-nav")}
            <div className="wb-hd-actions">
              <ActionButtons header={header} />
              {mobileToggle}
            </div>
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 10. LUXURY EDITORIAL: centred masthead flanked by indexed navigation
  // =========================================================================
  if (header.design === "luxury-editorial") {
    const split = Math.ceil(header.menu.length / 2);
    const leftMenu = header.menu.slice(0, split);
    const rightMenu = header.menu.slice(split);
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container">
            {(header.statusText || header.cta || header.secondaryCta) && (
              <div className="wb-editorial-top">
                <span className="wb-editorial-eyebrow">{header.statusText}</span>
                <ActionButtons header={header} />
              </div>
            )}
            <div className="wb-editorial">
              <nav className="wb-editorial-nav wb-editorial-nav-start" aria-label="Main">
                {leftMenu.map((item, idx) => (
                  <SiteLink key={linkKey(item)} link={item} className="wb-editorial-link">
                    <span className="wb-editorial-idx">{indexLabel(idx)}</span>
                    <span>{item.label}</span>
                  </SiteLink>
                ))}
              </nav>
              <div className="wb-editorial-masthead">
                {brand}
                {header.tagline && <span className="wb-editorial-tagline">{header.tagline}</span>}
              </div>
              <div className="wb-editorial-end">
                {rightMenu.length > 0 && (
                  <nav className="wb-editorial-nav wb-editorial-nav-end" aria-label="Secondary">
                    {rightMenu.map((item, idx) => (
                      <SiteLink key={linkKey(item)} link={item} className="wb-editorial-link">
                        <span className="wb-editorial-idx">{indexLabel(split + idx)}</span>
                        <span>{item.label}</span>
                      </SiteLink>
                    ))}
                  </nav>
                )}
                {mobileToggle}
              </div>
            </div>
          </div>
        </header>
        <CurtainDrawer isOpen={mobileOpen} onClose={closeMenu} header={header} />
      </>
    );
  }

  // =========================================================================
  // 11. SAAS CONSOLE: workspace bar with a scrollable tab row
  // =========================================================================
  if (header.design === "saas-console") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container">
            <div className="wb-console-bar">
              <div className="wb-console-start">
                {brand}
                {header.badge && (
                  <>
                    <span className="wb-console-divider" aria-hidden="true" />
                    <span className="wb-console-workspace">
                      <span className="wb-console-avatar" aria-hidden="true">
                        {header.badge.charAt(0).toUpperCase()}
                      </span>
                      <span className="wb-console-workspace-name">{header.badge}</span>
                      <ChevronDownIcon />
                    </span>
                  </>
                )}
              </div>
              <div className="wb-hd-actions">
                {isSearchEnabled(header) && (
                  <SearchTrigger
                    placeholder={header.searchPlaceholder || "Search"}
                    shortcut="slash"
                    className="wb-console-search"
                  />
                )}
                {header.statusText && (
                  <span className="wb-console-status">
                    <StatusDot color={toStatusColor(header.statusColor)} />
                    <span>{header.statusText}</span>
                  </span>
                )}
                <ActionButtons header={header} />
                {mobileToggle}
              </div>
            </div>
            {hasMenu && (
              <nav className="wb-console-tabs" aria-label="Main">
                {header.menu.map((item, idx) => (
                  <SiteLink
                    key={linkKey(item)}
                    link={item}
                    className={`wb-console-tab${idx === 0 ? " is-active" : ""}`}
                  >
                    <span>{item.label}</span>
                    {item.badge && <span className="wb-console-tab-badge">{item.badge}</span>}
                  </SiteLink>
                ))}
              </nav>
            )}
          </div>
        </header>
        {drawer}
      </>
    );
  }

  // =========================================================================
  // 12. STANDARD LAYOUTS (logo-left, centered, classical, comprehensive, transparent)
  // =========================================================================
  return (
    <>
      {announcement}
      <header className={classes}>
        <div className="wb-container wb-header-inner">
          {brand}
          {navLinks("wb-nav")}
          <div className="wb-header-actions">
            <ActionButtons header={header} />
            {mobileToggle}
          </div>
        </div>
      </header>
      {drawer}
    </>
  );
}
