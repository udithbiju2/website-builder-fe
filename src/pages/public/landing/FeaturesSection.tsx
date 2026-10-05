import { Card } from "@heroui/react";
import { Globe, LayoutPanelLeft, Sparkles, type LucideIcon } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const features: readonly Feature[] = [
  {
    title: "Manual builder",
    description: "Themes, templates, headers, footers, sections and blocks you can edit without code.",
    icon: LayoutPanelLeft,
  },
  {
    title: "AI builder",
    description: "Describe your business and get an editable website draft. Ask for changes in plain words.",
    icon: Sparkles,
  },
  {
    title: "Preview and publish",
    description: "Check desktop, tablet and mobile, save drafts, then publish to your own domain.",
    icon: Globe,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Everything you need in one place
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="border border-line bg-surface shadow-none">
              <Card.Header className="gap-3">
                <Icon className="size-5 text-brand" aria-hidden />
                <Card.Title className="text-base font-semibold text-ink">{title}</Card.Title>
                <Card.Description className="text-sm leading-relaxed text-ink-body">
                  {description}
                </Card.Description>
              </Card.Header>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
