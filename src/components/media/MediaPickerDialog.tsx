import { Button, Modal } from "@heroui/react";
import type { MediaFile, MediaKind } from "../../api/media.ts";
import MediaLibrary from "./MediaLibrary.tsx";

type MediaPickerDialogProps = {
  clientId: string;
  websiteId?: string;
  kind: MediaKind;
  onPick: (file: MediaFile) => void;
  onClose: () => void;
};

/** Choose an existing file or upload a new one. Mount only while open. */
export default function MediaPickerDialog({ clientId, websiteId, kind, onPick, onClose }: MediaPickerDialogProps) {
  return (
    <Modal.Backdrop isOpen onOpenChange={(open) => !open && onClose()}>
      <Modal.Container size="cover" scroll="inside">
        <Modal.Dialog aria-label="Media library">
          <Modal.Header>
            <Modal.Heading>Choose {kind === "IMAGE" ? "an image" : "a file"}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <MediaLibrary clientId={clientId} websiteId={websiteId} onlyKind={kind} onPick={onPick} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onPress={onClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
