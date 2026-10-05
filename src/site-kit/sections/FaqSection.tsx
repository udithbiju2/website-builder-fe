import { SectionHead, SectionShell } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

/** Uses native <details>, so the accordion works on published sites without JavaScript. */
export default function FaqSection({ section }: { section: SectionOf<"faq"> }) {
  const { data } = section;
  return (
    <SectionShell sectionId={section.id} settings={section.settings} label={data.heading}>
      <SectionHead heading={data.heading} intro={data.intro} />
      <div className="wb-faq">
        {data.items.map((item, index) => (
          <details key={index}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
