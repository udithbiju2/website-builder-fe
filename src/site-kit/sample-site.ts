import { DEFAULT_SECTION_SETTINGS } from "./registry.ts";
import { DEFAULT_THEME } from "./theme.ts";
import type { ImageRef, Section, SectionSettings, SiteData } from "./types.ts";

function placeholder(label: string, color: string, width = 1200, height = 800): ImageRef {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="${color}"/>` +
    `<text x="50%" y="50%" fill="#ffffff" fill-opacity="0.85" font-family="sans-serif" font-size="${Math.round(height / 12)}" ` +
    `text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return { url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, alt: label };
}

function settings(overrides: Partial<SectionSettings> = {}): SectionSettings {
  return { ...DEFAULT_SECTION_SETTINGS, ...overrides };
}

const HOME_SECTIONS: Section[] = [
  {
    id: "sample-hero",
    type: "hero",
    hidden: false,
    settings: settings(),
    data: {
      variant: "split",
      eyebrow: "Digital marketing agency",
      heading: "Grow your business with campaigns that convert",
      subheading: "We plan, launch and optimise marketing for small and mid-sized businesses, so you can focus on running yours.",
      primaryCta: { label: "Get a free quote", href: "/contact" },
      secondaryCta: { label: "Our services", href: "/services" },
      image: placeholder("Hero image", "#0f7b6c"),
    },
  },
  {
    id: "sample-features",
    type: "features",
    hidden: false,
    settings: settings({ background: "surface" }),
    data: {
      heading: "Why clients work with us",
      intro: "A small senior team, clear reporting and no long lock-in contracts.",
      columns: 3,
      mobileColumns: 1,
      items: [
        { icon: "bolt", title: "Quick launch", description: "Campaigns live within two weeks of kickoff." },
        { icon: "chat", title: "Clear reporting", description: "Monthly reports in plain language, not jargon." },
        { icon: "shield", title: "No lock-in", description: "Month-to-month plans you can cancel any time." },
      ],
    },
  },
  {
    id: "sample-services",
    type: "services",
    hidden: false,
    settings: settings(),
    data: {
      heading: "Services",
      intro: "Everything you need to be found and chosen online.",
      columns: 3,
      mobileColumns: 1,
      items: [
        {
          title: "Search marketing",
          description: "SEO and paid search that bring in qualified visitors.",
          image: placeholder("Search", "#134e4a"),
          link: { label: "Learn more", href: "/services" },
        },
        {
          title: "Social media",
          description: "Content and ads on the platforms your customers use.",
          image: placeholder("Social", "#b4410f"),
          link: { label: "Learn more", href: "/services" },
        },
        {
          title: "Websites",
          description: "Fast, clear websites built to turn visitors into leads.",
          image: placeholder("Web", "#1a1d23"),
          link: { label: "Learn more", href: "/services" },
        },
      ],
    },
  },
  {
    id: "sample-testimonials",
    type: "testimonials",
    hidden: false,
    settings: settings({ background: "surface" }),
    data: {
      heading: "What our clients say",
      items: [
        { quote: "Our enquiries doubled in three months.", name: "Priya Sharma", role: "Owner, Bloom Florist" },
        { quote: "Finally an agency that explains what they do.", name: "Daniel Lee", role: "Director, Lee Builders" },
        { quote: "Responsive, honest and great results.", name: "Amina Yusuf", role: "Founder, Yusuf Legal" },
      ],
    },
  },
  {
    id: "sample-faq",
    type: "faq",
    hidden: false,
    settings: settings(),
    data: {
      heading: "Frequently asked questions",
      items: [
        { question: "How long until I see results?", answer: "Paid campaigns show results within weeks; SEO usually takes three to six months." },
        { question: "Do I need a long contract?", answer: "No. All plans are month-to-month." },
        { question: "Can you work with my existing website?", answer: "Yes. We audit what you have and improve it where needed." },
      ],
    },
  },
  {
    id: "sample-cta",
    type: "cta",
    hidden: false,
    settings: settings({ background: "primary" }),
    data: {
      heading: "Ready to grow?",
      text: "Book a free 30-minute call and get a plan for your business.",
      button: { label: "Book a call", href: "/contact" },
    },
  },
  {
    id: "sample-contact",
    type: "contact",
    hidden: false,
    settings: settings(),
    data: {
      heading: "Get in touch",
      text: "Tell us about your business and we will reply within one working day.",
      email: "hello@example.com",
      phone: "+91 98765 43210",
      address: "12 Market Street, Bengaluru",
      showForm: true,
      submitLabel: "Send message",
    },
  },
];

export const SAMPLE_SITE: SiteData = {
  theme: DEFAULT_THEME,
  header: {
    design: "logo-left",
    siteName: "Northwind Digital",
    menu: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Get a quote", href: "/contact" },
    announcement: "Free marketing audit for new clients this month",
    sticky: true,
  },
  footer: {
    design: "columns",
    siteName: "Northwind Digital",
    description: "Marketing for small and mid-sized businesses.",
    columns: [
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Services", href: "/services" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Search marketing", href: "/services" },
          { label: "Social media", href: "/services" },
          { label: "Websites", href: "/services" },
        ],
      },
    ],
    contact: { email: "hello@example.com", phone: "+91 98765 43210", address: "Bengaluru, India" },
    social: [
      { label: "LinkedIn", href: "https://www.linkedin.com" },
      { label: "Instagram", href: "https://www.instagram.com" },
    ],
    copyright: "© 2026 Northwind Digital",
  },
  pages: [{ id: "sample-home", name: "Home", slug: "/", sections: HOME_SECTIONS }],
};
