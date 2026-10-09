// Schedules prayer-time push notifications in OneSignal for today (the prayers still ahead)
// and tomorrow. OneSignal holds each one and sends it at the exact time (send_after), so this
// only needs to run once or twice a day; .github/workflows/prayer-notifications.yml does that.
//
// Every notification has a fixed idempotency key (date + prayer), so running this again never
// sends anything twice.
//
//   ONESIGNAL_REST_API_KEY=... node scripts/schedule-prayer-notifications.mjs
//   node scripts/schedule-prayer-notifications.mjs --dry-run   (prints, sends nothing)
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const APP_ID = "0530949e-367e-4b93-ad35-eee2f261cab8";
const TIME_ZONE = "Europe/Belgrade"; // Kosovo
const SITE = "https://recanedzamija.com";
// Who gets them. "Total Subscriptions" is OneSignal's built-in segment of every subscriber.
const SEGMENT = process.env.ONESIGNAL_SEGMENT || "Total Subscriptions";
// Notify this many minutes before each prayer (0 = at the prayer time).
const MINUTES_BEFORE = Number(process.env.MINUTES_BEFORE || 0);

const dryRun = process.argv.includes("--dry-run");
const read = (p) => JSON.parse(readFileSync(new URL(`../src/data/${p}`, import.meta.url), "utf8"));
const takvim = read("kosovo-prayer-times.json");
const recane = read("recane-times.json");

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const fmt = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** The five prayers for a local date, the same way the website shows them. */
export function prayersFor(year, month, day) {
  const entry = takvim.prayer_times[MONTHS[month - 1]]?.find((d) => d.day === day);
  if (!entry) return [];
  const offset = takvim.metadata.city_offsets_minutes?.Prizren ?? 0;
  return [
    { key: "sabah", name: "Sabah", min: toMin(entry.sunrise) + offset - recane.sabahMinutesBeforeSunrise, mosque: true },
    { key: "podne", name: "Podne", min: toMin(recane.podne), mosque: true },
    { key: "ikindija", name: "Ikindija", min: toMin(entry.asr) + offset },
    { key: "aksam", name: "Akšam", min: toMin(entry.maghrib) + offset },
    { key: "jacija", name: "Jacija", min: toMin(entry.isha) + offset },
  ].map((p) => ({ ...p, time: fmt(p.min) }));
}

/** UTC instant of a wall-clock time in TIME_ZONE (handles summer/winter time). */
function zonedToUtc(year, month, day, minutes) {
  const guess = Date.UTC(year, month - 1, day, 0, minutes);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(guess))
      .map((p) => [p.type, p.value]),
  );
  const shown = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return new Date(guess - (shown - guess));
}

/** Today's date in TIME_ZONE, plus `add` days. */
function localDate(add) {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date()).split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + add));
  return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()];
}

/** A UUID-shaped key derived from the text, so the same prayer always gets the same key. */
function idempotencyKey(text) {
  const h = createHash("sha256").update(text).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

function message(p) {
  return p.mosque
    ? { title: `${p.name} namaz u ${p.time}`, body: `${p.name} se klanja u ${p.time} u džamiji Rečane.` }
    : { title: `${p.name} namaz u ${p.time}`, body: `Nastupilo je vrijeme ${p.name.toLowerCase()}-namaza.` };
}

async function schedule(p, date) {
  const [y, m, d] = date;
  const sendAt = zonedToUtc(y, m, d, p.min - MINUTES_BEFORE);
  const { title, body } = message(p);
  const payload = {
    app_id: APP_ID,
    target_channel: "push",
    included_segments: [SEGMENT],
    headings: { en: title },
    contents: { en: body },
    url: `${SITE}/prayer-times/`,
    send_after: sendAt.toISOString(),
    // Not worth delivering an hour late (phone was off)
    ttl: 3600,
    // A newer prayer notification replaces the previous one instead of piling up
    web_push_topic: "namaz",
    idempotency_key: idempotencyKey(`recane:${y}-${m}-${d}:${p.key}`),
  };
  const label = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")} ${p.name.padEnd(8)} ${p.time} -> ${payload.send_after}`;
  if (dryRun) return console.log("[dry-run]", label, "|", title, "|", body);

  const res = await fetch("https://api.onesignal.com/notifications?c=push", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}` },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${label}: OneSignal ${res.status} ${text}`);
  const result = JSON.parse(text);
  if (result.errors?.length) console.warn(label, "warning:", JSON.stringify(result.errors));
  console.log("scheduled", label, result.id ?? "");
}

if (!dryRun && !process.env.ONESIGNAL_REST_API_KEY) {
  console.error("ONESIGNAL_REST_API_KEY is not set (GitHub: Settings > Secrets and variables > Actions).");
  process.exit(1);
}

const now = Date.now();
let failed = 0;
for (const add of [0, 1]) {
  const date = localDate(add);
  for (const p of prayersFor(...date)) {
    // Only prayers still at least a minute ahead
    if (zonedToUtc(...date, p.min - MINUTES_BEFORE).getTime() < now + 60_000) continue;
    try {
      await schedule(p, date);
    } catch (e) {
      failed++;
      console.error(String(e.message || e));
    }
  }
}
if (failed) process.exit(1);
