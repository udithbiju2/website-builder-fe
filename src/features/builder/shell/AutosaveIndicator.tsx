import { AlertCircle, Check, CloudOff, Loader2, RefreshCw } from "lucide-react";
import type { AutosaveState } from "../autosave/use-autosave.ts";

function savedLabel(date: Date | null): string {
  if (!date) return "Saved";
  return `Saved ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

/** Live autosave state; failures expose a retry and stay announced to screen readers. */
export default function AutosaveIndicator({ autosave }: { autosave: AutosaveState }) {
  const { status, lastSavedAt, flush } = autosave;
  const base = "inline-flex h-7 items-center gap-1.5 rounded-ed px-2 text-ed-xs";

  let content;
  switch (status) {
    case "saving":
      content = (
        <span className={`${base} text-ed-muted`}>
          <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden /> Saving…
        </span>
      );
      break;
    case "unsaved":
      content = (
        <span className={`${base} text-ed-muted`}>
          <span className="size-1.5 rounded-full bg-ed-warning" aria-hidden /> Unsaved changes
        </span>
      );
      break;
    case "offline":
      content = (
        <span className={`${base} bg-ed-warning-soft text-ed-warning`} title="Changes are kept in this tab and saved when you're back online.">
          <CloudOff className="size-3.5" aria-hidden /> Offline
        </span>
      );
      break;
    case "failed":
      content = (
        <span className={`${base} bg-ed-danger-soft text-ed-danger`}>
          <AlertCircle className="size-3.5" aria-hidden /> Not saved
          <button type="button" onClick={() => void flush()} className="ml-1 inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline">
            <RefreshCw className="size-3" aria-hidden /> Retry
          </button>
        </span>
      );
      break;
    case "conflict":
      content = (
        <span className={`${base} bg-ed-danger-soft text-ed-danger`}>
          <AlertCircle className="size-3.5" aria-hidden /> Changed elsewhere
        </span>
      );
      break;
    default:
      content = (
        <span className={`${base} text-ed-muted`}>
          <Check className="size-3.5 text-ed-success" aria-hidden /> {savedLabel(lastSavedAt)}
        </span>
      );
  }

  return (
    <div role="status" aria-live="polite" className="min-w-28">
      {content}
    </div>
  );
}
