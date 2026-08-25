import { site } from "@/data/site";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { translate } from "@/lib/i18n/translate";
import { getPublicCms } from "@/lib/cms/public";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const cms = await getPublicCms();
  const name = cms.profile.name || site.name;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle:
      cms.copy["meta.jobTitle"]?.[locale] || translate(locale, "meta.jobTitle"),
    description:
      cms.copy["meta.description"]?.[locale] ||
      translate(locale, "meta.description"),
    url: site.url,
    email: cms.profile.email || site.email,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkipLink />
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
