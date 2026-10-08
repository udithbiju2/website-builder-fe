import { request } from "./http.ts";

export type AiUsageSortBy = "totalTokens" | "estimatedCost" | "totalRequests" | "businessName" | "lastUsedAt";
export type SortOrder = "asc" | "desc";

export type ClientAiUsageSummary = {
  clientId: string;
  businessName: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  totalRequests: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  topModel: string | null;
  lastUsedAt: string | null;
};

export type AiUsageTotals = {
  totalRequests: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalEstimatedCost: number;
  activeClientsCount: number;
};

export type AiUsageListParams = {
  month?: number | string;
  year?: number | string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: AiUsageSortBy;
  sortOrder?: SortOrder;
};

export type AiUsageListResponse = {
  items: ClientAiUsageSummary[];
  summary: AiUsageTotals;
  total: number;
  page: number;
  pageSize: number;
  selectedMonth: number | null;
  selectedYear: number;
};

const BASE = "/admin/ai-usage";

function toQuery(params: AiUsageListParams): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

export const adminAiUsageApi = {
  list: (params: AiUsageListParams) => request<AiUsageListResponse>(`${BASE}${toQuery(params)}`),
};
