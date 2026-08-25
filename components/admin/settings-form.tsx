"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CmsStat } from "@/lib/cms/types";
import { saveStatsAction } from "@/lib/cms/actions";
import { useAdminToast } from "@/components/admin/toast";

const labels: Record<string, string> = {
  servers: "Servers",
  switches: "Switches",
  projects: "Projects",
  problems: "Problems",
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
        <h2 className="admin-section-title">Durum</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-600">
          <li>
            {authConfigured
              ? "Admin girişi tanımlı."
              : "ADMIN_USERNAME / ADMIN_PASSWORD eksik."}
          </li>
          <li>
            {githubConfigured
              ? "GitHub bağlı. Save işlemi repository’ye commit atar, Vercel deploy eder."
              : "GITHUB_TOKEN, GITHUB_OWNER ve GITHUB_REPO eksik. Yerelde dosyalar diske yazılır; production’da GitHub şart."}
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
            toast(result.error, "error");
            return;
          }
          toast("Özet rakamlar kaydedildi.");
          router.refresh();
        }}
      >
        <h2 className="admin-section-title">System overview</h2>
        {rows.map((stat) => (
          <div key={stat.id} className="grid gap-3 sm:grid-cols-3">
            <p className="self-end text-sm font-medium">{labels[stat.id] ?? stat.id}</p>
            <label className="admin-field">
              <span>Value</span>
              <input
                name={`${stat.id}_value`}
                defaultValue={stat.value ?? ""}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="admin-field">
                <span>Suffix</span>
                <input name={`${stat.id}_suffix`} defaultValue={stat.suffix} />
              </label>
              <label className="admin-field">
                <span>Display</span>
                <input name={`${stat.id}_display`} defaultValue={stat.display} />
              </label>
            </div>
          </div>
        ))}
        <p className="text-xs text-zinc-500">
          Sonsuz gibi özel gösterimler için value boş, display alanına sembol yaz.
        </p>
        <button type="submit" className="admin-btn" disabled={saving}>
          Save
        </button>
      </form>
    </div>
  );
}
