import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { BRAND } from "../../theme";

export default function ProgressBar({ value, color = BRAND.primary, height = 6 }) {
  const { c } = useTheme();
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: c.border, height }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}
