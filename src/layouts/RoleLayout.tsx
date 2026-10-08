import { useAuth } from "../auth/auth-context.ts";
import AdminLayout from "./AdminLayout.tsx";
import ClientLayout from "./ClientLayout.tsx";

/** For pages shared by both roles: shows the sidebar of whoever is signed in. */
export default function RoleLayout() {
  const { user } = useAuth();
  return user?.role === "SUPER_ADMIN" ? <AdminLayout /> : <ClientLayout />;
}
