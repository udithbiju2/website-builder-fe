import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Loader2,
  RotateCcw,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import {
  DEFAULT_SECTION_SETTINGS,
  SECTION_DEFINITIONS,
  type Section,
  type SectionSettings,
  type SectionType,
} from "../../../site-kit/index.ts";
import { websitesApi } from "../../../api/websites.ts";
import type { AiSuggestion } from "../schema/editor-document.ts";
import { useEditor } from "../editor-context.ts";
import { itemAsSection, sectionToItem } from "../puck/adapter.ts";
import { insertSections, replaceSection, selectSection, useBuilderPuck } from "../puck/puck-api.ts";
import { itemTitle } from "./panels/LayersPanel.tsx";
import { ToolButton } from "./ui.tsx";

const DEFAULT_PAGE_PROMPTS = [
  "Modern AI SaaS landing page with high-converting sections",
  "Premium design agency portfolio with client proof",
  "Boutique cafe & artisan bakery landing page",
  "Enterprise B2B cloud infrastructure platform",
];

const SECTION_TYPE_PROMPTS: Record<string, string[]> = {
  hero: [
    "Make the headline punchier and conversion-focused",
    "Add a high-tech modern badge and clearer value prop",
    "Translate this section copy to Malayalam",
  ],
  pricing: [
    "Create 3 balanced tiers (Starter, Pro, Enterprise)",
    "Add popular badge and high-value feature bullets",
    "Make it a competitive monthly SaaS pricing table",
  ],
  features: [
    "Highlight speed, enterprise security, and AI automation",
    "Write 4 customer-centric benefit cards with crisp titles",
    "Make descriptions concise, actionable, and modern",
  ],
  services: [
    "List end-to-end consulting and custom development services",
    "Focus on deliverables, speed, and ROI",
  ],
  marquee: [
    "Add 6 impressive modern tech badges and feature highlights",
    "Showcase Fortune 500 client names and trust tags",
  ],
  carousel: [
    "Create 3 vivid product showcase slides with headlines",
    "Craft customer success stories with metrics",
  ],
  team: [
    "Generate realistic executive leadership profiles with bios",
    "Add design & engineering lead profiles",
  ],
  testimonials: [
    "Create realistic praise from verified VP of Product & CTO",
    "Highlight 300% efficiency gains and seamless UX",
  ],
  faq: [
    "Add 5 most asked questions regarding pricing and onboarding",
    "Write clear, reassuring answers addressing security & privacy",
  ],
  cta: [
    "Write an irresistible urgency-driven headline & button",
    "Offer 14-day free trial with no credit card required",
  ],
  stats: [
    "Showcase 99.99% uptime, 10M+ users, and 4.9/5 rating",
    "Highlight high-growth performance metrics",
  ],
};

function DiffColumn({
  title,
  sections,
  isAfter = false,
}: {
  title: string;
  sections: AiSuggestion["before"];
  isAfter?: boolean;
}) {
  return (
    <div
      className={`min-w-0 flex-1 rounded-xl border p-3 ${
        isAfter
          ? "border-purple-500/30 bg-purple-500/5 dark:border-purple-500/20 dark:bg-purple-950/20"
          : "border-ed-border bg-ed-subtle"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider ${
            isAfter ? "text-purple-600 dark:text-purple-400" : "text-ed-faint"
          }`}
        >
          {title}
        </span>
        <span className="text-[10px] text-ed-muted">
          {sections.length} {sections.length === 1 ? "section" : "sections"}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {sections.map((section, idx) => {
          const def = SECTION_DEFINITIONS[section.type as SectionType];
          const sectionTitle =
            (section.data as Record<string, unknown>)?.title ||
            (section.data as Record<string, unknown>)?.headline ||
            def?.label ||
            section.type;

          return (
            <li
              key={section.id || idx}
              className="flex items-center gap-1.5 rounded-lg border border-ed-border/60 bg-ed-panel px-2.5 py-1.5 text-ed-xs shadow-2xs"
            >
              <span className="size-1.5 rounded-full bg-ed-accent shrink-0" />
              <span className="font-medium text-ed-text truncate">
                {def?.label || section.type}
              </span>
              <span className="text-ed-muted truncate text-[11px] ml-auto">
                {String(sectionTitle).slice(0, 18)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const COLOR_MAP: Record<string, string> = {
  red: "#dc2626",
  darkred: "#991b1b",
  lightred: "#f87171",
  blue: "#2563eb",
  darkblue: "#1e3a8a",
  lightblue: "#60a5fa",
  green: "#16a34a",
  darkgreen: "#14532d",
  emerald: "#059669",
  teal: "#0d9488",
  cyan: "#0891b2",
  purple: "#9333ea",
  violet: "#7c3aed",
  indigo: "#4f46e5",
  pink: "#db2777",
  yellow: "#ca8a04",
  orange: "#ea580c",
  amber: "#d97706",
  black: "#000000",
  white: "#ffffff",
  gray: "#4b5563",
  darkgray: "#1f2937",
  slate: "#0f172a",
  zinc: "#18181b",
};

function sanitizeHex(val: unknown): string | undefined {
  if (typeof val !== "string") return undefined;
  const trimmed = val.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed;
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    const [, r, g, b] = trimmed.split("");
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  const cleanKey = trimmed.replace(/[^a-z]/g, "");
  return COLOR_MAP[cleanKey];
}

function normalizeSection(raw: Section): Section {
  const type = (raw.type as SectionType) in SECTION_DEFINITIONS ? (raw.type as SectionType) : "features";
  const def = SECTION_DEFINITIONS[type];
  const defaultData = def ? def.createData() : {};
  const rawData = (raw.data || {}) as Record<string, unknown>;

  const mergedData: Record<string, unknown> = {
    ...defaultData,
    ...rawData,
  };

  // Safe mapping for common AI field name synonyms
  if (rawData.title && !rawData.heading && "heading" in (defaultData as Record<string, unknown>)) {
    mergedData.heading = rawData.title;
  }
  if (rawData.subtitle && !rawData.subheading && "subheading" in (defaultData as Record<string, unknown>)) {
    mergedData.subheading = rawData.subtitle;
  }
  if (rawData.subtitle && !rawData.intro && "intro" in (defaultData as Record<string, unknown>)) {
    mergedData.intro = rawData.subtitle;
  }
  if (rawData.description && !rawData.intro && "intro" in (defaultData as Record<string, unknown>)) {
    mergedData.intro = rawData.description;
  }

  // Normalize string image URLs to { url, alt } objects
  if (typeof mergedData.backgroundImage === "string") {
    mergedData.backgroundImage = { url: mergedData.backgroundImage, alt: "Hero Background" };
  }
  if (typeof mergedData.image === "string") {
    mergedData.image = { url: mergedData.image, alt: "Image" };
  }

  // Type-specific schema normalization
  if (type === "cta") {
    const validCtaVariants = ["centered-card", "split-visual", "floating-card", "minimal-editorial"];
    if (typeof mergedData.variant !== "string" || !validCtaVariants.includes(mergedData.variant)) {
      mergedData.variant = "centered-card";
    }
    if (rawData.description && !mergedData.text) {
      mergedData.text = rawData.description;
    }
    if (rawData.primaryButton && !mergedData.button) {
      mergedData.button = rawData.primaryButton;
    }
    if (rawData.cta && !mergedData.button) {
      mergedData.button = rawData.cta;
    }
    if (!mergedData.button || typeof (mergedData.button as Record<string, unknown>)?.label !== "string") {
      mergedData.button = { label: "Get started", href: "/contact" };
    }
  } else if (type === "contact") {
    const validContactVariants = ["split-form", "cards-hub", "minimal-editorial", "floating-glass"];
    if (typeof mergedData.variant !== "string" || !validContactVariants.includes(mergedData.variant)) {
      mergedData.variant = "split-form";
    }
    if (mergedData.showForm === undefined) {
      mergedData.showForm = true;
    }
    if (!mergedData.submitLabel) {
      mergedData.submitLabel = "Send message";
    }
  } else if (type === "features") {
    const validFeaturesVariants = ["grid", "split", "pastel-icons", "minimal", "cards"];
    if (typeof mergedData.variant !== "string" || !validFeaturesVariants.includes(mergedData.variant)) {
      mergedData.variant = "pastel-icons";
    }
  } else if (type === "services") {
    const validServicesVariants = ["cards-grid", "compact-list", "split-showcase", "minimal-numbered"];
    if (typeof mergedData.variant !== "string" || !validServicesVariants.includes(mergedData.variant)) {
      mergedData.variant = "cards-grid";
    }
  } else if (type === "hero") {
    const validHeroVariants = ["centered", "split", "split-left", "background-image", "video-bg", "gradient", "curved-bottom", "soft-card", "minimal-typography", "floating-cards", "asymmetric"];
    if (typeof mergedData.variant !== "string" || !validHeroVariants.includes(mergedData.variant)) {
      mergedData.variant = mergedData.backgroundImage ? "background-image" : "centered";
    }
    if (mergedData.backgroundImage && !mergedData.imagePosition) {
      mergedData.imagePosition = "background";
    }
  }

  // Ensure arrays like items, tiers, members, slides never become non-arrays
  for (const [key, val] of Object.entries(defaultData as Record<string, unknown>)) {
    if (Array.isArray(val) && (!Array.isArray(mergedData[key]) || (mergedData[key] as unknown[]).length === 0)) {
      if (!Array.isArray(mergedData[key])) {
        mergedData[key] = val;
      }
    }
  }

  const rawSettings = (raw.settings || {}) as Record<string, unknown>;
  const cleanSettings: SectionSettings = {
    ...DEFAULT_SECTION_SETTINGS,
  };

  const validBgs = ["default", "surface", "primary", "dark"];
  if (typeof rawSettings.background === "string" && validBgs.includes(rawSettings.background)) {
    cleanSettings.background = rawSettings.background as SectionSettings["background"];
  } else if (typeof rawSettings.background === "string") {
    // If user passed a custom color like "red" or "#ff0000" in background
    const hex = sanitizeHex(rawSettings.background);
    if (hex) {
      cleanSettings.customColors = {
        ...(cleanSettings.customColors || {}),
        background: hex,
      };
    }
    cleanSettings.background = "default";
  }

  if (typeof rawSettings.customColors === "object" && rawSettings.customColors !== null) {
    const rawCustom = rawSettings.customColors as Record<string, unknown>;
    const cleanCustom: Record<string, string> = { ...(cleanSettings.customColors || {}) };
    for (const key of ["background", "text", "primary", "muted", "border"] as const) {
      const hex = sanitizeHex(rawCustom[key]);
      if (hex) {
        cleanCustom[key] = hex;
      }
    }
    if (Object.keys(cleanCustom).length > 0) {
      cleanSettings.customColors = cleanCustom;
    }
  }

  if (typeof rawSettings.hideOnMobile === "boolean") {
    cleanSettings.hideOnMobile = rawSettings.hideOnMobile;
  }
  if (typeof rawSettings.spacing === "string") {
    cleanSettings.spacing = rawSettings.spacing as SectionSettings["spacing"];
  }
  if (typeof rawSettings.align === "string") {
    cleanSettings.align = rawSettings.align as SectionSettings["align"];
  }

  return {
    id: raw.id || crypto.randomUUID(),
    type,
    hidden: Boolean(raw.hidden),
    settings: cleanSettings,
    data: mergedData,
  } as Section;
}

export default function AiDrawer() {
  const { aiOpen, setAiOpen, website, notify } = useEditor();
  const dispatch = useBuilderPuck((state) => state.dispatch);
  const selectedIndex = useBuilderPuck(
    (state) => state.appState.ui.itemSelector?.index ?? null,
  );
  const selectedItem = useBuilderPuck((state) =>
    selectedIndex !== null
      ? (state.appState.data.content[selectedIndex] ?? null)
      : null,
  );
  const allItems = useBuilderPuck((state) => state.appState.data.content);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null);
  const promptId = useId();
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (aiOpen) {
      setTimeout(() => promptRef.current?.focus(), 50);
    }
  }, [aiOpen]);

  if (!aiOpen) return null;

  const currentSection = selectedItem ? itemAsSection(selectedItem) : null;
  const currentSections = allItems.map(itemAsSection);

  const isSectionScope = Boolean(currentSection);
  const activeType = currentSection?.type as SectionType | undefined;
  const scopeLabel = currentSection && activeType
    ? `${SECTION_DEFINITIONS[activeType]?.label || activeType}: ${itemTitle(selectedItem!)}`
    : "Whole Page (Smart Mode)";

  const promptSuggestions =
    activeType && SECTION_TYPE_PROMPTS[activeType]
      ? SECTION_TYPE_PROMPTS[activeType]
      : DEFAULT_PAGE_PROMPTS;

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setSuggestion(null);

    try {
      const result = await websitesApi.generateAiSuggestion(website.id, {
        prompt: prompt.trim(),
        scope: isSectionScope ? "section" : "page",
        sectionId: currentSection?.id,
        currentSection: currentSection ?? undefined,
        currentSections,
      });

      setSuggestion(result);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to generate AI changes.";
      notify(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!suggestion) return;

    try {
      const isAddScope =
        (suggestion.target as Record<string, unknown>).scope === "section_add" ||
        (suggestion.before.length === 0 && suggestion.after.length === 1);

      if (isAddScope) {
        const rawSection = suggestion.after[0];
        if (rawSection) {
          const normalized = normalizeSection(rawSection as Section);
          const insertIdx = selectedIndex !== null ? selectedIndex + 1 : allItems.length;
          insertSections(dispatch, [normalized], insertIdx);
          notify(`Added new ${SECTION_DEFINITIONS[normalized.type]?.label || normalized.type} section!`, "success");
        }
      } else if (suggestion.target.scope === "section") {
        const rawSection = suggestion.after[0];
        if (rawSection) {
          const normalized = normalizeSection(rawSection as Section);
          // Find target item index in Puck content
          const foundIdx = allItems.findIndex((it) => it.props.id === normalized.id);
          const targetIdx = foundIdx !== -1 ? foundIdx : selectedIndex;
          if (targetIdx !== null && targetIdx !== -1) {
            replaceSection(dispatch, targetIdx, normalized);
            notify(`Applied AI changes to ${SECTION_DEFINITIONS[normalized.type]?.label || normalized.type}!`, "success");
          } else {
            insertSections(dispatch, [normalized], allItems.length);
            notify(`Added ${SECTION_DEFINITIONS[normalized.type]?.label || normalized.type}!`, "success");
          }
        }
      } else {
        // Whole page replacement: normalize each section
        const validSections = suggestion.after.map((s) => normalizeSection(s as Section));
        const newItems = validSections.map(sectionToItem);
        dispatch({
          type: "setData",
          data: (previous) => ({
            ...previous,
            root: previous.root ?? { props: {} },
            content: newItems,
          }),
        });
        notify("Updated page layout with AI successfully!", "success");
      }

      setSuggestion(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to apply AI changes.";
      notify(errorMsg, "danger");
    }
  };

  return (
    <aside
      aria-label="AI assistant"
      onKeyDown={(event) => event.key === "Escape" && setAiOpen(false)}
      className="absolute inset-y-0 right-0 z-(--z-ed-drawer) flex w-96 flex-col border-l border-ed-border bg-ed-panel shadow-2xl backdrop-blur-md"
    >
      {/* Header */}
      <header className="flex items-center gap-2.5 border-b border-ed-border px-3.5 py-3 bg-ed-subtle/50">
        <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-sm">
          <Sparkles className="size-4 animate-pulse" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-ed-sm font-semibold text-ed-text">
              AI Copilot
            </h2>
            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              2026 Engine
            </span>
          </div>
          <p className="truncate text-ed-xs text-ed-muted">
            Target: <strong className="font-medium text-ed-text">{scopeLabel}</strong>
          </p>
        </div>
        <ToolButton
          label="Close AI assistant"
          size="sm"
          onClick={() => setAiOpen(false)}
        >
          <X className="size-4" aria-hidden />
        </ToolButton>
      </header>

      {/* Main Drawer Body */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-3.5">
        {/* Scope Context Banner */}
        <div className="rounded-xl border border-ed-border bg-ed-subtle/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-ed-xs font-semibold text-ed-text">
              <Wand2 className="size-3.5 text-purple-600 dark:text-purple-400" />
              {isSectionScope ? "Single Section Edit Mode" : "Full Page Mode"}
            </div>
            {isSectionScope && (
              <button
                type="button"
                onClick={() => selectSection(dispatch, null)}
                className="text-[11px] font-medium text-purple-600 hover:underline dark:text-purple-400 cursor-pointer"
              >
                Deselect (Page Mode)
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-ed-muted">
            {isSectionScope
              ? `AI will edit the selected ${activeType ? SECTION_DEFINITIONS[activeType]?.label || activeType : "component"}. (Tip: To add a new section instead, simply type "add hero", "add pricing", etc.)`
              : "Generate or improve page sections tailored to your prompt."}
          </p>
        </div>

        {/* Prompt Input Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor={promptId}
              className="text-ed-xs font-medium text-ed-text"
            >
              Instruction Prompt
            </label>
            <span className="text-[11px] text-ed-faint">
              {prompt.length}/2000
            </span>
          </div>

          <textarea
            id={promptId}
            ref={promptRef}
            value={prompt}
            maxLength={2000}
            rows={3}
            disabled={loading}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder={
              isSectionScope
                ? `e.g. "Make the copy punchier and add 2 enterprise features"`
                : `e.g. "Design a high-converting landing page for a modern fintech app"`
            }
            className="resize-none rounded-xl border border-ed-border bg-ed-subtle px-3 py-2.5 text-ed-sm text-ed-text placeholder:text-ed-faint focus:border-purple-500 focus:bg-ed-panel focus:outline-none transition-all shadow-inner"
          />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="flex h-9 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-medium text-white shadow-sm hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all text-ed-xs"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Crafting with AI…</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                <span>Generate Suggestion</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ed-faint">
            Quick Prompts
          </p>
          <div className="flex flex-col gap-1.5">
            {promptSuggestions.map((text) => (
              <button
                key={text}
                type="button"
                disabled={loading}
                onClick={() => {
                  setPrompt(text);
                  promptRef.current?.focus();
                }}
                className="group flex items-center justify-between rounded-xl border border-ed-border/70 bg-ed-panel px-3 py-2 text-left text-ed-xs text-ed-text hover:border-purple-500/40 hover:bg-purple-500/5 transition-all"
              >
                <span className="truncate">{text}</span>
                <ArrowRight className="size-3 text-ed-faint opacity-0 group-hover:opacity-100 group-hover:text-purple-600 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Suggestion Preview & Diff Card */}
        {suggestion && (
          <section
            aria-label="Suggested change"
            className="flex flex-col gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/5 p-3.5 shadow-sm dark:bg-purple-950/20"
          >
            <div className="flex items-start gap-2">
              <span className="grid size-5 place-items-center rounded-full bg-purple-600 text-white shrink-0 mt-0.5">
                <Check className="size-3" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-ed-xs font-semibold text-ed-text">
                  AI Proposal Ready
                </h3>
                <p className="mt-0.5 text-ed-xs text-ed-muted leading-relaxed">
                  {suggestion.summary}
                </p>
              </div>
            </div>

            {/* Visual Diff Columns */}
            <div className="flex gap-2">
              <DiffColumn title="Current" sections={suggestion.before} />
              <DiffColumn title="AI Output" sections={suggestion.after} isAfter />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleApply}
                className="flex h-8.5 flex-1 items-center justify-center gap-1.5 rounded-xl bg-purple-600 text-ed-xs font-medium text-white shadow-sm hover:bg-purple-500 active:scale-[0.98] transition-all"
              >
                <Check className="size-3.5" />
                Apply Changes
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                title="Regenerate with current prompt"
                className="flex h-8.5 items-center gap-1.5 rounded-xl border border-ed-border bg-ed-panel px-3 text-ed-xs font-medium text-ed-text hover:bg-ed-hover transition-all"
              >
                <RotateCcw className="size-3.5" />
                Retry
              </button>

              <button
                type="button"
                onClick={() => setSuggestion(null)}
                className="h-8.5 rounded-xl px-2.5 text-ed-xs text-ed-muted hover:bg-ed-hover hover:text-ed-text transition-all"
              >
                Discard
              </button>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
