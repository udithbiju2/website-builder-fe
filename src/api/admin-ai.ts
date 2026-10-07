import { request } from "./http.ts";

export type AiConfig = {
  configured: boolean;
  openaiApiKeyMasked: string | null;
  model: string;
  updatedAt: string | null;
};

export type AiConfigInput = {
  /** Leave empty to keep the stored key. */
  openaiApiKey?: string;
  model: string;
};

type ConfigResponse = { config?: AiConfig; data?: { config?: AiConfig } };

const BASE = "/admin/settings/ai";

export const adminAiApi = {
  get: () =>
    request<ConfigResponse>(BASE).then((data) => {
      const cfg = data?.config || data?.data?.config;
      if (!cfg) {
        throw new Error("Invalid configuration response from server");
      }
      return cfg;
    }),

  update: (input: AiConfigInput) =>
    request<ConfigResponse>(BASE, { method: "PUT", body: input }).then((data) => {
      const cfg = data?.config || data?.data?.config;
      if (!cfg) {
        throw new Error("Invalid configuration response from server");
      }
      return cfg;
    }),
};
