import { FieldError, Label, TextArea, TextField } from "@heroui/react";

type TextAreaInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
};

export default function TextAreaInput({ label, error, placeholder, rows = 3, ...fieldProps }: TextAreaInputProps) {
  return (
    <TextField {...fieldProps} isInvalid={Boolean(error)} validationBehavior="aria" fullWidth>
      <Label>{label}</Label>
      <TextArea placeholder={placeholder} rows={rows} />
      <FieldError>{error}</FieldError>
    </TextField>
  );
}
