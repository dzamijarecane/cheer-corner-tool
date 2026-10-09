import { useEffect, useState } from "react";

// Push notifications through OneSignal (onesignal.com). New announcements are written and
// sent from the OneSignal dashboard (Messages > New Push); this file only lets visitors
// turn them on or off.
export const ONESIGNAL_APP_ID = "0530949e-367e-4b93-ad35-eee2f261cab8";
// The app ID only works on the site URL set in OneSignal, so the SDK is not loaded elsewhere.
const ONESIGNAL_HOST = "recanedzamija.com";
/**
 * The site's one service worker. It loads OneSignal's push handling and then the offline
 * cache from sw.js. OneSignal registers it under this default name (with its own query
 * string), so both use the same file and never replace each other.
 */
export const SERVICE_WORKER = "OneSignalSDKWorker.js";

type PushSubscription = {
  optedIn: boolean;
  optIn: () => Promise<void>;
  optOut: () => Promise<void>;
  addEventListener: (event: "change", fn: () => void) => void;
};
type OneSignalApi = {
  init: (options: Record<string, unknown>) => Promise<void>;
  Notifications: {
    permission: boolean;
    isPushSupported: () => boolean;
    addEventListener: (event: "permissionChange", fn: () => void) => void;
  };
  User: { PushSubscription: PushSubscription };
};
type OneSignalWindow = Window & { OneSignalDeferred?: ((os: OneSignalApi) => void | Promise<void>)[] };

let ready: Promise<OneSignalApi | null> | null = null;

/** Loads and starts OneSignal once per page. Resolves to null when it can't run here. */
function loadOneSignal(): Promise<OneSignalApi | null> {
  if (ready) return ready;
  const w = window as OneSignalWindow;
  ready = new Promise((resolve) => {
    if (location.hostname !== ONESIGNAL_HOST) return resolve(null);
    w.OneSignalDeferred = w.OneSignalDeferred || [];
    w.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: SERVICE_WORKER,
          serviceWorkerParam: { scope: "/" },
          welcomeNotification: { title: "Džamija Rečane", message: "Obavještenja su uključena. Hvala!" },
        });
        resolve(OneSignal);
      } catch {
        resolve(null);
      }
    });
    const script = document.createElement("script");
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    // Blocked by an ad blocker or offline: the rest of the site works as before
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return ready;
}

type Status = "init" | "loading" | "unsupported" | "ios-install" | "denied" | "off" | "on";

function isIos() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function useNotifications() {
  const [status, setStatus] = useState<Status>("init");
  const [api, setApi] = useState<OneSignalApi | null>(null);

  useEffect(() => {
    // iPhone only allows notifications from the app installed on the home screen
    if (isIos() && !isStandalone()) {
      setStatus("ios-install");
      return;
    }
    let alive = true;
    loadOneSignal().then((os) => {
      if (!alive) return;
      if (!os || !os.Notifications.isPushSupported()) return setStatus("unsupported");
      const update = () => {
        if (typeof Notification !== "undefined" && Notification.permission === "denied") setStatus("denied");
        else setStatus(os.User.PushSubscription.optedIn ? "on" : "off");
      };
      update();
      os.User.PushSubscription.addEventListener("change", update);
      os.Notifications.addEventListener("permissionChange", update);
      setApi(os);
    });
    return () => {
      alive = false;
    };
  }, []);

  const toggle = async () => {
    if (!api) return;
    setStatus("loading");
    try {
      if (api.User.PushSubscription.optedIn) await api.User.PushSubscription.optOut();
      else await api.User.PushSubscription.optIn();
    } finally {
      if (typeof Notification !== "undefined" && Notification.permission === "denied") setStatus("denied");
      else setStatus(api.User.PushSubscription.optedIn ? "on" : "off");
    }
  };

  return { status, toggle };
}

function BellIcon({ className = "", off = false }: { className?: string; off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      {off && <path d="m3 3 18 18" />}
    </svg>
  );
}

/**
 * "Uključi obavještenja" button. `tone` picks colours for the dark footer or a light card.
 * Renders nothing where push can't work (other browsers, or before the page has loaded).
 */
export function NotificationsButton({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { status, toggle } = useNotifications();
  const muted = tone === "dark" ? "text-primary-foreground/75" : "text-muted-foreground";

  // "init": not known yet (also during the server render), so show nothing rather than flash a button
  if (status === "init" || status === "unsupported") return null;
  if (status === "ios-install")
    return (
      <p className={`max-w-sm text-sm leading-relaxed ${muted}`}>
        <BellIcon className="inline h-4 w-4 -mt-1 mr-1 text-[color:var(--gold)]" />
        Za obavještenja na iPhoneu prvo instalirajte aplikaciju na početni ekran, pa ih uključite u njoj.
      </p>
    );
  if (status === "denied")
    return (
      <p className={`max-w-sm text-sm leading-relaxed ${muted}`}>
        <BellIcon off className="inline h-4 w-4 -mt-1 mr-1" />
        Obavještenja su blokirana. Dozvolite ih za ovu stranicu u postavkama preglednika.
      </p>
    );

  const on = status === "on";
  const base = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60";
  const look = on
    ? tone === "dark"
      ? "border border-white/25 text-primary-foreground hover:bg-white/10"
      : "border border-primary/40 text-primary hover:bg-secondary"
    : tone === "dark"
      ? "bg-[var(--gold)] text-primary hover:brightness-110"
      : "bg-primary text-primary-foreground hover:brightness-125";
  return (
    <button onClick={toggle} disabled={status === "loading"} className={`${base} ${look}`} aria-pressed={on}>
      <BellIcon off={on} className="h-4 w-4" />
      {status === "loading" ? "Obavještenja…" : on ? "Isključi obavještenja" : "Uključi obavještenja"}
    </button>
  );
}
