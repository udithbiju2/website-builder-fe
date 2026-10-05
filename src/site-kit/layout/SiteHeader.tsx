import {
  CartIcon,
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  SiteButton,
  SiteImage,
  SiteLink,
  UserIcon,
} from "../primitives.tsx";
import type { HeaderData, HeaderMenuItem } from "../types.ts";

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

function UtilityControls({ header }: { header: HeaderData }) {
  const hasUtilities = header.showSearch || header.showAccount || header.showCart || header.currency;
  if (!hasUtilities) return null;

  return (
    <div className="wb-header-actions">
      {header.currency && (
        <span className="text-xs font-semibold px-2 py-1 rounded-full border border-[var(--wb-border)]">
          {header.currency}
        </span>
      )}
      {header.showSearch && (
        <button type="button" className="wb-header-icon-btn" aria-label="Search">
          <SearchIcon />
        </button>
      )}
      {header.showAccount && (
        <a href="/login" className="wb-header-icon-btn" aria-label="Account">
          <UserIcon />
        </a>
      )}
      {header.showCart && (
        <a href="/cart" className="wb-header-icon-btn" aria-label="Cart">
          <CartIcon />
          {(header.cartCount ?? 0) > 0 && <span className="wb-cart-badge">{header.cartCount}</span>}
        </a>
      )}
    </div>
  );
}

export default function SiteHeader({ header }: { header: HeaderData }) {
  if (header.hidden) return null;

  const isSticky = header.sticky || header.position === "sticky";
  const isFixed = header.position === "fixed";
  const isFloating = header.design === "floating" || header.position === "floating";
  const isTransparent = header.design === "transparent" || header.overlay;

  const positionClass = isFloating
    ? "wb-floating"
    : isTransparent
      ? "wb-transparent"
      : isFixed
        ? "wb-fixed"
        : isSticky
          ? "wb-sticky"
          : "";

  const classes = ["wb-header", `wb-header-${header.design}`, positionClass].filter(Boolean).join(" ");

  const brand = (
    <a href="/" className="wb-brand">
      {header.logo ? <SiteImage image={header.logo} /> : header.siteName}
    </a>
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
        {(header.secondaryCta || header.cta || header.showSearch || header.showCart) && (
          <div className="wb-mobile-actions">
            {header.showSearch && (
              <div className="wb-search-pill mb-2">
                <SearchIcon />
                <span>Search products or pages...</span>
              </div>
            )}
            {header.secondaryCta && <SiteButton link={header.secondaryCta} tone="secondary" />}
            {header.cta && <SiteButton link={header.cta} tone="primary" />}
          </div>
        )}
      </nav>
    </details>
  );

  // 1. Floating Pill Design
  if (header.design === "floating" || isFloating) {
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
              <UtilityControls header={header} />
              <ActionButtons header={header} />
              {mobileNav}
            </div>
          </div>
        </header>
      </>
    );
  }

  // 2. E-commerce Dual-Tier Design
  if (header.design === "ecommerce") {
    return (
      <>
        {announcement}
        <header className={classes}>
          <div className="wb-container">
            <div className="wb-ecommerce-top">
              {brand}
              {header.showSearch !== false && (
                <div className="hidden sm:inline-flex wb-search-pill">
                  <SearchIcon />
                  <span>Search store...</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <UtilityControls header={header} />
                <ActionButtons header={header} />
                {mobileNav}
              </div>
            </div>
            {header.menu.length > 0 && (
              <nav className="wb-ecommerce-bottom hidden sm:flex" aria-label="Categories">
                {header.menu.map((item, idx) => (
                  <a
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className={`wb-ecommerce-tab ${idx === 0 ? "active" : ""}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </header>
      </>
    );
  }

  // 3. Minimalist Design (Nav left, Centered logo, Actions right)
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
              <UtilityControls header={header} />
              <ActionButtons header={header} />
            </div>
            {mobileNav}
          </div>
        </header>
      </>
    );
  }

  // 4. Classical Design (Logo left, Nav center, Actions right)
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
              <UtilityControls header={header} />
              <ActionButtons header={header} />
              {mobileNav}
            </div>
          </div>
        </header>
      </>
    );
  }

  // 5. Comprehensive Design (Logo left, Mega nav, Search + Action buttons)
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
              <UtilityControls header={header} />
              <ActionButtons header={header} />
              {mobileNav}
            </div>
          </div>
        </header>
      </>
    );
  }

  // 6. Standard (logo-left, centered, transparent)
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
            <UtilityControls header={header} />
            <ActionButtons header={header} />
            {mobileNav}
          </div>
        </div>
      </header>
    </>
  );
}
