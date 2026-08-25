import type { Metadata } from "next";
import { AboutPage } from "@/components/sections/about-page";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { translate } from "@/lib/i18n/translate";
import { getPublicCms } from "@/lib/cms/public";
import { site } from "@/data/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const cms = await getPublicCms();
  const name = cms.profile.name || site.name;
  const title =
    cms.copy["about.kicker"]?.[locale] || translate(locale, "about.kicker");

  return {
    title,
    description:
      cms.copy["about.lead"]?.[locale] || translate(locale, "about.lead"),
    openGraph: {
      title: `${title} — ${name}`,
    },
  };
}

export default function AboutRoute() {
  return (
    <main id="content">
      <AboutPage />
    </main>
  );
}
