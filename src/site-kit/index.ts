/**
 * Website component kit. Must stay framework-agnostic beyond React itself
 * (no router, HeroUI, Tailwind or browser-only APIs) so the publish step can
 * render the same components to static HTML on the server.
 */
export { default as SitePage, SectionView, SiteStyles } from "./SitePage.tsx";
export type { SitePageEditorHooks } from "./SitePage.tsx";
export {
  createSection,
  DEFAULT_SECTION_SETTINGS,
  SECTION_DEFINITIONS,
  SECTION_PRESETS,
  SECTION_TYPES,
} from "./registry.ts";
export type { SectionCategory, SectionDefinition, SectionPreset } from "./registry.ts";
export { safeHref } from "./links.ts";
export { DEFAULT_THEME, themeToCssVars } from "./theme.ts";
export { SITE_CSS } from "./styles.ts";
export { SAMPLE_SITE } from "./sample-site.ts";
export type * from "./types.ts";
