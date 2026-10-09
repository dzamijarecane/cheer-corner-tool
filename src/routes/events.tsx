import { createFileRoute } from "@tanstack/react-router";
import { FacebookLink, PageHeader } from "@/components/site-chrome";
import { canonical } from "@/lib/utils";
import { NotificationsButton } from "@/components/notifications";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Događaji | Džamija Rečane" },
      { name: "description", content: "Predstojeći događaji, predavanja, iftari, bajramski namazi i programi zajednice u džamiji Rečane." },
      { property: "og:title", content: "Događaji u džamiji Rečane" },
      { property: "og:description", content: "Predavanja, iftari, bajramski namazi i programi zajednice." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/events") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/events") }],
  }),
  component: Events,
});

const EVENTS = [
  {
    date: "\n",
    time: "\n",
    title: "Zajednički iftar",
    body: "Iftarite s zajednicom. Besplatan obrok za sve",
    tag: "Ramazan",
  },
  {
    date: "\n",
    time: "\n",
    title: "Bajramska podjela paketića",
    body: "Za vrijeme Bajrama organizujemo podjelu paketića za djecu mlađeg uzrasta, kako bismo im uljepšali praznik.",
    tag: "Bajram",
  },
  {
    date: "\n",
    time: "\n",
    title: "Predavanja",
    body: "S vremena na vrijeme u našoj džamiji se održavaju predavanja na različite teme. Termini se objavljuju neformalno, pratite obavještenja u džamiji i na ovoj stranici.",
    tag: "PREDAVANJA",
  },

  {
    date: "\n",
    time: "\n",
    title: "Vikend mekteb",
    body: "Kur'an, arapski jezik i islamske nauke za sve uzraste\u00a0",
    tag: "Redovno",
  },
];

function Events() {
  return (
    <>
      <PageHeader
        eyebrow="Događaji"
        title="Šta se dešava u našoj džamiji."
        description="Od sedmičnih halki do bajram-namaza, uvijek se nešto dešava. Svi su dobrodošli."
      />
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-6" data-reveal-stagger>
          {EVENTS.map((e) => (
            <article key={e.title} data-tilt="6" className="group rounded-xl border border-border/60 bg-card p-7 hover:shadow-[var(--shadow-soft)] transition">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  {e.date.trim() && <div className="text-sm text-primary font-medium">{e.date}</div>}
                  {e.time.trim() && <div className="text-xs text-muted-foreground mt-1">{e.time}</div>}
                </div>
                <span className="text-xs uppercase tracking-widest text-[color:var(--gold)] border border-[var(--gold)]/40 rounded-full px-3 py-1">
                  {e.tag}
                </span>
              </div>
              <h3 className="font-display text-2xl mb-2">{e.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{e.body}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto max-w-6xl px-6 mt-10">
          <div className="rounded-xl border border-border/60 bg-secondary/40 p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <p className="text-muted-foreground leading-relaxed">
              Najnovije obavijesti, termine i slike objavljujemo na našoj Facebook stranici. Uključite
              obavještenja i telefon će vam javiti kad objavimo nešto novo.
            </p>
            <div className="flex flex-wrap gap-3">
              <NotificationsButton tone="light" />
              <FacebookLink tone="light" label="Facebook stranica" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
