import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  Fingerprint,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { AdminDashboard } from "./admin/AdminDashboard";

type AdminState = "checking" | "signed-out" | "authorized" | "forbidden" | "verification-error";

function authorizationErrorMessage(error: { code?: string; message?: string }) {
  const text = error.message ?? "";
  if (error.code === "42P01" || error.code === "PGRST205" || /admin_users.*(does not exist|not found|schema cache)|could not find.*admin_users/i.test(text)) {
    return "La table admin_users n'existe pas ou n'est pas accessible. Vérifiez que la migration Supabase a été appliquée et que ses politiques RLS sont en place.";
  }
  return "La vérification des droits administrateur a échoué. Vérifiez la configuration Supabase et réessayez.";
}

export function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [adminState, setAdminState] = useState<AdminState>("checking");
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function verifyAdmin(userId: string, isMounted = () => true) {
    if (!supabase) {
      setAdminState("verification-error");
      setMessage("Supabase n'est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans .env.local.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();

      if (!isMounted()) return;

      if (error) {
        setAdminState("verification-error");
        setMessage(authorizationErrorMessage(error));
        return;
      }

      if (!data) {
        setAdminState("forbidden");
        setMessage("Ce compte est connecté, mais ne possède pas de droits administrateur actifs.");
        return;
      }

      setAdminState("authorized");
      setMessage(null);
    } catch {
      if (!isMounted()) return;
      setAdminState("verification-error");
      setMessage("Impossible de vérifier les droits administrateur. Vérifiez la connexion puis réessayez.");
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      if (!isSupabaseConfigured || !supabase) {
        setAdminState("signed-out");
        setMessage(
          "Supabase n'est pas encore configuré. Ajoutez les variables publiques requises dans .env.local.",
        );
        return;
      }

      try {
        const { data, error } = await supabase.auth.getUser();
        if (!isMounted) return;

        if (error) {
          setAdminState("signed-out");
          setMessage("Impossible de vérifier la session. Réessayez.");
          return;
        }

        if (!data.user) {
          setAdminState("signed-out");
          return;
        }

        setUser(data.user);
        await verifyAdmin(data.user.id, () => isMounted);
      } catch {
        if (!isMounted) return;
        setAdminState("signed-out");
        setMessage("Impossible de joindre Supabase. Vérifiez votre connexion.");
      }
    }

    void checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!isSupabaseConfigured || !supabase) {
      setMessage(
        "Supabase n'est pas encore configuré. Ajoutez les variables publiques requises dans .env.local.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setMessage("Connexion impossible. Vérifiez l'adresse et le mot de passe.");
        return;
      }

      setUser(data.user);
      setAdminState("checking");
      await verifyAdmin(data.user.id);
    } catch {
      setMessage("La connexion a échoué. Vérifiez votre réseau puis réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          setMessage("La déconnexion a échoué. Réessayez.");
          return;
        }
      } catch {
        setMessage("La déconnexion a échoué. Réessayez.");
        return;
      }
    }

    setUser(null);
    setAdminState("signed-out");
    setMessage(null);
    setPassword("");
  }

  if (adminState === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 text-slate-600">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-teal-700" aria-hidden="true" />
          <span className="text-sm font-medium">Vérification de votre session…</span>
        </div>
      </main>
    );
  }

  if (adminState !== "authorized") {
    const isForbidden = adminState === "forbidden";
    const isVerificationError = adminState === "verification-error";

    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
          <header className="flex items-center justify-between">
            <Link to="/" className="group inline-flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-sm font-bold tracking-wide text-white">CM</span>
              <span>
                <span className="block text-sm font-semibold tracking-tight text-slate-900">Carlo Musongela</span>
                <span className="block text-xs text-slate-500">Espace d’administration</span>
              </span>
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Retour au portfolio</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </header>

          <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_420px] lg:gap-20">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-teal-200 bg-teal-50 text-teal-800">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-teal-800">Accès sécurisé</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Administration du portfolio</h1>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Connectez-vous avec le compte administrateur autorisé dans Supabase. Les droits sont vérifiés côté base de données avant d’ouvrir cet espace.
              </p>
              <div className="mt-8 flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                <p>Aucune inscription administrateur n’est proposée ici. L’accès est accordé séparément par le propriétaire du projet.</p>
              </div>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="login-heading">
              {isForbidden || isVerificationError ? (
                <div>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                    <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 id="login-heading" className="text-xl font-semibold tracking-tight text-slate-950">{isForbidden ? "Accès non autorisé" : "Vérification indisponible"}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{message ?? (isForbidden ? "Ce compte ne dispose pas des droits nécessaires." : "Impossible de vérifier les droits administrateur.")}</p>
                  <button type="button" onClick={handleLogout} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                      <Fingerprint className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 id="login-heading" className="text-xl font-semibold tracking-tight text-slate-950">Connexion administrateur</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Utilisez les identifiants du compte autorisé.</p>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Adresse e-mail</span>
                    <span className="relative block">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                      <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required className="min-h-11 w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15" placeholder="vous@exemple.com" />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</span>
                    <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15" placeholder="Votre mot de passe" />
                  </label>

                  {message && (
                    <p role="alert" className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm leading-5 text-amber-950">
                      <HelpCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{message}</span>
                    </p>
                  )}

                  <button type="submit" disabled={isSubmitting || !isSupabaseConfigured} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}
                    {isSubmitting ? "Connexion…" : "Se connecter"}
                  </button>
                </form>
              )}
            </section>
          </section>

          <footer className="border-t border-slate-200 py-5 text-xs text-slate-500">
            L’accès à cet espace est contrôlé par Supabase Auth et les politiques RLS du projet.
          </footer>
        </div>
      </main>
    );
  }

  return <AdminDashboard email={user?.email} onLogout={handleLogout} />;
}
