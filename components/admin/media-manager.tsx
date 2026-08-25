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
import type { MediaItem } from "@/lib/cms/store";

export function MediaManager({
  selectable = false,
  onSelect,
}: {
  selectable?: boolean;
  onSelect?: (url: string) => void;
}) {
  const { toast } = useAdminToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "uploading">("loading");
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    let active = true;
    getMediaAction().then((next) => {
      if (!active) return;
      setItems(next);
      setStatus("idle");
    });
    return () => {
      active = false;
    };
  }, []);

  async function refresh() {
    const next = await getMediaAction();
    setItems(next);
    setStatus("idle");
  }

  async function handleUpload(file: File) {
    setStatus("uploading");
    const form = new FormData();
    form.set("file", file);
    const result = await uploadMediaAction(form);
    setStatus("idle");
    if (!result.ok) {
      toast(result.error, "error");
      return;
    }
    toast("Görsel kaydedildi. Vercel deploy sonrası sitede görünür.");
    await refresh();
  }

  return (
    <div>
      <label className="admin-btn inline-flex cursor-pointer items-center">
        {status === "uploading" ? "Yükleniyor…" : "Görsel yükle"}
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
        JPEG, PNG, WebP, GIF, AVIF · en fazla {Math.round(MAX_MEDIA_BYTES / 1024 / 1024)} MB.
        Dosyalar public/uploads altına commit edilir.
      </p>

      {status === "loading" ? (
        <p className="mt-6 text-sm text-zinc-500">Medya yükleniyor…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">Henüz görsel yok.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.path} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-2">
                {selectable ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-zinc-800"
                    onClick={() => onSelect?.(item.url)}
                  >
                    Seç
                  </button>
                ) : (
                  <span className="truncate text-xs text-zinc-500">{item.name}</span>
                )}
                <button
                  type="button"
                  className="text-xs text-red-600"
                  onClick={() => setPendingDelete(item)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Görseli sil"
        body="Bu görsel depodan silinecek. Projelerde kullanılıyorsa bağlantı kırılır."
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const result = await deleteMediaAction(pendingDelete.path);
          setPendingDelete(null);
          if (!result.ok) {
            toast(result.error, "error");
            return;
          }
          toast("Görsel silindi.");
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="mt-10 w-full max-w-3xl rounded-lg bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Medya</h2>
          <button type="button" className="admin-btn-ghost" onClick={onClose}>
            Kapat
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
