import { MenuIcon, SiteButton, SiteImage, SiteLink } from "../primitives.tsx";
import type { HeaderData } from "../types.ts";

export default function SiteHeader({ header }: { header: HeaderData }) {
  const classes = ["wb-header", `wb-header-${header.design}`, header.sticky && "wb-sticky"].filter(Boolean).join(" ");

  return (
    <>
      {header.announcement && <div className="wb-announcement">{header.announcement}</div>}
      <header className={classes}>
        <div className="wb-container wb-header-inner">
          <a href="/" className="wb-brand">
            {header.logo ? <SiteImage image={header.logo} /> : header.siteName}
          </a>

          {header.menu.length > 0 && (
            <nav className="wb-nav" aria-label="Main">
              {header.menu.map((link) => (
                <SiteLink key={`${link.label}-${link.href}`} link={link} />
              ))}
              {header.cta && (
                <span className="wb-header-cta">
                  <SiteButton link={header.cta} />
                </span>
              )}
            </nav>
          )}

          {(header.menu.length > 0 || header.cta) && (
            <details className="wb-mobile-nav">
              <summary aria-label="Open menu">
                <MenuIcon />
              </summary>
              <nav className="wb-mobile-panel" aria-label="Mobile">
                {header.menu.map((link) => (
                  <SiteLink key={`${link.label}-${link.href}`} link={link} />
                ))}
                {header.cta && <SiteButton link={header.cta} />}
              </nav>
            </details>
          )}
        </div>
      </header>
    </>
  );
}
