import { useRef } from "react";
import { Briefcase, Layers, Palette, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { Counter } from "../components/motion/Counter";
import { RevealGroup, RevealItem } from "../components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { photos, yearsOfExperience } from "../data/resume";
import { useI18n } from "../i18n/context";

const icons = [Layers, Briefcase, Palette, ShieldCheck];

export function About({ projectCount }: { projectCount: number }) {
  const { t } = useI18n();
  const stats = [
    { value: yearsOfExperience, suffix: "+", label: t.about.stats.years },
    { value: projectCount, suffix: "", label: t.about.stats.projects },
    { value: 3, suffix: "", label: t.about.stats.languages },
  ];
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-about-photo]",
        { clipPath: "inset(0% 100% 0% 0% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-about-photo]", start: "top 80%", once: true },
        },
      );
      gsap.fromTo(
        "[data-about-photo] img",
        { yPercent: -8, scale: 1.1 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section id="about" ref={ref} className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-14 items-center">
        <div className="relative mx-auto w-full max-w-md">
          <div data-about-photo className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10">
            <img
              src={photos.about.src}
              srcSet={photos.about.srcSet}
              sizes="(min-width: 1024px) 35vw, 90vw"
              alt={t.about.photoAlt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-3xl border border-purple-500/30" />
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow={t.about.eyebrow}
            title={
              <>
                {t.about.titleStart} <span className="gradient-text">{t.about.titleHighlight}</span>
              </>
            }
            description={t.about.description}
          />

          <div className="grid grid-cols-3 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <div className="font-display text-3xl md:text-4xl font-bold gradient-text">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs md:text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          <RevealGroup className="grid sm:grid-cols-2 gap-4">
            {t.about.strengths.map((s, i) => {
              const Icon = icons[i % icons.length];
              return (
                <RevealItem
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-5 hover:border-purple-400/40 transition-colors"
                >
                  <Icon className="h-5 w-5 text-teal-300 mb-3 transition-transform group-hover:-translate-y-0.5" />
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.text}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
