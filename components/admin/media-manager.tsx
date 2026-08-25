"use client";

import { useEffect, useState } from "react";
import {
  deleteMediaAction,
  getMediaAction,
  uploadMediaAction,
} from "@/lib/cms/actions";
import { ALLOWED_MEDIA_TYPES, MAX_MEDIA_BYTES } from "@/lib/cms/media";
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminToast } from "@/components/admin/toast";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import type { MediaItem } from "@/lib/cms/store";
import type { MediaUsageLabel } from "@/lib/cms/layout";

export function MediaManager({
  selectable = false,
  onSelect,
}: {
  selectable?: boolean;
  onSelect?: (url: string) => void;
}) {
  const { toast } = useAdminToast();
  const { t, contentLocale, errorText } = useAdminI18n();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [usage, setUsage] = useState<Record<string, MediaUsageLabel[]>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "uploading">("loading");
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    let active = true;
    getMediaAction().then((next) => {
      if (!active) return;
      setItems(next.items);
      setUsage(next.usage);
      setStatus("idle");
    });
    return () => {
      active = false;
    };
  }, []);

  async function refresh() {
    const next = await getMediaAction();
    setItems(next.items);
    setUsage(next.usage);
    setStatus("idle");
  }

  async function handleUpload(file: File) {
    setStatus("uploading");
    const form = new FormData();
    form.set("file", file);
    const result = await uploadMediaAction(form);
    setStatus("idle");
    if (!result.ok) {
      toast(errorText(result.error), "error");
      return;
    }
    toast(t("media.saved"));
    await refresh();
    if (selectable && result.item?.url) {
      onSelect?.(result.item.url);
    }
  }

  return (
    <div>
      <label className="admin-btn inline-flex cursor-pointer items-center">
        {status === "uploading" ? t("media.uploading") : t("media.upload")}
        <input
          type="file"
          accept={ALLOWED_MEDIA_TYPES.join(",")}
          className="hidden"
          disabled={status === "uploading"}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleUpload(file);
            event.target.value = "";
          }}
        />
      </label>
      <p className="mt-2 text-xs text-zinc-500">
        {t("media.limits", { mb: String(Math.round(MAX_MEDIA_BYTES / 1024 / 1024)) })}
      </p>

      {status === "loading" ? (
        <p className="mt-6 text-sm text-zinc-500">{t("media.loading")}</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">{t("media.empty")}</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.path} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt=""
                className={`aspect-[4/3] w-full object-cover ${selectable ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (selectable) onSelect?.(item.url);
                }}
              />
              <div className="space-y-2 p-2">
                <div className="flex items-center justify-between gap-2">
                  {selectable ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-zinc-800"
                      onClick={() => onSelect?.(item.url)}
                    >
                      {t("common.select")}
                    </button>
                  ) : (
                    <span className="truncate text-xs text-zinc-500">{item.name}</span>
                  )}
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => setPendingDelete(item)}
                  >
                    {t("common.delete")}
                  </button>
                </div>
                <p className="text-[11px] leading-snug text-zinc-500">
                  {(usage[item.url] ?? []).length
                    ? `${t("media.usedIn")} ${usage[item.url]
                        .map((entry) =>
                          contentLocale === "tr" ? entry.tr : entry.en,
                        )
                        .join(" · ")}`
                    : t("media.unused")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("media.deleteTitle")}
        body={t("media.deleteBody")}
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const result = await deleteMediaAction(pendingDelete.path);
          setPendingDelete(null);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("media.deleted"));
          await refresh();
        }}
      />
    </div>
  );
}

export function MediaPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const { t } = useAdminI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="mt-10 w-full max-w-3xl rounded-lg bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{t("media.picker")}</h2>
          <button type="button" className="admin-btn-ghost" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>
        <MediaManager
          selectable
          onSelect={(url) => {
            onSelect(url);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
