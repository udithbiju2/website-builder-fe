import type {
  ContactData,
  CtaData,
  FaqData,
  FeaturesData,
  GalleryData,
  GridColumns,
  HeroData,
  IconName,
  Section,
  SectionBackground,
  SectionSettings,
  ServicesData,
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
];

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

function SettingsForm({ settings, onChange }: { settings: SectionSettings; onChange: (settings: SectionSettings) => void }) {
  return (
    <FormGroup title="Section style">
      <SelectField
        label="Background"
        value={settings.background}
        options={BACKGROUND_OPTIONS}
        onChange={(background) => onChange({ ...settings, background })}
      />
      <CheckboxField
        label="Hide on mobile"
        checked={settings.hideOnMobile}
        onChange={(hideOnMobile) => onChange({ ...settings, hideOnMobile })}
      />
    </FormGroup>
  );
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
  }
}

export default function SectionForm({ section, onChange }: { section: Section; onChange: (section: Section) => void }) {
  return (
    <>
      <DataForm section={section} onChange={onChange} />
      <SettingsForm settings={section.settings} onChange={(settings) => onChange({ ...section, settings })} />
    </>
  );
}
