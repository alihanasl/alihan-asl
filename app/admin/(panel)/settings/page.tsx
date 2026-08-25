import { getAdminBundle } from "@/lib/cms/admin-data";
import { SettingsForm } from "@/components/admin/settings-form";
import { isGitHubConfigured } from "@/lib/github/commit";
import { isAdminAuthConfigured } from "@/lib/cms/auth";
import { AdminHeading } from "@/components/admin/page-header";

export default async function SettingsPage() {
  const { stats } = await getAdminBundle();

  return (
    <div>
      <AdminHeading titleKey="settings.title" />
      <SettingsForm
        stats={stats}
        githubConfigured={isGitHubConfigured()}
        authConfigured={isAdminAuthConfigured()}
      />
    </div>
  );
}
