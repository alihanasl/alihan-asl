import { getAdminBundle } from "@/lib/cms/admin-data";
import { PagesList } from "@/components/admin/pages-list";

export default async function AdminPagesPage() {
  const { layout } = await getAdminBundle();
  return <PagesList layout={layout} />;
}
