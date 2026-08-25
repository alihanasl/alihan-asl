import { getAdminBundle } from "@/lib/cms/admin-data";
import { AboutForm } from "@/components/admin/about-form";

export default async function AboutPage() {
  const { profile } = await getAdminBundle();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">About</h1>
      <AboutForm profile={profile} />
    </div>
  );
}
