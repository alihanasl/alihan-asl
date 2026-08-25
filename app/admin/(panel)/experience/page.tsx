import { getAdminBundle } from "@/lib/cms/admin-data";
import { ExperienceManager } from "@/components/admin/experience-manager";

export default async function ExperiencePage() {
  const { experiences } = await getAdminBundle();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Experience</h1>
      <ExperienceManager items={experiences} />
    </div>
  );
}
