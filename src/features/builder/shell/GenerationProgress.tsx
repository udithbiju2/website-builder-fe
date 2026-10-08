import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RotateCw } from "lucide-react";
import { errorMessage } from "../../../api/http.ts";
import { websitesApi, type WebsiteGeneration } from "../../../api/websites.ts";
import { AiSparklesIcon } from "../../../components/icons/AiSparklesIcon.tsx";

const POLL_MS = 2_000;

type GenerationProgressProps = {
  websiteId: string;
  websiteName: string;
  initial: WebsiteGeneration;
  backTo: string;
  /** Called once the draft is ready (or the failed build was dismissed) so the editor can load it. */
  onReady: () => void;
};

/** Shown instead of the editor while the AI builds the draft. */
export default function GenerationProgress({ websiteId, websiteName, initial, backTo, onReady }: GenerationProgressProps) {
  const [generation, setGeneration] = useState(initial);
  const [pollError, setPollError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const active = generation.status === "PENDING" || generation.status === "RUNNING";

  useEffect(() => {
    if (generation.status === "SUCCEEDED") onReady();
  }, [generation.status, onReady]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const timer = window.setInterval(() => {
      websitesApi
        .generation(websiteId)
        .then((next) => {
          if (cancelled) return;
          setGeneration(next);
          setPollError(null);
        })
        .catch((error: unknown) => !cancelled && setPollError(errorMessage(error)));
    }, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [active, websiteId]);

  async function retry() {
    setBusy(true);
    setActionError(null);
    try {
      setGeneration(await websitesApi.retryGeneration(websiteId));
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function continueBlank() {
    setBusy(true);
    setActionError(null);
    try {
      await websitesApi.dismissGeneration(websiteId);
      onReady();
    } catch (error) {
      setActionError(errorMessage(error));
      setBusy(false);
    }
  }

  if (generation.status === "FAILED") {
    return (
      <div role="alert" className="ed-root grid min-h-dvh place-items-center bg-ed-app p-6">
        <div className="flex max-w-md flex-col items-center gap-3 text-center">
          <span className="grid size-10 place-items-center rounded-ed-lg bg-ed-danger-soft text-ed-danger">
            <AlertTriangle className="size-5" aria-hidden />
          </span>
          <h1 className="text-base font-semibold text-ed-text">The AI couldn't build {websiteName}</h1>
          <p className="text-ed-sm text-ed-muted">{generation.errorMessage ?? "Something went wrong."}</p>
          {actionError && <p className="text-ed-sm text-ed-danger">{actionError}</p>}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={retry}
              disabled={busy}
              className="flex h-8 items-center gap-1.5 rounded-ed bg-ed-accent px-3 text-ed-sm font-medium text-white hover:bg-ed-accent-hover disabled:opacity-60"
            >
              <RotateCw className="size-3.5" aria-hidden /> Try again
            </button>
            <button
              type="button"
              onClick={continueBlank}
              disabled={busy}
              className="flex h-8 items-center rounded-ed border border-ed-border px-3 text-ed-sm text-ed-text hover:bg-ed-hover disabled:opacity-60"
            >
              Build it myself instead
            </button>
            <Link to={backTo} className="flex h-8 items-center rounded-ed px-3 text-ed-sm text-ed-muted hover:text-ed-text">
              Back to websites
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.max(3, Math.min(100, generation.progress));
  return (
    <div className="ed-root grid min-h-dvh place-items-center bg-ed-app p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <AiSparklesIcon className="size-10 animate-pulse" variant="glossy" glow aria-hidden />
        <div>
          <h1 className="text-base font-semibold text-ed-text">Building {websiteName}</h1>
          <p className="mt-1 text-ed-sm text-ed-muted">
            The AI is writing your pages. This usually takes under a minute; you can leave this page and come back.
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Website generation progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-2 w-full overflow-hidden rounded-full bg-ed-hover"
        >
          <div className="h-full rounded-full bg-ed-accent transition-[width] duration-700" style={{ width: `${progress}%` }} />
        </div>
        <p aria-live="polite" className="text-ed-sm text-ed-text">
          {generation.status === "PENDING" ? "Waiting to start…" : `${generation.step ?? "Working"}…`}
        </p>
        {pollError && <p className="text-ed-xs text-ed-muted">Couldn't refresh the status: {pollError}</p>}
        <Link to={backTo} className="text-ed-sm text-ed-muted hover:text-ed-text">
          Back to websites
        </Link>
      </div>
    </div>
  );
}
