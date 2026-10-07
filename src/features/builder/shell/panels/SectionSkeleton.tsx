import type { SectionPreset } from "../../../../site-kit/index.ts";

export function SectionSkeleton({ preset }: { preset: SectionPreset }) {
  switch (preset.key) {
    case "header-logo-left":
      return (
        <div className="flex h-full w-full items-center justify-between px-2">
          <div className="h-2 w-7 rounded-sm bg-zinc-400 dark:bg-zinc-500" />
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2 w-4 rounded-sm bg-brand/70" />
          </div>
        </div>
      );

    case "header-centered":
      return (
        <div className="flex h-full w-full items-center justify-between px-2">
          <div className="flex items-center gap-1">
            <div className="h-1 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="h-2.5 w-8 rounded-sm bg-zinc-400 dark:bg-zinc-500" />
          <div className="flex items-center gap-1">
            <div className="h-1 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1.5 w-3 rounded-sm bg-brand/70" />
          </div>
        </div>
      );

    case "footer-columns":
      return (
        <div className="flex h-full w-full flex-col justify-between p-2">
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="h-1.5 w-3/4 rounded-xs bg-zinc-400 dark:bg-zinc-500" />
                <div className="h-1 w-full rounded-xs bg-zinc-300 dark:bg-zinc-600" />
                <div className="h-1 w-2/3 rounded-xs bg-zinc-300 dark:bg-zinc-600" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-zinc-200/80 pt-1 dark:border-zinc-700/60">
            <div className="h-1 w-8 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-12 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
        </div>
      );

    case "footer-simple":
      return (
        <div className="flex h-full w-full items-center justify-between px-3">
          <div className="h-2 w-8 rounded-sm bg-zinc-400 dark:bg-zinc-500" />
          <div className="h-1 w-16 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="flex gap-1">
            <div className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
        </div>
      );

    case "hero-centered":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center">
          <div className="h-1 w-6 rounded-full bg-brand/60" />
          <div className="h-2.5 w-24 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
          <div className="h-1 w-32 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="mt-1 flex items-center gap-1">
            <div className="h-2 w-6 rounded-sm bg-brand" />
            <div className="h-2 w-6 rounded-sm border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800" />
          </div>
        </div>
      );

    case "hero-split":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 px-2">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-14 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
            <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-4/5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="mt-0.5 h-2 w-6 rounded-sm bg-brand" />
          </div>
          <div className="flex h-10 w-full items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-200/60 dark:border-zinc-700 dark:bg-zinc-700/40">
            <div className="size-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
        </div>
      );

    case "hero-banner":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm bg-brand/15 p-2 text-center">
          <div className="h-2.5 w-24 rounded-xs bg-brand dark:bg-brand-soft" />
          <div className="h-1 w-28 rounded-full bg-brand/50" />
          <div className="mt-1 h-2 w-8 rounded-sm bg-brand" />
        </div>
      );

    case "features-3":
      return (
        <div className="grid h-full w-full grid-cols-3 items-center gap-1.5 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 rounded-sm border border-zinc-200/60 bg-white/70 p-1 text-center dark:border-zinc-700/40 dark:bg-zinc-800/60">
              <div className="size-2 rounded-full bg-brand/70" />
              <div className="h-1.5 w-3/4 rounded-xs bg-zinc-400 dark:bg-zinc-400" />
              <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "features-4-surface":
      return (
        <div className="grid h-full w-full grid-cols-4 items-center gap-1 rounded-sm bg-zinc-200/40 p-1.5 dark:bg-zinc-800/40">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 text-center">
              <div className="size-1.5 rounded-full bg-brand" />
              <div className="h-1 w-3/4 rounded-xs bg-zinc-400 dark:bg-zinc-400" />
              <div className="h-0.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "services-bento":
      return (
        <div className="grid h-full w-full grid-cols-5 items-stretch gap-1.5 p-2">
          <div className="col-span-3 flex flex-col justify-between rounded-sm border border-brand/40 bg-white p-1.5 dark:bg-zinc-800">
            <div className="h-1.5 w-1/2 rounded-xs bg-brand" />
            <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-3/4 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <div className="flex-1 rounded-sm border border-zinc-200/80 bg-white p-1 dark:border-zinc-700/60 dark:bg-zinc-800" />
            <div className="flex-1 rounded-sm border border-zinc-200/80 bg-white p-1 dark:border-zinc-700/60 dark:bg-zinc-800" />
          </div>
        </div>
      );

    case "services-split":
      return (
        <div className="grid h-full w-full grid-cols-5 items-center gap-2 p-2">
          <div className="col-span-2 flex flex-col gap-1">
            <div className="h-2 w-4/5 rounded-xs bg-zinc-600 dark:bg-zinc-200" />
            <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="mt-1 h-2 w-8 rounded-xs bg-brand" />
          </div>
          <div className="col-span-3 flex flex-col gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-sm border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="h-1 w-1/2 rounded-full bg-zinc-400" />
                <div className="size-1.5 rounded-full bg-brand" />
              </div>
            ))}
          </div>
        </div>
      );

    case "services-interactive":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`flex items-center justify-between rounded-sm border p-1 ${i === 0 ? "border-brand bg-brand-soft/20 dark:bg-brand-soft/10" : "border-zinc-200/60 bg-white dark:border-zinc-700/50 dark:bg-zinc-800"}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-bold text-zinc-400">0{i + 1}</span>
                <div className="h-1 w-14 rounded-full bg-zinc-500" />
              </div>
              <div className="size-1.5 rounded-full bg-brand" />
            </div>
          ))}
        </div>
      );

    case "services-horizontal":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1.5 p-2">
          {[0, 1].map((i) => (
            <div key={i} className="grid grid-cols-4 items-center gap-1 rounded-sm border border-zinc-200/80 bg-white p-1 dark:border-zinc-700/60 dark:bg-zinc-800">
              <div className="col-span-1 h-3.5 rounded-xs bg-zinc-200 dark:bg-zinc-700" />
              <div className="col-span-3 flex flex-col gap-0.5">
                <div className="h-1 w-2/3 rounded-full bg-zinc-600 dark:bg-zinc-300" />
                <div className="h-0.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
              </div>
            </div>
          ))}
        </div>
      );

    case "services-editorial":
      return (
        <div className="grid h-full w-full grid-cols-3 items-center gap-1.5 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-1 border-t-2 border-brand/60 pt-1">
              <span className="text-[8px] font-black text-brand">0{i + 1}</span>
              <div className="h-1 w-full rounded-full bg-zinc-500" />
              <div className="h-0.5 w-3/4 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "services-grid":
      return (
        <div className="grid h-full w-full grid-cols-3 items-center gap-1.5 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-1 rounded-sm border border-zinc-200/80 bg-white p-1 dark:border-zinc-700/60 dark:bg-zinc-800">
              <div className="h-1.5 w-2/3 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
              <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <div className="h-1 w-4/5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "services-links":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 p-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-1 rounded-sm border border-zinc-200/80 bg-white p-1.5 dark:border-zinc-700/60 dark:bg-zinc-800">
              <div className="h-2 w-3/4 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
              <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <div className="mt-0.5 h-1 w-6 rounded-full bg-brand" />
            </div>
          ))}
        </div>
      );

    case "testimonials":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm bg-zinc-200/40 p-2 text-center dark:bg-zinc-800/40">
          <div className="h-1 w-28 rounded-full bg-zinc-400 dark:bg-zinc-400" />
          <div className="h-1 w-20 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="mt-1 flex items-center gap-1">
            <div className="size-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <div className="h-1 w-8 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          </div>
        </div>
      );

    case "faq-accordion":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 px-3 py-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-sm border px-1.5 py-1 ${
                i === 0
                  ? "border-zinc-800 bg-zinc-100 dark:border-zinc-200 dark:bg-zinc-800"
                  : "border-zinc-200/80 bg-white dark:border-zinc-700/60 dark:bg-zinc-900"
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <div className="h-1 w-20 rounded-full bg-zinc-600 dark:bg-zinc-300" />
                {i === 0 && <div className="h-0.5 w-24 rounded-full bg-zinc-400 dark:bg-zinc-500" />}
              </div>
              <div className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-400" />
            </div>
          ))}
        </div>
      );

    case "faq-grid":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-1.5 p-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-0.5 rounded-sm border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="h-1 w-12 rounded-xs bg-zinc-600 dark:bg-zinc-300" />
              <div className="h-0.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "faq-split":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 p-2">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-14 rounded-xs bg-zinc-800 dark:bg-zinc-100" />
            <div className="h-1 w-18 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <div className="mt-1 h-3 w-full rounded-xs border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 p-0.5" />
          </div>
          <div className="flex flex-col gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xs border border-zinc-200 bg-white px-1 py-0.5 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="h-1 w-12 rounded-full bg-zinc-500 dark:bg-zinc-300" />
                <div className="size-1 rounded-full bg-zinc-400" />
              </div>
            ))}
          </div>
        </div>
      );

    case "faq-minimal":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 px-3 py-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-zinc-200/80 py-0.5 dark:border-zinc-700"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-bold text-zinc-400">0{i + 1}</span>
                <div className="h-1 w-20 rounded-full bg-zinc-600 dark:bg-zinc-300" />
              </div>
              <span className="text-[8px] text-zinc-400">+</span>
            </div>
          ))}
        </div>
      );

    case "faq-cards":
      return (
        <div className="grid h-full w-full grid-cols-3 items-stretch gap-1 p-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-sm border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="h-1 w-6 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <div className="h-1.5 w-full rounded-xs bg-zinc-700 dark:bg-zinc-200" />
              <div className="h-1 w-3/4 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "faq":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 px-3 py-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-sm border border-zinc-200/80 bg-white px-1.5 py-0.5 dark:border-zinc-700/60 dark:bg-zinc-800">
              <div className="h-1 w-16 rounded-full bg-zinc-400 dark:bg-zinc-400" />
              <div className="size-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "cta-centered":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-sm border border-zinc-200/80 bg-zinc-50 p-2 text-center dark:border-zinc-700/60 dark:bg-zinc-850">
          <div className="h-1 w-12 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          <div className="h-2 w-28 rounded-xs bg-zinc-800 dark:bg-zinc-100" />
          <div className="h-1 w-36 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          <div className="mt-0.5 flex items-center gap-1">
            <div className="h-2 w-8 rounded-xs bg-zinc-800 dark:bg-zinc-200" />
            <div className="h-2 w-7 rounded-xs border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800" />
          </div>
        </div>
      );

    case "cta-split":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 p-2">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-20 rounded-xs bg-zinc-800 dark:bg-zinc-100" />
            <div className="h-1 w-24 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <div className="h-2 w-10 rounded-xs bg-zinc-700 dark:bg-zinc-200" />
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5 rounded-sm border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-800 shadow-2xs">
            <div className="h-2.5 w-12 rounded-xs bg-zinc-800 dark:bg-zinc-100" />
            <div className="h-0.5 w-14 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          </div>
        </div>
      );

    case "cta-floating":
      return (
        <div className="flex h-full w-full items-center justify-center p-2">
          <div className="flex w-full flex-col items-center justify-center gap-1 rounded-sm border border-zinc-300 bg-white/80 p-2 text-center backdrop-blur-xs dark:border-zinc-600 dark:bg-zinc-800/80 shadow-xs">
            <div className="h-2 w-24 rounded-xs bg-zinc-800 dark:bg-zinc-100" />
            <div className="h-1 w-32 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <div className="h-2 w-10 rounded-xs bg-zinc-800 dark:bg-zinc-200" />
          </div>
        </div>
      );

    case "cta-editorial":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 border-y border-zinc-200 px-2 py-1.5 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="h-2 w-24 rounded-xs bg-zinc-800 dark:bg-zinc-100" />
            <div className="h-2 w-8 rounded-xs bg-zinc-700 dark:bg-zinc-200" />
          </div>
          <div className="h-1 w-32 rounded-full bg-zinc-400 dark:bg-zinc-500" />
        </div>
      );

    case "cta-banner":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm bg-brand/15 p-2 text-center">
          <div className="h-2 w-20 rounded-xs bg-brand dark:bg-brand-soft" />
          <div className="h-1 w-28 rounded-full bg-brand/50" />
          <div className="mt-0.5 h-2 w-8 rounded-sm bg-brand" />
        </div>
      );

    case "cta-light":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm border border-zinc-200 bg-white p-2 text-center dark:border-zinc-700 dark:bg-zinc-800">
          <div className="h-2 w-20 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
          <div className="h-1 w-28 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="mt-0.5 h-2 w-7 rounded-sm bg-brand" />
        </div>
      );

    case "contact-form":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 p-2">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-10 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
            <div className="flex items-center gap-1">
              <div className="size-1.5 rounded-full bg-brand" />
              <div className="h-1 w-8 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
            <div className="flex items-center gap-1">
              <div className="size-1.5 rounded-full bg-brand" />
              <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 rounded-sm border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="h-1.5 w-full rounded-xs bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-xs bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-1.5 w-5 self-end rounded-xs bg-brand" />
          </div>
        </div>
      );

    case "contact-details":
      return (
        <div className="grid h-full w-full grid-cols-3 items-center gap-1.5 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 rounded-sm border border-zinc-200 bg-white p-1 text-center dark:border-zinc-700 dark:bg-zinc-800">
              <div className="size-2 rounded-full bg-brand/70" />
              <div className="h-1 w-3/4 rounded-xs bg-zinc-400 dark:bg-zinc-400" />
              <div className="h-0.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "text":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 px-3 py-2">
          <div className="h-2.5 w-20 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
          <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-1 w-11/12 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div className="h-1 w-3/4 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      );

    case "gallery-3":
      return (
        <div className="grid h-full w-full grid-cols-3 items-center gap-1.5 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex h-9 w-full items-center justify-center rounded-sm bg-zinc-200 dark:bg-zinc-700">
              <div className="size-2 rounded-xs bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "gallery-4":
      return (
        <div className="grid h-full w-full grid-cols-4 items-center gap-1 p-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex h-8 w-full items-center justify-center rounded-sm bg-zinc-200 dark:bg-zinc-700">
              <div className="size-1.5 rounded-xs bg-zinc-300 dark:bg-zinc-600" />
            </div>
          ))}
        </div>
      );

    case "logos":
      return (
        <div className="flex h-full w-full items-center justify-center gap-1.5 px-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-6 rounded-xs bg-zinc-300 dark:bg-zinc-600" />
          ))}
        </div>
      );

    case "stats":
      return (
        <div className="grid h-full w-full grid-cols-3 items-center gap-1.5 rounded-sm bg-zinc-200/40 p-2 text-center dark:bg-zinc-800/40">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="h-2.5 w-6 rounded-xs bg-brand dark:bg-brand-soft" />
              <div className="h-1 w-8 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </div>
          ))}
        </div>
      );

    case "split-right":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 px-2">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-12 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
            <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-3/4 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1.5 w-5 rounded-xs bg-brand" />
          </div>
          <div className="h-10 w-full rounded-sm bg-zinc-200 dark:bg-zinc-700" />
        </div>
      );

    case "split-left":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 px-2">
          <div className="h-10 w-full rounded-sm bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex flex-col gap-1">
            <div className="h-2 w-12 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
            <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-3/4 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1.5 w-5 rounded-xs bg-brand" />
          </div>
        </div>
      );

    case "pricing-cards":
      return (
        <div className="grid h-full w-full grid-cols-3 items-stretch gap-1 p-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex flex-col justify-between rounded-sm border p-1 ${
                i === 1
                  ? "border-zinc-800 bg-zinc-100 dark:border-zinc-200 dark:bg-zinc-800 shadow-xs"
                  : "border-zinc-200/80 bg-white dark:border-zinc-700/60 dark:bg-zinc-900"
              }`}
            >
              <div className="h-1 w-2/3 rounded-xs bg-zinc-400 dark:bg-zinc-400" />
              <div className="h-2 w-1/2 rounded-xs bg-zinc-700 dark:bg-zinc-200 font-bold" />
              <div className="flex flex-col gap-0.5">
                <div className="h-0.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="h-0.5 w-4/5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <div className="h-1.5 w-full rounded-xs bg-zinc-700 dark:bg-zinc-300" />
            </div>
          ))}
        </div>
      );

    case "pricing-minimal":
      return (
        <div className="grid h-full w-full grid-cols-3 items-stretch gap-1.5 p-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex flex-col justify-between border-t-2 ${
                i === 1 ? "border-zinc-800 dark:border-zinc-100" : "border-zinc-300 dark:border-zinc-600"
              } pt-1`}
            >
              <span className="text-[7px] font-bold text-zinc-400">0{i + 1}</span>
              <div className="h-1.5 w-3/4 rounded-xs bg-zinc-600 dark:bg-zinc-300" />
              <div className="h-2 w-1/2 rounded-xs bg-zinc-800 dark:bg-zinc-100" />
              <div className="h-1 w-full rounded-xs bg-zinc-400/40" />
            </div>
          ))}
        </div>
      );

    case "pricing-spotlight":
      return (
        <div className="grid h-full w-full grid-cols-3 items-center gap-1 p-1.5">
          <div className="flex flex-col gap-1 rounded-sm border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="h-1 w-2/3 rounded-xs bg-zinc-400" />
            <div className="h-1.5 w-1/2 rounded-xs bg-zinc-500" />
          </div>
          <div className="flex scale-105 flex-col gap-1 rounded-sm border-2 border-zinc-800 bg-zinc-100 p-1.5 dark:border-zinc-100 dark:bg-zinc-800 shadow-xs z-10">
            <div className="h-1 w-2/3 rounded-xs bg-zinc-700 dark:bg-zinc-200" />
            <div className="h-2.5 w-3/4 rounded-xs bg-zinc-800 dark:bg-zinc-100" />
            <div className="h-1.5 w-full rounded-xs bg-zinc-700 dark:bg-zinc-200" />
          </div>
          <div className="flex flex-col gap-1 rounded-sm border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="h-1 w-2/3 rounded-xs bg-zinc-400" />
            <div className="h-1.5 w-1/2 rounded-xs bg-zinc-500" />
          </div>
        </div>
      );

    case "pricing-enterprise":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1.5 p-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-sm border border-zinc-200 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex flex-col gap-0.5">
                <div className="h-1.5 w-10 rounded-xs bg-zinc-600 dark:bg-zinc-300" />
                <div className="h-1 w-14 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="h-0.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <div className="h-0.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-6 rounded-xs bg-zinc-700 dark:bg-zinc-200" />
                <div className="h-1.5 w-4 rounded-xs bg-zinc-700 dark:bg-zinc-300" />
              </div>
            </div>
          ))}
        </div>
      );

    case "pricing":
      return (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 p-2">
          <div className="flex flex-col gap-1 rounded-sm border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="h-1.5 w-8 rounded-xs bg-zinc-400 dark:bg-zinc-400" />
            <div className="h-2.5 w-6 rounded-xs bg-zinc-500 dark:bg-zinc-300" />
            <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-4/5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex flex-col gap-1 rounded-sm border border-zinc-800 bg-zinc-100 p-1 dark:border-zinc-200 dark:bg-zinc-800">
            <div className="h-1.5 w-8 rounded-xs bg-zinc-800 dark:bg-zinc-200" />
            <div className="h-2.5 w-6 rounded-xs bg-zinc-800 dark:bg-zinc-200" />
            <div className="h-1 w-full rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <div className="h-1 w-4/5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          </div>
        </div>
      );

    case "media-image":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2">
          <div className="flex h-8 w-full items-center justify-center rounded-sm bg-zinc-200 dark:bg-zinc-700">
            <div className="size-3 rounded-xs bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="h-1 w-14 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      );

    case "media-video":
      return (
        <div className="flex h-full w-full items-center justify-center p-2">
          <div className="flex h-9 w-full items-center justify-center rounded-sm bg-zinc-900 text-white dark:bg-zinc-800">
            <div className="size-3 rounded-full border border-white/50 flex items-center justify-center">
              <div className="ml-0.5 size-0 border-y-[2.5px] border-y-transparent border-l-4 border-l-white" />
            </div>
          </div>
        </div>
      );

    case "team":
      return (
        <div className="grid h-full w-full grid-cols-3 items-center gap-1.5 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 text-center">
              <div className="size-4 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <div className="h-1 w-3/4 rounded-xs bg-zinc-400 dark:bg-zinc-300" />
              <div className="h-0.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-500" />
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2">
          <div className="h-2 w-16 rounded-xs bg-zinc-400 dark:bg-zinc-500" />
          <div className="h-1 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      );
  }
}
