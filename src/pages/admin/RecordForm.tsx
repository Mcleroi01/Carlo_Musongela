import { useId, useState, type FormEvent, type ReactNode } from "react";
import { FileText, ImagePlus, Loader2, Save, Upload, X } from "lucide-react";
import { publicAssetUrl } from "../../services/portfolio";
import { slugify, uploadPublicFile, type Row } from "../../services/admin";
import type { FieldDef } from "./config";

type Values = Record<string, string | boolean>;

/** Turns a database row into form values (all strings, except checkboxes). */
export function toFormValues(fields: FieldDef[], row: Row | null): { values: Values; fr: Record<string, string> } {
  const values: Values = {};
  for (const f of fields) {
    const v = row?.[f.name];
    if (f.type === "checkbox") values[f.name] = Boolean(v ?? (f.name === "is_public"));
    else if (f.type === "tags") values[f.name] = Array.isArray(v) ? v.join(", ") : "";
    else values[f.name] = v === null || v === undefined ? "" : String(v);
  }
  const translations = (row?.translations ?? {}) as Record<string, Record<string, string>>;
  return { values, fr: { ...(translations.fr ?? {}) } };
}

/** Converts form values back to column values, ready for insert/update. */
export function toPayload(
  fields: FieldDef[],
  values: Values,
  fr: Record<string, string>,
  existing: Row | null,
  slugFrom?: string,
) {
  const payload: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = values[f.name];
    if (f.type === "checkbox") {
      payload[f.name] = Boolean(raw);
      continue;
    }
    const text = typeof raw === "string" ? raw.trim() : "";
    if (f.type === "tags") payload[f.name] = text ? text.split(",").map((s) => s.trim()).filter(Boolean) : [];
    else if (f.type === "number") {
      const n = text === "" ? null : Number.parseInt(text, 10);
      payload[f.name] = n === null || Number.isNaN(n) ? (f.name === "display_order" ? 0 : null) : n;
    } else payload[f.name] = text || null;
  }

  if (slugFrom && "slug" in payload && !payload.slug) payload.slug = slugify(String(payload[slugFrom] ?? "")) || null;
  // The schema forbids an end date on a current position.
  if (payload.is_current === true && "end_date" in payload) payload.end_date = null;

  const translatable = fields.filter((f) => f.translatable).map((f) => f.name);
  if (translatable.length) {
    const cleanFr = Object.fromEntries(
      Object.entries(fr).filter(([k, v]) => translatable.includes(k) && v.trim()).map(([k, v]) => [k, v.trim()]),
    );
    const previous = (existing?.translations ?? {}) as Record<string, unknown>;
    payload.translations = { ...previous, fr: cleanFr };
  }
  return payload;
}

const inputBase =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15";

interface InputProps {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
  id: string;
  lang?: "EN" | "FR";
}

function TextInput({ field, value, onChange, id }: InputProps) {
  if (field.type === "textarea") {
    return (
      <textarea
        id={id}
        rows={field.rows ?? 3}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} resize-y`}
      />
    );
  }
  // URL fields stay plain text so in-page links such as "#contact" are accepted.
  const type = field.type === "number" || field.type === "date" || field.type === "email" ? field.type : "text";
  return (
    <input
      id={id}
      type={type}
      value={value}
      min={field.min}
      max={field.max}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputBase}
    />
  );
}

function UploadInput({ field, value, onChange, id, folder }: InputProps & { folder: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = publicAssetUrl(value);
  const isImage = field.type === "image";

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    const result = await uploadPublicFile(folder, file);
    setBusy(false);
    if (result.error !== null) setError(result.error);
    else onChange(result.data);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        {url && isImage && (
          <img src={url} alt="" className="h-16 w-24 rounded-md border border-slate-200 object-cover bg-slate-100" />
        )}
        {url && !isImage && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-800 hover:underline">
            <FileText className="h-4 w-4" /> Voir le fichier
          </a>
        )}
        <label
          htmlFor={id}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : isImage ? <ImagePlus className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          {busy ? "Envoi…" : url ? "Remplacer" : "Téléverser"}
        </label>
        <input
          id={id}
          type="file"
          accept={field.accept ?? (isImage ? "image/*" : undefined)}
          className="sr-only"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        {value && (
          <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-red-700">
            <X className="h-4 w-4" /> Retirer
          </button>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…ou collez une URL https://"
        aria-label={`${field.label} : chemin ou URL`}
        className={`${inputBase} text-xs`}
      />
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

interface RecordFormProps {
  fields: FieldDef[];
  row: Row | null;
  folder: string;
  slugFrom?: string;
  submitLabel?: string;
  onSubmit: (payload: Record<string, unknown>) => Promise<string | null>;
  onCancel?: () => void;
  /** Extra controls rendered next to the submit button (e.g. "publish"). */
  extra?: ReactNode;
}

export function RecordForm({ fields, row, folder, slugFrom, submitLabel = "Enregistrer", onSubmit, onCancel, extra }: RecordFormProps) {
  const initial = toFormValues(fields, row);
  const [values, setValues] = useState<Values>(initial.values);
  const [fr, setFr] = useState<Record<string, string>>(initial.fr);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uid = useId();

  const setValue = (name: string, v: string | boolean) => setValues((prev) => ({ ...prev, [name]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && f.type !== "checkbox" && !String(values[f.name] ?? "").trim());
    if (missing.length) {
      setError(`Champs obligatoires : ${missing.map((f) => f.label).join(", ")}.`);
      return;
    }
    setSaving(true);
    setError(null);
    const message = await onSubmit(toPayload(fields, values, fr, row, slugFrom));
    setSaving(false);
    if (message) setError(message);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `${uid}-${f.name}`;
          if (f.type === "checkbox") {
            return (
              <label key={f.name} className="flex items-center gap-3 self-end rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={Boolean(values[f.name])}
                  onChange={(e) => setValue(f.name, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                />
                {f.label}
              </label>
            );
          }
          const value = String(values[f.name] ?? "");
          return (
            <div key={f.name} className={f.wide || f.translatable ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
                {f.label}
                {f.required && <span className="text-red-600"> *</span>}
              </label>
              {f.type === "select" ? (
                <select id={id} value={value} onChange={(e) => setValue(f.name, e.target.value)} className={inputBase}>
                  <option value="">— Choisir —</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : f.type === "image" || f.type === "file" ? (
                <UploadInput field={f} value={value} onChange={(v) => setValue(f.name, v)} id={id} folder={folder} />
              ) : f.translatable ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <span className="mb-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">EN</span>
                    <TextInput field={f} value={value} onChange={(v) => setValue(f.name, v)} id={id} />
                  </div>
                  <div>
                    <span className="mb-1 inline-block rounded bg-teal-50 px-1.5 py-0.5 text-[11px] font-semibold text-teal-800">FR</span>
                    <TextInput
                      field={{ ...f, placeholder: "Version française (sinon l'anglais est affiché)" }}
                      value={fr[f.name] ?? ""}
                      onChange={(v) => setFr((prev) => ({ ...prev, [f.name]: v }))}
                      id={`${id}-fr`}
                    />
                  </div>
                </div>
              ) : (
                <TextInput field={f} value={value} onChange={(v) => setValue(f.name, v)} id={id} />
              )}
              {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-900">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-5">
        {extra}
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Enregistrement…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
