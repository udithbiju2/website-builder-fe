import type { ComponentConfig, Config } from "@puckeditor/core";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import {
  DEFAULT_SECTION_SETTINGS,
  SECTION_DEFINITIONS,
  SectionView,
  SiteFooterView,
  SiteFrame,
  SiteHeaderView,
  SiteStyles,
  type SectionDataMap,
  type SectionType,
} from "../../../site-kit/index.ts";
import { useBuilderSite, type SiteArea } from "../editor-context.ts";
import { itemToSection, type BuilderComponents, type BuilderRootProps, type SectionProps } from "./adapter.ts";

function sectionComponent<T extends SectionType>(type: T): ComponentConfig<SectionProps<T>> {
  const definition = SECTION_DEFINITIONS[type];
  return {
    label: definition.label,
    defaultProps: { data: definition.createData(), settings: DEFAULT_SECTION_SETTINGS, hidden: false },
    render: ({ id, data, settings, hidden, puck }) => {
      const section = itemToSection(type, { id, data: data as SectionDataMap[T], settings, hidden });
      const view = <SectionView section={section} />;
      if (!hidden) return view;
      return puck.isEditing ? <div className="wb-editor-hidden">{view}</div> : <></>;
    },
  };
}

/** Site links point at the client site's paths, which don't exist inside the editor iframe. */
function blockLinkNavigation(event: MouseEvent<HTMLDivElement>) {
  if (event.target instanceof Element && event.target.closest("a")) event.preventDefault();
}

function SiteArea({ area, label, children }: { area: SiteArea; label: string; children: ReactNode }) {
  const site = useBuilderSite();
  const select = () => site.selectArea(area);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Edit ${label}`}
      data-active={site.activeArea === area}
      className="wb-editor-area"
      onClick={select}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select();
        }
      }}
    >
      {children}
    </div>
  );
}

function EmptyCanvas() {
  const site = useBuilderSite();
  return (
    <div className="wb-editor-chrome flex flex-col items-center gap-3 px-6 py-20 text-center font-sans">
      <p className="text-base font-semibold text-ed-text">Start building this page</p>
      <p className="max-w-sm text-sm text-ed-muted">
        Add a section from the library, or drag a component from the left panel onto the page.
      </p>
      <button
        type="button"
        onClick={site.openAddPanel}
        className="mt-1 inline-flex h-8 items-center gap-1.5 rounded-ed bg-ed-accent px-3 text-sm font-medium text-white hover:bg-ed-accent-hover"
      >
        Add a section
      </button>
    </div>
  );
}

function RootRender({ children }: { children: ReactNode }) {
  const site = useBuilderSite();
  return (
    <div onClickCapture={blockLinkNavigation}>
      <SiteStyles />
      <SiteFrame
        theme={site.theme}
        header={
          <SiteArea area="header" label="header">
            <SiteHeaderView header={site.header} />
          </SiteArea>
        }
        footer={
          <SiteArea area="footer" label="footer">
            <SiteFooterView footer={site.footer} />
          </SiteArea>
        }
      >
        {site.isEmpty && <EmptyCanvas />}
        {children}
      </SiteFrame>
    </div>
  );
}

const components: { [T in SectionType]: ComponentConfig<SectionProps<T>> } = {
  hero: sectionComponent("hero"),
  features: sectionComponent("features"),
  services: sectionComponent("services"),
  testimonials: sectionComponent("testimonials"),
  faq: sectionComponent("faq"),
  cta: sectionComponent("cta"),
  contact: sectionComponent("contact"),
  text: sectionComponent("text"),
  gallery: sectionComponent("gallery"),
  logos: sectionComponent("logos"),
  split: sectionComponent("split"),
  stats: sectionComponent("stats"),
  pricing: sectionComponent("pricing"),
  media: sectionComponent("media"),
  team: sectionComponent("team"),
};

/** Fields are intentionally empty: the builder's own inspector edits section props. */
export const builderConfig: Config<BuilderComponents, BuilderRootProps> = {
  components,
  root: { render: RootRender },
};
