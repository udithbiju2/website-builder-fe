import { SectionShell, SiteImage } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

export default function LogosSection({ section }: { section: SectionOf<"logos"> }) {
  const { data } = section;
  return (
    <SectionShell
      sectionId={section.id}
      settings={section.settings}
      className={`wb-logos${data.grayscale ? " wb-logos-gray" : ""}`}
      label={data.heading || "Logos"}
    >
      {data.heading && <p className="wb-logos-head wb-muted">{data.heading}</p>}
      {data.logos.length > 0 ? (
        <ul className="wb-logos-row">
          {data.logos.map((logo, index) => (
            <li key={`${logo.url}-${index}`}>
              <SiteImage image={logo} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="wb-empty">Add logos of customers or partners.</p>
      )}
    </SectionShell>
  );
}
