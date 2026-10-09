import { useEffect, useState } from "react";
import { withBase } from "@/lib/utils";

// Chrome/Edge/Samsung fire this before showing their own install prompt; we keep it
// and show it from our button instead.
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallState = {
  /** Android / desktop Chrome: the browser can show its install dialog. */
  prompt: InstallPromptEvent | null;
  /** iPhone / iPad: installing is done by hand from the Share menu. */
  ios: boolean;
  /** Already opened as an installed app. */
  installed: boolean;
};

let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

function readState(): InstallState {
  const nav = navigator as Navigator & { standalone?: boolean };
  const installed = window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
  const ios =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return { prompt: deferred, ios, installed };
}

function useInstall(): InstallState | null {
  // null until mounted, so the server render and hydration match
  const [state, setState] = useState<InstallState | null>(null);
  useEffect(() => {
    const update = () => setState(readState());
    update();
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);
  return state;
}

async function runPrompt(prompt: InstallPromptEvent) {
  await prompt.prompt();
  await prompt.userChoice;
  deferred = null;
  notify();
}

/** Registers the service worker that makes the site installable and usable offline. */
export function useServiceWorker() {
  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(withBase("/sw.js"), { scope: withBase("/") }).catch(() => {});
  }, []);
}

function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3v12M8 7l4-4 4 4" />
      <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
    </svg>
  );
}

function IosSteps() {
  return (
    <>
      Dodirnite <ShareIcon className="inline h-4 w-4 -mt-1" /> <strong>Podijeli</strong>, pa{" "}
      <strong>Dodaj na početni ekran</strong>.
    </>
  );
}

/** Footer block: install button, or the iPhone steps. Hidden when installed or not possible. */
export function InstallAppFooter() {
  const s = useInstall();
  if (!s || s.installed || (!s.prompt && !s.ios)) return null;
  return (
    <div className="mt-6">
      {s.prompt ? (
        <button
          onClick={() => s.prompt && runPrompt(s.prompt)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-primary transition hover:brightness-110"
        >
          <PhoneIcon className="h-4 w-4" />
          Instaliraj aplikaciju
        </button>
      ) : (
        <p className="max-w-sm text-sm text-primary-foreground/75 leading-relaxed">
          <span className="font-semibold text-[color:var(--gold)]">Instalirajte na telefon: </span>
          <IosSteps />
        </p>
      )}
    </div>
  );
}

const DISMISS_KEY = "install-banner-dismissed";

/** Small bar at the bottom of the screen on phones, offering to install the site as an app. */
export function InstallBanner() {
  const s = useInstall();
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);
  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // private mode: the banner just comes back next visit
    }
  };

  if (!s || dismissed || s.installed || (!s.prompt && !s.ios)) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 md:hidden" role="dialog" aria-label="Instalirajte aplikaciju">
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-primary px-4 py-3 text-primary-foreground shadow-[var(--shadow-soft)]">
        <img src={withBase("/icon-192.png")} alt="" className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 text-sm leading-snug">
          <p className="font-semibold">Džamija Rečane na telefonu</p>
          <p className="text-primary-foreground/75 text-xs mt-0.5">
            {s.prompt ? "Vreme namaza i kibla, i bez interneta." : <IosSteps />}
          </p>
        </div>
        {s.prompt && (
          <button
            onClick={() => s.prompt && runPrompt(s.prompt).then(close)}
            className="shrink-0 rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-primary"
          >
            Instaliraj
          </button>
        )}
        <button onClick={close} aria-label="Zatvori" className="shrink-0 p-1 text-xl leading-none text-primary-foreground/70">
          ×
        </button>
      </div>
    </div>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}
