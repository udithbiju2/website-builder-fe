import { buttonVariants } from "@heroui/styles";
import { Link } from "react-router-dom";
import BuilderMockup from "./BuilderMockup.tsx";

export default function HeroSection() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
            Website builder
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Build your business website by hand or with AI
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-body">
            Pick a template and edit every section yourself, or describe what you need and let AI
            create the first draft. Preview on any device and publish when you are ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className={buttonVariants({ size: "lg" })}>
              Create your account
            </Link>
            <a href="#how-it-works" className={buttonVariants({ size: "lg", variant: "outline" })}>
              See how it works
            </a>
          </div>
        </div>
        <BuilderMockup />
      </div>
    </section>
  );
}
