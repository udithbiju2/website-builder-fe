import { useMemo, useState } from "react";
import { Plus, SearchX } from "lucide-react";
import { LIMITS } from "../../../../pages/websites/editor/editor-state.ts";
import { SECTION_PRESETS, type SectionPreset } from "../../../../site-kit/index.ts";
import { useEditor } from "../../editor-context.ts";
import { insertSections, useBuilderPuck } from "../../puck/puck-api.ts";
import { EmptyState, PanelHeader, SearchField, SectionLabel } from "../ui.tsx";

function matches(preset: SectionPreset, query: string): boolean {
  const text = `${preset.label} ${preset.category} ${preset.description}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => text.includes(word));
}

export default function AddPanel() {
  const { notify } = useEditor();
  const dispatch = useBuilderPuck((state) => state.dispatch);
  const selectedIndex = useBuilderPuck((state) => state.appState.ui.itemSelector?.index ?? null);
  const count = useBuilderPuck((state) => state.appState.data.content.length);
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const visible = SECTION_PRESETS.filter((preset) => !query.trim() || matches(preset, query.trim()));
    const byCategory = new Map<string, SectionPreset[]>();
    for (const preset of visible) byCategory.set(preset.category, [...(byCategory.get(preset.category) ?? []), preset]);
    return [...byCategory.entries()];
  }, [query]);

  const full = count >= LIMITS.sectionsPerPage;
  const insertAt = selectedIndex === null ? count : selectedIndex + 1;

  function add(preset: SectionPreset) {
    if (full) return;
    insertSections(dispatch, [preset.create()], insertAt);
    notify(`${preset.label} added`);
  }

  return (
    <>
      <PanelHeader
        title="Add sections"
        description={selectedIndex === null ? "Added to the end of the page." : "Added below the selected section."}
      />
      <SearchField value={query} onChange={setQuery} placeholder="Search sections" />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3">
        {full && <p className="mx-3 rounded-ed bg-ed-warning-soft px-2 py-1.5 text-ed-xs text-ed-warning">This page has the maximum of {LIMITS.sectionsPerPage} sections.</p>}
        {groups.length === 0 ? (
          <EmptyState icon={<SearchX className="size-4" />} title="No matching sections">
            Try a different word, like “pricing” or “team”.
          </EmptyState>
        ) : (
          groups.map(([category, presets]) => (
            <section key={category} aria-label={category}>
              <SectionLabel>{category}</SectionLabel>
              <ul className="flex flex-col gap-0.5 px-1.5">
                {presets.map((preset) => (
                  <li key={preset.key}>
                    <button
                      type="button"
                      onClick={() => add(preset)}
                      disabled={full}
                      className="group flex w-full items-start gap-2 rounded-ed px-2 py-1.5 text-left transition-colors hover:bg-ed-hover disabled:opacity-50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-ed-sm font-medium text-ed-text">{preset.label}</span>
                        <span className="line-clamp-2 block text-ed-xs text-ed-muted">{preset.description}</span>
                      </span>
                      <Plus className="mt-0.5 size-3.5 shrink-0 text-ed-faint transition-colors group-hover:text-ed-accent" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </>
  );
}
