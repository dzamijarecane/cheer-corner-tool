// Prayer times for Kosovo sourced from the official BIK takvim (Takvimi i
// Bashkësisë Islame të Kosovës), via https://github.com/drilonjaha/kohet-e-namazit-kosove-json
// Data is deterministic per calendar day, so we bundle it and look up locally.

import data from "@/data/kosovo-prayer-times.json";

type DayEntry = {
  day: number;
  date: string; // YYYY-MM-DD
  day_of_week: string;
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  day_length: string;
};

type Takvim = {
  metadata: {
    source: string;
    year: number;
    hijri_year: string;
    city_offsets_minutes: Record<string, number>;
  };
  prayer_times: Record<string, DayEntry[]>;
};

const takvim = data as unknown as Takvim;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type PrayerTiming = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
};

export type PrayerData = {
  timings: PrayerTiming;
  date: {
    readable: string;
    hijri: string;
  };
  source: string;
  city: string;
};

function addMinutes(hhmm: string, offset: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + offset;
  const hh = Math.floor(((total % 1440) + 1440) % 1440 / 60);
  const mm = ((total % 60) + 60) % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 * Sabah namaz in Džamija Rečane is prayed this many minutes before sunrise, so it moves
 * with the sunrise every day (e.g. sunrise 06:30 -> sabah 05:42). The takvim's own
 * "fajr" column is the start of the sabah time, which is earlier.
 */
export const SABAH_MINUTES_BEFORE_SUNRISE = 48;

export async function fetchPrizrenPrayerTimes(date = new Date()): Promise<PrayerData> {
  const city = "Prizren";
  // Prizren isn't in the city offset table (the reference city Deçan sits ~20km
  // away and shares its timings), so we default to 0 minutes offset.
  const offset = takvim.metadata.city_offsets_minutes[city] ?? 0;

  const monthName = MONTHS[date.getMonth()];
  const day = date.getDate();
  const month = takvim.prayer_times[monthName] ?? [];
  const entry = month.find((d) => d.day === day) ?? month[0];

  const t: PrayerTiming = {
    Imsak: addMinutes(entry.imsak, offset),
    Fajr: addMinutes(entry.sunrise, offset - SABAH_MINUTES_BEFORE_SUNRISE),
    Sunrise: addMinutes(entry.sunrise, offset),
    Dhuhr: addMinutes(entry.dhuhr, offset),
    Asr: addMinutes(entry.asr, offset),
    Maghrib: addMinutes(entry.maghrib, offset),
    Isha: addMinutes(entry.isha, offset),
  };

  const WEEKDAYS_BS = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"];
  const MONTHS_BS = [
    "januar", "februar", "mart", "april", "maj", "juni",
    "juli", "august", "septembar", "oktobar", "novembar", "decembar",
  ];
  const readable = `${WEEKDAYS_BS[date.getDay()]}, ${date.getDate()}. ${MONTHS_BS[date.getMonth()]} ${date.getFullYear()}.`;

  return {
    timings: t,
    date: {
      readable,
      hijri: `Hijri ${takvim.metadata.hijri_year}`,
    },
    source: takvim.metadata.source,
    city,
  };
}

// Approximate iqamah after adhan
export function iqamahFor(adhan: string, offsetMin = 20): string {
  return addMinutes(adhan, offsetMin);
}
