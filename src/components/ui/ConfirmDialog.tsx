import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { ConfirmModal } from "./AppModal.tsx";

export type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "default" | "brand" | "warning";
  icon?: ReactNode;
  isPending?: boolean;
  onConfirm: () => void | Promise<unknown> | unknown;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  subtitle,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "default",
  icon,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const defaultIcon =
    icon ?? (tone === "danger" ? <AlertTriangle className="size-5" /> : <Info className="size-5" />);

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={title}
      subtitle={subtitle}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      tone={tone}
      icon={defaultIcon}
      isPending={isPending}
    >
      {children}
    </ConfirmModal>
  );
}
