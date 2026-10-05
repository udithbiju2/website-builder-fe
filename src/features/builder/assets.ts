import type { ImageRef } from "../../site-kit/index.ts";
import type { EditorDraft } from "../../pages/websites/editor/editor-state.ts";

export type UsedAsset = ImageRef & { usedOn: string[] };

function isImageRef(value: unknown): value is ImageRef {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).url === "string" &&
    typeof (value as Record<string, unknown>).alt === "string"
  );
}

function walk(value: unknown, visit: (image: ImageRef) => void): void {
  if (isImageRef(value)) {
    if (value.url.trim()) visit(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visit));
  } else if (typeof value === "object" && value !== null) {
    Object.values(value).forEach((item) => walk(item, visit));
  }
}

/** Every distinct image URL used in the draft, with the places it appears. */
export function collectAssets(draft: EditorDraft): UsedAsset[] {
  const byUrl = new Map<string, UsedAsset>();
  const add = (where: string) => (image: ImageRef) => {
    const existing = byUrl.get(image.url);
    if (existing) {
      if (!existing.usedOn.includes(where)) existing.usedOn.push(where);
      if (!existing.alt && image.alt) existing.alt = image.alt;
    } else {
      byUrl.set(image.url, { url: image.url, alt: image.alt, usedOn: [where] });
    }
  };
  walk(draft.header, add("Header"));
  walk(draft.footer, add("Footer"));
  for (const page of draft.pages) walk(page.sections, add(page.name));
  return [...byUrl.values()];
}
