import { useMemo, useState } from "react";
import { Copy, ImageOff, Images } from "lucide-react";
import { useEditor } from "../../editor-context.ts";
import { collectAssets } from "../../assets.ts";
import { EmptyState, PanelHeader, SearchField } from "../ui.tsx";

export default function AssetsPanel() {
  const { draft, notify } = useEditor();
  const [query, setQuery] = useState("");
  const assets = useMemo(() => collectAssets(draft), [draft]);
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? assets.filter((asset) => `${asset.alt} ${asset.url} ${asset.usedOn.join(" ")}`.toLowerCase().includes(needle))
    : assets;

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      notify("Image URL copied");
    } catch {
      notify("Couldn't copy. Your browser blocked clipboard access.", "danger");
    }
  }

  return (
    <>
      <PanelHeader title="Assets" description="Images used across this website. Copy a URL to reuse it in any image field." />
      {assets.length > 0 && <SearchField value={query} onChange={setQuery} placeholder="Search by alt text or page" />}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
        {assets.length === 0 ? (
          <EmptyState icon={<Images className="size-4" />} title="No images yet">
            Add an image URL to a section and it will be listed here.
          </EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState icon={<ImageOff className="size-4" />} title="No matching images" />
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {visible.map((asset) => (
              <li key={asset.url} className="group overflow-hidden rounded-ed border border-ed-border bg-ed-panel shadow-ed-xs">
                <div className="relative aspect-4/3 bg-ed-subtle">
                  <img src={asset.url} alt={asset.alt} loading="lazy" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => void copy(asset.url)}
                    aria-label={`Copy URL of ${asset.alt || "image"}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Copy className="size-4" aria-hidden />
                  </button>
                </div>
                <p className="truncate px-1.5 py-1 text-ed-2xs text-ed-muted" title={asset.usedOn.join(", ")}>
                  {asset.alt || "No alt text"}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 rounded-ed bg-ed-subtle px-2 py-1.5 text-ed-2xs text-ed-muted">
          To upload, use Upload or Choose from library in any image field.
        </p>
      </div>
    </>
  );
}
