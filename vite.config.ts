import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { mockApiPlugin } from "./src/api/mocks/vite-plugin";
import path from "path";
import { glob } from "glob";

const input = glob
  .sync("*.html", { cwd: path.resolve(__dirname) })
  .reduce((acc: Record<string, string>, file) => {
    const name = path.basename(file, ".html");
    acc[name] = path.resolve(__dirname, file);
    return acc;
  }, {});

export default defineConfig({
  root: ".",
  publicDir: "public",
  plugins: [react(), tsconfigPaths(), mockApiPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name?.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || "")) {
            extType = "images";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@locales": path.resolve(__dirname, "./src/locales"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
  server: {
    port: 3000,
  },
});
