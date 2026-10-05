import { Button } from "@heroui/react";
import { MousePointerClick, Plus, Sparkles, type LucideIcon } from "lucide-react";
import { useAuth } from "../../auth/auth-context.ts";
import PageHeader from "../../components/app/PageHeader.tsx";

type BuilderOption = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const BUILDER_OPTIONS: BuilderOption[] = [
  {
    title: "Manual builder",
    description: "Pick a template and edit every section yourself.",
    icon: MousePointerClick,
  },
  {
    title: "AI builder",
    description: "Describe your business and get a ready-to-edit first draft.",
    icon: Sparkles,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="px-6 py-8 sm:px-8">
      <PageHeader
        title={`Welcome, ${user?.fullName ?? ""}`}
        description="Your websites. Only your account can see these."
        actions={
          <Button isDisabled>
            <Plus className="size-4" aria-hidden /> Create website
          </Button>
        }
      />

      <section className="mt-8 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
          <Plus className="size-6" aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-ink">Create your first website</h2>
        <p className="mt-1 text-sm text-ink-body">Choose how you'd like to start. You can switch later.</p>

        <div className="mx-auto mt-7 grid max-w-2xl gap-4 sm:grid-cols-2">
          {BUILDER_OPTIONS.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-line p-5 text-left">
              <Icon className="size-5 text-brand" aria-hidden />
              <p className="mt-3 font-medium text-ink">{title}</p>
              <p className="mt-1 text-sm text-ink-body">{description}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">Coming soon</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
