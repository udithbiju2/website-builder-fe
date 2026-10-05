import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

type Props = { children: ReactNode; backTo: string };
type State = { error: Error | null };

/** Keeps a crash inside the editor from blanking the whole app; unsaved edits are already autosaved. */
export default class EditorErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Editor crashed", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="ed-root grid min-h-dvh place-items-center bg-ed-app p-6">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <span className="grid size-10 place-items-center rounded-ed-lg bg-ed-danger-soft text-ed-danger">
            <AlertTriangle className="size-5" aria-hidden />
          </span>
          <h1 className="text-base font-semibold text-ed-text">The editor ran into a problem</h1>
          <p className="text-ed-sm text-ed-muted">Your last saved draft is safe. Reload to continue editing.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex h-8 items-center gap-1.5 rounded-ed bg-ed-accent px-3 text-ed-sm font-medium text-white hover:bg-ed-accent-hover"
            >
              <RotateCw className="size-3.5" aria-hidden />
              Reload editor
            </button>
            <a href={this.props.backTo} className="flex h-8 items-center rounded-ed border border-ed-border px-3 text-ed-sm text-ed-text hover:bg-ed-hover">
              Back to websites
            </a>
          </div>
        </div>
      </div>
    );
  }
}
