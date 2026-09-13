import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

// A side drawer (slides in from the right) used for ALL forms in the app
// (New Project, New Task, Add Member, New Announcement, ...) instead of a
// centered popup — consistent with the Task Detail drawer's UX.
export default function Modal({ open, title, onClose, children, width = 480 }) {
  const { c } = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf);
    }
    setShow(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[55] flex items-stretch justify-end">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300"
        style={{ opacity: show ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="relative w-full h-full overflow-y-auto transition-transform duration-300 ease-out"
        style={{
          background: c.card,
          maxWidth: width,
          borderLeft: `1px solid ${c.border}`,
          boxShadow: "-8px 0 24px rgba(16,15,40,0.08)",
          transform: show ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-16 sticky top-0 z-10" style={{ background: c.card, borderBottom: `1px solid ${c.border}` }}>
          <div className="text-[15px] font-semibold" style={{ color: c.textStrong }}>{title}</div>
          <button onClick={onClose} className="p-1.5 rounded-md" style={{ color: c.muted }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
