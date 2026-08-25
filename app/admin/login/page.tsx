import { LoginForm } from "@/components/admin/login-form";
import { isAdminAuthConfigured } from "@/lib/cms/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <LoginForm
      error={params.error}
      next={params.next || "/admin"}
      configured={isAdminAuthConfigured()}
    />
  );
}
