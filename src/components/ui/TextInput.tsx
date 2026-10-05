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
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
      {description && !error && <Description>{description}</Description>}
      <FieldError>{error}</FieldError>
    </TextField>
  );
}
