import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

const COOKIE = "mrn_admin_session";
const MAX_AGE = 8 * 60 * 60;

function signature(value: string) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not configured");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminSession() {
  const issued = Math.floor(Date.now() / 1000).toString();
  return `${issued}.${signature(issued)}`;
}

export function isAdminRequest(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE)?.value;
    if (!token) return false;
    const [issued, supplied] = token.split(".");
    if (!issued || !supplied || !/^\\d+$/.test(issued)) return false;
    const age = Math.floor(Date.now() / 1000) - Number(issued);
    if (age < 0 || age > MAX_AGE) return false;
    const expected = signature(issued);
    const a = Buffer.from(supplied, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const adminCookieName = COOKIE;
export const adminCookieMaxAge = MAX_AGE;
