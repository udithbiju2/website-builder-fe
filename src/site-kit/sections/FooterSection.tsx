import SiteFooter from "../layout/SiteFooter.tsx";
import { sectionFontStyle } from "../theme.ts";
import type { SectionOf } from "../types.ts";

export default function FooterSection({ section }: { section: SectionOf<"footer"> }) {
  const footer = <SiteFooter footer={section.data} />;
  if (!section.settings.font) return footer;
  return <div style={{ display: "contents", ...sectionFontStyle(section.settings.font) }}>{footer}</div>;
}
