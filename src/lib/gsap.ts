import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

gsap.defaults({ ease: "power3.out", duration: 0.9 });

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * `background-clip: text` does not paint through the inline-block pieces SplitText creates,
 * so gradient text would vanish. Give every piece inside a `.gradient-text` element its own
 * slice of one shared gradient so the colour stays continuous.
 */
export function keepGradientOnSplit(pieces: Element[]) {
  for (const piece of pieces) {
    const host = piece.parentElement?.closest<HTMLElement>(".gradient-text");
    if (!host) continue;
    const box = host.getBoundingClientRect();
    const r = piece.getBoundingClientRect();
    Object.assign((piece as HTMLElement).style, {
      backgroundImage: "linear-gradient(to right, #c084fc, #2dd4bf)",
      backgroundSize: `${box.width}px ${box.height}px`,
      backgroundPosition: `${box.left - r.left}px ${box.top - r.top}px`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    });
  }
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
