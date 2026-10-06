import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@puckeditor")) {
              return "vendor-puck";
            }
            if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("/react/")) {
              return "vendor-react";
            }
            if (id.includes("@heroui") || id.includes("@react-aria")) {
              return "vendor-heroui";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (id.includes("zod")) {
              return "vendor-utils";
            }
          }
        },
      },
    },
  },
});
