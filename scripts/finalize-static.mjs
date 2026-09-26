// Flattens the build output so a plain static host can serve `dist/` directly.
//
// TanStack Start writes the browser bundle + prerendered HTML into `dist/client`.
// Static hosts (GitHub Pages, Netlify, nginx, ...) serve the root of
// `dist`, so without this step there is no `dist/index.html` and nginx answers
// 403 Forbidden. This script moves `dist/client/*` up into `dist/`, drops any
// server-only leftovers, and adds a `404.html` fallback for client-side routes.
import { existsSync } from "node:fs";
import { cp, readdir, rm, copyFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const client = path.join(dist, "client");

if (!existsSync(client) || !existsSync(path.join(client, "index.html"))) {
  // Not a prerendered build — nothing to flatten.
  console.log("[static] not a static build — skipping");
  process.exit(0);
}


// Remove server-only artifacts from a previous SSR build.
for (const leftover of ["server", "nitro.json", "package.json", "package-lock.json", ".output"]) {
  await rm(path.join(dist, leftover), { recursive: true, force: true });
}

for (const entry of await readdir(client)) {
  await cp(path.join(client, entry), path.join(dist, entry), { recursive: true });
}
await rm(client, { recursive: true, force: true });

const indexHtml = path.join(dist, "index.html");
if (!existsSync(indexHtml)) {
  console.error("[static] ERROR: dist/index.html was not produced");
  process.exit(1);
}

// SPA-style fallback so unknown paths still boot the app instead of 404ing hard.
await copyFile(indexHtml, path.join(dist, "404.html"));

console.log("[static] dist/ is ready to be served as a static site");
