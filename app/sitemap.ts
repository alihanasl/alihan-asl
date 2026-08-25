import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getPublicCms } from "@/lib/cms/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cms = await getPublicCms();
  const projectEntries = cms.projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...projectEntries,
  ];
}
