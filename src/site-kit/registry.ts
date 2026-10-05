import type { Section, SectionDataMap, SectionOf, SectionSettings, SectionType } from "./types.ts";

export type SectionCategory =
  | "Hero"
  | "Features"
  | "Services"
  | "Social proof"
  | "FAQ"
  | "CTA"
  | "Contact"
  | "Portfolio"
  | "Content"
  | "Media"
  | "Pricing"
  | "Team";

export type SectionDefinition<T extends SectionType> = {
  type: T;
  label: string;
  category: SectionCategory;
  description: string;
  /** Starter content used when a section is added in the editor. */
  createData: () => SectionDataMap[T];
};

/**
 * The only section types the Manual and AI builders may place on a page.
 * Adding a section type means adding it to `SectionDataMap`, here, and in `SectionView`.
 */
export const SECTION_DEFINITIONS: { [T in SectionType]: SectionDefinition<T> } = {
  hero: {
    type: "hero",
    label: "Hero",
    category: "Hero",
    description: "Large heading, supporting text and call-to-action buttons. Centered or two-column.",
    createData: () => ({
      variant: "centered",
      heading: "Your headline goes here",
      subheading: "Explain in one or two sentences what you offer and who it is for.",
      primaryCta: { label: "Get started", href: "/contact" },
    }),
  },
  features: {
    type: "features",
    label: "Features",
    category: "Features",
    description: "Grid of feature blocks, each with an icon, title and description.",
    createData: () => ({
      heading: "Why choose us",
      columns: 3,
      mobileColumns: 1,
      items: [
        { icon: "bolt", title: "Fast", description: "Describe this benefit in a sentence." },
        { icon: "shield", title: "Reliable", description: "Describe this benefit in a sentence." },
        { icon: "heart", title: "Friendly", description: "Describe this benefit in a sentence." },
      ],
    }),
  },
  services: {
    type: "services",
    label: "Services grid",
    category: "Services",
    description: "Cards for each service with optional image and link.",
    createData: () => ({
      heading: "Our services",
      columns: 3,
      mobileColumns: 1,
      items: [
        { title: "Service one", description: "A short description of this service." },
        { title: "Service two", description: "A short description of this service." },
        { title: "Service three", description: "A short description of this service." },
      ],
    }),
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    category: "Social proof",
    description: "Customer quotes with name and role.",
    createData: () => ({
      heading: "What our customers say",
      items: [
        { quote: "Add a short quote from a happy customer.", name: "Customer name", role: "Company" },
        { quote: "Add a short quote from a happy customer.", name: "Customer name", role: "Company" },
      ],
    }),
  },
  faq: {
    type: "faq",
    label: "FAQ accordion",
    category: "FAQ",
    description: "Questions that expand to show their answer.",
    createData: () => ({
      heading: "Frequently asked questions",
      items: [
        { question: "Add a common question?", answer: "Answer it clearly in a sentence or two." },
        { question: "Add another question?", answer: "Answer it clearly in a sentence or two." },
      ],
    }),
  },
  cta: {
    type: "cta",
    label: "Call to action",
    category: "CTA",
    description: "Short heading with a single prominent button.",
    createData: () => ({
      heading: "Ready to get started?",
      text: "Tell visitors what to do next.",
      button: { label: "Contact us", href: "/contact" },
    }),
  },
  contact: {
    type: "contact",
    label: "Contact form",
    category: "Contact",
    description: "Contact details with an optional enquiry form.",
    createData: () => ({
      heading: "Get in touch",
      text: "We usually reply within one business day.",
      showForm: true,
      submitLabel: "Send message",
    }),
  },
  text: {
    type: "text",
    label: "Text + heading",
    category: "Content",
    description: "A heading followed by paragraphs of text.",
    createData: () => ({
      heading: "About us",
      body: "Write a few paragraphs here.\n\nLeave a blank line between paragraphs.",
    }),
  },
  gallery: {
    type: "gallery",
    label: "Gallery / Portfolio",
    category: "Portfolio",
    description: "Grid of images for work samples or photos.",
    createData: () => ({
      heading: "Our work",
      columns: 3,
      mobileColumns: 1,
      images: [],
    }),
  },
  logos: {
    type: "logos",
    label: "Logo cloud",
    category: "Social proof",
    description: "A row of customer or partner logos.",
    createData: () => ({
      heading: "Trusted by teams at",
      grayscale: true,
      logos: [],
    }),
  },
  split: {
    type: "split",
    label: "Split content",
    category: "Content",
    description: "Text and bullet points beside an image.",
    createData: () => ({
      eyebrow: "How it works",
      heading: "Explain one key idea",
      body: "Use a short paragraph to describe what makes this part of your offer valuable.",
      bullets: ["First benefit", "Second benefit", "Third benefit"],
      imagePosition: "right",
    }),
  },
  stats: {
    type: "stats",
    label: "Statistics",
    category: "Social proof",
    description: "Large numbers that show results at a glance.",
    createData: () => ({
      items: [
        { value: "10+", label: "Years of experience" },
        { value: "500", label: "Happy customers" },
        { value: "24/7", label: "Support" },
      ],
    }),
  },
  pricing: {
    type: "pricing",
    label: "Pricing",
    category: "Pricing",
    description: "Plans with price, features and a button each.",
    createData: () => ({
      heading: "Simple, transparent pricing",
      intro: "Choose the plan that fits you.",
      plans: [
        {
          name: "Starter",
          price: "$19",
          period: "/ month",
          description: "For individuals getting started.",
          features: ["First feature", "Second feature"],
          cta: { label: "Choose Starter", href: "/contact" },
          featured: false,
        },
        {
          name: "Pro",
          price: "$49",
          period: "/ month",
          description: "For growing teams.",
          features: ["Everything in Starter", "Third feature", "Priority support"],
          cta: { label: "Choose Pro", href: "/contact" },
          featured: true,
        },
      ],
    }),
  },
  media: {
    type: "media",
    label: "Image / video",
    category: "Media",
    description: "One large image or a YouTube / Vimeo video.",
    createData: () => ({
      kind: "image",
      aspect: "16:9",
      width: "contained",
    }),
  },
  team: {
    type: "team",
    label: "Team",
    category: "Team",
    description: "People with photo, role and short bio.",
    createData: () => ({
      heading: "Meet the team",
      columns: 3,
      mobileColumns: 1,
      members: [
        { name: "Team member", role: "Role" },
        { name: "Team member", role: "Role" },
        { name: "Team member", role: "Role" },
      ],
    }),
  },
};

export const SECTION_TYPES = Object.keys(SECTION_DEFINITIONS) as SectionType[];

export const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  background: "default",
  hideOnMobile: false,
};

export function createSection<T extends SectionType>(
  type: T,
  overrides: { data?: Partial<SectionDataMap[T]>; settings?: Partial<SectionSettings> } = {},
): SectionOf<T> {
  return {
    id: crypto.randomUUID(),
    type,
    hidden: false,
    settings: { ...DEFAULT_SECTION_SETTINGS, ...overrides.settings },
    data: { ...SECTION_DEFINITIONS[type].createData(), ...overrides.data },
  } as SectionOf<T>;
}

/** A ready-made design in the component library: a section type plus starting layout and content. */
export type SectionPreset = {
  key: string;
  type: SectionType;
  label: string;
  category: SectionCategory;
  description: string;
  create: () => Section;
};

export const SECTION_PRESETS: SectionPreset[] = [
  {
    key: "hero-centered",
    type: "hero",
    label: "Hero · centered",
    category: "Hero",
    description: "Big centered headline with two buttons.",
    create: () =>
      createSection("hero", {
        data: { eyebrow: "Welcome", secondaryCta: { label: "Our services", href: "/services" } },
      }),
  },
  {
    key: "hero-split",
    type: "hero",
    label: "Hero · text + image",
    category: "Hero",
    description: "Headline on the left, image on the right.",
    create: () => createSection("hero", { data: { variant: "split" } }),
  },
  {
    key: "hero-banner",
    type: "hero",
    label: "Hero · colour banner",
    category: "Hero",
    description: "Centered headline on your primary colour.",
    create: () => createSection("hero", { settings: { background: "primary" } }),
  },
  {
    key: "features-3",
    type: "features",
    label: "Features · 3 columns",
    category: "Features",
    description: "Three benefits with icons.",
    create: () => createSection("features"),
  },
  {
    key: "features-4-surface",
    type: "features",
    label: "Features · 4 columns",
    category: "Features",
    description: "Four compact benefits on a tinted background.",
    create: () =>
      createSection("features", {
        settings: { background: "surface" },
        data: {
          columns: 4,
          mobileColumns: 2,
          items: [
            { icon: "check", title: "Quality", description: "Describe this benefit." },
            { icon: "star", title: "Experience", description: "Describe this benefit." },
            { icon: "chat", title: "Support", description: "Describe this benefit." },
            { icon: "shield", title: "Trusted", description: "Describe this benefit." },
          ],
        },
      }),
  },
  {
    key: "services-grid",
    type: "services",
    label: "Services · cards",
    category: "Services",
    description: "A card for each service.",
    create: () => createSection("services"),
  },
  {
    key: "services-links",
    type: "services",
    label: "Services · 2 columns with links",
    category: "Services",
    description: "Larger cards, each linking to more detail.",
    create: () =>
      createSection("services", {
        data: {
          columns: 2,
          items: [
            { title: "Service one", description: "A short description of this service.", link: { label: "Learn more", href: "/contact" } },
            { title: "Service two", description: "A short description of this service.", link: { label: "Learn more", href: "/contact" } },
          ],
        },
      }),
  },
  {
    key: "testimonials",
    type: "testimonials",
    label: "Testimonials",
    category: "Social proof",
    description: "Quotes from happy customers.",
    create: () => createSection("testimonials", { settings: { background: "surface" } }),
  },
  {
    key: "faq",
    type: "faq",
    label: "FAQ accordion",
    category: "FAQ",
    description: "Questions that open to show the answer.",
    create: () => createSection("faq"),
  },
  {
    key: "cta-banner",
    type: "cta",
    label: "Call to action · banner",
    category: "CTA",
    description: "One clear next step on your primary colour.",
    create: () => createSection("cta", { settings: { background: "primary" } }),
  },
  {
    key: "cta-light",
    type: "cta",
    label: "Call to action · light",
    category: "CTA",
    description: "Subtle call to action on a tinted background.",
    create: () => createSection("cta", { settings: { background: "surface" } }),
  },
  {
    key: "contact-form",
    type: "contact",
    label: "Contact · details + form",
    category: "Contact",
    description: "Email, phone and address with an enquiry form.",
    create: () => createSection("contact"),
  },
  {
    key: "contact-details",
    type: "contact",
    label: "Contact · details only",
    category: "Contact",
    description: "Just your contact details, no form.",
    create: () => createSection("contact", { data: { showForm: false } }),
  },
  {
    key: "text",
    type: "text",
    label: "Text + heading",
    category: "Content",
    description: "A heading and paragraphs, e.g. your story.",
    create: () => createSection("text"),
  },
  {
    key: "gallery-3",
    type: "gallery",
    label: "Gallery · 3 columns",
    category: "Portfolio",
    description: "Grid of photos or work samples.",
    create: () => createSection("gallery"),
  },
  {
    key: "gallery-4",
    type: "gallery",
    label: "Gallery · 4 columns",
    category: "Portfolio",
    description: "Denser photo grid, 2 per row on mobile.",
    create: () => createSection("gallery", { data: { columns: 4, mobileColumns: 2 } }),
  },
  {
    key: "logos",
    type: "logos",
    label: "Logo cloud",
    category: "Social proof",
    description: "Customer logos in a calm grayscale row.",
    create: () => createSection("logos", { settings: { spacing: "compact" } }),
  },
  {
    key: "stats",
    type: "stats",
    label: "Statistics",
    category: "Social proof",
    description: "Three headline numbers.",
    create: () => createSection("stats", { settings: { background: "surface" } }),
  },
  {
    key: "split-right",
    type: "split",
    label: "Split · image right",
    category: "Content",
    description: "Text and bullets, image on the right.",
    create: () => createSection("split"),
  },
  {
    key: "split-left",
    type: "split",
    label: "Split · image left",
    category: "Content",
    description: "Image on the left, text on the right.",
    create: () => createSection("split", { data: { imagePosition: "left" } }),
  },
  {
    key: "pricing",
    type: "pricing",
    label: "Pricing · 2 plans",
    category: "Pricing",
    description: "Two plans with the recommended one highlighted.",
    create: () => createSection("pricing"),
  },
  {
    key: "media-image",
    type: "media",
    label: "Large image",
    category: "Media",
    description: "One wide image with an optional caption.",
    create: () => createSection("media"),
  },
  {
    key: "media-video",
    type: "media",
    label: "Video",
    category: "Media",
    description: "A YouTube or Vimeo video.",
    create: () => createSection("media", { data: { kind: "video" } }),
  },
  {
    key: "team",
    type: "team",
    label: "Team",
    category: "Team",
    description: "Three people with role and photo.",
    create: () => createSection("team"),
  },
];
