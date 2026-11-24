import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { seo } from "./script/seo";
import marketsHandler from "./api/markets";

function devApi(): Plugin {
  return {
    name: "dev-api-markets",
    configureServer(server) {
      server.middlewares.use("/api/markets", async (req, res) => {
        const shimRes = {
          statusCode: 200,
          setHeader: (k: string, v: string) => res.setHeader(k, v),
          status(code: number) {
            this.statusCode = code;
            return this;
          },
          json(body: unknown) {
            res.statusCode = this.statusCode;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(body));
            return this;
          },
        };
        try {
          await marketsHandler(req as never, shimRes as never);
        } catch {
          res.statusCode = 502;
          res.end(JSON.stringify({ items: [] }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), seo(), devApi()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "framer-motion": ["framer-motion"],
          form: ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
});
