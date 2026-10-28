import React from "react";
import type { IconSource } from "../../types";

interface ExtensionsPanelProps {
  sourceCounts: Record<string, number>;
  selectedSources: string[];
  onToggleSource: (source: string) => void;
}

const LIBRARIES: Array<{ name: IconSource; license: string }> = [
  { name: "Lucide", license: "ISC" },
  { name: "Phosphor", license: "MIT" },
  { name: "Tabler", license: "MIT" },
  { name: "Heroicons", license: "MIT" },
  { name: "Simple Icons", license: "CC0-1.0" },
  { name: "Feather Icons", license: "MIT" },
  { name: "Remix Icon", license: "Apache-2.0" },
  { name: "Lineicons", license: "MIT" },
  { name: "Material Symbols", license: "Apache-2.0" },
  { name: "Fluent System Icons", license: "MIT" },
  { name: "Carbon Icons", license: "Apache-2.0" },
  { name: "Bootstrap Icons", license: "MIT" },
  { name: "MingCute Icons", license: "Apache-2.0" },
  { name: "Open Doodles", license: "CC0-1.0" },
  { name: "Open Peeps", license: "CC0-1.0" },
  { name: "Fluent Emoji", license: "MIT" },
  { name: "Glass Icons", license: "CC-BY-4.0" },
  { name: "Flowbite Illustrations", license: "MIT" },
  { name: "Bioicons", license: "CC0 / BSD" },
  { name: "IRA Design", license: "MIT" },
];

export const ExtensionsPanel: React.FC<ExtensionsPanelProps> = ({
  sourceCounts,
  selectedSources,
  onToggleSource,
}) => (
  <div className="flex flex-col gap-6 bg-white px-6 py-6">
    <div>
      <h3 className="m-0 text-sm font-semibold text-[#0F1116]">
        Icon and illustration libraries
      </h3>
      <p className="mb-0 mt-1 text-xs leading-relaxed text-[#777780]">
        Select a library to narrow the results. Select it again to clear the
        filter.
      </p>
    </div>

    <div className="divide-y divide-[#F0F0F2]">
      {LIBRARIES.map((library) => {
        const selected = selectedSources.includes(library.name);
        const count = sourceCounts[library.name] ?? 0;
        return (
          <button
            key={library.name}
            type="button"
            aria-pressed={selected}
            onClick={() => onToggleSource(library.name)}
            className={`flex min-h-[58px] w-full items-center justify-between gap-4 py-3 text-left transition-colors ${selected ? "text-[#5630BD]" : "text-[#303038] hover:text-[#0F1116]"}`}
          >
            <span className="min-w-0">
              <span
                className={`block text-sm ${selected ? "font-semibold" : "font-medium"}`}
              >
                {library.name}
              </span>
              <span className="mt-1 block text-[11px] text-[#8E8E93]">
                {library.license}
              </span>
            </span>
            <span className="shrink-0 text-xs tabular-nums text-[#777780]">
              {count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
