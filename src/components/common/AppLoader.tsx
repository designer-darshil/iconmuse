import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { BrandLogo } from "./BrandLogo";

export const AppLoader: React.FC = () => (
  <div
    className="app-root app-loader"
    role="status"
    aria-label="Loading IconMuse"
  >
    <header className="app-loader__header" aria-label="IconMuse">
      <div className="app-loader__brand">
        <span className="app-loader__mark"><BrandLogo className="w-7 h-7 object-contain" /></span>
        <span>iconmuse</span>
      </div>
    </header>

    <main className="app-loader__content" aria-live="polite">
      <div className="app-loader__panel">
        <div className="app-loader__eyebrow">
          <span className="app-loader__pulse" aria-hidden="true" />
          Loading
        </div>
        <h1>Loading icons…</h1>
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
