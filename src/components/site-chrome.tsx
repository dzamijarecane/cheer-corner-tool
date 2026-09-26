import { Link } from "@tanstack/react-router";

const NAV = [
  { to: "/", label: "Početna" },
  { to: "/about", label: "O nama" },
  { to: "/prayer-times", label: "Vreme namaza" },
  { to: "/qibla", label: "Kibla i tesbih" },
  { to: "/quran", label: "Kur'an i dove" },
  { to: "/calendar", label: "Kalendar" },
  { to: "/events", label: "Događaji" },
  { to: "/services", label: "Usluge" },
] as const;

function Mark({ className = "" }: { className?: string }) {
  // The mosque's ن badge, matching the favicon
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-[var(--gold)] text-primary font-arabic ${className}`}
      aria-hidden
    >
      ن
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-primary/95 text-primary-foreground backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <Mark className="h-9 w-9 text-lg" />
          <span className="leading-tight">
            <span className="block font-display text-xl">Džamija Rečane</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold)]">Prizren · Kosovo</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "bg-white/10 text-[color:var(--gold)]" }}
              inactiveProps={{ className: "text-primary-foreground/75" }}
              className="rounded-full px-3 py-2 hover:text-primary-foreground hover:bg-white/5 transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Mobile / tablet nav */}
      <nav className="lg:hidden flex overflow-x-auto gap-1 px-4 pb-3 text-sm [scrollbar-width:none]">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/" }}
            activeProps={{ className: "bg-white/10 text-[color:var(--gold)]" }}
            inactiveProps={{ className: "text-primary-foreground/75" }}
            className="whitespace-nowrap rounded-full px-3 py-1.5"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="h-1 bg-[linear-gradient(90deg,transparent,var(--gold),transparent)] opacity-60" aria-hidden />
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Mark className="h-10 w-10 text-xl" />
            <span className="font-display text-2xl">Džamija Rečane</span>
          </div>
          <p className="mt-5 max-w-sm text-primary-foreground/75 leading-relaxed">
            Mjesto ibadeta, učenja i zajednice. Dobro došli — posjetioci, komšije i vjernici.
          </p>
          <p className="mt-6 font-arabic text-2xl text-[color:var(--gold)]" dir="rtl" lang="ar">
            إِنَّمَا يَعْمُرُ مَسَاجِدَ ٱللَّهِ
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.22em] text-[color:var(--gold)] mb-4">Posjetite nas</h4>
          <p className="text-primary-foreground/85 leading-relaxed">
            28, Septembar
            <br />
            Rečane, Prizren
            <br />
            Kosovo
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.22em] text-[color:var(--gold)] mb-4">Brzi linkovi</h4>
          <ul className="space-y-2 text-primary-foreground/85">
            {NAV.filter((n) => ["/prayer-times", "/calendar", "/events", "/services"].includes(n.to)).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-[color:var(--gold)] transition">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Džamija Rečane. Sva prava zadržana.
      </div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 overflow-hidden opacity-[0.14]" aria-hidden>
        <div className="pattern-floor" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/20" aria-hidden />
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24 relative">
        <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[color:var(--gold)] mb-5">
          <span className="h-px w-10 bg-[var(--gold)]" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.08] max-w-3xl">{title}</h1>
        {description && description.trim() && (
          <p className="mt-6 text-lg text-primary-foreground/75 max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}
