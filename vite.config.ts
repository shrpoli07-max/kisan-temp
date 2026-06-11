import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      // Map multiple subdirectories to the root since files were flattened
      "@/components/ui": path.resolve(__dirname, "./"),
      "@/components": path.resolve(__dirname, "./"),
      "@/pages": path.resolve(__dirname, "./"),
      "@/contexts": path.resolve(__dirname, "./"),
      "@/hooks": path.resolve(__dirname, "./"),
      "@/utils": path.resolve(__dirname, "./"),
      "@/lib": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "./"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
