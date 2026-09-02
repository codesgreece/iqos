import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export const CART_SESSION_COOKIE = "fba_session_id";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getCartIdentity() {
  const session = await auth();
  if (session?.user?.id) {
    return { userId: session.user.id, sessionId: null as string | null };
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value ?? null;
  return { userId: null as string | null, sessionId };
}

export async function ensureGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (existing) return existing;

  const sessionId = uuidv4();
  cookieStore.set(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return sessionId;
}

export async function requireAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}
