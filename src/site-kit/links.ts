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

const YOUTUBE_ID = /^https:\/\/(?:(?:www\.|m\.)?youtube\.com\/watch\?v=([\w-]{6,20})|youtu\.be\/([\w-]{6,20}))/i;
const VIMEO_ID = /^https:\/\/(?:www\.)?vimeo\.com\/(\d{6,12})/i;

/**
 * Builds the iframe src for a YouTube or Vimeo page URL. Only ids are taken
 * from user input, so arbitrary embed URLs can never reach an iframe.
 */
export function videoEmbedUrl(url: string | undefined): string | null {
  const value = url?.trim() ?? "";
  const youtube = YOUTUBE_ID.exec(value);
  const youtubeId = youtube?.[1] ?? youtube?.[2];
  if (youtubeId) return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
  const vimeoId = VIMEO_ID.exec(value)?.[1];
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?dnt=1`;
  return null;
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
