import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  History,
  Loader2,
  MessageSquarePlus,
  RotateCcw,
  Undo2,
  X,
} from "lucide-react";
import { AiSparklesIcon } from "../../../components/icons/AiSparklesIcon.tsx";
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
import { selectSection, useBuilderPuck } from "../puck/puck-api.ts";
import { ToolButton } from "./ui.tsx";


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
  } else if (type === "pricing") {
    const validPricingVariants = ["cards-grid", "minimal-monochrome", "spotlight-tier", "horizontal-rows"];
    if (typeof mergedData.variant !== "string" || !validPricingVariants.includes(mergedData.variant)) {
      mergedData.variant = "cards-grid";
    }
    if (!mergedData.heading) mergedData.heading = "Transparent Pricing";
    const rawPlans = Array.isArray(rawData.plans) ? rawData.plans : Array.isArray(rawData.tiers) ? rawData.tiers : Array.isArray(mergedData.plans) ? (mergedData.plans as unknown[]) : [];
    if (rawPlans.length > 0) {
      mergedData.plans = rawPlans.map((p: any, idx: number) => ({
        name: typeof p?.name === "string" ? p.name : `Plan ${idx + 1}`,
        price: typeof p?.price === "string" ? p.price : "$29",
        period: typeof p?.period === "string" ? p.period : typeof p?.interval === "string" ? p.interval : "/mo",
        originalPrice: typeof p?.originalPrice === "string" ? p.originalPrice : undefined,
        badge: typeof p?.badge === "string" ? p.badge : undefined,
        description: typeof p?.description === "string" ? p.description : "",
        features: Array.isArray(p?.features) ? p.features.map(String) : ["All core features"],
        excludedFeatures: Array.isArray(p?.excludedFeatures) ? p.excludedFeatures.map(String) : undefined,
        cta: p?.cta && typeof p.cta === "object" ? p.cta : p?.button && typeof p.button === "object" ? p.button : { label: "Get started", href: "/contact" },
        featured: Boolean(p?.featured ?? p?.highlighted ?? idx === 1),
        highlightNote: typeof p?.highlightNote === "string" ? p.highlightNote : undefined,
      }));
    }
  } else if (type === "features") {
    const validFeaturesVariants = ["grid", "split", "pastel-icons", "minimal", "cards"];
    if (typeof mergedData.variant !== "string" || !validFeaturesVariants.includes(mergedData.variant)) {
      mergedData.variant = "pastel-icons";
    }
  } else if (type === "services") {
    const validServicesVariants = ["cards-grid", "bento-grid", "split-showcase", "interactive-list", "horizontal-cards", "minimal-numbered"];
    if (typeof mergedData.variant !== "string" || !validServicesVariants.includes(mergedData.variant)) {
      mergedData.variant = "cards-grid";
    }
  } else if (type === "faq") {
    const validFaqVariants = ["accordion-classic", "two-column-grid", "split-sidebar", "minimal-numbered", "categorized-cards"];
    if (typeof mergedData.variant !== "string" || !validFaqVariants.includes(mergedData.variant)) {
      mergedData.variant = "accordion-classic";
    }
  } else if (type === "team") {
    const validTeamVariants = ["grid-cards", "spotlight-featured", "minimal-editorial", "glass-overlay"];
    if (typeof mergedData.variant !== "string" || !validTeamVariants.includes(mergedData.variant)) {
      mergedData.variant = "grid-cards";
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

type PromptHistoryItem = {
  id: string;
  title: string;
  prompt: string;
  timeAgo: string;
  timestamp: number;
};

function formatRelativeTime(ts: number): string {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

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
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);
  const [chatReply, setChatReply] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(`ai_prompt_history_${website?.id}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [originalCanvasContent, setOriginalCanvasContent] = useState<typeof allItems | null>(null);
  const [previewCanvasContent, setPreviewCanvasContent] = useState<typeof allItems | null>(null);
  const [previewMode, setPreviewMode] = useState<"ai" | "original">("ai");
  const [historySnapshot, setHistorySnapshot] = useState<{
    content: typeof allItems;
    summary: string;
    timestamp: string;
  } | null>(null);
  const promptId = useId();
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (aiOpen) {
      setTimeout(() => promptRef.current?.focus(), 50);
    }
  }, [aiOpen]);

  // Clean up and restore original canvas if drawer is closed without accepting
  useEffect(() => {
    return () => {
      if (originalCanvasContent) {
        dispatch({
          type: "setData",
          data: (previous) => ({
            ...previous,
            root: previous.root ?? { props: {} },
            content: originalCanvasContent,
          }),
        });
      }
    };
  }, [originalCanvasContent, dispatch]);

  if (!aiOpen) return null;

  const currentSection = selectedItem ? itemAsSection(selectedItem) : null;
  const currentSections = allItems.map(itemAsSection);

  const isSectionScope = Boolean(currentSection);
  const activeType = currentSection?.type as SectionType | undefined;

  const VIBE_PRESETS = isSectionScope
    ? [
        { label: "Modern SaaS", prompt: "Transform into modern high-converting SaaS style with punchy copy and high-contrast CTA" },
        { label: "Cyber Glow", prompt: "Give this section a futuristic cyberpunk dark mode with vibrant neon glow and glassmorphism styling" },
        { label: "Clean Luxury", prompt: "Redesign with elegant luxury minimalist layout, elegant typography, and calm spacing" },
        { label: "Stock Image", prompt: "Add a full cover high-resolution background image with dark overlay and crisp white text" },
      ]
    : [
        { label: "Modern AI SaaS", prompt: "Generate a complete modern AI SaaS landing page with dark mode, high-converting hero, features, and pricing" },
        { label: "Luxury Agency", prompt: "Generate a high-end design agency landing page with proof, showcase carousel, and client testimonials" },
        { label: "Artisan Boutique", prompt: "Generate a warm boutique artisan bakery landing page with rich menus and contact cards" },
        { label: "Enterprise Platform", prompt: "Generate a high-trust enterprise B2B platform page with stats, security badges, and tiered plans" },
      ];

  const handleNewChat = () => {
    if (originalCanvasContent) {
      handleReject();
    }
    setChatHistory([]);
    setChatReply(null);
    setPrompt("");
    setSuggestion(null);
    notify("Started a fresh AI conversation session.", "success");
  };

  const handleClearHistory = () => {
    setPromptHistory([]);
    try {
      localStorage.removeItem(`ai_prompt_history_${website?.id}`);
    } catch {
      // ignore
    }
  };

  const handleGenerate = async (customPrompt?: string) => {
    const textToRun = (typeof customPrompt === "string" ? customPrompt : prompt).trim();
    if (!textToRun || loading) return;

    if (customPrompt) {
      setPrompt(customPrompt);
    }

    setLoading(true);

    try {
      const historyPayload = chatHistory.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await websitesApi.generateAiSuggestion(website.id, {
        prompt: textToRun,
        scope: isSectionScope ? "section" : "page",
        sectionId: currentSection?.id,
        currentSection: currentSection ?? undefined,
        currentSections,
        history: historyPayload,
      });

      // Append turns to chat history (cap at last 10 messages)
      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChatHistory((prev) => [
        ...prev.slice(-8),
        { id: crypto.randomUUID(), role: "user", content: textToRun, timestamp: nowTime },
        { id: crypto.randomUUID(), role: "assistant", content: result.summary, timestamp: nowTime },
      ]);

      // Save to prompt history
      const newHistoryItem: PromptHistoryItem = {
        id: crypto.randomUUID(),
        title: textToRun.length > 40 ? `${textToRun.slice(0, 40)}…` : textToRun,
        prompt: textToRun,
        timeAgo: "Just now",
        timestamp: Date.now(),
      };
      setPromptHistory((prev) => {
        const filtered = prev.filter((p) => p.prompt !== textToRun);
        const updated = [newHistoryItem, ...filtered].slice(0, 15);
        try {
          localStorage.setItem(`ai_prompt_history_${website?.id}`, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      const isChatScope =
        (result.target as Record<string, unknown>).scope === "chat" ||
        (result.before.length === 0 && result.after.length === 0);

      if (isChatScope) {
        setChatReply((result as { chatReply?: string }).chatReply || result.summary);
        setSuggestion(null);
        setOriginalCanvasContent(null);
        setPreviewCanvasContent(null);
        return;
      }

      setChatReply(null);

      // Save original baseline before previewing
      const baseline = originalCanvasContent ?? structuredClone(allItems);
      setOriginalCanvasContent(baseline);

      // Compute preview items
      let nextItems: typeof allItems = [];
      const isAddScope =
        (result.target as Record<string, unknown>).scope === "section_add" ||
        (result.before.length === 0 && result.after.length === 1);

      if (isAddScope) {
        const rawSection = result.after[0];
        if (rawSection) {
          const normalized = normalizeSection(rawSection as Section);
          const insertIdx = selectedIndex !== null ? selectedIndex + 1 : baseline.length;
          nextItems = [
            ...baseline.slice(0, insertIdx),
            sectionToItem(normalized),
            ...baseline.slice(insertIdx),
          ];
        }
      } else if (result.target.scope === "section") {
        const rawSection = result.after[0];
        if (rawSection) {
          const normalized = normalizeSection(rawSection as Section);
          const foundIdx = baseline.findIndex((it) => it.props.id === normalized.id);
          const targetIdx = foundIdx !== -1 ? foundIdx : selectedIndex;
          if (targetIdx !== null && targetIdx !== -1 && targetIdx < baseline.length) {
            nextItems = baseline.map((it, idx) => (idx === targetIdx ? sectionToItem(normalized) : it));
          } else {
            nextItems = [...baseline, sectionToItem(normalized)];
          }
        }
      } else {
        const validSections: Section[] = result.after.map((s: unknown) => normalizeSection(s as Section));
        const hasHeader = validSections.some((s) => s.type === "header");
        const hasFooter = validSections.some((s) => s.type === "footer");
        const baselineHeader = baseline.find((it) => itemAsSection(it).type === "header");
        const baselineFooter = baseline.find((it) => itemAsSection(it).type === "footer");

        let assembled = validSections.map(sectionToItem);
        if (!hasHeader && baselineHeader) {
          assembled = [baselineHeader, ...assembled];
        }
        if (!hasFooter && baselineFooter) {
          assembled = [...assembled, baselineFooter];
        }
        nextItems = assembled;
      }

      setPreviewCanvasContent(nextItems);
      setPreviewMode("ai");
      setSuggestion(result);

      // Immediately render live preview onto canvas!
      dispatch({
        type: "setData",
        data: (previous) => ({
          ...previous,
          root: previous.root ?? { props: {} },
          content: nextItems,
        }),
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to generate AI changes.";
      notify(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePreview = (mode: "ai" | "original") => {
    setPreviewMode(mode);
    const targetItems = mode === "ai" ? previewCanvasContent : originalCanvasContent;
    if (targetItems) {
      dispatch({
        type: "setData",
        data: (previous) => ({
          ...previous,
          root: previous.root ?? { props: {} },
          content: targetItems,
        }),
      });
    }
  };

  const handleAccept = () => {
    if (!previewCanvasContent || !originalCanvasContent) return;

    // Commit preview content as the permanent canvas state
    dispatch({
      type: "setData",
      data: (previous) => ({
        ...previous,
        root: previous.root ?? { props: {} },
        content: previewCanvasContent,
      }),
    });

    // Save baseline to rollback history
    setHistorySnapshot({
      content: originalCanvasContent,
      summary: suggestion?.summary || "AI Changes",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    notify("AI changes accepted and saved!", "success");

    setSuggestion(null);
    setOriginalCanvasContent(null);
    setPreviewCanvasContent(null);
  };

  const handleReject = () => {
    if (originalCanvasContent) {
      // Revert canvas to original
      dispatch({
        type: "setData",
        data: (previous) => ({
          ...previous,
          root: previous.root ?? { props: {} },
          content: originalCanvasContent,
        }),
      });
      notify("AI changes discarded — restored original canvas.");
    }
    setSuggestion(null);
    setOriginalCanvasContent(null);
    setPreviewCanvasContent(null);
  };

  const handleRollback = () => {
    if (!historySnapshot) return;
    dispatch({
      type: "setData",
      data: (previous) => ({
        ...previous,
        root: previous.root ?? { props: {} },
        content: historySnapshot.content,
      }),
    });
    notify("Reverted to previous version!", "success");
    setHistorySnapshot(null);
  };

  const isNewChat = !suggestion && !chatReply && chatHistory.length === 0;

  return (
    <aside
      aria-label="AI Copilot"
      onKeyDown={(event) => event.key === "Escape" && setAiOpen(false)}
      className="z-(--z-ed-panel) flex h-full min-h-0 w-96 shrink-0 flex-col border-l border-ed-border bg-ed-panel overflow-hidden transition-all duration-150 shadow-sm select-none"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-ed-border px-3.5 py-2.5 bg-ed-subtle/40 shrink-0">
        <div className="flex items-center gap-2">
          <AiSparklesIcon className="size-4" variant="glossy" glow />
          <h2 className="text-ed-xs font-bold text-ed-text tracking-tight">
            AI Copilot
          </h2>
        </div>

        <div className="flex items-center gap-0.5">
          <ToolButton
            label="New chat thread (Reset context)"
            size="sm"
            onClick={handleNewChat}
          >
            <MessageSquarePlus className="size-3.5" aria-hidden />
          </ToolButton>
          <ToolButton
            label="Close AI assistant"
            size="sm"
            onClick={() => {
              if (originalCanvasContent) {
                handleReject();
              }
              setAiOpen(false);
            }}
          >
            <X className="size-3.5" aria-hidden />
          </ToolButton>
        </div>
      </header>

      {/* Main Drawer Scroll Area */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3.5">
        {/* Sleek Glowing Dot Mode Indicator */}
        <div className="flex items-center justify-between px-1 text-ed-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            <span className="font-semibold text-ed-text text-[11.5px]">
              {isSectionScope
                ? `Single Section: ${activeType ? SECTION_DEFINITIONS[activeType]?.label || activeType : "Selected"}`
                : "Whole Page (Smart Mode)"}
            </span>
          </div>

          {isSectionScope && (
            <button
              type="button"
              onClick={() => selectSection(dispatch, null)}
              className="text-[11px] font-medium text-brand hover:underline cursor-pointer"
            >
              Deselect (Page Mode)
            </button>
          )}
        </div>

        {/* 1-Click Style & Vibe Compact Chips (ONLY on fresh / new chat) */}
        {isNewChat && (
          <div className="grid grid-cols-2 gap-1.5 animate-in fade-in duration-200">
            {VIBE_PRESETS.map((vibe) => (
              <button
                key={vibe.label}
                type="button"
                disabled={loading}
                onClick={() => handleGenerate(vibe.prompt)}
                className="flex items-center gap-1.5 rounded-xl border border-ed-border/70 bg-ed-subtle/50 px-2.5 py-1.5 text-left text-[11px] text-ed-text hover:border-brand/40 hover:bg-blue-500/5 hover:text-brand transition-all group cursor-pointer"
              >
                <span className="truncate font-medium">{vibe.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Centered Antigravity Prompt Box (Shown on fresh / new chat) */}
        {isNewChat && (
          <div className="flex flex-col rounded-2xl border border-ed-border bg-ed-panel p-3 shadow-xs focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all animate-in fade-in duration-200">
            <textarea
              id={promptId}
              ref={promptRef}
              value={prompt}
              maxLength={2000}
              rows={3}
              disabled={loading}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder={
                isSectionScope
                  ? `Ask anything, describe changes to this ${activeType || "section"}, or type / for actions...`
                  : "Ask anything, describe your website goal, or type / for actions..."
              }
              className="w-full resize-none bg-transparent text-ed-xs text-ed-text placeholder:text-ed-muted/60 focus:outline-none leading-relaxed"
            />

            <div className="mt-2 flex items-center justify-between border-t border-ed-border/40 pt-2 text-ed-xs">
              <span className="text-ed-muted text-[10.5px] truncate font-medium">
                {isSectionScope ? activeType : "Full Page"}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ed-faint font-mono">{prompt.length}/2000</span>
                <button
                  type="button"
                  disabled={!prompt.trim() || loading}
                  onClick={() => handleGenerate()}
                  className="grid size-7 place-items-center rounded-full bg-brand text-white shadow-xs hover:bg-brand-hover active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ArrowRight className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Copilot Direct Response / Guidance Card */}
        {chatReply && !suggestion && (
          <div className="flex flex-col gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-3.5 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AiSparklesIcon className="size-3.5" variant="glossy" />
                <span className="text-[11.5px] font-bold text-ed-text">AI Copilot</span>
              </div>
              <button
                type="button"
                onClick={() => setChatReply(null)}
                className="text-ed-muted hover:text-ed-text p-0.5 rounded transition-colors cursor-pointer"
                title="Dismiss message"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="text-ed-xs text-ed-text leading-relaxed whitespace-pre-line">
              {chatReply}
            </div>
          </div>
        )}

        {/* 1-Click Rollback History Banner */}
        {historySnapshot && !suggestion && (
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-ed-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 truncate">
              <History className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="truncate">Saved checkpoint ({historySnapshot.timestamp})</span>
            </div>
            <button
              type="button"
              onClick={handleRollback}
              className="flex items-center gap-1 rounded-lg bg-amber-500/20 px-2 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-500/30 dark:text-amber-300 transition-colors shrink-0 ml-2 cursor-pointer"
            >
              <Undo2 className="size-3" />
              Rollback
            </button>
          </div>
        )}

        {/* Suggestion Live Preview & Decision Controller (Premium Minimalist UI) */}
        {suggestion && (
          <section
            aria-label="Suggested change"
            className="flex flex-col gap-3 rounded-2xl border border-brand/30 bg-ed-panel p-3.5 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {/* Live Indicator Header & Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11.5px] font-bold tracking-tight text-ed-text">
                  Live Canvas Preview
                </span>
              </div>

              {/* Minimal Segmented Toggle */}
              <div className="flex items-center rounded-lg bg-ed-subtle p-0.5 border border-ed-border/70 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleTogglePreview("ai")}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    previewMode === "ai"
                      ? "bg-brand text-white shadow-xs"
                      : "text-ed-muted hover:text-ed-text"
                  }`}
                >
                  <Eye className="size-3" />
                  AI
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePreview("original")}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    previewMode === "original"
                      ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 shadow-xs"
                      : "text-ed-muted hover:text-ed-text"
                  }`}
                >
                  <Undo2 className="size-3" />
                  Original
                </button>
              </div>
            </div>

            {/* Summary & Affected Section Tags */}
            <div className="rounded-xl bg-ed-subtle/50 p-2.5 border border-ed-border/40">
              <p className="text-ed-xs text-ed-text leading-relaxed font-normal">
                {suggestion.summary}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestion.after.map((sec, idx) => (
                  <span
                    key={sec.id || idx}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10.5px] font-medium text-brand"
                  >
                    <span className="size-1.5 rounded-full bg-brand" />
                    {SECTION_DEFINITIONS[sec.type as SectionType]?.label || sec.type}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Actions: Accept / Reject / Retry */}
            <div className="flex flex-col gap-2 pt-0.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-ed-xs font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Check className="size-4" />
                  Accept Changes
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  className="flex h-9 px-3.5 items-center justify-center gap-1.5 rounded-xl border border-ed-border bg-ed-subtle text-ed-xs font-medium text-ed-text hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <X className="size-3.5" />
                  Reject
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-ed-muted">
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="flex items-center gap-1 hover:text-brand transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  Regenerate
                </button>
                <span className="text-[10px] text-ed-muted/80">Click Accept to keep on canvas</span>
              </div>
            </div>
          </section>
        )}

        {/* Antigravity Context & Prompt History */}
        {promptHistory.length > 0 && (
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-ed-faint">
                Recent History
              </span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[10.5px] text-ed-muted hover:text-brand transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-col gap-0.5">
              {promptHistory.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setPrompt(item.prompt);
                    promptRef.current?.focus();
                  }}
                  className="group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left hover:bg-ed-subtle/80 transition-all cursor-pointer"
                >
                  <span className="truncate text-ed-xs text-ed-text/90 group-hover:text-brand font-normal group-hover:font-medium">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-ed-muted/70 font-mono ml-2">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer for Fresh Chat */}
        {isNewChat && (
          <div className="mt-auto pt-4 pb-1 text-center">
            <p className="text-[10px] text-ed-muted/60">
              AI may make mistakes. Preview changes before accepting.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Docked Input Area (Shown when conversation/proposal is active) */}
      {!isNewChat && (
        <div className="p-3 border-t border-ed-border shrink-0 bg-ed-panel flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col rounded-2xl border border-ed-border bg-ed-subtle/30 p-2.5 shadow-xs focus-within:border-brand focus-within:bg-ed-panel focus-within:ring-2 focus-within:ring-brand/20 transition-all">
            <textarea
              id={promptId}
              ref={promptRef}
              value={prompt}
              maxLength={2000}
              rows={2}
              disabled={loading}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder={
                isSectionScope
                  ? `Describe changes to ${activeType || "section"}...`
                  : "Ask anything, describe your website goal..."
              }
              className="w-full resize-none bg-transparent text-ed-xs text-ed-text placeholder:text-ed-muted/60 focus:outline-none leading-relaxed max-h-32"
            />

            <div className="mt-1.5 flex items-center justify-between border-t border-ed-border/40 pt-1.5 text-ed-xs">
              <span className="text-ed-muted text-[10.5px] truncate font-medium">
                {isSectionScope ? activeType : "Whole Page"}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ed-faint font-mono">{prompt.length}/2000</span>
                <button
                  type="button"
                  disabled={!prompt.trim() || loading}
                  onClick={() => handleGenerate()}
                  className="grid size-6.5 place-items-center rounded-full bg-brand text-white shadow-xs hover:bg-brand-hover active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <ArrowRight className="size-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-ed-muted/60">
            AI may make mistakes. Preview changes before accepting.
          </p>
        </div>
      )}
    </aside>
  );
}
