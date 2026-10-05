import { useMemo, useState } from "react";
import { Chip } from "@heroui/react";
import PageHeader from "../../components/app/PageHeader.tsx";
import { deviceWidth, DeviceToggle, PreviewFrame, type Device } from "../../components/websites/DevicePreview.tsx";
import {
  createSection,
  SAMPLE_SITE,
  SECTION_DEFINITIONS,
  SECTION_TYPES,
  SitePage,
  type PageData,
  type SectionType,
} from "../../site-kit/index.ts";

type Selection = SectionType | "page";

const SAMPLE_HOME = SAMPLE_SITE.pages[0];

function previewPage(selection: Selection): PageData {
  if (selection === "page") return SAMPLE_HOME;
  const sample = SAMPLE_HOME.sections.find((section) => section.type === selection);
  return { ...SAMPLE_HOME, sections: [sample ?? createSection(selection)] };
}

export default function SectionLibraryPage() {
  const [selection, setSelection] = useState<Selection>("page");
  const [device, setDevice] = useState<Device>("desktop");
  const page = useMemo(() => previewPage(selection), [selection]);

  const itemClass = (active: boolean) =>
    `w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
      active ? "border-brand bg-brand-soft" : "border-transparent hover:bg-canvas"
    }`;

  return (
    <div className="px-6 py-8 sm:px-8">
      <PageHeader
        title="Reusable sections"
        description="The section types the manual builder and the AI builder are allowed to use."
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-line bg-surface p-2">
          <button type="button" className={itemClass(selection === "page")} onClick={() => setSelection("page")}>
            <span className="block text-sm font-medium text-ink">Full sample page</span>
            <span className="block text-xs text-ink-muted">Header, all sections and footer</span>
          </button>
          <p className="px-3 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Section types ({SECTION_TYPES.length})
          </p>
          <ul className="flex flex-col gap-1">
            {SECTION_TYPES.map((type) => {
              const definition = SECTION_DEFINITIONS[type];
              return (
                <li key={type}>
                  <button type="button" className={itemClass(selection === type)} onClick={() => setSelection(type)}>
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{definition.label}</span>
                      <Chip size="sm" variant="soft">
                        {definition.category}
                      </Chip>
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{definition.description}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="min-w-0 rounded-xl border border-line bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="text-sm font-medium text-ink">
              {selection === "page" ? "Home page" : SECTION_DEFINITIONS[selection].label}
              <span className="ml-2 font-normal text-ink-muted">{deviceWidth(device)}px</span>
            </p>
            <DeviceToggle value={device} onChange={setDevice} />
          </div>
          <PreviewFrame device={device}>
            <SitePage site={SAMPLE_SITE} page={page} />
          </PreviewFrame>
        </section>
      </div>
    </div>
  );
}
