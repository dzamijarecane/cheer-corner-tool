// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Static build: prerenders every route to plain HTML so the output can be served
// by any static web server (nginx / Instapods / Netlify / GitHub Pages).
// It is used automatically outside the Lovable build environment, and can be
// forced with STATIC_BUILD=1 or disabled with STATIC_BUILD=0.
const staticFlag = process.env["STATIC_BUILD"];
const insideLovable = Boolean(process.env["LOVABLE_ASSETS_ENDPOINT_URL"]);
const isBuildCommand = process.argv.includes("build");
const isStatic =
  isBuildCommand &&
  (staticFlag === "1" || (staticFlag !== "0" && !insideLovable));

export default defineConfig({
  // Static mode must only affect production builds. Enabling it during `vite
  // dev` disables parts of the live preview pipeline and drops its connection.
  ...(isStatic
    ? {
        nitro: false,
        tanstackStart: { prerender: { enabled: true, crawlLinks: true } },
      }
    : {}),
});
