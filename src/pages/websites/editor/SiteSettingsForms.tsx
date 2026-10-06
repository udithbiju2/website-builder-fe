import { useState } from "react";
import type { ThemeOption, WebsitePage } from "../../../api/websites.ts";
import {
  DEFAULT_FONT,
  isFontKey,
  type FooterData,
  type HeaderData,
  type HeaderMenuItem,
  type HeaderSubMenuItem,
  type LinkRef,
  type ThemeSettings,
} from "../../../site-kit/index.ts";
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
import { FontPicker } from "./FontPicker.tsx";

const linkTitle = (link: { label: string }) => link.label;
const newLink = (): LinkRef => ({ label: "Link", href: "/" });
const renderLink = (item: LinkRef, update: (item: LinkRef) => void) => (
  <LinkField label="Link" value={item} onChange={update} />
);
const newMenuItem = (): HeaderMenuItem => ({ label: "New link", href: "/" });
const newSubMenuItem = (): HeaderSubMenuItem => ({ label: "Submenu item", href: "/" });

function MenuItemEditor({
  item,
  onChange,
}: {
  item: HeaderMenuItem;
  onChange: (item: HeaderMenuItem) => void;
}) {
  const [showSubmenu, setShowSubmenu] = useState(() => (item.children?.length ?? 0) > 0);

  return (
    <div className="flex flex-col gap-2.5">
      <LinkField label="Link" value={item} onChange={(patch) => onChange({ ...item, ...patch })} />
      <TextField
        label="Badge (optional)"
        value={item.badge ?? ""}
        onChange={(badge) => onChange({ ...item, badge: badge.trim() || undefined })}
        maxLength={20}
        placeholder="New, Pro, Hot..."
      />

      <div className="pt-1">
        <CheckboxField
          label="Enable dropdown submenu"
          checked={showSubmenu}
          onChange={(enabled) => {
            setShowSubmenu(enabled);
            if (!enabled) {
              onChange({ ...item, children: undefined });
            } else if (!item.children || item.children.length === 0) {
              onChange({ ...item, children: [newSubMenuItem()] });
            }
          }}
        />
      </div>

      {showSubmenu && (
        <div className="rounded-md border border-ed-border/80 bg-ed-subtle/40 p-2">
          <ItemList
            label="Dropdown items"
            items={item.children ?? []}
            max={12}
            onChange={(children) => onChange({ ...item, children })}
            create={newSubMenuItem}
            itemTitle={(sub) => sub.label}
            addLabel="Add dropdown item"
            renderItem={(sub, update) => (
              <div className="flex flex-col gap-2">
                <LinkField label="Submenu link" value={sub} onChange={(patch) => update({ ...sub, ...patch })} />
                <TextField
                  label="Description (optional)"
                  value={sub.description ?? ""}
                  onChange={(description) => update({ ...sub, description: description.trim() || undefined })}
                  maxLength={100}
                  placeholder="Short subtext under item"
                />
                <TextField
                  label="Badge (optional)"
                  value={sub.badge ?? ""}
                  onChange={(badge) => update({ ...sub, badge: badge.trim() || undefined })}
                  maxLength={20}
                  placeholder="New, Hot..."
                />
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

export function HeaderForm({
  header,
  pages = [],
  onChange,
}: {
  header: HeaderData;
  pages?: WebsitePage[];
  onChange: (header: HeaderData) => void;
}) {
  return (
    <>
      <FormGroup title="Header design & layout">
        <SelectField
          label="Design layout"
          value={header.design}
          options={[
            { value: "classical", label: "Classical (Logo left, nav center, dual buttons)" },
            { value: "minimalist", label: "Minimalist (Nav left, centered logo, CTA right)" },
            { value: "comprehensive", label: "Comprehensive (Mega nav, CTA buttons)" },
            { value: "floating", label: "Floating pill (Blurred floating island)" },
            { value: "transparent", label: "Transparent overlay (Hero overlay)" },
            { value: "logo-left", label: "Standard (Logo left, nav right)" },
            { value: "centered", label: "Standard (Logo & nav centered)" },
          ]}
          onChange={(design) => onChange({ ...header, design: design as HeaderData["design"] })}
        />
        <SelectField
          label="Position & behavior"
          value={header.position ?? (header.sticky ? "sticky" : "static")}
          options={[
            { value: "static", label: "Static (Scrolls with page)" },
            { value: "sticky", label: "Sticky (Stays at top while scrolling)" },
            { value: "fixed", label: "Fixed (Fixed at top of screen)" },
            { value: "floating", label: "Floating (Floating island bar)" },
          ]}
          onChange={(position) =>
            onChange({
              ...header,
              position: position as HeaderData["position"],
              sticky: position === "sticky" || position === "floating",
            })
          }
        />
        <TextField
          label="Site name / Brand"
          value={header.siteName}
          onChange={(siteName) => onChange({ ...header, siteName })}
          maxLength={120}
          required
        />
        <TextField
          label="Announcement bar"
          value={header.announcement ?? ""}
          onChange={(announcement) => onChange({ ...header, announcement: announcement || undefined })}
          maxLength={200}
          hint="Optional banner message displayed above the header."
        />
      </FormGroup>

      <FormGroup title="Logo & Brand display">
        <SelectField
          label="Logo & brand layout"
          value={header.logoDisplay ?? "auto"}
          options={[
            { value: "auto", label: "Smart / Auto (Logo if uploaded, else Brand text)" },
            { value: "logo_left", label: "Logo + Name (Logo on left, Name on right)" },
            { value: "logo_right", label: "Logo + Name (Name on left, Logo on right)" },
            { value: "logo_top", label: "Logo + Name (Logo on top, Name below)" },
            { value: "logo_only", label: "Logo image only" },
            { value: "text_only", label: "Brand text only" },
          ]}
          onChange={(logoDisplay) => onChange({ ...header, logoDisplay: logoDisplay as HeaderData["logoDisplay"] })}
        />
        <ImageField label="Logo image" value={header.logo} onChange={(logo) => onChange({ ...header, logo })} optional />
      </FormGroup>

      <FormGroup title="Navigation menu & dropdowns">
        <button
          type="button"
          onClick={() => onChange({ ...header, menu: menuFromPages(pages) })}
          className="self-start text-xs text-brand hover:underline"
        >
          Rebuild menu from my pages
        </button>
        <ItemList
          label="Menu items"
          items={header.menu}
          max={LIMITS.menuLinks}
          onChange={(menu) => onChange({ ...header, menu })}
          create={newMenuItem}
          itemTitle={linkTitle}
          renderItem={(item, update) => <MenuItemEditor item={item} onChange={update} />}
          addLabel="Add menu item"
        />
      </FormGroup>

      <FormGroup title="Action buttons (CTAs)">
        <OptionalLinkField
          label="Primary button (CTA)"
          value={header.cta}
          onChange={(cta) => onChange({ ...header, cta })}
          fallback={{ label: "Sign up", href: "/signup" }}
        />
        <OptionalLinkField
          label="Secondary button (e.g. Log in / Contact)"
          value={header.secondaryCta}
          onChange={(secondaryCta) => onChange({ ...header, secondaryCta })}
          fallback={{ label: "Log in", href: "/login" }}
        />
      </FormGroup>
    </>
  );
}

export function FooterForm({
  footer,
  pages = [],
  onChange,
}: {
  footer: FooterData;
  pages?: WebsitePage[];
  onChange: (footer: FooterData) => void;
}) {
  const contact = footer.contact ?? {};
  const updateContact = (patch: Partial<NonNullable<FooterData["contact"]>>) => {
    const next = { ...contact, ...patch };
    const hasAny = Object.values(next).some((value) => value?.trim());
    onChange({ ...footer, contact: hasAny ? next : undefined });
  };

  const newsletter = footer.newsletter ?? {};
  const updateNewsletter = (patch: Partial<NonNullable<FooterData["newsletter"]>>) => {
    onChange({ ...footer, newsletter: { ...newsletter, ...patch } });
  };

  const ctaBanner = footer.ctaBanner ?? {};
  const updateCtaBanner = (patch: Partial<NonNullable<FooterData["ctaBanner"]>>) => {
    onChange({ ...footer, ctaBanner: { ...ctaBanner, ...patch } });
  };

  const paymentMethods = footer.paymentMethods ?? { enabled: true, methods: ["paypal", "amex", "discover", "mastercard", "visa"] };
  const updatePaymentMethods = (patch: Partial<NonNullable<FooterData["paymentMethods"]>>) => {
    onChange({ ...footer, paymentMethods: { ...paymentMethods, ...patch } });
  };

  const showColumns = footer.design === "columns" || footer.design === "mega" || footer.design === "cta-banner" || footer.design === "split";
  const showHorizontalMenu = footer.design === "newsletter" || footer.design === "inline" || footer.design === "centered" || footer.design === "split";

  return (
    <>
      <FormGroup title="Footer design & style">
        <SelectField
          label="Design layout"
          value={footer.design}
          options={[
            { value: "mega", label: "Mega store (Categories, contact, social, payment badges)" },
            { value: "newsletter", label: "Newsletter & links (Horizontal nav + subscribe form)" },
            { value: "split", label: "Split navigation (Brand & social + links + contact)" },
            { value: "inline", label: "Inline bar (Single-row logo, links & social)" },
            { value: "centered", label: "Centered brand (Centered stack & links)" },
            { value: "cta-banner", label: "CTA banner (Top call-to-action banner + links)" },
            { value: "columns", label: "Multi-column (Organized link columns)" },
            { value: "simple", label: "Simple (Minimal single line)" },
          ]}
          onChange={(design) => onChange({ ...footer, design: design as FooterData["design"] })}
        />
        <SelectField
          label="Color theme mode"
          value={footer.themeMode ?? "auto"}
          options={[
            { value: "auto", label: "Default (Follow site theme)" },
            { value: "dark", label: "Dark (Deep sleek dark background)" },
            { value: "light", label: "Light (Clean white background)" },
          ]}
          onChange={(themeMode) => onChange({ ...footer, themeMode: themeMode as FooterData["themeMode"] })}
        />
        <TextField
          label="Site name / Brand"
          value={footer.siteName}
          onChange={(siteName) => onChange({ ...footer, siteName })}
          maxLength={120}
          required
        />
        <TextField
          label="Tagline / Brand subtext (optional)"
          value={footer.tagline ?? ""}
          onChange={(tagline) => onChange({ ...footer, tagline: tagline || undefined })}
          maxLength={200}
          placeholder="Online Store"
        />
        <TextAreaField
          label="Short description"
          value={footer.description ?? ""}
          onChange={(description) => onChange({ ...footer, description: description || undefined })}
          maxLength={500}
          rows={2}
        />
      </FormGroup>

      <FormGroup title="Brand logo & layout">
        <SelectField
          label="Logo & brand layout"
          value={footer.logoDisplay ?? "auto"}
          options={[
            { value: "auto", label: "Smart / Auto (Logo if uploaded, else Brand text)" },
            { value: "logo_left", label: "Logo + Name (Logo on left, Name on right)" },
            { value: "logo_right", label: "Logo + Name (Name on left, Logo on right)" },
            { value: "logo_top", label: "Logo + Name (Logo on top, Name below)" },
            { value: "logo_only", label: "Logo image only" },
            { value: "text_only", label: "Brand text only" },
          ]}
          onChange={(logoDisplay) => onChange({ ...footer, logoDisplay: logoDisplay as FooterData["logoDisplay"] })}
        />
        <ImageField
          label="Footer logo image"
          value={footer.logo}
          onChange={(logo) => onChange({ ...footer, logo })}
          optional
        />
      </FormGroup>

      <FormGroup title="Call to action (CTA) top banner">
        <CheckboxField
          label="Enable CTA top banner"
          checked={Boolean(footer.ctaBanner?.enabled)}
          onChange={(enabled) => updateCtaBanner({ enabled })}
        />
        {footer.ctaBanner?.enabled && (
          <div className="flex flex-col gap-2.5 pt-2">
            <TextField
              label="Banner headline"
              value={ctaBanner.heading ?? ""}
              onChange={(heading) => updateCtaBanner({ heading: heading || undefined })}
              maxLength={200}
              placeholder="Ready to get started?"
            />
            <TextField
              label="Banner subtext"
              value={ctaBanner.subheading ?? ""}
              onChange={(subheading) => updateCtaBanner({ subheading: subheading || undefined })}
              maxLength={500}
              placeholder="Join thousands of satisfied customers."
            />
            <OptionalLinkField
              label="Primary CTA button"
              value={ctaBanner.primaryCta}
              onChange={(primaryCta) => updateCtaBanner({ primaryCta })}
              fallback={{ label: "Get started", href: "/signup" }}
            />
            <OptionalLinkField
              label="Secondary button (optional)"
              value={ctaBanner.secondaryCta}
              onChange={(secondaryCta) => updateCtaBanner({ secondaryCta })}
              fallback={{ label: "Learn more", href: "/about" }}
            />
          </div>
        )}
      </FormGroup>

      {showHorizontalMenu && (
        <FormGroup title="Horizontal navigation links">
          <button
            type="button"
            onClick={() => onChange({ ...footer, menu: menuFromPages(pages) })}
            className="self-start text-xs text-brand hover:underline"
          >
            Rebuild links from my pages
          </button>
          <ItemList
            label="Menu links"
            items={footer.menu ?? []}
            max={12}
            onChange={(menu) => onChange({ ...footer, menu })}
            create={newLink}
            itemTitle={linkTitle}
            renderItem={renderLink}
            addLabel="Add menu link"
          />
        </FormGroup>
      )}

      {showColumns && (
        <FormGroup title="Link columns">
          <ItemList
            label="Columns"
            items={footer.columns}
            max={6}
            onChange={(columns) => onChange({ ...footer, columns })}
            create={() => ({ title: "Links", links: [newLink()] })}
            itemTitle={(column) => column.title}
            addLabel="Add column"
            renderItem={(column, update) => (
              <div className="flex flex-col gap-2.5">
                <TextField
                  label="Column title"
                  value={column.title}
                  onChange={(title) => update({ ...column, title })}
                  maxLength={60}
                  required
                />
                <ItemList
                  label="Column links"
                  items={column.links}
                  max={12}
                  onChange={(links) => update({ ...column, links })}
                  create={newLink}
                  itemTitle={linkTitle}
                  renderItem={renderLink}
                  addLabel="Add link"
                />
              </div>
            )}
          />
        </FormGroup>
      )}

      <FormGroup title="Newsletter subscription">
        <CheckboxField
          label="Enable newsletter signup box"
          checked={Boolean(footer.newsletter?.enabled ?? (footer.design === "newsletter" || footer.design === "mega"))}
          onChange={(enabled) => updateNewsletter({ enabled })}
        />
        <TextField
          label="Newsletter title"
          value={newsletter.title ?? ""}
          onChange={(title) => updateNewsletter({ title: title || undefined })}
          maxLength={100}
          placeholder="Subscribe to News"
        />
        <TextField
          label="Newsletter description"
          value={newsletter.description ?? ""}
          onChange={(description) => updateNewsletter({ description: description || undefined })}
          maxLength={200}
          placeholder="Get the latest updates and offers."
        />
        <TextField
          label="Email input placeholder"
          value={newsletter.placeholder ?? ""}
          onChange={(placeholder) => updateNewsletter({ placeholder: placeholder || undefined })}
          maxLength={100}
          placeholder="Enter email address"
        />
        <TextField
          label="Button label"
          value={newsletter.buttonText ?? ""}
          onChange={(buttonText) => updateNewsletter({ buttonText: buttonText || undefined })}
          maxLength={50}
          placeholder="Subscribe"
        />
      </FormGroup>

      <FormGroup title="Contact details">
        <TextField
          label="Contact column title"
          value={contact.title ?? ""}
          onChange={(title) => updateContact({ title: title || undefined })}
          maxLength={60}
          placeholder="Contact Us"
        />
        <TextField
          label="Email address"
          type="email"
          value={contact.email ?? ""}
          onChange={(email) => updateContact({ email: email || undefined })}
          maxLength={255}
        />
        <TextField
          label="Phone number"
          type="tel"
          value={contact.phone ?? ""}
          onChange={(phone) => updateContact({ phone: phone || undefined })}
          maxLength={32}
        />
        <TextAreaField
          label="Physical address"
          value={contact.address ?? ""}
          onChange={(address) => updateContact({ address: address || undefined })}
          maxLength={500}
          rows={2}
        />
        <TextField
          label="Business hours / extra info"
          value={contact.hours ?? ""}
          onChange={(hours) => updateContact({ hours: hours || undefined })}
          maxLength={200}
          placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
        />
      </FormGroup>

      <FormGroup title="Social links">
        <ItemList
          label="Social profiles"
          items={footer.social}
          max={12}
          onChange={(social) => onChange({ ...footer, social })}
          create={() => ({ label: "Instagram", href: "https://instagram.com/" })}
          itemTitle={linkTitle}
          renderItem={renderLink}
          addLabel="Add social link"
        />
      </FormGroup>

      <FormGroup title="Payment methods bar">
        <CheckboxField
          label="Show accepted payment badges"
          checked={paymentMethods.enabled !== false}
          onChange={(enabled) => updatePaymentMethods({ enabled })}
        />
        {paymentMethods.enabled !== false && (
          <TextField
            label="Payment badges (comma separated)"
            value={(paymentMethods.methods ?? ["paypal", "amex", "discover", "mastercard", "visa"]).join(", ")}
            onChange={(val) =>
              updatePaymentMethods({
                methods: val
                  .split(",")
                  .map((s) => s.trim().toLowerCase())
                  .filter(Boolean),
              })
            }
            hint="Supported: paypal, amex, discover, mastercard, visa, applepay"
          />
        )}
      </FormGroup>

      <FormGroup title="Copyright & legal links">
        <TextField
          label="Copyright line"
          value={footer.copyright}
          onChange={(copyright) => onChange({ ...footer, copyright })}
          maxLength={200}
        />
        <ItemList
          label="Legal links (Privacy, Terms...)"
          items={footer.legalLinks ?? []}
          max={6}
          onChange={(legalLinks) => onChange({ ...footer, legalLinks })}
          create={() => ({ label: "Privacy Policy", href: "/privacy" })}
          itemTitle={linkTitle}
          renderItem={renderLink}
          addLabel="Add legal link"
        />
      </FormGroup>
    </>
  );
}

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
      <FormGroup title="Site font">
        <p className="-mt-1 text-ed-2xs leading-normal text-ed-muted">
          Used across the whole website. Any section can override it from its Style tab.
        </p>
        <FontPicker
          label="Site font"
          value={isFontKey(theme.fonts.heading) ? theme.fonts.heading : DEFAULT_FONT}
          onChange={(font) => onChange({ ...theme, fonts: { heading: font, body: font } })}
        />
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
