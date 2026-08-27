import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function vitePluginStorageProxy() {
  return {
    name: "fitique-storage-proxy",
    configureServer(server) {
      server.middlewares.use("/manus-storage", async (req, res) => {
        const key = req.url?.replace(/^\//, "");
        const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
        if (!key || !forgeBaseUrl || !forgeKey) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Managed storage is not configured for this preview.");
          return;
        }
        try {
          const forgeUrl = new URL("v1/storage/presign/get", `${forgeBaseUrl}/`);
          forgeUrl.searchParams.set("path", key);
          const response = await fetch(forgeUrl, { headers: { Authorization: `Bearer ${forgeKey}` } });
          if (!response.ok) throw new Error("Storage backend error");
          const { url } = await response.json();
          if (!url) throw new Error("Storage URL unavailable");
          res.writeHead(307, { Location: url, "Cache-Control": "no-store" });
          res.end();
        } catch {
          res.writeHead(502, { "Content-Type": "text/plain" });
          res.end("Managed storage could not be reached.");
        }
      });
    }
  };
}

export default defineConfig({
  envDir: projectRoot,
  root: path.resolve(projectRoot, "client"),
  build: { outDir: path.resolve(projectRoot, "dist/public"), emptyOutDir: true },
  resolve: { alias: { "@": path.resolve(projectRoot, "client/src") } },
  server: { port: 3000, host: true, allowedHosts: [".manuspre.computer", ".manus.computer", ".manus-asia.computer", ".manuscomputer.ai", ".manusvm.computer", "localhost", "127.0.0.1"] },
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
        description: "A boutique fashion shopping companion with a guided fit-check experience.",
        theme_color: "#493551",
        background_color: "#fbf8f3",
        display: "standalone",
        start_url: "/",
        icons: [{ src: "/manus-storage/fitique-logo_ef915542.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }]
      },
      workbox: { navigateFallback: "/index.html", globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp}"] }
    })
  ]
});
