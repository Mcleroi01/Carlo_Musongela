import type { Dictionary, Lang } from "../i18n/translations";
import type { ExperienceRecord, FormationRecord, Translations } from "../types/portfolio";

/** Text of `field` in `lang`, falling back to the base (English) column. */
export function localized<T extends { translations?: Translations }>(
  row: T,
  field: keyof T & string,
  lang: Lang,
): string {
  const override = row.translations?.[lang]?.[field];
  if (typeof override === "string" && override.trim()) return override;
  const base = row[field];
  return typeof base === "string" ? base : "";
}

export interface JobView {
  key: string;
  role: string;
  company: string;
  period: string;
  points: string[];
}

export interface EducationView {
  key: string;
  title: string;
  school: string;
  year: string;
}

const year = (date: string | null) => (date ? date.slice(0, 4) : "");

/** One bullet per line of the description; leading "-", "•" or "*" are stripped. */
function toPoints(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function toJobView(row: ExperienceRecord, lang: Lang, t: Dictionary): JobView {
  const start = year(row.start_date);
  const end = row.is_current ? t.experience.present : year(row.end_date);
  return {
    key: row.id,
    role: localized(row, "position", lang),
    company: localized(row, "company", lang),
    period: !end || end === start ? start : `${start} – ${end}`,
    points: toPoints(localized(row, "description", lang)),
  };
}

export function toEducationView(row: FormationRecord, lang: Lang, t: Dictionary): EducationView {
  const description = localized(row, "description", lang);
  const institution = localized(row, "institution", lang);
  return {
    key: row.id,
    title: localized(row, "title", lang),
    school: description ? `${institution} · ${description}` : institution,
    year: year(row.end_date ?? row.start_date) || (t.projects.status[statusLabel[row.status]] ?? ""),
  };
}

const statusLabel = { completed: "Completed", in_progress: "In Progress", planned: "Planned" } as const;
