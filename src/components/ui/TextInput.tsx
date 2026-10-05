import { Description, FieldError, Input, Label, TextField } from "@heroui/react";

type TextInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "tel";
  placeholder?: string;
  autoComplete?: string;
  description?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  autoFocus?: boolean;
};

export default function TextInput({
  label,
  error,
  description,
  placeholder,
  ...fieldProps
}: TextInputProps) {
  return (
    <TextField {...fieldProps} isInvalid={Boolean(error)} validationBehavior="aria" fullWidth>
      <Label className="mb-1 block text-sm font-medium text-ink">{label}</Label>
      <Input
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-ed-border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/50 shadow-ed-xs transition-all duration-150 hover:border-ed-border-strong focus:border-ed-accent focus:outline-none focus:ring-2 focus:ring-ed-accent/15 aria-invalid:border-ed-danger aria-invalid:focus:ring-ed-danger/15 disabled:bg-canvas disabled:text-ink-muted disabled:cursor-not-allowed"
      />
      {description && !error && <Description className="mt-1 block text-xs text-ink-muted">{description}</Description>}
      <FieldError className="mt-1 block text-xs text-ed-danger">{error}</FieldError>
    </TextField>
  );
}
