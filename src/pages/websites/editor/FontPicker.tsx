import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Check, Search, X } from "lucide-react";
import { FONT_KEYS, FONTS, type FontCategory, type FontKey } from "../../../site-kit/index.ts";

const CATEGORY_LABELS: Record<FontCategory, string> = {
  sans: "Sans serif",
  serif: "Serif",
  display: "Display",
  mono: "Monospace",
};

type Filter = "all" | FontCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sans", label: "Sans" },
  { id: "serif", label: "Serif" },
  { id: "display", label: "Display" },
  { id: "mono", label: "Mono" },
];

const INHERIT_ID = "inherit";
const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog.";

/** Fonts already shown once render immediately on later mounts; the browser has them cached. */
const previewedFonts = new Set<string>();

/** Applies a font only once its row scrolls near view, so opening the picker doesn't download every family. */
function useLazyPreview<T extends Element>(id: string, root: RefObject<HTMLElement | null>) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(() => previewedFonts.has(id) || typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (visible || !node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        previewedFonts.add(id);
        setVisible(true);
        observer.disconnect();
      },
      { root: root.current, rootMargin: "160px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [id, root, visible]);

  return [ref, visible] as const;
}

type FontOptionProps = {
  id: string;
  label: string;
  detail: string;
  stack: string;
  selected: boolean;
  focusable: boolean;
  root: RefObject<HTMLElement | null>;
  onSelect: () => void;
};

function FontOption({ id, label, detail, stack, selected, focusable, root, onSelect }: FontOptionProps) {
  const [ref, visible] = useLazyPreview<HTMLButtonElement>(id, root);
  const fontStyle = visible ? { fontFamily: stack } : undefined;

  return (
    <button
      ref={ref}
      type="button"
      role="option"
      aria-selected={selected}
      tabIndex={focusable ? 0 : -1}
      onClick={onSelect}
      className={`flex w-full items-center gap-2.5 rounded-ed px-2 py-1.5 text-left outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ed-accent/30 ${
        selected ? "bg-ed-accent-soft" : "hover:bg-ed-subtle"
      }`}
    >
      <span
        aria-hidden
        style={fontStyle}
        className={`grid size-8 shrink-0 place-items-center rounded-ed border bg-ed-panel text-base leading-none ${
          selected ? "border-ed-accent/30 text-ed-accent" : "border-ed-border text-ed-text"
        }`}
      >
        Aa
      </span>
      <span className="min-w-0 flex-1">
        <span style={fontStyle} className={`block truncate text-sm leading-5 ${selected ? "font-medium text-ed-accent" : "text-ed-text"}`}>
          {label}
        </span>
        <span className="block truncate text-ed-2xs leading-4 text-ed-muted">{detail}</span>
      </span>
      {selected && <Check className="size-3.5 shrink-0 text-ed-accent" aria-hidden />}
    </button>
  );
}

function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
  const current = options.findIndex((option) => option === document.activeElement);
  const last = options.length - 1;
  const targets: Partial<Record<string, number>> = {
    ArrowDown: Math.min(current + 1, last),
    ArrowUp: Math.max(current - 1, 0),
    Home: 0,
    End: last,
  };
  const next = targets[event.key];
  if (next === undefined || last < 0) return;
  event.preventDefault();
  options[next]?.focus();
}

type FontPickerProps = { label: string } & (
  | { value: FontKey; onChange: (font: FontKey) => void; inheritFrom?: undefined }
  | {
      value: FontKey | undefined;
      onChange: (font: FontKey | undefined) => void;
      /** Theme font a section falls back to; adds a "Site default" option. */
      inheritFrom: FontKey;
    }
);

/** Searchable font list with live previews. With `inheritFrom`, an unset value means "use the theme font". */
export function FontPicker(props: FontPickerProps) {
  const { label, value } = props;
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const fonts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return FONT_KEYS.filter((key) => {
      const font = FONTS[key];
      if (filter !== "all" && font.category !== filter) return false;
      return !needle || font.label.toLowerCase().includes(needle) || CATEGORY_LABELS[font.category].toLowerCase().includes(needle);
    });
  }, [query, filter]);

  const inheritFont = props.inheritFrom ? FONTS[props.inheritFrom] : null;
  const showInherit = inheritFont !== null && filter === "all" && (!query.trim() || "site default".includes(query.trim().toLowerCase()));
  const activeFont = FONTS[value ?? props.inheritFrom ?? FONT_KEYS[0]];
  const optionIds = [...(showInherit ? [INHERIT_ID] : []), ...fonts];
  const selectedId = value ?? INHERIT_ID;
  const focusId = optionIds.includes(selectedId) ? selectedId : optionIds[0];

  function select(font: FontKey | undefined) {
    if (props.inheritFrom !== undefined) props.onChange(font);
    else if (font) props.onChange(font);
  }

  useEffect(() => {
    const list = listRef.current;
    const selected = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (list && selected) list.scrollTop = selected.offsetTop - (list.clientHeight - selected.offsetHeight) / 2;
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="rounded-ed-lg border border-ed-border bg-ed-subtle/60 px-3 py-2.5" style={{ fontFamily: activeFont.stack }}>
        <p className="font-sans text-ed-2xs font-medium uppercase tracking-wider text-ed-faint">
          {value === undefined && inheritFont ? `Site default · ${inheritFont.label}` : activeFont.label}
        </p>
        <p className="mt-1 truncate text-2xl leading-tight text-ed-text">Aa Bb Cc 123</p>
        <p className="mt-0.5 line-clamp-2 text-ed-xs leading-relaxed text-ed-muted">{SAMPLE_TEXT}</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ed-faint" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search fonts"
          aria-label={`Search ${label.toLowerCase()}`}
          className="h-8 w-full rounded-ed border border-ed-border bg-ed-panel pl-8 pr-8 text-ed-sm text-ed-text placeholder:text-ed-faint shadow-ed-xs transition-all duration-150 hover:border-ed-border-strong focus:border-ed-accent focus:outline-none focus:ring-2 focus:ring-ed-accent/15 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-ed-sm text-ed-faint hover:bg-ed-hover hover:text-ed-text"
          >
            <X className="size-3" aria-hidden />
          </button>
        )}
      </div>

      <div role="group" aria-label="Font style" className="flex flex-wrap gap-1">
        {FILTERS.map((candidate) => {
          const active = filter === candidate.id;
          return (
            <button
              key={candidate.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(candidate.id)}
              className={`h-6 rounded-full px-2.5 text-ed-2xs font-medium transition-colors duration-150 ${
                active ? "bg-ed-accent text-white" : "bg-ed-subtle text-ed-muted hover:bg-ed-hover hover:text-ed-text"
              }`}
            >
              {candidate.label}
            </button>
          );
        })}
      </div>

      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        onKeyDown={moveFocus}
        className="relative flex max-h-72 flex-col gap-0.5 overflow-y-auto overscroll-contain rounded-ed-lg border border-ed-border bg-ed-panel p-1"
      >
        {showInherit && inheritFont && (
          <FontOption
            id={INHERIT_ID}
            label="Site default"
            detail={`${inheritFont.label} · from theme`}
            stack={inheritFont.stack}
            selected={value === undefined}
            focusable={focusId === INHERIT_ID}
            root={listRef}
            onSelect={() => select(undefined)}
          />
        )}
        {fonts.map((key) => (
          <FontOption
            key={key}
            id={key}
            label={FONTS[key].label}
            detail={CATEGORY_LABELS[FONTS[key].category]}
            stack={FONTS[key].stack}
            selected={value === key}
            focusable={focusId === key}
            root={listRef}
            onSelect={() => select(key)}
          />
        ))}
        {optionIds.length === 0 && (
          <p className="px-2 py-6 text-center text-ed-xs text-ed-muted">No fonts match “{query.trim()}”.</p>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {fonts.length} {fonts.length === 1 ? "font" : "fonts"} shown
      </p>
    </div>
  );
}
