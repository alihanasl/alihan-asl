import { getAdminBundle } from "@/lib/cms/admin-data";
import { ContentForm } from "@/components/admin/content-form";
import { AdminHeading } from "@/components/admin/page-header";

export default async function ContentPage() {
  const { copy, experiments } = await getAdminBundle();

  return (
    <div>
      <AdminHeading titleKey="content.title" />
      <ContentForm copy={copy} experiments={experiments} />
    </div>
  );
}
