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

export const HEADER_DESIGNS = [
  "logo-left",
  "centered",
  "classical",
  "minimalist",
  "comprehensive",
  "ecommerce",
  "floating",
  "transparent",
] as const;

export type HeaderDesign = (typeof HEADER_DESIGNS)[number];

export type HeaderSubMenuItem = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  icon?: string;
};

export type HeaderMenuItem = {
  label: string;
  href: string;
  badge?: string;
  icon?: string;
  children?: HeaderSubMenuItem[];
};

export type HeaderData = {
  design: HeaderDesign;
  siteName: string;
  logo?: ImageRef;
  menu: HeaderMenuItem[];
  cta?: LinkRef;
  secondaryCta?: LinkRef;
  announcement?: string;
  announcementLink?: LinkRef;
  position?: "static" | "sticky" | "fixed" | "floating";
  sticky: boolean;
  overlay?: boolean;
  showSearch?: boolean;
  showAccount?: boolean;
  showCart?: boolean;
  cartCount?: number;
  currency?: string;
  mobileMenuType?: "drawer" | "fullscreen" | "dropdown";
  hidden?: boolean;
};

export const FOOTER_DESIGNS = [
  "columns",
  "simple",
  "mega",
  "newsletter",
  "split",
  "inline",
  "centered",
  "cta-banner",
] as const;

export type FooterDesign = (typeof FOOTER_DESIGNS)[number];

export type FooterNewsletter = {
  enabled?: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
};

export type FooterCtaBanner = {
  enabled?: boolean;
  heading?: string;
  subheading?: string;
  primaryCta?: LinkRef;
  secondaryCta?: LinkRef;
};

export type FooterPaymentMethods = {
  enabled?: boolean;
  methods?: string[];
};

export type FooterContact = {
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
};

export type FooterData = {
  design: FooterDesign;
  siteName: string;
  logo?: ImageRef;
  tagline?: string;
  description?: string;
  columns: { title: string; links: LinkRef[] }[];
  menu?: LinkRef[];
  contact?: FooterContact;
  social: LinkRef[];
  newsletter?: FooterNewsletter;
  ctaBanner?: FooterCtaBanner;
  paymentMethods?: FooterPaymentMethods;
  legalLinks?: LinkRef[];
  copyright: string;
  themeMode?: "dark" | "light" | "auto";
  hidden?: boolean;
};

export type SectionBackground = "default" | "surface" | "primary" | "dark";
export type SectionSpacing = "none" | "compact" | "default" | "relaxed";
export type SectionAlign = "center" | "left";

export type SectionSettings = {
  background: SectionBackground;
  hideOnMobile: boolean;
  hideOnDesktop?: boolean;
  /** Vertical padding; "default" (or unset) follows the theme's section spacing. */
  spacing?: SectionSpacing;
  align?: SectionAlign;
  /** In-page anchor id, so links like `#pricing` can jump to the section. */
  anchor?: string;
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

export type LogosData = {
  heading?: string;
  grayscale: boolean;
  logos: ImageRef[];
};

export type SplitData = {
  eyebrow?: string;
  heading: string;
  /** Plain text; blank lines separate paragraphs. */
  body: string;
  bullets: string[];
  image?: ImageRef;
  imagePosition: "left" | "right";
  cta?: LinkRef;
};

export type StatsData = {
  heading?: string;
  intro?: string;
  items: { value: string; label: string }[];
};

export type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta?: LinkRef;
  featured: boolean;
};

export type PricingData = {
  heading: string;
  intro?: string;
  plans: PricingPlan[];
};

export type MediaAspect = "16:9" | "4:3" | "1:1";

export type MediaData = {
  heading?: string;
  caption?: string;
  kind: "image" | "video";
  image?: ImageRef;
  /** YouTube or Vimeo page URL, rendered only as a privacy-enhanced embed. */
  videoUrl?: string;
  aspect: MediaAspect;
  width: "contained" | "wide";
};

export type TeamMember = {
  name: string;
  role?: string;
  bio?: string;
  photo?: ImageRef;
  link?: LinkRef;
};

export type TeamData = {
  heading: string;
  intro?: string;
  columns: GridColumns;
  mobileColumns: GridColumns;
  members: TeamMember[];
};

export type SectionDataMap = {
  header: HeaderData;
  footer: FooterData;
  hero: HeroData;
  features: FeaturesData;
  services: ServicesData;
  testimonials: TestimonialsData;
  faq: FaqData;
  cta: CtaData;
  contact: ContactData;
  text: TextData;
  gallery: GalleryData;
  logos: LogosData;
  split: SplitData;
  stats: StatsData;
  pricing: PricingData;
  media: MediaData;
  team: TeamData;
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
