import React from "react";
import { useTheme } from "../../hooks/useTheme";

export default function Input({ icon: Icon, className = "", style = {}, ...props }) {
  const { c } = useTheme();
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.muted }} />}
      <input
        {...props}
        className="w-full rounded-[10px] py-2 text-[13px] outline-none"
        style={{
          background: c.card,
          border: `1px solid ${c.border}`,
          color: c.text,
          paddingLeft: Icon ? 32 : 12,
          paddingRight: 12,
          ...style,
        }}
      />
    </div>
  );
}
