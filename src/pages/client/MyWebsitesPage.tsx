import { useEffect, useState } from "react";
import { SearchField, Spinner } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { errorMessage } from "../../api/http.ts";
import { websitesApi, type WebsiteStatus, type WebsiteSummary } from "../../api/websites.ts";
import PageHeader from "../../components/app/PageHeader.tsx";
import FormAlert from "../../components/ui/FormAlert.tsx";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput.tsx";
import BuilderChoices from "../../components/websites/BuilderChoices.tsx";
import WebsiteCard from "../../components/websites/WebsiteCard.tsx";
import { useDebouncedValue } from "../../hooks/use-debounced-value.ts";

const STATUS_OPTIONS: SelectOption<WebsiteStatus | "">[] = [
  { value: "", label: "Any status" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "UNPUBLISHED", label: "Unpublished" },
];

export default function MyWebsitesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<WebsiteStatus | "">("");
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const [websites, setWebsites] = useState<WebsiteSummary[] | null>(null);
  const [hasAny, setHasAny] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    websitesApi
      .list({ search: debouncedSearch, status: status || undefined, pageSize: 100 })
      .then((result) => {
        if (cancelled) return;
        setWebsites(result.items);
        if (result.items.length > 0) setHasAny(true);
      })
      .catch((err: unknown) => !cancelled && setLoadError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, status]);

  const hasFilters = Boolean(debouncedSearch || status);

  return (
    <div className="px-6 py-8 sm:px-8">
      <PageHeader
        title="My websites"
        description="Create, edit and preview your websites. Only your account can see these."
        actions={
          <Link to="/websites/new" className={buttonVariants()}>
            <Plus className="size-4" aria-hidden /> Create website
          </Link>
        }
      />

      {(hasAny || hasFilters) && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <SearchField aria-label="Search websites" value={search} onChange={setSearch} className="w-full max-w-xs">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search by name or address" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <SelectInput ariaLabel="Filter by status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          {loading && websites && <Spinner size="sm" aria-label="Updating" />}
        </div>
      )}

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

      {websites?.length === 0 && hasFilters && (
        <p className="mt-10 text-center text-sm text-ink-body">No websites match these filters.</p>
      )}

      {websites?.length === 0 && !hasFilters && (
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
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
          {!hasFilters && (
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
          )}
        </div>
      )}
    </div>
  );
}
