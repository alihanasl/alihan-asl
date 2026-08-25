import { getAdminBundle } from "@/lib/cms/admin-data";
import { ContentForm } from "@/components/admin/content-form";

export default async function ContentPage() {
  const { copy, experiments } = await getAdminBundle();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Content</h1>
      <ContentForm copy={copy} experiments={experiments} />
    </div>
  );
}
