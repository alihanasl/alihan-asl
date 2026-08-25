export function actionError(message: string) {
  return { ok: false as const, error: message };
}

export function actionOk() {
  return { ok: true as const, error: null };
}

export { requireAdmin } from "@/lib/cms/auth";
