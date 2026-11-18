import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ProjectCard } from "../components/ProjectCard";
import { Counter } from "../components/motion/Counter";
import { SectionHeading } from "./SectionHeading";
import type { ContentState, Project } from "../types/portfolio";
import { useI18n } from "../i18n/context";
import { localizeProject } from "../data/projects.fr";

interface ProjectsProps {
  state: ContentState<Project[]>;
  onOpen: (project: Project) => void;
}

export function Projects({ state, onOpen }: ProjectsProps) {
  const { t, lang } = useI18n();
  const projects = useMemo(() => state.data.map((p) => localizeProject(p, lang)), [state.data, lang]);
  const [filter, setFilter] = useState<string>("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const categoryLabel = (c: string) => (c === "all" ? t.projects.all : t.projects.category[c] ?? c);

  const summary = [
    { label: t.projects.summary.total, value: projects.length, color: "gradient-text" },
    { label: t.projects.summary.completed, value: projects.filter((p) => p.status === "Completed").length, color: "text-emerald-400" },
    { label: t.projects.summary.inProgress, value: projects.filter((p) => p.status === "In Progress").length, color: "text-blue-400" },
    { label: t.projects.summary.planned, value: projects.filter((p) => p.status === "Planned").length, color: "text-amber-400" },
  ];

  return (
    <section id="projects" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow={t.projects.eyebrow}
          title={
            <>
              {t.projects.titleStart} <span className="gradient-text">{t.projects.titleHighlight}</span>
            </>
          }
          description={t.projects.description}
        />

        {state.isLoading && <p role="status" className="mb-6 text-center text-sm text-gray-400">{t.projects.loading}</p>}
        {state.error && <p role="status" className="mb-6 text-center text-sm text-amber-300">{t.projects.error}</p>}
        {state.source === "supabase" && projects.length === 0 && !state.isLoading && (
          <p className="mb-6 text-center text-gray-400">{t.projects.empty}</p>
        )}

        {categories.length > 2 && (
          <LayoutGroup>
            <div role="tablist" aria-label={t.projects.filterAria} className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filter === c}
                  onClick={() => setFilter(c)}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    filter === c ? "text-white" : "text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {filter === c && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-teal-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{categoryLabel(c)}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        )}

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={project} onViewDetails={onOpen} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {summary.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <div className={`font-display text-4xl font-bold mb-1 ${s.color}`}>
                <Counter value={s.value} />
              </div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
