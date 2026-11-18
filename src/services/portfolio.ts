import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type {
  ExperienceRecord,
  FormationRecord,
  ProfileRecord,
  Project,
  ProjectRecord,
  PromotionRecord,
  ServiceRecord,
  ServiceCardData,
  SkillRecord,
} from "../types/portfolio";

export type PortfolioResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

function unavailable<T>(): PortfolioResult<T> {
  return { data: null, error: "Supabase n'est pas configuré dans cet environnement." };
}

function queryFailure<T>(error: { message: string }): PortfolioResult<T> {
  return { data: null, error: error.message };
}

/** Resolves a Storage path from the public bucket (or passes a full URL through). */
export function publicAssetUrl(path: string | null | undefined): string {
  if (!path || !supabase) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return supabase.storage.from("portfolio-public").getPublicUrl(path).data.publicUrl;
}

const projectStatus = {
  completed: "Completed",
  in_progress: "In Progress",
  planned: "Planned",
} as const;

const projectCategory = {
  web_app: "Web App",
  mobile_app: "Mobile App",
  api: "API",
  system: "System",
  other: "Other",
} as const;

function toProject(row: ProjectRecord): Project {
  const fr = row.translations?.fr ?? {};
  return {
    id: row.id,
    title: row.title,
    description: row.short_description ?? "",
    longDescription: row.long_description ?? row.short_description ?? "",
    technologies: row.technologies ?? [],
    status: projectStatus[row.status],
    client: row.client ?? "",
    duration: row.duration ?? "",
    teamSize: row.team_size ?? 1,
    completedDate: row.completed_date ?? "",
    githubUrl: row.github_url ?? undefined,
    liveUrl: row.live_url ?? undefined,
    image: publicAssetUrl(row.cover_image_path),
    category: projectCategory[row.category],
    i18n: {
      fr: {
        title: fr.title,
        description: fr.short_description,
        longDescription: fr.long_description,
        client: fr.client,
        duration: fr.duration,
        completedDate: fr.completed_date,
      },
    },
  };
}

export async function getPublishedProjects(): Promise<PortfolioResult<Project[]>> {
  if (!isSupabaseConfigured || !supabase) return unavailable();
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,slug,short_description,long_description,category,status,client,duration,team_size,completed_date,technologies,cover_image_path,github_url,live_url,display_order,published_at,archived_at,created_at,updated_at,translations")
    .not("published_at", "is", null)
    .is("archived_at", null)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return queryFailure(error);
  return { data: (data as ProjectRecord[]).map(toProject), error: null };
}

export async function getPublicProfile(): Promise<PortfolioResult<ProfileRecord | null>> {
  if (!isSupabaseConfigured || !supabase) return unavailable();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,display_name,headline,bio,location,languages,avatar_path,cv_path,github_url,linkedin_url,whatsapp_number,contact_email,is_public,created_at,updated_at,translations")
    .eq("is_public", true)
    .limit(1)
    .maybeSingle();
  if (error) return queryFailure(error);
  return { data: data as ProfileRecord | null, error: null };
}

async function getPublishedRows<T>(table: string, columns: string, orderColumn: string): Promise<PortfolioResult<T[]>> {
  if (!isSupabaseConfigured || !supabase) return unavailable();
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .not("published_at", "is", null)
    .is("archived_at", null)
    .order(orderColumn, { ascending: true });
  if (error) return queryFailure(error);
  return { data: data as T[], error: null };
}

export function getPublishedServices() {
  return getPublishedRows<ServiceRecord>("services", "id,title,slug,description,image_path,price_label,cta_label,cta_url,display_order,published_at,archived_at,created_at,updated_at,translations", "display_order");
}

export async function getPublishedServiceCards(): Promise<PortfolioResult<ServiceCardData[]>> {
  const result = await getPublishedServices();
  if (result.error !== null) return result;
  return {
    data: result.data.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description ?? "",
      cta_label: service.cta_label,
      cta_url: service.cta_url,
      translations: service.translations,
    })),
    error: null,
  };
}

export function getPublishedExperiences() {
  return getPublishedRows<ExperienceRecord>("experiences", "id,position,company,description,location,start_date,end_date,is_current,display_order,published_at,archived_at,created_at,updated_at,translations", "display_order");
}

export function getPublishedFormations() {
  return getPublishedRows<FormationRecord>("formations", "id,title,institution,description,start_date,end_date,status,certificate_path,document_url,display_order,published_at,archived_at,created_at,updated_at,translations", "display_order");
}

export function getPublishedSkills() {
  return getPublishedRows<SkillRecord>("skills", "id,name,category,level,display_order,published_at,archived_at,created_at,updated_at", "display_order");
}

export async function getActivePromotions(): Promise<PortfolioResult<PromotionRecord[]>> {
  if (!isSupabaseConfigured || !supabase) return unavailable();
  const { data, error } = await supabase
    .from("promotions")
    .select("id,title,description,image_path,service_id,formation_id,starts_at,ends_at,cta_label,cta_url,display_order,published_at,archived_at,created_at,updated_at")
    .not("published_at", "is", null)
    .is("archived_at", null)
    .order("display_order", { ascending: true });
  if (error) return queryFailure(error);
  return { data: data as PromotionRecord[], error: null };
}
