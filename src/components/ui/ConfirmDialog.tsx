import type { ReactNode } from "react";
import { Button, Modal } from "@heroui/react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  children,
  confirmLabel,
  tone = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Modal.Container size="sm">
        <Modal.Dialog aria-label={title}>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <div className="text-sm text-ink-body">{children}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onPress={onCancel}>
              Cancel
            </Button>
            <Button variant={tone === "danger" ? "danger" : "primary"} onPress={onConfirm}>
              {confirmLabel}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
