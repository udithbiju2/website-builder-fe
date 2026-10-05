import type { CSSProperties } from "react";
import { safeHref } from "../links.ts";
import { SiteImage, SiteLink } from "../primitives.tsx";
import type { FooterData } from "../types.ts";

function SocialLinks({ footer }: { footer: FooterData }) {
  if (footer.social.length === 0) return null;
  return (
    <div className="wb-social">
      {footer.social.map((link) => (
        <SiteLink key={`${link.label}-${link.href}`} link={link} />
      ))}
    </div>
  );
}

export default function SiteFooter({ footer }: { footer: FooterData }) {
  if (footer.design === "simple") {
    return (
      <footer className="wb-footer wb-footer-simple">
        <div className="wb-container wb-footer-bottom">
          <span>{footer.copyright}</span>
          <SocialLinks footer={footer} />
        </div>
      </footer>
    );
  }

  const { contact } = footer;
  const hasContact = Boolean(contact && (contact.email || contact.phone || contact.address));
  const columnCount = footer.columns.length + (hasContact ? 1 : 0);

  return (
    <footer className="wb-footer">
      <div className="wb-container">
        <div className="wb-footer-grid" style={{ "--wb-footer-cols": Math.max(columnCount, 1) } as CSSProperties}>
          <div className="wb-footer-about">
            <a href="/" className="wb-brand">
              {footer.logo ? <SiteImage image={footer.logo} /> : footer.siteName}
            </a>
            {footer.description && <p className="wb-muted">{footer.description}</p>}
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <SiteLink link={link} className="wb-muted" />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {hasContact && contact && (
            <div>
              <h3>Contact</h3>
              <ul className="wb-muted">
                {contact.email && (
                  <li>
                    <a href={safeHref(`mailto:${contact.email}`)}>{contact.email}</a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a href={safeHref(`tel:${contact.phone.replace(/\s+/g, "")}`)}>{contact.phone}</a>
                  </li>
                )}
                {contact.address && <li>{contact.address}</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="wb-footer-bottom wb-muted">
          <span>{footer.copyright}</span>
          <SocialLinks footer={footer} />
        </div>
      </div>
    </footer>
  );
}
