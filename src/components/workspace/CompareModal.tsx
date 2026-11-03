import React, { useState } from "react";
import { Columns2, Copy, Check } from "lucide-react";
import { ICON_CATALOG, getIconSvg } from "../../data/iconCatalog";
import { copyToClipboard } from "../../utils/copyToClipboard";
import type { IconItem } from "../../types";
import { cn } from "../../utils/cn";
import { Modal } from "../ui/modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareIconIds: string[];
  activeColor?: string;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareIconIds,
  activeColor = "#0F1116",
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const icons = ICON_CATALOG.filter((icon) => compareIconIds.includes(icon.id));

  const handleCopySvg = async (icon: IconItem) => {
    const code = getIconSvg(icon, activeColor, 24);
    try {
      await copyToClipboard(code);
      setCopiedId(icon.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      ariaLabelledBy="compare-modal-title"
      closeLabel="Close comparison modal"
      icon={<Columns2 className="w-4 h-4" />}
      title="Compare icons"
      subtitle={`${icons.length} icons selected for side-by-side optical inspection`}
    >
      <div
        className={cn(
          "grid gap-4",
          icons.length === 2 && "grid-cols-1 sm:grid-cols-2",
          icons.length === 3 && "grid-cols-1 sm:grid-cols-3",
          icons.length >= 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {icons.map((icon) => {
          const IconComp = icon.component;
          const isCopied = copiedId === icon.id;

          return (
            <div
              key={icon.id}
              className="flex flex-col p-4 sm:p-5 rounded-[18px] bg-[#F7F7F8] border border-[#E7E7EA] gap-4 transition-colors hover:border-[#D8D8DC]"
            >
              {/* Big Preview at 48px */}
              <div className="h-28 rounded-[14px] bg-white border border-[#E7E7EA] flex items-center justify-center relative shadow-2xs">
                <IconComp
                  className="w-12 h-12 transition-all"
                  style={{ color: activeColor }}
                  strokeWidth={2}
                />
                <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#8E8E93] bg-[#F7F7F8] border border-[#E7E7EA] px-1.5 py-0.5 rounded-full">
                  48px
                </span>
              </div>

              {/* Optical Scales: 32px, 24px, 16px */}
              <div className="flex items-center justify-around py-2.5 px-3 rounded-[12px] bg-white border border-[#E7E7EA]">
                <div className="flex flex-col items-center gap-1">
                  <IconComp className="w-8 h-8" style={{ color: activeColor }} />
                  <span className="text-[9px] font-mono text-[#8E8E93]">32px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <IconComp className="w-6 h-6" style={{ color: activeColor }} />
                  <span className="text-[9px] font-mono text-[#8E8E93]">24px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <IconComp className="w-4 h-4" style={{ color: activeColor }} />
                  <span className="text-[9px] font-mono text-[#8E8E93]">16px</span>
                </div>
              </div>

              {/* Info & Metadata */}
              <div className="flex flex-col gap-1.5 text-left">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#0F1116] truncate m-0">
                    {icon.name}
                  </h4>
                  <Badge variant="violet" size="sm">
                    {icon.style}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8E8E93] pt-1 border-t border-[#E7E7EA]/70">
                  <span>Source</span>
                  <span className="font-semibold text-[#0F1116]">{icon.source}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                  <span>Category</span>
                  <span>{icon.category}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                  <span>License</span>
                  <span className="font-mono">{icon.license}</span>
                </div>
              </div>

              {/* Copy Action */}
              <Button
                variant="outline"
                onClick={() => handleCopySvg(icon)}
                className="mt-auto w-full min-h-[40px]"
                leftIcon={
                  isCopied ? (
                    <Check className="w-3.5 h-3.5 text-[#18794E]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#8E8E93]" />
                  )
                }
              >
                {isCopied ? (
                  <span className="text-[#18794E]">Copied!</span>
                ) : (
                  <span>Copy SVG</span>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
