import React from "react";
import { Menu } from "lucide-react";
import type { MobileTopBarProps } from "../../types";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { BrandLogo } from "../common/BrandLogo";

const categories = [
  { label: "Icons", category: "all" },
  { label: "Illustrations", category: "illustrations" },
];

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  theme,
  onThemeChange,
  activeCategory,
  onSelectCategory,
  onOpenMenu,
}) => (
  <header className="mobile-top-bar select-none">
    <div className="mobile-top-bar__main">
      <a href="/" aria-label="IconMuse home" className="mobile-top-bar__brand">
        <span className="mobile-top-bar__mark"><BrandLogo className="h-5 w-5 object-contain" /></span>
        <span className="mobile-top-bar__wordmark">iconmuse</span>
        <span className="mobile-top-bar__beta">Beta</span>
      </a>

      <div className="mobile-top-bar__actions">
        <AnimatedThemeToggler theme={theme} onThemeChange={onThemeChange} className="mobile-top-bar__action-button" />
        <button type="button" className="mobile-top-bar__action-button mobile-top-bar__menu-button" onClick={onOpenMenu} aria-haspopup="dialog">
          <Menu size={24} />
        </button>
      </div>
    </div>

    <nav className="mobile-top-bar__nav" aria-label="Browse content">
      {categories.map((item) => {
        const selected = item.category === "all"
          ? activeCategory !== "illustrations"
          : activeCategory === item.category;
        return (
          <button
            key={item.category}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelectCategory(item.category)}
            className={`mobile-top-bar__tab${selected ? " is-active" : ""}`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  </header>
);
