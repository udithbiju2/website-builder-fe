import { Chip } from "@heroui/react";
import type { BuilderType, WebsiteSummary } from "../../api/websites.ts";

export const BUILDER_LABELS: Record<BuilderType, string> = {
  MANUAL: "Manual builder",
  AI: "AI builder",
};

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Matches the UI designs: Draft, Published, Unpublished changes, Unpublished. */
export function WebsiteStatusChip({ website }: { website: Pick<WebsiteSummary, "status" | "hasUnpublishedChanges"> }) {
  if (website.status === "PUBLISHED" && website.hasUnpublishedChanges) {
    return (
      <Chip size="sm" color="warning">
        Unpublished changes
      </Chip>
    );
  }
  if (website.status === "PUBLISHED") {
    return (
      <Chip size="sm" color="success">
        Published
      </Chip>
    );
  }
  if (website.status === "UNPUBLISHED") return <Chip size="sm">Unpublished</Chip>;
  return (
    <Chip size="sm" variant="soft">
      Draft
    </Chip>
  );
}
