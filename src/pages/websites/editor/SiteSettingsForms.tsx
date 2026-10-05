import { useState } from "react";
import type { ThemeOption, WebsitePage } from "../../../api/websites.ts";
import type { FontKey, FooterData, HeaderData, LinkRef, ThemeSettings } from "../../../site-kit/index.ts";
import { LIMITS, menuFromPages, PAGE_SLUG_PATTERN, type PageMetaPatch } from "./editor-state.ts";
import {
  CheckboxField,
  ColorField,
  FormGroup,
  ImageField,
  ItemList,
  LinkField,
  OptionalLinkField,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields.tsx";

const linkTitle = (link: LinkRef) => link.label;
const newLink = (): LinkRef => ({ label: "New link", href: "/" });
const renderLink = (link: LinkRef, update: (link: LinkRef) => void) => <LinkField label="Link" value={link} onChange={update} />;

export function HeaderForm({
  header,
  pages,
  onChange,
}: {
  header: HeaderData;
  pages: WebsitePage[];
  onChange: (header: HeaderData) => void;
}) {
  return (
    <>
      <FormGroup title="Header">
        <SelectField
          label="Design"
          value={header.design}
          options={[
            { value: "logo-left", label: "Logo left, menu right" },
            { value: "centered", label: "Logo and menu centered" },
          ]}
          onChange={(design) => onChange({ ...header, design })}
        />
        <TextField label="Site name" value={header.siteName} onChange={(siteName) => onChange({ ...header, siteName })} maxLength={120} required />
        <CheckboxField label="Stay at the top when scrolling" checked={header.sticky} onChange={(sticky) => onChange({ ...header, sticky })} />
        <TextField
          label="Announcement bar"
          value={header.announcement}
          onChange={(announcement) => onChange({ ...header, announcement })}
          maxLength={200}
          hint="Optional short message above the header."
        />
      </FormGroup>
      <FormGroup title="Logo">
        <ImageField label="Logo" value={header.logo} onChange={(logo) => onChange({ ...header, logo })} optional />
      </FormGroup>
      <FormGroup title="Menu">
        <button
          type="button"
          onClick={() => onChange({ ...header, menu: menuFromPages(pages) })}
          className="self-start text-xs text-brand hover:underline"
        >
          Rebuild menu from my pages
        </button>
        <ItemList
          label="Menu links"
          items={header.menu}
          max={LIMITS.menuLinks}
          onChange={(menu) => onChange({ ...header, menu })}
          create={newLink}
          itemTitle={linkTitle}
          renderItem={renderLink}
          addLabel="Add menu link"
        />
        <OptionalLinkField
          label="Header button"
          value={header.cta}
          onChange={(cta) => onChange({ ...header, cta })}
          fallback={{ label: "Contact us", href: "/contact" }}
        />
      </FormGroup>
    </>
  );
}

export function FooterForm({ footer, onChange }: { footer: FooterData; onChange: (footer: FooterData) => void }) {
  const contact = footer.contact ?? {};
  const updateContact = (patch: Partial<NonNullable<FooterData["contact"]>>) => {
    const next = { ...contact, ...patch };
    const hasAny = Object.values(next).some((value) => value?.trim());
    onChange({ ...footer, contact: hasAny ? next : undefined });
  };
  return (
    <>
      <FormGroup title="Footer">
        <SelectField
          label="Design"
          value={footer.design}
          options={[
            { value: "columns", label: "Columns of links" },
            { value: "simple", label: "Simple one line" },
          ]}
          onChange={(design) => onChange({ ...footer, design })}
        />
        <TextField label="Site name" value={footer.siteName} onChange={(siteName) => onChange({ ...footer, siteName })} maxLength={120} required />
        <TextAreaField label="Short description" value={footer.description} onChange={(description) => onChange({ ...footer, description })} maxLength={500} rows={2} />
        <TextField label="Copyright line" value={footer.copyright} onChange={(copyright) => onChange({ ...footer, copyright })} maxLength={200} />
      </FormGroup>
      {footer.design === "columns" && (
        <FormGroup title="Link columns">
          <ItemList
            label="Columns"
            items={footer.columns}
            max={4}
            onChange={(columns) => onChange({ ...footer, columns })}
            create={() => ({ title: "Links", links: [] })}
            itemTitle={(column) => column.title}
            addLabel="Add column"
            renderItem={(column, update) => (
              <>
                <TextField label="Column title" value={column.title} onChange={(title) => update({ ...column, title })} maxLength={60} required />
                <ItemList
                  label="Links"
                  items={column.links}
                  max={12}
                  onChange={(links) => update({ ...column, links })}
                  create={newLink}
                  itemTitle={linkTitle}
                  renderItem={renderLink}
                  addLabel="Add link"
                />
              </>
            )}
          />
        </FormGroup>
      )}
      <FormGroup title="Contact">
        <TextField label="Email" type="email" value={contact.email} onChange={(email) => updateContact({ email })} maxLength={255} />
        <TextField label="Phone" type="tel" value={contact.phone} onChange={(phone) => updateContact({ phone })} maxLength={32} />
        <TextAreaField label="Address" value={contact.address} onChange={(address) => updateContact({ address })} maxLength={500} rows={2} />
      </FormGroup>
      <FormGroup title="Social links">
        <ItemList
          label="Social"
          items={footer.social}
          max={10}
          onChange={(social) => onChange({ ...footer, social })}
          create={() => ({ label: "Instagram", href: "https://instagram.com/" })}
          itemTitle={linkTitle}
          renderItem={renderLink}
          addLabel="Add social link"
        />
      </FormGroup>
    </>
  );
}

const FONT_OPTIONS: { value: FontKey; label: string }[] = [
  { value: "plex-sans", label: "Modern sans" },
  { value: "system", label: "Clean system" },
  { value: "serif", label: "Classic serif" },
  { value: "mono", label: "Monospace" },
];

const COLOR_LABELS: [keyof ThemeSettings["colors"], string][] = [
  ["primary", "Primary"],
  ["secondary", "Secondary"],
  ["background", "Background"],
  ["surface", "Tinted background"],
  ["text", "Text"],
  ["muted", "Soft text"],
];

export function ThemeForm({
  theme,
  presets,
  onChange,
}: {
  theme: ThemeSettings;
  presets: ThemeOption[];
  onChange: (theme: ThemeSettings) => void;
}) {
  return (
    <>
      {presets.length > 0 && (
        <FormGroup title="Colour styles">
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => {
              const { colors } = preset.settings;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onChange(preset.settings)}
                  className="rounded-md border border-line p-1.5 text-left hover:border-brand"
                >
                  <span className="flex h-7 items-end gap-1 rounded p-1" style={{ background: colors.background }} aria-hidden>
                    <span className="h-4 w-6 rounded-sm" style={{ background: colors.primary }} />
                    <span className="h-3 w-3 rounded-sm" style={{ background: colors.secondary }} />
                  </span>
                  <span className="mt-1 block truncate text-xs text-ink">{preset.name}</span>
                </button>
              );
            })}
          </div>
        </FormGroup>
      )}
      <FormGroup title="Colours">
        {COLOR_LABELS.map(([key, label]) => (
          <ColorField
            key={key}
            label={label}
            value={theme.colors[key]}
            onChange={(value) => onChange({ ...theme, colors: { ...theme.colors, [key]: value } })}
          />
        ))}
      </FormGroup>
      <FormGroup title="Fonts">
        <SelectField label="Headings" value={theme.fonts.heading} options={FONT_OPTIONS} onChange={(heading) => onChange({ ...theme, fonts: { ...theme.fonts, heading } })} />
        <SelectField label="Body text" value={theme.fonts.body} options={FONT_OPTIONS} onChange={(body) => onChange({ ...theme, fonts: { ...theme.fonts, body } })} />
      </FormGroup>
      <FormGroup title="Style">
        <SelectField
          label="Buttons"
          value={theme.buttonStyle}
          options={[
            { value: "filled", label: "Filled" },
            { value: "outline", label: "Outline" },
          ]}
          onChange={(buttonStyle) => onChange({ ...theme, buttonStyle })}
        />
        <SelectField
          label="Cards"
          value={theme.cardStyle}
          options={[
            { value: "border", label: "Border" },
            { value: "shadow", label: "Shadow" },
            { value: "flat", label: "Flat" },
          ]}
          onChange={(cardStyle) => onChange({ ...theme, cardStyle })}
        />
        <SelectField
          label="Corners"
          value={theme.radius}
          options={[
            { value: "none", label: "Square" },
            { value: "sm", label: "Slightly rounded" },
            { value: "md", label: "Rounded" },
            { value: "lg", label: "Very rounded" },
          ]}
          onChange={(radius) => onChange({ ...theme, radius })}
        />
        <SelectField
          label="Spacing between sections"
          value={theme.sectionSpacing}
          options={[
            { value: "compact", label: "Compact" },
            { value: "normal", label: "Normal" },
            { value: "relaxed", label: "Relaxed" },
          ]}
          onChange={(sectionSpacing) => onChange({ ...theme, sectionSpacing })}
        />
        <SelectField
          label="Content width"
          value={theme.containerWidth}
          options={[960, 1120, 1200, 1320, 1440].map((value) => ({ value, label: `${value}px` }))}
          onChange={(containerWidth) => onChange({ ...theme, containerWidth })}
        />
      </FormGroup>
    </>
  );
}

function SlugField({ page, pages, onCommit }: { page: WebsitePage; pages: WebsitePage[]; onCommit: (slug: string) => void }) {
  const [text, setText] = useState(page.slug);
  const [lastSlug, setLastSlug] = useState(page.slug);
  if (page.slug !== lastSlug) {
    setLastSlug(page.slug);
    setText(page.slug);
  }
  const normalized = text.trim().toLowerCase();
  const error = !PAGE_SLUG_PATTERN.test(normalized) || normalized === "/"
    ? 'Use "/" followed by lowercase words, e.g. /about-us'
    : pages.some((other) => other.id !== page.id && other.slug === normalized)
      ? "Another page already uses this URL"
      : undefined;

  function commit() {
    if (!error && normalized !== page.slug) onCommit(normalized);
  }

  return (
    <div
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") commit();
      }}
    >
      <TextField
        label="Page URL"
        value={text}
        onChange={setText}
        maxLength={160}
        error={text !== page.slug ? error : undefined}
        hint="Links and menu items pointing to this page update automatically."
      />
    </div>
  );
}

export function PageForm({
  page,
  pages,
  onChange,
}: {
  page: WebsitePage;
  pages: WebsitePage[];
  onChange: (patch: PageMetaPatch) => void;
}) {
  const isHome = page.slug === "/";
  return (
    <>
      <FormGroup title="Page">
        <TextField label="Page name" value={page.name} onChange={(name) => onChange({ name })} maxLength={120} required />
        {isHome ? (
          <p className="text-xs text-ink-muted">This is your home page. Its URL is always “/”.</p>
        ) : (
          <SlugField page={page} pages={pages} onCommit={(slug) => onChange({ slug })} />
        )}
        <CheckboxField label="Show in header menu" checked={page.showInNav} onChange={(showInNav) => onChange({ showInNav })} />
        {!isHome && (
          <CheckboxField
            label="Page is visible"
            checked={page.visible}
            onChange={(visible) => onChange({ visible })}
            hint="Hidden pages stay in your draft but won't be published."
          />
        )}
      </FormGroup>
      <FormGroup title="Search engines (SEO)">
        <TextField
          label="SEO title"
          value={page.seoTitle ?? ""}
          onChange={(seoTitle) => onChange({ seoTitle })}
          maxLength={160}
          hint="Shown as the title in Google results. Defaults to the page name."
        />
        <TextAreaField
          label="SEO description"
          value={page.seoDescription ?? ""}
          onChange={(seoDescription) => onChange({ seoDescription })}
          maxLength={320}
          rows={3}
        />
      </FormGroup>
    </>
  );
}
