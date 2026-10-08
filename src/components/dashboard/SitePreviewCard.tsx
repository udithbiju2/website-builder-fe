import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { SiteData } from "../../site-kit/index.ts";
import SiteThumbnail from "../websites/SiteThumbnail.tsx";

type SitePreviewCardProps = {
  site: SiteData;
  address: string;
  previewUrl: string;
};

/** Browser-framed thumbnail of the home page; the whole card opens the full preview. */
export default function SitePreviewCard({ site, address, previewUrl }: SitePreviewCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-line bg-surface shadow-xs transition-shadow duration-200 hover:shadow-md has-[:focus-visible]:border-brand">
      <div className="flex h-8 items-center gap-3 border-b border-line bg-canvas px-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </div>
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-surface px-3 py-0.5 font-mono text-[11px] text-ink-muted">
          {address}
        </span>
        <span className="w-[42px]" aria-hidden />
      </div>
      <SiteThumbnail site={site} />
      <Link
        to={previewUrl}
        className="absolute inset-0 grid place-items-center bg-ink/0 outline-none transition-colors duration-200 group-hover:bg-ink/25"
      >
        <span className="inline-flex translate-y-1 items-center gap-1.5 rounded-lg bg-surface px-3.5 py-2 text-sm font-medium text-ink opacity-0 shadow-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100">
          <Eye className="size-4" aria-hidden /> Open preview
        </span>
      </Link>
    </div>
  );
}
