import type { Locale } from "@/lib/i18n/config";

export type Localized = {
  tr: string;
  en: string;
};

export type SiteButton = {
  id: string;
  label: Localized;
  href: string;
  icon: "none" | "arrow" | "mail" | "github" | "external";
};

export type SiteMenuItem = {
  id: string;
  label: Localized;
  href: string;
  visible: boolean;
};

export type SiteFooterLink = {
  id: string;
  label: Localized;
  href: string;
};

export type FaqItem = {
  id: string;
  question: Localized;
  answer: Localized;
};

export type QuoteItem = {
  id: string;
  quote: Localized;
  person: Localized;
};

export type TimelineItem = {
  id: string;
  date: Localized;
  title: Localized;
  body: Localized;
};

export type SiteSectionType =
  | "hero"
  | "system"
  | "work"
  | "lab"
  | "about"
  | "toolbox"
  | "contact"
  | "cta"
  | "faq"
  | "testimonials"
  | "timeline"
  | "gallery"
  | "custom";

export type SiteSection = {
  id: string;
  type: SiteSectionType;
  visible: boolean;
  image: string;
  gallery: string[];
  buttons: SiteButton[];
  heading: Localized;
  body: Localized;
  items: Array<FaqItem | QuoteItem | TimelineItem>;
};

export type SitePage = {
  id: string;
  title: Localized;
  path: string;
  focusSection?: string;
  recordsHref?: string;
};

export type SiteLayout = {
  menu: SiteMenuItem[];
  footer: {
    links: SiteFooterLink[];
  };
  pages: SitePage[];
  sections: SiteSection[];
};

export const sectionTypes: {
  id: SiteSectionType;
  label: Localized;
  builtin?: boolean;
}[] = [
  { id: "hero", label: { tr: "Hero", en: "Hero" }, builtin: true },
  { id: "system", label: { tr: "Özet", en: "Overview" }, builtin: true },
  { id: "work", label: { tr: "İşler", en: "Work" }, builtin: true },
  { id: "lab", label: { tr: "Lab", en: "Lab" }, builtin: true },
  { id: "about", label: { tr: "Hakkında", en: "About" }, builtin: true },
  { id: "toolbox", label: { tr: "Araçlar", en: "Toolbox" }, builtin: true },
  { id: "contact", label: { tr: "İletişim", en: "Contact" }, builtin: true },
  { id: "cta", label: { tr: "Çağrı", en: "CTA" } },
  { id: "faq", label: { tr: "SSS", en: "FAQ" } },
  { id: "testimonials", label: { tr: "Yorumlar", en: "Testimonials" } },
  { id: "timeline", label: { tr: "Zaman çizelgesi", en: "Timeline" } },
  { id: "gallery", label: { tr: "Galeri", en: "Gallery" } },
  { id: "custom", label: { tr: "Serbest", en: "Custom" } },
];

export const copyKeysBySection: Partial<Record<SiteSectionType, string[]>> = {
  hero: [
    "hero.index",
    "hero.lab",
    "hero.tagline",
    "hero.roleIt",
    "hero.roleBuilder",
    "hero.roleCreator",
  ],
  system: [
    "system.index",
    "system.title",
    "system.copy",
    "system.servers",
    "system.switches",
    "system.projects",
    "system.problems",
  ],
  work: ["work.index", "work.title", "work.copy"],
  lab: ["lab.index", "lab.title", "lab.copy"],
  about: [
    "about.index",
    "about.manifestoOne",
    "about.manifestoTwo",
    "about.copy",
  ],
  toolbox: ["toolbox.index", "toolbox.title", "toolbox.copy"],
  contact: [
    "contact.index",
    "contact.titleLine1",
    "contact.titleLine2",
    "contact.copy",
  ],
};

export function emptyLocalized(): Localized {
  return { tr: "", en: "" };
}

export function pickLocalized(locale: Locale, value?: Localized) {
  if (!value) return "";
  return locale === "tr" ? value.tr || value.en : value.en || value.tr;
}

export function newLayoutId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 10)}`;
}

export function blankSection(type: SiteSectionType): SiteSection {
  return {
    id: newLayoutId(),
    type,
    visible: true,
    image: "",
    gallery: [],
    buttons: [],
    heading: emptyLocalized(),
    body: emptyLocalized(),
    items: [],
  };
}

export const defaultSiteLayout: SiteLayout = {
  menu: [
    {
      id: "work",
      href: "/#work",
      visible: true,
      label: { tr: "İşler", en: "Work" },
    },
    {
      id: "about",
      href: "/#about",
      visible: true,
      label: { tr: "Hakkında", en: "About" },
    },
    {
      id: "lab",
      href: "/#lab",
      visible: true,
      label: { tr: "Lab", en: "Lab" },
    },
    {
      id: "contact",
      href: "/#contact",
      visible: true,
      label: { tr: "İletişim", en: "Contact" },
    },
  ],
  footer: { links: [] },
  pages: [
    {
      id: "home",
      path: "/",
      title: { tr: "Ana sayfa", en: "Home" },
    },
    {
      id: "about",
      path: "/#about",
      focusSection: "about",
      recordsHref: "/admin/about",
      title: { tr: "Hakkında", en: "About" },
    },
    {
      id: "projects",
      path: "/#work",
      focusSection: "work",
      recordsHref: "/admin/projects",
      title: { tr: "Projeler", en: "Projects" },
    },
    {
      id: "experience",
      path: "/#about",
      focusSection: "about",
      recordsHref: "/admin/experience",
      title: { tr: "Deneyim", en: "Experience" },
    },
    {
      id: "contact",
      path: "/#contact",
      focusSection: "contact",
      title: { tr: "İletişim", en: "Contact" },
    },
  ],
  sections: [
    {
      id: "hero",
      type: "hero",
      visible: true,
      image: "",
      gallery: [],
      buttons: [],
      heading: emptyLocalized(),
      body: emptyLocalized(),
      items: [],
    },
    {
      id: "system",
      type: "system",
      visible: true,
      image: "",
      gallery: [],
      buttons: [],
      heading: emptyLocalized(),
      body: emptyLocalized(),
      items: [],
    },
    {
      id: "work",
      type: "work",
      visible: true,
      image: "",
      gallery: [],
      buttons: [],
      heading: emptyLocalized(),
      body: emptyLocalized(),
      items: [],
    },
    {
      id: "lab",
      type: "lab",
      visible: true,
      image: "",
      gallery: [],
      buttons: [],
      heading: emptyLocalized(),
      body: emptyLocalized(),
      items: [],
    },
    {
      id: "about",
      type: "about",
      visible: true,
      image: "",
      gallery: [],
      buttons: [],
      heading: emptyLocalized(),
      body: emptyLocalized(),
      items: [],
    },
    {
      id: "toolbox",
      type: "toolbox",
      visible: true,
      image: "",
      gallery: [],
      buttons: [],
      heading: emptyLocalized(),
      body: emptyLocalized(),
      items: [],
    },
    {
      id: "contact",
      type: "contact",
      visible: true,
      image: "",
      gallery: [],
      buttons: [],
      heading: emptyLocalized(),
      body: emptyLocalized(),
      items: [],
    },
  ],
};

export function normalizeLayout(input: unknown): SiteLayout {
  const base = defaultSiteLayout;
  if (!input || typeof input !== "object") return structuredClone(base);
  const value = input as Partial<SiteLayout> & {
    sections?: Array<Partial<SiteSection> & { type?: string }>;
  };
  const allowed = new Set(sectionTypes.map((item) => item.id));
  return {
    menu: Array.isArray(value.menu) && value.menu.length ? value.menu : base.menu,
    footer: { links: value.footer?.links ?? [] },
    pages: Array.isArray(value.pages) && value.pages.length ? value.pages : base.pages,
    sections:
      Array.isArray(value.sections) && value.sections.length
        ? value.sections.map((section) => {
            const type = allowed.has(section.type as SiteSectionType)
              ? (section.type as SiteSectionType)
              : "custom";
            return {
              ...blankSection(type),
              ...section,
              type,
              heading: section.heading ?? emptyLocalized(),
              body: section.body ?? emptyLocalized(),
              buttons: section.buttons ?? [],
              gallery: section.gallery ?? [],
              items: section.items ?? [],
              visible: section.visible !== false,
              image: section.image ?? "",
            };
          })
        : base.sections,
  };
}

export type MediaUsageLabel = {
  kind: "section" | "project";
  tr: string;
  en: string;
};

export function collectMediaUsage(
  layout: SiteLayout,
  projects: Array<{
    titleTr: string;
    titleEn: string;
    slug: string;
    coverImage?: string;
    gallery?: string[];
  }>,
): Record<string, MediaUsageLabel[]> {
  const map: Record<string, MediaUsageLabel[]> = {};

  function add(url: string | undefined, label: MediaUsageLabel) {
    if (!url) return;
    const list = map[url] ?? (map[url] = []);
    if (list.some((item) => item.kind === label.kind && item.tr === label.tr && item.en === label.en)) {
      return;
    }
    list.push(label);
  }

  for (const section of layout.sections) {
    const type = sectionTypes.find((item) => item.id === section.type);
    const label: MediaUsageLabel = {
      kind: "section",
      tr: type?.label.tr ?? section.type,
      en: type?.label.en ?? section.type,
    };
    add(section.image, label);
    for (const url of section.gallery) {
      add(url, label);
    }
  }

  for (const project of projects) {
    const label: MediaUsageLabel = {
      kind: "project",
      tr: project.titleTr || project.slug,
      en: project.titleEn || project.titleTr || project.slug,
    };
    add(project.coverImage, label);
    for (const url of project.gallery ?? []) {
      add(url, label);
    }
  }

  return map;
}
