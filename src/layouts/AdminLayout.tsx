import {
  Globe,
  Image,
  LayoutTemplate,
  Mail,
  PanelsTopLeft,
  Rows3,
  Server,
  Users,
} from "lucide-react";
import AppShell, { type ShellNavItem } from "./AppShell.tsx";

const ADMIN_NAV: ShellNavItem[] = [
  { label: "Clients", icon: Users, to: "/admin", end: true, activePrefixes: ["/admin/clients"] },
  { label: "All websites", icon: Globe, to: "/admin/websites" },
  { label: "Templates and themes", icon: LayoutTemplate },
  { label: "Headers and footers", icon: PanelsTopLeft },
  { label: "Reusable sections", icon: Rows3, to: "/admin/sections" },
  { label: "Domains", icon: Server },
  { label: "Media", icon: Image },
  { label: "Email settings", icon: Mail, to: "/admin/settings/email" },
];

export default function AdminLayout() {
  return <AppShell tone="dark" nav={ADMIN_NAV} roleLabel="Super Admin" caption="Super Admin" />;
}
