import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Prefixes a root-relative path with the site's base URL (e.g. "/cheer-corner-tool"
// on GitHub Pages) for hrefs that don't go through the router.
export function withBase(path: string) {
  return import.meta.env.BASE_URL.replace(/\/$/, "") + path;
}
