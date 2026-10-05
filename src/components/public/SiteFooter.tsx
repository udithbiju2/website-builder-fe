import BrandLogo from "../BrandLogo.tsx";
import { env } from "../../config/env.ts";
import { footerNav } from "./navigation.ts";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <BrandLogo tone="light" />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {footerNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-white/70 transition-colors hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-white/60">
          © {year} {env.appName}
        </p>
      </div>
    </footer>
  );
}
