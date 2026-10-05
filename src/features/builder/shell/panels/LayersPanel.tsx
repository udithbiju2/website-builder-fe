import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Layers, PanelBottom, PanelTop } from "lucide-react";
import { SECTION_DEFINITIONS, type SectionType } from "../../../../site-kit/index.ts";
import { useEditor, type SiteArea } from "../../editor-context.ts";
import { itemAsSection, type BuilderItem } from "../../puck/adapter.ts";
import { moveSection, replaceSection, selectSection, useBuilderPuck } from "../../puck/puck-api.ts";
import { EmptyState, PanelHeader, ToolButton } from "../ui.tsx";

export function itemTitle(item: BuilderItem): string {
  const data = item.props.data as { heading?: string };
  return data.heading?.trim() || SECTION_DEFINITIONS[item.type as SectionType].label;
}

function AreaRow({ area, label, icon }: { area: SiteArea; label: string; icon: ReactNode }) {
  const { siteArea, setSiteArea } = useEditor();
  const dispatch = useBuilderPuck((state) => state.dispatch);
  const hasSelection = useBuilderPuck((state) => state.appState.ui.itemSelector !== null);
  const active = !hasSelection && siteArea === area;
  return (
    <button
      type="button"
      onClick={() => {
        selectSection(dispatch, null);
        setSiteArea(area);
      }}
      aria-current={active ? "true" : undefined}
      className={`mx-1.5 flex items-center gap-2 rounded-ed px-2 py-1.5 text-left text-ed-sm ${active ? "bg-ed-accent-soft font-medium text-ed-accent" : "text-ed-muted hover:bg-ed-hover hover:text-ed-text"}`}
    >
      <span aria-hidden>{icon}</span>
      {label}
      <span className="ml-auto text-ed-2xs text-ed-faint">Site-wide</span>
    </button>
  );
}

export default function LayersPanel() {
  const content = useBuilderPuck((state) => state.appState.data.content);
  const selectedIndex = useBuilderPuck((state) => state.appState.ui.itemSelector?.index ?? null);
  const dispatch = useBuilderPuck((state) => state.dispatch);

  return (
    <>
      <PanelHeader title="Layers" description="Sections on this page, top to bottom." />
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto py-1.5">
        <AreaRow area="header" label="Header" icon={<PanelTop className="size-3.5" />} />
        {content.length === 0 ? (
          <EmptyState icon={<Layers className="size-4" />} title="No sections yet">
            Sections you add appear here so you can reorder and select them.
          </EmptyState>
        ) : (
          <ol className="flex flex-col gap-0.5 px-1.5" aria-label="Page sections">
            {content.map((item, index) => {
              const active = selectedIndex === index;
              const hidden = item.props.hidden;
              return (
                <li key={item.props.id} className={`group flex items-center rounded-ed ${active ? "bg-ed-accent-soft" : "hover:bg-ed-hover"}`}>
                  <button
                    type="button"
                    onClick={() => selectSection(dispatch, index)}
                    aria-current={active ? "true" : undefined}
                    className={`min-w-0 flex-1 py-1.5 pl-2 text-left ${hidden ? "opacity-50" : ""}`}
                  >
                    <span className={`block truncate text-ed-sm ${active ? "font-medium text-ed-accent" : "text-ed-text"}`}>{itemTitle(item)}</span>
                    <span className="block truncate text-ed-2xs text-ed-faint">
                      {SECTION_DEFINITIONS[item.type as SectionType].label}
                      {hidden ? " · hidden" : ""}
                    </span>
                  </button>
                  <span className={`flex pr-0.5 ${active ? "" : "opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"}`}>
                    <ToolButton
                      label={hidden ? "Show section" : "Hide section"}
                      size="sm"
                      onClick={() => replaceSection(dispatch, index, { ...itemAsSection(item), hidden: !hidden })}
                    >
                      {hidden ? <Eye className="size-3.5" aria-hidden /> : <EyeOff className="size-3.5" aria-hidden />}
                    </ToolButton>
                    <ToolButton label="Move up" size="sm" disabled={index === 0} onClick={() => moveSection(dispatch, index, index - 1)}>
                      <ChevronUp className="size-3.5" aria-hidden />
                    </ToolButton>
                    <ToolButton
                      label="Move down"
                      size="sm"
                      disabled={index === content.length - 1}
                      onClick={() => moveSection(dispatch, index, index + 1)}
                    >
                      <ChevronDown className="size-3.5" aria-hidden />
                    </ToolButton>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        <AreaRow area="footer" label="Footer" icon={<PanelBottom className="size-3.5" />} />
      </div>
    </>
  );
}
