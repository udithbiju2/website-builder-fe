/**
 * Builder data model shared by the editor preview, the AI builder and the
 * publish renderer. Everything here must stay JSON-serializable.
 */

export type ImageRef = {
  url: string;
  alt: string;
};

export type LinkRef = {
  label: string;
  href: string;
};

export type FontKey = "plex-sans" | "system" | "serif" | "mono";
export type ButtonStyle = "filled" | "outline";
export type CardStyle = "border" | "shadow" | "flat";
export type RadiusSize = "none" | "sm" | "md" | "lg";
export type SpacingSize = "compact" | "normal" | "relaxed";

export type ThemeSettings = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  fonts: {
    heading: FontKey;
    body: FontKey;
  };
  buttonStyle: ButtonStyle;
  cardStyle: CardStyle;
  radius: RadiusSize;
  /** Max content width in px. */
  containerWidth: number;
  sectionSpacing: SpacingSize;
};

export type HeaderDesign = "logo-left" | "centered";

export type HeaderData = {
  design: HeaderDesign;
  siteName: string;
  logo?: ImageRef;
  menu: LinkRef[];
  cta?: LinkRef;
  announcement?: string;
  sticky: boolean;
};

export type FooterDesign = "columns" | "simple";

export type FooterData = {
  design: FooterDesign;
  siteName: string;
  logo?: ImageRef;
  description?: string;
  columns: { title: string; links: LinkRef[] }[];
  contact?: { email?: string; phone?: string; address?: string };
  social: LinkRef[];
  copyright: string;
};

export type SectionBackground = "default" | "surface" | "primary";

export type SectionSettings = {
  background: SectionBackground;
  hideOnMobile: boolean;
};

export type IconName = "check" | "star" | "bolt" | "shield" | "heart" | "chat";

export type HeroData = {
  variant: "centered" | "split";
  eyebrow?: string;
  heading: string;
  subheading?: string;
  primaryCta?: LinkRef;
  secondaryCta?: LinkRef;
  image?: ImageRef;
};

export type GridColumns = 1 | 2 | 3 | 4;

export type FeaturesData = {
  heading: string;
  intro?: string;
  columns: GridColumns;
  mobileColumns: GridColumns;
  items: { icon?: IconName; title: string; description: string }[];
};

export type ServicesData = {
  heading: string;
  intro?: string;
  columns: GridColumns;
  mobileColumns: GridColumns;
  items: { title: string; description: string; image?: ImageRef; link?: LinkRef }[];
};

export type TestimonialsData = {
  heading: string;
  items: { quote: string; name: string; role?: string }[];
};

export type FaqData = {
  heading: string;
  intro?: string;
  items: { question: string; answer: string }[];
};

export type CtaData = {
  heading: string;
  text?: string;
  button: LinkRef;
};

export type ContactData = {
  heading: string;
  text?: string;
  email?: string;
  phone?: string;
  address?: string;
  showForm: boolean;
  submitLabel: string;
};

export type TextData = {
  heading?: string;
  /** Plain text; blank lines separate paragraphs. Never rendered as HTML. */
  body: string;
};

export type GalleryData = {
  heading?: string;
  columns: GridColumns;
  mobileColumns: GridColumns;
  images: ImageRef[];
};

export type SectionDataMap = {
  hero: HeroData;
  features: FeaturesData;
  services: ServicesData;
  testimonials: TestimonialsData;
  faq: FaqData;
  cta: CtaData;
  contact: ContactData;
  text: TextData;
  gallery: GalleryData;
};

export type SectionType = keyof SectionDataMap;

/** Distributes over unions, so `SectionOf<"hero" | "faq">` is a discriminated union. */
export type SectionOf<T extends SectionType> = T extends SectionType
  ? {
      id: string;
      type: T;
      hidden: boolean;
      settings: SectionSettings;
      data: SectionDataMap[T];
    }
  : never;

export type Section = SectionOf<SectionType>;

export type PageData = {
  id: string;
  name: string;
  /** "/" for home, otherwise "/about" style. */
  slug: string;
  sections: Section[];
};

export type SiteData = {
  theme: ThemeSettings;
  header: HeaderData;
  footer: FooterData;
  pages: PageData[];
};
