import React from "react";
import { ArrowLeft } from "lucide-react";
import { Badge } from "../ui/badge";

export const NotFoundPage: React.FC = () => (
  <main className="min-h-screen bg-background text-foreground flex flex-col">
    <header className="h-16 shrink-0 px-5 md:px-8 border-b border-[#E7E7EA] flex items-center">
      <a
        href="/"
        aria-label="Iconmuse home"
        className="flex items-center gap-2.5"
      >
        <span className="w-8 h-8 rounded-[10px] bg-[#F7F7F8] border border-[#E7E7EA] flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 19L11 5"
              stroke="#7141E8"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M10 20L16.5 6"
              stroke="#0F1116"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M15.5 20.5L20.5 10"
              stroke="#0F1116"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>
        </span>
        <span className="text-[18px] font-bold tracking-tight lowercase">
          iconmuse
        </span>
        <Badge
          variant="secondary"
          className="h-5 border-primary/20 bg-primary/10 px-1.5 text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          Beta
        </Badge>
      </a>
    </header>
    <section className="flex-1 min-h-0 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px]">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#7141E8] uppercase mb-3">
          404 · Page not found
        </p>
        <h1 className="text-2xl md:text-[28px] leading-tight font-semibold tracking-tight m-0">
          This page isn’t in the library.
        </h1>
        <p className="mt-3 mb-0 text-sm leading-relaxed text-[#777780]">
          The link may be outdated, or the address may have been entered
          incorrectly.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to icon library
        </a>
      </div>
    </section>
  </main>
);
