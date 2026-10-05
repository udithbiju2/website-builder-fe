import { buttonVariants } from "@heroui/styles";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Ready to build your website?
        </h2>
        <p className="mt-3 text-ink-body">Sign up and reach your dashboard in a few minutes.</p>
        <Link to="/signup" className={`${buttonVariants({ size: "lg" })} mt-7`}>
          Sign up free
        </Link>
      </div>
    </section>
  );
}
