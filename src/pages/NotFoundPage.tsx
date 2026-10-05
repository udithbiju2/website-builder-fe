import { buttonVariants } from "@heroui/styles";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="grid flex-1 place-items-center bg-canvas px-5 py-20">
      <div className="max-w-md text-center">
        <span className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
          <Compass className="size-6" aria-hidden />
        </span>
        <h1 className="text-2xl font-semibold text-ink">This page isn't available yet</h1>
        <p className="mt-3 text-ink-body">
          The page you're looking for doesn't exist or is still being built.
        </p>
        <Link to="/" className={`${buttonVariants()} mt-7`}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
