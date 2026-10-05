import type { FooterData, HeaderData, Section, ThemeSettings } from "../site-kit/index.ts";
import { request } from "./http.ts";

export type BuilderType = "MANUAL" | "AI";
export type WebsiteStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
export type PageType = "HOME" | "ABOUT" | "SERVICES" | "CONTACT" | "BLOG" | "LANDING" | "CUSTOM";

export type WebsiteSummary = {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  builderType: BuilderType;
  status: WebsiteStatus;
  subdomain: string;
  pageCount: number;
  hasUnpublishedChanges: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WebsiteInfo = {
  businessName: string | null;
  websiteType: string | null;
  industry: string | null;
  description: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
};

export type WebsitePage = {
  id: string;
  name: string;
  slug: string;
  pageType: PageType;
  visible: boolean;
  showInNav: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  sections: Section[];
};

export type WebsiteDetail = WebsiteSummary & {
  info: WebsiteInfo;
  draft: {
    theme: ThemeSettings;
    header: HeaderData;
    footer: FooterData;
    pages: WebsitePage[];
    draftUpdatedAt: string;
  };
};

export type WebsiteTemplate = {
  id: string;
  key: string;
  /** The client's own saved template (vs a platform template). */
  isCustom: boolean;
  name: string;
  category: string;
  description: string | null;
  thumbnailUrl: string | null;
  themeId: string | null;
  pages: { name: string; slug: string }[];
};

export type WebsiteListParams = {
  search?: string;
  clientId?: string;
  status?: WebsiteStatus;
  builderType?: BuilderType;
  page?: number;
  pageSize?: number;
};

export type WebsiteList = {
  items: WebsiteSummary[];
  total: number;
  page: number;
  pageSize: number;
};

export type ThemeOption = {
  id: string;
  name: string;
  settings: ThemeSettings;
};

export type CreateWebsiteInput = {
  /** Required when a Super Admin creates a website; ignored for clients. */
  clientId?: string;
  name: string;
  /** Omitted = start blank with one empty home page. */
  templateKey?: string;
  themeId?: string;
  subdomain?: string;
  businessName?: string;
  websiteType?: string;
  industry?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
};

/** Pages without an id, or with an id the website doesn't own, are created as new pages. */
export type PageInput = Omit<WebsitePage, "id"> & { id?: string };

export type SaveDraftInput = {
  expectedDraftUpdatedAt: string;
  theme: ThemeSettings;
  header: HeaderData;
  footer: FooterData;
  pages: PageInput[];
};

export type SavedSection = {
  id: string;
  name: string;
  sectionType: Section["type"];
  section: Section;
  /** Shared by the platform; clients can use but not delete it. */
  isPlatform: boolean;
  createdAt: string;
};

export type SaveTemplateInput = { name: string; description?: string };

type WebsiteResponse = { website: WebsiteDetail };

const BASE = "/websites";

function toQuery(params: WebsiteListParams): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

export const websitesApi = {
  list: (params: WebsiteListParams = {}) => request<WebsiteList>(`${BASE}${toQuery(params)}`),

  /** Super Admin passes `clientId` to include that client's own templates. */
  templates: (clientId?: string) =>
    request<{ templates: WebsiteTemplate[] }>(`${BASE}/templates${toQuery({ clientId })}`).then((data) => data.templates),

  saveAsTemplate: (websiteId: string, input: SaveTemplateInput) =>
    request<{ template: WebsiteTemplate }>(`${BASE}/${websiteId}/templates`, { method: "POST", body: input }).then(
      (data) => data.template,
    ),

  deleteTemplate: (templateId: string) => request<void>(`${BASE}/templates/${templateId}`, { method: "DELETE" }),

  savedSections: (websiteId: string) =>
    request<{ sections: SavedSection[] }>(`${BASE}/${websiteId}/saved-sections`).then((data) => data.sections),

  saveSection: (websiteId: string, input: { name: string; section: Section }) =>
    request<{ section: SavedSection }>(`${BASE}/${websiteId}/saved-sections`, { method: "POST", body: input }).then(
      (data) => data.section,
    ),

  deleteSavedSection: (websiteId: string, savedSectionId: string) =>
    request<void>(`${BASE}/${websiteId}/saved-sections/${savedSectionId}`, { method: "DELETE" }),

  themes: () => request<{ themes: ThemeOption[] }>(`${BASE}/themes`).then((data) => data.themes),

  get: (id: string) => request<WebsiteResponse>(`${BASE}/${id}`).then((data) => data.website),

  create: (input: CreateWebsiteInput) =>
    request<WebsiteResponse>(BASE, { method: "POST", body: input }).then((data) => data.website),

  saveDraft: (id: string, input: SaveDraftInput) =>
    request<WebsiteResponse>(`${BASE}/${id}/draft`, { method: "PUT", body: input }).then((data) => data.website),
};
