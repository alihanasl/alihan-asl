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
    ],
  },
  {
    id: "lab",
    label: "Lab",
    keys: [
      { key: "lab.index", label: "Bölüm etiketi" },
      { key: "lab.title", label: "Başlık" },
      { key: "lab.copy", label: "Açıklama", multiline: true },
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
    ],
  },
  {
    id: "footer",
    label: "Footer",
    keys: [
      { key: "footer.descriptor", label: "Tanım" },
      { key: "footer.note", label: "Not" },
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
