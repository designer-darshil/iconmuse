import React from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import type { DesktopHeaderProps } from "../../types";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { BrandLogo } from "../common/BrandLogo";

const categories = [
  { label: "Icons", category: "all" },
  { label: "Illustrations", category: "illustrations" },
];

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  theme,
  onThemeChange,
  activeCategory,
  onSelectCategory,
  onToggleSidebar,
  isSidebarOpen = true,
}) => (
  <header className="desktop-header select-none">
    <a href="/" aria-label="IconMuse home" className="desktop-header__brand">
      <span className="desktop-header__mark"><BrandLogo className="h-6 w-6 object-contain" /></span>
      <span className="desktop-header__wordmark">iconmuse</span>
      <span className="desktop-header__beta">Beta</span>
    </a>

    <nav className="desktop-header__nav" aria-label="Browse content">
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
            className={`desktop-header__tab${selected ? " is-active" : ""}`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>

    <div className="desktop-header__actions">
      <AnimatedThemeToggler theme={theme} onThemeChange={onThemeChange} className="desktop-header__action-button" />
      <span className="desktop-header__separator" aria-hidden="true" />
      <button type="button" aria-label="User account profile" className="desktop-header__profile">DS</button>
      {onToggleSidebar && (
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarOpen ? "Collapse sidebar" : "Open sidebar"}
          className="desktop-header__action-button"
        >
          {isSidebarOpen ? <PanelRightClose aria-hidden="true" /> : <PanelRightOpen aria-hidden="true" />}
        </button>
      )}
    </div>
  </header>
);
