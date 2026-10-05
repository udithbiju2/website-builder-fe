import { useState, type FormEvent, type ReactNode } from "react";
import { Button, Modal } from "@heroui/react";
import FormAlert from "../../../components/ui/FormAlert.tsx";
import TextAreaInput from "../../../components/ui/TextAreaInput.tsx";
import TextInput from "../../../components/ui/TextInput.tsx";

type SaveNameDialogProps = {
  isOpen: boolean;
  title: string;
  intro: ReactNode;
  defaultName: string;
  withDescription?: boolean;
  submitLabel: string;
  onSubmit: (values: { name: string; description: string }) => Promise<void>;
  onClose: () => void;
};

/** Asks for a name (and optional description) before saving a template or section. Mount only while open. */
export default function SaveNameDialog({
  isOpen,
  title,
  intro,
  defaultName,
  withDescription = false,
  submitLabel,
  onSubmit,
  onClose,
}: SaveNameDialogProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nameError = name.trim().length < 2 ? "Use at least 2 characters" : undefined;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (nameError || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && !submitting && onClose()}>
      <Modal.Container size="sm">
        <Modal.Dialog aria-label={title}>
          <form onSubmit={submit} noValidate>
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-ink-body">{intro}</p>
                {error && <FormAlert status="danger">{error}</FormAlert>}
                <TextInput label="Name" name="templateName" value={name} onChange={setName} error={name ? nameError : undefined} autoFocus />
                {withDescription && (
                  <TextAreaInput label="Description (optional)" name="templateDescription" value={description} onChange={setDescription} rows={2} />
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onPress={onClose} isDisabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" isPending={submitting} isDisabled={Boolean(nameError)}>
                {submitLabel}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
