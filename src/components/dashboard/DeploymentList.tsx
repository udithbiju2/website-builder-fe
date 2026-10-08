import { Chip } from "@heroui/react";
import type { WebsiteVersion } from "../../api/websites.ts";
import { formatDateTime } from "../websites/website-labels.tsx";

const STATUS = {
  SUCCEEDED: { label: "Ready", dot: "bg-emerald-500" },
  PENDING: { label: "Publishing", dot: "bg-amber-500" },
  FAILED: { label: "Failed", dot: "bg-ed-danger" },
} as const satisfies Record<WebsiteVersion["status"], { label: string; dot: string }>;

type DeploymentListProps = {
  versions: WebsiteVersion[];
  /** Drops the outer card so the list can sit inside another panel. */
  embedded?: boolean;
};

/** Publish history, newest first. */
export default function DeploymentList({ versions, embedded = false }: DeploymentListProps) {
  const frame = embedded ? "" : "rounded-xl border border-line bg-surface shadow-xs";

  if (versions.length === 0) {
    return (
      <div className={`px-6 py-12 text-center ${embedded ? "" : "rounded-xl border border-dashed border-line-strong bg-surface"}`}>
        <p className="text-sm font-medium text-ink">No deployments yet</p>
        <p className="mt-1 text-sm text-ink-muted">Publish your website to create the first deployment.</p>
      </div>
    );
  }

  return (
    <ul className={`divide-y divide-line overflow-hidden ${frame}`}>
      {versions.map((version) => {
        const status = STATUS[version.status];
        return (
          <li key={version.id} className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-5 py-3.5 text-sm">
            <span className="w-12 font-mono font-medium text-ink">v{version.version}</span>
            <span className="flex items-center gap-2 text-ink-body">
              <span className={`size-2 rounded-full ${status.dot}`} aria-hidden />
              {status.label}
            </span>
            {version.isLive && (
              <Chip size="sm" color="success">
                Live
              </Chip>
            )}
            <span className="ml-auto text-right text-ink-muted">
              {formatDateTime(version.createdAt)}
              {version.publishedByName && (
                <>
                  {" · "}
                  <span className="text-ink-body">{version.publishedByName}</span>
                </>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
