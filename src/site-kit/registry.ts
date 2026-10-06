import type {
  Section,
  SectionDataMap,
  SectionOf,
  SectionSettings,
  SectionType,
} from "./types.ts";

export type SectionCategory =
  | "Header"
  | "Footer"
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

export const SECTION_DEFINITIONS: { [T in SectionType]: SectionDefinition<T> } =
  {
    header: {
      type: "header",
      label: "Header",
      category: "Header",
      description:
        "Site header with brand logo, navigation menu, and optional action button.",
      createData: () => ({
        design: "logo-left",
        siteName: "My Website",
        menu: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
        sticky: false,
      }),
    },
    footer: {
      type: "footer",
      label: "Footer",
      category: "Footer",
      description:
        "Site footer with brand info, link columns, contact info, and copyright.",
      createData: () => ({
        design: "columns",
        siteName: "My Website",
        copyright: "© My Website. All rights reserved.",
        columns: [
          {
            title: "Navigation",
            links: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ],
          },
        ],
        social: [],
      }),
    },
    hero: {
      type: "hero",
      label: "Hero",
      category: "Hero",
      description:
        "Large heading, supporting text and call-to-action buttons. Centered or two-column.",
      createData: () => ({
        variant: "centered",
        heading: "Your headline goes here",
        subheading:
          "Explain in one or two sentences what you offer and who it is for.",
        primaryCta: { label: "Get started", href: "/contact" },
      }),
    },
    features: {
      type: "features",
      label: "Features",
      category: "Features",
      description:
        "Customizable feature grid or split showcase with modern icon badges and clean typography.",
      createData: () => ({
        variant: "pastel-icons",
        heading: "Our Features",
        intro:
          "Unleash your creativity with a visual collaboration platform that enables effective ideation.",
        columns: 4,
        mobileColumns: 2,
        bottomCta: { label: "Learn more", href: "/features" },
        items: [
          {
            icon: "gear",
            iconColor: "orange",
            title: "Choosing a Service",
            description: "Choosing an accountant that matches your needs.",
          },
          {
            icon: "user",
            iconColor: "green",
            title: "Our Clients Say",
            description: "Read the reviews from some of our satisfied clients.",
          },
          {
            icon: "mail",
            iconColor: "yellow",
            title: "Initial Consultation",
            description: "Understanding your accountancy requirements.",
          },
          {
            icon: "phone",
            iconColor: "cyan",
            title: "Request a Callback",
            description: "Let's talk at a more convenient time for you.",
          },
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
          {
            title: "Service one",
            description: "A short description of this service.",
          },
          {
            title: "Service two",
            description: "A short description of this service.",
          },
          {
            title: "Service three",
            description: "A short description of this service.",
          },
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
          {
            quote: "Add a short quote from a happy customer.",
            name: "Customer name",
            role: "Company",
          },
          {
            quote: "Add a short quote from a happy customer.",
            name: "Customer name",
            role: "Company",
          },
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
          {
            question: "Add a common question?",
            answer: "Answer it clearly in a sentence or two.",
          },
          {
            question: "Add another question?",
            answer: "Answer it clearly in a sentence or two.",
          },
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
            features: [
              "Everything in Starter",
              "Third feature",
              "Priority support",
            ],
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
  overrides: {
    data?: Partial<SectionDataMap[T]>;
    settings?: Partial<SectionSettings>;
  } = {},
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
    key: "header-classical",
    type: "header",
    label: "Classical header",
    category: "Header",
    description: "Logo left, centered nav with dropdowns, dual action buttons.",
    create: () =>
      createSection("header", {
        data: {
          design: "classical",
          siteName: "Modulus",
          menu: [
            {
              label: "Solutions",
              href: "/solutions",
              children: [
                {
                  label: "Analytics",
                  href: "/analytics",
                  description: "Real-time metrics & reporting",
                },
                {
                  label: "Engagement",
                  href: "/engagement",
                  description: "Automated customer workflows",
                },
              ],
            },
            { label: "About us", href: "/about" },
            { label: "Pricing", href: "/pricing" },
            { label: "Resources", href: "/resources" },
          ],
          secondaryCta: { label: "Log in", href: "/login" },
          cta: { label: "Sign up", href: "/signup" },
          sticky: true,
        },
      }),
  },
  {
    key: "header-minimalist",
    type: "header",
    label: "Minimalist header",
    category: "Header",
    description: "Nav on left, centered logo, sign in and CTA on right.",
    create: () =>
      createSection("header", {
        data: {
          design: "minimalist",
          siteName: "Modulus",
          menu: [
            { label: "Solutions", href: "/solutions" },
            { label: "About us", href: "/about" },
            { label: "Pricing", href: "/pricing" },
          ],
          secondaryCta: { label: "Sign in", href: "/login" },
          cta: { label: "Try for free", href: "/signup" },
          sticky: true,
        },
      }),
  },
  {
    key: "header-comprehensive",
    type: "header",
    label: "Comprehensive header",
    category: "Header",
    description: "Mega dropdowns, search trigger, sales & booking CTAs.",
    create: () =>
      createSection("header", {
        data: {
          design: "comprehensive",
          siteName: "Modulus",
          menu: [
            {
              label: "Product",
              href: "/product",
              children: [
                {
                  label: "Core Engine",
                  href: "/core",
                  description: "Fast scalable foundation",
                },
                {
                  label: "Integrations",
                  href: "/integrations",
                  description: "Connect 100+ tools",
                },
              ],
            },
            {
              label: "Solutions",
              href: "/solutions",
              children: [
                {
                  label: "For Startups",
                  href: "/startups",
                  description: "Build & launch fast",
                },
                {
                  label: "For Enterprise",
                  href: "/enterprise",
                  description: "Custom compliance & security",
                },
              ],
            },
            { label: "Company", href: "/company" },
            { label: "Customers", href: "/customers" },
            { label: "App", href: "/app" },
          ],
          showSearch: true,
          secondaryCta: { label: "Contact Sales", href: "/contact" },
          cta: { label: "Book a demo", href: "/demo" },
          sticky: true,
        },
      }),
  },
  {
    key: "header-ecommerce",
    type: "header",
    label: "E-commerce header",
    category: "Header",
    description:
      "Top utility bar with search, cart badge, and bottom category tabs.",
    create: () =>
      createSection("header", {
        data: {
          design: "ecommerce",
          siteName: "Modulus",
          menu: [
            { label: "Products", href: "/products" },
            { label: "Solutions", href: "/solutions" },
            { label: "Categories", href: "/categories" },
            { label: "App", href: "/app" },
            { label: "Resources", href: "/resources" },
            { label: "Affiliates", href: "/affiliates" },
            { label: "About", href: "/about" },
          ],
          showSearch: true,
          showAccount: true,
          showCart: true,
          cartCount: 1,
          currency: "USD $",
          sticky: true,
        },
      }),
  },
  {
    key: "header-floating",
    type: "header",
    label: "Floating pill header",
    category: "Header",
    description:
      "Modern blurred floating island navbar with rounded pill styling.",
    create: () =>
      createSection("header", {
        data: {
          design: "floating",
          siteName: "Modulus",
          menu: [
            { label: "Courses", href: "/courses" },
            { label: "Platform", href: "/platform" },
            { label: "Lectors", href: "/lectors" },
            { label: "Community", href: "/community" },
          ],
          secondaryCta: { label: "Sign in", href: "/login" },
          cta: { label: "Start Learning", href: "/signup" },
          position: "floating",
          sticky: true,
        },
      }),
  },
  {
    key: "header-transparent",
    type: "header",
    label: "Transparent overlay",
    category: "Header",
    description: "Transparent overlay header floating over hero sections.",
    create: () =>
      createSection("header", {
        data: {
          design: "transparent",
          siteName: "Modulus",
          overlay: true,
          menu: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "About", href: "/about" },
          ],
          cta: { label: "Get started", href: "/signup" },
          sticky: false,
        },
      }),
  },
  {
    key: "header-logo-left",
    type: "header",
    label: "Header · logo left",
    category: "Header",
    description: "Brand on left, navigation links and button on right.",
    create: () => createSection("header"),
  },
  {
    key: "header-centered",
    type: "header",
    label: "Header · centered",
    category: "Header",
    description: "Centered logo and navigation links.",
    create: () => createSection("header", { data: { design: "centered" } }),
  },
  {
    key: "footer-mega",
    type: "footer",
    label: "Footer · mega store",
    category: "Footer",
    description:
      "E-commerce footer with social icons, category columns, contact info, and payment badges.",
    create: () =>
      createSection("footer", {
        data: {
          design: "mega",
          siteName: "YOURSTORE",
          tagline: "Online Store",
          description:
            "Quality goods delivered worldwide. Dedicated customer support 24/7.",
          columns: [
            {
              title: "Categories",
              links: [
                { label: "Outdoors", href: "/outdoors" },
                { label: "Jewellery", href: "/jewellery" },
                { label: "Footwear", href: "/footwear" },
                { label: "Men", href: "/men" },
                { label: "Women", href: "/women" },
              ],
            },
            {
              title: "Information",
              links: [
                { label: "Specials", href: "/specials" },
                { label: "New Products", href: "/new" },
                { label: "Best Sellers", href: "/bestsellers" },
                { label: "Our Stores", href: "/stores" },
                { label: "Contact Us", href: "/contact" },
              ],
            },
            {
              title: "My Account",
              links: [
                { label: "My Orders", href: "/orders" },
                { label: "My Credit Slips", href: "/credit-slips" },
                { label: "My Addresses", href: "/addresses" },
                { label: "My Personal Info", href: "/account" },
              ],
            },
          ],
          contact: {
            title: "Contact Us",
            address: "42 Avenue Des Champs-Elysées, 75008 Paris, France",
            phone: "0123-456-789",
            email: "sales@yourcompany.com",
          },
          social: [
            { label: "Facebook", href: "https://facebook.com" },
            { label: "Twitter", href: "https://twitter.com" },
            { label: "Instagram", href: "https://instagram.com" },
            { label: "Pinterest", href: "https://pinterest.com" },
          ],
          paymentMethods: {
            enabled: true,
            methods: ["paypal", "amex", "discover", "mastercard", "visa"],
          },
          legalLinks: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
          ],
          copyright: "© 2026 YourStore. All rights reserved.",
        },
      }),
  },
  {
    key: "footer-newsletter",
    type: "footer",
    label: "Footer · newsletter & links",
    category: "Footer",
    description:
      "Horizontal navigation bar, contact details, newsletter signup, and payment methods.",
    create: () =>
      createSection("footer", {
        data: {
          design: "newsletter",
          siteName: "YOURSTORE",
          tagline: "Online Store",
          menu: [
            { label: "Woman", href: "/woman" },
            { label: "Man", href: "/man" },
            { label: "Lookbook", href: "/lookbook" },
            { label: "Sale", href: "/sale" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ],
          newsletter: {
            enabled: true,
            title: "Subscribe to News",
            description: "Get updates on new releases and promotions.",
            placeholder: "Enter email address",
            buttonText: "Subscribe",
          },
          contact: {
            address: "42 Avenue Des Champs-Elysées, 75008 Paris",
            phone: "0123-456-789",
            email: "sales@yourcompany.com",
          },
          social: [
            { label: "Facebook", href: "https://facebook.com" },
            { label: "Twitter", href: "https://twitter.com" },
            { label: "Instagram", href: "https://instagram.com" },
            { label: "Pinterest", href: "https://pinterest.com" },
          ],
          paymentMethods: {
            enabled: true,
            methods: ["paypal", "amex", "discover", "mastercard", "visa"],
          },
          copyright: "© 2026 YourStore. All rights reserved.",
        },
      }),
  },
  {
    key: "footer-split",
    type: "footer",
    label: "Footer · split navigation",
    category: "Footer",
    description:
      "Brand & social on left, horizontal links in middle, contact & payment badges on right.",
    create: () =>
      createSection("footer", {
        data: {
          design: "split",
          siteName: "YOURSTORE",
          tagline: "Online Store",
          menu: [
            { label: "Woman", href: "/woman" },
            { label: "Man", href: "/man" },
            { label: "Lookbook", href: "/lookbook" },
            { label: "Sale", href: "/sale" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ],
          contact: {
            address: "42 Avenue Des Champs-Elysées, Paris",
            phone: "0123-456-789",
          },
          social: [
            { label: "Facebook", href: "https://facebook.com" },
            { label: "Twitter", href: "https://twitter.com" },
            { label: "Instagram", href: "https://instagram.com" },
            { label: "Pinterest", href: "https://pinterest.com" },
          ],
          paymentMethods: {
            enabled: true,
            methods: ["paypal", "amex", "discover", "mastercard", "visa"],
          },
          copyright: "Design by Web builder · All Right Reserved",
        },
      }),
  },
  {
    key: "footer-inline",
    type: "footer",
    label: "Footer · inline logo & links",
    category: "Footer",
    description:
      "Minimal single-tier bar with logo, horizontal navigation links, and circular social icons.",
    create: () =>
      createSection("footer", {
        data: {
          design: "inline",
          siteName: "YOURSTORE",
          menu: [
            { label: "Woman", href: "/woman" },
            { label: "Man", href: "/man" },
            { label: "Lookbook", href: "/lookbook" },
            { label: "Sale", href: "/sale" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ],
          social: [
            { label: "Facebook", href: "https://facebook.com" },
            { label: "Twitter", href: "https://twitter.com" },
            { label: "Instagram", href: "https://instagram.com" },
            { label: "Pinterest", href: "https://pinterest.com" },
          ],
          copyright: "© 2026 YourStore. All rights reserved.",
        },
      }),
  },
  {
    key: "footer-centered",
    type: "footer",
    label: "Footer · centered brand",
    category: "Footer",
    description:
      "Centered brand logo, navigation links, social button row, and contact/copyright info.",
    create: () =>
      createSection("footer", {
        data: {
          design: "centered",
          siteName: "YOURSTORE",
          tagline: "Online Store",
          menu: [
            { label: "Woman", href: "/woman" },
            { label: "Man", href: "/man" },
            { label: "Lookbook", href: "/lookbook" },
            { label: "Sale", href: "/sale" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ],
          social: [
            { label: "Facebook", href: "https://facebook.com" },
            { label: "Twitter", href: "https://twitter.com" },
            { label: "Instagram", href: "https://instagram.com" },
            { label: "Pinterest", href: "https://pinterest.com" },
          ],
          contact: {
            address: "42 Avenue Des Champs-Elysées, 75008 Paris, France",
            phone: "0123-456-789",
            email: "sales@yourcompany.com",
          },
          copyright: "© 2026 YourStore. All rights reserved.",
        },
      }),
  },
  {
    key: "footer-cta-banner",
    type: "footer",
    label: "Footer · CTA banner",
    category: "Footer",
    description:
      "Prominent call-to-action banner atop link columns, social links, and copyright.",
    create: () =>
      createSection("footer", {
        data: {
          design: "cta-banner",
          siteName: "Acme Inc.",
          ctaBanner: {
            enabled: true,
            heading: "Ready to grow your online store?",
            subheading:
              "Join over 10,000+ happy merchants and launch in minutes.",
            primaryCta: { label: "Get started free", href: "/signup" },
            secondaryCta: { label: "Book a demo", href: "/demo" },
          },
          columns: [
            {
              title: "Product",
              links: [
                { label: "Features", href: "/features" },
                { label: "Integrations", href: "/integrations" },
                { label: "Pricing", href: "/pricing" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
              ],
            },
          ],
          social: [
            { label: "Twitter", href: "https://twitter.com" },
            { label: "GitHub", href: "https://github.com" },
            { label: "LinkedIn", href: "https://linkedin.com" },
          ],
          legalLinks: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
          ],
          copyright: "© 2026 Acme Inc. All rights reserved.",
        },
      }),
  },
  {
    key: "footer-columns",
    type: "footer",
    label: "Footer · multi-column",
    category: "Footer",
    description:
      "Brand summary, organized link columns, contact info, and social links.",
    create: () => createSection("footer"),
  },
  {
    key: "footer-simple",
    type: "footer",
    label: "Footer · simple",
    category: "Footer",
    description: "Minimal single-line footer with copyright and social links.",
    create: () => createSection("footer", { data: { design: "simple" } }),
  },
  {
    key: "hero-centered",
    type: "hero",
    label: "Hero · centered",
    category: "Hero",
    description:
      "Centered headline with badge and dual action buttons.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "centered",
          eyebrow: "Next-Gen Platform",
          badgeIcon: "✨",
          heading: "Build and scale your next big idea faster",
          highlightText: "faster",
          subheading:
            "Everything you need to launch a modern, high-converting digital experience in minutes.",
          primaryCta: { label: "Get started free", href: "/signup" },
          secondaryCta: { label: "Book a demo", href: "/demo" },
        },
      }),
  },
  {
    key: "hero-split",
    type: "hero",
    label: "Hero · split screen",
    category: "Hero",
    description: "Side-by-side headline, CTAs, and visual mockup with left/right toggle.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "split",
          imagePosition: "right",
          eyebrow: "Product Showcase",
          badgeIcon: "⚡",
          heading: "The smarter way to build websites",
          highlightText: "smarter way",
          subheading:
            "Design, iterate, and publish pixel-perfect web pages with full creative control.",
          primaryCta: { label: "Start free trial", href: "/signup" },
          tertiaryCta: { label: "Watch 2-min demo", href: "#demo" },
          imageStyle: "mockup",
        },
      }),
  },
  {
    key: "hero-platform-showcase",
    type: "hero",
    label: "Hero · platform showcase",
    category: "Hero",
    description:
      "Split screen hero with glowing platform dashboard visual and dual action buttons.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "split",
          eyebrow: "Growth Platform",
          badgeIcon: "🚀",
          heading: "Turn visitors into lifelong customers",
          highlightText: "lifelong customers",
          subheading:
            "Automate marketing, streamline workflows, and grow revenue effortlessly.",
          primaryCta: { label: "Get started", href: "/signup" },
          secondaryCta: { label: "View pricing", href: "/pricing" },
          image: {
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
            alt: "Platform growth metrics and analytics dashboard",
          },
          imageStyle: "glow",
        },
      }),
  },
  {
    key: "hero-gradient",
    type: "hero",
    label: "Hero · vibrant gradient",
    category: "Hero",
    description:
      "Modern radial mesh glow background with centered typography and trusted logos.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "gradient",
          eyebrow: "AI Powered Web Engine",
          badgeIcon: "🔥",
          heading: "Ship stunning digital experiences effortlessly",
          highlightText: "effortlessly",
          subheading:
            "From idea to live production site in minutes. No complex setup or maintenance required.",
          primaryCta: { label: "Launch your site", href: "/signup" },
          secondaryCta: { label: "Browse templates", href: "/templates" },
          trustedBy: {
            label: "Trusted by founders and product leaders worldwide",
            logos: [
              { label: "ACME Corp" },
              { label: "HyperScale" },
              { label: "Vortex Labs" },
              { label: "Pulse AI" },
            ],
          },
        },
      }),
  },
  {
    key: "hero-curved-bottom",
    type: "hero",
    label: "Hero · curved bottom wave",
    category: "Hero",
    description:
      "Hero with dynamic SVG wave bottom divider connecting smoothly to the next section.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "curved-bottom",
          bottomShape: "wave",
          eyebrow: "Creative Freedom",
          heading: "Design without limits or constraints",
          highlightText: "without limits",
          subheading:
            "Create gorgeous modern web pages tailored to your brand identity.",
          primaryCta: { label: "Get started today", href: "/signup" },
        },
      }),
  },
  {
    key: "hero-soft-card",
    type: "hero",
    label: "Hero · soft card container",
    category: "Hero",
    description:
      "Elevated rounded card container with glassmorphic border and soft shadow.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "soft-card",
          eyebrow: "Enterprise Ready",
          heading: "The all-in-one workspace for modern digital teams",
          highlightText: "all-in-one",
          subheading:
            "Collaborate, design, and manage your online presence seamlessly in one unified hub.",
          primaryCta: { label: "Start enterprise trial", href: "/signup" },
          secondaryCta: { label: "Contact sales", href: "/contact" },
          imageStyle: "mockup",
        },
      }),
  },
  {
    key: "hero-minimal-typography",
    type: "hero",
    label: "Hero · minimal bold typography",
    category: "Hero",
    description:
      "Bold oversized typography statement hero with clean dual buttons.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "minimal-typography",
          eyebrow: "Simplicity First",
          heading: "Design crafted for clarity.",
          subheading:
            "We build intuitive, high-performance web products that leave a lasting impression.",
          primaryCta: { label: "View our work", href: "/services" },
          secondaryCta: { label: "Get in touch", href: "/contact" },
        },
      }),
  },
  {
    key: "hero-asymmetric",
    type: "hero",
    label: "Hero · asymmetric layout",
    category: "Hero",
    description: "Modern offset asymmetric grid with angled visual card.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "asymmetric",
          eyebrow: "Modern Architecture",
          heading: "Reimagining the future of digital commerce",
          highlightText: "future",
          subheading:
            "Deliver lighting fast, personalized shopping experiences that scale infinitely.",
          primaryCta: { label: "Discover more", href: "/features" },
          imageStyle: "glow",
        },
      }),
  },
  {
    key: "hero-background-image",
    type: "hero",
    label: "Hero · background image overlay",
    category: "Hero",
    description:
      "Full-width background image with dark overlay and centered high-contrast text.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "background-image",
          backgroundImage: {
            url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&auto=format&fit=crop&q=80",
            alt: "Atmospheric team collaboration",
          },
          bgImagePosition: "cover",
          bgOverlayType: "dark",
          overlayOpacity: 70,
          overlayBlur: true,
          eyebrow: "Atmospheric Presence",
          heading: "Experience the ultimate in quality and craftsmanship",
          highlightText: "craftsmanship",
          subheading:
            "Every detail engineered with passion to elevate your brand above the rest.",
          primaryCta: { label: "Explore collection", href: "/products" },
          secondaryCta: { label: "About our story", href: "/about" },
        },
      }),
  },
  {
    key: "hero-video-bg",
    type: "hero",
    label: "Hero · video background & demo",
    category: "Hero",
    description:
      "Immersive video background with dark overlay and play video CTA.",
    create: () =>
      createSection("hero", {
        data: {
          variant: "video-bg",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          imageStyle: "glow",
          bgOverlayType: "dark",
          overlayOpacity: 65,
          eyebrow: "Cinematic Experience",
          badgeIcon: "🎬",
          heading: "Bring your story to life with motion",
          highlightText: "to life",
          subheading:
            "Captivate your audience with high-impact visuals and rich media presentations.",
          primaryCta: { label: "Start watching", href: "#watch" },
          tertiaryCta: { label: "Play trailer", href: "#play" },
        },
      }),
  },
  {
    key: "hero-banner",
    type: "hero",
    label: "Hero · colour banner",
    category: "Hero",
    description: "Centered headline on your primary colour.",
    create: () =>
      createSection("hero", { settings: { background: "primary" } }),
  },
  {
    key: "features-pastel",
    type: "features",
    label: "Features · pastel highlights",
    category: "Features",
    description: "4-column minimalist features with soft pastel circular icon badges and clean bottom link.",
    create: () =>
      createSection("features", {
        data: {
          variant: "pastel-icons",
          iconStyle: "pastel-circle",
          cardStyle: "transparent",
          align: "center",
          heading: "Our Features",
          intro:
            "Unleash your creativity with a visual collaboration platform that enables effective ideation.",
          columns: 4,
          mobileColumns: 2,
          bottomCta: { label: "Learn more", href: "/features" },
          items: [
            {
              icon: "gear",
              iconColor: "orange",
              title: "Choosing a Service",
              description: "Choosing an accountant that matches your needs.",
            },
            {
              icon: "user",
              iconColor: "green",
              title: "Our Clients Say",
              description: "Read the reviews from some of our satisfied clients.",
            },
            {
              icon: "mail",
              iconColor: "yellow",
              title: "Initial Consultation",
              description: "Understanding your accountancy requirements.",
            },
            {
              icon: "phone",
              iconColor: "cyan",
              title: "Request a Callback",
              description: "Let's talk at a more convenient time for you.",
            },
          ],
        },
      }),
  },
  {
    key: "features-split-showcase",
    type: "features",
    label: "Features · split screen showcase",
    category: "Features",
    description:
      "Headline & 3D isometric dashboard visual on left with stacked elevated feature cards on right.",
    create: () =>
      createSection("features", {
        data: {
          variant: "split",
          splitPosition: "left",
          eyebrow: "Product Capabilities",
          heading: "Exclusive Features.",
          intro:
            "Data should underlie every business decision. Yet too often cultural artifacts lead the business down the wrong routes.",
          splitCta: { label: "Explore More", href: "/features" },
          iconStyle: "square-badge",
          items: [
            {
              icon: "check",
              iconColor: "green",
              title: "Easy To Use",
              description:
                "The Isaac SDK robotics developer toolbox designed to change that with general availability.",
            },
            {
              icon: "chart",
              iconColor: "yellow",
              title: "Daily Report",
              description:
                "Comprehensive analytics and automated daily summary digests for your entire team.",
            },
            {
              icon: "clock",
              iconColor: "blue",
              title: "Real Time",
              description:
                "Instant data synchronization and lightning-fast low latency updates across all platforms.",
            },
            {
              icon: "shield",
              iconColor: "pink",
              title: "Extreme Security",
              description:
                "Enterprise-grade end-to-end data encryption and compliance safeguards by default.",
            },
          ],
        },
      }),
  },
  {
    key: "features-minimal-grid",
    type: "features",
    label: "Features · minimal clean grid",
    category: "Features",
    description:
      "Clean 3-column minimalist layout with bold accent icons and spacious typography.",
    create: () =>
      createSection("features", {
        data: {
          variant: "minimal",
          iconStyle: "minimal-accent",
          cardStyle: "transparent",
          align: "center",
          columns: 3,
          mobileColumns: 1,
          heading: "Amazing Features",
          intro:
            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
          items: [
            {
              icon: "gear",
              iconColor: "blue",
              title: "Powerful Dashboard",
              description:
                "Utise wisi enim minim veniam, quis et stationes ullamcorper suscipit ets lobortis nisle consequat nihis etim.",
            },
            {
              icon: "tools",
              iconColor: "blue",
              title: "User Friendly",
              description:
                "Utise wisi enim minim veniam, quis et stationes ullamcorper suscipit ets lobortis nisle consequat nihis etim.",
            },
            {
              icon: "bell",
              iconColor: "blue",
              title: "Smart Notifications",
              description:
                "Utise wisi enim minim veniam, quis et stationes ullamcorper suscipit ets lobortis nisle consequat nihis etim.",
            },
            {
              icon: "wallet",
              iconColor: "blue",
              title: "Cost Control",
              description:
                "Utise wisi enim minim veniam, quis et stationes ullamcorper suscipit ets lobortis nisle consequat nihis etim.",
            },
            {
              icon: "pointer",
              iconColor: "blue",
              title: "Unique Features",
              description:
                "Utise wisi enim minim veniam, quis et stationes ullamcorper suscipit ets lobortis nisle consequat nihis etim.",
            },
            {
              icon: "help",
              iconColor: "blue",
              title: "Support 24/7",
              description:
                "Utise wisi enim minim veniam, quis et stationes ullamcorper suscipit ets lobortis nisle consequat nihis etim.",
            },
          ],
        },
      }),
  },
  {
    key: "features-cards-elevated",
    type: "features",
    label: "Features · elevated modern cards",
    category: "Features",
    description: "Modern container cards with subtle borders and smooth hover lift.",
    create: () =>
      createSection("features", {
        data: {
          variant: "cards",
          iconStyle: "pastel-circle",
          cardStyle: "surface",
          align: "left",
          heading: "Engineered for speed and security",
          intro: "Discover the cutting-edge features powering next-generation websites.",
          columns: 3,
          mobileColumns: 1,
          items: [
            {
              icon: "sparkles",
              iconColor: "purple",
              badge: "AI Powered",
              title: "Smart Automation",
              description:
                "Save hundreds of hours with intelligent workflows and real-time assisted editing.",
            },
            {
              icon: "rocket",
              iconColor: "orange",
              badge: "Blazing Fast",
              title: "Instant Global CDN",
              description:
                "Lightning fast delivery edge-cached across 300+ worldwide edge nodes.",
            },
            {
              icon: "lock",
              iconColor: "green",
              badge: "Enterprise",
              title: "Bank-Grade Protection",
              description:
                "Automatic SSL certificates, DDoS mitigation, and continuous vulnerability scans.",
            },
          ],
        },
      }),
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
            {
              icon: "check",
              title: "Quality",
              description: "Describe this benefit.",
            },
            {
              icon: "star",
              title: "Experience",
              description: "Describe this benefit.",
            },
            {
              icon: "chat",
              title: "Support",
              description: "Describe this benefit.",
            },
            {
              icon: "shield",
              title: "Trusted",
              description: "Describe this benefit.",
            },
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
            {
              title: "Service one",
              description: "A short description of this service.",
              link: { label: "Learn more", href: "/contact" },
            },
            {
              title: "Service two",
              description: "A short description of this service.",
              link: { label: "Learn more", href: "/contact" },
            },
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
    create: () =>
      createSection("testimonials", { settings: { background: "surface" } }),
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
    create: () =>
      createSection("gallery", { data: { columns: 4, mobileColumns: 2 } }),
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
    create: () =>
      createSection("stats", { settings: { background: "surface" } }),
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
