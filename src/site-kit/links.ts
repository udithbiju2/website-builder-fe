const SAFE_SCHEME = /^(https?:|mailto:|tel:)/i;

/**
 * Published sites render user/AI-provided links, so only http(s), mailto, tel,
 * site-relative paths and in-page anchors are allowed. Anything else
 * (e.g. `javascript:`) collapses to "#".
 */
export function safeHref(href: string | undefined): string {
  const value = href?.trim() ?? "";
  if (!value) return "#";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (value.startsWith("#")) return value;
  return SAFE_SCHEME.test(value) ? value : "#";
}

export function isExternalHref(href: string): boolean {
  return /^https?:/i.test(href);
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
