export type ProjectStatus = "Completed" | "In Progress" | "Planned";

export type ProjectCategory = "Web App" | "Mobile App" | "API" | "System" | "Other";

export interface Project {
  id: number | string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  status: ProjectStatus;
  client: string;
  duration: string;
  teamSize: number;
  completedDate: string;
  githubUrl?: string;
  liveUrl?: string;
  image: string;
  category: ProjectCategory;
  /** Per-language overrides of the text fields (from the Supabase `translations` column). */
  i18n?: Partial<Record<"fr" | "en", Partial<Pick<Project, "title" | "description" | "longDescription" | "client" | "duration" | "completedDate">>>>;
}

/** `translations` column: {"fr": {"column_name": "texte"}}. Missing keys fall back to the base column. */
export type Translations = Partial<Record<"fr" | "en", Record<string, string>>>;

/** Public row shapes defined by supabase/migrations/20261013143000_create_portfolio_schema.sql. */
export interface ProfileRecord {
  id: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  languages: string[];
  avatar_path: string | null;
  cv_path: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  whatsapp_number: string | null;
  contact_email: string | null;
  is_public: boolean;
  translations?: Translations;
  created_at: string;
  updated_at: string;
}

interface PublishedRecord {
  id: string;
  translations?: Translations;
  display_order: number;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRecord extends PublishedRecord {
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  category: "web_app" | "mobile_app" | "api" | "system" | "other";
  status: "completed" | "in_progress" | "planned";
  client: string | null;
  duration: string | null;
  team_size: number | null;
  completed_date: string | null;
  technologies: string[];
  cover_image_path: string | null;
  github_url: string | null;
  live_url: string | null;
}

export interface ExperienceRecord extends PublishedRecord {
  position: string;
  company: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

export interface FormationRecord extends PublishedRecord {
  title: string;
  institution: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "completed" | "in_progress" | "planned";
  certificate_path: string | null;
  document_url: string | null;
}

export interface SkillRecord extends PublishedRecord {
  name: string;
  category: string;
  level: number | null;
}

export interface ServiceRecord extends PublishedRecord {
  title: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  price_label: string | null;
  cta_label: string | null;
  cta_url: string | null;
}

export interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  cta_label?: string | null;
  cta_url?: string | null;
  translations?: Translations;
}

export interface PromotionRecord extends PublishedRecord {
  title: string;
  description: string | null;
  image_path: string | null;
  service_id: string | null;
  formation_id: string | null;
  starts_at: string | null;
  ends_at: string | null;
  cta_label: string | null;
  cta_url: string | null;
}

export type ContentSource = "supabase" | "static";

export interface ContentState<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  source: ContentSource;
}
