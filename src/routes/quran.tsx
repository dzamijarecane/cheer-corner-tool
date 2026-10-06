import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { PageHeader } from "@/components/site-chrome";
import { withBase } from "@/lib/utils";
// Generated from verified sources: Qur'an text of the King Fahd Complex (Hafs),
// Besim Korkut's translation, and Sahih al-Bukhari / Sahih Muslim (Arabic, standard numbering).
import content from "@/data/kuran-dove-hadisi.json";

export const Route = createFileRoute("/quran")({
  head: () => ({
    meta: [
      { title: "Kur'an, dove i hadisi | Džamija Rečane" },
      {
        name: "description",
        content:
          "Sure i ajeti iz Kur'ana, svakodnevne dove i hadisi iz Buharije i Muslima, na arapskom, s transkripcijom i prijevodom na bosanski.",
      },
      { property: "og:title", content: "Kur'an, dove i hadisi | Džamija Rečane" },
      { property: "og:description", content: "Sure, dove i vjerodostojni hadisi s prijevodom." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: withBase("/quran") }],
  }),
  component: QuranPage,
});

type Sura = {
  title: string;
  sub: string;
  verses: number[];
  ar: string[];
  tr: string[];
  mean: string[];
  source: string;
};
type Dova = { title: string; sub: string; ar: string; tr: string; mean: string; source: string };
type Hadis = { title: string; sub: string; ar: string; mean: string; source: string; excerpt: boolean };

const SURE = content.sure as Sura[];
const DOVE = content.dove as Dova[];
const HADISI = content.hadisi as Hadis[];

const TABS = [
  { id: "sure", label: "Sure i ajeti" },
  { id: "dove", label: "Dove" },
  { id: "hadisi", label: "Hadisi" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

function QuranPage() {
  const [tab, setTab] = useState<Tab>("sure");

  return (
    <>
      <PageHeader
        eyebrow="Kur'an · Dove · Hadisi"
        title="Sure, dove i hadisi"
        description="Na arapskom, s transkripcijom i prijevodom na bosanski, iz provjerenih izvora."
      />
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="inline-flex flex-wrap rounded-full border border-border/60 bg-card p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-5 sm:px-6 py-2 text-sm font-medium transition ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "hadisi" && (
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Vjerodostojni hadisi iz zbirki <strong className="text-foreground">Sahih el-Buhari</strong> i{" "}
              <strong className="text-foreground">Sahih Muslim</strong>. Uz svaki je naveden broj hadisa, pa ga
              možete provjeriti u samoj zbirci.
            </p>
          )}

          <div className="mt-8 space-y-5" key={tab}>
            {tab === "sure" && SURE.map((s) => <SuraCard key={s.title} sura={s} />)}
            {tab === "dove" && DOVE.map((d) => <DovaCard key={d.title} dova={d} />)}
            {tab === "hadisi" && HADISI.map((h) => <HadisCard key={h.title} hadis={h} />)}
          </div>

          <div className="mt-12 rounded-xl border border-border/60 bg-secondary/40 p-6 text-sm text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-2">Izvori</p>
            <p>Arapski tekst Kur'ana: {content.sources.quranArabic}.</p>
            <p>{content.sources.quranBosnian}.</p>
            <p>
              Hadisi: {content.sources.hadith}. Dove iz sunneta navedene su s brojem hadisa u zbirci iz koje
              potiču.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Expandable({
  title,
  sub,
  source,
  children,
}: {
  title: string;
  sub: string;
  source: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-secondary/40 transition"
      >
        <span>
          <span className="block font-display text-2xl text-primary">{title}</span>
          <span className="block text-xs uppercase tracking-widest text-muted-foreground mt-1">{sub}</span>
        </span>
        <span className="text-[color:var(--gold)] text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-border/60 px-6 py-6">
          {children}
          <p className="mt-5 text-xs uppercase tracking-widest text-[color:var(--wood)]">{source}</p>
        </div>
      )}
    </article>
  );
}

function Arabic({ children }: { children: ReactNode }) {
  return (
    <p dir="rtl" lang="ar" className="font-arabic text-3xl leading-[2.1] text-primary text-right">
      {children}
    </p>
  );
}

function SuraCard({ sura }: { sura: Sura }) {
  return (
    <Expandable title={sura.title} sub={sura.sub} source={sura.source}>
      <Arabic>
        {sura.ar.map((a, i) => (
          <span key={i}>
            {a}{" "}
            <span className="text-[color:var(--gold)] whitespace-nowrap">﴿{toArabicDigits(sura.verses[i])}﴾</span>{" "}
          </span>
        ))}
      </Arabic>
      <p className="mt-5 text-sm italic text-muted-foreground">{sura.tr.join(". ")}.</p>
      <p className="mt-3 leading-relaxed">
        {sura.mean.map((m, i) => (
          <span key={i}>
            <sup className="text-[color:var(--gold)] font-semibold mr-0.5">{sura.verses[i]}</sup>
            {m}{" "}
          </span>
        ))}
      </p>
    </Expandable>
  );
}

function DovaCard({ dova }: { dova: Dova }) {
  return (
    <Expandable title={dova.title} sub={dova.sub} source={dova.source}>
      <Arabic>{dova.ar}</Arabic>
      <p className="mt-5 text-sm italic text-muted-foreground">{dova.tr}</p>
      <p className="mt-3 leading-relaxed">{dova.mean}</p>
    </Expandable>
  );
}

function HadisCard({ hadis }: { hadis: Hadis }) {
  return (
    <Expandable title={hadis.title} sub={hadis.sub} source={hadis.source}>
      <Arabic>
        {hadis.excerpt && "… "}
        {hadis.ar}
        {hadis.excerpt && " …"}
      </Arabic>
      <p className="mt-5 leading-relaxed">{hadis.mean}</p>
      {hadis.excerpt && <p className="mt-2 text-sm text-muted-foreground">Dio dužeg hadisa.</p>}
    </Expandable>
  );
}
