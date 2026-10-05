import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { MousePointerClick, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { errorMessage } from "../../api/http.ts";
import { websitesApi, type WebsiteSummary } from "../../api/websites.ts";
import { useAuth } from "../../auth/auth-context.ts";
import PageHeader from "../../components/app/PageHeader.tsx";
import FormAlert from "../../components/ui/FormAlert.tsx";
import WebsiteCard from "../../components/websites/WebsiteCard.tsx";

function BuilderChoices() {
  return (
    <div className="mx-auto mt-7 grid max-w-2xl gap-4 sm:grid-cols-2">
      <Link
        to="/websites/new"
        className="rounded-lg border border-line p-5 text-left transition-colors hover:border-brand hover:bg-brand-soft/40"
      >
        <MousePointerClick className="size-5 text-brand" aria-hidden />
        <p className="mt-3 font-medium text-ink">Manual builder</p>
        <p className="mt-1 text-sm text-ink-body">Pick a template and edit every section yourself.</p>
        <p className="mt-3 text-sm font-medium text-brand">Start building →</p>
      </Link>
      <div aria-disabled="true" className="rounded-lg border border-line p-5 text-left opacity-70">
        <Sparkles className="size-5 text-brand" aria-hidden />
        <p className="mt-3 font-medium text-ink">AI builder</p>
        <p className="mt-1 text-sm text-ink-body">Describe your business and get a ready-to-edit first draft.</p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">Coming soon</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<WebsiteSummary[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    websitesApi
      .list({ pageSize: 100 })
      .then((result) => !cancelled && setWebsites(result.items))
      .catch((err: unknown) => !cancelled && setLoadError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-6 py-8 sm:px-8">
      <PageHeader
        title={`Welcome, ${user?.fullName ?? ""}`}
        description="Your websites. Only your account can see these."
        actions={
          <Link to="/websites/new" className={buttonVariants()}>
            <Plus className="size-4" aria-hidden /> Create website
          </Link>
        }
      />

      {loadError && (
        <div className="mt-6 max-w-2xl">
          <FormAlert status="danger">{loadError}</FormAlert>
        </div>
      )}

      {!websites && !loadError && (
        <div className="grid place-items-center py-20">
          <Spinner aria-label="Loading websites" />
        </div>
      )}

      {websites?.length === 0 && (
        <section className="mt-8 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
            <Plus className="size-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-ink">Create your first website</h2>
          <p className="mt-1 text-sm text-ink-body">Choose how you'd like to start.</p>
          <BuilderChoices />
        </section>
      )}

      {websites && websites.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
          <Link
            to="/websites/new"
            className="grid min-h-60 place-items-center rounded-xl border border-dashed border-line-strong bg-surface p-6 text-center transition-colors hover:border-brand hover:bg-brand-soft/40"
          >
            <span>
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-brand-soft text-brand">
                <Plus className="size-5" aria-hidden />
              </span>
              <span className="mt-3 block font-medium text-ink">Create a new website</span>
              <span className="mt-1 block text-sm text-ink-body">Manual builder or AI builder</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
