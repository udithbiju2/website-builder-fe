import { useEffect, useMemo, useState } from "react";
import { Chip, Spinner } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ApiError, errorMessage } from "../../api/http.ts";
import { templatesApi, type TemplatePreview } from "../../api/websites.ts";
import { useAuth } from "../../auth/auth-context.ts";
import { DeviceToggle, PreviewFrame, type Device } from "../../components/websites/DevicePreview.tsx";
import { SitePage } from "../../site-kit/index.ts";

export default function TemplateDetailPage() {
  const { templateKey = "" } = useParams();
  const { user } = useAuth();
  const [preview, setPreview] = useState<TemplatePreview | null>(null);
  const [error, setError] = useState<{ notFound: boolean; message: string } | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [pageSlug, setPageSlug] = useState("/");

  useEffect(() => {
    let cancelled = false;
    setPreview(null);
    setError(null);
    setPageSlug("/");
    templatesApi
      .preview(templateKey)
      .then((loaded) => !cancelled && setPreview(loaded))
      .catch(
        (err: unknown) =>
          !cancelled && setError({ notFound: err instanceof ApiError && err.status === 404, message: errorMessage(err) }),
      );
    return () => {
      cancelled = true;
    };
  }, [templateKey]);

  const pages = useMemo(() => preview?.site.pages ?? [], [preview]);
  const page = pages.find((candidate) => candidate.slug === pageSlug) ?? pages[0];
  const useTemplateHref = user ? `/websites/new?templateKey=${encodeURIComponent(templateKey)}` : "/signup";

  function handleLinkClick(href: string) {
    const target = pages.find((candidate) => candidate.slug === href);
    if (target) setPageSlug(target.slug);
  }

  if (error) {
    return (
      <div className="grid flex-1 place-items-center bg-canvas px-5 py-24 text-center">
        <div className="max-w-sm">
          <h1 className="text-xl font-semibold text-ink">{error.notFound ? "Template not found" : "Couldn't load template"}</h1>
          <p className="mt-2 text-sm text-ink-body">
            {error.notFound ? "This template doesn't exist or is no longer available." : error.message}
          </p>
          <Link to="/#templates" className={`${buttonVariants({ variant: "outline" })} mt-6`}>
            <ArrowLeft className="size-4" aria-hidden /> All templates
          </Link>
        </div>
      </div>
    );
  }

  if (!preview || !page) {
    return (
      <div className="grid flex-1 place-items-center bg-canvas py-24">
        <Spinner size="lg" aria-label="Loading template" />
      </div>
    );
  }

  const { template } = preview;

  return (
    <div className="flex-1 bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Link
          to="/#templates"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden /> All templates
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0 max-w-2xl">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-ink">{template.name}</h1>
              <Chip size="sm" variant="soft">
                {template.category}
              </Chip>
            </div>
            {template.description && <p className="mt-2 text-ink-body">{template.description}</p>}
            <p className="mt-2 text-sm text-ink-muted">
              {pages.length} {pages.length === 1 ? "page" : "pages"} · Fully editable after you start
            </p>
          </div>
          <Link to={useTemplateHref} className={buttonVariants({ variant: "primary" })}>
            Use this template <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
            {pages.length > 1 ? (
              <div role="tablist" aria-label="Template pages" className="flex flex-wrap gap-1">
                {pages.map((candidate) => {
                  const active = candidate.slug === page.slug;
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setPageSlug(candidate.slug)}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        active ? "bg-ink font-medium text-white" : "text-ink-body hover:bg-canvas hover:text-ink"
                      }`}
                    >
                      {candidate.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span className="px-1 text-sm font-medium text-ink">{page.name}</span>
            )}
            <DeviceToggle value={device} onChange={setDevice} />
          </div>

          <PreviewFrame device={device} fit onLinkClick={handleLinkClick}>
            <SitePage site={preview.site} page={page} />
          </PreviewFrame>
        </section>
      </div>
    </div>
  );
}
