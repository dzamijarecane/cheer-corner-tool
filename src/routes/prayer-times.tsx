import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { PageHeader } from "@/components/site-chrome";
import { SABAH_MINUTES_BEFORE_SUNRISE, fetchPrizrenPrayerTimes } from "@/lib/prayer-times";
import { NextPrayerCountdown } from "@/components/next-prayer-countdown";
import { toHijri, formatHijri } from "@/lib/hijri";
import { canonical } from "@/lib/utils";

const prayerTimesQuery = queryOptions({
  queryKey: ["prayer-times", "prizren", new Date().toDateString()],
  queryFn: () => fetchPrizrenPrayerTimes(),
  staleTime: 1000 * 60 * 30,
});

export const Route = createFileRoute("/prayer-times")({
  head: () => ({
    meta: [
      { title: "Vreme namaza, Prizren, Kosovo | Džamija Rečane" },
      { name: "description", content: "Dnevni ezan za Prizren, Kosovo, u džamiji Rečane." },
      { property: "og:title", content: "Vreme namaza, Prizren, Kosovo" },
      { property: "og:description", content: "Dnevni ezan za Prizren, Kosovo." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/prayer-times") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/prayer-times") }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(prayerTimesQuery),
  component: PrayerTimesPage,
});


function PrayerTimesPage() {
  return (
    <>
      <Suspense fallback={<PageHeader eyebrow="Vreme namaza" title="Učitavanje…" description="Prizren, Kosovo" />}>
        <PrayerTimesContent />
      </Suspense>
    </>
  );
}

function PrayerTimesContent() {
  const { data } = useSuspenseQuery(prayerTimesQuery);
  const rows = [
    { name: "Sabah", adhan: data.timings.Fajr, note: "Klanjanje u džamiji Rečane" },
    { name: "Izlazak sunca", adhan: data.timings.Sunrise },
    { name: "Podne", adhan: data.timings.Dhuhr },
    { name: "Ikindija", adhan: data.timings.Asr },
    { name: "Akšam", adhan: data.timings.Maghrib },
    { name: "Jacija", adhan: data.timings.Isha },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Vreme namaza · Prizren, Kosovo"
        title="Vremenski raspored namaza"
        description={`${data.date.readable} · ${formatHijri(toHijri(new Date()))}`}
      >
        <figure className="mt-8 max-w-2xl border-l-2 border-[var(--gold)] pl-5">
          <p dir="rtl" lang="ar" className="font-arabic text-2xl md:text-3xl leading-[1.9] text-[color:var(--gold)] text-right md:text-left">
            إِنَّ ٱلصَّلَوٰةَ كَانَتۡ عَلَى ٱلۡمُؤۡمِنِينَ كِتَٰبًا مَّوۡقُوتًا
          </p>
          <blockquote className="mt-2 font-display text-xl md:text-2xl text-primary-foreground/90">
            „…vjernicima je propisano da u određeno vrijeme namaz obavljaju.“
          </blockquote>
          <figcaption className="mt-2 text-xs uppercase tracking-widest text-primary-foreground/60">
            En-Nisa', 103
          </figcaption>
        </figure>
      </PageHeader>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8">
            <NextPrayerCountdown timings={data.timings} />
          </div>
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-left">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 font-display text-lg">Namaz</th>
                  <th className="px-6 py-4 font-display text-lg">Ezan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.map((p) => (
                  <tr key={p.name} className="hover:bg-secondary/50 transition">
                    <td className="px-6 py-4">
                      <span className="block font-display text-xl text-primary">{p.name}</span>
                      {"note" in p && p.note && (
                        <span className="block text-xs uppercase tracking-widest text-[color:var(--wood)] mt-0.5">{p.note}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 tabular-nums text-lg font-semibold">{p.adhan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Vrijeme sabaha je vrijeme kada se sabah-namaz klanja u džamiji Rečane: {SABAH_MINUTES_BEFORE_SUNRISE}{" "}
            minuta prije izlaska sunca, pa se pomjera svaki dan zajedno s izlaskom sunca.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ostala vremena namaza za Prizren, Kosovo prema Takvimi izvoru Islamske zajednice Kosova.
          </p>
        </div>
      </section>

    </>
  );
}
