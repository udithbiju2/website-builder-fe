import { Outlet } from "react-router-dom";
import SiteFooter from "../components/public/SiteFooter.tsx";
import SiteHeader from "../components/public/SiteHeader.tsx";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
