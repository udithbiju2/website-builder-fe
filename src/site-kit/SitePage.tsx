import { Fragment, type ReactNode } from "react";
import SiteFooter from "./layout/SiteFooter.tsx";
import SiteHeader from "./layout/SiteHeader.tsx";
import ContactSection from "./sections/ContactSection.tsx";
import CtaSection from "./sections/CtaSection.tsx";
import FaqSection from "./sections/FaqSection.tsx";
import FeaturesSection from "./sections/FeaturesSection.tsx";
import GallerySection from "./sections/GallerySection.tsx";
import HeroSection from "./sections/HeroSection.tsx";
import ServicesSection from "./sections/ServicesSection.tsx";
import TestimonialsSection from "./sections/TestimonialsSection.tsx";
import TextSection from "./sections/TextSection.tsx";
import { SITE_CSS } from "./styles.ts";
import { themeToCssVars } from "./theme.ts";
import type { PageData, Section, SiteData } from "./types.ts";

export function SectionView({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} />;
    case "features":
      return <FeaturesSection section={section} />;
    case "services":
      return <ServicesSection section={section} />;
    case "testimonials":
      return <TestimonialsSection section={section} />;
    case "faq":
      return <FaqSection section={section} />;
    case "cta":
      return <CtaSection section={section} />;
    case "contact":
      return <ContactSection section={section} />;
    case "text":
      return <TextSection section={section} />;
    case "gallery":
      return <GallerySection section={section} />;
  }
}

/** Injects the site stylesheet. Published sites link it as a file instead. */
export function SiteStyles() {
  return <style>{SITE_CSS}</style>;
}

/** Builder-only hooks for wrapping parts of the page (selection outlines, toolbars). */
export type SitePageEditorHooks = {
  renderSection: (section: Section, content: ReactNode) => ReactNode;
  renderHeader: (content: ReactNode) => ReactNode;
  renderFooter: (content: ReactNode) => ReactNode;
  /** Shown inside <main> when the page has no sections. */
  emptyState: ReactNode;
};

type SitePageProps = {
  site: SiteData;
  page: PageData;
  /** When set, hidden sections are passed to `renderSection` too, so the editor can show them dimmed. */
  editor?: SitePageEditorHooks;
};

/** One full page of a client website: header, visible sections, footer. */
export default function SitePage({ site, page, editor }: SitePageProps) {
  const { theme } = site;
  const classes = ["wb-site", `wb-buttons-${theme.buttonStyle}`, `wb-cards-${theme.cardStyle}`].join(" ");
  const header = <SiteHeader header={site.header} />;
  const footer = <SiteFooter footer={site.footer} />;

  return (
    <div className={classes} style={themeToCssVars(theme)}>
      {editor ? editor.renderHeader(header) : header}
      <main>
        {editor
          ? page.sections.length === 0
            ? editor.emptyState
            : page.sections.map((section) => (
                <Fragment key={section.id}>{editor.renderSection(section, <SectionView section={section} />)}</Fragment>
              ))
          : page.sections
              .filter((section) => !section.hidden)
              .map((section) => <SectionView key={section.id} section={section} />)}
      </main>
      {editor ? editor.renderFooter(footer) : footer}
    </div>
  );
}
