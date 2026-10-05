function Bar({ className }: { className: string }) {
  return <span className={`block rounded-ed-sm bg-ed-hover motion-safe:animate-pulse ${className}`} />;
}

export default function EditorSkeleton({ label = "Loading editor" }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="ed-root flex h-dvh flex-col bg-ed-app">
      <div className="flex h-12 items-center gap-3 border-b border-ed-border bg-ed-panel px-3">
        <Bar className="h-5 w-5" />
        <Bar className="h-3.5 w-48" />
        <span className="flex-1" />
        <Bar className="h-7 w-24" />
        <Bar className="h-7 w-20" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex w-13 flex-col items-center gap-2 border-r border-ed-border bg-ed-panel py-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Bar key={index} className="size-8" />
          ))}
        </div>
        <div className="flex-1 p-6">
          <div className="mx-auto flex h-full max-w-5xl flex-col gap-4 rounded-ed-lg border border-ed-border bg-ed-panel p-8">
            <Bar className="h-6 w-1/3" />
            <Bar className="h-40 w-full" />
            <Bar className="h-4 w-2/3" />
            <Bar className="h-4 w-1/2" />
          </div>
        </div>
        <div className="w-80 border-l border-ed-border bg-ed-panel p-4">
          <Bar className="mb-3 h-4 w-24" />
          <Bar className="mb-2 h-8 w-full" />
          <Bar className="h-8 w-full" />
        </div>
      </div>
      <span className="sr-only">{label}…</span>
    </div>
  );
}
