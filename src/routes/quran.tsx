import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site-chrome";
import { withBase } from "@/lib/utils";

export const Route = createFileRoute("/quran")({
  head: () => ({
    meta: [
      { title: "Kur'an i dove | Džamija Rečane" },
      { name: "description", content: "Kratke sure i svakodnevne dove na arapskom, s transkripcijom i prijevodom na bosanskom." },
      { property: "og:title", content: "Kur'an i dove — Džamija Rečane" },
      { property: "og:description", content: "Sure i dove s transkripcijom i prijevodom." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: withBase("/quran") }],
  }),
  component: QuranPage,
});

type Item = { title: string; sub: string; ar: string; tr: string; mean: string };

const SURE: Item[] = [
  {
    title: "El-Fatiha",
    sub: "Pristup · 7 ajeta",
    ar: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَٰلَمِينَ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ مَٰلِكِ يَوْمِ ٱلدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    tr: "Bismillahir-rahmanir-rahim. Elhamdu lillahi rabbil-alemin. Er-rahmanir-rahim. Maliki jevmid-din. Ijjake na'budu ve ijjake neste'in. Ihdines-siratal-mustekim. Siratallezine en'amte alejhim gajril-magdubi alejhim ve led-dallin.",
    mean: "U ime Allaha, Milostivog, Samilosnog. Hvala Allahu, Gospodaru svjetova, Milostivom, Samilosnom, Vladaru Dana sudnjeg. Tebi se klanjamo i od Tebe pomoć tražimo. Uputi nas na Pravi put, na put onih kojima si milost Svoju darovao, a ne onih koji su protiv sebe srdžbu izazvali, niti onih koji su zalutali.",
  },
  {
    title: "El-Ihlas",
    sub: "Iskrenost · 4 ajeta",
    ar: "قُلْ هُوَ ٱللَّٰهُ أَحَدٌ ٱللَّٰهُ ٱلصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
    tr: "Kul huvallahu ehad. Allahus-samed. Lem jelid ve lem juled. Ve lem jekun lehu kufuven ehad.",
    mean: "Reci: On je Allah — Jedan! Allah je Utočište svakom! Nije rodio i rođen nije, i niko Mu ravan nije.",
  },
  {
    title: "El-Felek",
    sub: "Svitanje · 5 ajeta",
    ar: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ مِن شَرِّ مَا خَلَقَ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    tr: "Kul e'uzu bi rabbil-felek. Min šerri ma halek. Ve min šerri gasikin iza vekab. Ve min šerrin-neffasati fil-ukad. Ve min šerri hasidin iza hased.",
    mean: "Reci: Utječem se Gospodaru svitanja od zla onoga što On stvara, i od zla mrkle noći kada razastre tmine, i od zla smutljivca, i od zla zavidljivca kad zavist ne krije.",
  },
  {
    title: "En-Nas",
    sub: "Ljudi · 6 ajeta",
    ar: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ مَلِكِ ٱلنَّاسِ إِلَٰهِ ٱلنَّاسِ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
    tr: "Kul e'uzu bi rabbin-nas. Melikin-nas. Ilahin-nas. Min šerril-vesvasil-hannas. Ellezi juvesvisu fi sudurin-nas. Minel-džinneti ven-nas.",
    mean: "Reci: Utječem se Gospodaru ljudi, Vladaru ljudi, Bogu ljudi, od zla šejtana napasnika koji zle misli unosi u srca ljudi — od džina i od ljudi.",
  },
];

const DOVE: Item[] = [
  {
    title: "Prije jela",
    sub: "Sunnet",
    ar: "بِسْمِ ٱللَّٰهِ وَعَلَىٰ بَرَكَةِ ٱللَّٰهِ",
    tr: "Bismillahi ve ala bereketillah.",
    mean: "U ime Allaha i s Allahovim blagoslovom.",
  },
  {
    title: "Poslije jela",
    sub: "Zahvala",
    ar: "ٱلْحَمْدُ لِلَّٰهِ ٱلَّذِى أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    tr: "Elhamdulillahillezi at'amena ve sekana ve dže'alena muslimin.",
    mean: "Hvala Allahu koji nas je nahranio, napojio i muslimanima učinio.",
  },
  {
    title: "Prilikom izlaska iz kuće",
    sub: "Zaštita",
    ar: "بِسْمِ ٱللَّٰهِ تَوَكَّلْتُ عَلَى ٱللَّٰهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ",
    tr: "Bismillahi tevekkeltu alallahi ve la havle ve la kuvvete illa billah.",
    mean: "U ime Allaha, na Allaha se oslanjam; nema snage ni moći osim kod Allaha.",
  },
  {
    title: "Dova za roditelje",
    sub: "Kur'anska dova",
    ar: "رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا",
    tr: "Rabbirhamhuma kema rabbejani sagira.",
    mean: "Gospodaru moj, smiluj im se, kao što su oni mene odgajali kad sam bio dijete.",
  },
  {
    title: "Dova za dobro oba svijeta",
    sub: "El-Bekare, 201",
    ar: "رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْءَاخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ",
    tr: "Rabbena atina fid-dunja haseneten ve fil-ahireti haseneten ve kina azaben-nar.",
    mean: "Gospodaru naš, podaj nam dobro na ovome svijetu i dobro na onome svijetu, i sačuvaj nas patnje u vatri.",
  },
  {
    title: "Prije spavanja",
    sub: "Sunnet",
    ar: "بِٱسْمِكَ ٱللَّٰهُمَّ أَمُوتُ وَأَحْيَا",
    tr: "Bismikellahumme emutu ve ahja.",
    mean: "S Tvojim imenom, Allahu moj, umirem i živim.",
  },
];

function QuranPage() {
  const [tab, setTab] = useState<"sure" | "dove">("sure");
  const items = tab === "sure" ? SURE : DOVE;

  return (
    <>
      <PageHeader
        eyebrow="Kur'an · Dove"
        title="Sure i svakodnevne dove"
        description="Na arapskom, s transkripcijom i prijevodom."
      />
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="inline-flex rounded-full border border-border/60 bg-card p-1">
            {(["sure", "dove"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                  tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t === "sure" ? "Kratke sure" : "Dove"}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-5">
            {items.map((it) => (
              <Card key={it.title} item={it} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Card({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-secondary/40 transition"
      >
        <span>
          <span className="block font-display text-2xl text-primary">{item.title}</span>
          <span className="block text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {item.sub}
          </span>
        </span>
        <span className="text-[color:var(--gold)] text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-border/60 px-6 py-6">
          <p dir="rtl" lang="ar" className="font-arabic text-3xl leading-[2] text-primary text-right">
            {item.ar}
          </p>
          <p className="mt-5 text-sm italic text-muted-foreground">{item.tr}</p>
          <p className="mt-3 leading-relaxed">{item.mean}</p>
        </div>
      )}
    </article>
  );
}
