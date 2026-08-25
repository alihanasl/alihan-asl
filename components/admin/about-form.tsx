"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/lib/cms/types";
import { saveProfileAction } from "@/lib/cms/actions";
import { useAdminToast } from "@/components/admin/toast";

export function AboutForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { toast } = useAdminToast();
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
          toast(result.error, "error");
          return;
        }
        toast("Profil kaydedildi.");
        router.refresh();
      }}
    >
      {profile.id && profile.id !== "local" ? (
        <input type="hidden" name="id" defaultValue={profile.id} />
      ) : null}
      <label className="admin-field">
        <span>Name</span>
        <input name="name" defaultValue={profile.name} />
      </label>
      <label className="admin-field">
        <span>Email</span>
        <input name="email" type="email" defaultValue={profile.email} />
      </label>
      <label className="admin-field">
        <span>GitHub</span>
        <input name="github_url" defaultValue={profile.githubUrl} />
      </label>
      <label className="admin-field">
        <span>LinkedIn</span>
        <input name="linkedin_url" defaultValue={profile.linkedinUrl} />
      </label>
      <label className="admin-field">
        <span>YouTube</span>
        <input name="youtube_url" defaultValue={profile.youtubeUrl} />
      </label>
      <p className="text-xs text-zinc-500">
        Headline ve bio metinleri Content bölümündeki Hero / About alanlarından yönetilir.
      </p>
      <button type="submit" className="admin-btn" disabled={saving}>
        Save
      </button>
    </form>
  );
}
