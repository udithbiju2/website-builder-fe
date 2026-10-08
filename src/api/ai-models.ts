import { request } from "./http.ts";

export type AiModelTier = "low" | "medium" | "high";

export type AiModelOption = {
  id: string;
  label: string;
  /** Cost band derived from `relativeCost`. */
  tier: AiModelTier;
  description: string;
  /** USD per 1M prompt (input) tokens. */
  inputPerMillion: number;
  /** USD per 1M completion (output) tokens. */
  outputPerMillion: number;
  /** Reasoning models also bill hidden "thinking" tokens. */
  reasoning: boolean;
  /** Approximate cost of one AI request relative to the cheapest model (1 = cheapest). */
  relativeCost: number;
};

export type ClientAiSettings = {
  /** The client's own choice; null = platform default. */
  model: string | null;
  defaultModel: string;
  effectiveModel: string;
  configured: boolean;
  models: AiModelOption[];
};

export const TIER_LABELS: Record<AiModelTier, string> = {
  low: "Low cost",
  medium: "Medium cost",
  high: "High cost",
};

export function formatPerMillion(usd: number): string {
  return `$${usd < 1 ? usd.toFixed(2) : usd.toFixed(usd % 1 === 0 ? 0 : 2)}`;
}

export function formatRelativeCost(model: AiModelOption): string {
  return model.relativeCost <= 1 ? "Cheapest" : `≈${model.relativeCost}× the cheapest`;
}

type SettingsResponse = { settings: ClientAiSettings };

const BASE = "/account/ai-settings";

export const clientAiSettingsApi = {
  get: () => request<SettingsResponse>(BASE).then((data) => data.settings),
  update: (model: string | null) =>
    request<SettingsResponse>(BASE, { method: "PUT", body: { model } }).then((data) => data.settings),
};
