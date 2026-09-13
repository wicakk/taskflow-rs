import React from "react";
import { useTheme } from "../../hooks/useTheme";

export default function Select({ children, className = "", ...props }) {
  const { c } = useTheme();
  return (
    <select
      {...props}
      className={`w-full text-[12.5px] font-medium rounded-[8px] px-2.5 py-1.5 outline-none ${className}`}
      style={{ border: `1px solid ${c.border}`, background: c.bg, color: c.textStrong }}
    >
      {children}
    </select>
  );
}
