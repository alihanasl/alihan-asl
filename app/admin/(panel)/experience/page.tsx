import { getAdminBundle } from "@/lib/cms/admin-data";
import { ExperienceManager } from "@/components/admin/experience-manager";
import { AdminHeading } from "@/components/admin/page-header";

export default async function ExperiencePage() {
  const { experiences } = await getAdminBundle();

  return (
    <div>
      <AdminHeading titleKey="experience.title" />
      <ExperienceManager items={experiences} />
    </div>
  );
}
