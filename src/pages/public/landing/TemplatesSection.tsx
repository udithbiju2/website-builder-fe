import { useMemo, useState } from "react";
import { Button, Card, Chip } from "@heroui/react";

const categories = ["All", "Business", "Agency", "Portfolio", "Landing page"] as const;
type Category = (typeof categories)[number];
type TemplateCategory = Exclude<Category, "All">;

type Template = {
  name: string;
  category: TemplateCategory;
  pages: readonly string[];
};

const templates: readonly Template[] = [
  { name: "Business Classic", category: "Business", pages: ["Home", "About", "Services", "Contact"] },
  { name: "Agency Modern", category: "Agency", pages: ["Home", "About", "Services", "Portfolio", "Contact"] },
  { name: "Local Services", category: "Business", pages: ["Home", "Services", "Contact"] },
  { name: "Consultant", category: "Business", pages: ["Home", "About", "Blog", "Contact"] },
  { name: "Single Landing Page", category: "Landing page", pages: ["Landing page"] },
  { name: "Portfolio Minimal", category: "Portfolio", pages: ["Home", "Portfolio", "About", "Contact"] },
];

function TemplateThumbnail() {
  return (
    <div aria-hidden className="space-y-2 rounded-lg bg-canvas p-4">
      <div className="flex items-center justify-between">
        <div className="h-2 w-10 rounded bg-line-strong" />
        <div className="flex gap-1.5">
          <div className="h-1.5 w-5 rounded bg-line-strong" />
          <div className="h-1.5 w-5 rounded bg-line-strong" />
          <div className="h-1.5 w-5 rounded bg-line-strong" />
        </div>
      </div>
      <div className="h-14 rounded-md bg-brand-soft" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-8 rounded bg-surface" />
        <div className="h-8 rounded bg-surface" />
        <div className="h-8 rounded bg-surface" />
      </div>
    </div>
  );
}

export default function TemplatesSection() {
  const [active, setActive] = useState<Category>("All");

  const visible = useMemo(
    () => (active === "All" ? templates : templates.filter((t) => t.category === active)),
    [active],
  );

  return (
    <section id="templates" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Start from a template
            </h2>
            <p className="mt-2 max-w-xl text-ink-body">
              A template only sets the starting pages and section layout. Theme, content and pages
              can all be changed later.
            </p>
          </div>
          <div role="group" aria-label="Filter templates" className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={active === category ? "primary" : "outline"}
                aria-pressed={active === category}
                onPress={() => setActive(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((template) => (
            <Card key={template.name} className="border border-line bg-surface shadow-none">
              <TemplateThumbnail />
              <Card.Header className="gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Card.Title className="font-semibold text-ink">{template.name}</Card.Title>
                  <Chip size="sm" variant="soft">
                    {template.category}
                  </Chip>
                </div>
                <Card.Description className="text-sm text-ink-body">
                  Pages: {template.pages.join(", ")}
                </Card.Description>
              </Card.Header>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
