import type { ReactNode } from "react";
import BrandLogo from "../components/BrandLogo.tsx";
import { env } from "../config/env.ts";

type AuthSplitLayoutProps = {
  heading: string;
  description: string;
  /** Extra content pinned to the bottom of the dark panel (e.g. sign-up steps). */
  aside?: ReactNode;
  children: ReactNode;
};

export default function AuthSplitLayout({ heading, description, aside, children }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-ink px-10 py-10 text-white lg:flex">
        <BrandLogo tone="light" />
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">{heading}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">{description}</p>
        </div>
        {aside ?? (
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {env.appName}
          </p>
        )}
      </aside>

      <main className="flex flex-col bg-surface px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <BrandLogo />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
