import { cookies, headers } from "next/headers";
import { detectLocale, localeCookie, type Locale } from "@/lib/i18n/config";

export async function getRequestLocale(): Promise<Locale> {
  const stored = (await cookies()).get(localeCookie)?.value;
  const acceptLanguage = (await headers()).get("accept-language");
  return detectLocale(stored, acceptLanguage);
}
