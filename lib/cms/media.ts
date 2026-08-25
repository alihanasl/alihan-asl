export const MAX_MEDIA_BYTES = 4 * 1024 * 1024;
export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export function validateMediaFile(file: { type: string; size: number }) {
  if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
    return "Sadece JPEG, PNG, WebP, GIF veya AVIF yüklenebilir.";
  }
  if (file.size > MAX_MEDIA_BYTES) {
    return "Dosya 4 MB sınırını aşıyor.";
  }
  return null;
}
