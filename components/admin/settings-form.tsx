"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CmsStat } from "@/lib/cms/types";
import { saveStatsAction } from "@/lib/cms/actions";
import { useAdminToast } from "@/components/admin/toast";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import type { AdminMessageKey } from "@/lib/i18n/admin";

const labels: Record<string, AdminMessageKey> = {
  servers: "settings.servers",
  switches: "settings.switches",
  projects: "settings.projects",
  problems: "settings.problems",
};

export function SettingsForm({
  stats,
  githubConfigured,
  authConfigured,
}: {
  stats: CmsStat[];
  githubConfigured: boolean;
  authConfigured: boolean;
}) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const { t, errorText } = useAdminI18n();
  const [saving, setSaving] = useState(false);
  const rows = ["servers", "switches", "projects", "problems"].map((id) => {
    return stats.find((stat) => stat.id === id) ?? {
      id,
      value: null,
      display: "",
      suffix: "",
      sortOrder: 0,
    };
  });

  return (
    <div className="space-y-6">
      <section className="admin-card">
        <h2 className="admin-section-title">{t("settings.status")}</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-600">
          <li>{authConfigured ? t("settings.authOk") : t("settings.authMissing")}</li>
          <li>
            {githubConfigured ? t("settings.githubOk") : t("settings.githubMissing")}
          </li>
        </ul>
      </section>

      <form
        className="admin-card space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          const result = await saveStatsAction(new FormData(event.currentTarget));
          setSaving(false);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("settings.saved"));
          router.refresh();
        }}
      >
        <h2 className="admin-section-title">{t("settings.overview")}</h2>
        {rows.map((stat) => (
          <div key={stat.id} className="grid gap-3 sm:grid-cols-3">
            <p className="self-end text-sm font-medium">
              {t(labels[stat.id] ?? "settings.overview")}
            </p>
            <label className="admin-field">
              <span>{t("settings.value")}</span>
              <input
                name={`${stat.id}_value`}
                defaultValue={stat.value ?? ""}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="admin-field">
                <span>{t("settings.suffix")}</span>
                <input name={`${stat.id}_suffix`} defaultValue={stat.suffix} />
              </label>
              <label className="admin-field">
                <span>{t("settings.display")}</span>
                <input name={`${stat.id}_display`} defaultValue={stat.display} />
              </label>
            </div>
          </div>
        ))}
        <p className="text-xs text-zinc-500">{t("settings.hint")}</p>
        <button type="submit" className="admin-btn" disabled={saving}>
          {t("common.save")}
        </button>
      </form>
    </div>
  );
}
