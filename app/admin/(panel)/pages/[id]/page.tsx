import { notFound } from "next/navigation";
import { getAdminBundle } from "@/lib/cms/admin-data";
import { PageStudio } from "@/components/admin/page-studio";

export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { layout, copy, profile } = await getAdminBundle();
  const page = layout.pages.find((item) => item.id === id);
  if (!page) {
    notFound();
  }

  return (
    <PageStudio layout={layout} copy={copy} profile={profile} pageId={id} />
  );
}
