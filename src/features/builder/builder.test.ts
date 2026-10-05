import { describe, expect, it } from "vitest";
import type { WebsitePage } from "../../api/websites.ts";
import type { EditorDraft } from "../../pages/websites/editor/editor-state.ts";
import { createSection } from "../../site-kit/index.ts";
import { collectAssets } from "./assets.ts";
import { planSave } from "./autosave/save-plan.ts";
import { SerialSaver } from "./autosave/serial-saver.ts";
import { EditorDataError, itemAsSection, puckDataToSections, sectionsToPuckData } from "./puck/adapter.ts";
import { aiSuggestionSchema, puckContentSchema } from "./schema/editor-document.ts";

function page(id: string, overrides: Partial<WebsitePage> = {}): WebsitePage {
  return {
    id,
    name: `Page ${id}`,
    slug: id === "home" ? "/" : `/${id}`,
    pageType: id === "home" ? "HOME" : "CUSTOM",
    visible: true,
    showInNav: true,
    seoTitle: null,
    seoDescription: null,
    sections: [],
    ...overrides,
  };
}

function draft(pages: WebsitePage[]): EditorDraft {
  return {
    theme: {} as EditorDraft["theme"],
    header: { logo: { url: "https://cdn.example.com/logo.png", alt: "Logo" } } as unknown as EditorDraft["header"],
    footer: {} as EditorDraft["footer"],
    pages,
  };
}

describe("puck adapter", () => {
  it("round-trips sections through Puck data unchanged", () => {
    const sections = [createSection("hero"), { ...createSection("pricing"), hidden: true }];
    const data = sectionsToPuckData(sections);
    expect(data.content).toHaveLength(2);
    expect(puckDataToSections(data)).toEqual(sections);
    expect(itemAsSection(data.content[1]!)).toEqual(sections[1]);
  });

  it("rejects content that isn't a known section", () => {
    const bad = { content: [{ type: "script", props: { id: "x", hidden: false, settings: { background: "default", hideOnMobile: false }, data: {} } }] };
    expect(() => puckDataToSections(bad)).toThrow(EditorDataError);
  });

  it("rejects more sections than a page allows", () => {
    const item = sectionsToPuckData([createSection("text")]).content[0]!;
    expect(puckContentSchema.safeParse(Array.from({ length: 61 }, () => item)).success).toBe(false);
  });
});

describe("planSave", () => {
  const home = page("home", { sections: [createSection("hero")] });
  const about = page("about");
  const saved = draft([home, about]);

  it("does nothing when nothing changed", () => {
    expect(planSave(saved, saved).kind).toBe("none");
    expect(planSave(saved, structuredClone(saved)).kind).toBe("none");
  });

  it("uses the page endpoint when only one page's sections changed", () => {
    const next = draft([{ ...home, sections: [...home.sections, createSection("cta")] }, about]);
    const plan = planSave(saved, next);
    expect(plan).toMatchObject({ kind: "page", pageId: "home", pageIndex: 0 });
  });

  it("saves the whole draft for metadata, structure or site-wide changes", () => {
    expect(planSave(saved, draft([{ ...home, name: "Start" }, about])).kind).toBe("draft");
    expect(planSave(saved, draft([home])).kind).toBe("draft");
    expect(planSave(saved, { ...saved, footer: { copyright: "x" } as unknown as EditorDraft["footer"] }).kind).toBe("draft");
    const twoPages = draft([
      { ...home, sections: [] },
      { ...about, sections: [createSection("faq")] },
    ]);
    expect(planSave(saved, twoPages).kind).toBe("draft");
  });
});

describe("SerialSaver", () => {
  it("runs one save at a time and skips superseded values", async () => {
    const runs: number[] = [];
    let release: () => void = () => undefined;
    const saver = new SerialSaver<number>(async (value) => {
      runs.push(value);
      if (value === 1) await new Promise<void>((resolve) => (release = resolve));
    });
    const first = saver.submit(1);
    void saver.submit(2);
    const last = saver.submit(3);
    expect(saver.busy).toBe(true);
    release();
    await Promise.all([first, last]);
    expect(runs).toEqual([1, 3]);
    expect(saver.busy).toBe(false);
  });

  it("rejects when a save fails and recovers on the next submit", async () => {
    let fail = true;
    const saver = new SerialSaver<string>(async () => {
      if (fail) throw new Error("network");
    });
    await expect(saver.submit("a")).rejects.toThrow("network");
    fail = false;
    await expect(saver.submit("b")).resolves.toBeUndefined();
  });
});

describe("collectAssets", () => {
  it("lists each image once with every place it's used", () => {
    const gallery = createSection("gallery");
    const pages = [page("home", { sections: [gallery] }), page("about", { sections: [structuredClone(gallery)] })];
    const assets = collectAssets(draft(pages));
    const logo = assets.find((asset) => asset.url === "https://cdn.example.com/logo.png");
    expect(logo?.usedOn).toEqual(["Header"]);
    for (const asset of assets.filter((candidate) => candidate !== logo)) {
      expect(asset.usedOn).toEqual(["Page home", "Page about"]);
    }
  });
});

describe("aiSuggestionSchema", () => {
  it("requires a target scope and typed before/after sections", () => {
    const section = createSection("cta");
    const valid = { id: "s1", prompt: "Shorter", summary: "Shortened the copy", target: { scope: "section", sectionId: section.id }, before: [section], after: [section] };
    expect(aiSuggestionSchema.safeParse(valid).success).toBe(true);
    expect(aiSuggestionSchema.safeParse({ ...valid, target: { scope: "site" } }).success).toBe(false);
    expect(aiSuggestionSchema.safeParse({ ...valid, after: [{ ...section, type: "iframe" }] }).success).toBe(false);
  });
});
