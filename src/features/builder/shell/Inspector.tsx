import { useState } from "react";
import { BookmarkPlus, Copy, MousePointerClick, Trash2, X } from "lucide-react";
import { websitesApi } from "../../../api/websites.ts";
import ConfirmDialog from "../../../components/ui/ConfirmDialog.tsx";
import { deletePage, homePage, updatePageMeta } from "../../../pages/websites/editor/editor-state.ts";
import SaveNameDialog from "../../../pages/websites/editor/SaveNameDialog.tsx";
import {
  SectionAdvancedForm,
  SectionContentForm,
  SectionResponsiveForm,
  SectionStyleForm,
} from "../../../pages/websites/editor/SectionForm.tsx";
import { FooterForm, HeaderForm, PageForm, ThemeForm } from "../../../pages/websites/editor/SiteSettingsForms.tsx";
import {
  DEFAULT_FONT,
  isFontKey,
  SECTION_DEFINITIONS,
  type Section,
  type SectionSettings,
} from "../../../site-kit/index.ts";
import { useEditor, type SiteArea } from "../editor-context.ts";
import { getSectionType, itemAsSection, type BuilderItem } from "../puck/adapter.ts";
import { duplicateSection, removeSection, replaceSection, selectSection, useBuilderPuck } from "../puck/puck-api.ts";
import { Tabs, ToolButton } from "./ui.tsx";

type SectionTab = "content" | "style" | "responsive" | "advanced";

const SECTION_TABS: { id: SectionTab; label: string }[] = [
  { id: "content", label: "Content" },
  { id: "style", label: "Style" },
  { id: "responsive", label: "Responsive" },
  { id: "advanced", label: "Advanced" },
];

const AREA_TABS: { id: SiteArea; label: string }[] = [
  { id: "header", label: "Header" },
  { id: "page", label: "Page" },
  { id: "theme", label: "Theme" },
  { id: "footer", label: "Footer" },
];

function SectionInspector({ item, index }: { item: BuilderItem; index: number }) {
  const { website, draft, setSavedSections, notify } = useEditor();
  const siteFont = isFontKey(draft.theme.fonts.heading) ? draft.theme.fonts.heading : DEFAULT_FONT;
  const dispatch = useBuilderPuck((state) => state.dispatch);
  const [tab, setTab] = useState<SectionTab>("content");
  const [saving, setSaving] = useState(false);
  const section = itemAsSection(item);
  const definition = SECTION_DEFINITIONS[section.type];

  const change = (next: Section) => replaceSection(dispatch, index, next);
  const changeSettings = (settings: SectionSettings) => change({ ...section, settings });

  async function saveToLibrary({ name }: { name: string }) {
    const saved = await websitesApi.saveSection(website.id, { name, section });
    setSavedSections((current) => [saved, ...current]);
    setSaving(false);
    notify(`“${saved.name}” saved to your library`);
  }

  return (
    <>
      <header className="flex items-center gap-1 border-b border-ed-border py-2 pl-3 pr-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-ed-2xs font-medium uppercase tracking-wider text-ed-faint">Section</p>
          <h2 className="truncate text-ed-sm font-semibold text-ed-text">{definition.label}</h2>
        </div>
        <ToolButton label="Save to library" size="sm" onClick={() => setSaving(true)}>
          <BookmarkPlus className="size-3.5" aria-hidden />
        </ToolButton>
        <ToolButton label="Duplicate section" size="sm" onClick={() => duplicateSection(dispatch, index)}>
          <Copy className="size-3.5" aria-hidden />
        </ToolButton>
        <ToolButton label="Delete section" size="sm" tone="danger" onClick={() => removeSection(dispatch, index)}>
          <Trash2 className="size-3.5" aria-hidden />
        </ToolButton>
        <ToolButton label="Deselect" size="sm" onClick={() => selectSection(dispatch, null)}>
          <X className="size-3.5" aria-hidden />
        </ToolButton>
      </header>
      <Tabs tabs={SECTION_TABS} value={tab} onChange={setTab} label="Section properties" />
      <div role="tabpanel" aria-label={SECTION_TABS.find((candidate) => candidate.id === tab)?.label} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {tab === "content" && (
          <div className="flex flex-col">
            <SectionContentForm key={section.id} section={section} onChange={change} />
            <div className="border-t border-ed-border/70 p-3 mt-4">
              <button
                type="button"
                onClick={() => removeSection(dispatch, index)}
                className="flex w-full items-center justify-center gap-1.5 rounded-ed border border-ed-danger/40 bg-ed-danger-soft/50 py-2 text-ed-xs font-semibold text-ed-danger hover:bg-ed-danger hover:text-white transition-colors"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Delete {definition.label.toLowerCase()}
              </button>
            </div>
          </div>
        )}
        {tab === "style" && <SectionStyleForm settings={section.settings} siteFont={siteFont} onChange={changeSettings} />}
        {tab === "responsive" && <SectionResponsiveForm settings={section.settings} onChange={changeSettings} />}
        {tab === "advanced" && <SectionAdvancedForm settings={section.settings} onChange={changeSettings} />}
      </div>
      {saving && (
        <SaveNameDialog
          isOpen
          title="Save section"
          intro="Saves a copy of this section to your library so you can add it to any page."
          defaultName={definition.label}
          submitLabel="Save"
          onSubmit={saveToLibrary}
          onClose={() => setSaving(false)}
        />
      )}
    </>
  );
}

function SiteInspector() {
  const { draft, page, themes, editDraft, selectPage, siteArea, setSiteArea } = useEditor();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useBuilderPuck((state) => state.dispatch);
  const content = useBuilderPuck((state) => state.appState.data.content);

  // Check if this page has a Header or Footer section in Puck content
  const pageHeaderIndex = content.findIndex((item) => getSectionType(item.type) === "header");
  const pageHeaderItem = pageHeaderIndex !== -1 ? content[pageHeaderIndex] : null;

  const pageFooterIndex = content.findIndex((item) => getSectionType(item.type) === "footer");
  const pageFooterItem = pageFooterIndex !== -1 ? content[pageFooterIndex] : null;

  function handleHeaderChange(header: typeof draft.header) {
    if (pageHeaderItem) {
      const section = itemAsSection(pageHeaderItem);
      replaceSection(dispatch, pageHeaderIndex, { ...section, type: "header", data: header } as Section);
    }
    editDraft((current) => ({ ...current, header }));
  }

  function handleRemoveHeader() {
    if (pageHeaderIndex !== -1) {
      removeSection(dispatch, pageHeaderIndex);
    } else {
      editDraft((current) => ({
        ...current,
        header: { ...current.header, hidden: true },
      }));
    }
  }

  function handleFooterChange(footer: typeof draft.footer) {
    if (pageFooterItem) {
      const section = itemAsSection(pageFooterItem);
      replaceSection(dispatch, pageFooterIndex, { ...section, type: "footer", data: footer } as Section);
    }
    editDraft((current) => ({ ...current, footer }));
  }

  function handleRemoveFooter() {
    if (pageFooterIndex !== -1) {
      removeSection(dispatch, pageFooterIndex);
    } else {
      editDraft((current) => ({
        ...current,
        footer: { ...current.footer, hidden: true },
      }));
    }
  }

  function removePage() {
    const remaining = deletePage(draft, page.id);
    editDraft(() => remaining);
    setConfirmDelete(false);
    const home = homePage(remaining.pages);
    if (home) selectPage(home.id);
  }

  return (
    <>
      <header className="flex items-center gap-2 border-b border-ed-border px-3 py-2.5">
        <MousePointerClick className="size-4 text-ed-faint" aria-hidden />
        <p className="text-ed-xs text-ed-muted">Select a section on the canvas to edit it.</p>
      </header>
      <Tabs tabs={AREA_TABS} value={siteArea} onChange={setSiteArea} label="Page and site settings" />
      <div role="tabpanel" aria-label={AREA_TABS.find((tab) => tab.id === siteArea)?.label} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {siteArea === "header" && (
          <div className="flex flex-col">
            <HeaderForm
              header={pageHeaderItem ? (pageHeaderItem.props.data as typeof draft.header) : draft.header}
              pages={draft.pages}
              onChange={handleHeaderChange}
            />
            <div className="border-t border-ed-border/70 p-3 mt-4">
              <button
                type="button"
                onClick={handleRemoveHeader}
                className="flex w-full items-center justify-center gap-1.5 rounded-ed border border-ed-danger/40 bg-ed-danger-soft/50 py-2 text-ed-xs font-semibold text-ed-danger hover:bg-ed-danger hover:text-white transition-colors"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Delete header from this page
              </button>
            </div>
          </div>
        )}
        {siteArea === "page" && (
          <>
            <PageForm key={page.id} page={page} pages={draft.pages} onChange={(patch) => editDraft((current) => updatePageMeta(current, page.id, patch))} />
            {page.slug !== "/" && (
              <div className="px-4 py-4">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex h-8 items-center gap-1.5 rounded-ed px-2.5 text-ed-sm text-ed-danger hover:bg-ed-danger-soft"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  Delete page
                </button>
              </div>
            )}
          </>
        )}
        {siteArea === "theme" && (
          <ThemeForm theme={draft.theme} presets={themes} onChange={(theme) => editDraft((current) => ({ ...current, theme }))} />
        )}
        {siteArea === "footer" && (
          <div className="flex flex-col">
            <FooterForm
              footer={pageFooterItem ? (pageFooterItem.props.data as typeof draft.footer) : draft.footer}
              pages={draft.pages}
              onChange={handleFooterChange}
            />
            <div className="border-t border-ed-border/70 p-3 mt-4">
              <button
                type="button"
                onClick={handleRemoveFooter}
                className="flex w-full items-center justify-center gap-1.5 rounded-ed border border-ed-danger/40 bg-ed-danger-soft/50 py-2 text-ed-xs font-semibold text-ed-danger hover:bg-ed-danger hover:text-white transition-colors"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Delete footer from this page
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={confirmDelete}
        title={`Delete “${page.name}”?`}
        confirmLabel="Delete page"
        tone="danger"
        onConfirm={removePage}
        onCancel={() => setConfirmDelete(false)}
      >
        The page and its sections are removed from the draft, along with any menu links to it. The live site changes only when you publish.
      </ConfirmDialog>
    </>
  );
}

export default function Inspector() {
  const selector = useBuilderPuck((state) => state.appState.ui.itemSelector);
  const item = useBuilderPuck((state) =>
    state.appState.ui.itemSelector ? (state.appState.data.content[state.appState.ui.itemSelector.index] ?? null) : null,
  );

  return (
    <aside aria-label="Properties" className="z-(--z-ed-panel) flex h-full min-h-0 w-80 shrink-0 flex-col border-l border-ed-border bg-ed-panel overflow-hidden">
      {item && selector ? <SectionInspector key={item.props.id} item={item} index={selector.index} /> : <SiteInspector />}
    </aside>
  );
}
