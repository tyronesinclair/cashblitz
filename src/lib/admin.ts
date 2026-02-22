import { auth } from "./auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const role = (session.user as Record<string, unknown>).role;
  if (role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}
