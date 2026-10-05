import { Fragment, type ReactNode } from "react";
import SiteFooter from "./layout/SiteFooter.tsx";
import SiteHeader from "./layout/SiteHeader.tsx";
import ContactSection from "./sections/ContactSection.tsx";
import CtaSection from "./sections/CtaSection.tsx";
import FaqSection from "./sections/FaqSection.tsx";
import FeaturesSection from "./sections/FeaturesSection.tsx";
import FooterSection from "./sections/FooterSection.tsx";
import GallerySection from "./sections/GallerySection.tsx";
import HeaderSection from "./sections/HeaderSection.tsx";
import HeroSection from "./sections/HeroSection.tsx";
import LogosSection from "./sections/LogosSection.tsx";
import MediaSection from "./sections/MediaSection.tsx";
import PricingSection from "./sections/PricingSection.tsx";
import ServicesSection from "./sections/ServicesSection.tsx";
import SplitSection from "./sections/SplitSection.tsx";
import StatsSection from "./sections/StatsSection.tsx";
import TeamSection from "./sections/TeamSection.tsx";
import TestimonialsSection from "./sections/TestimonialsSection.tsx";
import TextSection from "./sections/TextSection.tsx";
import { SITE_CSS } from "./styles.ts";
import { themeToCssVars } from "./theme.ts";
import type { FooterData, HeaderData, PageData, Section, SiteData, ThemeSettings } from "./types.ts";

export function SectionView({ section }: { section: Section }) {
  switch (section.type) {
    case "header":
      return <HeaderSection section={section} />;
    case "footer":
      return <FooterSection section={section} />;
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
    case "logos":
      return <LogosSection section={section} />;
    case "split":
      return <SplitSection section={section} />;
    case "stats":
      return <StatsSection section={section} />;
    case "pricing":
      return <PricingSection section={section} />;
    case "media":
      return <MediaSection section={section} />;
    case "team":
      return <TeamSection section={section} />;
  }
}

type SiteFrameProps = {
  theme: ThemeSettings;
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

/** Themed page wrapper shared by the published page and the visual editor canvas. */
export function SiteFrame({ theme, header, footer, children }: SiteFrameProps) {
  const classes = ["wb-site", `wb-buttons-${theme.buttonStyle}`, `wb-cards-${theme.cardStyle}`].join(" ");
  return (
    <div className={classes} style={themeToCssVars(theme)}>
      {header}
      <main>{children}</main>
      {footer}
    </div>
  );
}

export function SiteHeaderView({ header }: { header: HeaderData }) {
  return <SiteHeader header={header} />;
}

export function SiteFooterView({ footer }: { footer: FooterData }) {
  return <SiteFooter footer={footer} />;
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
  const hasHeaderSection = page.sections.some((section) => section.type === "header" && (editor || !section.hidden));
  const hasFooterSection = page.sections.some((section) => section.type === "footer" && (editor || !section.hidden));

  const header = !hasHeaderSection && site.header ? <SiteHeader header={site.header} /> : null;
  const footer = !hasFooterSection && site.footer ? <SiteFooter footer={site.footer} /> : null;

  return (
    <SiteFrame
      theme={site.theme}
      header={editor && header ? editor.renderHeader(header) : header}
      footer={editor && footer ? editor.renderFooter(footer) : footer}
    >
      {editor
        ? page.sections.length === 0
          ? editor.emptyState
          : page.sections.map((section) => (
              <Fragment key={section.id}>{editor.renderSection(section, <SectionView section={section} />)}</Fragment>
            ))
        : page.sections
            .filter((section) => !section.hidden)
            .map((section) => <SectionView key={section.id} section={section} />)}
    </SiteFrame>
  );
}
