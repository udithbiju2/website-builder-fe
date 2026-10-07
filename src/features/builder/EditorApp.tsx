import "@puckeditor/core/no-external.css";
import "./builder.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Puck, type Data } from "@puckeditor/core";
import { AlertTriangle, CheckCircle2, RotateCw, X } from "lucide-react";
import type { SavedSection, ThemeOption, WebsiteDetail, WebsitePage } from "../../api/websites.ts";
import type { Device } from "../../components/websites/DevicePreview.tsx";
import { draftFromWebsite, homePage, updateSections, type EditorDraft } from "../../pages/websites/editor/editor-state.ts";
import { LinkTargetsContext, MediaTargetContext } from "../../pages/websites/editor/fields.tsx";
import type { Section } from "../../site-kit/index.ts";
import { useAutosave } from "./autosave/use-autosave.ts";
import {
  BuilderSiteContext,
  EditorContext,
  useEditor,
  type BuilderSiteValue,
  type EditorRole,
  type EditorValue,
  type LeftPanelId,
  type SiteArea,
} from "./editor-context.ts";
import { builderConfig } from "./puck/config.tsx";
import { EditorDataError, puckDataToSections, sectionsToPuckData } from "./puck/adapter.ts";
import { selectSection, useBuilderPuck } from "./puck/puck-api.ts";
import AiDrawer from "./shell/AiDrawer.tsx";
import CanvasViewport from "./shell/CanvasViewport.tsx";
import Inspector from "./shell/Inspector.tsx";
import LeftRail from "./shell/LeftRail.tsx";
import PublishDialog from "./shell/PublishDialog.tsx";
import TopBar from "./shell/TopBar.tsx";

type Toast = { id: number; message: string; tone: "success" | "danger" };

export type EditorAppProps = {
  website: WebsiteDetail;
  themes: ThemeOption[];
  savedSections: SavedSection[];
  role: EditorRole;
  backTo: string;
  justCreated: boolean;
};

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Lives inside <Puck> so it can reach editor state; draws the canvas and site chrome. */
function EditorShell({ backTo, onPublish }: { backTo: string; onPublish: () => void }) {
  const { draft, siteArea, setSiteArea, setLeftPanel, device, aiOpen } = useEditor();
  const dispatch = useBuilderPuck((state) => state.dispatch);
  const hasSelection = useBuilderPuck((state) => state.appState.ui.itemSelector !== null);
  const isEmpty = useBuilderPuck((state) => state.appState.data.content.length === 0);

  const site = useMemo<BuilderSiteValue>(
    () => ({
      theme: draft.theme,
      header: draft.header,
      footer: draft.footer,
      activeArea: hasSelection || siteArea === "page" ? null : siteArea,
      isEmpty,
      selectArea: (area: SiteArea) => {
        selectSection(dispatch, null);
        setSiteArea(area);
      },
      openAddPanel: () => setLeftPanel("add"),
    }),
    [draft.theme, draft.header, draft.footer, hasSelection, siteArea, isEmpty, dispatch, setSiteArea, setLeftPanel],
  );

  const handleDeselect = useCallback(() => {
    selectSection(dispatch, null);
    setSiteArea("page");
  }, [dispatch, setSiteArea]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (hasSelection || siteArea !== "page")) {
        handleDeselect();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasSelection, siteArea, handleDeselect]);

  return (
    <BuilderSiteContext.Provider value={site}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <TopBar backTo={backTo} onPublish={onPublish} />
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <LeftRail />
          <CanvasViewport device={device} onDeselect={handleDeselect}>
            <Puck.Preview />
          </CanvasViewport>
          {aiOpen ? <AiDrawer /> : <Inspector />}
        </div>
      </div>
    </BuilderSiteContext.Provider>
  );
}

/** One Puck instance per page; initial data is read once and later edits flow out through onChange. */
function PageCanvas({ page, backTo, onChange, onPublish }: { page: WebsitePage; backTo: string; onChange: (data: Data) => void; onPublish: () => void }) {
  const [initialData] = useState(() => sectionsToPuckData(page.sections));
  return (
    <Puck config={builderConfig} data={initialData} onChange={onChange}>
      <EditorShell backTo={backTo} onPublish={onPublish} />
    </Puck>
  );
}

export default function EditorApp({ website: initialWebsite, themes, savedSections: initialSaved, role, backTo, justCreated }: EditorAppProps) {
  const [website, setWebsite] = useState(initialWebsite);
  const [draft, setDraft] = useState<EditorDraft>(() => draftFromWebsite(initialWebsite));
  const [pageId, setPageId] = useState(() => homePage(initialWebsite.draft.pages)?.id ?? "");
  const [savedSections, setSavedSectionsState] = useState(initialSaved);
  const [leftPanel, setLeftPanel] = useState<LeftPanelId | null>("add");
  const [siteArea, setSiteArea] = useState<SiteArea>("page");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiBuilding, setAiBuilding] = useState<import("./editor-context.ts").AiBuildingState>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [publishOpen, setPublishOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(
    justCreated ? { id: 0, message: "Website created. Add sections from the left panel.", tone: "success" } : null,
  );

  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const autosave = useAutosave({
    websiteId: website.id,
    draft,
    initialToken: initialWebsite.draft.draftUpdatedAt,
    onWebsite: setWebsite,
  });

  const page = draft.pages.find((candidate) => candidate.id === pageId) ?? homePage(draft.pages) ?? draft.pages[0]!;

  const notify = useCallback((message: string, tone: Toast["tone"] = "success") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const editDraft = useCallback((update: (current: EditorDraft) => EditorDraft) => {
    setDraft((current) => update(current));
    setWebsite((current) => (current.status === "PUBLISHED" && !current.hasUnpublishedChanges ? { ...current, hasUnpublishedChanges: true } : current));
  }, []);

  const selectPage = useCallback((id: string) => setPageId(id), []);
  const setSavedSections = useCallback((update: (current: SavedSection[]) => SavedSection[]) => setSavedSectionsState(update), []);

  const handlePuckChange = useCallback(
    (data: Data) => {
      let sections: Section[];
      try {
        sections = puckDataToSections(data);
      } catch (error) {
        notify(error instanceof EditorDataError ? error.message : "That change couldn't be applied.", "danger");
        return;
      }
      const current = draftRef.current.pages.find((candidate) => candidate.id === page.id);
      if (current && sameJson(current.sections, sections)) return;
      editDraft((d) => updateSections(d, page.id, () => sections));
    },
    [page.id, editDraft, notify],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void autosave.flush();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [autosave]);

  const linkTargets = useMemo(() => draft.pages.map((candidate) => ({ label: candidate.name, href: candidate.slug })), [draft.pages]);
  const mediaTarget = useMemo(() => ({ clientId: website.clientId, websiteId: website.id }), [website.clientId, website.id]);

  const value = useMemo<EditorValue>(
    () => ({
      website,
      draft,
      page,
      role,
      themes,
      savedSections,
      setSavedSections,
      autosave,
      editDraft,
      selectPage,
      leftPanel,
      setLeftPanel,
      siteArea,
      setSiteArea,
      aiOpen,
      setAiOpen,
      device,
      setDevice,
      notify,
      aiBuilding,
      setAiBuilding,
    }),
    [website, draft, page, role, themes, savedSections, setSavedSections, autosave, editDraft, selectPage, leftPanel, siteArea, aiOpen, device, notify, aiBuilding],
  );

  return (
    <EditorContext.Provider value={value}>
      <LinkTargetsContext.Provider value={linkTargets}>
        <MediaTargetContext.Provider value={mediaTarget}>
          <div className="ed-root flex h-dvh flex-col overflow-hidden bg-ed-app font-sans text-ed-text">
            <PageCanvas key={page.id} page={page} backTo={backTo} onChange={handlePuckChange} onPublish={() => setPublishOpen(true)} />

            {(autosave.status === "conflict" || (autosave.status === "failed" && autosave.issue)) && (
              <div
                role="alert"
                className="fixed left-1/2 top-14 z-(--z-ed-toast) flex max-w-xl -translate-x-1/2 items-start gap-2 rounded-ed-lg border border-ed-border bg-ed-panel px-3 py-2 shadow-ed-pop"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-ed-danger" aria-hidden />
                <p className="text-ed-sm text-ed-text">
                  {autosave.status === "conflict"
                    ? "This website was changed in another tab or by someone else. Reload to get the latest version; your recent edits here can't be saved."
                    : autosave.issue?.message}
                </p>
                {autosave.status === "conflict" && (
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="flex h-7 shrink-0 items-center gap-1 rounded-ed bg-ed-accent px-2.5 text-ed-xs font-medium text-white hover:bg-ed-accent-hover"
                  >
                    <RotateCw className="size-3.5" aria-hidden /> Reload
                  </button>
                )}
              </div>
            )}

            {toast && (
              <div
                key={toast.id}
                role="status"
                className="fixed bottom-5 left-1/2 z-(--z-ed-toast) flex -translate-x-1/2 items-center gap-2 rounded-ed-lg bg-ed-text px-3 py-2 text-ed-sm text-white shadow-ed-pop"
              >
                {toast.tone === "danger" ? (
                  <AlertTriangle className="size-4 text-ed-danger-soft" aria-hidden />
                ) : (
                  <CheckCircle2 className="size-4 text-ed-success-soft" aria-hidden />
                )}
                {toast.message}
                <button type="button" aria-label="Dismiss" onClick={() => setToast(null)} className="ml-1 text-white/60 hover:text-white">
                  <X className="size-3.5" aria-hidden />
                </button>
              </div>
            )}

            <PublishDialog
              isOpen={publishOpen}
              onClose={() => setPublishOpen(false)}
              onPublished={(published) => {
                setWebsite(published);
                setPublishOpen(false);
                notify("Published. Your site is live.");
              }}
            />
          </div>
        </MediaTargetContext.Provider>
      </LinkTargetsContext.Provider>
    </EditorContext.Provider>
  );
}
