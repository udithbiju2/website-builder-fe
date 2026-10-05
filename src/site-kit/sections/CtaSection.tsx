import { SectionShell, SiteButton } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

export default function CtaSection({ section }: { section: SectionOf<"cta"> }) {
  const { data } = section;
  return (
    <SectionShell sectionId={section.id} settings={section.settings} className="wb-cta" label={data.heading}>
      <h2>{data.heading}</h2>
      {data.text && <p className="wb-muted">{data.text}</p>}
      <div className="wb-actions">
        <SiteButton link={data.button} />
      </div>
    </SectionShell>
  );
}
