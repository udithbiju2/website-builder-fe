import { safeHref } from "../links.ts";
import { SectionHead, SectionShell, SiteIcon } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

function MailIcon() {
  return (
    <svg className="wb-contact-ch-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 4h14c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.75" />
      <polyline points="19,6 10,13 1,6" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="wb-contact-ch-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M18.33 14.1v2.5a1.67 1.67 0 01-1.82 1.67 16.5 16.5 0 01-7.2-2.56 16.25 16.25 0 01-5-5A16.5 16.5 0 011.75 3.5 1.67 1.67 0 013.42 1.67h2.5a1.67 1.67 0 011.67 1.43c.1.75.3 1.5.58 2.2a1.67 1.67 0 01-.38 1.76L6.73 8.12a13.33 13.33 0 005 5l1.06-1.06a1.67 1.67 0 011.76-.38c.7.28 1.45.48 2.2.58a1.67 1.67 0 011.58 1.84z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="wb-contact-ch-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17.5 8.333c0 5-7.5 10-7.5 10s-7.5-5-7.5-10a7.5 7.5 0 1115 0z" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="10" cy="8.333" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="wb-contact-ch-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.75" />
      <polyline points="10 5 10 10 13.5 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ChannelIconRender({ icon }: { icon?: string }) {
  if (icon === "phone") return <PhoneIcon />;
  if (icon === "chat") return <SiteIcon name="chat" />;
  if (icon === "user") return <SiteIcon name="user" />;
  return <MailIcon />;
}

function ContactForm({
  submitLabel,
  formHeading,
  serviceOptions,
}: {
  submitLabel: string;
  formHeading?: string;
  serviceOptions?: string[];
}) {
  return (
    <form className="wb-contact-form" onSubmit={(e) => e.preventDefault()}>
      {formHeading && <h3 className="wb-contact-form-title">{formHeading}</h3>}

      {serviceOptions && serviceOptions.length > 0 && (
        <div className="wb-contact-services-group">
          <label className="wb-contact-field-label">I'm interested in:</label>
          <div className="wb-contact-chips-row">
            {serviceOptions.map((opt, i) => (
              <label key={i} className="wb-contact-chip">
                <input type="checkbox" name="service" value={opt} defaultChecked={i === 0} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="wb-contact-input-row">
        <label className="wb-contact-field">
          <span className="wb-contact-field-label">Your name</span>
          <input
            type="text"
            name="name"
            placeholder="Jane Doe"
            autoComplete="name"
            required
            className="wb-contact-input"
          />
        </label>
        <label className="wb-contact-field">
          <span className="wb-contact-field-label">Email address</span>
          <input
            type="email"
            name="email"
            placeholder="jane@company.com"
            autoComplete="email"
            required
            className="wb-contact-input"
          />
        </label>
      </div>

      <label className="wb-contact-field">
        <span className="wb-contact-field-label">Project details / Message</span>
        <textarea
          name="message"
          placeholder="Tell us about your timeline, scope, and objectives..."
          rows={4}
          required
          className="wb-contact-textarea"
        />
      </label>

      <div className="wb-contact-form-footer">
        <button type="submit" className="wb-btn wb-btn-primary wb-contact-submit-btn">
          {submitLabel}
        </button>
        <span className="wb-contact-privacy-note">
          🔒 We respect your privacy. No spam.
        </span>
      </div>
    </form>
  );
}

export default function ContactSection({ section }: { section: SectionOf<"contact"> }) {
  const { data } = section;
  const variant = data.variant || "split-form";
  const cardStyle = data.cardStyle || "default";
  const align = data.align || "left";

  const hasStandardDetails = Boolean(data.email || data.phone || data.address || data.officeHours);

  // 1. Cards Hub Variant (Multi-Channel Grid + Direct Access)
  if (variant === "cards-hub") {
    return (
      <SectionShell
        sectionId={section.id}
        settings={section.settings}
        className={`wb-contact-section wb-contact-variant-hub wb-align-${align}`}
        label={data.heading}
      >
        <SectionHead
          heading={data.heading}
          intro={data.text}
          eyebrow={data.eyebrow}
        />

        <div className="wb-contact-hub-grid">
          {data.email && (
            <a
              href={safeHref(`mailto:${data.email}`)}
              className={`wb-contact-hub-card wb-contact-card-style-${cardStyle}`}
            >
              <div className="wb-contact-hub-icon-wrap">
                <MailIcon />
              </div>
              <span className="wb-contact-hub-label">Email Us</span>
              <strong className="wb-contact-hub-value">{data.email}</strong>
              <span className="wb-contact-hub-action">Send direct email →</span>
            </a>
          )}

          {data.phone && (
            <a
              href={safeHref(`tel:${data.phone.replace(/\s+/g, "")}`)}
              className={`wb-contact-hub-card wb-contact-card-style-${cardStyle}`}
            >
              <div className="wb-contact-hub-icon-wrap">
                <PhoneIcon />
              </div>
              <span className="wb-contact-hub-label">Call Directly</span>
              <strong className="wb-contact-hub-value">{data.phone}</strong>
              <span className="wb-contact-hub-action">One-tap dial →</span>
            </a>
          )}

          {data.address && (
            <div className={`wb-contact-hub-card wb-contact-card-style-${cardStyle}`}>
              <div className="wb-contact-hub-icon-wrap">
                <PinIcon />
              </div>
              <span className="wb-contact-hub-label">Office Headquarters</span>
              <strong className="wb-contact-hub-value">{data.address}</strong>
              {data.officeHours && (
                <span className="wb-contact-hub-subtext">{data.officeHours}</span>
              )}
            </div>
          )}

          {data.channels?.map((ch, idx) => (
            <div
              key={idx}
              className={`wb-contact-hub-card wb-contact-card-style-${cardStyle}`}
            >
              <div className="wb-contact-hub-icon-wrap">
                <ChannelIconRender icon={ch.icon} />
              </div>
              <span className="wb-contact-hub-label">{ch.label}</span>
              <strong className="wb-contact-hub-value">{ch.value}</strong>
              {ch.description && (
                <span className="wb-contact-hub-subtext">{ch.description}</span>
              )}
            </div>
          ))}
        </div>

        {data.showForm && (
          <div className={`wb-contact-hub-form-wrap wb-contact-card-style-${cardStyle}`}>
            <ContactForm
              submitLabel={data.submitLabel}
              formHeading={data.formHeading || "Send an online enquiry"}
              serviceOptions={data.serviceOptions}
            />
          </div>
        )}
      </SectionShell>
    );
  }

  // 2. Minimal Editorial Variant (Swiss Architectural Line Form)
  if (variant === "minimal-editorial") {
    return (
      <SectionShell
        sectionId={section.id}
        settings={section.settings}
        className={`wb-contact-section wb-contact-variant-editorial wb-align-${align}`}
        label={data.heading}
      >
        <div className="wb-contact-editorial-frame">
          <div className="wb-contact-editorial-grid">
            <div className="wb-contact-editorial-left">
              {data.eyebrow && (
                <span className="wb-contact-eyebrow">{data.eyebrow}</span>
              )}
              <h2 className="wb-contact-editorial-heading">{data.heading}</h2>
              {data.text && <p className="wb-contact-editorial-text">{data.text}</p>}

              {hasStandardDetails && (
                <div className="wb-contact-editorial-details">
                  {data.email && (
                    <div className="wb-contact-editorial-item">
                      <span className="wb-contact-editorial-item-label">Email</span>
                      <a href={safeHref(`mailto:${data.email}`)} className="wb-contact-link">
                        {data.email}
                      </a>
                    </div>
                  )}
                  {data.phone && (
                    <div className="wb-contact-editorial-item">
                      <span className="wb-contact-editorial-item-label">Phone</span>
                      <a href={safeHref(`tel:${data.phone.replace(/\s+/g, "")}`)} className="wb-contact-link">
                        {data.phone}
                      </a>
                    </div>
                  )}
                  {data.address && (
                    <div className="wb-contact-editorial-item">
                      <span className="wb-contact-editorial-item-label">Location</span>
                      <span className="wb-contact-plain-text">{data.address}</span>
                    </div>
                  )}
                  {data.responseTime && (
                    <div className="wb-contact-response-badge">
                      <span className="wb-contact-pulse-dot" /> {data.responseTime}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="wb-contact-editorial-right">
              {data.showForm && (
                <div className="wb-contact-editorial-form-box">
                  <ContactForm
                    submitLabel={data.submitLabel}
                    formHeading={data.formHeading}
                    serviceOptions={data.serviceOptions}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  // 3. Floating Glass Variant (Framed Ambient Glassmorphic Card)
  if (variant === "floating-glass") {
    return (
      <SectionShell
        sectionId={section.id}
        settings={section.settings}
        className={`wb-contact-section wb-contact-variant-floating wb-align-${align}`}
        label={data.heading}
      >
        <div className={`wb-contact-glass-container wb-contact-card-style-${cardStyle}`}>
          <div className="wb-contact-glass-grid">
            <div className="wb-contact-glass-info">
              {data.eyebrow && (
                <div className="wb-contact-eyebrow-wrap">
                  <span className="wb-contact-pulse-dot" />
                  <span className="wb-contact-eyebrow">{data.eyebrow}</span>
                </div>
              )}
              <h2 className="wb-contact-glass-heading">{data.heading}</h2>
              {data.text && <p className="wb-contact-glass-text">{data.text}</p>}

              <div className="wb-contact-glass-channels">
                {data.email && (
                  <a href={safeHref(`mailto:${data.email}`)} className="wb-contact-channel-pill">
                    <MailIcon />
                    <span>{data.email}</span>
                  </a>
                )}
                {data.phone && (
                  <a href={safeHref(`tel:${data.phone.replace(/\s+/g, "")}`)} className="wb-contact-channel-pill">
                    <PhoneIcon />
                    <span>{data.phone}</span>
                  </a>
                )}
                {data.address && (
                  <div className="wb-contact-channel-pill">
                    <PinIcon />
                    <span>{data.address}</span>
                  </div>
                )}
              </div>

              {data.responseTime && (
                <div className="wb-contact-response-pill">
                  <span className="wb-contact-pulse-dot" /> {data.responseTime}
                </div>
              )}
            </div>

            {data.showForm && (
              <div className="wb-contact-glass-form-box">
                <ContactForm
                  submitLabel={data.submitLabel}
                  formHeading={data.formHeading || "Send a direct message"}
                  serviceOptions={data.serviceOptions}
                />
              </div>
            )}
          </div>
        </div>
      </SectionShell>
    );
  }

  // 4. Split Form Variant (Default Modern Asymmetric Split Screen)
  return (
    <SectionShell
      sectionId={section.id}
      settings={section.settings}
      className={`wb-contact-section wb-contact-variant-split wb-align-${align}`}
      label={data.heading}
    >
      <div className={`wb-contact-split-container${data.showForm ? "" : " wb-contact-solo"}`}>
        <div className="wb-contact-split-info">
          {data.eyebrow && (
            <div className="wb-contact-eyebrow-wrap">
              <span className="wb-contact-pulse-dot" />
              <span className="wb-contact-eyebrow">{data.eyebrow}</span>
            </div>
          )}
          <h2 className="wb-contact-title">{data.heading}</h2>
          {data.text && <p className="wb-contact-intro">{data.text}</p>}

          {hasStandardDetails && (
            <div className="wb-contact-cards-stack">
              {data.email && (
                <a
                  href={safeHref(`mailto:${data.email}`)}
                  className={`wb-contact-info-card wb-contact-card-style-${cardStyle}`}
                >
                  <div className="wb-contact-icon-box">
                    <MailIcon />
                  </div>
                  <div className="wb-contact-info-text">
                    <span className="wb-contact-info-label">Email Support</span>
                    <strong className="wb-contact-info-value">{data.email}</strong>
                  </div>
                </a>
              )}

              {data.phone && (
                <a
                  href={safeHref(`tel:${data.phone.replace(/\s+/g, "")}`)}
                  className={`wb-contact-info-card wb-contact-card-style-${cardStyle}`}
                >
                  <div className="wb-contact-icon-box">
                    <PhoneIcon />
                  </div>
                  <div className="wb-contact-info-text">
                    <span className="wb-contact-info-label">Direct Phone</span>
                    <strong className="wb-contact-info-value">{data.phone}</strong>
                  </div>
                </a>
              )}

              {data.address && (
                <div className={`wb-contact-info-card wb-contact-card-style-${cardStyle}`}>
                  <div className="wb-contact-icon-box">
                    <PinIcon />
                  </div>
                  <div className="wb-contact-info-text">
                    <span className="wb-contact-info-label">Location</span>
                    <strong className="wb-contact-info-value">{data.address}</strong>
                  </div>
                </div>
              )}

              {data.officeHours && (
                <div className={`wb-contact-info-card wb-contact-card-style-${cardStyle}`}>
                  <div className="wb-contact-icon-box">
                    <ClockIcon />
                  </div>
                  <div className="wb-contact-info-text">
                    <span className="wb-contact-info-label">Working Hours</span>
                    <strong className="wb-contact-info-value">{data.officeHours}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {data.responseTime && (
            <div className="wb-contact-response-badge">
              <span className="wb-contact-pulse-dot" /> {data.responseTime}
            </div>
          )}
        </div>

        {data.showForm && (
          <div className={`wb-contact-form-wrapper wb-contact-card-style-${cardStyle}`}>
            <ContactForm
              submitLabel={data.submitLabel}
              formHeading={data.formHeading || "Send an inquiry"}
              serviceOptions={data.serviceOptions}
            />
          </div>
        )}
      </div>
    </SectionShell>
  );
}
