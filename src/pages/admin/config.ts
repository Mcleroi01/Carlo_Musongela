import type { Row } from "../../services/admin";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "tags"
  | "url"
  | "email"
  | "checkbox"
  | "image"
  | "file";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Shows a second input for the French version, saved in `translations.fr`. */
  translatable?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  placeholder?: string;
  rows?: number;
  /** Takes the full width of the form grid. */
  wide?: boolean;
  min?: number;
  max?: number;
  accept?: string;
}

export interface CollectionConfig {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  subtitle?: (row: Row) => string;
  imageField?: string;
  /** Has published_at / archived_at columns. */
  publishable: boolean;
  /** Generates `slug` from this field when left empty. */
  slugFrom?: string;
  orderBy: string;
  fields: FieldDef[];
}

const order: FieldDef = {
  name: "display_order",
  label: "Ordre d'affichage",
  type: "number",
  min: 0,
  help: "Les plus petits nombres s'affichent en premier.",
};

const str = (v: unknown) => (typeof v === "string" ? v : "");
const yearOf = (v: unknown) => str(v).slice(0, 4);

export const collections: CollectionConfig[] = [
  {
    key: "projects",
    table: "projects",
    label: "Projets",
    singular: "projet",
    description: "Les réalisations affichées dans la section Projets.",
    titleField: "title",
    subtitle: (r) => [str(r.client), str(r.completed_date)].filter(Boolean).join(" · "),
    imageField: "cover_image_path",
    publishable: true,
    slugFrom: "title",
    orderBy: "display_order",
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, translatable: true },
      { name: "slug", label: "Slug (URL)", type: "text", help: "Généré depuis le titre si vide." },
      {
        name: "category",
        label: "Catégorie",
        type: "select",
        required: true,
        options: [
          { value: "web_app", label: "Application web" },
          { value: "mobile_app", label: "Application mobile" },
          { value: "api", label: "API" },
          { value: "system", label: "Système" },
          { value: "other", label: "Autre" },
        ],
      },
      {
        name: "status",
        label: "Statut",
        type: "select",
        required: true,
        options: [
          { value: "completed", label: "Terminé" },
          { value: "in_progress", label: "En cours" },
          { value: "planned", label: "Planifié" },
        ],
      },
      { name: "short_description", label: "Description courte", type: "textarea", rows: 2, translatable: true, wide: true },
      { name: "long_description", label: "Description détaillée", type: "textarea", rows: 5, translatable: true, wide: true },
      { name: "client", label: "Client", type: "text", translatable: true },
      { name: "duration", label: "Durée", type: "text", translatable: true, placeholder: "4 months" },
      { name: "completed_date", label: "Date de livraison", type: "text", translatable: true, placeholder: "March 2025" },
      { name: "team_size", label: "Taille de l'équipe", type: "number", min: 1 },
      { name: "technologies", label: "Technologies", type: "tags", wide: true, help: "Séparées par des virgules." },
      { name: "cover_image_path", label: "Image de couverture", type: "image", wide: true },
      { name: "live_url", label: "Lien en ligne", type: "url", placeholder: "https://" },
      { name: "github_url", label: "Lien GitHub", type: "url", placeholder: "https://github.com/…" },
      order,
    ],
  },
  {
    key: "services",
    table: "services",
    label: "Services",
    singular: "service",
    description: "Les offres de la section Services. Une fois publiées, elles remplacent les cartes statiques.",
    titleField: "title",
    subtitle: (r) => str(r.price_label),
    imageField: "image_path",
    publishable: true,
    slugFrom: "title",
    orderBy: "display_order",
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, translatable: true },
      { name: "slug", label: "Slug (URL)", type: "text", help: "Généré depuis le titre si vide." },
      { name: "description", label: "Description", type: "textarea", rows: 3, translatable: true, wide: true },
      { name: "price_label", label: "Prix (texte libre)", type: "text", placeholder: "À partir de 500 $" },
      { name: "cta_label", label: "Texte du bouton", type: "text", translatable: true, placeholder: "Demander un devis" },
      { name: "cta_url", label: "Lien du bouton", type: "url", placeholder: "https:// ou #contact" },
      { name: "image_path", label: "Image", type: "image", wide: true },
      order,
    ],
  },
  {
    key: "experiences",
    table: "experiences",
    label: "Expériences",
    singular: "expérience",
    description: "Le parcours professionnel (frise chronologique).",
    titleField: "position",
    subtitle: (r) => `${str(r.company)} · ${yearOf(r.start_date)}${r.is_current ? " – aujourd'hui" : r.end_date ? ` – ${yearOf(r.end_date)}` : ""}`,
    publishable: true,
    orderBy: "display_order",
    fields: [
      { name: "position", label: "Poste", type: "text", required: true, translatable: true },
      { name: "company", label: "Entreprise", type: "text", required: true, translatable: true },
      { name: "location", label: "Lieu", type: "text" },
      { name: "start_date", label: "Début", type: "date", required: true },
      { name: "end_date", label: "Fin", type: "date", help: "Laisser vide si en poste." },
      { name: "is_current", label: "Poste actuel", type: "checkbox" },
      {
        name: "description",
        label: "Missions",
        type: "textarea",
        rows: 5,
        translatable: true,
        wide: true,
        help: "Une ligne = un point de la liste.",
      },
      order,
    ],
  },
  {
    key: "formations",
    table: "formations",
    label: "Formations",
    singular: "formation",
    description: "Diplômes et formations (colonne Formation).",
    titleField: "title",
    subtitle: (r) => `${str(r.institution)}${r.end_date ? ` · ${yearOf(r.end_date)}` : ""}`,
    publishable: true,
    orderBy: "display_order",
    fields: [
      { name: "title", label: "Intitulé", type: "text", required: true, translatable: true },
      { name: "institution", label: "Établissement", type: "text", required: true, translatable: true },
      { name: "description", label: "Mention / détail", type: "text", translatable: true, wide: true },
      { name: "start_date", label: "Début", type: "date" },
      { name: "end_date", label: "Fin / obtention", type: "date" },
      {
        name: "status",
        label: "Statut",
        type: "select",
        required: true,
        options: [
          { value: "completed", label: "Obtenue" },
          { value: "in_progress", label: "En cours" },
          { value: "planned", label: "Prévue" },
        ],
      },
      { name: "document_url", label: "Lien du certificat", type: "url", placeholder: "https://" },
      order,
    ],
  },
  {
    key: "skills",
    table: "skills",
    label: "Compétences",
    singular: "compétence",
    description: "Les technologies du bandeau défilant.",
    titleField: "name",
    subtitle: (r) => `${str(r.category)}${typeof r.level === "number" ? ` · ${r.level}%` : ""}`,
    publishable: true,
    orderBy: "display_order",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "category", label: "Catégorie", type: "text", required: true, placeholder: "Frontend, Backend, Tools…" },
      { name: "level", label: "Niveau (0-100)", type: "number", min: 0, max: 100 },
      order,
    ],
  },
];

export const profileFields: FieldDef[] = [
  { name: "display_name", label: "Nom affiché", type: "text", required: true },
  { name: "headline", label: "Titre", type: "text", translatable: true, placeholder: "Fullstack Developer" },
  { name: "bio", label: "Bio", type: "textarea", rows: 4, translatable: true, wide: true },
  { name: "location", label: "Localisation", type: "text", placeholder: "Kinshasa, DR CONGO" },
  { name: "languages", label: "Langues", type: "tags", placeholder: "EN, FR, PT" },
  { name: "avatar_path", label: "Photo principale (hero)", type: "image", wide: true, help: "Remplace la photo du haut de page." },
  { name: "cv_path", label: "CV (PDF)", type: "file", accept: "application/pdf", wide: true, help: "Utilisé par le bouton « Télécharger le CV »." },
  { name: "contact_email", label: "E-mail de contact", type: "email" },
  { name: "whatsapp_number", label: "Téléphone / WhatsApp", type: "text", placeholder: "+243 …" },
  { name: "github_url", label: "GitHub", type: "url" },
  { name: "linkedin_url", label: "LinkedIn", type: "url" },
  { name: "is_public", label: "Profil visible sur le site", type: "checkbox" },
];
