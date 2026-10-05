export const env = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || "WebBuilder",
  apiUrl: import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000/api",
} as const;
