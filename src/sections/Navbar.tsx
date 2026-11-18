import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, Download, Menu, X } from "lucide-react";
import { scrollToId } from "../components/motion/SmoothScroll";
import { CV_URL } from "../data/resume";
import { useI18n } from "../i18n/context";

const sectionIds = ["home", "about", "services", "experience", "projects", "contact"] as const;

function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t.nav.switchLang}
      className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-semibold"
    >
      {(["fr", "en"] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`relative rounded-full px-3 py-1.5 uppercase transition-colors ${
            lang === code ? "text-gray-950" : "text-gray-400 hover:text-white"
          }`}
        >
          {lang === code && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          <span className="relative">{code}</span>
        </button>
      ))}
    </div>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const links = sectionIds.map((id) => ({ id, label: t.nav[id] }));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,padding,border-color] duration-500 ${
        scrolled ? "bg-gray-950/75 backdrop-blur-xl border-b border-white/5 py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <button onClick={() => go("home")} className="flex items-center gap-2" aria-label={t.nav.backToTop}>
          <Code2 className="h-7 w-7 text-purple-400" />
          <span className="font-display text-lg font-bold gradient-text">I'mcleroi01</span>
        </button>

        <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`relative px-4 py-1.5 text-sm rounded-full transition-colors ${
                active === id ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {active === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/60 to-teal-600/60"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <a
            href={CV_URL}
            download="Musongela_Carlo_CV.pdf"
            title={t.nav.downloadCv}
            className="inline-flex items-center gap-2 rounded-full bg-white text-gray-950 px-4 xl:px-5 py-2 text-sm font-semibold hover:bg-purple-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden xl:inline">{t.nav.downloadCv}</span>
            <span className="xl:hidden">CV</span>
          </a>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle />
          <button
            className="text-gray-300 hover:text-white"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-gray-950/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map(({ id, label }, i) => (
                <motion.button
                  key={id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => go(id)}
                  className={`block w-full text-left px-3 py-3 rounded-lg ${
                    active === id ? "bg-white/5 text-white" : "text-gray-300"
                  }`}
                >
                  {label}
                </motion.button>
              ))}
              <a
                href={CV_URL}
                download="Musongela_Carlo_CV.pdf"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-white text-gray-950 px-5 py-3 font-semibold"
              >
                <Download className="h-4 w-4" />
                {t.nav.downloadCv}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
