import React from "react";
import { useTheme } from "../../hooks/useTheme";

export default function Textarea({ className = "", style = {}, ...props }) {
  const { c } = useTheme();
  return (
    <textarea
      {...props}
      className={`w-full rounded-[10px] px-3 py-2 text-[13px] outline-none resize-none ${className}`}
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, ...style }}
    />
  );
}
