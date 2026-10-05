import { useState } from "react";
import { Drawer } from "@puckeditor/core";
import { GripVertical, SearchX } from "lucide-react";
import { SECTION_DEFINITIONS, SECTION_TYPES } from "../../../../site-kit/index.ts";
import { EmptyState, PanelHeader, SearchField } from "../ui.tsx";

/** Drag-to-insert list backed by Puck's drawer, rendered with the builder's own styling. */
export default function ComponentsPanel() {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const types = SECTION_TYPES.filter((type) => {
    const definition = SECTION_DEFINITIONS[type];
    return !needle || `${definition.label} ${definition.description}`.toLowerCase().includes(needle);
  });

  return (
    <>
      <PanelHeader title="Components" description="Drag onto the page. For keyboard insertion, use Add sections." />
      <SearchField value={query} onChange={setQuery} placeholder="Search components" />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
        {types.length === 0 ? (
          <EmptyState icon={<SearchX className="size-4" />} title="No matching components" />
        ) : (
          <Drawer>
            {types.map((type) => (
              <Drawer.Item key={type} name={type} label={SECTION_DEFINITIONS[type].label}>
                {() => (
                  <div className="mb-1 flex cursor-grab items-center gap-2 rounded-ed border border-ed-border bg-ed-panel px-2 py-2 shadow-ed-xs hover:border-ed-border-strong active:cursor-grabbing">
                    <GripVertical className="size-3.5 shrink-0 text-ed-faint" aria-hidden />
                    <span className="min-w-0">
                      <span className="block truncate text-ed-sm font-medium text-ed-text">{SECTION_DEFINITIONS[type].label}</span>
                      <span className="block truncate text-ed-xs text-ed-muted">{SECTION_DEFINITIONS[type].description}</span>
                    </span>
                  </div>
                )}
              </Drawer.Item>
            ))}
          </Drawer>
        )}
      </div>
    </>
  );
}
