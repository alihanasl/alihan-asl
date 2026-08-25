import { getAdminBundle } from "@/lib/cms/admin-data";
import { SettingsForm } from "@/components/admin/settings-form";
import { isGitHubConfigured } from "@/lib/github/commit";
import { isAdminAuthConfigured } from "@/lib/cms/auth";

export default async function SettingsPage() {
  const { stats } = await getAdminBundle();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsForm
        stats={stats}
        githubConfigured={isGitHubConfigured()}
        authConfigured={isAdminAuthConfigured()}
      />
    </div>
  );
}
