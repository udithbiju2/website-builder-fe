import type { AuthData, AuthField, SectionSettings } from "./types.ts";

const EMAIL_FIELD: AuthField = {
  name: "email",
  label: "Email",
  type: "email",
  placeholder: "Enter your email address",
  required: true,
  width: "full",
};

const PASSWORD_FIELD: AuthField = {
  name: "password",
  label: "Password",
  type: "password",
  placeholder: "Enter a strong password",
  required: true,
  width: "full",
};

/** Starter content for a new auth section; every preset is a variation of this. */
export function createAuthData(): AuthData {
  return {
    variant: "diagonal-split",
    defaultView: "register",
    brandName: "BoardMe",
    formPosition: "right",
    minHeight: "screen",
    inputStyle: "outline",
    buttonShape: "rounded",
    headingSize: "md",
    showLabels: true,
    showFieldIcons: false,
    showPasswordToggle: true,
    animation: "slide-up",
    backgroundMotion: true,
    panel: {
      heading: "New here?",
      text: "Create an account in seconds and start building your first onboarding experience.",
      registerHeading: "Already signed up?",
      registerText: "Log in to your account so you can continue building and editing your onboarding flows.",
      highlights: ["No credit card required", "Unlimited flows on the free plan", "Cancel anytime"],
    },
    social: {
      enabled: true,
      label: "Or continue with",
      style: "icons",
      position: "bottom",
      showOnRegister: true,
      providers: [
        { provider: "google", href: "#" },
        { provider: "facebook", href: "#" },
        { provider: "x", href: "#" },
      ],
    },
    login: {
      heading: "Welcome back",
      subheading: "Log in to continue where you left off.",
      fields: [EMAIL_FIELD, { ...PASSWORD_FIELD, placeholder: "Enter your password" }],
      submitLabel: "Log in",
      showRemember: true,
      rememberLabel: "Remember me",
      forgotLabel: "Forgot password?",
      switchPrompt: "Don't have an account?",
      switchLabel: "Sign up",
    },
    register: {
      enabled: true,
      heading: "Sign up for an account",
      subheading: "Let's get you all set up so you can start creating your first onboarding experience.",
      fields: [
        { name: "firstName", label: "First name", type: "text", placeholder: "Your first name", required: true, width: "half" },
        { name: "lastName", label: "Last name", type: "text", placeholder: "Your last name", required: true, width: "half" },
        EMAIL_FIELD,
        PASSWORD_FIELD,
      ],
      submitLabel: "Sign up",
      showTerms: true,
      termsText: "I accept the",
      termsLink: { label: "Terms & Conditions", href: "/terms" },
      switchPrompt: "Already have an account?",
      switchLabel: "Log in",
    },
    forgot: {
      enabled: true,
      heading: "Reset your password",
      subheading: "Enter the email linked to your account and we'll send you a reset link.",
      fields: [EMAIL_FIELD],
      submitLabel: "Send reset link",
      backLabel: "Back to log in",
      successHeading: "Check your inbox",
      successText: "If an account exists for that email, a reset link is on its way.",
    },
    otp: {
      enabled: true,
      heading: "Verify it's you",
      subheading: "Enter the verification code we just sent to your email.",
      length: 6,
      submitLabel: "Verify code",
      resendLabel: "Resend code",
      resendSeconds: 30,
      requireOnLogin: false,
      requireOnRegister: true,
      requireOnForgot: false,
    },
    successHeading: "You're all set",
    successText: "Your account is ready. Let's get started.",
    successLink: { label: "Continue to dashboard", href: "/" },
    footerNote: "Protected by industry-standard encryption.",
  };
}

type AuthDataOverrides = Partial<Omit<AuthData, "login" | "register" | "forgot" | "otp" | "social" | "panel">> & {
  login?: Partial<AuthData["login"]>;
  register?: Partial<AuthData["register"]>;
  forgot?: Partial<AuthData["forgot"]>;
  otp?: Partial<AuthData["otp"]>;
  social?: Partial<AuthData["social"]>;
  panel?: AuthData["panel"];
};

/** Merges overrides into the starter content one view at a time. */
export function authData(overrides: AuthDataOverrides): AuthData {
  const base = createAuthData();
  return {
    ...base,
    ...overrides,
    login: { ...base.login, ...overrides.login },
    register: { ...base.register, ...overrides.register },
    forgot: { ...base.forgot, ...overrides.forgot },
    otp: { ...base.otp, ...overrides.otp },
    social: { ...base.social, ...overrides.social },
    panel: overrides.panel ?? base.panel,
  };
}

export type AuthPresetSpec = {
  key: string;
  label: string;
  description: string;
  settings?: Partial<SectionSettings>;
  data: () => AuthData;
};

const UNSPLASH = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const AUTH_PRESETS: AuthPresetSpec[] = [
  {
    key: "auth-diagonal-split",
    label: "Auth · Diagonal Split",
    description: "Bold brand panel with a slanted edge and a view switcher beside a clean form.",
    data: () => authData({ variant: "diagonal-split" }),
  },
  {
    key: "auth-gradient-spotlight",
    label: "Auth · Gradient Spotlight",
    description: "Big welcome headline on a soft gradient with a floating sign-in card.",
    data: () =>
      authData({
        variant: "gradient-spotlight",
        defaultView: "login",
        brandName: "Pagestore",
        inputStyle: "filled",
        buttonShape: "pill",
        headingSize: "lg",
        animation: "scale",
        panel: {
          eyebrow: "Welcome to Pagestore",
          heading: "Hey, hello! 👋",
          text: "Sell, ship and grow from one beautifully simple dashboard.",
          highlights: ["Launch a store in minutes", "Built-in payments & analytics", "Loved by 40,000+ creators"],
        },
        login: { heading: "Welcome back", subheading: "Sign in to your store." },
        social: { style: "full", position: "top", providers: [{ provider: "google", href: "#" }, { provider: "apple", href: "#" }] },
      }),
  },
  {
    key: "auth-illustration-frame",
    label: "Auth · Illustration Frame",
    description: "Rounded framed card with an illustration or photo beside the form.",
    settings: { background: "surface" },
    data: () =>
      authData({
        variant: "illustration-frame",
        defaultView: "login",
        brandName: "BuildFlow",
        minHeight: "auto",
        showFieldIcons: true,
        animation: "fade",
        panel: {
          heading: "Build together, ship faster",
          text: "Plan sprints, review designs and deploy from a single workspace.",
          image: {
            url: UNSPLASH("photo-1522071820081-009f0129c71c"),
            alt: "A team collaborating around a laptop",
          },
        },
        login: { heading: "Log in", subheading: "Welcome back! Please enter your details." },
      }),
  },
  {
    key: "auth-glass-aurora",
    label: "Auth · Glass Aurora",
    description: "Frosted glass card floating over slowly drifting aurora gradients.",
    data: () =>
      authData({
        variant: "glass-aurora",
        defaultView: "login",
        brandName: "Nebula",
        inputStyle: "filled",
        buttonShape: "pill",
        animation: "blur",
        colors: { accent: "#8b5cf6", panel: "#0b0a1f", panelText: "#ffffff" },
        login: { heading: "Sign in to Nebula", subheading: "Your workspace is waiting." },
        social: { style: "icons", position: "top", providers: [{ provider: "google", href: "#" }, { provider: "github", href: "#" }, { provider: "apple", href: "#" }] },
      }),
  },
  {
    key: "auth-dark-wave",
    label: "Auth · Dark Wave",
    description: "Dark security-first screen with layered animated waves and a centered form.",
    data: () =>
      authData({
        variant: "dark-wave",
        defaultView: "login",
        brandName: "Securify",
        inputStyle: "filled",
        showFieldIcons: true,
        animation: "slide-up",
        colors: { accent: "#22c55e", panel: "#071a1f", panelText: "#e6fffa" },
        login: { heading: "Sign in", subheading: "Access your encrypted vault." },
        otp: { requireOnLogin: true },
        social: { enabled: false },
        footerNote: "End-to-end encrypted · SOC 2 Type II",
      }),
  },
  {
    key: "auth-product-showcase",
    label: "Auth · Product Showcase",
    description: "Form on one side, a rich product panel with screenshot and copy on the other.",
    data: () =>
      authData({
        variant: "product-showcase",
        defaultView: "login",
        formPosition: "left",
        brandName: "Pantomax",
        showFieldIcons: true,
        animation: "slide-side",
        panel: {
          heading: "Connect with every application.",
          text: "Everything you need in an easily customizable dashboard.",
          image: {
            url: UNSPLASH("photo-1551288049-bebda4e38f71"),
            alt: "Analytics dashboard on a screen",
          },
        },
        login: { heading: "Log in to your account", subheading: "Welcome back! Select a method to log in." },
        social: { style: "full", position: "top", providers: [{ provider: "google", href: "#" }, { provider: "facebook", href: "#" }] },
      }),
  },
  {
    key: "auth-minimal-editorial",
    label: "Auth · Minimal Editorial",
    description: "Monochrome, type-led layout with underline inputs and generous whitespace.",
    data: () =>
      authData({
        variant: "minimal-editorial",
        defaultView: "login",
        brandName: "Studio Norte",
        inputStyle: "underline",
        buttonShape: "square",
        headingSize: "lg",
        animation: "fade",
        colors: { accent: "#111111" },
        panel: {
          eyebrow: "Members area",
          heading: "Quiet tools for thoughtful work.",
          text: "Sign in to access your archive, drafts and shared folders.",
        },
        login: { heading: "Sign in", subheading: undefined },
        social: { enabled: false },
      }),
  },
  {
    key: "auth-bento-grid",
    label: "Auth · Bento Grid",
    description: "Form tile surrounded by bento tiles for stats, imagery and a testimonial.",
    settings: { background: "surface" },
    data: () =>
      authData({
        variant: "bento-grid",
        defaultView: "login",
        brandName: "Orbit",
        minHeight: "auto",
        buttonShape: "pill",
        animation: "scale",
        panel: {
          heading: "Ship your best work.",
          text: "Join the teams moving faster with Orbit.",
          image: {
            url: UNSPLASH("photo-1497366216548-37526070297c"),
            alt: "Bright modern office space",
          },
          stats: [
            { value: "12k+", label: "Teams onboarded" },
            { value: "99.99%", label: "Uptime" },
          ],
          testimonial: {
            quote: "Orbit replaced four tools for us. Onboarding took an afternoon.",
            name: "Maya Chen",
            role: "Head of Ops, Linea",
          },
        },
      }),
  },
  {
    key: "auth-fullbleed-sheet",
    label: "Auth · Full-bleed Sheet",
    description: "Full-screen photography with a docked side sheet holding the form.",
    data: () =>
      authData({
        variant: "fullbleed-sheet",
        defaultView: "login",
        brandName: "Wander",
        inputStyle: "pill",
        buttonShape: "pill",
        animation: "slide-side",
        panel: {
          image: {
            url: UNSPLASH("photo-1506905925346-21bda4d32df4"),
            alt: "Mountain range at sunrise",
          },
          testimonial: {
            quote: "The easiest way we've ever planned a trip together.",
            name: "Leo & Ana",
            role: "Wander members since 2024",
          },
        },
        login: { heading: "Welcome back, explorer" },
      }),
  },
  {
    key: "auth-tabbed-compact",
    label: "Auth · Tabbed Compact",
    description: "Compact centered card with Login / Sign up tabs on a dotted grid canvas.",
    data: () =>
      authData({
        variant: "tabbed-compact",
        defaultView: "login",
        brandName: "Velocity",
        minHeight: "auto",
        inputStyle: "filled",
        animation: "slide-side",
        panel: {
          heading: "Move fast. Break nothing.",
          text: "The deploy platform for teams who care about uptime.",
        },
        social: { style: "full", position: "top", providers: [{ provider: "github", href: "#" }, { provider: "google", href: "#" }] },
      }),
  },
];
