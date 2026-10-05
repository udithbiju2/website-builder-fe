import { gridStyle, SectionHead, SectionShell, SiteImage, SiteLink } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

export default function ServicesSection({ section }: { section: SectionOf<"services"> }) {
  const { data } = section;
  return (
    <SectionShell sectionId={section.id} settings={section.settings} label={data.heading}>
      <SectionHead heading={data.heading} intro={data.intro} />
      <div className="wb-grid" style={gridStyle(data.columns, data.mobileColumns)}>
        {data.items.map((item, index) => (
          <article key={index} className="wb-card wb-service">
            {item.image && <SiteImage image={item.image} />}
            <div className="wb-service-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.link && <SiteLink link={item.link} className="wb-service-link" />}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
