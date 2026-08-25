import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/projects/case-study";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { translate } from "@/lib/i18n/translate";
import { site } from "@/data/site";
import { getPublicCms } from "@/lib/cms/public";
import { pickLocale } from "@/lib/cms/types";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const cms = await getPublicCms();
  return cms.projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getPublicCms();
  const project = cms.projects.find((item) => item.slug === slug);
  const locale = await getRequestLocale();
  const name = cms.profile.name || site.name;

  if (!project) {
    return { title: translate(locale, "project.fallbackTitle") };
  }

  const title = pickLocale(locale, project.titleTr, project.titleEn);
  const description = pickLocale(
    locale,
    project.shortDescriptionTr,
    project.shortDescriptionEn,
  );

  return {
    title,
    description,
    openGraph: {
      title: `${title} — ${name}`,
      description,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const cms = await getPublicCms();
  const project = cms.projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main id="content">
      <CaseStudy slug={slug} />
    </main>
  );
}
