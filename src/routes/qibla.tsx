import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/site-chrome";
import { withBase } from "@/lib/utils";

export const Route = createFileRoute("/qibla")({
  head: () => ({
    meta: [
      { title: "Kibla i tesbih | Džamija Rečane" },
      { name: "description", content: "Odredite smjer Kible iz Rečana i Prizrena i koristite digitalni tesbih za zikr." },
      { property: "og:title", content: "Kibla i tesbih | Džamija Rečane" },
      { property: "og:description", content: "Smjer Kible za Prizren i digitalni brojač zikra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: withBase("/qibla") }],
  }),
  component: QiblaPage,
});

// Rečane / Prizren
const LAT = 42.1705;
const LON = 20.7419;
// Kaba
const KLAT = 21.4225;
const KLON = 39.8262;

function qiblaBearing(): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLon = toRad(KLON - LON);
  const y = Math.sin(dLon) * Math.cos(toRad(KLAT));
  const x =
    Math.cos(toRad(LAT)) * Math.sin(toRad(KLAT)) -
    Math.sin(toRad(LAT)) * Math.cos(toRad(KLAT)) * Math.cos(dLon);
  return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
}

const BEARING = qiblaBearing();
/** Degrees either side of the Qibla within which the phone counts as facing it. */
const ALIGN_TOLERANCE = 10;

function QiblaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kibla · Zikr"
        title="Smjer Kible i digitalni tesbih"
        description="Okrenite se prema Kabi i olakšajte sebi svakodnevni zikr."
      />
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 grid gap-8 md:grid-cols-2">
          <QiblaCompass />
          <Tasbih />
        </div>
      </section>
    </>
  );
}

function QiblaCompass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "on" | "unsupported">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("DeviceOrientationEvent" in window)) setStatus("unsupported");
  }, []);

  function start() {
    const anyEvent = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    const attach = () => {
      window.addEventListener("deviceorientationabsolute" as keyof WindowEventMap, handler as EventListener);
      window.addEventListener("deviceorientation", handler as EventListener);
      setStatus("on");
    };
    const handler = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      const compass = e.webkitCompassHeading ?? (e.alpha != null ? 360 - e.alpha : null);
      if (compass != null) setHeading(compass);
    };
    if (typeof anyEvent?.requestPermission === "function") {
      anyEvent.requestPermission().then((r) => (r === "granted" ? attach() : setStatus("unsupported")));
    } else {
      attach();
    }
  }

  // With a live compass, how far the phone is from the Qibla (-180..180, positive = turn right)
  const offset = heading == null ? null : ((BEARING - heading + 540) % 360) - 180;
  const aligned = offset != null && Math.abs(offset) <= ALIGN_TOLERANCE;
  // Arrow angle relative to the top of the phone; without a compass it is the bearing from north.
  // Keep it continuous so crossing 0°/360° turns the short way instead of spinning round.
  const target = offset ?? BEARING;
  const rotationRef = useRef(target);
  const step = ((target - rotationRef.current + 540) % 360) - 180;
  rotationRef.current += step;
  const rotation = rotationRef.current;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
      <h2 className="font-display text-3xl text-primary">Kibla</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Iz Rečana smjer Kible je <strong>{BEARING.toFixed(1)}°</strong> u odnosu na sjever
        (jugoistok).
      </p>

      <div
        className={`mt-8 mx-auto relative h-60 w-60 rounded-full border-2 bg-background grid place-items-center transition-colors ${
          aligned ? "border-[var(--gold)] shadow-[var(--shadow-glow)]" : "border-border/70"
        }`}
      >
        {/* Top of the phone: point the arrow here to face the Qibla */}
        <span
          className={`absolute top-1.5 left-1/2 -translate-x-1/2 h-0 w-0 border-x-[7px] border-x-transparent border-t-[10px] transition-colors ${
            aligned ? "border-t-[var(--gold)]" : "border-t-border"
          }`}
          aria-hidden
        />
        <div
          className="absolute h-full w-full transition-transform duration-300"
          style={{ transform: `rotate(${rotation}deg)` }}
          aria-label={`Smjer Kible: ${BEARING.toFixed(0)}°`}
          role="img"
        >
          <div className="absolute left-1/2 top-4 -translate-x-1/2 flex flex-col items-center">
            <span className="text-2xl leading-none">🕋</span>
            <span
              className="mt-1 h-0 w-0 border-x-[9px] border-x-transparent border-b-[14px] border-b-[var(--gold)]"
              aria-hidden
            />
            <div className="h-[78px] w-[4px] rounded-b bg-[var(--gold)]" />
          </div>
        </div>
        <div className="h-3 w-3 rounded-full bg-primary" />
      </div>

      {status !== "on" && (
        <button
          onClick={start}
          className="mt-8 w-full rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium"
        >
          Uključi kompas na telefonu
        </button>
      )}
      {offset != null && (
        <p
          className={`mt-6 text-center font-medium ${aligned ? "text-primary" : "text-muted-foreground"}`}
          aria-live="polite"
        >
          {aligned
            ? "Okrenuti ste prema Kibli."
            : `Okrenite se ${offset > 0 ? "udesno" : "ulijevo"} dok strelica ne pokaže prema gore.`}
        </p>
      )}
      {status === "on" && heading == null && (
        <p className="mt-6 text-sm text-muted-foreground">Pomjerite telefon u obliku osmice da se kompas kalibriše.</p>
      )}
      {status === "unsupported" && (
        <p className="mt-4 text-sm text-muted-foreground">
          Vaš uređaj nema kompas. Koristite smjer {BEARING.toFixed(0)}° na klasičnom kompasu.
        </p>
      )}
    </div>
  );
}

const ZIKR = [
  { ar: "سُبْحَانَ ٱللَّٰهِ", tr: "Subhanallah", target: 33 },
  { ar: "ٱلْحَمْدُ لِلَّٰهِ", tr: "Elhamdulillah", target: 33 },
  { ar: "ٱللَّٰهُ أَكْبَرُ", tr: "Allahu ekber", target: 34 },
  { ar: "أَسْتَغْفِرُ ٱللَّٰهَ", tr: "Estagfirullah", target: 100 },
];

function Tasbih() {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const current = ZIKR[index];

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)] flex flex-col">
      <h2 className="font-display text-3xl text-primary">Tesbih</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {ZIKR.map((z, i) => (
          <button
            key={z.tr}
            onClick={() => {
              setIndex(i);
              setCount(0);
            }}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              i === index
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            {z.tr}
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="font-arabic text-4xl text-primary">{current.ar}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {current.tr} · cilj {current.target}
        </p>
      </div>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="mt-8 mx-auto grid h-40 w-40 place-items-center rounded-full bg-primary text-primary-foreground text-5xl font-semibold tabular-nums active:scale-95 transition"
        aria-label="Dodaj zikr"
      >
        {count}
      </button>

      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-[var(--gold)] transition-all"
          style={{ width: `${Math.min(100, (count / current.target) * 100)}%` }}
        />
      </div>

      <button
        onClick={() => setCount(0)}
        className="mt-6 self-center rounded-full border border-border px-6 py-2 text-sm text-muted-foreground hover:bg-secondary transition"
      >
        Poništi
      </button>
    </div>
  );
}
