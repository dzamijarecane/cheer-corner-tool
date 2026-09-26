import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

// Site-wide 3D motion, driven by data attributes so pages stay plain markup:
//   data-tilt[="8"]       card tilts toward the mouse (max degrees), with a soft glare
//   data-reveal           element rises into view in 3D perspective when scrolled to
//   data-reveal-stagger   same, but its children rise one after another
// Everything is skipped for visitors who prefer reduced motion.
export function Motion3D() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Mouse tilt: one delegated listener for every [data-tilt] element
  useEffect(() => {
    if (!canAnimate() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let active: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      el.style.transform = "";
      el.classList.remove("is-tilting");
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (active && active !== el) reset(active);
      active = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const max = Number(el.dataset.tilt) || 8;
      el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
      el.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
      el.classList.add("is-tilting");
    };
    const onLeave = () => {
      if (active) reset(active);
      active = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      onLeave();
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  // Scroll reveal: re-scan on every navigation, and when late content (Suspense) mounts
  useEffect(() => {
    if (!canAnimate() || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    const scan = () =>
      document
        .querySelectorAll("[data-reveal]:not(.is-visible), [data-reveal-stagger]:not(.is-visible)")
        .forEach((el) => io.observe(el));

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}

function canAnimate() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
