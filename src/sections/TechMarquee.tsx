import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { techStack } from "../data/resume";

/** Infinite tech-stack ribbon; it speeds up and reverses with scroll velocity. */
export function TechMarquee({ items: names = techStack }: { items?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tween = gsap.to("[data-track]", { xPercent: -50, ease: "none", duration: 40, repeat: -1 });

      let lastY = window.scrollY;
      let dir = 1;
      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        if (delta !== 0) dir = delta > 0 ? 1 : -1;
        const boost = Math.min(Math.abs(delta) / 8, 5);
        gsap.to(tween, { timeScale: dir * (1 + boost), duration: 0.2, overwrite: true });
        gsap.to(tween, { timeScale: dir, duration: 1, delay: 0.2 });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: ref, dependencies: [names.length], revertOnUpdate: true },
  );

  const items = [...names, ...names];
  return (
    <div
      ref={ref}
      className="relative z-10 overflow-hidden border-y border-white/5 bg-white/[0.02] py-6 -rotate-1"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div data-track className="flex w-max gap-10">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl md:text-3xl font-semibold text-gray-500 whitespace-nowrap">
            {t}
            <span className="text-purple-500/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
