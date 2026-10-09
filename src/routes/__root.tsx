import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader, SiteFooter } from "../components/site-chrome";
import { Motion3D } from "../components/motion-3d";
import { InstallBanner, useServiceWorker } from "../components/install-app";
import { NotificationsPrompt } from "../components/notifications";
import { SITE_URL, withBase } from "@/lib/utils";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Stranica nije pronađena</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Stranica koju tražite ne postoji ili je premještena.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Nazad na početnu
          </Link>
        </div>
      </div>
    </div>
  );
}

// Script files that went missing after a new deploy: reloading picks up the new version.
const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|Failed to fetch|Loading chunk/i;
const RELOADED_KEY = "reloaded-after-error";

function ErrorComponent({ error }: ErrorComponentProps) {
  console.error(error);
  const message = error instanceof Error ? error.message : String(error);

  useEffect(() => {
    if (!CHUNK_ERROR.test(message)) return;
    try {
      // Reload once per minute at most, so a real outage doesn't loop
      const last = Number(sessionStorage.getItem(RELOADED_KEY) || 0);
      if (Date.now() - last < 60_000) return;
      sessionStorage.setItem(RELOADED_KEY, String(Date.now()));
    } catch {
      return;
    }
    window.location.reload();
  }, [message]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Stranica se nije učitala
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Došlo je do greške. Pokušajte osvježiti ili se vratite na početnu.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Pokušaj ponovo
          </button>
          <a
            href={withBase("/")}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Nazad na početnu
          </a>
        </div>
        {/* Shown small so a screenshot tells us what went wrong */}
        <p className="mt-8 text-xs text-muted-foreground/70 break-words">{message}</p>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#315c46" },
      // Installed on a phone's home screen: open full screen, under this name
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Džamija Rečane" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { title: "Džamija Rečane | Mjesto ibadeta, učenja i zajednice" },
      { name: "description", content: "Dobrodošli u džamiju Rečane. Dnevni vreme namaza, događaji zajednice, časovi Kur'ana i još mnogo toga." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Džamija Rečane" },
      { property: "og:locale", content: "bs_BA" },
      // Preview image for links shared on Facebook, WhatsApp, Viber, etc. (must be an absolute URL)
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Džamija Rečane u sumrak, Rečane, Prizren, Kosovo" },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // .ico and PNG for browsers without SVG favicon support (Safari, older phones, search results)
      { rel: "icon", href: withBase("/favicon.ico"), sizes: "48x48" },
      { rel: "icon", href: withBase("/favicon.svg"), type: "image/svg+xml" },
      { rel: "icon", href: withBase("/favicon-32.png"), type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: withBase("/apple-touch-icon.png") },
      { rel: "manifest", href: withBase("/site.webmanifest") },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="sr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Motion3D />
      <InstallBanner />
      <NotificationsPrompt />
    </QueryClientProvider>
  );
}
