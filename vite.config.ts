import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name?.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            extType = 'images';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
