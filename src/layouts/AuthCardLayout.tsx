import type { ReactNode } from "react";
import BrandLogo from "../components/BrandLogo.tsx";

export default function AuthCardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-canvas px-5 py-12">
      <BrandLogo />
      <main className="mt-8 w-full max-w-md rounded-xl border border-line bg-surface p-7 shadow-sm sm:p-8">
        {children}
      </main>
    </div>
  );
}
