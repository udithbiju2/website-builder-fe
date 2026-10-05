import { SectionShell, SiteButton, SiteImage } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

export default function HeroSection({ section }: { section: SectionOf<"hero"> }) {
  const { data } = section;
  const actions = (data.primaryCta || data.secondaryCta) && (
    <div className="wb-actions">
      {data.primaryCta && <SiteButton link={data.primaryCta} />}
      {data.secondaryCta && <SiteButton link={data.secondaryCta} tone="secondary" />}
    </div>
  );
  const copy = (
    <div className="wb-hero-copy">
      {data.eyebrow && <p className="wb-eyebrow">{data.eyebrow}</p>}
      <h1>{data.heading}</h1>
      {data.subheading && <p className="wb-hero-sub wb-muted">{data.subheading}</p>}
      {actions}
    </div>
  );
  const media = data.image && (
    <div className="wb-hero-media">
      <SiteImage image={data.image} />
    </div>
  );

  return (
    <SectionShell
      sectionId={section.id}
      settings={section.settings}
      className={`wb-hero wb-hero-${data.variant}`}
      label="Hero"
    >
      {data.variant === "split" ? (
        <div className="wb-hero-grid">
          {copy}
          {media}
        </div>
      ) : (
        <>
          {copy}
          {media}
        </>
      )}
    </SectionShell>
  );
}
