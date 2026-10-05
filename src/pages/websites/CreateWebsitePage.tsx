import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button, Spinner } from "@heroui/react";
import { ArrowLeft, Check, LayoutTemplate, MousePointerClick, Sparkles, Trash2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { adminClientsApi, type Client } from "../../api/admin-clients.ts";
import { ApiError, errorMessage } from "../../api/http.ts";
import { websitesApi, type CreateWebsiteInput, type ThemeOption, type WebsiteTemplate } from "../../api/websites.ts";
import { useAuth } from "../../auth/auth-context.ts";
import { validateEmail } from "../../auth/validation.ts";
import ConfirmDialog from "../../components/ui/ConfirmDialog.tsx";
import FormAlert from "../../components/ui/FormAlert.tsx";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput.tsx";
import TextAreaInput from "../../components/ui/TextAreaInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";

type Step = 1 | 2 | 3;

type InfoForm = {
  name: string;
  businessName: string;
  websiteType: string;
  industry: string;
  contactEmail: string;
  contactPhone: string;
  subdomain: string;
  description: string;
};

type InfoErrors = Partial<Record<keyof InfoForm | "clientId", string>>;

export type CreatedState = { created?: boolean };

const STEPS: { step: Step | 4; label: string }[] = [
  { step: 1, label: "Builder type" },
  { step: 2, label: "Website info" },
  { step: 3, label: "Starting point" },
  { step: 4, label: "Create draft" },
];

const WEBSITE_TYPES: SelectOption<string>[] = [
  { value: "", label: "Select a type" },
  { value: "Business / Services", label: "Business / Services" },
  { value: "Agency", label: "Agency" },
  { value: "Portfolio", label: "Portfolio" },
  { value: "Restaurant / Café", label: "Restaurant / Café" },
  { value: "Retail / Shop", label: "Retail / Shop" },
  { value: "Personal", label: "Personal" },
  { value: "Other", label: "Other" },
];

/** Mirrors the backend subdomain rule. */
const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;
const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/;
const INFO_FIELDS = new Set<string>([
  "name",
  "businessName",
  "websiteType",
  "industry",
  "contactEmail",
  "contactPhone",
  "subdomain",
  "description",
  "clientId",
]);

function validateInfo(form: InfoForm, needsClient: boolean, clientId: string): InfoErrors {
  const errors: InfoErrors = {};
  if (needsClient && !clientId) errors.clientId = "Choose the client this website is for";
  if (form.name.trim().length < 2) errors.name = "Website name must be at least 2 characters";
  if (form.contactEmail.trim()) errors.contactEmail = validateEmail(form.contactEmail);
  if (form.contactPhone.trim() && !PHONE_PATTERN.test(form.contactPhone.trim())) {
    errors.contactPhone = "Enter a valid phone number";
  }
  if (form.subdomain.trim() && !SUBDOMAIN_PATTERN.test(form.subdomain.trim())) {
    errors.subdomain = "Use 3-40 lowercase letters, numbers or hyphens";
  }
  return errors;
}

function optional(value: string): string | undefined {
  return value.trim() || undefined;
}

export default function CreateWebsitePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = user?.role === "SUPER_ADMIN";
  const backTo = isAdmin ? "/admin/websites" : "/dashboard";

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<InfoForm>({
    name: "",
    businessName: user?.client?.businessName ?? "",
    websiteType: "",
    industry: "",
    contactEmail: "",
    contactPhone: "",
    subdomain: "",
    description: "",
  });
  const [errors, setErrors] = useState<InfoErrors>({});
  const [clientId, setClientId] = useState(searchParams.get("clientId") ?? "");
  const [clients, setClients] = useState<Client[] | null>(null);

  const [templates, setTemplates] = useState<WebsiteTemplate[] | null>(null);
  const [themes, setThemes] = useState<ThemeOption[] | null>(null);
  const [category, setCategory] = useState("All");
  /** Empty = start blank. */
  const [templateKey, setTemplateKey] = useState("");
  const [themeId, setThemeId] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<WebsiteTemplate | null>(null);

  // A Super Admin sees the selected client's own templates next to the platform ones.
  const templateOwner = isAdmin ? clientId || undefined : undefined;
  useEffect(() => {
    let cancelled = false;
    websitesApi
      .templates(templateOwner)
      .then((loaded) => {
        if (cancelled) return;
        setTemplates(loaded);
        setTemplateKey((current) => (loaded.some((template) => template.key === current) ? current : ""));
      })
      .catch((err: unknown) => !cancelled && setLoadError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [templateOwner]);

  useEffect(() => {
    let cancelled = false;
    websitesApi
      .themes()
      .then((loaded) => {
        if (cancelled) return;
        setThemes(loaded);
        setThemeId((current) => current || loaded[0]?.id || "");
      })
      .catch((err: unknown) => !cancelled && setLoadError(errorMessage(err)));
    if (isAdmin) {
      adminClientsApi
        .list({ pageSize: 100 })
        .then((result) => !cancelled && setClients(result.items))
        .catch((err: unknown) => !cancelled && setLoadError(errorMessage(err)));
    }
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const selectedClient = clients?.find((client) => client.id === clientId);
  const clientLabel = isAdmin ? (selectedClient?.businessName ?? "Not selected") : (user?.client?.businessName ?? "");

  const myTemplates = (templates ?? []).filter((template) => template.isCustom);
  const selectedTemplate = templates?.find((template) => template.key === templateKey);
  const platformTemplates = useMemo(() => (templates ?? []).filter((template) => !template.isCustom), [templates]);
  const categories = useMemo(
    () => ["All", ...new Set(platformTemplates.map((template) => template.category))],
    [platformTemplates],
  );
  const visibleTemplates = platformTemplates.filter((template) => category === "All" || template.category === category);

  async function deleteTemplate(template: WebsiteTemplate) {
    setTemplateToDelete(null);
    try {
      await websitesApi.deleteTemplate(template.id);
      setTemplates((current) => current?.filter((candidate) => candidate.id !== template.id) ?? null);
      if (templateKey === template.key) setTemplateKey("");
    } catch (err) {
      setSubmitError(errorMessage(err));
    }
  }

  const clientOptions: SelectOption<string>[] = [
    { value: "", label: clients ? "Select a client" : "Loading clients…" },
    ...(clients ?? []).map((client) => ({ value: client.id, label: client.businessName })),
  ];

  function update<K extends keyof InfoForm>(key: K) {
    return (value: InfoForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  }

  function continueFromInfo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateInfo(form, isAdmin, clientId);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setStep(3);
  }

  function chooseTemplate(template: WebsiteTemplate | null) {
    setTemplateKey(template?.key ?? "");
    if (template?.isCustom) setThemeId("");
    else if (template?.themeId) setThemeId(template.themeId);
    else if (!themeId) setThemeId(themes?.[0]?.id ?? "");
  }

  async function createDraft() {
    setCreating(true);
    setSubmitError(null);
    const input: CreateWebsiteInput = {
      ...(isAdmin ? { clientId } : {}),
      name: form.name.trim(),
      ...(templateKey ? { templateKey } : {}),
      ...(themeId ? { themeId } : {}),
      subdomain: optional(form.subdomain.toLowerCase()),
      businessName: optional(form.businessName),
      websiteType: optional(form.websiteType),
      industry: optional(form.industry),
      description: optional(form.description),
      contactEmail: optional(form.contactEmail),
      contactPhone: optional(form.contactPhone),
    };
    try {
      const website = await websitesApi.create(input);
      navigate(`/websites/${website.id}/edit`, { replace: true, state: { created: true } satisfies CreatedState });
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors: InfoErrors =
          err.code === "SUBDOMAIN_TAKEN"
            ? { subdomain: err.message }
            : err.code === "CLIENT_REQUIRED" || err.code === "CLIENT_NOT_FOUND"
              ? { clientId: err.message }
              : err.fieldErrors();
        if (Object.keys(fieldErrors).some((field) => INFO_FIELDS.has(field))) {
          setErrors(fieldErrors);
          setStep(2);
        }
      }
      setSubmitError(errorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-6 py-3">
        <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
          <ArrowLeft className="size-4" aria-hidden /> {isAdmin ? "All websites" : "Back to dashboard"}
        </Link>
        <h1 className="text-sm font-semibold text-ink">Create a new website</h1>
        <p className="text-sm text-ink-body">
          Client: <span className="font-medium text-ink">{clientLabel}</span>
        </p>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Steps">
          {STEPS.map(({ step: number, label }) => {
            const done = number < step;
            const current = number === step;
            return (
              <li
                key={number}
                aria-current={current ? "step" : undefined}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  current ? "border-brand bg-brand-soft font-medium text-brand" : "border-line bg-surface text-ink-body"
                }`}
              >
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                    done ? "bg-brand text-white" : current ? "bg-brand text-white" : "bg-canvas text-ink-muted"
                  }`}
                >
                  {done ? <Check className="size-3" aria-hidden /> : number}
                </span>
                {label}
              </li>
            );
          })}
        </ol>

        {loadError && (
          <div className="mt-6">
            <FormAlert status="danger">{loadError}</FormAlert>
          </div>
        )}

        {step === 1 && (
          <section className="mt-6 rounded-xl border border-line bg-surface p-6">
            <h2 className="text-lg font-semibold text-ink">How do you want to build it?</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                aria-pressed="true"
                className="rounded-lg border-2 border-brand bg-brand-soft/40 p-5 text-left"
              >
                <span className="flex items-center justify-between">
                  <MousePointerClick className="size-5 text-brand" aria-hidden />
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white">Selected</span>
                </span>
                <span className="mt-3 block font-medium text-ink">Manual Website Builder</span>
                <span className="mt-1 block text-sm text-ink-body">
                  Build your own pages from ready-made sections, or start from a template. Change anything later.
                </span>
              </button>
              <div aria-disabled="true" className="rounded-lg border border-line p-5 opacity-70">
                <Sparkles className="size-5 text-brand" aria-hidden />
                <span className="mt-3 block font-medium text-ink">AI Website Builder</span>
                <span className="mt-1 block text-sm text-ink-body">
                  Describe your website in a prompt. AI creates an editable draft you can change any time.
                </span>
                <span className="mt-3 block font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  Coming soon
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onPress={() => setStep(2)}>Continue: website info</Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <form onSubmit={continueFromInfo} noValidate className="mt-6 rounded-xl border border-line bg-surface p-6">
            <h2 className="text-lg font-semibold text-ink">Website information</h2>
            <p className="mt-1 text-sm text-ink-body">You can change all of this later in website settings.</p>

            {isAdmin && (
              <div className="mt-5 max-w-sm">
                <SelectInput label="Client" value={clientId} onChange={setClientId} options={clientOptions} />
                {errors.clientId && <p className="mt-1 text-xs text-danger">{errors.clientId}</p>}
              </div>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <TextInput
                label="Website name"
                name="name"
                value={form.name}
                onChange={update("name")}
                error={errors.name}
                placeholder="e.g. Main website"
                autoFocus
              />
              <TextInput
                label="Business name"
                name="businessName"
                value={form.businessName}
                onChange={update("businessName")}
                error={errors.businessName}
                description="Shown in the header and footer."
              />
              <SelectInput label="Website type" value={form.websiteType} onChange={update("websiteType")} options={WEBSITE_TYPES} />
              <TextInput label="Industry" name="industry" value={form.industry} onChange={update("industry")} error={errors.industry} />
              <TextInput
                label="Contact email"
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={update("contactEmail")}
                error={errors.contactEmail}
              />
              <TextInput
                label="Contact phone"
                name="contactPhone"
                type="tel"
                placeholder="+91"
                value={form.contactPhone}
                onChange={update("contactPhone")}
                error={errors.contactPhone}
              />
              <div className="sm:col-span-3">
                <TextInput
                  label="Preferred address (optional)"
                  name="subdomain"
                  value={form.subdomain}
                  onChange={update("subdomain")}
                  error={errors.subdomain}
                  placeholder="e.g. bloom-florist"
                  description="Your free default address. Leave empty to generate one from the website name. Custom domains can be added later."
                />
              </div>
              <div className="sm:col-span-3">
                <TextAreaInput
                  label="Business description"
                  name="description"
                  value={form.description}
                  onChange={update("description")}
                  error={errors.description}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-2">
              <Button variant="outline" onPress={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit">Continue: starting point</Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <section className="mt-6 rounded-xl border border-line bg-surface p-6">
            <h2 className="text-lg font-semibold text-ink">How do you want to start?</h2>
            <p className="mt-1 text-sm text-ink-body">
              Build your own design from our ready-made sections, or start from a template and change it.
            </p>

            {submitError && (
              <div className="mt-5">
                <FormAlert status="danger">{submitError}</FormAlert>
              </div>
            )}

            <button
              type="button"
              aria-pressed={templateKey === ""}
              onClick={() => chooseTemplate(null)}
              className={`mt-5 flex w-full items-center gap-4 rounded-lg border-2 p-5 text-left transition-colors ${
                templateKey === "" ? "border-brand bg-brand-soft/40" : "border-line hover:border-line-strong"
              }`}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-lg border-2 border-dashed border-line-strong bg-surface">
                <LayoutTemplate className="size-5 text-brand" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-2 font-medium text-ink">
                  Start blank and build my own design
                  <span className="rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink-body">Recommended</span>
                </span>
                <span className="mt-1 block text-sm text-ink-body">
                  You get an empty home page. Add sections like hero, services, gallery and contact from the component
                  library, then edit the text, images and layout.
                </span>
              </span>
              {templateKey === "" && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white">Selected</span>
              )}
            </button>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-ink">Colour style</h3>
              <p className="mt-0.5 text-sm text-ink-body">Colours and fonts for every section. You can fine-tune them in the editor.</p>
              <div role="radiogroup" aria-label="Colour style" className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {selectedTemplate?.isCustom && (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeId === ""}
                    onClick={() => setThemeId("")}
                    className={`rounded-lg border-2 p-3 text-left transition-colors ${
                      themeId === "" ? "border-brand" : "border-line hover:border-line-strong"
                    }`}
                  >
                    <span className="grid h-14 place-items-center rounded-md border border-dashed border-line-strong text-xs text-ink-body">
                      Saved with the template
                    </span>
                    <span className="mt-2 block text-sm font-medium text-ink">Template’s own colours</span>
                  </button>
                )}
                {(themes ?? []).map((theme) => {
                  const selected = theme.id === themeId;
                  const { colors } = theme.settings;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setThemeId(theme.id)}
                      className={`rounded-lg border-2 p-3 text-left transition-colors ${
                        selected ? "border-brand" : "border-line hover:border-line-strong"
                      }`}
                    >
                      <span
                        className="flex h-14 items-end gap-1.5 rounded-md border border-black/5 p-2"
                        style={{ background: colors.background }}
                        aria-hidden
                      >
                        <span className="h-6 w-10 rounded" style={{ background: colors.primary }} />
                        <span className="h-4 w-6 rounded" style={{ background: colors.secondary }} />
                        <span className="h-3 flex-1 rounded" style={{ background: colors.surface }} />
                      </span>
                      <span className="mt-2 block text-sm font-medium text-ink">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {myTemplates.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-ink">My templates</h3>
                <p className="mt-0.5 text-sm text-ink-body">Designs saved from your websites.</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {myTemplates.map((template) => {
                    const selected = template.key === templateKey;
                    return (
                      <div
                        key={template.id}
                        className={`relative flex items-start gap-2 rounded-lg border-2 p-4 transition-colors ${
                          selected ? "border-brand bg-brand-soft/40" : "border-line hover:border-line-strong"
                        }`}
                      >
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => chooseTemplate(template)}
                          className="min-w-0 flex-1 text-left after:absolute after:inset-0"
                        >
                          <span className="flex items-center gap-2 font-medium text-ink">
                            {template.name}
                            {selected && (
                              <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white">Selected</span>
                            )}
                          </span>
                          {template.description && <span className="mt-1 block text-sm text-ink-body">{template.description}</span>}
                          <span className="mt-2 block text-xs text-ink-muted">
                            Pages: {template.pages.map((page) => page.name).join(", ")}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTemplateToDelete(template)}
                          aria-label={`Delete template ${template.name}`}
                          title="Delete template"
                          className="relative z-10 grid size-8 shrink-0 place-items-center rounded text-ink-muted hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">Or start from a template (optional)</h3>
                <p className="mt-0.5 text-sm text-ink-body">Pre-filled pages you can fully change, reorder or delete.</p>
              </div>
              <div role="group" aria-label="Template category" className="flex flex-wrap gap-1">
                {categories.map((name) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={category === name}
                    onClick={() => setCategory(name)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      category === name ? "bg-ink text-white" : "bg-canvas text-ink-body hover:text-ink"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {!templates && !loadError && (
              <div className="grid place-items-center py-16">
                <Spinner aria-label="Loading templates" />
              </div>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTemplates.map((template) => {
                const selected = template.key === templateKey;
                return (
                  <button
                    key={template.key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseTemplate(template)}
                    className={`flex flex-col overflow-hidden rounded-lg border-2 text-left transition-colors ${
                      selected ? "border-brand" : "border-line hover:border-line-strong"
                    }`}
                  >
                    <span className="flex aspect-[16/9] w-full flex-col gap-1.5 bg-canvas p-4" aria-hidden>
                      <span className="h-2 w-1/3 rounded bg-line-strong" />
                      <span className="mt-2 h-3 w-3/4 rounded bg-ink/70" />
                      <span className="h-2 w-1/2 rounded bg-line-strong" />
                      <span className="mt-auto grid grid-cols-3 gap-1.5">
                        <span className="h-6 rounded bg-surface" />
                        <span className="h-6 rounded bg-surface" />
                        <span className="h-6 rounded bg-surface" />
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col p-4">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-ink">{template.name}</span>
                        {selected && (
                          <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white">Selected</span>
                        )}
                      </span>
                      {template.description && <span className="mt-1 text-sm text-ink-body">{template.description}</span>}
                      <span className="mt-2 text-xs text-ink-muted">
                        Pages: {template.pages.map((page) => page.name).join(", ")}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <Button variant="outline" onPress={() => setStep(2)} isDisabled={creating}>
                Back
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink-body">
                  {selectedTemplate ? `Template: ${selectedTemplate.name}` : "Blank website"}
                </span>
                <Button onPress={createDraft} isPending={creating} isDisabled={!themes}>
                  Create and open editor
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      <ConfirmDialog
        isOpen={templateToDelete !== null}
        title={`Delete “${templateToDelete?.name ?? ""}”?`}
        confirmLabel="Delete template"
        tone="danger"
        onConfirm={() => templateToDelete && void deleteTemplate(templateToDelete)}
        onCancel={() => setTemplateToDelete(null)}
      >
        The template is removed from My templates. Websites already created from it are not changed.
      </ConfirmDialog>
    </div>
  );
}
