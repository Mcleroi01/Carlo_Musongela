/** Non-translatable CV data. Translated CV text lives in src/i18n/translations.ts. */

export const CV_URL = "/documents/Musongela_Carlo_CV.pdf";

export const photos = {
  hero: { src: "/images/abp_7235-800.webp", srcSet: "/images/abp_7235-800.webp 800w, /images/abp_7235-1600.webp 1600w" },
  about: { src: "/images/abp_7307-800.webp", srcSet: "/images/abp_7307-800.webp 800w, /images/abp_7307-1600.webp 1600w" },
  work: { src: "/images/abp_7302-800.webp", srcSet: "/images/abp_7302-800.webp 800w, /images/abp_7302-1600.webp 1600w" },
};

/** Years of hands-on experience, counted from the first role on the CV (2021). */
export const yearsOfExperience = new Date().getFullYear() - 2021;

export const techStack = [
  "Laravel", "React", "Flutter", "TypeScript", "PHP", "Dart", "Tailwind CSS",
  "Node.js", "Firebase", "AWS", "MySQL", "PostgreSQL", "Python", "Git", "Figma", "Premiere Pro",
];
