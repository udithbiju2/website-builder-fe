import SiteHeader from "../layout/SiteHeader.tsx";
import { sectionFontStyle } from "../theme.ts";
import type { SectionOf } from "../types.ts";

export default function HeaderSection({ section }: { section: SectionOf<"header"> }) {
  const header = <SiteHeader header={section.data} />;
  if (!section.settings.font) return header;
  // `display: contents` adds no box, so sticky and fixed header positioning keeps working.
  return <div style={{ display: "contents", ...sectionFontStyle(section.settings.font) }}>{header}</div>;
}
