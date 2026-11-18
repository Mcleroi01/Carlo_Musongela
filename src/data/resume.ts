/** Content taken from public/documents/Musongela_Carlo_CV.pdf. */

export const CV_URL = "/documents/Musongela_Carlo_CV.pdf";

export const photos = {
  hero: { src: "/images/abp_7235-800.webp", srcSet: "/images/abp_7235-800.webp 800w, /images/abp_7235-1600.webp 1600w" },
  about: { src: "/images/abp_7307-800.webp", srcSet: "/images/abp_7307-800.webp 800w, /images/abp_7307-1600.webp 1600w" },
  work: { src: "/images/abp_7302-800.webp", srcSet: "/images/abp_7302-800.webp 800w, /images/abp_7302-1600.webp 1600w" },
};

export const strengths = [
  {
    title: "Fullstack web & mobile",
    text: "Laravel, React and Flutter: from back-end to interface, one profile to ship a complete product.",
  },
  {
    title: "Multi-sector experience",
    text: "Health, e-commerce, education and events: projects designed from A to Z.",
  },
  {
    title: "Tech & creative",
    text: "Development, UI/UX in Figma and video editing in Premiere Pro, in a single profile.",
  },
  {
    title: "Verifiable references",
    text: "Orange Digital Center, SNEL and YETOO Technologie managers ready to recommend.",
  },
];

/** Years of hands-on experience, counted from the first role on the CV (2021). */
export const yearsOfExperience = new Date().getFullYear() - 2021;

export const experience = [
  {
    role: "Freelance Fullstack Developer",
    company: "Independent",
    period: "2024 – 2025",
    points: [
      "Design and deliver custom web and mobile apps (Laravel, React, Flutter) from client needs.",
      "Build secure REST APIs and structure SQL databases following MVC.",
      "Design responsive interfaces in Figma for a clear, consistent experience.",
      "Deploy, maintain and evolve products in production (Git, Firebase, AWS).",
    ],
  },
  {
    role: "Fullstack Web Developer",
    company: "Eyano Santé",
    period: "2023",
    points: [
      "Developed modules of a hospital management web app, back-end to UI.",
      "Modelled and administered the database for reliable, consistent data.",
      "Turned medical and administrative staff needs into concrete features.",
    ],
  },
  {
    role: "Digital Video Editor (Internship)",
    company: "RTNC2",
    period: "2021 – 2022",
    points: [
      "Edited and finalised audiovisual content for national TV broadcast.",
      "Met tight deadlines in a fast-paced newsroom environment.",
    ],
  },
];

export const education = [
  { title: "Bachelor in Computer Technology", school: "ISP/Gombe · With honours", year: "2025" },
  { title: "Fullstack Developer", school: "Orange Digital Center", year: "2025" },
  { title: "Fullstack Developer Master Class", school: "Letecode Academy", year: "2023" },
  { title: "Digital Editor", school: "ICA (RTNC)", year: "2021" },
  { title: "Graphic Design Master Class", school: "Art Ndaka", year: "2020" },
];

export const techStack = [
  "Laravel", "React", "Flutter", "TypeScript", "PHP", "Dart", "Tailwind CSS",
  "Node.js", "Firebase", "AWS", "MySQL", "PostgreSQL", "Python", "Git", "Figma", "Premiere Pro",
];
