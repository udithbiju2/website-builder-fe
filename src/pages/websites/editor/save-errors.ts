import type { FieldIssue } from "../../../api/http.ts";
import { SECTION_DEFINITIONS } from "../../../site-kit/index.ts";
import type { EditorDraft, Selection } from "./editor-state.ts";

export type SaveIssue = {
  message: string;
  pageId?: string;
  selection?: Selection;
};

function humanize(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

/** Turns a Joi issue like `pages.0.sections.2.data.heading` into a readable message and editor location. */
export function describeIssue(draft: EditorDraft, issue: FieldIssue): SaveIssue {
  const path = issue.path ?? [];
  const field = [...path].reverse().find((part): part is string => typeof part === "string") ?? "value";
  const reason = issue.message.replace(/^"[^"]*"\s*/, "");
  const fieldText = `${humanize(field)} ${reason}`;

  const [root, pageIndex, child, sectionIndex] = path;
  if (root === "header" || root === "footer" || root === "theme") {
    return { message: `${root[0]!.toUpperCase()}${root.slice(1)}: ${fieldText}`, selection: { kind: root } };
  }
  if (root === "pages" && typeof pageIndex === "number") {
    const page = draft.pages[pageIndex];
    if (!page) return { message: fieldText };
    if (child === "sections" && typeof sectionIndex === "number") {
      const section = page.sections[sectionIndex];
      if (section) {
        return {
          message: `${page.name} › ${SECTION_DEFINITIONS[section.type].label}: ${fieldText}`,
          pageId: page.id,
          selection: { kind: "section", sectionId: section.id },
        };
      }
    }
    return { message: `${page.name}: ${fieldText}`, pageId: page.id, selection: { kind: "page" } };
  }
  return { message: fieldText };
}
