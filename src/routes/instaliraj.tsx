import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { PageHeader } from "@/components/site-chrome";
import { ShareIcon, runPrompt, useInstall } from "@/components/install-app";
import { NotificationsButton } from "@/components/notifications";
import { SITE_URL, canonical, withBase } from "@/lib/utils";

// Step-by-step install guide. iPhone has no install button for websites, so this shows
// people exactly where to tap. The link (recanedzamija.com/instaliraj) can be shared.
export const Route = createFileRoute("/instaliraj")({
  head: () => ({
    meta: [
      { title: "Instalirajte aplikaciju | Džamija Rečane" },
      {
        name: "description",
        content: "Kako dodati aplikaciju Džamija Rečane na početni ekran telefona: iPhone (Safari, Chrome) i Android, korak po korak.",
      },
      { property: "og:title", content: "Džamija Rečane na vašem telefonu" },
      { property: "og:description", content: "Vreme namaza, kibla i obavještenja za namaz. Instalacija za manje od minute." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/instaliraj") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/instaliraj") }],
  }),
  component: InstallPage,
});

const TABS = [
  { id: "safari", label: "iPhone · Safari" },
  { id: "chrome", label: "iPhone · Chrome" },
  { id: "android", label: "Android" },
] as const;
type Tab = (typeof TABS)[number]["id"];

function detectTab(): Tab {
  const ua = navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!ios) return "android";
  return /CriOS|EdgiOS|FxiOS/i.test(ua) ? "chrome" : "safari";
}

function InstallPage() {
  const install = useInstall();
  const [tab, setTab] = useState<Tab>("safari");
  useEffect(() => setTab(detectTab()), []);

  return (
    <>
      <PageHeader
        eyebrow="Aplikacija"
        title="Džamija Rečane na vašem telefonu"
        description="Vreme namaza, kibla i obavještenja za namaz, jednim dodirom sa početnog ekrana. Instalacija traje manje od minute."
      />
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6">
          {install?.installed ? (
            <div className="rounded-2xl border border-primary/30 bg-secondary/50 p-7 text-center">
              <p className="font-display text-3xl text-primary">Aplikacija je instalirana ✓</p>
              <p className="mt-2 text-muted-foreground">Još samo uključite obavještenja za namaz:</p>
              <div className="mt-5 flex justify-center">
                <NotificationsButton tone="light" />
              </div>
            </div>
          ) : (
            <>
              <div role="tablist" aria-label="Vaš telefon" className="grid grid-cols-3 gap-2">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`rounded-xl border-2 px-2 py-3 text-sm sm:text-base font-semibold transition ${
                      tab === t.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/40 bg-card text-primary hover:border-[var(--gold)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <ol className="mt-8 space-y-5">
                {tab === "safari" && (
                  <>
                    <Step n={1} title="Dodirnite dugme Podijeli" mock={<SafariBar />}>
                      To je kvadrat sa strelicom prema gore, na traci na dnu ekrana. Ako ga ne vidite, dodirnite{" "}
                      <strong>⋯</strong> (tri tačke) pa <strong>Podijeli</strong>.
                    </Step>
                    <MoreStep n={2} />
                    <HomeScreenStep n={3} />
                    <AddStep n={4} />
                    <OpenStep n={5} />
                  </>
                )}
                {tab === "chrome" && (
                  <>
                    <Step n={1} title="Dodirnite dugme Podijeli" mock={<ChromeBar />}>
                      U Chromeu je dugme <strong>Podijeli</strong> gore desno, u adresnoj traci pored adrese.
                    </Step>
                    <MoreStep n={2} />
                    <HomeScreenStep n={3} />
                    <AddStep n={4} />
                    <OpenStep n={5} />
                  </>
                )}
                {tab === "android" && (
                  <>
                    {install?.prompt && (
                      <li className="rounded-2xl border border-[var(--gold)]/60 bg-secondary/50 p-6 text-center">
                        <p className="font-semibold text-primary">Na ovom telefonu ide jednim dodirom:</p>
                        <button
                          onClick={() => install.prompt && runPrompt(install.prompt)}
                          className="mt-4 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground hover:brightness-125"
                        >
                          Instaliraj aplikaciju
                        </button>
                      </li>
                    )}
                    <Step n={1} title="Otvorite meni" mock={<AndroidBar />}>
                      U Chromeu dodirnite <strong>⋮</strong> (tri tačke) gore desno.
                    </Step>
                    <Step n={2} title="Instaliraj aplikaciju" mock={<AndroidMenu />}>
                      Dodirnite <strong>Instaliraj aplikaciju</strong> ili <strong>Dodaj na početni ekran</strong>, pa potvrdite
                      sa <strong>Instaliraj</strong>.
                    </Step>
                    <OpenStep n={3} />
                  </>
                )}
              </ol>
            </>
          )}

          <ShareThisPage />
        </div>
      </section>
    </>
  );
}

function Step({ n, title, mock, children }: { n: number; title: string; mock: ReactNode; children: ReactNode }) {
  return (
    <li className="grid gap-5 rounded-2xl border border-border/60 bg-card p-5 sm:grid-cols-[1fr_15rem] sm:items-center">
      <div className="flex gap-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--gold)] font-display text-xl text-primary">{n}</span>
        <div>
          <p className="font-display text-2xl text-primary leading-tight">{title}</p>
          <p className="mt-1.5 text-muted-foreground leading-relaxed">{children}</p>
        </div>
      </div>
      <div aria-hidden className="select-none">{mock}</div>
    </li>
  );
}

function MoreStep({ n }: { n: number }) {
  return (
    <Step n={n} title="Dodirnite ⋯ Više" mock={<MoreRow />}>
      U meniju koji se otvori dodirnite <strong>⋯</strong> (tri tačke, <em>Više</em> ili <em>More</em>).
    </Step>
  );
}

function HomeScreenStep({ n }: { n: number }) {
  return (
    <Step n={n} title="Dodaj na početni ekran" mock={<ShareSheet />}>
      Na listi dodirnite <strong>Dodaj na početni ekran</strong> (na engleskom <em>Add to Home Screen</em>). Ako ga ne vidite,
      skrolujte malo dolje.
    </Step>
  );
}

function AddStep({ n }: { n: number }) {
  return (
    <Step n={n} title="Dodirnite Dodaj" mock={<AddScreen />}>
      Gore desno dodirnite <strong>Dodaj</strong> (<em>Add</em>). Ako vidite prekidač <strong>Otvori kao web aplikaciju</strong>, ostavite
      ga uključenog.
    </Step>
  );
}

function OpenStep({ n }: { n: number }) {
  return (
    <Step n={n} title="Otvorite aplikaciju" mock={<HomeScreen />}>
      Na početnom ekranu se pojavi ikona <strong>Džamija Rečane</strong>. Otvorite je i dodirnite{" "}
      <strong>Uključi obavještenja</strong> da vam telefon javlja vrijeme namaza.
    </Step>
  );
}

/* Small drawings of the phone screens, with the place to tap marked in gold. */

function Tap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`}>
      <span className="absolute -inset-1.5 animate-ping rounded-full border-2 border-[var(--gold)] opacity-60" />
      <span className="relative grid place-items-center rounded-full ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-white">{children}</span>
    </span>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-black/10 bg-[#f2f2f7] p-3 text-[#1c1c1e] shadow-sm">{children}</div>;
}

function SafariBar() {
  return (
    <Phone>
      <div className="h-10 rounded-lg bg-white/70" />
      <div className="mt-3 rounded-xl bg-white px-3 py-2 text-center text-xs text-black/60">recanedzamija.com</div>
      <div className="mt-3 flex items-center justify-between px-2 text-[#007aff]">
        <span className="text-lg">‹</span>
        <span className="text-lg opacity-40">›</span>
        <Tap>
          <ShareIcon className="h-6 w-6 p-0.5" />
        </Tap>
        <span className="text-sm">▢</span>
        <span className="text-sm">⧉</span>
      </div>
    </Phone>
  );
}

function ChromeBar() {
  return (
    <Phone>
      <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-black/60">
        <span className="flex-1 truncate">recanedzamija.com</span>
        <Tap>
          <ShareIcon className="h-5 w-5 p-0.5 text-black/70" />
        </Tap>
      </div>
      <div className="mt-3 h-14 rounded-lg bg-white/70" />
    </Phone>
  );
}

function MoreRow() {
  const app = "flex flex-col items-center gap-1 text-[9px] text-black/50";
  return (
    <Phone>
      <div className="rounded-xl bg-white p-3">
        <div className="flex items-start justify-between">
          <span className={app}>
            <span className="h-9 w-9 rounded-full bg-[#34c759]" />
            Poruke
          </span>
          <span className={app}>
            <span className="h-9 w-9 rounded-full bg-[#7360f2]" />
            Viber
          </span>
          <span className={app}>
            <span className="h-9 w-9 rounded-full bg-[#25d366]" />
            WhatsApp
          </span>
          <span className={`${app} font-semibold text-black/80`}>
            <Tap>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e5e5ea] text-lg font-bold leading-none">⋯</span>
            </Tap>
            Više
          </span>
        </div>
      </div>
    </Phone>
  );
}

function ShareSheet() {
  const row = "flex items-center justify-between px-3 py-2 text-xs";
  return (
    <Phone>
      <div className="overflow-hidden rounded-xl bg-white">
        <div className={`${row} text-black/50`}>
          Kopiraj <span>⧉</span>
        </div>
        <div className={`${row} border-t border-black/5 text-black/50`}>
          Dodaj u oznake <span>☆</span>
        </div>
        <div className={`${row} border-t border-black/5 bg-[var(--gold)]/20 font-semibold ring-2 ring-inset ring-[var(--gold)]`}>
          Dodaj na početni ekran <span className="grid h-4 w-4 place-items-center rounded border border-current text-[10px]">+</span>
        </div>
        <div className={`${row} border-t border-black/5 text-black/50`}>
          Štampaj <span>⎙</span>
        </div>
      </div>
    </Phone>
  );
}

function AddScreen() {
  return (
    <Phone>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#007aff]">Odustani</span>
        <span className="font-semibold">Početni ekran</span>
        <Tap>
          <span className="px-2 py-0.5 font-semibold text-[#007aff]">Dodaj</span>
        </Tap>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-2.5">
        <img src={withBase("/icon-192.png")} alt="" className="h-10 w-10 rounded-lg" />
        <div className="text-xs">
          <p className="font-semibold">Džamija Rečane</p>
          <p className="text-black/50">recanedzamija.com</p>
        </div>
      </div>
    </Phone>
  );
}

function HomeScreen() {
  return (
    <div className="grid grid-cols-4 gap-3 rounded-2xl bg-[linear-gradient(160deg,#3a6b55,#1f3d30)] p-4">
      {Array.from({ length: 7 }, (_, i) => (
        <span key={i} className="aspect-square rounded-xl bg-white/20" />
      ))}
      <span className="flex flex-col items-center gap-1">
        <Tap className="w-full">
          <img src={withBase("/icon-192.png")} alt="" className="aspect-square w-full rounded-xl" />
        </Tap>
        <span className="text-[9px] text-white">Džamija R…</span>
      </span>
    </div>
  );
}

function AndroidBar() {
  return (
    <Phone>
      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-black/60">
        <span className="flex-1 truncate">recanedzamija.com</span>
        <span className="text-black/40">⧉</span>
        <Tap>
          <span className="px-2 text-base font-bold text-black/70">⋮</span>
        </Tap>
      </div>
      <div className="mt-3 h-14 rounded-lg bg-white/70" />
    </Phone>
  );
}

function AndroidMenu() {
  const row = "px-3 py-2 text-xs";
  return (
    <Phone>
      <div className="ml-auto w-48 overflow-hidden rounded-xl bg-white shadow">
        <div className={`${row} text-black/50`}>Nova kartica</div>
        <div className={`${row} text-black/50`}>Historija</div>
        <div className={`${row} bg-[var(--gold)]/20 font-semibold ring-2 ring-inset ring-[var(--gold)]`}>Instaliraj aplikaciju</div>
        <div className={`${row} text-black/50`}>Postavke</div>
      </div>
    </Phone>
  );
}

/** Lets the mosque (or anyone) send this guide to others. */
function ShareThisPage() {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/instaliraj/`;
  const share = async () => {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    try {
      if (nav.share) await nav.share({ title: "Džamija Rečane", text: "Instalirajte aplikaciju Džamija Rečane:", url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      // closed the share sheet
    }
  };
  return (
    <div className="mt-12 rounded-2xl border border-border/60 bg-secondary/40 p-6 text-center">
      <p className="text-muted-foreground">Pošaljite ovo uputstvo porodici i prijateljima:</p>
      <button onClick={share} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:brightness-125">
        <ShareIcon className="h-4 w-4" />
        {copied ? "Link je kopiran" : "Pošalji link"}
      </button>
      <p className="mt-3 text-sm text-muted-foreground">recanedzamija.com/instaliraj</p>
    </div>
  );
}
