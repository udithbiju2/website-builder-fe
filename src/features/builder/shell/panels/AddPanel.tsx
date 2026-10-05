import { useMemo, useState, type ComponentType } from "react";
import {
  Briefcase,
  CreditCard,
  FileText,
  Grid,
  HelpCircle,
  Image,
  Layers,
  Mail,
  Megaphone,
  MessageSquareQuote,
  PanelBottom,
  PanelTop,
  PlaySquare,
  Plus,
  SearchX,
  Sparkles,
  Users,
  type LucideProps,
} from "lucide-react";
import { LIMITS } from "../../../../pages/websites/editor/editor-state.ts";
import {
  SECTION_PRESETS,
  SectionView,
  SiteStyles,
  themeToCssVars,
  type SectionCategory,
  type SectionPreset,
  type ThemeSettings,
} from "../../../../site-kit/index.ts";
import { useEditor } from "../../editor-context.ts";
import { insertSections, useBuilderPuck } from "../../puck/puck-api.ts";
import { EmptyState, PanelHeader, SearchField } from "../ui.tsx";

type CategoryItem = {
  id: string;
  category: SectionCategory | "All";
  label: string;
  shortLabel: string;
  icon: ComponentType<LucideProps>;
};

const CATEGORIES: CategoryItem[] = [
  { id: "all", category: "All", label: "All sections", shortLabel: "All", icon: Grid },
  { id: "header", category: "Header", label: "Header", shortLabel: "Header", icon: PanelTop },
  { id: "hero", category: "Hero", label: "Hero", shortLabel: "Hero", icon: Sparkles },
  { id: "features", category: "Features", label: "Features", shortLabel: "Features", icon: Layers },
  { id: "services", category: "Services", label: "Services", shortLabel: "Services", icon: Briefcase },
  { id: "social-proof", category: "Social proof", label: "Testimonials & Social", shortLabel: "Proof", icon: MessageSquareQuote },
  { id: "pricing", category: "Pricing", label: "Pricing", shortLabel: "Pricing", icon: CreditCard },
  { id: "faq", category: "FAQ", label: "FAQ", shortLabel: "FAQ", icon: HelpCircle },
  { id: "cta", category: "CTA", label: "Call to action", shortLabel: "CTA", icon: Megaphone },
  { id: "contact", category: "Contact", label: "Contact", shortLabel: "Contact", icon: Mail },
  { id: "content", category: "Content", label: "Content", shortLabel: "Content", icon: FileText },
  { id: "portfolio", category: "Portfolio", label: "Gallery", shortLabel: "Gallery", icon: Image },
  { id: "media", category: "Media", label: "Media", shortLabel: "Media", icon: PlaySquare },
  { id: "team", category: "Team", label: "Team", shortLabel: "Team", icon: Users },
  { id: "footer", category: "Footer", label: "Footer", shortLabel: "Footer", icon: PanelBottom },
];

const PREVIEW_WIDTH = 1080;
const PREVIEW_SCALE = 0.28;

function SectionLivePreview({ preset, theme }: { preset: SectionPreset; theme: ThemeSettings }) {
  const section = useMemo(() => preset.create(), [preset.key]);

  return (
    <div className="relative h-24 w-full overflow-hidden rounded-md border border-ed-border/70 bg-white dark:bg-zinc-950 pointer-events-none select-none" aria-hidden inert>
      <SiteStyles />
      <div
        className="origin-top-left"
        style={{ width: PREVIEW_WIDTH, transform: `scale(${PREVIEW_SCALE})` }}
      >
        <div
          className={`wb-site wb-buttons-${theme.buttonStyle} wb-cards-${theme.cardStyle}`}
          style={themeToCssVars(theme)}
        >
          <SectionView section={section} />
        </div>
      </div>
    </div>
  );
}

function matches(preset: SectionPreset, query: string): boolean {
  const text = `${preset.label} ${preset.category} ${preset.description}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => text.includes(word));
}

export default function AddPanel() {
  const { notify, draft } = useEditor();
  const dispatch = useBuilderPuck((state) => state.dispatch);
  const selectedIndex = useBuilderPuck((state) => state.appState.ui.itemSelector?.index ?? null);
  const count = useBuilderPuck((state) => state.appState.data.content.length);
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("hero");

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedCategoryId) ?? CATEGORIES[0]!;

  const filteredPresets = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed) {
      return SECTION_PRESETS.filter((preset) => matches(preset, trimmed));
    }
    if (selectedCategory.category === "All") {
      return SECTION_PRESETS;
    }
    return SECTION_PRESETS.filter((preset) => preset.category === selectedCategory.category);
  }, [query, selectedCategory]);

  const full = count >= LIMITS.sectionsPerPage;
  const insertAt = selectedIndex === null ? count : selectedIndex + 1;

  function add(preset: SectionPreset) {
    if (full) return;
    insertSections(dispatch, [preset.create()], insertAt);
    notify(`${preset.label} added`);
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PanelHeader
        title="Add sections"
        description={selectedIndex === null ? "Added to the end of page" : "Added below selected"}
      />
      <SearchField value={query} onChange={setQuery} placeholder="Search sections..." />

      {full && (
        <p className="mx-3 mb-2 rounded-ed bg-ed-warning-soft px-2 py-1.5 text-ed-xs text-ed-warning">
          Page limit reached ({LIMITS.sectionsPerPage} sections max).
        </p>
      )}

      {/* Dual pane container: Categories Left Rail + Section Cards Main Area */}
      <div className="flex min-h-0 flex-1 overflow-hidden border-t border-ed-border">
        {/* Compact Category Icons Left Sub-Sidebar */}
        <nav
          aria-label="Section categories"
          className="flex w-14 shrink-0 flex-col gap-1 border-r border-ed-border bg-ed-subtle/40 p-1 overflow-y-auto overscroll-contain"
        >
          {CATEGORIES.map(({ id, shortLabel, label, icon: Icon }) => {
            const isSelected = selectedCategoryId === id && !query.trim();
            return (
              <button
                key={id}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedCategoryId(id);
                  if (query) setQuery("");
                }}
                className={`group flex flex-col items-center justify-center rounded-ed py-1.5 px-0.5 text-center transition-all ${
                  isSelected
                    ? "bg-white text-ed-accent shadow-xs dark:bg-zinc-800"
                    : "text-ed-muted hover:bg-ed-hover hover:text-ed-text"
                }`}
              >
                <Icon
                  className={`size-4 transition-transform group-hover:scale-105 ${
                    isSelected ? "text-ed-accent" : "text-ed-muted group-hover:text-ed-text"
                  }`}
                  aria-hidden
                />
                <span className="mt-0.5 block w-full truncate text-[9px] font-medium leading-none">
                  {shortLabel}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Section Cards Area with Live Layout Previews */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-2.5">
          <div className="mb-2 flex items-center justify-between px-0.5">
            <h3 className="text-ed-2xs font-semibold uppercase tracking-wider text-ed-faint">
              {query.trim() ? `Search results (${filteredPresets.length})` : selectedCategory.label}
            </h3>
            <span className="text-ed-2xs text-ed-faint">
              {filteredPresets.length} {filteredPresets.length === 1 ? "layout" : "layouts"}
            </span>
          </div>

          {filteredPresets.length === 0 ? (
            <EmptyState icon={<SearchX className="size-4" />} title="No matching sections">
              Try a different search term like “pricing” or “hero”.
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => add(preset)}
                  disabled={full}
                  aria-label={`Add ${preset.label}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-ed-border/90 bg-ed-panel p-2 text-left transition-all hover:border-ed-accent/60 hover:shadow-xs focus:border-ed-accent focus:outline-none focus:ring-2 focus:ring-ed-accent/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {/* Live Rendered Section Preview matching actual page design 1:1 */}
                  <div className="mb-2 w-full transition-transform duration-150 group-hover:scale-[1.01]">
                    <SectionLivePreview preset={preset} theme={draft.theme} />
                  </div>

                  {/* Section Title, Description & Action Button */}
                  <div className="flex items-start justify-between gap-2 px-0.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-ed-xs font-semibold text-ed-text group-hover:text-ed-accent transition-colors">
                        {preset.label}
                      </p>
                      <p className="line-clamp-1 text-[11px] leading-tight text-ed-muted">
                        {preset.description}
                      </p>
                    </div>

                    <div className="flex size-5 shrink-0 items-center justify-center rounded-ed bg-ed-subtle text-ed-muted border border-ed-border shadow-2xs transition-colors group-hover:bg-ed-accent group-hover:border-ed-accent group-hover:text-white">
                      <Plus className="size-3" aria-hidden />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
