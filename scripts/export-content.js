const fs = require("fs");
const path = require("path");

const en = JSON.parse(fs.readFileSync("locales/en.json", "utf8"));
const tr = JSON.parse(fs.readFileSync("locales/tr.json", "utf8"));

function get(source, keyPath) {
  return (
    keyPath.split(".").reduce((node, key) => node && node[key], source) ?? ""
  );
}

const contentKeys = [
  "meta.title",
  "meta.description",
  "meta.jobTitle",
  "meta.ogRoles",
  "hero.index",
  "hero.lab",
  "hero.tagline",
  "hero.roleIt",
  "hero.roleBuilder",
  "hero.roleCreator",
  "system.index",
  "system.title",
  "system.copy",
  "system.servers",
  "system.switches",
  "system.projects",
  "system.problems",
  "work.index",
  "work.title",
  "work.copy",
  "lab.index",
  "lab.title",
  "lab.copy",
  "about.index",
  "about.manifestoOne",
  "about.manifestoTwo",
  "about.copy",
  "toolbox.index",
  "toolbox.title",
  "toolbox.copy",
  "contact.index",
  "contact.titleLine1",
  "contact.titleLine2",
  "contact.copy",
  "footer.descriptor",
  "footer.note",
];

const copy = {};
for (const key of contentKeys) {
  copy[key] = { en: get(en, key), tr: get(tr, key) };
}

function projectCopy(slug, field, locale) {
  const bag = locale === "en" ? en.projects : tr.projects;
  return bag[slug][field];
}

const projects = [
  {
    slug: "ping-alert-v2",
    name: "Ping Alert V2",
    category: "desktop",
    technologies: ["Electron", "TypeScript", "Node.js"],
    year: "2025",
    layout: "visual-right",
  },
  {
    slug: "laniff",
    name: "LANIFF",
    category: "platform",
    technologies: ["Next.js", "TypeScript", "Supabase"],
    year: "2025",
    layout: "visual-left",
  },
  {
    slug: "guest-assist-ai",
    name: "Guest Assist AI",
    category: "ai",
    technologies: ["Next.js", "TypeScript", "Python"],
    year: "2025",
    layout: "visual-below",
  },
  {
    slug: "it-toolkit",
    name: "IT Toolkit",
    category: "tools",
    technologies: ["Python", "TypeScript", "Git"],
    year: "2024 —",
    layout: "compact",
  },
].map((project, index) => ({
  id: project.slug,
  slug: project.slug,
  titleTr: project.name,
  titleEn: project.name,
  shortDescriptionTr: projectCopy(project.slug, "description", "tr"),
  shortDescriptionEn: projectCopy(project.slug, "description", "en"),
  problemTr: projectCopy(project.slug, "problem", "tr"),
  problemEn: projectCopy(project.slug, "problem", "en"),
  ideaTr: projectCopy(project.slug, "idea", "tr"),
  ideaEn: projectCopy(project.slug, "idea", "en"),
  buildTr: projectCopy(project.slug, "build", "tr"),
  buildEn: projectCopy(project.slug, "build", "en"),
  resultTr: projectCopy(project.slug, "result", "tr"),
  resultEn: projectCopy(project.slug, "result", "en"),
  captionTr: projectCopy(project.slug, "caption", "tr"),
  captionEn: projectCopy(project.slug, "caption", "en"),
  category: project.category,
  technologies: project.technologies,
  year: project.year,
  githubUrl: "",
  liveUrl: "",
  coverImage: "",
  gallery: [],
  featured: true,
  published: true,
  sortOrder: index,
  layout: project.layout,
}));

const experience = [
  {
    id: "it",
    fieldTr: tr.about.itField,
    fieldEn: en.about.itField,
    contextTr: tr.about.itContext,
    contextEn: en.about.itContext,
  },
  {
    id: "products",
    fieldTr: tr.about.productsField,
    fieldEn: en.about.productsField,
    contextTr: tr.about.productsContext,
    contextEn: en.about.productsContext,
  },
  {
    id: "content",
    fieldTr: tr.about.contentField,
    fieldEn: en.about.contentField,
    contextTr: tr.about.contentContext,
    contextEn: en.about.contentContext,
  },
].map((item, index) => ({
  ...item,
  company: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  descriptionTr: "",
  descriptionEn: "",
  published: true,
  sortOrder: index,
}));

const skills = [
  ["nextjs", "Next.js", "frontend"],
  ["typescript", "TypeScript", "frontend"],
  ["react", "React", "frontend"],
  ["tailwind", "Tailwind", "frontend"],
  ["supabase", "Supabase", "database"],
  ["electron", "Electron", "tools"],
  ["python", "Python", "backend"],
  ["git", "Git", "tools"],
  ["vercel", "Vercel", "infrastructure"],
  ["networking", "Networking", "infrastructure"],
].map(([id, name, category], index) => ({
  id,
  name: id === "networking" ? en.toolbox.networkingName : name,
  category,
  noteTr: tr.toolbox[id],
  noteEn: en.toolbox[id],
  published: true,
  sortOrder: index,
}));

const experiments = [
  {
    id: "network-monitoring",
    nameTr: tr.lab.networkMonitoring,
    nameEn: en.lab.networkMonitoring,
    noteTr: tr.lab.networkMonitoringNote,
    noteEn: en.lab.networkMonitoringNote,
    status: "active",
    ref: "01",
  },
  {
    id: "guest-assistant",
    nameTr: tr.lab.guestAssistant,
    nameEn: en.lab.guestAssistant,
    noteTr: tr.lab.guestAssistantNote,
    noteEn: en.lab.guestAssistantNote,
    status: "building",
    ref: "03",
  },
  {
    id: "internal-tools",
    nameTr: tr.lab.internalTools,
    nameEn: en.lab.internalTools,
    noteTr: tr.lab.internalToolsNote,
    noteEn: en.lab.internalToolsNote,
    status: "experimental",
    ref: "04",
  },
].map((item, index) => ({ ...item, published: true, sortOrder: index }));

const about = {
  id: "profile",
  name: "Alihan Asl",
  email: "hello@alihanasl.com",
  githubUrl: "https://github.com/alihanasl",
  linkedinUrl: "https://www.linkedin.com/in/alihanasl",
  youtubeUrl: "https://www.youtube.com/@alihanasl",
};

const stats = [
  { id: "servers", value: 20, display: "", suffix: "+", sortOrder: 0 },
  { id: "switches", value: 150, display: "", suffix: "+", sortOrder: 1 },
  { id: "projects", value: 10, display: "", suffix: "+", sortOrder: 2 },
  { id: "problems", value: null, display: "∞", suffix: "", sortOrder: 3 },
];

fs.mkdirSync("content", { recursive: true });
fs.mkdirSync("public/uploads", { recursive: true });
fs.writeFileSync("content/projects.json", `${JSON.stringify(projects, null, 2)}\n`);
fs.writeFileSync("content/experience.json", `${JSON.stringify(experience, null, 2)}\n`);
fs.writeFileSync("content/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
fs.writeFileSync("content/experiments.json", `${JSON.stringify(experiments, null, 2)}\n`);
fs.writeFileSync("content/about.json", `${JSON.stringify(about, null, 2)}\n`);
fs.writeFileSync("content/site.json", `${JSON.stringify(copy, null, 2)}\n`);
fs.writeFileSync("content/stats.json", `${JSON.stringify(stats, null, 2)}\n`);
fs.writeFileSync("content/media.json", `${JSON.stringify([], null, 2)}\n`);
fs.writeFileSync("public/uploads/.gitkeep", "");
console.log("wrote content JSON");
