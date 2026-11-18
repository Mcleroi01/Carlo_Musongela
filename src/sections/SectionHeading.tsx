import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion, keepGradientOnSplit } from "../lib/gsap";
import { useI18n } from "../i18n/context";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}

/**
 * Section title whose words rise into place as it enters the viewport.
 * SplitText rewrites the heading's DOM, so the heading remounts when the language
 * changes instead of letting React patch text nodes that no longer exist.
 */
export function SectionHeading(props: SectionHeadingProps) {
  const { lang } = useI18n();
  return <AnimatedHeading key={lang} {...props} />;
}

function AnimatedHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create("h2", { type: "words", mask: "words" });
      keepGradientOnSplit(split.words);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } });
      tl.from("[data-eyebrow]", { y: 16, autoAlpha: 0, duration: 0.5 })
        .from(split.words, { yPercent: 110, stagger: 0.06, duration: 0.9, ease: "expo.out" }, "-=0.2")
        .from("[data-desc]", { y: 16, autoAlpha: 0, duration: 0.6 }, "-=0.6");
      return () => split.revert();
    },
    { scope: ref },
  );

  const center = align === "center";
  return (
    <div ref={ref} className={`mb-14 ${center ? "text-center mx-auto" : ""} max-w-3xl`}>
      <span
        data-eyebrow
        className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-teal-300"
      >
        {eyebrow}
      </span>
      <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5">{title}</h2>
      {description && (
        <p data-desc className="text-lg text-gray-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
