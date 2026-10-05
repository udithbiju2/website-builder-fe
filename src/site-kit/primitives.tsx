import type { CSSProperties, ReactNode } from "react";
import { isExternalHref, safeHref } from "./links.ts";
import type { GridColumns, IconName, ImageRef, LinkRef, SectionSettings } from "./types.ts";

type SiteLinkProps = {
  link: LinkRef;
  className?: string;
};

export function SiteLink({ link, className }: SiteLinkProps) {
  const href = safeHref(link.href);
  const external = isExternalHref(href);
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
    </a>
  );
}

export function SiteButton({ link, tone = "primary" }: { link: LinkRef; tone?: "primary" | "secondary" }) {
  return <SiteLink link={link} className={`wb-btn wb-btn-${tone}`} />;
}

export function SiteImage({ image, className }: { image: ImageRef; className?: string }) {
  return <img src={image.url} alt={image.alt} className={className} loading="lazy" decoding="async" />;
}

const ICON_PATHS: Record<IconName, ReactNode> = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  bolt: <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />,
  shield: <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />,
  chat: <path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5H4.5z" />,
};

export function SiteIcon({ name }: { name: IconName }) {
  return (
    <span className="wb-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {ICON_PATHS[name]}
      </svg>
    </span>
  );
}

export function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

type SectionShellProps = {
  sectionId: string;
  settings: SectionSettings;
  className?: string;
  label?: string;
  children: ReactNode;
};

export function SectionShell({ sectionId, settings, className, label, children }: SectionShellProps) {
  const classes = [
    "wb-section",
    settings.background !== "default" && `wb-bg-${settings.background}`,
    settings.spacing && settings.spacing !== "default" && `wb-space-${settings.spacing}`,
    settings.align === "left" && "wb-align-left",
    settings.hideOnMobile && "wb-hide-mobile",
    settings.hideOnDesktop && "wb-hide-desktop",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={classes}
      id={settings.anchor || undefined}
      data-section-id={sectionId}
      aria-label={label}
    >
      <div className="wb-container">{children}</div>
    </section>
  );
}

export function SectionHead({ heading, intro, eyebrow }: { heading: string; intro?: string; eyebrow?: string }) {
  return (
    <div className="wb-section-head">
      {eyebrow && <p className="wb-eyebrow">{eyebrow}</p>}
      <h2>{heading}</h2>
      {intro && <p className="wb-muted">{intro}</p>}
    </div>
  );
}

export function gridStyle(columns: GridColumns, mobileColumns: GridColumns): CSSProperties {
  return {
    "--wb-cols": columns,
    "--wb-cols-tablet": Math.min(columns, 2),
    "--wb-cols-mobile": Math.min(mobileColumns, columns),
  } as CSSProperties;
}
