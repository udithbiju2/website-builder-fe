import { Image, LayoutDashboard, Globe, Settings, UserCog } from "lucide-react";
import AppShell, { type ShellNavItem } from "./AppShell.tsx";

const CLIENT_NAV: ShellNavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", end: true },
  { label: "My websites", icon: Globe, to: "/websites", end: true },
  { label: "Media library", icon: Image, to: "/media" },
  { label: "Website settings", icon: Settings },
  { label: "Account settings", icon: UserCog },
];

export default function ClientLayout() {
  return <AppShell tone="light" nav={CLIENT_NAV} roleLabel="Client" />;
}
