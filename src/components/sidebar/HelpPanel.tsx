import React from "react";
import { Search, SlidersHorizontal, Bookmark, Download, Layers, ArrowUpRight } from "lucide-react";

const GUIDES = [
  {
    icon: Search,
    title: "Find an icon",
    body: "Search by icon name, library, or related terms.",
  },
  {
    icon: SlidersHorizontal,
    title: "Refine results",
    body: "Filter by source, visual style, or license.",
  },
  {
    icon: Bookmark,
    title: "Save and compare",
    body: "Use the bookmark to save icons, or add up to four icons to Compare.",
  },
  {
    icon: Download,
    title: "Export SVG",
    body: "Open an icon to copy its SVG or download the current artwork.",
  },
];

export const HelpPanel: React.FC = () => (
  <div className="p-5 flex flex-col gap-4 bg-white">
    <div>
      <h3 className="text-sm font-semibold text-[#0F1116] m-0">
        Using IconMuse
      </h3>
      <p className="text-xs text-[#777780] mt-1 leading-relaxed">
        A few quick tips to get around the catalog.
      </p>
    </div>
    <div className="flex flex-col gap-2">
      {GUIDES.map(({ icon: Icon, title, body }) => (
        <div
          key={title}
          className="flex gap-3 p-3 rounded-xl border border-[#ECECF0] bg-white"
        >
          <Icon className="w-4 h-4 text-[#7141E8] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-[#17171B] m-0">
              {title}
            </h4>
            <p className="text-[11px] text-[#777780] mt-1 mb-0 leading-relaxed">
              {body}
            </p>
          </div>
        </div>
      ))}
    </div>

    <a
      href="/design-system"
      className="mt-1 flex items-start justify-between gap-3 rounded-xl border border-[#7141E8]/25 bg-[#F7F4FF] p-3.5 text-left no-underline transition-colors hover:border-[#7141E8]/50"
    >
      <div className="flex gap-3">
        <Layers className="w-4 h-4 text-[#7141E8] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-[#0F1116] m-0">
            Design System & Tokens
          </h4>
          <p className="text-[11px] text-[#52525B] mt-1 mb-0 leading-relaxed">
            Explore typography, color tokens, elevation, and live reusable UI components.
          </p>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-[#7141E8] shrink-0" />
    </a>
  </div>
);
