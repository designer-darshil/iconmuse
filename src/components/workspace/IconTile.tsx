import React, { useState } from "react";
import { Copy, Heart, Columns2, Check } from "lucide-react";
import type { IconItem } from "../../types";
import { cn } from "../../utils/cn";

function getIllustrationTileSvg(svg: string) {
  return svg.replace(/<svg\b([^>]*)>/i, (_openingTag, attributes: string) => {
    const cleanAttributes = attributes.replace(
      /\s(?:width|height)=["'][^"']*["']/gi,
      "",
    );
    return `<svg${cleanAttributes} width="80" height="64">`;
  });
}

export interface IconTileProps {
  icon: IconItem;
  activeColor: string;
  iconSize?: number;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onCopySvg: (icon: IconItem) => void;
  onSelectIcon: (icon: IconItem) => void;
  isSelected: boolean;
  index?: number;
}

export const IconTile: React.FC<IconTileProps> = ({
  icon,
  activeColor,
  iconSize = 32,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onCopySvg,
  onSelectIcon,
  isSelected,
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const IconComponent = icon.component;
  const isIllustration = icon.category === "Illustrations";
  const isSvgReady = Boolean(icon.svg);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSvgReady) return;
    onCopySvg(icon);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 1400);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(icon.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare(icon.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-selected={isSelected}
      aria-disabled={!isSvgReady}
      aria-busy={!isSvgReady}
      onClick={() => { if (isSvgReady) onSelectIcon(icon) }}
      onKeyDown={(e) =>
        isSvgReady && (e.key === "Enter" || e.key === " ") && onSelectIcon(icon)
      }
      aria-label={`${icon.name} icon from ${icon.source}`}
      className={cn(
        "icon-tile group relative flex h-[168px] flex-col items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-[var(--ink)] cursor-pointer select-none transition-colors duration-150 hover:border-[var(--selection)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--selection)] [content-visibility:auto] [contain-intrinsic-size:168px]",
        isIllustration && "is-illustration",
        isSelected && "border-[var(--selection)] ring-1 ring-[var(--selection)]",
      )}
    >
      <div className="flex h-6 w-full items-center justify-end">
        <button
          type="button"
          onClick={handleSave}
          aria-pressed={isSaved}
          title={isSaved ? "Remove from Saved" : "Save icon"}
          aria-label={isSaved ? `Remove ${icon.name} from saved` : `Save ${icon.name}`}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--selection)]",
            isSaved && "text-[var(--selection)]",
          )}
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
        </button>
      </div>

      {/* Centered Icon Preview */}
      <div className="icon-tile__preview flex min-h-0 w-full flex-1 items-center justify-center">
        {!isSvgReady ? (
          <span className="size-8 animate-pulse rounded-md bg-[var(--surface-strong)]" aria-label="Loading artwork" />
        ) : isIllustration ? (
          <div
            aria-hidden="true"
            className="flex h-16 w-20 items-center justify-center overflow-hidden transition-transform duration-150 group-hover:scale-[1.03] [&>svg]:block [&>svg]:h-16 [&>svg]:w-20"
            dangerouslySetInnerHTML={{
              __html: getIllustrationTileSvg(icon.svg),
            }}
          />
        ) : (
          <IconComponent
            className="shrink-0 transition-transform duration-150 group-hover:scale-105"
            style={{
              color: activeColor,
              width: `${iconSize}px`,
              height: `${iconSize}px`,
            }}
            strokeWidth={icon.strokeWidth || 1.8}
          />
        )}
      </div>

      <div className="w-full px-1 text-center">
        <p className="icon-tile__name m-0 truncate text-[13px] font-medium leading-tight text-[var(--ink)]">
          {icon.name}
        </p>
      </div>

      <div className="mt-2 flex w-full min-w-0 items-center justify-between gap-1">
        <div className="icon-tile__source min-w-0 flex-1">
          <span title={icon.source} className="block w-fit max-w-full truncate rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
          {icon.source}
          </span>
        </div>

        <div className="icon-tile__actions flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!isSvgReady}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]",
            hasCopied && "text-[var(--success)]",
          )}
          title="Copy SVG"
          aria-label={`Copy SVG code for ${icon.name}`}
        >
          {hasCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={handleCompare}
          disabled={!isSvgReady}
          aria-pressed={isCompared}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]",
            isCompared && "bg-[var(--selection-soft)] text-[var(--selection)]",
          )}
          title={isCompared ? "Remove from compare" : "Add to compare"}
          aria-label={
            isCompared
              ? `Remove ${icon.name} from compare`
              : `Add ${icon.name} to compare`
          }
        >
          <Columns2 className="h-4 w-4" />
        </button>
      </div>
      </div>
    </div>
  );
};
