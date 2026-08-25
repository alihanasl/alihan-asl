import { AdminShell } from "@/components/admin/shell";
import { AdminToastProvider } from "@/components/admin/toast";
import { requireAdmin } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username } = await requireAdmin();

  return (
    <AdminToastProvider>
      <AdminShell username={username}>{children}</AdminShell>
    </AdminToastProvider>
  );
}
