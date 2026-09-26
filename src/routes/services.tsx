import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site-chrome";
import { withBase } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Usluge — Džamija Rečane" },
      { name: "description", content: "Nikah, dženaza, podrška novim muslimanima, savjetovanje i zekat u džamiji Rečane." },
      { property: "og:title", content: "Usluge — Džamija Rečane" },
      { property: "og:description", content: "Nikah, dženaza, podrška novim muslimanima, savjetovanje i zekat." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: withBase("/services") }],
  }),
  component: Services,
});

const SERVICES = [
  { t: "Nikah (vjenčanje)", d: "Nikah obrede vodi naš imam. Molimo kontaktirajte nas najmanje 30 dana unaprijed." },
  { t: "Dženaza", d: "Gasuljenje, kefinjenje, dženaza-namaz i vođenje ukopa za porodice u potrebi." },
  { t: "Podrška novim muslimanima", d: "Uzmite šehadet s nama. Mentorstvo, resursi i zajednica za put koji slijedi." },
  { t: "Savjetovanje", d: "Povjerljivo savjetovanje na osnovi vjere za pojedince, parove i porodice." },
  { t: "Zekat i sadaka", d: "Prikupljanje i lokalna raspodjela zekata, uz našu godišnju ostavu hrane." },
  { t: "Međuvjerski dijalog i obilasci", d: "Vođeni obilasci džamije i međuvjerski razgovori za škole, grupe i komšije." },
];

function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Usluge"
        title="Kako služimo našoj zajednici."
        description="Od svakodnevnog do najvažnijih trenutaka — tu smo za momente koji su bitni."
      />
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-6" data-reveal-stagger>
          {SERVICES.map((s, i) => (
            <article key={s.t} data-tilt="6" className="rounded-xl bg-card border border-border/60 p-8 hover:shadow-[var(--shadow-soft)] transition">
              <div className="text-xs font-mono text-[color:var(--gold)] mb-4">0{i + 1}</div>
              <h3 className="font-display text-2xl text-primary mb-3">{s.t}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.d}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
