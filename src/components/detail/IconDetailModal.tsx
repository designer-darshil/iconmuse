import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Copy,
  Download,
  Check,
  Bookmark,
  ChevronDown,
  ChevronRight,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Shield,
  Search,
  Code2,
} from "lucide-react";
import { ICON_CATALOG } from "../../data/iconCatalog";
import type { IconItem } from "../../types";
import { cn } from "../../utils/cn";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";
import { DropdownSelect, DropdownItem, DropdownSectionLabel } from "../ui/dropdown";

export interface IconDetailModalProps {
  isDark?: boolean;
  iconId: string | null;
  onClose: () => void;
  onSelectIcon: (id: string) => void;
  savedIconIds: string[];
  onToggleSave: (id: string) => void;
  onFindSimilar?: (category: string) => void;
}

const COLOR_SWATCHES = [
  "#0F1116",
  "#7141E8",
  "#2563EB",
  "#059669",
  "#E11D48",
  "#D97706",
  "#475569",
  "#FFFFFF",
  "#F4F4F5",
];

const BG_SWATCHES = [
  "transparent",
  "#FFFFFF",
  "#F7F7F8",
  "#F1F1F3",
  "#0F1116",
  "#EDE9FE",
  "#DCFCE7",
  "#FEF3C7",
];

const ILLUSTRATION_PREVIEW_SIZE = 400;

function escapeXmlText(value: string) {
  return value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
}

function illustrationMarkup(svg: string, width: number, height: number) {
  return svg.replace(/<svg\b([^>]*)>/i, (_openingTag, attributes: string) => {
    const cleanAttributes = attributes.replace(
      /\s(?:width|height)=["'][^"']*["']/gi,
      "",
    );
    return `<svg${cleanAttributes} width="${width}" height="${height}">`;
  });
}

function readViewBox(svg: string) {
  const value = svg.match(/\bviewBox=["']([^"']+)["']/i)?.[1];
  const parts = value?.trim().split(/[\s,]+/).map(Number);
  if (parts?.length === 4 && parts.every(Number.isFinite) && parts[2] > 0 && parts[3] > 0) {
    return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
  }
  return { x: 0, y: 0, width: 24, height: 24 };
}

function setSvgDimensions(
  svg: string,
  width: number,
  height: number,
  viewBox?: { x: number; y: number; width: number; height: number },
) {
  return svg.replace(/<svg\b([^>]*)>/i, (_openingTag, attributes: string) => {
    let clean = attributes
      .replace(/\swidth=["'][^"']*["']/i, "")
      .replace(/\sheight=["'][^"']*["']/i, "");
    if (viewBox) {
      const value = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
      clean = /\sviewBox=["'][^"']*["']/i.test(clean)
        ? clean.replace(/\sviewBox=["'][^"']*["']/i, ` viewBox="${value}"`)
        : `${clean} viewBox="${value}"`;
    }
    const withNamespace = /\sxmlns=/.test(clean)
      ? clean
      : `${clean} xmlns="http://www.w3.org/2000/svg"`;
    return `<svg${withNamespace} width="${width}" height="${height}">`;
  });
}

function addSvgMetadata(svg: string, icon: IconItem) {
  const metadata = `<metadata>Icon: ${escapeXmlText(icon.name)}; Source: ${escapeXmlText(icon.source)}${icon.author ? `; Author: ${escapeXmlText(icon.author)}` : ""}; License: ${escapeXmlText(icon.license)}.</metadata>`;
  return svg.replace(/<\/svg\s*>/i, `${metadata}</svg>`);
}

function applySvgPreviewSettings(
  source: string,
  iconId: string,
  options: {
    color: string;
    strokeWidth: number | null;
    opacity: number;
    rotation: number;
    flipH: boolean;
    flipV: boolean;
    background: string;
    bgShape: "none" | "rounded-square" | "circle";
    shadow: "none" | "subtle" | "float" | "glow";
  },
) {
  const openingTagMatch = source.match(/<svg\b[^>]*>/i);
  const openingTag = openingTagMatch?.[0];
  const openingTagStart = openingTagMatch?.index ?? -1;
  const closingTagStart = source.toLowerCase().lastIndexOf("</svg");
  if (!openingTag || openingTagStart < 0 || closingTagStart < 0) {
    throw new Error("The source SVG is invalid");
  }

  const bounds = readViewBox(source);
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  const sx = options.flipH ? -1 : 1;
  const sy = options.flipV ? -1 : 1;
  const transform = `translate(${cx} ${cy}) rotate(${options.rotation}) scale(${sx} ${sy}) translate(${-cx} ${-cy})`;

  const safeId = iconId.replace(/[^a-zA-Z0-9_-]/g, "-");
  const filterId = `iconmuse-export-shadow-${safeId}`;
  let defs = "";
  if (options.shadow !== "none") {
    defs = `<defs><filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="${options.shadow === "float" ? 4 : 2}" stdDeviation="${options.shadow === "float" ? 5 : 2}" flood-color="${options.shadow === "glow" ? options.color : "#0F1116"}" flood-opacity="${options.shadow === "float" ? 0.2 : 0.12}" /></filter></defs>`;
  }

  let background = "";
  if (options.background !== "transparent") {
    const rx = options.bgShape === "circle"
      ? bounds.height / 2
      : options.bgShape === "rounded-square"
        ? Math.min(bounds.width, bounds.height) * 0.2
        : 0;
    background = `<rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" fill="${options.background}"${rx ? ` rx="${rx}"` : ""} />`;
  }

  let attributes = openingTag.slice(4, -1).replace(/currentColor/g, options.color);
  if (!/\sxmlns=/.test(attributes)) attributes += ' xmlns="http://www.w3.org/2000/svg"';
  if (options.strokeWidth !== null) {
    if (/\sstroke-width=["'][^"']*["']/i.test(attributes)) {
      attributes = attributes.replace(/\sstroke-width=["'][^"']*["']/i, ` stroke-width="${options.strokeWidth}"`);
    } else {
      attributes += ` stroke-width="${options.strokeWidth}"`;
    }
  }

  const bodyStart = openingTagStart + openingTag.length;
  const body = source.slice(bodyStart, closingTagStart).replace(/currentColor/g, options.color);
  const filterAttribute = options.shadow === "none" ? "" : ` filter="url(#${filterId})"`;
  const wrapped = `${defs}<g opacity="${options.opacity / 100}" transform="${transform}"${filterAttribute}>${background}${body}</g>`;
  return `${source.slice(0, openingTagStart)}<svg${attributes}>${wrapped}${source.slice(closingTagStart)}`;
}

export const IconDetailModal: React.FC<IconDetailModalProps> = ({
  isDark = false,
  iconId,
  onClose,
  onSelectIcon,
  savedIconIds,
  onToggleSave,
  onFindSimilar,
}) => {
  const shouldReduceMotion = useReducedMotion();
  useOverlayScrollLock(Boolean(iconId));

  const icon = useMemo(() => {
    if (!iconId) return null;
    return ICON_CATALOG.find((i) => i.id === iconId) || null;
  }, [iconId]);

  // Customization State
  const [size, setSize] = useState<number>(36);
  const [isSizeCustomized, setIsSizeCustomized] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(2.0);
  const [fgColor, setFgColor] = useState<string>(isDark ? "#F4F4F5" : "#0F1116");
  const previousDarkRef = useRef(isDark);

  useEffect(() => {
    if (previousDarkRef.current === isDark) return;
    const previousDefault = previousDarkRef.current ? "#F4F4F5" : "#0F1116";
    const nextDefault = isDark ? "#F4F4F5" : "#0F1116";
    setFgColor((current) => current === previousDefault ? nextDefault : current);
    previousDarkRef.current = isDark;
  }, [isDark]);
  const [bgColor, setBgColor] = useState<string>("transparent");
  const [bgShape, setBgShape] = useState<"none" | "rounded-square" | "circle">(
    "none",
  );
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(100);
  const [shadow, setShadow] = useState<"none" | "subtle" | "float" | "glow">(
    "none",
  );

  // Collapsible Sections
  const [isTransformOpen, setIsTransformOpen] = useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  const [isBgShapeOpen, setIsBgShapeOpen] = useState(false);

  // Export State
  const [pngScale, setPngScale] = useState<string>("2x (48px)");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSvgSplitOpen, setIsSvgSplitOpen] = useState(false);
  const [hasCopiedSvg, setHasCopiedSvg] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const exportActionsRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Reset customizer defaults when icon changes
  useEffect(() => {
    if (icon) {
      setSize(
        icon.category === "Illustrations" ? ILLUSTRATION_PREVIEW_SIZE : 36,
      );
      setIsSizeCustomized(false);
      setStrokeWidth(2.0);
      setFgColor(isDark ? "#F4F4F5" : "#0F1116");
      setBgColor("transparent");
      setBgShape("none");
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setOpacity(100);
      setShadow("none");
    }
  }, [icon?.id]);

  useEffect(() => {
    if (!icon || icon.category !== "Illustrations") return;
    const updateDefaultSize = () => {
      if (!isSizeCustomized)
        setSize(window.matchMedia("(max-width: 767px)").matches ? 320 : 400);
    };
    updateDefaultSize();
    window.addEventListener("resize", updateDefaultSize);
    return () => window.removeEventListener("resize", updateDefaultSize);
  }, [icon?.id, icon?.source, isSizeCustomized]);

  useEffect(() => {
    if (!isSvgSplitOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!exportActionsRef.current?.contains(event.target as Node)) {
        setIsSvgSplitOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isSvgSplitOpen]);

  // Focus trapping & Escape key listener
  useEffect(() => {
    if (!iconId) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Focus close button initially
    const closeBtn = modalRef.current?.querySelector<HTMLButtonElement>(
      'button[aria-label="Close icon detail"]',
    );
    closeBtn?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus?.();
    };
  }, [iconId, onClose]);

  if (!icon) return null;

  const IconComponent = icon.component;
  const isIllustration = icon.category === "Illustrations";
  const illustrationHeight = size;
  const isSaved = savedIconIds.includes(icon.id);

  const similarIcons = ICON_CATALOG.filter(
    (i) => i.category === icon.category && i.id !== icon.id,
  ).slice(0, 5);

  const matchingIcons = ICON_CATALOG.filter(
    (i) =>
      i.id !== icon.id &&
      (i.tags.some((t) => icon.tags.includes(t)) || i.source === icon.source),
  ).slice(0, 6);

  const similarIllustrations = ICON_CATALOG.filter(
    (candidate) =>
      candidate.category === "Illustrations" &&
      candidate.id !== icon.id &&
      (candidate.category === icon.category ||
        candidate.tags.some((tag) => icon.tags.includes(tag))),
  ).slice(0, 4);
  const similarIllustrationIds = new Set(
    similarIllustrations.map((candidate) => candidate.id),
  );
  const moreIllustrations = ICON_CATALOG.filter(
    (candidate) =>
      candidate.category === "Illustrations" &&
      candidate.id !== icon.id &&
      !similarIllustrationIds.has(candidate.id),
  ).slice(0, 6);

  const styleVariants = ICON_CATALOG.filter(
    (candidate) =>
      candidate.source === icon.source && candidate.name === icon.name,
  ).sort((a, b) => a.style.localeCompare(b.style));

  // Generate SVG Code
  const getExportDimensions = (width: number) => {
    const original = readViewBox(icon.svg);
    const radians = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));
    const viewBoxWidth = original.width * cos + original.height * sin;
    const viewBoxHeight = original.width * sin + original.height * cos;
    const centerX = original.x + original.width / 2;
    const centerY = original.y + original.height / 2;
    const viewBox = {
      x: centerX - viewBoxWidth / 2,
      y: centerY - viewBoxHeight / 2,
      width: viewBoxWidth,
      height: viewBoxHeight,
    };
    return {
      width,
      height: Math.max(1, Math.round(width * (viewBox.height / viewBox.width))),
      viewBox,
    };
  };

  const buildExportSvg = (width: number) => {
    const dimensions = getExportDimensions(width);
    const source = applySvgPreviewSettings(icon.svg, icon.id, {
      color: fgColor,
      strokeWidth: isIllustration ? null : strokeWidth,
      opacity,
      rotation,
      flipH,
      flipV,
      background: bgColor,
      bgShape: isIllustration ? "none" : bgShape,
      shadow,
    });
    return addSvgMetadata(
      setSvgDimensions(source, dimensions.width, dimensions.height, dimensions.viewBox),
      icon,
    );
  };

  // Icons render at 2× the optical-size setting in the modal; illustrations
  // render at their selected canvas size. Keep that artwork size for SVG export.
  const generatedSvg = buildExportSvg(isIllustration ? size : size * 2);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleCopySvg = async () => {
    try {
      await copyToClipboard(generatedSvg);
      setIsSvgSplitOpen(false);
      setHasCopiedSvg(true);
      window.setTimeout(() => setHasCopiedSvg(false), 1800);
      showToast("SVG copied to clipboard");
    } catch {
      showToast("Could not copy SVG. Check clipboard permissions and try again.");
    }
  };

  const handleCopyJsx = async () => {
    const jsxCode = `<${icon.name.replace(/\s+/g, "")} size={${size}} color="${fgColor}" strokeWidth={${strokeWidth}} />`;
    try {
      await copyToClipboard(jsxCode);
      showToast("React JSX Component copied!");
      setIsSvgSplitOpen(false);
    } catch {
      showToast("Could not copy JSX. Check clipboard permissions and try again.");
    }
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([generatedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${icon.name.toLowerCase().replace(/\s+/g, "-")}.svg`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Downloaded ${icon.name}.svg`);
  };

  const handleDownloadPng = () => {
    const selectedPixels = pngScale.match(/\((\d+)px\)/)?.[1] ?? pngScale.match(/^(\d+)px/)?.[1];
    const targetWidth = Math.max(1, Number(selectedPixels) || 48);
    const { width, height } = getExportDimensions(targetWidth);
    const pngSvg = buildExportSvg(width);
    const svgBlob = new Blob([pngSvg], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(svgUrl);
        showToast("Could not create PNG");
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(svgUrl);
      canvas.toBlob((blob) => {
        if (!blob) {
          showToast("Could not create PNG");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${icon.name.toLowerCase().replace(/\s+/g, "-")}-${width}x${height}.png`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast(`Downloaded ${width} × ${height}px PNG`);
      }, "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      showToast("Could not create PNG");
    };
    image.src = svgUrl;
  };

  const getShadowStyle = () => {
    switch (shadow) {
      case "subtle":
        return "0 2px 8px rgba(15,17,22,0.08)";
      case "float":
        return "0 8px 24px rgba(15,17,22,0.16)";
      case "glow":
        return `0 0 20px ${fgColor}55`;
      default:
        return "none";
    }
  };

  if (isIllustration) {
    return (
      <AnimatePresence>
        <div
          className="mobile-illustration-overlay fixed inset-0 z-50 flex items-center justify-center bg-[#11121A]/55 p-0 backdrop-blur-sm md:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="illustration-title"
        >
          <motion.div
            ref={modalRef}
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.985,
              y: shouldReduceMotion ? 0 : 8,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.985,
              y: shouldReduceMotion ? 0 : 6,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.18,
              ease: "easeOut",
            }}
            className="mobile-illustration-window relative flex h-[100dvh] w-full max-w-[1680px] flex-col overflow-hidden bg-white font-sans shadow-[var(--shadow-modal)] md:h-[90vh] md:rounded-[20px] md:border md:border-[#E7E7EA]"
          >
            <header className="z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[#E7E7EA] bg-white px-5">
              <nav className="flex min-w-0 items-center gap-1.5 overflow-x-auto text-xs font-medium text-[#8E8E93] no-scrollbar" aria-label="Breadcrumb">
                <span>Illustrations</span>
                <span aria-hidden="true">/</span>
                <span className="shrink-0">{icon.source}</span>
                <span aria-hidden="true">/</span>
                <h1 id="illustration-title" className="m-0 truncate font-bold text-[#0F1116]">
                  {icon.name}
                </h1>
              </nav>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleSave(icon.id)}
                  className="rounded-full border border-[#E7E7EA] px-4 py-2 text-xs font-semibold text-[#0F1116] transition-colors hover:bg-[#F7F7F8]"
                >
                  {isSaved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close icon detail"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#8E8E93] transition-colors hover:bg-[#F7F7F8] hover:text-[#0F1116]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="illustration-modal-body grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_360px] lg:overflow-hidden">
              <section
                className="illustration-preview-section flex min-h-[58dvh] min-w-0 flex-col bg-[#F4F3F6] p-4 sm:p-5 lg:min-h-0"
                aria-label="Illustration preview"
              >
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl border border-[#E1DFE5] bg-[radial-gradient(#dedbe3_1px,transparent_1px)] [background-size:18px_18px]">
                  <div
                    className="m-auto flex h-max w-max shrink-0 items-center justify-center p-4 sm:p-6"
                    style={{
                      backgroundColor:
                        bgColor === "transparent" ? "transparent" : bgColor,
                      boxShadow: getShadowStyle(),
                      opacity: opacity / 100,
                      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: illustrationMarkup(
                        icon.svg,
                        size,
                        illustrationHeight,
                      ),
                    }}
                  />
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 px-1 pt-3 text-[11px] text-[#77727F]">
                  <span>Original artwork dimensions</span>
                  <span className="font-mono tabular-nums text-[#37333E]">
                    {size} × {illustrationHeight} px
                  </span>
                </div>
              </section>

              <aside className="illustration-detail-controls flex flex-col gap-5 border-t border-[#E7E7EA] bg-white p-5 font-sans lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0">
                <section className="space-y-3">
                  <h2 className="m-0 text-sm font-semibold text-[#0F1116]">
                    Details
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {[icon.source, icon.license, icon.category].map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-[#E7E5EA] px-2.5 py-1 text-[11px] font-medium text-[#625D69]"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="space-y-3 border-t border-[#ECEAEF] pt-5">
                  <div className="flex items-center justify-between gap-3 text-[13px] font-medium text-[#303038]">
                    <label htmlFor="illustration-size">Preview size</label>
                    <span className="font-mono text-[13px] text-[#7141E8]">
                      {size} × {size} px
                    </span>
                  </div>
                  <input
                    id="illustration-size"
                    type="range"
                    min="100"
                    max="1200"
                    step="10"
                    value={size}
                    onChange={(event) => {
                      setIsSizeCustomized(true);
                      setSize(Number(event.target.value));
                    }}
                    className="w-full accent-[#7141E8]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSizeCustomized(false);
                      setSize(
                        window.matchMedia("(max-width: 767px)").matches
                          ? 320
                          : 400,
                      );
                    }}
                    className="text-[13px] font-medium text-[#7141E8] hover:underline"
                  >
                    Reset to screen size
                  </button>
                </section>

                <section className="space-y-3 border-t border-[#ECEAEF] pt-5">
                  <h2 className="m-0 text-sm font-semibold text-[#0F1116]">
                    Canvas
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {BG_SWATCHES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setBgColor(color)}
                        aria-label={
                          color === "transparent"
                            ? "Transparent canvas"
                            : `Canvas ${color}`
                        }
                        aria-pressed={bgColor === color}
                        className={cn(
                          "h-8 w-8 rounded-full border border-black/10",
                          bgColor === color &&
                            "ring-2 ring-[#7141E8] ring-offset-2",
                        )}
                        style={{
                          background:
                            color === "transparent"
                              ? "linear-gradient(135deg,#fff 45%,#e86b6b 46%,#e86b6b 54%,#fff 55%)"
                              : color,
                        }}
                      />
                    ))}
                  </div>
                </section>

                <section className="space-y-3 border-t border-[#ECEAEF] pt-5">
                  <h2 className="m-0 text-sm font-semibold text-[#0F1116]">
                    Adjustments
                  </h2>
                  <label className="flex items-center justify-between gap-3 text-[13px] text-[#303038]">
                    Opacity{" "}
                    <input
                      aria-label="Illustration opacity"
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={opacity}
                      onChange={(event) =>
                        setOpacity(Number(event.target.value))
                      }
                      className="w-32 accent-[#7141E8]"
                    />
                    <span className="w-9 text-right tabular-nums">
                      {opacity}%
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setRotation((current) => (current + 90) % 360)
                      }
                      className="rounded-lg border border-[#E7E7EA] px-3 py-2 text-[13px] text-[#303038] hover:bg-[#F8F7FA]"
                    >
                      Rotate {rotation ? `· ${rotation}°` : ""}
                    </button>
                    <button
                      type="button"
                      aria-pressed={flipH}
                      onClick={() => setFlipH((value) => !value)}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-[13px]",
                        flipH
                          ? "border-[#7141E8] bg-[#F7F4FF] text-[#5630BD]"
                          : "border-[#E7E7EA] text-[#48434F]",
                      )}
                    >
                      Flip horizontal
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-pressed={flipV}
                    onClick={() => setFlipV((value) => !value)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-[13px]",
                      flipV
                        ? "border-[#7141E8] bg-[#F7F4FF] text-[#5630BD]"
                        : "border-[#E7E7EA] text-[#48434F]",
                    )}
                  >
                    Flip vertical
                  </button>
                  <div
                    className="flex flex-wrap gap-2"
                    aria-label="Shadow effect"
                  >
                    {(["none", "subtle", "float"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={shadow === option}
                        onClick={() => setShadow(option)}
                        className={cn(
                        "rounded-lg border px-3 py-1.5 text-[13px] capitalize",
                          shadow === option
                            ? "border-[#7141E8] bg-[#F7F4FF] text-[#5630BD]"
                            : "border-[#E7E7EA] text-[#625D69]",
                        )}
                      >
                        {option} shadow
                      </button>
                    ))}
                  </div>
                </section>

                <section className="illustration-export-section space-y-3 border-t border-[#ECEAEF] pt-5">
                  <h2 className="m-0 text-sm font-semibold text-[#0F1116]">
                    Export
                  </h2>
                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#7141E8] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#6031D4]"
                  >
                    <Download className="h-4 w-4" />
                    Download SVG
                  </button>
                  <button
                    type="button"
                    onClick={handleCopySvg}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E7E7EA] px-4 text-[13px] font-medium text-[#303038] transition-colors hover:bg-[#F8F7FA]"
                  >
                    <Copy className="h-4 w-4" />
                    Copy SVG
                  </button>
                </section>

                <button
                  type="button"
                  onClick={() => {
                    onFindSimilar?.(icon.category);
                    onClose();
                  }}
                  className="self-start text-[13px] font-medium text-[#7141E8] hover:underline"
                >
                  Find similar illustrations
                </button>

                {similarIllustrations.length > 0 && (
                  <section className="space-y-3 border-t border-[#ECEAEF] pt-5">
                    <h2 className="m-0 text-sm font-semibold text-[#0F1116]">
                      Similar illustrations
                    </h2>
                    <div className="grid grid-cols-2 gap-2.5">
                      {similarIllustrations.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectIcon(item.id)}
                          className="min-w-0 rounded-lg border border-[#E7E7EA] p-2.5 text-left hover:border-[#C8B8F3] hover:bg-[#FBFAFD]"
                        >
                          <div
                            className="flex h-20 items-center justify-center overflow-hidden rounded-md bg-[#F4F3F6] p-1"
                            dangerouslySetInnerHTML={{
                              __html: illustrationMarkup(item.svg, 64, 64),
                            }}
                          />
                          <span className="mt-2 block truncate text-xs font-medium text-[#393641]">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
                {moreIllustrations.length > 0 && (
                  <section className="space-y-3 border-t border-[#ECEAEF] pt-5">
                    <h2 className="m-0 text-sm font-semibold text-[#0F1116]">
                      More illustrations
                    </h2>
                    <div className="grid grid-cols-2 gap-2.5">
                      {moreIllustrations.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectIcon(item.id)}
                          className="min-w-0 rounded-lg border border-[#E7E7EA] p-2.5 text-left hover:border-[#C8B8F3] hover:bg-[#FBFAFD]"
                        >
                          <div
                            className="flex h-20 items-center justify-center overflow-hidden rounded-md bg-[#F4F3F6] p-1"
                            dangerouslySetInnerHTML={{
                              __html: illustrationMarkup(item.svg, 64, 64),
                            }}
                          />
                          <span className="mt-2 block truncate text-xs font-medium text-[#393641]">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </aside>
            </div>
            <div className="mobile-detail-actionbar" aria-label="Artwork actions">
              <button type="button" onClick={handleCopySvg} className="mobile-detail-action-secondary">
                {hasCopiedSvg ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                <span>{hasCopiedSvg ? "Copied" : "Copy SVG"}</span>
              </button>
              <button type="button" onClick={handleDownloadSvg} className="mobile-detail-action-primary">
                <Download aria-hidden="true" />
                <span>Download SVG</span>
              </button>
            </div>
          </motion.div>
          {toastMessage && (
            <div
              role="status"
              className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-xl"
            >
              {toastMessage}
            </div>
          )}
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div
        className="mobile-icon-detail-overlay fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-8 select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="icon-detail-title"
      >
        {/* Full-screen dimmed backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F1116]/65 backdrop-blur-xs"
        />

        {/* Modal Window: max-w-[1680px], 16px radius, professional quick transition */}
        <motion.div
          ref={modalRef}
          initial={{
            opacity: 0,
            scale: shouldReduceMotion ? 1 : 0.98,
            y: shouldReduceMotion ? 0 : 8,
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: shouldReduceMotion ? 1 : 0.98,
            y: shouldReduceMotion ? 0 : 6,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.18,
            ease: "easeOut",
          }}
          className="mobile-icon-detail-window relative z-10 w-full max-w-[1680px] h-[100dvh] md:h-[90vh] bg-white md:rounded-[20px] shadow-[var(--shadow-modal)] border border-[#E7E7EA] overflow-hidden flex flex-col"
        >
          {/* Top Bar for Mobile & Desktop Close */}
          <div className="h-14 px-5 border-b border-[#E7E7EA] flex items-center justify-between bg-white shrink-0 sticky top-0 z-30">
            {/* Breadcrumb: Icons / Category / Icon Name */}
            <nav
              className="flex items-center gap-1.5 text-xs text-[#8E8E93] overflow-x-auto no-scrollbar font-medium"
              aria-label="Breadcrumb"
            >
              <span
                className="hover:text-[#0F1116] cursor-pointer"
                onClick={onClose}
              >
                Icons
              </span>
              <span>/</span>
              <span
                className="hover:text-[#0F1116] cursor-pointer"
                onClick={() => {
                  onFindSimilar?.(icon.category);
                  onClose();
                }}
              >
                {icon.category}
              </span>
              <span>/</span>
              <span
                id="icon-detail-title"
                className="font-bold text-[#0F1116] truncate max-w-[180px]"
              >
                {icon.name}
              </span>
            </nav>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close icon detail"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#0F1116] hover:bg-[#F7F7F8] transition-all hover:-translate-y-[1px] active:translate-y-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Layout: 3 Columns on Desktop >= 1280px, Stacked on Tablet & Mobile */}
          <div className="mobile-icon-detail-body flex-1 min-h-0 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-[360px_1fr_360px] xl:grid-cols-[380px_1fr_380px]">
            {/* -------------------- 1. LEFT PANEL: CUSTOMIZATION -------------------- */}
            <div className="mobile-icon-customize-panel order-3 lg:order-none border-b lg:border-b-0 lg:border-r border-[#E7E7EA] bg-white overflow-visible lg:overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1116] m-0">
                  Customize
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSize(isIllustration ? ILLUSTRATION_PREVIEW_SIZE : 36);
                    setStrokeWidth(2.0);
                    setFgColor(isDark ? "#F4F4F5" : "#0F1116");
                    setBgColor("transparent");
                    setBgShape("none");
                    setRotation(0);
                    setFlipH(false);
                    setFlipV(false);
                    setOpacity(100);
                    setShadow("none");
                  }}
                  className="text-[11px] font-semibold text-[#7141E8] hover:underline"
                >
                  Reset
                </button>
              </div>
              {isIllustration && (
                <p className="-mt-3 mb-0 text-[11px] leading-relaxed text-[#777780]">
                  Original artwork colors are preserved. Size, background,
                  rotation, and effects still apply.
                </p>
              )}

              {/* Icon Size Slider */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <label htmlFor="custom-size-slider">Size</label>
                  <span className="font-mono text-[#7141E8]">
                    {isIllustration
                      ? `${size} × ${illustrationHeight}px`
                      : `${size}px`}
                  </span>
                </div>

                <input
                  id="custom-size-slider"
                  type="range"
                  min={isIllustration ? 100 : 16}
                  max={isIllustration ? 1200 : 96}
                  step={isIllustration ? 10 : 2}
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value, 10))}
                  className="w-full accent-[#7141E8] cursor-pointer"
                />

                <div className="grid grid-cols-4 gap-1.5 bg-[#F7F7F8] p-1 rounded-full border border-[#E7E7EA]">
                  {(isIllustration
                    ? [ILLUSTRATION_PREVIEW_SIZE, 300, 500, 600]
                    : [16, 20, 24, 32]
                  ).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSize(preset)}
                      className={cn(
                        "py-1 text-center text-xs font-semibold rounded-full transition-all hover:-translate-y-[1px] active:translate-y-0",
                        size === preset
                          ? "bg-white text-[#0F1116] shadow-2xs"
                          : "text-[#8E8E93] hover:text-[#0F1116]",
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stroke Weight */}
              {!isIllustration && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                    <label htmlFor="custom-stroke-slider">Stroke Width</label>
                    <span className="font-mono text-[#7141E8]">
                      {strokeWidth.toFixed(1)}px
                    </span>
                  </div>
                  <input
                    id="custom-stroke-slider"
                    type="range"
                    min="1"
                    max="3"
                    step="0.5"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                    className="w-full accent-[#7141E8] cursor-pointer"
                  />
                </div>
              )}

              {/* Foreground Color Input & Swatches */}
              {!isIllustration && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                    <label htmlFor="fg-color-input">Icon Color</label>
                    <span className="font-mono text-xs text-[#8E8E93] uppercase">
                      {fgColor}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full border border-black/10 shrink-0 shadow-2xs"
                      style={{ backgroundColor: fgColor }}
                    />
                    <input
                      id="fg-color-input"
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-mono text-[#0F1116] focus:outline-none focus:border-[#7141E8]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COLOR_SWATCHES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFgColor(color)}
                        className={cn(
                          "w-7 h-7 rounded-full border transition-transform hover:scale-110 shrink-0",
                          fgColor === color
                            ? "ring-2 ring-[#7141E8] ring-offset-1"
                            : "border-black/10",
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Background Color Input & Swatches */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <label htmlFor="bg-color-input">Background Color</label>
                  <span className="font-mono text-xs text-[#8E8E93] uppercase">
                    {bgColor === "transparent" ? "None" : bgColor}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full border border-black/10 shrink-0 shadow-2xs relative overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                  >
                    {bgColor === "transparent" && (
                      <div className="absolute inset-0 bg-red-400 rotate-45 h-[1.5px] top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <input
                    id="bg-color-input"
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-mono text-[#0F1116] focus:outline-none focus:border-[#7141E8]"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {BG_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBgColor(color)}
                      className={cn(
                        "w-7 h-7 rounded-full border transition-transform hover:scale-110 shrink-0 relative overflow-hidden",
                        bgColor === color
                          ? "ring-2 ring-[#7141E8] ring-offset-1"
                          : "border-black/10",
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={
                        color === "transparent"
                          ? "Transparent background"
                          : `Background color ${color}`
                      }
                    >
                      {color === "transparent" && (
                        <div className="absolute inset-0 bg-red-400 rotate-45 h-[1.5px] top-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-[#E7E7EA]" />

              {/* Collapsible: Background Shape */}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isBgShapeOpen}
                  onClick={() => setIsBgShapeOpen(!isBgShapeOpen)}
                  className="flex items-center justify-between py-2 text-xs font-bold text-[#0F1116] hover:text-[#7141E8] transition-colors"
                >
                  <span>Background Shape</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-[#8E8E93] transition-transform duration-150",
                      isBgShapeOpen && "rotate-90",
                    )}
                  />
                </button>

                {isBgShapeOpen && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { id: "none", label: "None" },
                      { id: "rounded-square", label: "Rounded" },
                      { id: "circle", label: "Circle" },
                    ].map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => setBgShape(shape.id as any)}
                        className={cn(
                          "py-2 text-xs font-semibold rounded-[10px] border transition-all hover:-translate-y-[1px] active:translate-y-0",
                          bgShape === shape.id
                            ? "bg-[#0F1116] text-white border-[#0F1116]"
                            : "bg-[#F7F7F8] border-[#E7E7EA] text-[#0F1116]",
                        )}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible: Transform */}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isTransformOpen}
                  onClick={() => setIsTransformOpen(!isTransformOpen)}
                  className="flex items-center justify-between py-2 text-xs font-bold text-[#0F1116] hover:text-[#7141E8] transition-colors"
                >
                  <span>Transform & Alignment</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-[#8E8E93] transition-transform duration-150",
                      isTransformOpen && "rotate-90",
                    )}
                  />
                </button>

                {isTransformOpen && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] hover:bg-[#F1F1F3] hover:-translate-y-[1px] active:translate-y-0"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{rotation}°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipH((prev) => !prev)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border text-xs font-semibold transition-all hover:-translate-y-[1px] active:translate-y-0",
                        flipH
                          ? "bg-[#0F1116] text-white border-[#0F1116]"
                          : "bg-[#F7F7F8] border-[#E7E7EA] text-[#0F1116] hover:bg-[#F1F1F3]",
                      )}
                      title="Flip horizontal"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip H</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipV((prev) => !prev)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border text-xs font-semibold transition-all hover:-translate-y-[1px] active:translate-y-0",
                        flipV
                          ? "bg-[#0F1116] text-white border-[#0F1116]"
                          : "bg-[#F7F7F8] border-[#E7E7EA] text-[#0F1116] hover:bg-[#F1F1F3]",
                      )}
                      title="Flip vertical"
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                      <span>Flip V</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible: Effects */}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isEffectsOpen}
                  onClick={() => setIsEffectsOpen(!isEffectsOpen)}
                  className="flex items-center justify-between py-2 text-xs font-bold text-[#0F1116] hover:text-[#7141E8] transition-colors"
                >
                  <span>Effects & Opacity</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-[#8E8E93] transition-transform duration-150",
                      isEffectsOpen && "rotate-90",
                    )}
                  />
                </button>

                {isEffectsOpen && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-[#0F1116]">
                      <span className="font-medium">Opacity</span>
                      <span className="font-mono text-[#7141E8]">
                        {opacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={opacity}
                      onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
                      className="w-full accent-[#7141E8] cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-xs text-[#0F1116] pt-1">
                      <span className="font-medium">Shadow</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: "none", label: "None" },
                        { id: "subtle", label: "Subtle" },
                        { id: "float", label: "Float" },
                        { id: "glow", label: "Glow" },
                      ].map((sh) => (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() => setShadow(sh.id as any)}
                          className={cn(
                            "py-1.5 text-[11px] font-semibold rounded-[8px] border text-center transition-all hover:-translate-y-[1px] active:translate-y-0",
                            shadow === sh.id
                              ? "bg-[#0F1116] text-white border-[#0F1116]"
                              : "bg-[#F7F7F8] border-[#E7E7EA] text-[#0F1116]",
                          )}
                        >
                          {sh.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* -------------------- 2. CENTRAL PANEL: PREVIEW & SIMILAR -------------------- */}
            <div className="mobile-icon-preview-panel order-1 lg:order-none min-w-0 overflow-visible lg:overflow-y-auto p-3 sm:p-6 md:p-8 flex flex-col items-center bg-[#FAFAFA]">
              {/* Large Preview Stage using CSS Grid-Paper Background */}
              <div
                className={cn(
                  "relative flex border border-[#E7E7EA] shadow-xs",
                  isIllustration
                    ? "w-full max-w-none h-[62dvh] min-h-[360px] max-h-[900px] items-start justify-start overflow-auto rounded-xl"
                    : "mobile-icon-preview-stage w-full max-w-xl h-[min(42dvh,360px)] min-h-[230px] md:h-auto md:aspect-4/3 items-center justify-center overflow-hidden rounded-[16px] md:rounded-[20px]",
                )}
                style={{
                  backgroundColor: isDark ? "#191B22" : "#FFFFFF",
                  backgroundImage: isIllustration
                    ? `radial-gradient(circle, ${isDark ? "#353842" : "#E7E7EA"} 1px, transparent 1px)`
                    : `radial-gradient(circle, ${isDark ? "#353842" : "#E7E7EA"} 1.25px, transparent 1.25px)`,
                  backgroundSize: isIllustration ? "16px 16px" : "20px 20px",
                }}
              >
                {/* Visual optical crosshair lines */}
                {!isIllustration && (
                  <>
                    <div className="absolute inset-8 border border-dashed border-[#E7E7EA]/70 pointer-events-none rounded-[14px]" />
                    <div className="absolute inset-y-0 w-[1px] bg-[#E7E7EA]/40 pointer-events-none" />
                    <div className="absolute inset-x-0 h-[1px] bg-[#E7E7EA]/40 pointer-events-none" />
                  </>
                )}

                {/* Rendered Icon Stage with applied transformations */}
                <div
                  className={cn(
                    isIllustration
                      ? "w-max h-max shrink-0 flex items-center justify-center p-6 transition-all duration-150"
                      : "max-w-[75vw] max-h-[34dvh] md:max-w-none md:max-h-none flex items-center justify-center p-4 sm:p-6 transition-all duration-150",
                    bgShape === "rounded-square" && "rounded-[24px]",
                    bgShape === "circle" && "rounded-full",
                  )}
                  style={{
                    backgroundColor: bgColor,
                    boxShadow: getShadowStyle(),
                    opacity: opacity / 100,
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  }}
                >
                  {isIllustration ? (
                    <div
                      className="block shrink-0 [&>svg]:block [&>svg]:max-w-none [&>svg]:max-h-none"
                      dangerouslySetInnerHTML={{
                        __html: illustrationMarkup(
                          icon.svg,
                          size,
                          illustrationHeight,
                        ),
                      }}
                    />
                  ) : (
                    <IconComponent
                      style={{
                        width: `${size * 2}px`,
                        height: `${size * 2}px`,
                        maxWidth: "70vw",
                        maxHeight: "34dvh",
                        color: fgColor,
                      }}
                      strokeWidth={strokeWidth}
                    />
                  )}
                </div>

                {/* Dimension Pill Badge */}
                <span className="absolute bottom-3 right-3 z-10 text-[10px] font-mono text-[#8E8E93] bg-white px-2 py-0.5 rounded-full border border-[#E7E7EA] shadow-2xs">
                  {isIllustration
                    ? `${size} × ${illustrationHeight}`
                    : `${size} × ${size}`}{" "}
                  px
                </span>
              </div>

              {/* Icon Info & Under-Preview Actions */}
              <div className="w-full max-w-xl flex flex-col gap-3 mt-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F1116] tracking-tight m-0">
                      {icon.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-[#7141E8] bg-[#7141E8]/10 px-2 py-0.5 rounded-full border border-[#7141E8]/20">
                        {icon.source}
                      </span>
                      <span className="text-[11px] font-medium text-[#8E8E93] bg-white px-2 py-0.5 rounded-full border border-[#E7E7EA]">
                        {icon.license}
                      </span>
                      <span className="text-[11px] font-medium text-[#8E8E93] bg-white px-2 py-0.5 rounded-full border border-[#E7E7EA]">
                        {icon.category}
                      </span>
                    </div>
                    {styleVariants.length > 1 && (
                      <div
                        className="flex items-center gap-1.5 mt-3 flex-wrap"
                        aria-label="Icon style variants"
                      >
                        <span className="text-[10px] font-medium text-[#85858D] mr-0.5">
                          Style
                        </span>
                        {styleVariants.map((variant) => (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => onSelectIcon(variant.id)}
                            aria-pressed={variant.id === icon.id}
                            className={cn(
                              "px-2.5 py-1 rounded-full border text-[10px] font-medium capitalize transition-colors",
                              variant.id === icon.id
                                ? "bg-[#7141E8] border-[#7141E8] text-white"
                                : "bg-white border-[#E7E7EA] text-[#66666E] hover:border-[#7141E8]/40 hover:text-[#7141E8]",
                            )}
                          >
                            {variant.style}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Button & Find Similar */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleSave(icon.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0",
                        isSaved
                          ? "bg-[#0F1116] text-white border-[#0F1116]"
                          : "bg-white hover:bg-[#F7F7F8] text-[#0F1116] border-[#E7E7EA]",
                      )}
                    >
                      <Bookmark
                        className={cn(
                          "w-3.5 h-3.5",
                          isSaved && "fill-current text-[#B89AFF]",
                        )}
                      />
                      <span>{isSaved ? "Saved" : "Save"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onFindSimilar?.(icon.category);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F7F7F8] text-xs font-semibold text-[#0F1116] border border-[#E7E7EA] transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
                    >
                      <Search className="w-3.5 h-3.5 text-[#7141E8]" />
                      <span>Find Similar</span>
                    </button>
                  </div>
                </div>

                {/* Similar Icons Row */}
                {similarIcons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E7E7EA]">
                    <span className="text-xs font-bold text-[#0F1116] uppercase tracking-wider">
                      Similar in {icon.category}
                    </span>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5 mt-2.5">
                      {similarIcons.map((sim) => {
                        const SimComp = sim.component;
                        return (
                          <button
                            key={sim.id}
                            type="button"
                            onClick={() => onSelectIcon(sim.id)}
                            className="group flex flex-col items-center justify-center p-3 rounded-[12px] bg-white border border-[#E7E7EA] hover:border-[#7141E8]/40 hover:shadow-xs transition-all hover:-translate-y-[1px] active:translate-y-0"
                          >
                            <SimComp className="w-5 h-5 text-[#0F1116] group-hover:scale-105 transition-transform" />
                            <span className="text-[10px] text-[#8E8E93] group-hover:text-[#0F1116] truncate max-w-full mt-1.5 font-medium">
                              {sim.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* “More icons matching [name]” Mini-Grid */}
                {matchingIcons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E7E7EA]">
                    <span className="text-xs font-bold text-[#0F1116] uppercase tracking-wider">
                      More Icons Matching {icon.name.split(" ")[0]}
                    </span>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2.5">
                      {matchingIcons.map((mat) => {
                        const MatComp = mat.component;
                        return (
                          <button
                            key={mat.id}
                            type="button"
                            onClick={() => onSelectIcon(mat.id)}
                            className="group flex flex-col items-center justify-center p-2.5 rounded-[12px] bg-white border border-[#E7E7EA] hover:border-[#7141E8]/40 hover:shadow-xs transition-all hover:-translate-y-[1px] active:translate-y-0"
                            title={mat.name}
                          >
                            <MatComp className="w-5 h-5 text-[#0F1116] group-hover:scale-105 transition-transform" />
                            <span className="text-[9px] text-[#8E8E93] group-hover:text-[#0F1116] truncate max-w-full mt-1 font-medium">
                              {mat.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* -------------------- 3. RIGHT PANEL: EXPORT & CODE -------------------- */}
            <div className="mobile-icon-export-panel order-2 lg:order-none border-t lg:border-t-0 lg:border-l border-[#E7E7EA] bg-white overflow-visible lg:overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1116] m-0">
                  Export
                </h3>
              </div>

              <div ref={exportActionsRef} className="flex w-full flex-wrap items-center gap-2">
                <div className="flex min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={handleCopySvg}
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 h-10 px-3 rounded-l-[11px] bg-[#7141E8] hover:bg-[#6031D4] text-white text-xs font-semibold transition-colors"
                  >
                    {hasCopiedSvg ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{hasCopiedSvg ? "Copied" : "Copy SVG"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSvgSplitOpen(!isSvgSplitOpen)}
                    aria-label="More copy options"
                    aria-expanded={isSvgSplitOpen}
                    className="w-9 h-10 shrink-0 bg-[#7141E8] hover:bg-[#6031D4] text-white rounded-r-[11px] border-l border-white/20 transition-colors flex items-center justify-center"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDownloadSvg();
                  }}
                  className="flex-1 min-w-0 flex items-center justify-center gap-2 h-10 px-3 rounded-[11px] border border-[#E1D9F6] bg-white hover:bg-[#F8F6FF] text-[#4E2CAF] text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Download SVG</span>
                </button>
                {isSvgSplitOpen && (
                  <div
                    role="menu"
                    aria-label="Copy code format"
                    className="w-full rounded-[14px] border border-[#E7E7EA] bg-white p-1.5 shadow-[var(--shadow-dropdown)]"
                  >
                    <DropdownSectionLabel>Copy Format</DropdownSectionLabel>
                    <DropdownItem
                      icon={<Copy className="h-3.5 w-3.5 text-[#7141E8]" />}
                      description="Inline vector markup with custom attributes"
                      meta={<span className="font-mono text-[10px]">&lt;svg&gt;</span>}
                      onClick={handleCopySvg}
                    >
                      Copy SVG Markup
                    </DropdownItem>
                    <DropdownItem
                      icon={<Code2 className="h-3.5 w-3.5 text-[#7141E8]" />}
                      description="Ready-to-use React component snippet"
                      meta={<span className="font-mono text-[10px]">JSX</span>}
                      onClick={handleCopyJsx}
                    >
                      Copy React JSX
                    </DropdownItem>
                  </div>
                )}
              </div>

              {/* PNG Format Control & Size Dropdown */}
              <div className="flex flex-col gap-2 p-3.5 rounded-[14px] bg-[#F7F7F8] border border-[#E7E7EA]">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <label htmlFor="png-scale-select">PNG Export</label>
                  <span className="font-mono text-[10px] font-medium text-[#8E8E93]">Raster</span>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownSelect
                    id="png-scale-select"
                    ariaLabel="PNG export resolution"
                    value={pngScale}
                    onChange={setPngScale}
                    className="flex-1"
                    menuWidthClassName="w-52"
                    options={[
                      { value: "1x (24px)", label: "1x (24px)", meta: "24×24" },
                      { value: "2x (48px)", label: "2x (48px)", meta: "48×48" },
                      { value: "4x (96px)", label: "4x (96px)", meta: "96×96" },
                      { value: "8x (192px)", label: "8x (192px)", meta: "192×192" },
                      { value: "512px (High Res)", label: "512px", meta: "High Res" },
                    ]}
                  />

                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    className="px-3.5 h-9 rounded-[10px] bg-white hover:bg-[#F1F1F3] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] transition-all hover:-translate-y-[1px] active:translate-y-0 shadow-2xs"
                  >
                    Download PNG
                  </button>
                </div>
              </div>

              {/* Read-Only SVG Code Preview */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <span>SVG</span>
                  <button
                    type="button"
                    onClick={handleCopySvg}
                    className="text-[11px] font-semibold text-[#7141E8] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>

                <div className="relative rounded-[12px] bg-[#0F1116] text-[#F1F1F3] p-3 text-[11px] font-mono overflow-x-auto max-h-36 no-scrollbar border border-black/10">
                  <pre className="m-0 leading-relaxed whitespace-pre-wrap break-all">
                    {generatedSvg}
                  </pre>
                </div>
              </div>

              {/* License & Source */}
              <div className="p-3.5 rounded-[12px] bg-[#F7F7F8] border border-[#E7E7EA] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F1116] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#2EA45B]" />
                    <span>License</span>
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#0F1116]">
                    {icon.license}
                  </span>
                </div>

                <p className="text-[11px] text-[#8E8E93] m-0 leading-normal">
                  {icon.author
                    ? `${icon.author} · ${icon.source}`
                    : icon.source}
                </p>
              </div>
            </div>
          </div>
          <div className="mobile-detail-actionbar" aria-label="Icon actions">
            <button type="button" onClick={() => onToggleSave(icon.id)} className="mobile-detail-action-secondary">
              <Bookmark aria-hidden="true" />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
            <button type="button" onClick={handleCopySvg} className="mobile-detail-action-secondary">
              {hasCopiedSvg ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              <span>{hasCopiedSvg ? "Copied" : "Copy SVG"}</span>
            </button>
            <button type="button" onClick={handleDownloadSvg} className="mobile-detail-action-primary">
              <Download aria-hidden="true" />
              <span>Download SVG</span>
            </button>
          </div>
        </motion.div>

        {/* Floating Toast Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-6 right-6 z-60 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F1116] text-white text-xs font-semibold shadow-2xl border border-white/10"
              role="status"
              aria-live="polite"
            >
              <div className="w-4 h-4 rounded-full bg-[#2EA45B] flex items-center justify-center text-white shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
