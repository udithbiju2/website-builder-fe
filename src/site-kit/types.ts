/**
 * Builder data model shared by the editor preview, the AI builder and the
 * publish renderer. Everything here must stay JSON-serializable.
 */

import type { FontKey } from "./fonts.ts";

export type { FontKey };

export type ImageRef = {
  url: string;
  alt: string;
};

export type LinkRef = {
  label: string;
  href: string;
};

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

export const BRAND_DISPLAY_MODES = [
  "auto",
  "logo_left",
  "logo_right",
  "logo_top",
  "logo_only",
  "text_only",
] as const;

export type BrandDisplayMode = (typeof BRAND_DISPLAY_MODES)[number];

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
  logoDisplay?: BrandDisplayMode;
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
  logoDisplay?: BrandDisplayMode;
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

export type SectionCustomColors = {
  background?: string;
  text?: string;
  primary?: string;
  muted?: string;
  border?: string;
};

export type SectionSettings = {
  background: SectionBackground;
  hideOnMobile: boolean;
  hideOnDesktop?: boolean;
  /** Vertical padding; "default" (or unset) follows the theme's section spacing. */
  spacing?: SectionSpacing;
  align?: SectionAlign;
  /** In-page anchor id, so links like `#pricing` can jump to the section. */
  anchor?: string;
  customColors?: SectionCustomColors;
  /** Overrides the theme font for this section only; unset follows the theme. */
  font?: FontKey;
};

export type IconName =
  | "check"
  | "star"
  | "bolt"
  | "shield"
  | "heart"
  | "chat"
  | "gear"
  | "user"
  | "mail"
  | "phone"
  | "chart"
  | "clock"
  | "tools"
  | "bell"
  | "wallet"
  | "pointer"
  | "help"
  | "sparkles"
  | "rocket"
  | "layers"
  | "box"
  | "lock"
  | "cloud"
  | "code";

export const HERO_VARIANTS = [
  "centered",
  "split",
  "split-left",
  "background-image",
  "video-bg",
  "gradient",
  "curved-bottom",
  "soft-card",
  "minimal-typography",
  "floating-cards",
  "asymmetric",
] as const;

export type HeroVariant = (typeof HERO_VARIANTS)[number];

export type HeroFloatingCard = {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: string;
};

export type HeroRating = {
  stars?: number;
  text?: string;
  avatarCount?: number;
};

export type HeroTrustedBy = {
  label?: string;
  logos?: { label: string; url?: string }[];
};

export type HeroData = {
  variant: HeroVariant;
  eyebrow?: string;
  badgeIcon?: string;
  heading: string;
  highlightText?: string;
  subheading?: string;
  description?: string;
  primaryCta?: LinkRef;
  secondaryCta?: LinkRef;
  tertiaryCta?: LinkRef;
  buttons?: LinkRef[];
  mediaType?: "image" | "video" | "both";
  videoUrl?: string;
  videoAutoplay?: boolean;
  videoControls?: boolean;
  videoLoop?: boolean;
  image?: ImageRef;
  secondaryImage?: ImageRef;
  backgroundImage?: ImageRef;
  bgImagePosition?: "bottom" | "center" | "top" | "cover";
  bgOverlayType?: "dark" | "light" | "gradient" | "none";
  backgroundVideoUrl?: string;
  imagePosition?: "right" | "left" | "bottom" | "background" | "card";
  imageStyle?: "mockup" | "rounded" | "glow" | "shadow" | "plain";
  overlayOpacity?: number;
  overlayBlur?: boolean;
  minHeight?: "auto" | "compact" | "screen" | "tall";
  contentAlign?: "center" | "left" | "right";
  bottomShape?: "none" | "wave" | "curve" | "slant" | "tilt";
  rating?: HeroRating;
  floatingCards?: HeroFloatingCard[];
  trustedBy?: HeroTrustedBy;
};

export type GridColumns = 1 | 2 | 3 | 4;

export type FeatureColor =
  | "orange"
  | "green"
  | "blue"
  | "yellow"
  | "purple"
  | "pink"
  | "cyan"
  | "indigo"
  | "red"
  | "gray"
  | "none"
  | "default";

export type FeatureItem = {
  icon?: IconName | string;
  iconColor?: FeatureColor;
  backgroundColor?: string;
  badge?: string;
  title: string;
  description: string;
  link?: LinkRef;
  image?: ImageRef;
};

export type FeaturesData = {
  heading: string;
  eyebrow?: string;
  intro?: string;
  variant?: "grid" | "split" | "minimal" | "cards" | "pastel-icons";
  iconStyle?:
    | "pastel-circle"
    | "square-badge"
    | "minimal-accent"
    | "colored-circle"
    | "none";
  cardStyle?: "transparent" | "surface" | "bordered" | "glass";
  align?: "left" | "center";
  columns: GridColumns;
  mobileColumns: GridColumns;
  items: FeatureItem[];
  // Split showcase options
  splitPosition?: "left" | "right";
  splitImage?: ImageRef;
  splitCta?: LinkRef;
  secondaryCta?: LinkRef;
  bottomCta?: LinkRef;
};

export const SERVICES_VARIANTS = [
  "cards-grid",
  "bento-grid",
  "split-showcase",
  "interactive-list",
  "horizontal-cards",
  "minimal-numbered",
] as const;

export type ServicesVariant = (typeof SERVICES_VARIANTS)[number];

export type ServiceItem = {
  title: string;
  description: string;
  badge?: string;
  badgeColor?: FeatureColor;
  icon?: IconName | string;
  iconColor?: FeatureColor;
  image?: ImageRef;
  price?: string;
  duration?: string;
  features?: string[];
  link?: LinkRef;
  secondaryLink?: LinkRef;
  backgroundColor?: string;
  featured?: boolean;
};

export type ServicesData = {
  heading: string;
  eyebrow?: string;
  intro?: string;
  variant?: ServicesVariant;
  cardStyle?:
    | "surface"
    | "bordered"
    | "flat"
    | "glass"
    | "glow"
    | "elevated"
    | "gradient";
  iconStyle?:
    | "pastel-circle"
    | "square-badge"
    | "minimal-accent"
    | "colored-circle"
    | "glow-icon"
    | "none";
  imageAspect?: "16:9" | "4:3" | "1:1" | "21:9" | "auto";
  align?: "left" | "center";
  columns: GridColumns;
  mobileColumns: GridColumns;
  items: ServiceItem[];
  // Split showcase options
  splitPosition?: "left" | "right";
  splitImage?: ImageRef;
  splitTagline?: string;
  splitCta?: LinkRef;
  secondaryCta?: LinkRef;
  // Section bottom CTAs & toggles
  bottomCta?: LinkRef;
  bottomSecondaryCta?: LinkRef;
  showBadges?: boolean;
  showIcons?: boolean;
  showImages?: boolean;
  showPrices?: boolean;
  showBullets?: boolean;
  showNumbers?: boolean;
};

export type TestimonialsData = {
  heading: string;
  items: { quote: string; name: string; role?: string }[];
};

export const FAQ_VARIANTS = [
  "accordion-classic",
  "two-column-grid",
  "split-sidebar",
  "minimal-numbered",
  "categorized-cards",
] as const;
export type FaqVariant = (typeof FAQ_VARIANTS)[number];

export const FAQ_CARD_STYLES = [
  "default",
  "bordered",
  "flat",
  "glass",
  "elevated",
] as const;
export type FaqCardStyle = (typeof FAQ_CARD_STYLES)[number];

export type FaqItem = {
  question: string;
  answer: string;
  category?: string;
  badge?: string;
  isOpenDefault?: boolean;
};

export type FaqSupportCta = {
  title?: string;
  description?: string;
  link?: LinkRef;
};

export type FaqData = {
  variant?: FaqVariant;
  eyebrow?: string;
  heading: string;
  intro?: string;
  cardStyle?: FaqCardStyle;
  align?: SectionAlign;
  supportCta?: FaqSupportCta;
  items: FaqItem[];
};

export const CTA_VARIANTS = [
  "centered-card",
  "split-visual",
  "floating-card",
  "minimal-editorial",
] as const;
export type CtaVariant = (typeof CTA_VARIANTS)[number];

export const CTA_CARD_STYLES = [
  "default",
  "bordered",
  "flat",
  "glass",
  "elevated",
  "contrast",
] as const;
export type CtaCardStyle = (typeof CTA_CARD_STYLES)[number];

export type CtaMetric = {
  value: string;
  label: string;
  subtext?: string;
};

export type CtaData = {
  variant?: CtaVariant;
  eyebrow?: string;
  heading: string;
  text?: string;
  button: LinkRef;
  secondaryButton?: LinkRef;
  trustBadges?: string[];
  highlightMetric?: CtaMetric;
  cardStyle?: CtaCardStyle;
  align?: SectionAlign;
};

export const CONTACT_VARIANTS = [
  "split-form",
  "cards-hub",
  "minimal-editorial",
  "floating-glass",
] as const;
export type ContactVariant = (typeof CONTACT_VARIANTS)[number];

export const CONTACT_CARD_STYLES = [
  "default",
  "bordered",
  "flat",
  "glass",
  "elevated",
  "contrast",
] as const;
export type ContactCardStyle = (typeof CONTACT_CARD_STYLES)[number];

export type ContactChannel = {
  label: string;
  value: string;
  description?: string;
  icon?: "mail" | "phone" | "chat" | "user";
};

export type ContactData = {
  variant?: ContactVariant;
  eyebrow?: string;
  heading: string;
  text?: string;
  email?: string;
  phone?: string;
  address?: string;
  officeHours?: string;
  responseTime?: string;
  showForm: boolean;
  submitLabel: string;
  formHeading?: string;
  serviceOptions?: string[];
  channels?: ContactChannel[];
  cardStyle?: ContactCardStyle;
  align?: SectionAlign;
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

export const PRICING_VARIANTS = [
  "cards-grid",
  "minimal-monochrome",
  "spotlight-tier",
  "horizontal-rows",
] as const;
export type PricingVariant = (typeof PRICING_VARIANTS)[number];

export const PRICING_CARD_STYLES = [
  "default",
  "bordered",
  "flat",
  "glass",
  "elevated",
  "contrast",
] as const;
export type PricingCardStyle = (typeof PRICING_CARD_STYLES)[number];

export type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  originalPrice?: string;
  badge?: string;
  description?: string;
  features: string[];
  excludedFeatures?: string[];
  cta?: LinkRef;
  featured: boolean;
  highlightNote?: string;
};

export type PricingData = {
  variant?: PricingVariant;
  eyebrow?: string;
  heading: string;
  intro?: string;
  billingCycleLabel?: string;
  discountBadge?: string;
  footerNote?: string;
  cardStyle?: PricingCardStyle;
  columns?: GridColumns;
  mobileColumns?: GridColumns;
  align?: SectionAlign;
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

export const TEAM_VARIANTS = [
  "grid-cards",
  "spotlight-featured",
  "minimal-editorial",
  "glass-overlay",
] as const;
export type TeamVariant = (typeof TEAM_VARIANTS)[number];

export const TEAM_CARD_STYLES = [
  "default",
  "bordered",
  "flat",
  "glass",
  "elevated",
  "contrast",
] as const;
export type TeamCardStyle = (typeof TEAM_CARD_STYLES)[number];

export type TeamSocialPlatform = "linkedin" | "twitter" | "github" | "email" | "link";

export type TeamSocialLink = {
  platform: TeamSocialPlatform;
  url: string;
};

export type TeamMember = {
  name: string;
  role?: string;
  department?: string;
  bio?: string;
  location?: string;
  photo?: ImageRef;
  tags?: string[];
  link?: LinkRef;
  socialLinks?: TeamSocialLink[];
};

export type TeamData = {
  variant?: TeamVariant;
  eyebrow?: string;
  badge?: string;
  heading: string;
  intro?: string;
  cardStyle?: TeamCardStyle;
  align?: SectionAlign;
  columns: GridColumns;
  mobileColumns: GridColumns;
  members: TeamMember[];
};

export const CAROUSEL_VARIANTS = [
  "cards",
  "hero-slider",
  "showcase",
  "minimal-editorial",
  "image-gallery",
  "image-strip",
  "image-coverflow",
] as const;
export type CarouselVariant = (typeof CAROUSEL_VARIANTS)[number];

export const CAROUSEL_CARD_STYLES = [
  "default",
  "bordered",
  "flat",
  "glass",
  "elevated",
  "contrast",
] as const;
export type CarouselCardStyle = (typeof CAROUSEL_CARD_STYLES)[number];

export type CarouselSlide = {
  title: string;
  subtitle?: string;
  description?: string;
  caption?: string;
  badge?: string;
  image?: ImageRef;
  button?: LinkRef;
  secondaryButton?: LinkRef;
};

export type CarouselData = {
  variant?: CarouselVariant;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  badge?: string;
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showThumbnails?: boolean;
  imageAspect?: "16:9" | "4:3" | "1:1" | "21:9" | "3:4";
  columns?: GridColumns;
  pauseOnHover?: boolean;
  cardStyle?: CarouselCardStyle;
  align?: SectionAlign;
};

export const MARQUEE_VARIANTS = [
  "ticker-text",
  "cards-stream",
  "pill-badges",
  "dual-directional",
] as const;
export type MarqueeVariant = (typeof MARQUEE_VARIANTS)[number];

export type MarqueeItem = {
  text: string;
  badge?: string;
  icon?: IconName;
  link?: string;
  subtext?: string;
};

export type MarqueeData = {
  variant?: MarqueeVariant;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items: MarqueeItem[];
  secondaryItems?: MarqueeItem[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gradientFades?: boolean;
  fontSize?: "small" | "medium" | "large" | "huge";
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
  carousel: CarouselData;
  marquee: MarqueeData;
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
