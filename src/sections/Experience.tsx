import { useRef } from "react";
import { GraduationCap } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { Reveal } from "../components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { education, experience } from "../data/resume";

export function Experience() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // The timeline line draws itself as you scroll through the section.
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-job]").forEach((job) => {
        gsap.from(job, {
          x: -40,
          autoAlpha: 0,
          duration: 0.9,
          scrollTrigger: { trigger: job, start: "top 82%", once: true },
        });
        gsap.from(job.querySelector("[data-dot]"), {
          scale: 0,
          duration: 0.5,
          ease: "back.out(3)",
          scrollTrigger: { trigger: job, start: "top 70%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="experience" ref={ref} className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Career"
          title={
            <>
              Experience & <span className="gradient-text">education</span>
            </>
          }
          description="From TV post-production to fullstack engineering: a path built on shipping real products for real users."
        />

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <div data-timeline className="relative pl-10">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
            <div
              data-line
              className="absolute left-[11px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-purple-400 via-blue-400 to-teal-400"
            />
            <div className="space-y-10">
              {experience.map((job) => (
                <article key={job.role} data-job className="relative">
                  <span
                    data-dot
                    className="absolute -left-10 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-purple-400/50 bg-gray-950"
                  >
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-teal-400" />
                  </span>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-purple-400/30 transition-colors">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-display text-xl font-semibold">{job.role}</h3>
                      <span className="text-sm font-mono text-gray-400">{job.period}</span>
                    </div>
                    <p className="text-teal-300 text-sm font-medium mb-4">{job.company}</p>
                    <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                      {job.points.map((p) => (
                        <li key={p} className="flex gap-3">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-400" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <Reveal className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8 h-fit lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="h-6 w-6 text-teal-300" />
              <h3 className="font-display text-xl font-semibold">Education</h3>
            </div>
            <ul className="divide-y divide-white/5">
              {education.map((e) => (
                <li key={e.title} className="py-4 first:pt-0 last:pb-0 flex justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-100">{e.title}</p>
                    <p className="text-sm text-gray-400">{e.school}</p>
                  </div>
                  <span className="text-sm font-mono text-gray-500">{e.year}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
