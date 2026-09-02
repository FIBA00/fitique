import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  envDir: projectRoot,
  root: path.resolve(projectRoot, "client"),
  build: {
    outDir: path.resolve(projectRoot, "dist/public"),
    emptyOutDir: true,
  },
  resolve: { alias: { "@": path.resolve(projectRoot, "client/src") } },
  server: {
    port: 3000,
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
  },
  plugins: [
    react(),
    tailwindcss(),
    vitePluginManusRuntime(),
    vitePluginStorageProxy(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["offline.html"],
      manifest: {
        name: "Fitique — Boutique Delivery & Fit Check",
        short_name: "Fitique",
        description:
          "A boutique fashion shopping companion with a guided fit-check experience.",
        theme_color: "#493551",
        background_color: "#fbf8f3",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/manus-storage/fitique-logo_ef915542.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp}"],
      },
    }),
  ],
});
