import { Button } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Eye, Globe, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { WebsiteSummary } from "../../api/websites.ts";
import { formatDate } from "../admin/client-labels.tsx";
import { BUILDER_LABELS, WebsiteStatusChip } from "./website-labels.tsx";

export default function WebsiteCard({
  website,
  onDelete,
}: {
  website: WebsiteSummary;
  onDelete?: (website: WebsiteSummary) => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-200 hover:border-brand/40 hover:shadow-md">
      <Link
        to={`/websites/${website.id}`}
        className="grid aspect-video place-items-center border-b border-line bg-canvas transition-colors group-hover:bg-brand-soft/30"
      >
        <span className="grid size-14 place-items-center rounded-xl bg-surface text-2xl font-semibold text-brand shadow-sm transition-transform group-hover:scale-105">
          {website.name.charAt(0).toUpperCase()}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/websites/${website.id}`}
            className="min-w-0 truncate font-medium text-ink transition-colors hover:text-brand"
          >
            {website.name}
          </Link>
          <WebsiteStatusChip website={website} />
        </div>
        <p className="mt-1 flex items-center gap-1.5 truncate font-mono text-xs text-ink-muted">
          <Globe className="size-3.5 shrink-0" aria-hidden />
          {website.subdomain}
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          {BUILDER_LABELS[website.builderType]} · {website.pageCount}{" "}
          {website.pageCount === 1 ? "page" : "pages"} · Updated{" "}
          {formatDate(website.updatedAt)}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/websites/${website.id}`}
            className={buttonVariants({ size: "sm", variant: "primary" })}
          >
            Dashboard
          </Link>
          <Link
            to={`/websites/${website.id}/edit`}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <Pencil className="size-4" aria-hidden /> Edit
          </Link>
          <Link
            to={`/websites/${website.id}/preview`}
            className={buttonVariants({ size: "sm", variant: "outline" })}
            title="Full Preview"
          >
            <Eye className="size-4" aria-hidden />
          </Link>
          {onDelete && (
            <Button
              size="sm"
              variant="outline"
              aria-label={`Delete ${website.name}`}
              onPress={() => onDelete(website)}
              className="ml-auto text-ink-muted transition-colors hover:border-ed-danger/40 hover:bg-ed-danger-soft hover:text-ed-danger focus-visible:text-ed-danger"
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
