import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { enableGoogleAnalytics } from "../../utils/googleAnalytics";

const CONSENT_KEY = "iconmuse_analytics_consent";

type ConsentChoice = "granted" | "denied";

function readChoice(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export const AnalyticsConsent: React.FC<{ measurementId?: string }> = ({
  measurementId,
}) => {
  const [choice, setChoice] = useState<ConsentChoice | null>(readChoice);

  useEffect(() => {
    if (choice === "granted" && measurementId)
      enableGoogleAnalytics(measurementId);
  }, [choice, measurementId]);

  const choose = (nextChoice: ConsentChoice) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, nextChoice);
    } catch {
      // The in-memory choice still applies for this page view.
    }
    setChoice(nextChoice);
  };

  if (!measurementId || choice) return null;

  return (
    <aside
      role="dialog"
      aria-label="Analytics preferences"
      className="fixed bottom-4 left-4 z-[60] w-[calc(100%-2rem)] max-w-[390px] rounded-xl border border-[#E7E7EA] bg-white p-4 shadow-[0_8px_30px_rgba(15,17,22,0.14)]"
    >
      <p className="m-0 text-sm font-semibold text-[#0F1116]">
        Help improve Iconmuse
      </p>
      <p className="mb-3 mt-1 text-xs leading-relaxed text-[#777780]">
        Allow Google Analytics to collect usage data. You can continue without
        analytics.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => choose("denied")}>
          No thanks
        </Button>
        <Button size="sm" onClick={() => choose("granted")}>
          Allow analytics
        </Button>
      </div>
    </aside>
  );
};
