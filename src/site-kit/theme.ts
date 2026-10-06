import type { CSSProperties } from "react";
import { fontStack, isFontKey } from "./fonts.ts";
import type { RadiusSize, SpacingSize, ThemeSettings } from "./types.ts";

const RADIUS: Record<RadiusSize, string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
};

const SECTION_SPACING: Record<SpacingSize, string> = {
  compact: "48px",
  normal: "80px",
  relaxed: "112px",
};

export const DEFAULT_THEME: ThemeSettings = {
  colors: {
    primary: "#0f7b6c",
    secondary: "#b4410f",
    background: "#ffffff",
    surface: "#f4f6f5",
    text: "#1a1d23",
    muted: "#5b6170",
  },
  fonts: { heading: "plex-sans", body: "plex-sans" },
  buttonStyle: "filled",
  cardStyle: "border",
  radius: "md",
  containerWidth: 1200,
  sectionSpacing: "normal",
};

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Theme values end up in CSS, so anything that isn't a plain hex color is dropped. */
function safeColor(value: string, fallback: string): string {
  return HEX_COLOR.test(value) ? value : fallback;
}

/** Black or white text, whichever reads better on the given hex background. */
export function contrastText(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
}

export function themeToCssVars(theme: ThemeSettings): CSSProperties {
  const defaults = DEFAULT_THEME.colors;
  const colors = {
    primary: safeColor(theme.colors.primary, defaults.primary),
    secondary: safeColor(theme.colors.secondary, defaults.secondary),
    background: safeColor(theme.colors.background, defaults.background),
    surface: safeColor(theme.colors.surface, defaults.surface),
    text: safeColor(theme.colors.text, defaults.text),
    muted: safeColor(theme.colors.muted, defaults.muted),
  };
  const container = Number.isFinite(theme.containerWidth)
    ? Math.min(Math.max(Math.round(theme.containerWidth), 640), 1600)
    : DEFAULT_THEME.containerWidth;

  return {
    "--wb-primary": colors.primary,
    "--wb-on-primary": contrastText(colors.primary),
    "--wb-secondary": colors.secondary,
    "--wb-bg": colors.background,
    "--wb-surface": colors.surface,
    "--wb-text": colors.text,
    "--wb-muted": colors.muted,
    "--wb-font-heading": fontStack(theme.fonts.heading),
    "--wb-font-body": fontStack(theme.fonts.body),
    "--wb-radius": RADIUS[theme.radius] ?? RADIUS.md,
    "--wb-container": `${container}px`,
    "--wb-section-y": SECTION_SPACING[theme.sectionSpacing] ?? SECTION_SPACING.normal,
  } as CSSProperties;
}

/**
 * Inline style for a section font override. Inherited `font-family` is already
 * resolved at the site root, so body text needs the property itself, not just the variable.
 */
export function sectionFontStyle(font: string | undefined): CSSProperties {
  if (!isFontKey(font)) return {};
  const stack = fontStack(font);
  return { "--wb-font-heading": stack, "--wb-font-body": stack, fontFamily: stack } as CSSProperties;
}
