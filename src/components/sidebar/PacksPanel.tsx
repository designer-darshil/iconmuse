import React from "react";
import { Boxes, Check, ArrowRight, RotateCcw } from "lucide-react";
import { ICON_PACKS, type IconPack } from "../../data/iconPacks";
import { ICON_CATALOG } from "../../data/iconCatalog";
import { cn } from "../../utils/cn";

export interface PacksPanelProps {
  activePackId: string | null;
  onSelectPack: (packId: string | null) => void;
  packs?: IconPack[];
}

export const PacksPanel: React.FC<PacksPanelProps> = ({
  activePackId,
  onSelectPack,
  packs = ICON_PACKS,
}) => {
  return (
    <div className="p-4 flex flex-col gap-4 select-none bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#0F1116] m-0">
            Browse packs
          </h3>
          <p className="text-[11px] text-[#8E8E93] mt-0.5">
            {packs.length} focused sets for common workflows
          </p>
        </div>

        {activePackId && (
          <button
            type="button"
            onClick={() => onSelectPack(null)}
            className="text-[11px] font-semibold text-[#7141E8] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Show all</span>
          </button>
        )}
      </div>

      {/* Packs List */}
      <div className="flex flex-col gap-3">
        {packs.map((pack) => {
          const isActive = activePackId === pack.id;
          const firstIcon = ICON_CATALOG.find((icon) =>
            pack.iconIds.includes(icon.id),
          );
          const CoverIcon = firstIcon?.component ?? Boxes;

          return (
            <div
              key={pack.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectPack(isActive ? null : pack.id)}
              onKeyDown={(e) =>
                e.key === "Enter" && onSelectPack(isActive ? null : pack.id)
              }
              className={cn(
                "group p-3 rounded-xl border cursor-pointer text-left transition-colors duration-150",
                isActive
                  ? "bg-[#F8F6FF] border-[#7141E8]/50"
                  : "bg-white border-[#E7E7EA] hover:bg-[#FAFAFB] hover:border-[#D8D8DC]",
              )}
            >
              {/* Top Row: Cover Gradient Block + Count Badge */}
              <div className="flex items-start gap-3">
                {/* Visual Cover-Color Block */}
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 border border-black/5"
                  style={{
                    backgroundColor: `${pack.accentColor}14`,
                    color: pack.accentColor,
                  }}
                >
                  <CoverIcon className="w-[18px] h-[18px]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-[#0F1116] truncate m-0">
                      {pack.title}
                    </h4>

                    {/* Icon count pill */}
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#F7F7F8] text-[#55555D] shrink-0">
                      {pack.iconIds.length.toLocaleString()} icons
                    </span>
                  </div>

                  <p className="text-[11px] text-[#8E8E93] line-clamp-2 mt-1 leading-snug">
                    {pack.description}
                  </p>
                </div>
              </div>

              {/* Selection status */}
              <div className="flex justify-end mt-2 text-[11px]">
                <span
                  className={cn(
                    "font-medium inline-flex items-center gap-1",
                    isActive
                      ? "text-[#7141E8]"
                      : "text-[#777780] group-hover:text-[#0F1116]",
                  )}
                >
                  {isActive ? (
                    <>
                      <Check className="w-3 h-3 text-[#7141E8]" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <span>View icons</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
