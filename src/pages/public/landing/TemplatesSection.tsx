import { useEffect, useMemo, useState } from "react";
import { Button, Card, Chip } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { templatesApi, type WebsiteTemplate } from "../../../api/websites.ts";
import TemplateThumbnail from "../../../components/websites/TemplateThumbnail.tsx";

const ALL = "All";

export default function TemplatesSection() {
  const [templates, setTemplates] = useState<WebsiteTemplate[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(ALL);

  useEffect(() => {
    let cancelled = false;
    templatesApi
      .list()
      .then((loaded) => !cancelled && setTemplates(loaded))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => [ALL, ...new Set((templates ?? []).map((template) => template.category))],
    [templates],
  );
  const visible = (templates ?? []).filter((template) => active === ALL || template.category === active);

  if (failed || templates?.length === 0) return null;

  return (
    <section id="templates" className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Start from a template</h2>
            <p className="mt-2 max-w-xl text-ink-body">
              Professionally designed starting points. Open one to explore every page, then make it yours.
            </p>
          </div>
          {categories.length > 2 && (
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
          )}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates === null
            ? Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-line bg-surface" aria-hidden>
                  <div className="aspect-[16/10] animate-pulse bg-canvas" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-canvas" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-canvas" />
                  </div>
                </div>
              ))
            : visible.map((template) => (
                <Card
                  key={template.key}
                  className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-0 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg has-[:focus-visible]:border-brand"
                >
                  <TemplateThumbnail template={template} className="border-b border-line" />
                  <Card.Header className="gap-1.5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Card.Title className="font-semibold text-ink">
                        <Link to={`/templates/${template.key}`} className="outline-none after:absolute after:inset-0">
                          {template.name}
                        </Link>
                      </Card.Title>
                      <Chip size="sm" variant="soft">
                        {template.category}
                      </Chip>
                    </div>
                    <Card.Description className="text-sm text-ink-body">
                      {template.pages.map((page) => page.name).join(" · ")}
                    </Card.Description>
                    <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand">
                      View template
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Card.Header>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
