import {
  ChevronDownIcon,
  MenuIcon,
  SiteButton,
  SiteImage,
  SiteLink,
} from "../primitives.tsx";
import type { BrandDisplayMode, HeaderData, HeaderMenuItem, ImageRef } from "../types.ts";

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

  let content: React.ReactNode = null;

  if (mode === "text_only" || (!hasLogo && mode !== "logo_only")) {
    content = <span className="wb-brand-text">{siteName}</span>;
  } else if (mode === "logo_only") {
    content = hasLogo ? <SiteImage image={logo!} /> : <span className="wb-brand-text">{siteName}</span>;
  } else if (mode === "logo_right") {
    // Brand Name on Left, Logo on Right
    content = (
      <span className="wb-brand-combo wb-brand-logo-right">
        {siteName && <span className="wb-brand-text">{siteName}</span>}
        {hasLogo && <SiteImage image={logo!} />}
      </span>
    );
  } else if (mode === "logo_top") {
    // Logo on Top, Brand Name below
    content = (
      <span className="wb-brand-combo wb-brand-logo-top">
        {hasLogo && <SiteImage image={logo!} />}
        {siteName && <span className="wb-brand-text">{siteName}</span>}
      </span>
    );
  } else if (mode === "logo_left") {
    // Logo on Left, Brand Name on Right
    content = (
      <span className="wb-brand-combo wb-brand-logo-left">
        {hasLogo && <SiteImage image={logo!} />}
        {siteName && <span className="wb-brand-text">{siteName}</span>}
      </span>
    );
  } else {
    // "auto" mode: if logo image exists, show logo image; otherwise show site name
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
            <a key={`${sub.label}-${sub.href}`} href={sub.href} className="wb-dropdown-item" role="menuitem">
              <span className="wb-dropdown-item-title">
                <span>{sub.label}</span>
                {sub.badge && <span className="wb-badge">{sub.badge}</span>}
              </span>
              {sub.description && <span className="wb-dropdown-desc">{sub.description}</span>}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <SiteLink link={item} />
      {item.badge && <span className="wb-badge">{item.badge}</span>}
    </span>
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

export default function SiteHeader({ header }: { header: HeaderData }) {
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
  const classes = ["wb-header", designClass, posClass].filter(Boolean).join(" ");

  const brand = (
    <SiteBrand
      siteName={header.siteName}
      logo={header.logo}
      displayMode={header.logoDisplay}
    />
  );

  const announcement = header.announcement && (
    <div className="wb-announcement">
      <span>{header.announcement}</span>
      {header.announcementLink && (
        <a href={header.announcementLink.href}>{header.announcementLink.label} &rarr;</a>
      )}
    </div>
  );

  const mobileNav = (
    <details className="wb-mobile-nav">
      <summary aria-label="Open menu">
        <MenuIcon />
      </summary>
      <nav className="wb-mobile-panel" aria-label="Mobile">
        {header.menu.map((item) => (
          <div key={`${item.label}-${item.href}`} className="flex flex-col">
            <SiteLink link={item} />
            {item.children && item.children.length > 0 && (
              <div className="wb-mobile-submenu">
                {item.children.map((sub) => (
                  <a key={`${sub.label}-${sub.href}`} href={sub.href} className="text-sm text-[var(--wb-muted)]">
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {(header.secondaryCta || header.cta) && (
          <div className="wb-mobile-actions">
            {header.secondaryCta && <SiteButton link={header.secondaryCta} tone="secondary" />}
            {header.cta && <SiteButton link={header.cta} tone="primary" />}
          </div>
        )}
      </nav>
    </details>
  );

  // 1. Floating Pill Design
  if (header.design === "floating") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-header-floating-pill">
            {brand}
            {header.menu.length > 0 && (
              <nav className="wb-nav" aria-label="Main">
                {header.menu.map((item) => (
                  <NavItem key={`${item.label}-${item.href}`} item={item} />
                ))}
              </nav>
            )}
            <div className="flex items-center gap-3">
              <ActionButtons header={header} />
              {mobileNav}
            </div>
          </div>
        </header>
      </>
    );
  }

  // 2. Minimalist Design (Nav left, Centered logo, Actions right)
  if (header.design === "minimalist") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container wb-header-inner">
            <div className="wb-nav-left hidden sm:flex">
              {header.menu.map((item) => (
                <NavItem key={`${item.label}-${item.href}`} item={item} />
              ))}
            </div>
            <div className="wb-brand-center">{brand}</div>
            <div className="wb-actions-right hidden sm:flex">
              <ActionButtons header={header} />
            </div>
            {mobileNav}
          </div>
        </header>
      </>
    );
  }

  // 3. Classical Design (Logo left, Nav center, Actions right)
  if (header.design === "classical") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container wb-header-inner">
            {brand}
            {header.menu.length > 0 && (
              <nav className="wb-nav hidden sm:flex" aria-label="Main">
                {header.menu.map((item) => (
                  <NavItem key={`${item.label}-${item.href}`} item={item} />
                ))}
              </nav>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <ActionButtons header={header} />
              {mobileNav}
            </div>
          </div>
        </header>
      </>
    );
  }

  // 4. Comprehensive Design (Logo left, Expanded nav, Action buttons)
  if (header.design === "comprehensive") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container wb-header-inner">
            {brand}
            {header.menu.length > 0 && (
              <nav className="wb-nav hidden sm:flex" aria-label="Main">
                {header.menu.map((item) => (
                  <NavItem key={`${item.label}-${item.href}`} item={item} />
                ))}
              </nav>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <ActionButtons header={header} />
              {mobileNav}
            </div>
          </div>
        </header>
      </>
    );
  }

  // 5. Standard (logo-left, centered, transparent)
  return (
    <>
      {announcement}
      <header className={classes}>
        <div className="wb-container wb-header-inner">
          {brand}
          {header.menu.length > 0 && (
            <nav className="wb-nav hidden sm:flex" aria-label="Main">
              {header.menu.map((item) => (
                <NavItem key={`${item.label}-${item.href}`} item={item} />
              ))}
            </nav>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <ActionButtons header={header} />
            {mobileNav}
          </div>
        </div>
      </header>
    </>
  );
}
