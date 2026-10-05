import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { Search, X } from "lucide-react";

type ToolButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  shortcut?: string;
  size?: "sm" | "md";
  tone?: "default" | "danger";
};

/** Icon-only button with an accessible name and a native tooltip. */
export function ToolButton({ label, onClick, children, active, disabled, shortcut, size = "md", tone = "default" }: ToolButtonProps) {
  const dimension = size === "sm" ? "size-7" : "size-8";
  const colors =
    tone === "danger"
      ? "text-ed-muted hover:bg-ed-danger-soft hover:text-ed-danger"
      : active
        ? "bg-ed-accent-soft text-ed-accent"
        : "text-ed-muted hover:bg-ed-hover hover:text-ed-text";
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={shortcut ? `${label} (${shortcut})` : label}
      disabled={disabled}
      onClick={onClick}
      className={`grid ${dimension} shrink-0 place-items-center rounded-ed transition-colors disabled:pointer-events-none disabled:opacity-35 ${colors}`}
    >
      {children}
    </button>
  );
}

export function PanelHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start gap-2 border-b border-ed-border px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <h2 className="text-ed-sm font-semibold text-ed-text">{title}</h2>
        {description && <p className="mt-0.5 text-ed-xs text-ed-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h3 className="px-3 pb-1 pt-3 text-ed-2xs font-medium uppercase tracking-wider text-ed-faint">{children}</h3>;
}

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  const id = useId();
  return (
    <div className="relative px-3 py-2">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search className="pointer-events-none absolute left-5 top-1/2 size-3.5 -translate-y-1/2 text-ed-faint" aria-hidden />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-ed border border-ed-border bg-ed-subtle pl-7 pr-7 text-ed-sm text-ed-text placeholder:text-ed-faint shadow-ed-xs transition-all duration-150 focus:border-ed-accent focus:bg-ed-panel focus:outline-none focus:ring-2 focus:ring-ed-accent/15"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-ed-sm text-ed-faint hover:text-ed-text"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, children, action }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      {icon && <span className="grid size-9 place-items-center rounded-ed-lg bg-ed-subtle text-ed-muted">{icon}</span>}
      <p className="text-ed-sm font-medium text-ed-text">{title}</p>
      {children && <p className="text-ed-xs leading-relaxed text-ed-muted">{children}</p>}
      {action}
    </div>
  );
}

type Tab<T extends string> = { id: T; label: string };

/** WAI-ARIA tabs with roving focus (arrow keys, Home, End). */
export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: Tab<T>[]; value: T; onChange: (id: T) => void; label: string }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.id === value);
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    const tab = tabs[next]!;
    onChange(tab.id);
    refs.current[tab.id]?.focus();
  }

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex gap-0.5 border-b border-ed-border px-2">
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(element) => {
              refs.current[tab.id] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-${tab.id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`relative -mb-px h-9 px-2 text-ed-xs font-medium transition-colors ${
              selected ? "text-ed-text after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-ed-accent" : "text-ed-muted hover:text-ed-text"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-ed-sm border border-ed-border bg-ed-subtle px-1 font-mono text-[10px] leading-4 text-ed-muted">{children}</kbd>
  );
}
