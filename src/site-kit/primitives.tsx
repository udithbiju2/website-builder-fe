import type { CSSProperties, ReactNode } from "react";
import { isExternalHref, safeHref } from "./links.ts";
import type { GridColumns, IconName, ImageRef, LinkRef, SectionSettings } from "./types.ts";

type SiteLinkProps = {
  link: LinkRef;
  className?: string;
  children?: ReactNode;
};

export function SiteLink({ link, className, children }: SiteLinkProps) {
  const href = safeHref(link.href);
  const external = isExternalHref(href);
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children ?? link.label}
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

export function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function StarFilledIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function BottomShapeDivider({ shape }: { shape?: "none" | "wave" | "curve" | "slant" | "tilt" }) {
  if (!shape || shape === "none") return null;
  return (
    <div className={`wb-shape-divider wb-shape-${shape}`} aria-hidden="true">
      {shape === "wave" && (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      )}
      {shape === "curve" && (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C400,120 800,120 1200,0 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      )}
      {shape === "slant" && (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M1200,0 L0,120 L1200,120 Z" fill="currentColor" />
        </svg>
      )}
      {shape === "tilt" && (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 L1200,100 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  );
}

export function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes("facebook") || p.includes("fb")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    );
  }
  if (p.includes("twitter") || p.includes("x.com") || p === "x") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (p.includes("instagram") || p.includes("insta")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (p.includes("pinterest") || p.includes("pin")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026l.032-.026z" />
      </svg>
    );
  }
  if (p.includes("youtube") || p.includes("yt")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (p.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 10-1.64-1.64 1.64 1.64 0 001.64 1.64m1.39 9.74V9.93H5.07v8.57z" />
      </svg>
    );
  }
  if (p.includes("github")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  // Generic Globe / Link
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

export function PaymentIconsBar({ methods = ["paypal", "amex", "discover", "mastercard", "visa"] }: { methods?: string[] }) {
  return (
    <div className="wb-payment-badges" aria-label="Accepted payment methods">
      {methods.map((method) => {
        const m = method.toLowerCase();
        return (
          <span key={m} className={`wb-payment-badge wb-pay-${m}`} title={method}>
            {m === "paypal" && <span className="wb-pay-text font-bold text-[#003087]">PayPal</span>}
            {m === "amex" && <span className="wb-pay-text font-bold text-[#006fcf]">AMEX</span>}
            {m === "discover" && <span className="wb-pay-text font-bold text-[#f26522]">DISCOVER</span>}
            {m === "mastercard" && (
              <span className="wb-pay-mc-circles">
                <span className="wb-pay-mc-red" />
                <span className="wb-pay-mc-yellow" />
              </span>
            )}
            {m === "visa" && <span className="wb-pay-text font-black italic text-[#1a1f71]">VISA</span>}
            {m === "applepay" && <span className="wb-pay-text font-semibold"> Pay</span>}
            {!["paypal", "amex", "discover", "mastercard", "visa", "applepay"].includes(m) && (
              <span className="wb-pay-text uppercase text-[10px]">{method}</span>
            )}
          </span>
        );
      })}
    </div>
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
  const customColors = settings.customColors;
  const customStyle: CSSProperties = {
    ...(customColors?.background ? { "--wb-bg": customColors.background, backgroundColor: customColors.background } : {}),
    ...(customColors?.text ? { "--wb-text": customColors.text, color: customColors.text } : {}),
    ...(customColors?.primary ? { "--wb-primary": customColors.primary } : {}),
    ...(customColors?.muted ? { "--wb-muted": customColors.muted } : {}),
    ...(customColors?.border ? { "--wb-border": customColors.border } : {}),
  };

  const classes = [
    "wb-section",
    settings.background !== "default" && !customColors?.background && `wb-bg-${settings.background}`,
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
      style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
    >
      <div className="wb-container">{children}</div>
    </section>
  );
}

export function SectionHead({ heading, intro, eyebrow }: { heading?: string; intro?: string; eyebrow?: string }) {
  if (!heading && !intro && !eyebrow) return null;
  return (
    <div className="wb-section-head">
      {eyebrow && <p className="wb-eyebrow">{eyebrow}</p>}
      {heading && <h2>{heading}</h2>}
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
