import { LayoutTemplate } from "lucide-react";
import { Link } from "react-router-dom";
import { env } from "../config/env.ts";

type BrandLogoProps = {
  tone?: "dark" | "light";
};

export default function BrandLogo({ tone = "dark" }: BrandLogoProps) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${
        tone === "dark" ? "text-ink" : "text-white"
      }`}
    >
      <span className="grid size-8 place-items-center rounded-md bg-brand text-white">
        <LayoutTemplate className="size-4.5" aria-hidden />
      </span>
      <span className="text-[17px]">{env.appName}</span>
    </Link>
  );
}
