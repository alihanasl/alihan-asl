const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, { count: number; resetAt: number }>();

export function clientIp(headersList: Headers) {
  const forwarded = headersList.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headersList.get("x-real-ip")?.trim() || "unknown";
}

export function isLoginLocked(ip: string) {
  const row = attempts.get(ip);
  if (!row) {
    return false;
  }
  if (Date.now() > row.resetAt) {
    attempts.delete(ip);
    return false;
  }
  return row.count >= MAX_ATTEMPTS;
}

export function recordLoginFailure(ip: string) {
  const now = Date.now();
  const row = attempts.get(ip);
  if (!row || now > row.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  row.count += 1;
}

export function clearLoginFailures(ip: string) {
  attempts.delete(ip);
}
