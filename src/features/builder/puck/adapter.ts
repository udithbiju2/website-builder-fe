import type { Data } from "@puckeditor/core";
import type { Section, SectionDataMap, SectionOf, SectionSettings, SectionType } from "../../../site-kit/index.ts";
import { puckContentSchema } from "../schema/editor-document.ts";

/** Puck's id for the page's top-level drop zone. */
export const ROOT_ZONE = "root:default-zone";

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

export function itemAsSection(item: BuilderItem): Section {
  const { id, hidden, settings, data } = item.props;
  return { id, type: item.type, hidden, settings, data } as Section;
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
        type: item.type,
        hidden: item.props.hidden,
        settings: item.props.settings,
        data: item.props.data,
      }) as Section,
  );
}
