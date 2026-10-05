import type {
  ContactData,
  CtaData,
  FaqData,
  FeaturesData,
  GalleryData,
  GridColumns,
  HeroData,
  IconName,
  LogosData,
  MediaData,
  PricingData,
  PricingPlan,
  Section,
  SectionAlign,
  SectionBackground,
  SectionSettings,
  SectionSpacing,
  ServicesData,
  SplitData,
  StatsData,
  TeamData,
  TeamMember,
  TestimonialsData,
  TextData,
} from "../../../site-kit/index.ts";
import {
  CheckboxField,
  FormGroup,
  ImageField,
  ItemList,
  LinkField,
  OptionalLinkField,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields.tsx";

type DataFormProps<T> = { data: T; onChange: (data: T) => void };

const COLUMN_OPTIONS: { value: GridColumns; label: string }[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
];

const ICON_OPTIONS: { value: IconName | ""; label: string }[] = [
  { value: "", label: "No icon" },
  { value: "check", label: "Check" },
  { value: "star", label: "Star" },
  { value: "bolt", label: "Lightning" },
  { value: "shield", label: "Shield" },
  { value: "heart", label: "Heart" },
  { value: "chat", label: "Chat" },
];

const BACKGROUND_OPTIONS: { value: SectionBackground; label: string }[] = [
  { value: "default", label: "Page background" },
  { value: "surface", label: "Tinted" },
  { value: "primary", label: "Primary colour" },
  { value: "dark", label: "Dark" },
];

const SPACING_OPTIONS: { value: SectionSpacing; label: string }[] = [
  { value: "default", label: "Theme default" },
  { value: "none", label: "None" },
  { value: "compact", label: "Compact" },
  { value: "relaxed", label: "Relaxed" },
];

const ALIGN_OPTIONS: { value: SectionAlign; label: string }[] = [
  { value: "center", label: "Centered" },
  { value: "left", label: "Left aligned" },
];

const ANCHOR_PATTERN = /^[a-z][a-z0-9-]{0,39}$/;

/** Short repeatable text lines such as bullets or plan features. */
function StringList({ label, items, max, onChange, addLabel }: {
  label: string;
  items: string[];
  max: number;
  onChange: (items: string[]) => void;
  addLabel: string;
}) {
  return (
    <ItemList<string>
      label={label}
      items={items}
      max={max}
      onChange={onChange}
      create={() => "New item"}
      itemTitle={(item) => item}
      addLabel={addLabel}
      renderItem={(item, update) => <TextField label="Text" value={item} onChange={update} maxLength={200} required />}
    />
  );
}

function ColumnsFields<T extends { columns: GridColumns; mobileColumns: GridColumns }>({ data, onChange }: DataFormProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SelectField label="Columns" value={data.columns} options={COLUMN_OPTIONS} onChange={(columns) => onChange({ ...data, columns })} />
      <SelectField
        label="On mobile"
        value={data.mobileColumns}
        options={COLUMN_OPTIONS.slice(0, 2)}
        onChange={(mobileColumns) => onChange({ ...data, mobileColumns })}
      />
    </div>
  );
}

function HeroForm({ data, onChange }: DataFormProps<HeroData>) {
  return (
    <>
      <FormGroup title="Layout">
        <SelectField
          label="Design"
          value={data.variant}
          options={[
            { value: "centered", label: "Centered" },
            { value: "split", label: "Text + image side by side" },
          ]}
          onChange={(variant) => onChange({ ...data, variant })}
        />
      </FormGroup>
      <FormGroup title="Content">
        <TextField label="Small text above heading" value={data.eyebrow} onChange={(eyebrow) => onChange({ ...data, eyebrow })} maxLength={200} />
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
        <TextAreaField label="Text" value={data.subheading} onChange={(subheading) => onChange({ ...data, subheading })} maxLength={500} />
      </FormGroup>
      <FormGroup title="Buttons">
        <OptionalLinkField
          label="Main button"
          value={data.primaryCta}
          onChange={(primaryCta) => onChange({ ...data, primaryCta })}
          fallback={{ label: "Get started", href: "/contact" }}
        />
        <OptionalLinkField
          label="Second button"
          value={data.secondaryCta}
          onChange={(secondaryCta) => onChange({ ...data, secondaryCta })}
          fallback={{ label: "Learn more", href: "/" }}
        />
      </FormGroup>
      <FormGroup title="Image">
        <ImageField label="Hero image" value={data.image} onChange={(image) => onChange({ ...data, image })} optional />
      </FormGroup>
    </>
  );
}

function FeaturesForm({ data, onChange }: DataFormProps<FeaturesData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
        <TextAreaField label="Intro" value={data.intro} onChange={(intro) => onChange({ ...data, intro })} maxLength={500} />
        <ColumnsFields data={data} onChange={onChange} />
      </FormGroup>
      <FormGroup title="Features">
        <ItemList<FeaturesData["items"][number]>
          label="Items"
          items={data.items}
          max={24}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({ icon: "check", title: "New feature", description: "Describe this benefit." })}
          itemTitle={(item) => item.title}
          addLabel="Add feature"
          renderItem={(item, update) => (
            <>
              <SelectField
                label="Icon"
                value={item.icon ?? ""}
                options={ICON_OPTIONS}
                onChange={(icon) => update({ ...item, icon: icon || undefined })}
              />
              <TextField label="Title" value={item.title} onChange={(title) => update({ ...item, title })} maxLength={120} required />
              <TextAreaField label="Description" value={item.description} onChange={(description) => update({ ...item, description })} maxLength={600} />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function ServicesForm({ data, onChange }: DataFormProps<ServicesData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
        <TextAreaField label="Intro" value={data.intro} onChange={(intro) => onChange({ ...data, intro })} maxLength={500} />
        <ColumnsFields data={data} onChange={onChange} />
      </FormGroup>
      <FormGroup title="Services">
        <ItemList<ServicesData["items"][number]>
          label="Items"
          items={data.items}
          max={24}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({ title: "New service", description: "A short description of this service." })}
          itemTitle={(item) => item.title}
          addLabel="Add service"
          renderItem={(item, update) => (
            <>
              <TextField label="Title" value={item.title} onChange={(title) => update({ ...item, title })} maxLength={120} required />
              <TextAreaField label="Description" value={item.description} onChange={(description) => update({ ...item, description })} maxLength={600} />
              <ImageField label="Image" value={item.image} onChange={(image) => update({ ...item, image })} optional />
              <OptionalLinkField
                label="Link"
                value={item.link}
                onChange={(link) => update({ ...item, link })}
                fallback={{ label: "Learn more", href: "/contact" }}
              />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function TestimonialsForm({ data, onChange }: DataFormProps<TestimonialsData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
      </FormGroup>
      <FormGroup title="Quotes">
        <ItemList<TestimonialsData["items"][number]>
          label="Testimonials"
          items={data.items}
          max={24}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({ quote: "Add a short quote from a happy customer.", name: "Customer name" })}
          itemTitle={(item) => item.name}
          addLabel="Add testimonial"
          renderItem={(item, update) => (
            <>
              <TextAreaField label="Quote" value={item.quote} onChange={(quote) => update({ ...item, quote })} maxLength={800} required />
              <TextField label="Name" value={item.name} onChange={(name) => update({ ...item, name })} maxLength={120} required />
              <TextField label="Role or company" value={item.role} onChange={(role) => update({ ...item, role })} maxLength={120} />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function FaqForm({ data, onChange }: DataFormProps<FaqData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
        <TextAreaField label="Intro" value={data.intro} onChange={(intro) => onChange({ ...data, intro })} maxLength={500} />
      </FormGroup>
      <FormGroup title="Questions">
        <ItemList
          label="Questions"
          items={data.items}
          max={40}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({ question: "New question?", answer: "Answer it clearly in a sentence or two." })}
          itemTitle={(item) => item.question}
          addLabel="Add question"
          renderItem={(item, update) => (
            <>
              <TextField label="Question" value={item.question} onChange={(question) => update({ ...item, question })} maxLength={300} required />
              <TextAreaField label="Answer" value={item.answer} onChange={(answer) => update({ ...item, answer })} maxLength={2000} required rows={4} />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function CtaForm({ data, onChange }: DataFormProps<CtaData>) {
  return (
    <FormGroup title="Content">
      <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
      <TextAreaField label="Text" value={data.text} onChange={(text) => onChange({ ...data, text })} maxLength={500} />
      <LinkField label="Button" value={data.button} onChange={(button) => onChange({ ...data, button })} />
    </FormGroup>
  );
}

function ContactForm({ data, onChange }: DataFormProps<ContactData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
        <TextAreaField label="Text" value={data.text} onChange={(text) => onChange({ ...data, text })} maxLength={500} />
      </FormGroup>
      <FormGroup title="Contact details">
        <TextField label="Email" type="email" value={data.email} onChange={(email) => onChange({ ...data, email })} maxLength={255} />
        <TextField label="Phone" type="tel" value={data.phone} onChange={(phone) => onChange({ ...data, phone })} maxLength={32} />
        <TextAreaField label="Address" value={data.address} onChange={(address) => onChange({ ...data, address })} maxLength={500} rows={2} />
      </FormGroup>
      <FormGroup title="Form">
        <CheckboxField
          label="Show enquiry form"
          checked={data.showForm}
          onChange={(showForm) => onChange({ ...data, showForm })}
          hint="Form submissions are switched on when the site is published."
        />
        {data.showForm && (
          <TextField label="Button text" value={data.submitLabel} onChange={(submitLabel) => onChange({ ...data, submitLabel })} maxLength={40} required />
        )}
      </FormGroup>
    </>
  );
}

function TextForm({ data, onChange }: DataFormProps<TextData>) {
  return (
    <FormGroup title="Content">
      <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} />
      <TextAreaField
        label="Text"
        value={data.body}
        onChange={(body) => onChange({ ...data, body })}
        rows={10}
        maxLength={20000}
        hint="Leave a blank line between paragraphs."
      />
    </FormGroup>
  );
}

function GalleryForm({ data, onChange }: DataFormProps<GalleryData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} />
        <ColumnsFields data={data} onChange={onChange} />
      </FormGroup>
      <FormGroup title="Images">
        <ItemList
          label="Images"
          items={data.images}
          max={48}
          onChange={(images) => onChange({ ...data, images })}
          create={() => ({ url: "", alt: "" })}
          itemTitle={(image, index) => image.alt || `Image ${index + 1}`}
          addLabel="Add image"
          renderItem={(image, update) => (
            <ImageField label="Image" value={image} onChange={(next) => update(next ?? { url: "", alt: "" })} />
          )}
        />
      </FormGroup>
    </>
  );
}

function LogosForm({ data, onChange }: DataFormProps<LogosData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} />
        <CheckboxField label="Show logos in grayscale" checked={data.grayscale} onChange={(grayscale) => onChange({ ...data, grayscale })} />
      </FormGroup>
      <FormGroup title="Logos">
        <ItemList
          label="Logos"
          items={data.logos}
          max={24}
          onChange={(logos) => onChange({ ...data, logos })}
          create={() => ({ url: "", alt: "" })}
          itemTitle={(logo, index) => logo.alt || `Logo ${index + 1}`}
          addLabel="Add logo"
          renderItem={(logo, update) => (
            <ImageField label="Logo" value={logo} onChange={(next) => update(next ?? { url: "", alt: "" })} />
          )}
        />
      </FormGroup>
    </>
  );
}

function SplitForm({ data, onChange }: DataFormProps<SplitData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Small text above heading" value={data.eyebrow} onChange={(eyebrow) => onChange({ ...data, eyebrow })} maxLength={200} />
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
        <TextAreaField label="Text" value={data.body} onChange={(body) => onChange({ ...data, body })} maxLength={4000} rows={5} hint="Leave a blank line between paragraphs." />
        <StringList label="Bullet points" items={data.bullets} max={8} onChange={(bullets) => onChange({ ...data, bullets })} addLabel="Add bullet" />
        <OptionalLinkField label="Button" value={data.cta} onChange={(cta) => onChange({ ...data, cta })} fallback={{ label: "Learn more", href: "/contact" }} />
      </FormGroup>
      <FormGroup title="Image">
        <SelectField
          label="Image position"
          value={data.imagePosition}
          options={[
            { value: "right", label: "Right of the text" },
            { value: "left", label: "Left of the text" },
          ]}
          onChange={(imagePosition) => onChange({ ...data, imagePosition })}
        />
        <ImageField label="Image" value={data.image} onChange={(image) => onChange({ ...data, image })} optional />
      </FormGroup>
    </>
  );
}

function StatsForm({ data, onChange }: DataFormProps<StatsData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} />
        <TextAreaField label="Intro" value={data.intro} onChange={(intro) => onChange({ ...data, intro })} maxLength={500} />
      </FormGroup>
      <FormGroup title="Numbers">
        <ItemList
          label="Statistics"
          items={data.items}
          max={8}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({ value: "100", label: "Label" })}
          itemTitle={(item) => `${item.value} ${item.label}`}
          addLabel="Add statistic"
          renderItem={(item, update) => (
            <>
              <TextField label="Number" value={item.value} onChange={(value) => update({ ...item, value })} maxLength={20} required />
              <TextField label="Label" value={item.label} onChange={(label) => update({ ...item, label })} maxLength={80} required />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function PricingForm({ data, onChange }: DataFormProps<PricingData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
        <TextAreaField label="Intro" value={data.intro} onChange={(intro) => onChange({ ...data, intro })} maxLength={500} />
      </FormGroup>
      <FormGroup title="Plans">
        <ItemList<PricingPlan>
          label="Plans"
          items={data.plans}
          max={4}
          onChange={(plans) => onChange({ ...data, plans })}
          create={() => ({ name: "New plan", price: "$0", period: "/ month", features: [], featured: false })}
          itemTitle={(plan) => plan.name}
          addLabel="Add plan"
          renderItem={(plan, update) => (
            <>
              <TextField label="Name" value={plan.name} onChange={(name) => update({ ...plan, name })} maxLength={60} required />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Price" value={plan.price} onChange={(price) => update({ ...plan, price })} maxLength={20} required />
                <TextField label="Period" value={plan.period} onChange={(period) => update({ ...plan, period })} maxLength={20} />
              </div>
              <TextAreaField label="Description" value={plan.description} onChange={(description) => update({ ...plan, description })} maxLength={300} rows={2} />
              <StringList label="Features" items={plan.features} max={12} onChange={(features) => update({ ...plan, features })} addLabel="Add feature" />
              <OptionalLinkField label="Button" value={plan.cta} onChange={(cta) => update({ ...plan, cta })} fallback={{ label: "Get started", href: "/contact" }} />
              <CheckboxField label="Highlight as most popular" checked={plan.featured} onChange={(featured) => update({ ...plan, featured })} />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function MediaForm({ data, onChange }: DataFormProps<MediaData>) {
  return (
    <>
      <FormGroup title="Content">
        <SelectField
          label="Type"
          value={data.kind}
          options={[
            { value: "image", label: "Image" },
            { value: "video", label: "YouTube or Vimeo video" },
          ]}
          onChange={(kind) => onChange({ ...data, kind })}
        />
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} />
        {data.kind === "image" ? (
          <ImageField label="Image" value={data.image} onChange={(image) => onChange({ ...data, image })} optional />
        ) : (
          <TextField
            label="Video link"
            type="url"
            value={data.videoUrl}
            onChange={(videoUrl) => onChange({ ...data, videoUrl })}
            placeholder="https://www.youtube.com/watch?v=…"
            hint="Plays with privacy-enhanced embedding."
            maxLength={2048}
          />
        )}
        <TextField label="Caption" value={data.caption} onChange={(caption) => onChange({ ...data, caption })} maxLength={300} />
      </FormGroup>
      <FormGroup title="Layout">
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Shape"
            value={data.aspect}
            options={[
              { value: "16:9", label: "Wide 16:9" },
              { value: "4:3", label: "Classic 4:3" },
              { value: "1:1", label: "Square" },
            ]}
            onChange={(aspect) => onChange({ ...data, aspect })}
          />
          <SelectField
            label="Width"
            value={data.width}
            options={[
              { value: "contained", label: "Contained" },
              { value: "wide", label: "Full width" },
            ]}
            onChange={(width) => onChange({ ...data, width })}
          />
        </div>
      </FormGroup>
    </>
  );
}

function TeamForm({ data, onChange }: DataFormProps<TeamData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} maxLength={200} required />
        <TextAreaField label="Intro" value={data.intro} onChange={(intro) => onChange({ ...data, intro })} maxLength={500} />
        <ColumnsFields data={data} onChange={onChange} />
      </FormGroup>
      <FormGroup title="People">
        <ItemList<TeamMember>
          label="Members"
          items={data.members}
          max={24}
          onChange={(members) => onChange({ ...data, members })}
          create={() => ({ name: "New member", role: "Role" })}
          itemTitle={(member) => member.name}
          addLabel="Add person"
          renderItem={(member, update) => (
            <>
              <TextField label="Name" value={member.name} onChange={(name) => update({ ...member, name })} maxLength={120} required />
              <TextField label="Role" value={member.role} onChange={(role) => update({ ...member, role })} maxLength={120} />
              <TextAreaField label="Short bio" value={member.bio} onChange={(bio) => update({ ...member, bio })} maxLength={600} rows={2} />
              <ImageField label="Photo" value={member.photo} onChange={(photo) => update({ ...member, photo })} optional />
              <OptionalLinkField label="Link" value={member.link} onChange={(link) => update({ ...member, link })} fallback={{ label: "LinkedIn", href: "https://linkedin.com/" }} />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

type SettingsFormProps = { settings: SectionSettings; onChange: (settings: SectionSettings) => void };

export function SectionStyleForm({ settings, onChange }: SettingsFormProps) {
  return (
    <FormGroup title="Section style">
      <SelectField
        label="Background"
        value={settings.background}
        options={BACKGROUND_OPTIONS}
        onChange={(background) => onChange({ ...settings, background })}
      />
      <SelectField
        label="Vertical spacing"
        value={settings.spacing ?? "default"}
        options={SPACING_OPTIONS}
        onChange={(spacing) => onChange({ ...settings, spacing })}
      />
      <SelectField
        label="Heading alignment"
        value={settings.align ?? "center"}
        options={ALIGN_OPTIONS}
        onChange={(align) => onChange({ ...settings, align })}
      />
    </FormGroup>
  );
}

export function SectionResponsiveForm({ settings, onChange }: SettingsFormProps) {
  return (
    <FormGroup title="Visibility by device">
      <CheckboxField
        label="Hide on mobile"
        hint="Screens narrower than 600px."
        checked={settings.hideOnMobile}
        onChange={(hideOnMobile) => onChange({ ...settings, hideOnMobile })}
      />
      <CheckboxField
        label="Hide on tablet and desktop"
        hint="Show this section on phones only."
        checked={settings.hideOnDesktop ?? false}
        onChange={(hideOnDesktop) => onChange({ ...settings, hideOnDesktop })}
      />
    </FormGroup>
  );
}

export function SectionAdvancedForm({ settings, onChange }: SettingsFormProps) {
  const anchor = settings.anchor ?? "";
  return (
    <FormGroup title="Anchor link">
      <TextField
        label="Section id"
        value={anchor}
        onChange={(value) => onChange({ ...settings, anchor: value.toLowerCase() })}
        placeholder="pricing"
        maxLength={40}
        error={anchor && !ANCHOR_PATTERN.test(anchor) ? "Lowercase letters, numbers and hyphens, starting with a letter" : undefined}
        hint={anchor ? `Link to it with #${anchor}` : "Lets buttons and menu links jump to this section."}
      />
    </FormGroup>
  );
}

export function SectionContentForm({ section, onChange }: { section: Section; onChange: (section: Section) => void }) {
  return <DataForm section={section} onChange={onChange} />;
}

function DataForm({ section, onChange }: { section: Section; onChange: (section: Section) => void }) {
  switch (section.type) {
    case "hero":
      return <HeroForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "features":
      return <FeaturesForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "services":
      return <ServicesForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "testimonials":
      return <TestimonialsForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "faq":
      return <FaqForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "cta":
      return <CtaForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "contact":
      return <ContactForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "text":
      return <TextForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "gallery":
      return <GalleryForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "logos":
      return <LogosForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "split":
      return <SplitForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "stats":
      return <StatsForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "pricing":
      return <PricingForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "media":
      return <MediaForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
    case "team":
      return <TeamForm data={section.data} onChange={(data) => onChange({ ...section, data })} />;
  }
}

export default function SectionForm({ section, onChange }: { section: Section; onChange: (section: Section) => void }) {
  const changeSettings = (settings: SectionSettings) => onChange({ ...section, settings });
  return (
    <>
      <DataForm section={section} onChange={onChange} />
      <SectionStyleForm settings={section.settings} onChange={changeSettings} />
      <SectionResponsiveForm settings={section.settings} onChange={changeSettings} />
    </>
  );
}
