import React from "react";

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <img className={`iconmuse-logo ${className}`} src="/favicon.svg" alt="" aria-hidden="true" />
);
