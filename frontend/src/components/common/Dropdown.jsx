import React, { useEffect, useRef } from "react";
import { useTheme } from "../../hooks/useTheme";

// Simple positioned dropdown panel. Renders `children` inside a floating
// card anchored below its trigger, and closes on outside click.
export default function Dropdown({ open, onClose, align = "right", width = 288, children }) {
  const ref = useRef(null);
  const { c } = useTheme();

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 rounded-[12px] shadow-lg overflow-hidden z-40`}
      style={{ background: c.card, border: `1px solid ${c.border}`, width }}
    >
      {children}
    </div>
  );
}
