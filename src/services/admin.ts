import { supabase } from "../lib/supabase";

/** Admin-side data access. Every write is still checked by RLS (`public.is_admin()`). */

export type Row = Record<string, unknown> & { id: string };
export type AdminResult<T> = { data: T; error: null } | { data: null; error: string };

const PUBLIC_BUCKET = "portfolio-public";

function friendlyError(error: { code?: string; message: string }): string {
  if (error.code === "23505") return "Cette valeur existe déjà (par exemple un slug ou un nom en double).";
  if (error.code === "23514") return "Une règle de la base a refusé ces valeurs (dates incohérentes, valeur hors limites…).";
  if (error.code === "42501" || /row-level security|permission denied/i.test(error.message)) {
    return "Action refusée : ce compte n'a pas les droits administrateur sur cette table.";
  }
  if (error.code === "PGRST204" || /column .* does not exist|schema cache/i.test(error.message)) {
    return "Colonne introuvable : appliquez la migration 20261118120000_add_content_translations.sql dans Supabase.";
  }
  if (/failed to fetch|network/i.test(error.message)) return "Supabase est injoignable. Vérifiez la connexion et l'URL du projet.";
  return error.message;
}

function client() {
  if (!supabase) throw new Error("Supabase n'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY).");
  return supabase;
}

async function run<T>(fn: () => PromiseLike<{ data: T | null; error: { code?: string; message: string } | null }>): Promise<AdminResult<T>> {
  try {
    const { data, error } = await fn();
    if (error) return { data: null, error: friendlyError(error) };
    return { data: data as T, error: null };
  } catch (e) {
    return { data: null, error: friendlyError({ message: e instanceof Error ? e.message : String(e) }) };
  }
}

export function listRows(table: string, orderBy: string) {
  return run<Row[]>(() =>
    client().from(table).select("*").order(orderBy, { ascending: true }).order("created_at", { ascending: false }),
  );
}

export function getFirstRow(table: string) {
  return run<Row | null>(() => client().from(table).select("*").order("created_at", { ascending: true }).limit(1).maybeSingle());
}

export function insertRow(table: string, values: Record<string, unknown>) {
  return run<Row>(() => client().from(table).insert(values).select().single());
}

export function updateRow(table: string, id: string, values: Record<string, unknown>) {
  return run<Row>(() => client().from(table).update(values).eq("id", id).select().single());
}

export function deleteRow(table: string, id: string) {
  return run<null>(() => client().from(table).delete().eq("id", id));
}

export interface RowCount {
  total: number | null;
  published: number | null;
  error: string | null;
}

export async function countRows(table: string, publishable: boolean): Promise<RowCount> {
  try {
    const all = await client().from(table).select("id", { count: "exact", head: true });
    if (all.error) return { total: null, published: null, error: friendlyError(all.error) };
    if (!publishable) return { total: all.count ?? 0, published: null, error: null };
    const pub = await client()
      .from(table)
      .select("id", { count: "exact", head: true })
      .not("published_at", "is", null)
      .is("archived_at", null);
    return { total: all.count ?? 0, published: pub.error ? null : pub.count ?? 0, error: null };
  } catch (e) {
    return { total: null, published: null, error: friendlyError({ message: e instanceof Error ? e.message : String(e) }) };
  }
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Uploads to the public bucket and returns the stored path (resolved with publicAssetUrl). */
export async function uploadPublicFile(folder: string, file: File): Promise<AdminResult<string>> {
  const dot = file.name.lastIndexOf(".");
  const ext = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "bin";
  const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name) || "fichier";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  try {
    const { error } = await client().storage.from(PUBLIC_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });
    if (error) return { data: null, error: friendlyError({ message: error.message }) };
    return { data: path, error: null };
  } catch (e) {
    return { data: null, error: friendlyError({ message: e instanceof Error ? e.message : String(e) }) };
  }
}
