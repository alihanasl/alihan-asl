import { getAdminBundle } from "@/lib/cms/admin-data";
import { SkillsManager } from "@/components/admin/skills-manager";

export default async function SkillsPage() {
  const { skills } = await getAdminBundle();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Skills</h1>
      <SkillsManager items={skills} />
    </div>
  );
}
