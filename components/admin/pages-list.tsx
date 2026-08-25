"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { pickLocalized, type SiteLayout } from "@/lib/cms/layout";

export function PagesList({ layout }: { layout: SiteLayout }) {
  const { t, contentLocale } = useAdminI18n();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{t("pages.title")}</h1>
      <p className="mt-1 text-sm text-zinc-500">{t("pages.listLead")}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {layout.pages.map((page) => (
          <li key={page.id}>
            <Link
              href={`/admin/pages/${page.id}`}
              className="admin-card block transition-colors hover:border-zinc-400"
            >
              <p className="text-base font-semibold">
                {pickLocalized(contentLocale, page.title)}
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-500">{page.path}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
