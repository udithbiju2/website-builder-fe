import { Description, FieldError, Label, TextArea, TextField } from "@heroui/react";

type TextAreaInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  error?: string;
  rows?: number;
  isRequired?: boolean;
  isDisabled?: boolean;
};

export default function TextAreaInput({
  label,
  error,
  description,
  placeholder,
  rows = 3,
  ...fieldProps
}: TextAreaInputProps) {
  return (
    <TextField {...fieldProps} isInvalid={Boolean(error)} validationBehavior="aria" fullWidth>
      <Label className="mb-1 block text-sm font-medium text-ink">{label}</Label>
      <TextArea
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-ed-border bg-surface p-3 text-sm text-ink placeholder:text-ink-muted/50 shadow-ed-xs transition-all duration-150 hover:border-ed-border-strong focus:border-ed-accent focus:outline-none focus:ring-2 focus:ring-ed-accent/15 aria-invalid:border-ed-danger aria-invalid:focus:ring-ed-danger/15 disabled:bg-canvas disabled:text-ink-muted disabled:cursor-not-allowed resize-y"
      />
      {description && !error && <Description className="mt-1 block text-xs text-ink-muted">{description}</Description>}
      <FieldError className="mt-1 block text-xs text-ed-danger">{error}</FieldError>
    </TextField>
  );
}
