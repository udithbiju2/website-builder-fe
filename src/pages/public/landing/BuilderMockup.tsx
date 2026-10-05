export default function BuilderMockup() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_12px_40px_-12px_rgba(26,29,35,0.18)]"
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
      </div>
      <div className="grid grid-cols-[30%_1fr]">
        <div className="space-y-2.5 border-r border-line p-4">
          <div className="h-2 w-4/5 rounded bg-line" />
          <div className="h-2 w-full rounded bg-line" />
          <div className="h-2 w-3/5 rounded bg-line" />
          <div className="h-2 w-4/5 rounded bg-line" />
          <div className="mt-4 h-2 w-2/3 rounded bg-brand/30" />
          <div className="h-2 w-1/2 rounded bg-line" />
        </div>
        <div className="space-y-3 p-4">
          <div className="flex h-28 flex-col justify-center gap-2 rounded-lg border-2 border-brand bg-brand-soft px-5">
            <div className="h-2.5 w-1/2 rounded bg-brand/40" />
            <div className="h-2 w-2/3 rounded bg-brand/20" />
            <div className="mt-1 h-5 w-16 rounded bg-brand/60" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 rounded-lg bg-canvas" />
            <div className="h-16 rounded-lg bg-canvas" />
            <div className="h-16 rounded-lg bg-canvas" />
          </div>
          <div className="h-11 rounded-lg bg-canvas" />
        </div>
      </div>
    </div>
  );
}
