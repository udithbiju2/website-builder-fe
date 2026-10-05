export type NavItem = {
  label: string;
  href: string;
};

export const headerNav: readonly NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Templates", href: "/#templates" },
];

export const footerNav: readonly NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];
