import type { CSSProperties } from "react";
import SiteHeader from "../layout/SiteHeader.tsx";
import { sectionFontStyle } from "../theme.ts";
import type { SectionOf } from "../types.ts";

export default function HeaderSection({ section }: { section: SectionOf<"header"> }) {
  const customColors = section.settings.customColors;
  const customStyle: CSSProperties = {
    ...sectionFontStyle(section.settings.font),
    ...(customColors?.background
      ? {
          "--wb-bg": customColors.background,
          "--wb-surface": customColors.background,
          backgroundColor: customColors.background,
        }
      : {}),
    ...(customColors?.text ? { "--wb-text": customColors.text, color: customColors.text } : {}),
    ...(customColors?.border ? { "--wb-border": customColors.border, borderColor: customColors.border } : {}),
  };

  const bgClass =
    section.settings.background !== "default" && !customColors?.background
      ? `wb-bg-${section.settings.background}`
      : "";

  return (
    <div className={`wb-header-section-wrapper ${bgClass}`.trim()} style={customStyle}>
      <SiteHeader header={section.data} />
    </div>
  );
}
