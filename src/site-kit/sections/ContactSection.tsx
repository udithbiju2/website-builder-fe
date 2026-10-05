import { safeHref } from "../links.ts";
import { SectionShell } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

/**
 * Form submission isn't wired to a backend yet, so the form renders disabled
 * rather than posting to the published site's own URL.
 */
export default function ContactSection({ section }: { section: SectionOf<"contact"> }) {
  const { data } = section;
  const hasDetails = Boolean(data.email || data.phone || data.address);

  return (
    <SectionShell sectionId={section.id} settings={section.settings} label={data.heading}>
      <div className={`wb-contact-grid${data.showForm ? "" : " wb-contact-solo"}`}>
        <div>
          <h2>{data.heading}</h2>
          {data.text && <p className="wb-contact-intro wb-muted">{data.text}</p>}
          {hasDetails && (
            <dl className="wb-contact-list">
              {data.email && (
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={safeHref(`mailto:${data.email}`)}>{data.email}</a>
                  </dd>
                </div>
              )}
              {data.phone && (
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={safeHref(`tel:${data.phone.replace(/\s+/g, "")}`)}>{data.phone}</a>
                  </dd>
                </div>
              )}
              {data.address && (
                <div>
                  <dt>Address</dt>
                  <dd>{data.address}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        {data.showForm && (
          <form className="wb-card wb-form">
            <label>
              Name
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" autoComplete="email" required />
            </label>
            <label>
              Message
              <textarea name="message" required />
            </label>
            <button type="submit" className="wb-btn wb-btn-primary" disabled>
              {data.submitLabel}
            </button>
          </form>
        )}
      </div>
    </SectionShell>
  );
}
