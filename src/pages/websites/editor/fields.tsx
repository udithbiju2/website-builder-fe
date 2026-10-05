import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { ImageRef, LinkRef } from "../../../site-kit/index.ts";

const SAFE_HREF =
  /^(https?:\/\/\S+|mailto:\S+|tel:[+0-9() -]+|\/(?!\/)\S*|#\S*)$/i;
const SAFE_IMAGE_URL = /^(https?:\/\/\S+|\/(?!\/)\S*)$/i;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const inputClass =
  "h-8 w-full rounded-ed border border-ed-border bg-ed-panel px-2.5 text-ed-sm text-ed-text placeholder:text-ed-faint shadow-ed-xs transition-all duration-150 hover:border-ed-border-strong focus:border-ed-accent focus:bg-ed-panel focus:outline-none focus:ring-2 focus:ring-ed-accent/15 aria-invalid:border-ed-danger aria-invalid:focus:ring-ed-danger/15 disabled:bg-ed-subtle disabled:text-ed-muted disabled:cursor-not-allowed";

export const LinkTargetsContext = createContext<
  { label: string; href: string }[]
>([]);

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
      <label htmlFor={id} className="text-ed-xs font-medium text-ed-text">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-ed-2xs font-medium text-ed-danger">{error}</p>
      ) : (
        hint && (
          <p className="text-ed-2xs text-ed-muted leading-normal">{hint}</p>
        )
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

export function TextField({
  label,
  value = "",
  onChange,
  required,
  error,
  hint,
  ...inputProps
}: TextFieldProps) {
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

export function TextAreaField({
  label,
  value = "",
  onChange,
  rows = 3,
  hint,
  maxLength,
  required,
}: TextAreaFieldProps) {
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
        className={`${inputClass} min-h-19 h-auto py-2 leading-relaxed resize-y`}
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

export function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
  hint,
}: SelectFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <select
        id={id}
        value={String(value)}
        onChange={(event) => {
          const option = options.find(
            (candidate) => String(candidate.value) === event.target.value,
          );
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

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: CheckboxFieldProps) {
  return (
    <label className="group flex cursor-pointer items-start gap-2 select-none">
      <div className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <div className="flex size-4 items-center justify-center rounded-[4px] border border-ed-border-strong bg-ed-panel text-white shadow-ed-xs transition-all duration-150 group-hover:border-ed-muted peer-checked:border-ed-accent peer-checked:bg-ed-accent peer-focus-visible:ring-2 peer-focus-visible:ring-ed-accent/20 peer-focus-visible:outline-none">
          <svg
            className={`size-3 stroke-current transition-all duration-150 ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-ed-sm font-medium text-ed-text">{label}</span>
        {hint && <p className="text-ed-2xs text-ed-muted leading-normal">{hint}</p>}
      </div>
    </label>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const [text, setText] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setText(value);
  }
  return (
    <FieldShell
      id={id}
      label={label}
      error={HEX_COLOR.test(text) ? undefined : "Use #rrggbb"}
    >
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-10 shrink-0 cursor-pointer rounded-ed border border-ed-border bg-ed-panel p-0.5 shadow-ed-xs hover:border-ed-border-strong transition-colors"
        />
        <input
          id={id}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (HEX_COLOR.test(event.target.value))
              onChange(event.target.value.toLowerCase());
          }}
          className={`${inputClass} font-mono text-ed-xs uppercase`}
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
  const hrefError =
    value.href && !SAFE_HREF.test(value.href.trim())
      ? "Use a page like /contact, https://…, mailto: or tel:"
      : undefined;
  return (
    <fieldset className="flex flex-col gap-2 rounded-ed border border-ed-border bg-ed-subtle/30 p-2.5 shadow-ed-xs">
      <legend className="px-1 text-ed-xs font-semibold text-ed-text">
        {label}
      </legend>
      <TextField
        label="Text"
        value={value.label}
        onChange={(text) => onChange({ ...value, label: text })}
        maxLength={80}
        required
      />
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

export function OptionalLinkField({
  label,
  value,
  onChange,
  fallback,
}: OptionalLinkFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <CheckboxField
        label={`Show ${label.toLowerCase()}`}
        checked={Boolean(value)}
        onChange={(on) => onChange(on ? fallback : undefined)}
      />
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

export function ImageField({
  label,
  value,
  onChange,
  optional = false,
}: ImageFieldProps) {
  const image = value ?? { url: "", alt: "" };
  const urlError =
    image.url && !SAFE_IMAGE_URL.test(image.url.trim())
      ? "Use an https:// image link"
      : undefined;
  const update = (patch: Partial<ImageRef>) => {
    const next = { ...image, ...patch };
    onChange(optional && !next.url && !next.alt ? undefined : next);
  };
  return (
    <fieldset className="flex flex-col gap-2 rounded-ed border border-ed-border bg-ed-subtle/30 p-2.5 shadow-ed-xs">
      <legend className="px-1 text-ed-xs font-semibold text-ed-text">
        {label}
      </legend>
      {image.url && !urlError && (
        <img
          src={image.url}
          alt=""
          className="h-20 w-full rounded-ed border border-ed-border bg-ed-subtle object-cover shadow-ed-xs"
        />
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
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="self-start text-ed-xs font-medium text-ed-danger hover:underline"
        >
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

export function ItemList<T>({
  label,
  items,
  onChange,
  create,
  itemTitle,
  renderItem,
  max,
  addLabel = "Add item",
}: ItemListProps<T>) {
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
        <span className="text-ed-xs font-semibold text-ed-text">
          {label}{" "}
          <span className="font-normal text-ed-muted">({items.length})</span>
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, index) => {
          const open = openIndex === index;
          return (
            <li
              key={index}
              className="rounded-ed border border-ed-border bg-ed-panel shadow-ed-xs overflow-hidden transition-colors hover:border-ed-border-strong"
            >
              <div className="flex items-center gap-1 pl-2.5 pr-1">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="min-w-0 flex-1 truncate py-1.5 text-left text-ed-sm font-medium text-ed-text"
                >
                  {itemTitle(item, index) || `Item ${index + 1}`}
                </button>
                <IconButton
                  label="Move up"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                >
                  <ChevronUp className="size-3.5" />
                </IconButton>
                <IconButton
                  label="Move down"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                >
                  <ChevronDown className="size-3.5" />
                </IconButton>
                <IconButton
                  label="Remove"
                  tone="danger"
                  onClick={() => {
                    onChange(items.filter((_, i) => i !== index));
                    setOpenIndex(null);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
              {open && (
                <div className="flex flex-col gap-2.5 border-t border-ed-border bg-ed-subtle/20 p-2.5">
                  {renderItem(item, (updated) =>
                    onChange(
                      items.map((current, i) =>
                        i === index ? updated : current,
                      ),
                    ),
                  )}
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
        className="inline-flex items-center justify-center gap-1.5 rounded-ed border border-dashed border-ed-border-strong py-1.5 text-ed-sm font-medium text-ed-accent hover:bg-ed-accent-soft/60 hover:border-ed-accent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="size-3.5" aria-hidden />{" "}
        {items.length >= max ? `Maximum ${max}` : addLabel}
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

export function IconButton({
  label,
  onClick,
  disabled,
  tone = "default",
  children,
}: IconButtonProps) {
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
      className={`grid size-6 place-items-center rounded-ed transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        tone === "danger"
          ? "text-ed-danger hover:bg-ed-danger-soft"
          : "text-ed-faint hover:bg-ed-hover hover:text-ed-text"
      }`}
    >
      {children}
    </button>
  );
}

export function FormGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 border-b border-ed-border px-3.5 py-3.5 last:border-b-0">
      <h3 className="text-ed-2xs font-semibold uppercase tracking-wider text-ed-faint">
        {title}
      </h3>
      {children}
    </section>
  );
}
