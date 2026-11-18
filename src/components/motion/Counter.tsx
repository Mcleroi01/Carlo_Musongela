import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

/** Counts from 0 to `value` when scrolled into view. */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { n: 0 };
    gsap.to(obj, {
      n: value,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.n)}${suffix}`;
      },
    });
  }, { dependencies: [value, suffix] });

  return <span ref={ref}>{`${value}${suffix}`}</span>;
}
