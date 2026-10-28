import { useEffect } from "react";

/** Prevent the workspace behind an open modal drawer from scrolling or receiving focus. */
export function useOverlayScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const root = document.documentElement;
    const body = document.body;
    const workspace = document.querySelector<HTMLElement>(".app-grid-shell");
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const wasInert = workspace?.inert ?? false;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (workspace) workspace.inert = true;

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      if (workspace) workspace.inert = wasInert;
    };
  }, [isOpen]);
}
