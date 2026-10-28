import React from "react";
import { Compass, Boxes, Bookmark, Puzzle, HelpCircle } from "lucide-react";
import type { LeftNavRailProps } from "../../types";
import { cn } from "../../utils/cn";

export const LeftNavRail: React.FC<LeftNavRailProps> = ({
  activeItemId,
  onSelectItem,
}) => {
  const primaryControls = [
    {
      id: "discover",
      label: "Discover",
      fullLabel: "Discover / Filters",
      icon: Compass,
    },
    {
      id: "collections",
      label: "Packs",
      fullLabel: "Collections / Packs",
      icon: Boxes,
    },
    {
      id: "saved",
      label: "Saved",
      fullLabel: "Saved Favorites",
      icon: Bookmark,
    },
  ];

  const lowerControls = [
    {
      id: "extensions",
      label: "Plugins",
      fullLabel: "Extensions & Plugins",
      icon: Puzzle,
    },
    { id: "help", label: "Help", fullLabel: "Help & Docs", icon: HelpCircle },
  ];

  return (
    <aside
      className="left-rail select-none justify-between w-[72px] bg-[#F7F7F8] border-r border-[#E7E7EA] py-3 flex flex-col items-center"
      aria-label="Application navigation"
    >
      {/* Upper Controls */}
      <div className="flex flex-col items-center gap-3 w-full">
        {primaryControls.map((item) => {
          const isActive = activeItemId === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center group w-full"
            >
              <button
                type="button"
                onClick={() => onSelectItem(item.id)}
                className="flex flex-col items-center justify-center p-1.5"
                aria-label={item.fullLabel}
                title={item.fullLabel}
              >
                {/* Dark circular icon background when active */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150",
                    isActive
                      ? "bg-[#0F1116] text-white shadow-xs"
                      : "bg-transparent text-[#8E8E93] group-hover:bg-white group-hover:text-[#0F1116]",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Small label */}
                <span
                  className={cn(
                    "text-xs mt-1 tracking-tight text-center transition-colors",
                    isActive
                      ? "font-bold text-[#0F1116]"
                      : "font-medium text-[#8E8E93] group-hover:text-[#0F1116]",
                  )}
                >
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Lower Controls: Extensions & Help */}
      <div className="flex flex-col items-center gap-3 w-full pt-3 border-t border-[#E7E7EA]/80">
        {lowerControls.map((item) => {
          const isActive = activeItemId === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center group w-full"
            >
              <button
                type="button"
                onClick={() => onSelectItem(item.id)}
                className="flex flex-col items-center justify-center p-1.5"
                aria-label={item.fullLabel}
                title={item.fullLabel}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150",
                    isActive
                      ? "bg-[#0F1116] text-white shadow-xs"
                      : "bg-transparent text-[#8E8E93] group-hover:bg-white group-hover:text-[#0F1116]",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span
                  className={cn(
                    "text-[10px] mt-1 tracking-tight text-center transition-colors",
                    isActive
                      ? "font-bold text-[#0F1116]"
                      : "font-medium text-[#8E8E93] group-hover:text-[#0F1116]",
                  )}
                >
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
