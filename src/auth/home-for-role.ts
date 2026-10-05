import type { AuthUser } from "../api/auth.ts";

export function homeForRole(user: Pick<AuthUser, "role">): string {
  return user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
}
