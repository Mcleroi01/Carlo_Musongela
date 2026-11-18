import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";

/**
 * Custom cursor: a precise dot plus a trailing ring that grows over interactive elements.
 * Only active on devices with a fine pointer (mouse / trackpad).
 */
export function MouseFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    const move = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      gsap.to([dot, ring], { opacity: 1, duration: 0.3, overwrite: "auto" });
    };

    const over = (e: PointerEvent) => {
      const interactive = (e.target as HTMLElement).closest("a, button, input, textarea, [data-cursor]");
      gsap.to(ring, {
        scale: interactive ? 1.8 : 1,
        backgroundColor: interactive ? "rgba(168, 85, 247, 0.12)" : "rgba(168, 85, 247, 0)",
        duration: 0.3,
      });
      gsap.to(dot, { scale: interactive ? 0.5 : 1, duration: 0.3 });
    };

    const leave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-teal-400"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] h-9 w-9 rounded-full border border-purple-400/50"
      />
    </>
  );
}
