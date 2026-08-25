import Link from "next/link";
import { loginAction } from "@/lib/cms/actions";
import { isAdminAuthConfigured } from "@/lib/cms/auth";

const messages: Record<string, string> = {
  config:
    "ADMIN_USERNAME ve ADMIN_PASSWORD eksik. Bunları .env.local ve Vercel Environment Variables içine ekle.",
  credentials: "Kullanıcı adı veya şifre hatalı.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ? messages[params.error] || "Giriş yapılamadı." : null;
  const configured = isAdminAuthConfigured();

  return (
    <div className="admin-app flex min-h-svh items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Portfolio CMS
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">Admin giriş</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sadece yetkili hesap dashboard’u görür.
        </p>

        {error ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {!configured ? (
          <p className="mt-4 text-sm text-zinc-600">
            Admin girişi için Vercel’de ADMIN_USERNAME ve ADMIN_PASSWORD tanımla.
          </p>
        ) : (
          <form action={loginAction} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={params.next || "/admin"} />
            <label className="admin-field">
              <span>Kullanıcı adı</span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </label>
            <label className="admin-field">
              <span>Şifre</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" className="admin-btn w-full">
              Giriş
            </button>
          </form>
        )}

        <Link href="/" className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-800">
          Siteye dön
        </Link>
      </div>
    </div>
  );
}
