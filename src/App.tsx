import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  Code2,
  CheckCircle2,
  Smartphone,
  Database,
  Mail,
  Github,
  Linkedin,
  Send,
  Phone,
  ArrowUp,
  Loader2,
} from "lucide-react";
import { ProjectModal } from "./components/ProjectModal";
import { SuccessModal } from "./components/SuccessModal";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { MouseFollower } from "./components/MouseFollower";
import ClientLogos from "./components/ClientLogos";
import { SmoothScroll, scrollToId } from "./components/motion/SmoothScroll";
import { ScrollProgress } from "./components/motion/ScrollProgress";
import { Reveal, RevealGroup, RevealItem } from "./components/motion/Reveal";
import { Magnetic } from "./components/motion/Magnetic";
import { Navbar } from "./sections/Navbar";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Experience } from "./sections/Experience";
import { Projects } from "./sections/Projects";
import { TechMarquee } from "./sections/TechMarquee";
import { SectionHeading } from "./sections/SectionHeading";
import { projectsData } from "./data/projects";
import { staticProfile } from "./data/profile";
import { photos } from "./data/resume";
import { usePortfolioData } from "./hooks/usePortfolioData";
import {
  getPublicProfile,
  getPublishedProjects,
  getPublishedServiceCards,
} from "./services/portfolio";
import type { Project, ServiceCardData } from "./types/portfolio";

const AdminPage = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })));

const emptyServiceFallback: ServiceCardData[] = [];

const staticServices = [
  {
    icon: Code2,
    accent: "from-purple-600 to-blue-600",
    title: "What I can do",
    text: "Solutions that help you grow your business and reach your goals.",
    items: ["Web app development", "Mobile app development", "API development & integration", "Custom systems & solutions"],
  },
  {
    icon: Database,
    accent: "from-teal-600 to-emerald-600",
    title: "Tools I use",
    text: "Modern, proven technologies to build functional and scalable products.",
    items: [
      "Frontend: React, Tailwind, Flutter",
      "Backend: Laravel, PHP, Node.js, Python",
      "Data: MySQL, PostgreSQL, Firebase",
      "Ops & design: Git, AWS, Figma",
    ],
  },
  {
    icon: Smartphone,
    accent: "from-blue-600 to-purple-600",
    title: "Specializations",
    text: "Developer first, designer second: clean and modern interfaces.",
    items: ["Marketplace development", "Booking systems", "Internal business tools", "Cross-platform solutions"],
  },
];

const inputClass =
  "peer w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.06] transition-colors";
const labelClass =
  "pointer-events-none absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-300";

function PublicPortfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const projectState = usePortfolioData(getPublishedProjects, projectsData);
  const serviceState = usePortfolioData(getPublishedServiceCards, emptyServiceFallback);
  const profileState = usePortfolioData(getPublicProfile, staticProfile);
  const profile = profileState.data ?? staticProfile;
  const serviceCards = serviceState.data;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendError(null);
    try {
      const response = await fetch("https://formspree.io/f/xwpbnrgk", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsSuccessModalOpen(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSendError("The message could not be sent. Please try again or reach me on WhatsApp.");
      }
    } catch {
      setSendError("Network error. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-x-clip">
      <SmoothScroll />
      <ScrollProgress />
      <MouseFollower />

      {/* Ambient background */}
      <div aria-hidden className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-purple-700/20 blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-teal-600/15 blur-[120px] animate-float-delayed" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-blue-700/15 blur-[120px] animate-float-slow" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <Navbar />

      <main>
        <Hero profile={profile} fallback={staticProfile} />
        {profileState.error && (
          <p role="status" className="relative z-10 -mt-10 mb-6 text-center text-sm text-amber-300">
            Profil Supabase indisponible ; le profil statique est affiché.
          </p>
        )}

        <TechMarquee />
        <About projectCount={projectState.data.length} />

        <div className="relative z-10 py-10">
          <ClientLogos />
        </div>

        {/* Services */}
        <section id="services" className="py-28 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="Services"
              title={
                <>
                  Building <span className="gradient-text">digital experiences</span>
                </>
              }
              description="I create clean user interfaces and develop high-quality applications that stand out."
            />

            {serviceState.error && <p role="status" className="mb-6 text-center text-sm text-amber-300">Les services Supabase sont indisponibles ; le contenu statique est affiché.</p>}
            {serviceState.isLoading && <p role="status" className="mb-6 text-center text-sm text-gray-400">Chargement des services…</p>}

            {serviceState.source === "static" && (
              <RevealGroup className="grid md:grid-cols-3 gap-6" stagger={0.12}>
                {staticServices.map(({ icon: Icon, accent, title, text, items }) => (
                  <RevealItem
                    key={title}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:border-purple-400/40 transition-colors"
                  >
                    <div className={`absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br ${accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30`} />
                    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3">{title}</h3>
                    <p className="text-gray-400 mb-6">{text}</p>
                    <ul className="space-y-3 text-sm text-gray-300">
                      {items.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-300" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
            {serviceState.source === "supabase" && serviceCards.length === 0 && (
              <p className="text-center text-gray-400">Aucun service publié pour le moment.</p>
            )}
            {serviceState.source === "supabase" && serviceCards.length > 0 && (
              <RevealGroup className="grid md:grid-cols-3 gap-6">
                {serviceCards.map((service) => (
                  <RevealItem key={service.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:border-purple-400/40 transition-colors">
                    <h3 className="font-display text-xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
                    {service.cta_url && service.cta_label && (
                      <a href={service.cta_url} className="inline-block mt-6 text-purple-300 hover:text-white">{service.cta_label}</a>
                    )}
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </div>
        </section>

        <Experience />
        <Projects state={projectState} onOpen={openProjectModal} />

        {/* Contact */}
        <section id="contact" className="py-28 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Contact"
              title={
                <>
                  Let's turn your vision <span className="gradient-text">into reality</span>
                </>
              }
              description="Have a project in mind or just want to chat? Let's connect."
            />

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
              <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 min-h-[22rem]">
                <img
                  src={photos.work.src}
                  srcSet={photos.work.srcSet}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  alt="Carlo Musongela working"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/10" />
                <div className="relative flex h-full flex-col justify-end p-8 gap-4">
                  <p className="font-display text-2xl font-semibold">Bringing your ideas to life.</p>
                  <a href="tel:+243803122782" className="flex items-center gap-3 text-gray-200 hover:text-white">
                    <Phone className="h-5 w-5 text-teal-300" /> +243 803 122 782
                  </a>
                  <a href="mailto:Carlomusongela1@gmail.com" className="flex items-center gap-3 text-gray-200 hover:text-white break-all">
                    <Mail className="h-5 w-5 text-teal-300" /> Carlomusongela1@gmail.com
                  </a>
                  <div className="flex gap-4 pt-2">
                    <a href="https://github.com/Mcleroi01" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-full border border-white/15 p-2.5 hover:bg-white/10">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href="https://linkedin.com/in/carlo-musongela-bb024b202" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full border border-white/15 p-2.5 hover:bg-white/10">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="relative">
                      <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="Your name" className={inputClass} />
                      <label htmlFor="name" className={labelClass}>Name</label>
                    </div>
                    <div className="relative">
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="you@example.com" className={inputClass} />
                      <label htmlFor="email" className={labelClass}>Email</label>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={7} placeholder="Tell me about your project" className={`${inputClass} resize-none`} />
                    <label htmlFor="message" className={labelClass}>Tell me about your project</label>
                  </div>
                  {sendError && <p role="alert" className="text-sm text-red-300">{sendError}</p>}
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-teal-600 px-8 py-4 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow disabled:opacity-60"
                  >
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    {isSending ? "Sending…" : "Send message"}
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pb-16 md:pb-0 md:pr-20">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Code2 className="h-6 w-6 text-purple-400" />
              <span className="font-display text-lg font-bold gradient-text">I'mcleroi01</span>
            </div>
            <p className="text-sm text-gray-400">Carlo Musongela · Based in {profile.location ?? staticProfile.location}</p>
            <p className="text-xs text-gray-500 mt-1">© {new Date().getFullYear()} I'mcleroi01. All rights reserved.</p>
          </div>
          <p className="text-sm text-gray-500">Built with React, TypeScript, Tailwind, GSAP & Motion</p>
          <Magnetic>
            <button
              onClick={() => scrollToId("home")}
              aria-label="Back to top"
              className="rounded-full border border-white/15 p-3 text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </Magnetic>
        </div>
      </footer>

      <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={selectedProject} />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Message Sent Successfully!"
        message="Thank you for your message! I'll get back to you soon."
      />
      <WhatsAppButton phoneNumber="+243803122782" message="Bonjour Carlo! Je suis interesse par vos services de developpement." />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortfolio />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
