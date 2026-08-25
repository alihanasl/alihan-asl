import { getAdminBundle } from "@/lib/cms/admin-data";
import { AboutForm } from "@/components/admin/about-form";
import { AdminHeading } from "@/components/admin/page-header";

export default async function AboutPage() {
  const { profile } = await getAdminBundle();

  return (
    <div>
      <AdminHeading titleKey="about.title" />
      <AboutForm profile={profile} />
    </div>
  );
}
