import React from "react";
import { useTheme } from "../../hooks/useTheme";

export default function Card({ children, className = "", style = {}, onClick }) {
  const { c } = useTheme();
  return (
    <div
      onClick={onClick}
      className={`rounded-[14px] ${className}`}
      style={{ background: c.card, border: `1px solid ${c.border}`, boxShadow: "0 1px 3px rgba(16,15,40,0.04)", ...style }}
    >
      {children}
    </div>
  );
}
