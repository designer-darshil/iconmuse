import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { MobileDrawerProps } from "../../types";
import { BrandLogo } from "../common/BrandLogo";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";

const destinations = [
  { id: "discover", title: "Browse", detail: "Find icons and illustrations" },
  { id: "collections", title: "Packs", detail: "Explore curated collections" },
  { id: "saved", title: "Saved", detail: "Your saved icons" },
  { id: "extensions", title: "Libraries", detail: "Browse icon providers" },
  {
    id: "help",
    title: "Help & docs",
    detail: "Learn your way around IconMuse",
  },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeNavId,
  onSelectNav,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  useOverlayScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    drawerRef.current
      ?.querySelector<HTMLButtonElement>(
        'button[aria-label="Close navigation menu"]',
      )
      ?.focus();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus?.();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="mobile-more-overlay fixed inset-0 z-50 flex justify-end">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F1116]/40 backdrop-blur-[2px]"
          />

          <motion.section
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.22,
              ease: "easeOut",
            }}
            className="mobile-navigation-drawer relative z-10 flex h-full flex-col overflow-y-auto border-l border-[#E7E7EA] bg-white shadow-2xl"
          >
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#E7E7EA] px-4">
              <a
                href="/"
                aria-label="IconMuse home"
                className="flex items-center gap-2.5 no-underline"
              >
                <BrandLogo className="h-7 w-7 object-contain" />
                <span className="text-base font-bold tracking-tight text-[#0F1116]">
                  Menu
                </span>
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#6B6B73] hover:bg-[#F7F7F8]"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <nav
              aria-label="Main menu"
              className="flex flex-col px-4 pb-3 pt-4"
            >
              <p className="mb-2 px-1 text-xs font-semibold text-[#777780]">
                Your workspace
              </p>
              {destinations.map(({ id, title, detail }) => {
                const selected = activeNavId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onSelectNav(id);
                      onClose();
                    }}
                    aria-current={selected ? "page" : undefined}
                    className={`mobile-nav-destination flex min-h-[60px] items-center justify-between rounded-xl border-0 px-3 text-left transition-colors ${selected ? "is-active text-[#7141E8]" : "text-[#0F1116] hover:text-[#7141E8]"}`}
                  >
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[15px] font-semibold">{title}</span>
                      <span className="truncate text-xs text-[#6B6B73]">
                        {detail}
                      </span>
                    </span>
                    {selected && (
                      <span
                        className="mr-1 h-1.5 w-1.5 rounded-full bg-[#7141E8]"
                        aria-label="Current page"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* <footer className="mt-auto flex items-center justify-between border-t border-[#E7E7EA] px-4 py-3 text-xs text-[#6B6B73]">
              <a
                href="/design-system"
                className="flex min-h-[44px] items-center gap-2 font-semibold text-[#0F1116] no-underline hover:text-[#7141E8]"
              >
                <Layers className="h-3.5 w-3.5 text-[#7141E8]" aria-hidden="true" />
                Design System
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center gap-2 hover:text-[#0F1116]">
                GitHub
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </footer> */}
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
};
