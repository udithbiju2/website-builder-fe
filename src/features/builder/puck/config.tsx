import type { ComponentConfig, Config } from "@puckeditor/core";
import type { MouseEvent, ReactNode } from "react";
import {
  DEFAULT_SECTION_SETTINGS,
  SECTION_DEFINITIONS,
  SECTION_PRESETS,
  SectionView,
  SiteFrame,
  SiteStyles,
  type Section,
  type SectionDataMap,
  type SectionType,
} from "../../../site-kit/index.ts";
import { useBuilderSite } from "../editor-context.ts";
import { itemToSection, type BuilderComponents, type BuilderRootProps, type SectionProps } from "./adapter.ts";

function sectionComponent<T extends SectionType>(type: T): ComponentConfig<SectionProps<T>> {
  const definition = SECTION_DEFINITIONS[type];
  return {
    label: definition.label,
    defaultProps: { data: definition.createData(), settings: DEFAULT_SECTION_SETTINGS, hidden: false },
    render: ({ id, data, settings, hidden, puck }) => {
      const rawData = (data || {}) as Record<string, unknown>;
      if (rawData._aiPlaceholder) {
        return (
          <div
            id={id}
            data-ai-placeholder="true"
            className="wb-editor-section-wrap relative w-full my-4 min-h-[220px] rounded-2xl border border-dashed border-cyan-400/35 bg-cyan-500/[0.03] select-none transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          </div>
        );
      }
      const section = itemToSection(type, { id, data: data as SectionDataMap[T], settings, hidden });
      const view = <SectionView section={section} />;
      if (!hidden) return <div id={id} className="wb-editor-section-wrap w-full">{view}</div>;
      return puck.isEditing ? <div id={id} className="wb-editor-hidden wb-editor-section-wrap w-full">{view}</div> : <></>;
    },
  };
}

/** Site links point at the client site's paths, which don't exist inside the editor iframe. */
function blockLinkNavigation(event: MouseEvent<HTMLDivElement>) {
  if (event.target instanceof Element && event.target.closest("a")) event.preventDefault();
}

function EmptyCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 px-6 py-24 text-center font-sans select-none">
      <p className="text-base font-semibold text-ed-text">Start building this page</p>
      <p className="max-w-md text-sm text-ed-muted">
        Drag a component or add a section from the left panel onto the page.
      </p>
    </div>
  );
}

function RootRender({ children }: { children: ReactNode }) {
  const site = useBuilderSite();

  const handleRootClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    const isSection = target?.closest(".wb-editor-section-wrap") !== null;
    const isInteractive = target?.closest("button, input, textarea, a, select, [role='button']") !== null;

    if (!isSection && !isInteractive) {
      site.selectArea("page");
    }
  };

  return (
    <div
      onClickCapture={blockLinkNavigation}
      onClick={handleRootClick}
      className="min-h-full h-full flex flex-col flex-1"
    >
      <SiteStyles />
      <SiteFrame theme={site.theme} header={null} footer={null}>
        <div className="relative flex min-h-full h-full w-full flex-1 flex-col">
          {site.isEmpty && <EmptyCanvas />}
          <div className="relative z-10 flex min-h-full h-full w-full flex-1 flex-col">
            {children}
          </div>
        </div>
      </SiteFrame>
    </div>
  );
}

const baseComponents: { [T in SectionType]: ComponentConfig<SectionProps<T>> } = {
  header: sectionComponent("header"),
  footer: sectionComponent("footer"),
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
  carousel: sectionComponent("carousel"),
  marquee: sectionComponent("marquee"),
};

const presetComponents = Object.fromEntries(
  SECTION_PRESETS.map((preset) => {
    const sample = preset.create();
    return [
      preset.key,
      {
        label: preset.label,
        defaultProps: {
          data: sample.data,
          settings: sample.settings,
          hidden: sample.hidden,
        },
        render: ({ id, data, settings, hidden, puck }: any) => {
          const section = {
            id,
            type: preset.type,
            hidden,
            settings,
            data,
          };
          const view = <SectionView section={section as Section} />;
          if (!hidden) return <div className="wb-editor-section-wrap w-full">{view}</div>;
          return puck.isEditing ? <div className="wb-editor-hidden wb-editor-section-wrap w-full">{view}</div> : <></>;
        },
      },
    ];
  }),
);

/** Fields are intentionally empty: the builder's own inspector edits section props. */
export const builderConfig: Config<BuilderComponents, BuilderRootProps> = {
  components: {
    ...baseComponents,
    ...presetComponents,
  } as unknown as { [T in SectionType]: ComponentConfig<SectionProps<T>> },
  root: { render: RootRender },
};
