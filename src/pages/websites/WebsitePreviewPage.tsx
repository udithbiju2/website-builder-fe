import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { errorMessage } from "../../api/http.ts";
import { websitesApi, type WebsiteDetail } from "../../api/websites.ts";
import { useAuth } from "../../auth/auth-context.ts";
import FormAlert from "../../components/ui/FormAlert.tsx";
import { DeviceToggle, PreviewFrame, type Device } from "../../components/websites/DevicePreview.tsx";
import { WebsiteStatusChip } from "../../components/websites/website-labels.tsx";
import { SitePage, type SiteData } from "../../site-kit/index.ts";
import type { CreatedState } from "./CreateWebsitePage.tsx";

export default function WebsitePreviewPage() {
  const { id = "" } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const justCreated = (location.state as CreatedState | null)?.created === true;
  const backTo = user?.role === "SUPER_ADMIN" ? "/admin/websites" : "/dashboard";

  const [website, setWebsite] = useState<WebsiteDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    websitesApi
      .get(id)
      .then((loaded) => !cancelled && setWebsite(loaded))
      .catch((err: unknown) => !cancelled && setLoadError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const site = useMemo<SiteData | null>(
    () =>
      website && {
        theme: website.draft.theme,
        header: website.draft.header,
        footer: website.draft.footer,
        pages: website.draft.pages,
      },
    [website],
  );
  const pages = website?.draft.pages ?? [];
  const page = pages.find((candidate) => candidate.id === pageId) ?? pages.find((candidate) => candidate.slug === "/") ?? pages[0];

  function openLink(href: string) {
    const target = pages.find((candidate) => candidate.slug === href);
    if (target) setPageId(target.id);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 flex flex-wrap items-center gap-x-6 gap-y-3 bg-ink px-6 py-3 text-white">
        <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white">
          <ArrowLeft className="size-4" aria-hidden /> Back
        </Link>
        {website && (
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium">{website.name}</span>
            <WebsiteStatusChip website={website} />
          </div>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {pages.length > 1 && (
            <label className="flex items-center gap-2 text-sm text-white/70">
              Page
              <select
                value={page?.id ?? ""}
                onChange={(event) => setPageId(event.target.value)}
                className="h-8 rounded-md border border-white/15 bg-white/10 px-2 text-sm text-white outline-none focus:border-white/40"
              >
                {pages.map((candidate) => (
                  <option key={candidate.id} value={candidate.id} className="text-ink">
                    {candidate.name}
                    {candidate.visible ? "" : " (hidden)"}
                  </option>
                ))}
              </select>
            </label>
          )}
          <DeviceToggle value={device} onChange={setDevice} tone="dark" />
          {website && (
            <Link to={`/websites/${website.id}/edit`} className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-ink hover:bg-white/90">
              Edit website
            </Link>
          )}
        </div>
      </header>

      {justCreated && website && (
        <div className="mx-auto max-w-3xl px-6 pt-5">
          <FormAlert status="success" title="Draft created">
            “{website.name}” was created with {website.pageCount} pages. This is a preview of the draft; nothing is published.
          </FormAlert>
        </div>
      )}

      {loadError && (
        <div className="mx-auto max-w-3xl px-6 pt-8">
          <FormAlert status="danger">{loadError}</FormAlert>
        </div>
      )}

      {!website && !loadError && (
        <div className="grid place-items-center py-24">
          <Spinner aria-label="Loading website" />
        </div>
      )}

      {site && page && (
        <>
          <p className="px-6 pt-4 text-center text-xs text-ink-muted">
            Previewing draft · Page: {page.name} · {page.slug}
          </p>
          <PreviewFrame device={device} onLinkClick={openLink}>
            <SitePage site={site} page={page} />
          </PreviewFrame>
        </>
      )}
    </div>
  );
}
