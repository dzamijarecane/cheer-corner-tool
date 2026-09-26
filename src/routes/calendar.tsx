import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site-chrome";
import { toHijri, formatHijri, upcomingHolidays, daysUntil } from "@/lib/hijri";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Hidžretski kalendar i praznici | Džamija Rečane" },
      { name: "description", content: "Današnji hidžretski datum te datumi Ramazana, Bajrama, Mevluda i drugih islamskih praznika." },
      { property: "og:title", content: "Hidžretski kalendar i praznici — Džamija Rečane" },
      { property: "og:description", content: "Islamski datumi, Ramazan, Bajrami i mubarek noći." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/calendar" }],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const today = new Date();
  const hijri = toHijri(today);
  const holidays = upcomingHolidays(today);

  return (
    <>
      <PageHeader
        eyebrow="Hidžretski kalendar"
        title="Islamski datumi i mubarek dani"
        description="Pratite hidžretski datum i najvažnije dane u godini."
      />
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]">Danas</p>
            <p className="mt-3 font-display text-4xl md:text-5xl">{formatHijri(hijri)}</p>
          </div>

          <h2 className="mt-14 font-display text-3xl">Naredni mubarek dani</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2" data-reveal-stagger>
            {holidays.map((h) => {
              const d = daysUntil(h.gregorian, today);
              return (
                <article
                  key={`${h.name}-${h.gregorianLabel}`}
                  data-tilt="6"
                  className="rounded-xl border border-border/60 bg-card p-6 hover:shadow-[var(--shadow-soft)] transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl text-primary">{h.name}</h3>
                    <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {d === 0 ? "danas" : `za ${d} dana`}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{h.note}</p>
                  <p className="mt-4 text-sm font-medium">{h.gregorianLabel}</p>
                  <p className="text-xs text-muted-foreground">{h.hijri}</p>
                </article>
              );
            })}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Datumi su izračunati po hidžretskom kalendaru i mogu se razlikovati za jedan dan
            u odnosu na zvaničnu objavu Islamske zajednice.
          </p>
        </div>
      </section>
    </>
  );
}
