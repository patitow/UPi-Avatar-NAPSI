import { useEffect, useRef, type RefObject } from "react";
import { useFocusTrap } from "./useFocusTrap";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModalFocus(
  isOpen: boolean,
  onClose: () => void,
): RefObject<HTMLDivElement | null> {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        const root = panelRef.current;
        if (!root) return;
        const first = root.querySelector<HTMLElement>(FOCUSABLE);
        first?.focus();
      });
      return;
    }
    returnFocusRef.current?.focus?.();
    returnFocusRef.current = null;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return panelRef;
}
