import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { ImageRef, LinkRef } from "../../../site-kit/index.ts";

/** Mirrors the backend content rules so problems show while typing, not only on save. */
const SAFE_HREF = /^(https?:\/\/\S+|mailto:\S+|tel:[+0-9() -]+|\/(?!\/)\S*|#\S*)$/i;
const SAFE_IMAGE_URL = /^(https?:\/\/\S+|\/(?!\/)\S*)$/i;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const inputClass =
  "h-8 w-full rounded-md border border-line-strong bg-surface px-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 aria-invalid:border-danger";

/** Page URLs offered as suggestions in link fields. */
export const LinkTargetsContext = createContext<{ label: string; href: string }[]>([]);

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        hint && <p className="text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  /** Shows "Required" when empty. */
  required?: boolean;
  error?: string;
  type?: "text" | "email" | "tel" | "url";
  list?: string;
};

export function TextField({ label, value = "", onChange, required, error, hint, ...inputProps }: TextFieldProps) {
  const id = useId();
  const message = error ?? (required && !value.trim() ? "Required" : undefined);
  return (
    <FieldShell id={id} label={label} hint={hint} error={message}>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={message ? true : undefined}
        className={inputClass}
        {...inputProps}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
  maxLength?: number;
  required?: boolean;
};

export function TextAreaField({ label, value = "", onChange, rows = 3, hint, maxLength, required }: TextAreaFieldProps) {
  const id = useId();
  const message = required && !value.trim() ? "Required" : undefined;
  return (
    <FieldShell id={id} label={label} hint={hint} error={message}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={message ? true : undefined}
        className={`${inputClass} h-auto py-1.5 leading-relaxed`}
      />
    </FieldShell>
  );
}

type SelectFieldProps<T extends string | number> = {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  hint?: string;
};

export function SelectField<T extends string | number>({ label, value, options, onChange, hint }: SelectFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <select
        id={id}
        value={String(value)}
        onChange={(event) => {
          const option = options.find((candidate) => String(candidate.value) === event.target.value);
          if (option) onChange(option.value);
        }}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type CheckboxFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
};

export function CheckboxField({ label, checked, onChange, hint }: CheckboxFieldProps) {
  return (
    <label className="flex items-start gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 accent-brand"
      />
      <span>
        {label}
        {hint && <span className="block text-xs text-ink-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const [text, setText] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setText(value);
  }
  return (
    <FieldShell id={id} label={label} error={HEX_COLOR.test(text) ? undefined : "Use #rrggbb"}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-10 shrink-0 cursor-pointer rounded border border-line-strong bg-surface p-0.5"
        />
        <input
          id={id}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (HEX_COLOR.test(event.target.value)) onChange(event.target.value.toLowerCase());
          }}
          className={`${inputClass} font-mono`}
          maxLength={7}
        />
      </div>
    </FieldShell>
  );
}

type LinkFieldProps = {
  label: string;
  value: LinkRef;
  onChange: (value: LinkRef) => void;
};

export function LinkField({ label, value, onChange }: LinkFieldProps) {
  const targets = useContext(LinkTargetsContext);
  const listId = useId();
  const hrefError = value.href && !SAFE_HREF.test(value.href.trim()) ? "Use a page like /contact, https://…, mailto: or tel:" : undefined;
  return (
    <fieldset className="flex flex-col gap-2 rounded-md border border-line p-2.5">
      <legend className="px-1 text-xs font-medium text-ink">{label}</legend>
      <TextField label="Text" value={value.label} onChange={(text) => onChange({ ...value, label: text })} maxLength={80} required />
      <TextField
        label="Goes to"
        value={value.href}
        onChange={(href) => onChange({ ...value, href })}
        placeholder="/contact or https://…"
        list={listId}
        maxLength={2048}
        required
        error={hrefError}
      />
      <datalist id={listId}>
        {targets.map((target) => (
          <option key={target.href} value={target.href}>
            {target.label}
          </option>
        ))}
      </datalist>
    </fieldset>
  );
}

type OptionalLinkFieldProps = {
  label: string;
  value: LinkRef | undefined;
  onChange: (value: LinkRef | undefined) => void;
  fallback: LinkRef;
};

export function OptionalLinkField({ label, value, onChange, fallback }: OptionalLinkFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <CheckboxField label={`Show ${label.toLowerCase()}`} checked={Boolean(value)} onChange={(on) => onChange(on ? fallback : undefined)} />
      {value && <LinkField label={label} value={value} onChange={onChange} />}
    </div>
  );
}

type ImageFieldProps = {
  label: string;
  value: ImageRef | undefined;
  onChange: (value: ImageRef | undefined) => void;
  /** Optional images can be removed entirely. */
  optional?: boolean;
};

export function ImageField({ label, value, onChange, optional = false }: ImageFieldProps) {
  const image = value ?? { url: "", alt: "" };
  const urlError = image.url && !SAFE_IMAGE_URL.test(image.url.trim()) ? "Use an https:// image link" : undefined;
  const update = (patch: Partial<ImageRef>) => {
    const next = { ...image, ...patch };
    onChange(optional && !next.url && !next.alt ? undefined : next);
  };
  return (
    <fieldset className="flex flex-col gap-2 rounded-md border border-line p-2.5">
      <legend className="px-1 text-xs font-medium text-ink">{label}</legend>
      {image.url && !urlError && (
        <img src={image.url} alt="" className="h-20 w-full rounded border border-line bg-canvas object-cover" />
      )}
      <TextField
        label="Image link"
        type="url"
        value={image.url}
        onChange={(url) => update({ url })}
        placeholder="https://…"
        hint="Paste a link to an image. Uploading comes with the media library."
        error={urlError}
        required={!optional}
        maxLength={2048}
      />
      <TextField
        label="Description (alt text)"
        value={image.alt}
        onChange={(alt) => update({ alt })}
        hint="Describes the image for screen readers and search engines."
        maxLength={300}
      />
      {optional && value && (
        <button type="button" onClick={() => onChange(undefined)} className="self-start text-xs text-danger hover:underline">
          Remove image
        </button>
      )}
    </fieldset>
  );
}

type ItemListProps<T> = {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  itemTitle: (item: T, index: number) => string;
  renderItem: (item: T, update: (item: T) => void) => ReactNode;
  max: number;
  addLabel?: string;
};

/** Repeatable group (features, FAQ items, menu links…) with add, reorder and remove. */
export function ItemList<T>({ label, items, onChange, create, itemTitle, renderItem, max, addLabel = "Add item" }: ItemListProps<T>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item!);
    onChange(next);
    setOpenIndex(openIndex === index ? target : openIndex);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink">
          {label} <span className="text-ink-muted">({items.length})</span>
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, index) => {
          const open = openIndex === index;
          return (
            <li key={index} className="rounded-md border border-line bg-surface">
              <div className="flex items-center gap-1 pl-2.5 pr-1">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="min-w-0 flex-1 truncate py-1.5 text-left text-sm text-ink"
                >
                  {itemTitle(item, index) || `Item ${index + 1}`}
                </button>
                <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                  <ChevronUp className="size-3.5" />
                </IconButton>
                <IconButton label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
                  <ChevronDown className="size-3.5" />
                </IconButton>
                <IconButton
                  label="Remove"
                  onClick={() => {
                    onChange(items.filter((_, i) => i !== index));
                    setOpenIndex(null);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
              {open && (
                <div className="flex flex-col gap-2.5 border-t border-line p-2.5">
                  {renderItem(item, (updated) => onChange(items.map((current, i) => (i === index ? updated : current))))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        disabled={items.length >= max}
        onClick={() => {
          onChange([...items, create()]);
          setOpenIndex(items.length);
        }}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-dashed border-line-strong py-1.5 text-sm text-brand hover:bg-brand-soft/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="size-3.5" aria-hidden /> {items.length >= max ? `Maximum ${max}` : addLabel}
      </button>
    </div>
  );
}

type IconButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
  children: ReactNode;
};

export function IconButton({ label, onClick, disabled, tone = "default", children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`grid size-7 place-items-center rounded transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        tone === "danger" ? "text-danger hover:bg-danger/10" : "text-ink-body hover:bg-canvas hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function FormGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-line px-4 py-4 last:border-b-0">
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">{title}</h3>
      {children}
    </section>
  );
}
