import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminI18nProvider } from "@/components/admin/admin-i18n";
import { isLocale } from "@/lib/i18n/config";
import { adminContentCookie, adminUiCookie } from "@/lib/i18n/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const ui = jar.get(adminUiCookie)?.value;
  const content = jar.get(adminContentCookie)?.value;

  return (
    <AdminI18nProvider
      initialUi={isLocale(ui) ? ui : "tr"}
      initialContent={isLocale(content) ? content : "tr"}
    >
      {children}
    </AdminI18nProvider>
  );
}
