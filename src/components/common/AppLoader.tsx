import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export const AppLoader: React.FC = () => (
  <div
    className="app-root app-loader"
    role="status"
    aria-label="Loading IconMuse"
  >
    <header className="app-loader__header" aria-label="IconMuse">
      <div className="app-loader__brand">
        <span className="app-loader__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4.5 19L11 5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M10 20L16.5 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M15.5 20.5L20.5 10" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" opacity="0.35" />
          </svg>
        </span>
        <span>iconmuse</span>
      </div>
    </header>

    <main className="app-loader__content" aria-live="polite">
      <div className="app-loader__panel">
        <div className="app-loader__eyebrow">
          <span className="app-loader__pulse" aria-hidden="true" />
          Loading catalog
        </div>
        <h1>Gathering your library.</h1>
        <p>
          Preparing icons and illustrations from the sources you use.
        </p>
        <div className="app-loader__track" aria-hidden="true">
          <span className="app-loader__bar" />
        </div>
      </div>
    </main>
  </div>
);

export const CatalogLoadError: React.FC<{ onRetry: () => void }> = ({
  onRetry,
}) => (
  <main className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFB] text-[#17171B]">
    <Card className="w-full max-w-sm rounded-2xl p-7 text-center">
      <CardContent className="p-0">
        <h1 className="text-base font-semibold m-0">
          The icon library didn’t load
        </h1>
        <p className="text-sm leading-relaxed text-[#777780] mt-2 mb-5">
          Check your connection and try loading the catalog again.
        </p>
        <Button onClick={onRetry}>Retry</Button>
      </CardContent>
    </Card>
  </main>
);
