import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ImageOff, Loader2, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { publicAssetUrl } from "../../services/portfolio";
import { deleteRow, insertRow, listRows, updateRow, type Row } from "../../services/admin";
import type { CollectionConfig } from "./config";
import { RecordForm } from "./RecordForm";

interface Props {
  config: CollectionConfig;
  notify: (message: string, tone?: "success" | "error") => void;
}

const isPublished = (row: Row) => Boolean(row.published_at) && !row.archived_at;

export function CollectionManager({ config, notify }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [publishOnSave, setPublishOnSave] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listRows(config.table, config.orderBy);
    setLoading(false);
    if (result.error !== null) setError(result.error);
    else {
      setError(null);
      setRows(result.data);
    }
  }, [config.table, config.orderBy]);

  useEffect(() => {
    setEditing(null);
    setQuery("");
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [rows, query]);

  function openEditor(row: Row | "new") {
    setPublishOnSave(row === "new" ? true : isPublished(row));
    setEditing(row);
  }

  async function save(payload: Record<string, unknown>) {
    const existing = editing && editing !== "new" ? editing : null;
    if (config.publishable) {
      const wasPublished = existing ? isPublished(existing) : false;
      if (publishOnSave && !wasPublished) {
        payload.published_at = new Date().toISOString();
        payload.archived_at = null;
      }
      if (!publishOnSave) payload.published_at = null;
    }
    const result = existing ? await updateRow(config.table, existing.id, payload) : await insertRow(config.table, payload);
    if (result.error !== null) return result.error;
    notify(existing ? "Modifications enregistrées." : `Nouveau ${config.singular} ajouté.`);
    setEditing(null);
    void load();
    return null;
  }

  async function togglePublish(row: Row) {
    setBusyId(row.id);
    const publish = !isPublished(row);
    const result = await updateRow(config.table, row.id, {
      published_at: publish ? new Date().toISOString() : null,
      archived_at: null,
    });
    setBusyId(null);
    if (result.error !== null) notify(result.error, "error");
    else {
      notify(publish ? "Publié : visible sur le site." : "Dépublié : masqué du site.");
      setRows((prev) => prev.map((r) => (r.id === row.id ? result.data : r)));
    }
  }

  async function remove(row: Row) {
    const title = String(row[config.titleField] ?? "");
    if (!window.confirm(`Supprimer définitivement « ${title} » ? Cette action est irréversible.`)) return;
    setBusyId(row.id);
    const result = await deleteRow(config.table, row.id);
    setBusyId(null);
    if (result.error !== null) notify(result.error, "error");
    else {
      notify(`« ${title} » supprimé.`);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  }

  const publishedCount = rows.filter(isPublished).length;

  return (
    <section aria-labelledby={`${config.key}-title`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 id={`${config.key}-title`} className="text-2xl font-semibold tracking-tight text-slate-950">
            {config.label}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{config.description}</p>
          {!loading && !error && (
            <p className="mt-2 text-xs text-slate-500">
              {rows.length} au total{config.publishable && ` · ${publishedCount} publié(s) · ${rows.length - publishedCount} brouillon(s)`}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            aria-label="Actualiser"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => openEditor("new")}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-900"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
      </div>

      {rows.length > 4 && (
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Rechercher dans les ${config.label.toLowerCase()}…`}
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          />
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {loading && !rows.length ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
        </div>
      ) : !error && filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-600">{query ? "Aucun résultat." : `Aucun ${config.singular} pour le moment.`}</p>
          {!query && (
            <button type="button" onClick={() => openEditor("new")} className="mt-4 text-sm font-semibold text-teal-800 hover:underline">
              Ajouter le premier
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {filtered.map((row) => {
            const image = config.imageField ? publicAssetUrl(row[config.imageField] as string | null) : "";
            const published = isPublished(row);
            return (
              <li key={row.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
                {config.imageField && (
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                    {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <ImageOff className="h-4 w-4 text-slate-400" />}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{String(row[config.titleField] ?? "—")}</p>
                    {config.publishable && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                          published ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {published ? "Publié" : "Brouillon"}
                      </span>
                    )}
                  </div>
                  {config.subtitle && <p className="mt-0.5 truncate text-xs text-slate-500">{config.subtitle(row)}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {busyId === row.id && <Loader2 className="mr-1 h-4 w-4 animate-spin text-slate-400" />}
                  {config.publishable && (
                    <button
                      type="button"
                      onClick={() => void togglePublish(row)}
                      disabled={busyId === row.id}
                      title={published ? "Dépublier" : "Publier"}
                      aria-label={published ? "Dépublier" : "Publier"}
                      className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      {published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditor(row)}
                    title="Modifier"
                    aria-label="Modifier"
                    className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(row)}
                    disabled={busyId === row.id}
                    title="Supprimer"
                    aria-label="Supprimer"
                    className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="editor-title">
          <button type="button" aria-label="Fermer" className="absolute inset-0 bg-slate-900/40" onClick={() => setEditing(null)} />
          <div className="relative flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 id="editor-title" className="text-lg font-semibold text-slate-950">
                {editing === "new" ? `Nouveau ${config.singular}` : `Modifier : ${String(editing[config.titleField] ?? "")}`}
              </h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Fermer" className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <RecordForm
                key={editing === "new" ? "new" : editing.id}
                fields={config.fields}
                row={editing === "new" ? null : editing}
                folder={config.table}
                slugFrom={config.slugFrom}
                onSubmit={save}
                onCancel={() => setEditing(null)}
                extra={
                  config.publishable && (
                    <label className="mr-auto inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={publishOnSave}
                        onChange={(e) => setPublishOnSave(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                      />
                      Publié sur le site
                    </label>
                  )
                }
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
