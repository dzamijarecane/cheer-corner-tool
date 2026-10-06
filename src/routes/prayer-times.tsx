import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { PageHeader } from "@/components/site-chrome";
import { fetchPrizrenPrayerTimes } from "@/lib/prayer-times";
import { NextPrayerCountdown } from "@/components/next-prayer-countdown";
import { toHijri, formatHijri } from "@/lib/hijri";
import { withBase } from "@/lib/utils";

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
      { property: "og:url", content: "/prayer-times" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: withBase("/prayer-times") }],
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
    { name: "Sabah", adhan: data.timings.Fajr },
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
      />
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
                    <td className="px-6 py-4 font-display text-xl text-primary">{p.name}</td>
                    <td className="px-6 py-4 tabular-nums text-lg font-semibold">{p.adhan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Vremena namaza za Prizren, Kosovo prema Takvimi izvoru Islamske zajednice Kosova.
          </p>
        </div>
      </section>

    </>
  );
}
