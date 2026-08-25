import type { Metadata, Viewport } from "next";
import { geist, geistMono, instrument } from "@/lib/fonts";
import { site } from "@/data/site";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { CmsProvider } from "@/components/cms/cms-provider";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { translate } from "@/lib/i18n/translate";
import { getPublicCms } from "@/lib/cms/public";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const cms = await getPublicCms();
  const title =
    cms.copy["meta.title"]?.[locale] || translate(locale, "meta.title");
  const description =
    cms.copy["meta.description"]?.[locale] ||
    translate(locale, "meta.description");
  const name = cms.profile.name || site.name;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: title,
      template: `%s — ${name}`,
    },
    description,
    applicationName: name,
    authors: [{ name }],
    creator: name,
    keywords: (
      cms.copy["meta.keywords"]?.[locale] || translate(locale, "meta.keywords")
    )
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    openGraph: {
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      url: site.url,
      siteName: name,
      title: cms.copy["meta.title"]?.[locale] || title,
      description: cms.copy["meta.description"]?.[locale] || description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "/",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#E4E2DC",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const cms = await getPublicCms();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body className="bg-paper text-ink antialiased">
        <CmsProvider value={cms}>
          <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        </CmsProvider>
      </body>
    </html>
  );
}
