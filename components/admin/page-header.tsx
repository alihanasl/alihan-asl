"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import type { AdminMessageKey } from "@/lib/i18n/admin";

export function AdminPageHeader({
  titleKey,
  descriptionKey,
  actionHref,
  actionKey,
}: {
  titleKey: AdminMessageKey;
  descriptionKey?: AdminMessageKey;
  actionHref?: string;
  actionKey?: AdminMessageKey;
}) {
  const { t } = useAdminI18n();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t(titleKey)}</h1>
        {descriptionKey ? (
          <p className="mt-1 text-sm text-zinc-500">{t(descriptionKey)}</p>
        ) : null}
      </div>
      {actionHref && actionKey ? (
        <Link href={actionHref} className="admin-btn">
          {t(actionKey)}
        </Link>
      ) : null}
    </div>
  );
}

export function AdminHeading({
  titleKey,
}: {
  titleKey: AdminMessageKey;
}) {
  const { t } = useAdminI18n();
  return (
    <h1 className="mb-6 text-2xl font-semibold tracking-tight">{t(titleKey)}</h1>
  );
}
