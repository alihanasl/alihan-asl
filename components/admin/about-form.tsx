"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/lib/cms/types";
import { saveProfileAction } from "@/lib/cms/actions";
import { useAdminToast } from "@/components/admin/toast";
import { useAdminI18n } from "@/components/admin/admin-i18n";

export function AboutForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const { t, errorText } = useAdminI18n();
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="admin-card max-w-xl space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        const result = await saveProfileAction(new FormData(event.currentTarget));
        setSaving(false);
        if (!result.ok) {
          toast(errorText(result.error), "error");
          return;
        }
        toast(t("about.saved"));
        router.refresh();
      }}
    >
      {profile.id && profile.id !== "local" ? (
        <input type="hidden" name="id" defaultValue={profile.id} />
      ) : null}
      <label className="admin-field">
        <span>{t("about.name")}</span>
        <input name="name" defaultValue={profile.name} />
      </label>
      <label className="admin-field">
        <span>{t("about.email")}</span>
        <input name="email" type="email" defaultValue={profile.email} />
      </label>
      <label className="admin-field">
        <span>{t("about.github")}</span>
        <input name="github_url" defaultValue={profile.githubUrl} />
      </label>
      <label className="admin-field">
        <span>{t("about.linkedin")}</span>
        <input name="linkedin_url" defaultValue={profile.linkedinUrl} />
      </label>
      <label className="admin-field">
        <span>{t("about.youtube")}</span>
        <input name="youtube_url" defaultValue={profile.youtubeUrl} />
      </label>
      <p className="text-xs text-zinc-500">{t("about.hint")}</p>
      <button type="submit" className="admin-btn" disabled={saving}>
        {t("common.save")}
      </button>
    </form>
  );
}
