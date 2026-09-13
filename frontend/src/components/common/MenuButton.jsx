import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { BRAND } from "../../theme";
import Dropdown from "./Dropdown";

// items: [{ label, icon: LucideIcon, danger?: bool, onClick: () => void }]
export default function MenuButton({ items, align = "right" }) {
  const { c } = useTheme();
  const [open, setOpen] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setOpen((v) => !v)} className="p-1 rounded-md" style={{ color: c.muted }}>
        <MoreHorizontal size={17} />
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} align={align} width={168}>
        <div className="py-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className="w-full flex items-center gap-2 text-left px-3.5 py-2 text-[12.5px]"
                style={{ color: item.danger ? BRAND.danger : c.text }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {Icon && <Icon size={14} />}
                {item.label}
              </button>
            );
          })}
        </div>
      </Dropdown>
    </div>
  );
}
