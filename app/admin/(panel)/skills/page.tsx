import { getAdminBundle } from "@/lib/cms/admin-data";
import { SkillsManager } from "@/components/admin/skills-manager";
import { AdminHeading } from "@/components/admin/page-header";

export default async function SkillsPage() {
  const { skills } = await getAdminBundle();

  return (
    <div>
      <AdminHeading titleKey="skills.title" />
      <SkillsManager items={skills} />
    </div>
  );
}
