// Tabularni (Kuvajtski) algoritam za pretvaranje gregorijanskog u hidžretski datum.
import takvim from "@/data/kosovo-prayer-times.json";

export const HIJRI_MONTHS = [
  "Muharrem",
  "Safer",
  "Rebiul-evvel",
  "Rebiul-ahir",
  "Džumadel-ula",
  "Džumadel-uhra",
  "Redžeb",
  "Šaban",
  "Ramazan",
  "Ševval",
  "Zul-ka'de",
  "Zul-hidždže",
];

export const MONTHS_SR = [
  "januar", "februar", "mart", "april", "maj", "juni",
  "juli", "august", "septembar", "oktobar", "novembar", "decembar",
];

export type HijriDate = { day: number; month: number; year: number };

function gregorianToJD(year: number, month: number, day: number): number {
  const a = Math.floor((month - 14) / 12);
  return (
    Math.floor((1461 * (year + 4800 + a)) / 4) +
    Math.floor((367 * (month - 2 - 12 * a)) / 12) -
    Math.floor((3 * Math.floor((year + 4900 + a) / 100)) / 4) +
    day -
    32075
  );
}

export function toHijri(date: Date): HijriDate {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month, year };
}

export function hijriToGregorian(year: number, month: number, day: number): Date {
  const jd =
    Math.floor((11 * year + 3) / 30) +
    354 * year +
    30 * month -
    Math.floor((month - 1) / 2) +
    day +
    1948440 -
    385;
  let l = jd + 68569;
  const n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const d = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const m = j + 2 - 12 * l;
  const y = 100 * (n - 49) + i + l;
  return new Date(y, m - 1, d);
}

export function formatHijri(h: HijriDate): string {
  return `${h.day}. ${HIJRI_MONTHS[h.month - 1]} ${h.year}. h.`;
}

export function formatGregorian(d: Date): string {
  return `${d.getDate()}. ${MONTHS_SR[d.getMonth()]} ${d.getFullYear()}.`;
}

/**
 * Dokaz iz sunneta za svaki dan: `sunnah: true` kada je od Poslanika ﷺ vjerodostojno
 * preneseno da se taj dan obilježava ibadetom, `false` kada takvog dokaza nema.
 * Izvori: Sahih el-Buhari i Sahih Muslim (numeracija po Fuadu Abdulbakiju).
 */
export type HolidayProof = { sunnah: boolean; text: string };

type HolidayDef = {
  month: number;
  day: number;
  name: string;
  note: string;
  proof: HolidayProof;
  /** Ključ u takvimu BIK (metadata.islamic_events_<godina>) čiji datum ima prednost nad izračunom. */
  takvimKey?: string;
};

const HOLIDAYS: HolidayDef[] = [
  {
    month: 1,
    day: 10,
    name: "Dan Ašure",
    note: "Preporučen post",
    proof: {
      sunnah: true,
      text:
        "Poslanik, s.a.v.s., je postio na Dan Ašure i naredio da se posti (Buhari, 2004). " +
        "Rekao je: „Nadam se od Allaha da post na Dan Ašure briše grijehe prethodne godine“ (Muslim, 1162), " +
        "i: „Ako doživim iduću godinu, postit ću i deveti dan“ (Muslim, 1134).",
    },
  },
  {
    month: 9,
    day: 1,
    name: "Početak Ramazana",
    note: "Prvi dan posta",
    takvimKey: "ramadan_start",
    proof: {
      sunnah: true,
      text:
        "Post ramazana je farz (El-Bekare, 183-185). Poslanik, s.a.v.s., je rekao: „Kada ga (mlađak) vidite, postite, a kada ga vidite, prestanite postiti“ (Buhari, 1900; Muslim, 1080), " +
        "i: „Ko posti ramazan vjerujući i nadajući se nagradi, bit će mu oprošteni prethodni grijesi“ (Buhari, 38; Muslim, 760).",
    },
  },
  {
    month: 9,
    day: 27,
    name: "Lejletul-kadr",
    note: "Noć sudbine",
    proof: {
      sunnah: true,
      text:
        "Poslanik, s.a.v.s., je rekao: „Tražite Lejletul-kadr u neparnim noćima zadnjih deset noći ramazana“ (Buhari, 2017), " +
        "i: „Ko provede Lejletul-kadr u namazu vjerujući i nadajući se nagradi, bit će mu oprošteni prethodni grijesi“ (Buhari, 1901; Muslim, 760). " +
        "Poslanik, s.a.v.s., nije odredio da je to baš 27. noć; ashab Ubejj b. Ka'b se zaklinjao da je to 27. noć (Muslim, 762).",
    },
  },
  {
    month: 10,
    day: 1,
    name: "Ramazanski bajram",
    note: "Tri dana bajrama",
    proof: {
      sunnah: true,
      text:
        "Poslanik, s.a.v.s., je na Ramazanski i Kurban-bajram izlazio na musallu i prvo klanjao bajram-namaz (Buhari, 956). " +
        "Propisao je zekatul-fitr i naredio da se da prije izlaska na bajram-namaz (Buhari, 1503), " +
        "a zabranio je post na dan Ramazanskog i Kurban-bajrama (Buhari, 1991; Muslim, 827).",
    },
  },
  {
    month: 12,
    day: 9,
    name: "Dan Arefata",
    note: "Post za one koji nisu na hadždžu",
    proof: {
      sunnah: true,
      text:
        "Poslanik, s.a.v.s., je za post na Dan Arefata rekao: „Nadam se od Allaha da briše grijehe prethodne i naredne godine“ (Muslim, 1162).",
    },
  },
  {
    month: 12,
    day: 10,
    name: "Kurban-bajram",
    note: "Četiri dana bajrama",
    proof: {
      sunnah: true,
      text:
        "Poslanik, s.a.v.s., je klanjao bajram-namaz (Buhari, 956) i klao kurban, dva ovna, svojom rukom (Buhari, 5565; Muslim, 1966). " +
        "Zabranio je post na dan bajrama (Buhari, 1991; Muslim, 827) i rekao: „Dani tešrika su dani jela, pića i spominjanja Allaha“ (Muslim, 1141). " +
        "To su tri dana nakon Kurban-bajrama.",
    },
  },
];

export type Holiday = {
  name: string;
  note: string;
  proof: HolidayProof;
  /** "takvim": datum iz takvima Islamske zajednice; "izracun": približan, izračunat datum. */
  dateSource?: "takvim" | "izracun";
  hijri: string;
  gregorian: Date;
  gregorianLabel: string;
};

type TakvimMeta = Record<string, unknown>;

/**
 * Datum događaja iz takvima BIK (npr. početak ramazana), ako takvim pokriva tu godinu.
 * Uzima se samo ako je blizu izračunatog datuma, da se ne pomiješaju različite godine.
 */
function takvimDate(key: string, near: Date): Date | undefined {
  const events = (takvim.metadata as TakvimMeta)[`islamic_events_${near.getFullYear()}`] as
    | Record<string, string>
    | undefined;
  const iso = events?.[key];
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Math.abs(date.getTime() - near.getTime()) <= 5 * 86400000 ? date : undefined;
}

/** Naredni datum svakog dana iz liste, sortirano po datumu. */
export function upcomingHolidays(from = new Date()): Holiday[] {
  const h = toHijri(from);
  const list: Holiday[] = [];
  for (const y of [h.year, h.year + 1]) {
    for (const def of HOLIDAYS) {
      const computed = hijriToGregorian(y, def.month, def.day);
      const official = def.takvimKey ? takvimDate(def.takvimKey, computed) : undefined;
      const g = official ?? computed;
      list.push({
        name: def.name,
        note: def.note,
        proof: def.proof,
        dateSource: def.takvimKey ? (official ? "takvim" : "izracun") : undefined,
        hijri: `${def.day}. ${HIJRI_MONTHS[def.month - 1]} ${y}.`,
        gregorian: g,
        gregorianLabel: formatGregorian(g),
      });
    }
  }
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  return list
    .filter((x) => x.gregorian.getTime() >= start)
    .sort((a, b) => a.gregorian.getTime() - b.gregorian.getTime())
    .slice(0, HOLIDAYS.length);
}

export function daysUntil(date: Date, from = new Date()): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return Math.round((b - a) / 86400000);
}
