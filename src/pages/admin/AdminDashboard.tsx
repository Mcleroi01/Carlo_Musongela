import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Cpu,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { countRows, type RowCount } from "../../services/admin";
import { collections } from "./config";
import { CollectionManager } from "./CollectionManager";
import { ProfileEditor } from "./ProfileEditor";

type SectionKey = "overview" | "profile" | (typeof collections)[number]["key"];

const icons: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  profile: UserRound,
  projects: FolderKanban,
  services: Sparkles,
  experiences: Briefcase,
  formations: GraduationCap,
  skills: Cpu,
};

const nav: { key: SectionKey; label: string }[] = [
  { key: "overview", label: "Vue d'ensemble" },
  { key: "profile", label: "Profil" },
  ...collections.map((c) => ({ key: c.key as SectionKey, label: c.label })),
];

function readHash(): SectionKey {
  const key = window.location.hash.replace("#", "");
  return (nav.find((n) => n.key === key)?.key ?? "overview") as SectionKey;
}

interface Toast {
  id: number;
  message: string;
  tone: "success" | "error";
}

interface Props {
  email?: string;
  onLogout: () => void;
}

export function AdminDashboard({ email, onLogout }: Props) {
  const [section, setSection] = useState<SectionKey>(readHash);
  const [mobileNav, setMobileNav] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const onHash = () => setSection(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (key: SectionKey) => {
    window.location.hash = key;
    setSection(key);
    setMobileNav(false);
  };

  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const current = collections.find((c) => c.key === section);
  const label = nav.find((n) => n.key === section)?.label ?? "";

  const navList = (
    <nav className="space-y-1" aria-label="Navigation d'administration">
      {nav.map(({ key, label: text }) => {
        const Icon = icons[key];
        const active = key === section;
        return (
          <button
            key={key}
            type="button"
            onClick={() => go(key)}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${
              active ? "bg-teal-50 font-semibold text-teal-900" : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            {text}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex md:sticky md:top-0 md:h-screen">
        <Link to="/" className="flex h-[72px] items-center gap-3 border-b border-slate-200 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-xs font-bold tracking-wide text-white">CM</span>
          <span>
            <span className="block text-sm font-semibold tracking-tight">Carlo Musongela</span>
            <span className="block text-xs text-slate-500">Portfolio admin</span>
          </span>
        </Link>
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Contenus</p>
          {navList}
        </div>
        <div className="border-t border-slate-200 p-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Voir le portfolio
          </a>
          <button type="button" onClick={onLogout} className="mt-1 flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Se déconnecter
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setMobileNav((o) => !o)} aria-label="Menu" aria-expanded={mobileNav}>
                {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <p className="text-sm text-slate-500">
                Administration <span className="px-1.5 text-slate-300">/</span>
                <span className="font-semibold text-slate-900">{label}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/" target="_blank" rel="noopener noreferrer" className="hidden h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:inline-flex">
                Portfolio public <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-sm font-semibold text-teal-900" title={email} aria-label={`Compte ${email ?? "administrateur"}`}>
                {(email ?? "A").slice(0, 1).toUpperCase()}
              </span>
              <button type="button" onClick={onLogout} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Se déconnecter">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          {mobileNav && <div className="border-t border-slate-100 bg-white px-3 py-3 md:hidden">{navList}</div>}
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {section === "overview" && <Overview email={email} onOpen={go} />}
          {section === "profile" && <ProfileEditor notify={notify} />}
          {current && <CollectionManager key={current.key} config={current} notify={notify} />}
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg ${
              t.tone === "success" ? "border-emerald-200 bg-white text-emerald-900" : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function Overview({ email, onOpen }: { email?: string; onOpen: (key: SectionKey) => void }) {
  const [counts, setCounts] = useState<Record<string, RowCount>>({});

  useEffect(() => {
    let active = true;
    void Promise.all(collections.map(async (c) => [c.key, await countRows(c.table, c.publishable)] as const)).then((entries) => {
      if (active) setCounts(Object.fromEntries(entries));
    });
    return () => {
      active = false;
    };
  }, []);

  const firstError = Object.values(counts).find((c) => c.error)?.error;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-teal-800">Connecté en tant que {email ?? "administrateur"}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Tableau de bord</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Tout ce qui est publié ici apparaît sur le portfolio, en français et en anglais. Les brouillons restent invisibles pour les visiteurs.
        </p>
      </div>

      {firstError && (
        <div role="alert" className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          {firstError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button type="button" onClick={() => onOpen("profile")} className="group rounded-lg border border-slate-200 bg-white p-5 text-left hover:border-teal-300 hover:shadow-sm">
          <UserRound className="h-5 w-5 text-teal-800" />
          <p className="mt-3 text-sm font-semibold text-slate-900">Profil</p>
          <p className="mt-1 text-sm text-slate-500">Bio, photo, CV, coordonnées</p>
        </button>
        {collections.map((c) => {
          const Icon = icons[c.key];
          const count = counts[c.key];
          return (
            <button key={c.key} type="button" onClick={() => onOpen(c.key as SectionKey)} className="group rounded-lg border border-slate-200 bg-white p-5 text-left hover:border-teal-300 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-teal-800" />
                <span className="text-2xl font-semibold text-slate-950">{count ? count.total ?? "—" : "…"}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{c.label}</p>
              <p className="mt-1 text-sm text-slate-500">
                {count?.published !== null && count?.published !== undefined ? `${count.published} publié(s)` : c.description}
              </p>
            </button>
          );
        })}
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-950">Bon à savoir</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {[
            "Chaque texte a une version EN (base) et FR. Si la version FR est vide, le site affiche l'anglais.",
            "Le bouton œil publie ou dépublie un élément sans le supprimer.",
            "Les images et le CV sont stockés dans le bucket public « portfolio-public » de Supabase.",
            "Quand Supabase répond, le site affiche uniquement ce qui est publié ici : une section sans contenu publié reste vide. Le contenu intégré au code ne sert que si Supabase est injoignable (ou, pour les compétences, si aucune n'est publiée).",
          ].map((tip) => (
            <li key={tip} className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
