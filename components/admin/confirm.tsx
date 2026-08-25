"use client";

import { useAdminI18n } from "@/components/admin/admin-i18n";

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useAdminI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg"
      >
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="admin-btn-ghost" onClick={onCancel}>
            {t("common.dismiss")}
          </button>
          <button type="button" className="admin-btn-danger" onClick={onConfirm}>
            {confirmLabel ?? t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
