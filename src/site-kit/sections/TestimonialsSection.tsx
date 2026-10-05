import { gridStyle, SectionHead, SectionShell } from "../primitives.tsx";
import type { GridColumns, SectionOf } from "../types.ts";

export default function TestimonialsSection({ section }: { section: SectionOf<"testimonials"> }) {
  const { data } = section;
  const columns = Math.min(Math.max(data.items.length, 1), 3) as GridColumns;
  return (
    <SectionShell sectionId={section.id} settings={section.settings} label={data.heading}>
      <SectionHead heading={data.heading} />
      <div className="wb-grid" style={gridStyle(columns, 1)}>
        {data.items.map((item, index) => (
          <figure key={index} className="wb-card wb-quote">
            <blockquote>“{item.quote}”</blockquote>
            <figcaption className="wb-muted">
              <strong>{item.name}</strong>
              {item.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
