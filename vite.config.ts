import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// `npm run build` prerenders every route to plain HTML, so `dist/` can be served
// by any static host (GitHub Pages, Netlify, nginx, ...).
// BASE_PATH sets the URL prefix the site lives under, e.g. "/cheer-corner-tool/"
// for https://<user>.github.io/cheer-corner-tool/. It defaults to "/".
const base = process.env["BASE_PATH"] || "/";

export default defineConfig({
  base,
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true },
    }),
    viteReact(),
  ],
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    dedupe: ["react", "react-dom", "@tanstack/react-query", "@tanstack/query-core"],
  },
  server: { port: 8080 },
  // Prerendering runs the site in a local preview server; listen on IPv4
  // so it also works on machines without IPv6.
  preview: { host: "127.0.0.1" },
});
