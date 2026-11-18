import type { Lang } from "../i18n/translations";
import type { Project } from "../types/portfolio";

type ProjectText = Pick<Project, "description" | "longDescription" | "duration" | "completedDate" | "client">;

/**
 * French copy of the static projects in ./projects.ts, keyed by project id.
 * Projects loaded from Supabase (other ids) are shown as entered.
 */
const fr: Record<number, Partial<ProjectText>> = {
  1: {
    description:
      "Marketplace complète avec gestion des vendeurs, traitement des paiements et statistiques en temps réel.",
    longDescription:
      "Une marketplace e-commerce complète qui met en relation plusieurs vendeurs et leurs clients. Fonctionnalités : gestion avancée du catalogue produits, paiements sécurisés via Stripe, suivi des commandes en temps réel, tableau de bord vendeur avec statistiques, avis clients et design responsive. La plateforme gère des milliers de produits et traite des centaines de transactions par jour.",
    duration: "4 mois",
    completedDate: "Mars 2025",
  },
  2: {
    description:
      "Un jeu mobile thérapeutique conçu avec une clinique médicale. Il aide les adultes à suivre les mouvements prescrits par un médecin pour leur rééducation physique et mentale.",
    longDescription:
      "Une application mobile de réservation d'hôtels développée avec Flutter, offrant une expérience fluide sur iOS et Android. Fonctionnalités : disponibilité des chambres en temps réel, cartes interactives, paiements sécurisés, gestion des réservations, notifications push, mode hors ligne et intégration aux systèmes de gestion hôtelière. L'application compte plus de 10 000 utilisateurs actifs et traite les réservations de plus de 200 hôtels.",
    duration: "5 mois",
    completedDate: "Octobre 2024",
  },
  3: {
    description:
      "API REST pour la gestion de restaurants : menus, commandes et suivi des stocks.",
    longDescription:
      "Une API REST robuste conçue pour la gestion de restaurants. Elle gère les menus avec tarification dynamique, les commandes avec notifications en temps réel en cuisine, le suivi des stocks avec alertes de réapprovisionnement, la gestion du personnel, les programmes de fidélité et des rapports complets. Développée avec Laravel et optimisée pour la performance, elle sert plusieurs chaînes de restaurants avec 99,9 % de disponibilité.",
    duration: "3 mois",
    completedDate: "Septembre 2023",
  },
  4: {
    description:
      "CRM sur mesure pour le suivi des ventes, la gestion des clients et les rapports automatisés.",
    longDescription:
      "Un système de gestion de la relation client (CRM) pensé pour les PME. Fonctionnalités : gestion des prospects avec scoring automatique, visualisation du pipeline de ventes, historique des échanges clients, automatisation des tâches, intégration e-mailing, rapports avancés avec tableaux de bord personnalisés et contrôle d'accès par rôle. Le système a amélioré l'efficacité commerciale de 40 % et gère plus de 5 000 fiches clients.",
    duration: "6 mois",
    completedDate: "Prévu mars 2024",
  },
  5: {
    description:
      "Une application éducative qui valorise le patrimoine culturel de l'Angola : articles, médias et faits sur l'histoire, les langues, les traditions et les symboles nationaux.",
    longDescription:
      "Une application mobile de suivi sportif qui aide les utilisateurs à atteindre leurs objectifs de santé. Fonctionnalités : programmes d'entraînement avec vidéos, suivi nutritionnel avec scan de codes-barres, visualisation des progrès, défis entre amis, intégration aux objets connectés et recommandations de coaching personnalisées. L'application a dépassé les 50 000 téléchargements avec une note de 4,8 étoiles.",
    client: "Projet personnel",
    duration: "1 mois",
    completedDate: "Mars 2025",
  },
  6: {
    description:
      "Une plateforme numérique pour les concours et les entretiens : les jurés votent en temps réel et les candidats passent des évaluations et des quiz en ligne.",
    longDescription:
      "Un portail immobilier moderne qui met en relation acheteurs, vendeurs et agents. Fonctionnalités : recherche avancée avec filtres, cartes interactives avec données de quartier, visites virtuelles, simulateur de prêt, profils d'agents avec avis, gestion des prospects et design responsive. La plateforme répertorie plus de 10 000 biens et sert plus de 500 agents dans plusieurs villes.",
    duration: "5 mois",
    completedDate: "Prévu juin 2024",
  },
};

export function localizeProject(project: Project, lang: Lang): Project {
  const fromDb = project.i18n?.[lang];
  if (fromDb) {
    // Keep only filled-in translations; empty ones fall back to the base text.
    const filled = Object.fromEntries(Object.entries(fromDb).filter(([, v]) => typeof v === "string" && v.trim()));
    return { ...project, ...filled };
  }
  if (lang !== "fr" || typeof project.id !== "number") return project;
  const override = fr[project.id];
  return override ? { ...project, ...override } : project;
}
