import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import interiorImg from "@/assets/mosque-recane-interior.jpg";
import exteriorImg from "@/assets/mosque-recane-exterior.jpg";
import duskImg from "@/assets/mosque-recane-dusk.jpg";
import { fetchPrizrenPrayerTimes } from "@/lib/prayer-times";
import { toHijri, formatHijri } from "@/lib/hijri";
import { withBase } from "@/lib/utils";

const prayerTimesQuery = queryOptions({
  queryKey: ["prayer-times", "prizren", new Date().toDateString()],
  queryFn: () => fetchPrizrenPrayerTimes(),
  staleTime: 1000 * 60 * 30,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Džamija Rečane — Prizren, Kosovo" },
      { name: "description", content: "Džamija Rečane u Prizrenu, Kosovo — dobrodošli na dnevne namaze, časove Kur'ana i događaje zajednice." },
      { property: "og:title", content: "Džamija Rečane — Prizren, Kosovo" },
      { property: "og:description", content: "Dnevni namazi, časovi i događaji zajednice u Prizrenu, Kosovo." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: withBase("/") }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(prayerTimesQuery),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero: the minaret at dusk, with today's prayers as lit windows */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <img
            src={duskImg}
            alt="Minaret džamije Rečane u sumrak"
            width={960}
            height={960}
            className="h-full w-full object-cover object-[70%_30%]"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pt-24 md:pt-36 pb-12">
          <p className="font-arabic text-2xl md:text-3xl text-[color:var(--gold)] mb-6" dir="rtl" lang="ar" style={{ textAlign: "left" }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.04] max-w-3xl">
            Dom vjere, znanja i zajedništva.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-xl">
            Dobrodošli u džamiju Rečane, mjesto ibadeta.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/prayer-times"
              className="rounded-full bg-[var(--gold)] text-primary px-7 py-3 text-sm font-semibold hover:brightness-110 transition"
            >
              Današnje vreme namaza
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              O džamiji
            </Link>
          </div>

          <div className="mt-16 md:mt-24">
            <Suspense fallback={<div className="text-primary-foreground/70 text-sm">Učitavanje vaktova…</div>}>
              <PrayerWindows />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 grid gap-6 sm:grid-cols-3" data-reveal-stagger>
          {[
            { to: "/qibla" as const, icon: "qibla", t: "Kibla i tesbih", d: "Smjer Kible i brojač zikra." },
            { to: "/quran" as const, icon: "book", t: "Kur'an i dove", d: "Kratke sure i svakodnevne dove." },
            { to: "/calendar" as const, icon: "moon", t: "Hidžretski kalendar", d: "Ramazan, Bajrami i mubarek noći." },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              data-tilt
              className="group relative rounded-2xl border border-border bg-card p-8 pt-10 hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 transition"
            >
              <span className="arch-sm grid h-16 w-12 place-items-center bg-primary text-[color:var(--gold)] transition group-hover:shadow-[var(--shadow-glow)]">
                <ToolIcon name={c.icon} />
              </span>
              <h3 className="mt-6 font-display text-2xl text-primary">{c.t}</h3>
              <p className="mt-2 text-muted-foreground">{c.d}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--wood)]">
                Otvori <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Welcome */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-[0.9fr_1.1fr] gap-14 items-center" data-reveal-stagger>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="arch absolute -inset-3 border border-[var(--gold)]/60" aria-hidden />
            <img
              src={exteriorImg}
              alt="Džamija Rečane noću, osvijetljeni prozori i minaret"
              width={844}
              height={1500}
              loading="lazy"
              className="arch relative aspect-[3/4] w-full object-cover shadow-[var(--shadow-soft)]"
            />
          </div>
          <div>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[color:var(--wood)] mb-5">
              <span className="h-px w-10 bg-[var(--wood)]" aria-hidden />
              Es-selamu alejkum
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-primary">
              Dobro došli u našu džamiju
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Es-selamu alejkum dragi prijatelji, džematlije i svi ljudi dobre volje!
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Ova stranica je kreirana sa ciljem da vas redovno obaveštavamo o aktivnostima našeg džemata i džamije u Rečane.
              Bilo da nam dolazite prvi put ili nam se redovno pridružujete, pronaći ćete toplo mjesto za namaz, učenje i pripadnost.
            </p>
            <div className="mt-9">
              <Link to="/about" className="rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm font-semibold hover:brightness-125 transition">
                Naša priča
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interior band with hadith */}
      <section className="relative overflow-hidden">
        <img
          src={interiorImg}
          alt="Unutrašnjost džamije Rečane"
          width={2000}
          height={1500}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.22_0.04_155/0.92)_0%,oklch(0.22_0.04_155/0.75)_45%,oklch(0.22_0.04_155/0.2)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 text-primary-foreground" data-reveal>
          <p className="font-display text-3xl md:text-5xl leading-snug max-w-xl">
            „Allahu su najdraža mjesta na Zemlji džamije.“
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.22em] text-[color:var(--gold)]">
            Muhammed, sallallahu alejhi ve sellem
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-12" data-reveal>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[color:var(--wood)] mb-5">
              <span className="h-px w-10 bg-[var(--wood)]" aria-hidden />
              Šta nudimo
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-primary">Mjesto za svaki dio sedmice.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" data-reveal-stagger>
            {[
              { t: "Dnevni namazi", d: "Od sabaha do jacije, svaki dan u godini." },
              { t: "Kur'an i učenje", d: "Sedmični časovi Kur'ana, za sve uzraste i nivoe." },
              { t: "Događaji zajednice", d: "Iftari, bajramske proslave i predavanja." },
              { t: "Zekat i sadaka", d: "Sakupljanje i raspodjela zekata, sadake i pomoći u hrani onima kojima je potrebna." },
            ].map((f) => (
              <article key={f.t} data-tilt className="rounded-2xl bg-card border border-border p-7 border-t-4 border-t-[var(--gold)] hover:shadow-[var(--shadow-soft)] transition">
                <h3 className="font-display text-2xl text-primary mb-3">{f.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function toMin(t: string) {
  return Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
}

function PrayerWindows() {
  const { data } = useSuspenseQuery(prayerTimesQuery);
  // Start the clock only in the browser so SSR and hydration render the same markup
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { name: "Sabah", adhan: data.timings.Fajr },
    { name: "Podne", adhan: data.timings.Dhuhr },
    { name: "Ikindija", adhan: data.timings.Asr },
    { name: "Akšam", adhan: data.timings.Maghrib },
    { name: "Jacija", adhan: data.timings.Isha },
  ];
  let nextIdx = -1;
  let countdown = "--:--:--";
  if (now) {
    const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    nextIdx = items.findIndex((p) => toMin(p.adhan) > nowMin);
    const diff = nextIdx === -1 ? 1440 - nowMin + toMin(items[0].adhan) : toMin(items[nextIdx].adhan) - nowMin;
    if (nextIdx === -1) nextIdx = 0;
    const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
    countdown = `${pad(diff / 60)}:${pad(diff % 60)}:${pad((diff * 60) % 60)}`;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--gold)]">Danas · Prizren</p>
          <p className="mt-1 text-primary-foreground/80">
            {data.date.readable}
            {now && ` · ${formatHijri(toHijri(now))}`}
          </p>
        </div>
        <p className="text-primary-foreground/80">
          {nextIdx === -1 ? "Sljedeći namaz" : items[nextIdx].name} za{" "}
          <span className="font-semibold tabular-nums text-primary-foreground text-lg">{countdown}</span>
          <Link to="/prayer-times" className="ml-4 text-[color:var(--gold)] underline underline-offset-4">
            Cijeli raspored →
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {items.map((p, i) => {
          const next = i === nextIdx;
          return (
            <div
              key={p.name}
              data-tilt="10"
              style={{ animationDelay: `${i * 90}ms` }}
              className={`window-open arch px-1 pt-8 pb-5 sm:pt-12 sm:pb-6 text-center transition ${
                next
                  ? "bg-[var(--gold)] text-primary shadow-[var(--shadow-glow)]"
                  : "bg-white/[0.07] border border-white/15 backdrop-blur-sm"
              }`}
            >
              <div className={`text-[11px] sm:text-sm ${next ? "font-semibold" : "text-primary-foreground/75"}`}>{p.name}</div>
              <div className="mt-2 font-display text-xl sm:text-3xl tabular-nums">{p.adhan}</div>
              <div className={`mt-1 text-[10px] sm:text-xs uppercase tracking-widest ${next ? "" : "text-primary-foreground/50"}`}>
                {next ? "Sljedeći" : "Ezan"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolIcon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "qibla")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" fill="currentColor" />
      </svg>
    );
  if (name === "book")
    return (
      <svg {...common}>
        <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z" />
        <path d="M12 6.5v13" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      <path d="m17 4 .6 1.4L19 6l-1.4.6L17 8l-.6-1.4L15 6l1.4-.6z" fill="currentColor" />
    </svg>
  );
}
