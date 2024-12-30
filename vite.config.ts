import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api/v1": {
        target: "http://localhost:3000", // URL del servidor backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, "/api/v1"),
      },
    },
  },
});
