export type ContentGroup = {
  id: string;
  label: string;
  keys: { key: string; label: string; multiline?: boolean }[];
};

export const contentGroups: ContentGroup[] = [
  {
    id: "seo",
    label: "SEO",
    keys: [
      { key: "meta.title", label: "Sayfa başlığı" },
      { key: "meta.description", label: "Açıklama", multiline: true },
      { key: "meta.jobTitle", label: "Unvan" },
      { key: "meta.ogRoles", label: "Roller" },
      { key: "meta.keywords", label: "Anahtar kelimeler", multiline: true },
    ],
  },
  {
    id: "hero",
    label: "Hero",
    keys: [
      { key: "hero.index", label: "Üst etiket" },
      { key: "hero.lab", label: "Lab etiketi" },
      { key: "hero.tagline", label: "Açıklama", multiline: true },
      { key: "hero.roleIt", label: "Rol 1" },
      { key: "hero.roleBuilder", label: "Rol 2" },
      { key: "hero.roleCreator", label: "Rol 3" },
      { key: "hero.scroll", label: "Kaydır yazısı" },
      { key: "hero.scrollHref", label: "Kaydır bağlantısı" },
    ],
  },
  {
    id: "system",
    label: "Özet",
    keys: [
      { key: "system.index", label: "Bölüm etiketi" },
      { key: "system.title", label: "Başlık" },
      { key: "system.copy", label: "Açıklama", multiline: true },
      { key: "system.servers", label: "Sunucu etiketi" },
      { key: "system.switches", label: "Switch etiketi" },
      { key: "system.projects", label: "Proje etiketi" },
      { key: "system.problems", label: "Problem etiketi" },
    ],
  },
  {
    id: "work",
    label: "İşler",
    keys: [
      { key: "work.index", label: "Bölüm etiketi" },
      { key: "work.title", label: "Başlık" },
      { key: "work.copy", label: "Açıklama", multiline: true },
      { key: "work.caseStudy", label: "Kart butonu" },
      { key: "work.open", label: "Aç yazısı" },
    ],
  },
  {
    id: "lab",
    label: "Lab",
    keys: [
      { key: "lab.index", label: "Bölüm etiketi" },
      { key: "lab.title", label: "Başlık" },
      { key: "lab.copy", label: "Açıklama", multiline: true },
      { key: "lab.experiment", label: "Deney sütunu" },
      { key: "lab.status", label: "Durum sütunu" },
      { key: "lab.ref", label: "Ref sütunu" },
      { key: "lab.active", label: "Aktif" },
      { key: "lab.building", label: "Gelişiyor" },
      { key: "lab.experimental", label: "Deneysel" },
    ],
  },
  {
    id: "about",
    label: "Hakkında",
    keys: [
      { key: "about.index", label: "Bölüm etiketi" },
      { key: "about.manifestoOne", label: "Manifesto 1" },
      { key: "about.manifestoTwo", label: "Manifesto 2" },
      { key: "about.copy", label: "Biyografi", multiline: true },
    ],
  },
  {
    id: "toolbox",
    label: "Araçlar",
    keys: [
      { key: "toolbox.index", label: "Bölüm etiketi" },
      { key: "toolbox.title", label: "Başlık" },
      { key: "toolbox.copy", label: "Açıklama", multiline: true },
    ],
  },
  {
    id: "contact",
    label: "İletişim",
    keys: [
      { key: "contact.index", label: "Bölüm etiketi" },
      { key: "contact.titleLine1", label: "Başlık satır 1" },
      { key: "contact.titleLine2", label: "Başlık satır 2" },
      { key: "contact.copy", label: "Açıklama", multiline: true },
      { key: "contact.email", label: "E-posta etiketi" },
      { key: "contact.linkedin", label: "LinkedIn etiketi" },
      { key: "contact.github", label: "GitHub etiketi" },
      { key: "contact.youtube", label: "YouTube etiketi" },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    keys: [
      { key: "footer.descriptor", label: "Tanım" },
      { key: "footer.note", label: "Not" },
      { key: "footer.year", label: "Yıl" },
    ],
  },
  {
    id: "project",
    label: "Proje sayfası",
    keys: [
      { key: "project.label", label: "Etiket" },
      { key: "project.category", label: "Kategori" },
      { key: "project.year", label: "Yıl" },
      { key: "project.stack", label: "Stack" },
      { key: "project.problem", label: "Sorun" },
      { key: "project.idea", label: "Fikir" },
      { key: "project.build", label: "Yapılış" },
      { key: "project.technology", label: "Teknoloji" },
      { key: "project.result", label: "Sonuç" },
      { key: "project.open", label: "Aç" },
      { key: "project.previous", label: "Önceki" },
      { key: "project.next", label: "Sonraki" },
    ],
  },
  {
    id: "notFound",
    label: "404",
    keys: [
      { key: "notFound.line1", label: "Satır 1" },
      { key: "notFound.line2", label: "Satır 2" },
      { key: "notFound.back", label: "Geri" },
    ],
  },
  {
    id: "categories",
    label: "Kategoriler",
    keys: [
      { key: "categories.desktop", label: "Masaüstü" },
      { key: "categories.platform", label: "Platform" },
      { key: "categories.ai", label: "Yapay zeka" },
      { key: "categories.tools", label: "Araçlar" },
    ],
  },
];

export const allContentKeys = contentGroups.flatMap((group) =>
  group.keys.map((item) => item.key),
);

export const skillCategories: { id: string; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "tools", label: "Tools" },
];
