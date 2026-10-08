import { Chip } from "@heroui/react";
import type { BuilderType, WebsiteSummary } from "../../api/websites.ts";

export const BUILDER_LABELS: Record<BuilderType, string> = {
  MANUAL: "Manual builder",
  AI: "AI builder",
};

/** Matches the UI designs: Draft, Published, Unpublished changes, Unpublished. */
export function WebsiteStatusChip({
  website,
}: {
  website: Pick<WebsiteSummary, "status" | "hasUnpublishedChanges"> & Partial<Pick<WebsiteSummary, "generationStatus">>;
}) {
  if (website.generationStatus === "PENDING" || website.generationStatus === "RUNNING") {
    return (
      <Chip size="sm" color="accent" variant="soft">
        Building with AI…
      </Chip>
    );
  }
  if (website.generationStatus === "FAILED") {
    return (
      <Chip size="sm" color="danger" variant="soft">
        AI build failed
      </Chip>
    );
  }
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
