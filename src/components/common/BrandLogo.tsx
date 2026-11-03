import React from "react";

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <img
    className={`iconmuse-logo ${className}`}
    src="/favicon.svg"
    width={24}
    height={24}
    decoding="async"
    alt="iconmuse-logo"
    aria-hidden="true"
  />
);
