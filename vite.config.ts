import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
   // 1. Define o caminho base (o nome do seu repositório no GitHub)
  base: "/psg-si-2025-2-p7-tisige-4048101-tisigegrupo1/",
  
  // 2. Define a pasta de saída do build como "docs"
  build: {
    outDir: "docs",
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
