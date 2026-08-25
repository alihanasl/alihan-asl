export const MAX_MEDIA_BYTES = 4 * 1024 * 1024;
export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export const mediaExtension: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export function validateMediaFile(file: { type: string; size: number }) {
  if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
    return "mediaType";
  }
  if (file.size > MAX_MEDIA_BYTES) {
    return "mediaSize";
  }
  return null;
}
