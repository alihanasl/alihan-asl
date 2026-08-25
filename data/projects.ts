export type ProjectCategory = "desktop" | "platform" | "ai" | "tools";

export type Project = {
  slug: "ping-alert-v2" | "laniff" | "guest-assist-ai" | "it-toolkit";
  number: string;
  name: string;
  shortName: string;
  category: ProjectCategory;
  technologies: string[];
  year: string;
  href?: string;
  featured: boolean;
  layout: "visual-right" | "visual-left" | "visual-below" | "compact";
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "ping-alert-v2",
    number: "01",
    name: "Ping Alert V2",
    shortName: "Ping Alert",
    category: "desktop",
    technologies: ["Electron", "TypeScript", "Node.js"],
    year: "2025",
    featured: true,
    layout: "visual-right",
  },
  {
    slug: "laniff",
    number: "02",
    name: "LANIFF",
    shortName: "LANIFF",
    category: "platform",
    technologies: ["Next.js", "TypeScript", "Supabase"],
    year: "2025",
    featured: true,
    layout: "visual-left",
  },
  {
    slug: "guest-assist-ai",
    number: "03",
    name: "Guest Assist AI",
    shortName: "Guest Assist",
    category: "ai",
    technologies: ["Next.js", "TypeScript", "Python"],
    year: "2025",
    featured: true,
    layout: "visual-below",
  },
  {
    slug: "it-toolkit",
    number: "04",
    name: "IT Toolkit",
    shortName: "Toolkit",
    category: "tools",
    technologies: ["Python", "TypeScript", "Git"],
    year: "2024 —",
    featured: true,
    layout: "compact",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs(): Project["slug"][] {
  return projects.map((project) => project.slug);
}

export function getAdjacentProjects(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
