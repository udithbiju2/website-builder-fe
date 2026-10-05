import { useEffect, useId, useRef, useState } from "react";
import { Check, PlugZap, RotateCcw, Sparkles, X } from "lucide-react";
import { SECTION_DEFINITIONS, type SectionType } from "../../../site-kit/index.ts";
import type { AiSuggestion } from "../schema/editor-document.ts";
import { useEditor } from "../editor-context.ts";
import { useBuilderPuck } from "../puck/puck-api.ts";
import { itemTitle } from "./panels/LayersPanel.tsx";
import { ToolButton } from "./ui.tsx";

const PAGE_PROMPTS = [
  "Write a hero headline for a boutique coffee roaster",
  "Make the tone friendlier and more concise",
  "Suggest sections for a SaaS pricing page",
];
const SECTION_PROMPTS = ["Rewrite this section in a clearer voice", "Shorten the copy by half", "Translate this section to Malayalam"];

function DiffColumn({ title, sections }: { title: string; sections: AiSuggestion["before"] }) {
  return (
    <div className="min-w-0 flex-1 rounded-ed border border-ed-border bg-ed-subtle p-2">
      <p className="mb-1 text-ed-2xs font-medium uppercase tracking-wider text-ed-faint">{title}</p>
      <ul className="flex flex-col gap-1">
        {sections.map((section) => (
          <li key={section.id} className="truncate text-ed-xs text-ed-text">
            {SECTION_DEFINITIONS[section.type].label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * AI assistant surface. No AI provider is connected yet, so generation is disabled;
 * the review flow (before/after, apply, reject, regenerate) is wired to typed suggestions.
 */
export default function AiDrawer() {
  const { aiOpen, setAiOpen } = useEditor();
  const selected = useBuilderPuck((state) =>
    state.appState.ui.itemSelector ? (state.appState.data.content[state.appState.ui.itemSelector.index] ?? null) : null,
  );
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null);
  const promptId = useId();
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (aiOpen) promptRef.current?.focus();
  }, [aiOpen]);

  if (!aiOpen) return null;

  const scope = selected
    ? `${SECTION_DEFINITIONS[selected.type as SectionType].label}: ${itemTitle(selected)}`
    : "Whole page";
  const suggestions = selected ? SECTION_PROMPTS : PAGE_PROMPTS;

  return (
    <aside
      aria-label="AI assistant"
      onKeyDown={(event) => event.key === "Escape" && setAiOpen(false)}
      className="absolute inset-y-0 right-0 z-(--z-ed-drawer) flex w-90 flex-col border-l border-ed-border bg-ed-panel shadow-ed-pop"
    >
      <header className="flex items-center gap-2 border-b border-ed-border px-3 py-2.5">
        <span className="grid size-7 place-items-center rounded-ed bg-ed-accent-soft text-ed-accent">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-ed-sm font-semibold text-ed-text">AI assistant</h2>
          <p className="truncate text-ed-xs text-ed-muted">Editing: {scope}</p>
        </div>
        <ToolButton label="Close AI assistant" size="sm" onClick={() => setAiOpen(false)}>
          <X className="size-4" aria-hidden />
        </ToolButton>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
        <div role="note" className="flex gap-2 rounded-ed border border-ed-border bg-ed-subtle p-2.5">
          <PlugZap className="mt-0.5 size-4 shrink-0 text-ed-muted" aria-hidden />
          <p className="text-ed-xs leading-relaxed text-ed-muted">
            AI isn't connected yet. Once it is, suggestions appear here as a before-and-after preview. Nothing changes on your page until you apply it.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={promptId} className="text-ed-xs font-medium text-ed-text">
            What should change?
          </label>
          <textarea
            id={promptId}
            ref={promptRef}
            value={prompt}
            maxLength={2000}
            rows={4}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={selected ? "Describe how to improve this section…" : "Describe the page or the change you want…"}
            className="resize-none rounded-ed border border-ed-border bg-ed-subtle px-2.5 py-2 text-ed-sm text-ed-text placeholder:text-ed-faint focus:border-ed-accent focus:bg-ed-panel focus:outline-none"
          />
          <button
            type="button"
            disabled
            title="AI isn't connected yet"
            className="flex h-8 items-center justify-center gap-1.5 rounded-ed bg-ed-accent text-ed-sm font-medium text-white disabled:opacity-45"
          >
            <Sparkles className="size-3.5" aria-hidden />
            Generate
          </button>
        </div>

        <div>
          <p className="mb-1.5 text-ed-2xs font-medium uppercase tracking-wider text-ed-faint">Try asking</p>
          <ul className="flex flex-col gap-1">
            {suggestions.map((text) => (
              <li key={text}>
                <button
                  type="button"
                  onClick={() => {
                    setPrompt(text);
                    promptRef.current?.focus();
                  }}
                  className="w-full rounded-ed border border-ed-border px-2.5 py-1.5 text-left text-ed-xs text-ed-text hover:border-ed-border-strong hover:bg-ed-hover"
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {suggestion && (
          <section aria-label="Suggested change" className="flex flex-col gap-2">
            <p className="text-ed-xs text-ed-text">{suggestion.summary}</p>
            <div className="flex gap-2">
              <DiffColumn title="Before" sections={suggestion.before} />
              <DiffColumn title="After" sections={suggestion.after} />
            </div>
            <div className="flex gap-1.5">
              <button type="button" disabled className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-ed bg-ed-accent text-ed-xs font-medium text-white disabled:opacity-45">
                <Check className="size-3.5" aria-hidden />
                Apply
              </button>
              <button type="button" disabled className="flex h-8 items-center gap-1.5 rounded-ed border border-ed-border px-2.5 text-ed-xs text-ed-text disabled:opacity-45">
                <RotateCcw className="size-3.5" aria-hidden />
                Regenerate
              </button>
              <button
                type="button"
                onClick={() => setSuggestion(null)}
                className="h-8 rounded-ed px-2.5 text-ed-xs text-ed-muted hover:bg-ed-hover hover:text-ed-text"
              >
                Reject
              </button>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
