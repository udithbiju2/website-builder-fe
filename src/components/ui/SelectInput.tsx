import { useId } from "react";

export type SelectOption<T extends string> = { value: T; label: string };

type SelectInputProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  /** Visible label; when omitted, `ariaLabel` must describe the control. */
  label?: string;
  ariaLabel?: string;
  className?: string;
};

/** Native select styled like HeroUI fields; native keeps filters simple and accessible. */
export default function SelectInput<T extends string>({
  value,
  onChange,
  options,
  label,
  ariaLabel,
  className = "",
}: SelectInputProps<T>) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-label={label ? undefined : ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-9 rounded-lg border border-ed-border bg-surface px-3 text-sm text-ink shadow-ed-xs outline-none transition-all duration-150 hover:border-ed-border-strong focus:border-ed-accent focus:ring-2 focus:ring-ed-accent/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
