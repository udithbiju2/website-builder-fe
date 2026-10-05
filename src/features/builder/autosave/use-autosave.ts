import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, errorMessage, type FieldIssue } from "../../../api/http.ts";
import { websitesApi, type WebsiteDetail } from "../../../api/websites.ts";
import { toSaveInput, type EditorDraft } from "../../../pages/websites/editor/editor-state.ts";
import { describeIssue, type SaveIssue } from "../../../pages/websites/editor/save-errors.ts";
import { EDITOR_SCHEMA_VERSION } from "../schema/editor-document.ts";
import { planSave } from "./save-plan.ts";
import { SerialSaver } from "./serial-saver.ts";

export type AutosaveStatus = "saved" | "unsaved" | "saving" | "offline" | "failed" | "conflict";

type Options = {
  websiteId: string;
  draft: EditorDraft;
  /** `draftUpdatedAt` of the loaded draft; the optimistic-concurrency token. */
  initialToken: string;
  /** Receives the refreshed website after a full-draft save (status, unpublished changes). */
  onWebsite: (website: WebsiteDetail) => void;
  debounceMs?: number;
};

export type AutosaveState = {
  status: AutosaveStatus;
  issue: SaveIssue | null;
  lastSavedAt: Date | null;
  /** Current server token; needed to publish exactly what was saved. */
  token: () => string;
  /** Saves pending changes now. Resolves true when everything is saved. */
  flush: () => Promise<boolean>;
};

class SaveValidationError extends Error {
  constructor(readonly issue: SaveIssue) {
    super(issue.message);
  }
}

function firstIssue(error: ApiError): FieldIssue | null {
  if (error.code !== "VALIDATION_ERROR" || !Array.isArray(error.details) || error.details.length === 0) return null;
  return error.details[0] as FieldIssue;
}

export function useAutosave({ websiteId, draft, initialToken, onWebsite, debounceMs = 1200 }: Options): AutosaveState {
  const [status, setStatus] = useState<AutosaveStatus>("saved");
  const [issue, setIssue] = useState<SaveIssue | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const tokenRef = useRef(initialToken);
  const savedRef = useRef(draft);
  const draftRef = useRef(draft);
  const blockedRef = useRef(false);
  const onWebsiteRef = useRef(onWebsite);

  useEffect(() => {
    onWebsiteRef.current = onWebsite;
  }, [onWebsite]);

  const saver = useMemo(
    () =>
      new SerialSaver<EditorDraft>(async (next) => {
        const plan = planSave(savedRef.current, next);
        try {
          if (plan.kind === "page") {
            const result = await websitesApi.savePageContent(websiteId, plan.pageId, {
              expectedDraftUpdatedAt: tokenRef.current,
              schemaVersion: EDITOR_SCHEMA_VERSION,
              sections: plan.sections,
            });
            tokenRef.current = result.draftUpdatedAt;
          } else if (plan.kind === "draft") {
            const website = await websitesApi.saveDraft(websiteId, toSaveInput(next, tokenRef.current));
            tokenRef.current = website.draft.draftUpdatedAt;
            onWebsiteRef.current(website);
          }
          savedRef.current = next;
        } catch (error) {
          const field = error instanceof ApiError ? firstIssue(error) : null;
          if (!field) throw error;
          // The page endpoint reports paths relative to the page; describe them against the full draft.
          const path = plan.kind === "page" ? ["pages", plan.pageIndex, ...field.path] : field.path;
          throw new SaveValidationError(describeIssue(next, { ...field, path }));
        }
      }),
    [websiteId],
  );

  const hasChanges = useCallback(() => planSave(savedRef.current, draftRef.current).kind !== "none", []);

  const flush = useCallback(async (): Promise<boolean> => {
    if (blockedRef.current) return false;
    if (!hasChanges() && !saver.busy) {
      setStatus("saved");
      return true;
    }
    if (!navigator.onLine) {
      setStatus("offline");
      return false;
    }
    setStatus("saving");
    try {
      await saver.submit(draftRef.current);
      setIssue(null);
      if (hasChanges()) {
        setStatus("unsaved");
        return false;
      }
      setLastSavedAt(new Date());
      setStatus("saved");
      return true;
    } catch (error) {
      if (error instanceof SaveValidationError) {
        setIssue(error.issue);
        setStatus("failed");
      } else if (error instanceof ApiError && (error.code === "DRAFT_CONFLICT" || error.code === "PAGE_ID_TAKEN")) {
        blockedRef.current = true;
        setIssue({ message: error.message });
        setStatus("conflict");
      } else if (!navigator.onLine || error instanceof TypeError) {
        setIssue(null);
        setStatus("offline");
      } else {
        setIssue({ message: errorMessage(error) });
        setStatus("failed");
      }
      return false;
    }
  }, [saver, hasChanges]);

  useEffect(() => {
    draftRef.current = draft;
    if (blockedRef.current || !hasChanges()) return;
    setStatus((current) => (current === "saving" || current === "offline" ? current : "unsaved"));
    const timer = window.setTimeout(() => void flush(), debounceMs);
    return () => window.clearTimeout(timer);
  }, [draft, flush, hasChanges, debounceMs]);

  useEffect(() => {
    const goOnline = () => void flush();
    const goOffline = () => setStatus((current) => (current === "saved" ? current : "offline"));
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [flush]);

  useEffect(() => {
    if (status === "saved") return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  const token = useCallback(() => tokenRef.current, []);

  return { status, issue, lastSavedAt, token, flush };
}
