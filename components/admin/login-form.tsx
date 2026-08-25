"use client";

import Link from "next/link";
import { loginAction } from "@/lib/cms/actions";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { AdminPanelLangOnly } from "@/components/admin/lang-bar";

export function LoginForm({
  error,
  next,
  configured,
}: {
  error?: string;
  next: string;
  configured: boolean;
}) {
  const { t } = useAdminI18n();
  const message =
    error === "config"
      ? t("login.errorConfig")
      : error === "credentials"
        ? t("login.errorCredentials")
        : error === "locked"
          ? t("login.errorLocked")
          : error
            ? t("login.errorGeneric")
            : null;

  return (
    <div className="admin-app flex min-h-svh items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {t("login.kicker")}
          </p>
          <AdminPanelLangOnly />
        </div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          {t("login.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{t("login.lead")}</p>

        {message ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {message}
          </p>
        ) : null}

        {!configured ? (
          <p className="mt-4 text-sm text-zinc-600">{t("login.missingEnv")}</p>
        ) : (
          <form action={loginAction} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="admin-field">
              <span>{t("login.username")}</span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </label>
            <label className="admin-field">
              <span>{t("login.password")}</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" className="admin-btn w-full">
              {t("login.submit")}
            </button>
          </form>
        )}

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-800"
        >
          {t("login.back")}
        </Link>
      </div>
    </div>
  );
}
