type Step = {
  title: string;
  description: string;
};

const steps: readonly Step[] = [
  { title: "Sign up", description: "Create your account and verify your email." },
  { title: "Create a website", description: "Choose the manual builder or the AI builder." },
  { title: "Customize", description: "Edit pages, sections and content, or ask AI." },
  { title: "Publish", description: "Go live on your domain when you are ready." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">How it works</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-mono text-sm font-medium text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-body">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
