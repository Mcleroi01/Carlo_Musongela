import { useRef, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Calendar, Eye, Github, User } from "lucide-react";
import type { Project } from "../types/portfolio";
import { useI18n } from "../i18n/context";
import { format } from "../i18n/translations";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

const defaultPreviewImage =
  "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800";

const statusColor: Record<string, string> = {
  Completed: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300",
  "In Progress": "bg-blue-500/15 border-blue-400/30 text-blue-300",
  Planned: "bg-amber-500/15 border-amber-400/30 text-amber-300",
};

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(168,85,247,0.18), transparent 60%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 10);
    rx.set(-(py - 0.5) * 10);
    mx.set(px * 100);
    my.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gray-900/60 backdrop-blur-sm hover:border-purple-400/40 transition-colors"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: spotlight }} />

      <div className="relative h-52 overflow-hidden bg-gray-800/60">
        <img
          src={project.image || defaultPreviewImage}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

        <span
          className={`absolute top-4 right-4 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${
            statusColor[project.status] ?? "bg-gray-500/20 border-gray-500/30 text-gray-300"
          }`}
        >
          {t.projects.status[project.status] ?? project.status}
        </span>
        <span className="absolute top-4 left-4 rounded-full bg-gray-950/70 px-3 py-1 text-xs font-medium text-purple-200 backdrop-blur">
          {t.projects.category[project.category] ?? project.category}
        </span>
      </div>

      <div className="relative z-20 flex flex-grow flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-5">{project.description}</p>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-sm text-gray-300">
          <span className="flex items-center">
            <User className="mr-2 h-4 w-4 text-blue-400" />
            {project.client}
          </span>
          <span className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-emerald-400" />
            {project.completedDate}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onViewDetails(project)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-purple-400/30 bg-purple-500/10 px-3 py-2.5 text-sm font-medium text-purple-200 hover:bg-purple-500/20 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4" />
            {t.projects.details}
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={format(t.projects.openLive, { title: project.title })}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={format(t.projects.sourceCode, { title: project.title })}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
