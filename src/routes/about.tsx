import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site-chrome";
import duskImg from "@/assets/mosque-recane-dusk.jpg";
import { withBase } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "O nama | Džamija Rečane" },
      { name: "description", content: "Naša istorija, misija i zajednica kojoj služimo u džamiji Rečane." },
      { property: "og:title", content: "O džamiji Rečane" },
      { property: "og:description", content: "Naša istorija, misija i zajednica." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: withBase("/about") }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="O nama"
        title="Dobro došli na zvaničnu stranicu naše džamije"
        description={"\n"}
      />
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-14 items-start" data-reveal-stagger>
          <img src={duskImg} alt="Džamija Rečane u sumrak" width={960} height={960} loading="lazy" className="rounded-xl shadow-[var(--shadow-soft)]" />
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Naša misija je da kroz ibadet, edukaciju i društveno korisne aktivnosti jačamo vjeru, njegujemo islamske vrijednosti i gradimo snažnu i povezanu zajednicu.
            </p>
            <p className="whitespace-pre-line">
              Allahov Poslanik, Muhammed, sallallahu alejhi ve sellem, rekao je:

              „Allahu su najdraža mjesta na Zemlji džamije.“

              Ove plemenite riječi podsjećaju nas na posebnu vrijednost džamije kao mjesta u kojem se vjernici okupljaju radi ibadeta, učenja, dove i međusobnog jačanja  veza.
            </p>
            <p>
              Neka ova stranica bude prostor koji će vas približiti našoj džamiji, njenim aktivnostima i džematu, te vas podsjetiti na ljepotu okupljanja u Allahovoj kući i važnost zajedničkog činjenja dobra. Dobro nam došli.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50 border-y border-border/60">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-4xl mb-12 text-center">Naše vrijednosti</h2>
          <div className="grid md:grid-cols-3 gap-8" data-reveal-stagger>
            {[
              { t: "Vjera", d: "Utemeljeni u Kur'anu i Sunnetu, trudimo se ibadetiti Allahu s iskrenošću." },
              { t: "Znanje", d: "Vjerujemo da je učenje doživotna obaveza i radost. Svi su dobrodošli da uče s nama." },
              { t: "Zajednica", d: "Džamija je dom. Brinemo jedni o drugima, o komšijama i o onima kojima je pomoć potrebna." },
            ].map((v) => (
              <div key={v.t} className="text-center">
                <h3 className="font-display text-2xl text-primary mb-3">{v.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
