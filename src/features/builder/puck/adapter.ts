import type { Data } from "@puckeditor/core";
import {
  DEFAULT_SECTION_SETTINGS,
  SECTION_DEFINITIONS,
  SECTION_PRESETS,
  type Section, type SectionDataMap, type SectionOf, type SectionSettings, type SectionType } from "../../../site-kit/index.ts";
import { puckContentSchema } from "../schema/editor-document.ts";

/** Puck's id for the page's top-level drop zone. */
export const ROOT_ZONE = "root:default-zone";

const PRESET_KEY_TO_TYPE: Record<string, SectionType> = Object.fromEntries(
  SECTION_PRESETS.map((p) => [p.key, p.type]),
);

export function getSectionType(rawType: string): SectionType {
  return PRESET_KEY_TO_TYPE[rawType] ?? (rawType as SectionType);
}

export type SectionProps<T extends SectionType = SectionType> = {
  data: SectionDataMap[T];
  settings: SectionSettings;
  hidden: boolean;
};

export type BuilderComponents = { [T in SectionType]: SectionProps<T> };

/** Puck's default root shape; the page title itself lives in page metadata, not here. */
export type BuilderRootProps = { title?: string };

export type BuilderData = Data<BuilderComponents, BuilderRootProps>;

export type BuilderItem = BuilderData["content"][number];

export class EditorDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EditorDataError";
  }
}

export function sectionToItem(section: Section): BuilderItem {
  return {
    type: section.type,
    props: { id: section.id, data: section.data, settings: section.settings, hidden: section.hidden },
  } as BuilderItem;
}

export function itemToSection<T extends SectionType>(type: T, props: SectionProps<T> & { id: string }): SectionOf<T> {
  return { id: props.id, type, hidden: props.hidden, settings: props.settings, data: props.data } as SectionOf<T>;
}

const AI_PLACEHOLDER_FLAG = "_aiPlaceholder";

/** An empty block marking where the AI is about to add a section. It must never be saved. */
export function aiPlaceholderItem(id: string, type: SectionType): BuilderItem {
  const data = { ...SECTION_DEFINITIONS[type].createData(), [AI_PLACEHOLDER_FLAG]: true };
  return sectionToItem({ id, type, hidden: false, settings: DEFAULT_SECTION_SETTINGS, data } as Section);
}

export function isAiPlaceholderData(data: unknown): boolean {
  return typeof data === "object" && data !== null && (data as Record<string, unknown>)[AI_PLACEHOLDER_FLAG] === true;
}

export function hasAiPlaceholder(data: Data): boolean {
  return data.content.some((item) => isAiPlaceholderData(item.props.data));
}

export function itemAsSection(item: BuilderItem): Section {
  const { id, hidden, settings, data } = item.props;
  return { id, type: getSectionType(item.type), hidden, settings, data } as Section;
}

export function sectionsToPuckData(sections: Section[]): BuilderData {
  return { root: { props: {} }, content: sections.map(sectionToItem) };
}

/**
 * Converts Puck's editor data back to the stored section list. The envelope
 * is checked here; per-type section data is validated by the server on save.
 */
export function puckDataToSections(data: Pick<Data, "content">): Section[] {
  const parsed = puckContentSchema.safeParse(data.content);
  if (!parsed.success) {
    throw new EditorDataError(`Editor content is invalid: ${parsed.error.issues[0]?.message ?? "unknown error"}`);
  }
  return parsed.data.map(
    (item) =>
      ({
        id: item.props.id,
        type: getSectionType(item.type),
        hidden: item.props.hidden,
        settings: item.props.settings,
        data: item.props.data,
      }) as Section,
  );
}
