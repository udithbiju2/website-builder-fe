import { gridStyle, SectionHead, SectionShell, SiteIcon } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

export default function FeaturesSection({ section }: { section: SectionOf<"features"> }) {
  const { data } = section;
  return (
    <SectionShell sectionId={section.id} settings={section.settings} label={data.heading}>
      <SectionHead heading={data.heading} intro={data.intro} />
      <div className="wb-grid" style={gridStyle(data.columns, data.mobileColumns)}>
        {data.items.map((item, index) => (
          <div key={index} className="wb-card">
            {item.icon && <SiteIcon name={item.icon} />}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
