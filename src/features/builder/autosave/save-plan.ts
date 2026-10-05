import type { Section } from "../../../site-kit/index.ts";
import type { EditorDraft } from "../../../pages/websites/editor/editor-state.ts";

export type SavePlan =
  | { kind: "none" }
  /** Only one page's sections changed: the light autosave endpoint is enough. */
  | { kind: "page"; pageId: string; pageIndex: number; sections: Section[] }
  /** Theme, header, footer or page structure changed: save the whole draft. */
  | { kind: "draft" };

const same = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b);

export function planSave(saved: EditorDraft, next: EditorDraft): SavePlan {
  if (saved === next) return { kind: "none" };
  if (!same(saved.theme, next.theme) || !same(saved.header, next.header) || !same(saved.footer, next.footer)) {
    return { kind: "draft" };
  }
  if (saved.pages.length !== next.pages.length) return { kind: "draft" };

  let changed: SavePlan = { kind: "none" };
  for (let index = 0; index < next.pages.length; index++) {
    const before = saved.pages[index]!;
    const after = next.pages[index]!;
    if (before === after) continue;
    const { sections: beforeSections, ...beforeMeta } = before;
    const { sections: afterSections, ...afterMeta } = after;
    if (!same(beforeMeta, afterMeta)) return { kind: "draft" };
    if (same(beforeSections, afterSections)) continue;
    if (changed.kind !== "none") return { kind: "draft" };
    changed = { kind: "page", pageId: after.id, pageIndex: index, sections: afterSections };
  }
  return changed;
}
