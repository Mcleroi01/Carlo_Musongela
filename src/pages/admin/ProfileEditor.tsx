import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getFirstRow, insertRow, updateRow, type Row } from "../../services/admin";
import { profileFields } from "./config";
import { RecordForm } from "./RecordForm";

interface Props {
  notify: (message: string, tone?: "success" | "error") => void;
}

/** The portfolio has one profile row; this edits it (or creates it the first time). */
export function ProfileEditor({ notify }: Props) {
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getFirstRow("profiles").then((result) => {
      if (!active) return;
      setLoading(false);
      if (result.error !== null) setError(result.error);
      else setRow(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  async function save(payload: Record<string, unknown>) {
    const result = row ? await updateRow("profiles", row.id, payload) : await insertRow("profiles", payload);
    if (result.error !== null) return result.error;
    setRow(result.data);
    notify("Profil enregistré. Rechargez le portfolio pour voir les changements.");
    return null;
  }

  return (
    <section aria-labelledby="profile-title">
      <div className="mb-6">
        <h1 id="profile-title" className="text-2xl font-semibold tracking-tight text-slate-950">
          Profil
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Nom, titre, bio, photo, CV et coordonnées affichés sur le portfolio. Les champs FR vides reprennent la version anglaise.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement du profil…
        </div>
      ) : error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          {!row && (
            <p className="mb-5 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Aucun profil en base : remplissez le formulaire pour le créer.
            </p>
          )}
          <RecordForm
            key={row?.id ?? "new"}
            fields={profileFields}
            row={row}
            folder="profile"
            submitLabel={row ? "Enregistrer le profil" : "Créer le profil"}
            onSubmit={save}
          />
        </div>
      )}
    </section>
  );
}
