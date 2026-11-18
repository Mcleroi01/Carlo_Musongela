import { useRef } from "react";
import { ArrowDown, ArrowUpRight, Github, Languages, Linkedin, Mail, MapPin } from "lucide-react";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion, keepGradientOnSplit } from "../lib/gsap";
import { Magnetic } from "../components/motion/Magnetic";
import { scrollToId } from "../components/motion/SmoothScroll";
import { photos, yearsOfExperience } from "../data/resume";
import type { ProfileRecord } from "../types/portfolio";

interface HeroProps {
  profile: ProfileRecord;
  fallback: ProfileRecord;
}

export function Hero({ profile, fallback }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const languages = profile.languages.length ? profile.languages : fallback.languages;

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("[data-hero]", { autoAlpha: 1 });
        return;
      }

      const split = SplitText.create("[data-hero-title]", { type: "chars,words", mask: "words" });
      keepGradientOnSplit(split.chars);

      const tl = gsap.timeline({ delay: 0.35 });
      tl.set("[data-hero]", { autoAlpha: 1 })
        .from("[data-hero-badge]", { y: 20, autoAlpha: 0, duration: 0.6 })
        .from(split.chars, { yPercent: 110, stagger: 0.025, duration: 0.9, ease: "expo.out" }, "-=0.3")
        .from("[data-hero-sub]", { y: 24, autoAlpha: 0, stagger: 0.12 }, "-=0.6")
        .from("[data-hero-cta] > *", { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.6 }, "-=0.5")
        .fromTo(
          "[data-hero-photo]",
          { clipPath: "inset(100% 0% 0% 0% round 28px)", scale: 1.15 },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", scale: 1, duration: 1.4, ease: "expo.inOut" },
          0.2,
        )
        .from("[data-hero-float]", { scale: 0.6, autoAlpha: 0, stagger: 0.15, ease: "back.out(2)" }, "-=0.5");

      // Parallax while scrolling past the hero.
      gsap.to("[data-hero-photo] img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        y: -80,
        autoAlpha: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "center center", end: "bottom top", scrub: true },
      });

      // Gentle idle float on the badges.
      gsap.to("[data-hero-float]", {
        y: -10,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.6,
      });

      ScrollTrigger.refresh();
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="home"
      ref={root}
      className="relative min-h-[100svh] flex items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
        <div data-hero-copy data-hero className="invisible relative z-10 text-center lg:text-left">
          <div
            data-hero-badge
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for new projects
          </div>

          <p data-hero-sub className="text-lg md:text-xl text-gray-400 mb-3">
            Hey, I'm
          </p>
          <h1
            data-hero-title
            className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.15] tracking-tight mb-5"
          >
            <span className="gradient-text">{profile.display_name}</span>
          </h1>
          <h2 data-hero-sub className="font-display text-2xl md:text-3xl text-gray-200 mb-6">
            {profile.headline || "Fullstack Developer"}
            <span className="text-gray-500"> · Laravel · React · Flutter</span>
          </h2>
          <p data-hero-sub className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {profile.bio ?? fallback.bio}
          </p>

          <div data-hero-cta className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10">
            <Magnetic>
              <button
                onClick={() => scrollToId("contact")}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-teal-600 px-8 py-4 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
              >
                <Mail className="h-5 w-5" />
                Let's work together
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => scrollToId("projects")}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 font-semibold text-gray-200 hover:bg-white/10 hover:border-white/30 transition-colors backdrop-blur"
              >
                View projects
              </button>
            </Magnetic>
          </div>

          <div data-hero-cta className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-gray-400">
            <a
              href={profile.github_url ?? "https://github.com/Mcleroi01"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href={profile.linkedin_url ?? "https://linkedin.com/in/carlo-musongela-bb024b202"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-blue-400 transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <span className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {profile.location ?? fallback.location}
            </span>
            <span className="flex items-center text-sm">
              <Languages className="h-4 w-4 mr-1" />
              {languages.join(" / ")}
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-purple-600/30 via-transparent to-teal-500/30 blur-2xl" />
          <div
            data-hero-photo
            className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-gray-800"
          >
            <img
              src={photos.hero.src}
              srcSet={photos.hero.srcSet}
              sizes="(min-width: 1024px) 40vw, 90vw"
              alt="Carlo Musongela"
              fetchPriority="high"
              className="h-[115%] w-full object-cover object-top -mt-[7%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
          </div>

          <div
            data-hero-float
            className="absolute -left-4 sm:-left-8 bottom-16 rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl px-5 py-4 shadow-2xl"
          >
            <div className="font-display text-3xl font-bold gradient-text">{yearsOfExperience}+</div>
            <div className="text-xs text-gray-400">years building products</div>
          </div>
          <div
            data-hero-float
            className="absolute -right-3 sm:-right-6 top-12 rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl px-4 py-3 shadow-2xl text-sm"
          >
            <span className="text-gray-400">Stack </span>
            <span className="font-semibold text-white">Laravel · React · Flutter</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollToId("about")}
        aria-label="Scroll to about"
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-500 hover:text-gray-300"
      >
        Scroll
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
}
