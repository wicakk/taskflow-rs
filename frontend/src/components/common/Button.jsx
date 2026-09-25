import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { BRAND } from "../../theme";

export default function Button({ children, variant = "primary", onClick, className = "", icon: Icon, type = "button", disabled = false }) {
  const { c } = useTheme();
  const styles = {
    primary: { background: BRAND.primary, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: c.text, border: `1px solid ${c.border}` },
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-150 active:scale-[0.98] ${className}`}
      style={{ ...styles, opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = variant === "primary" ? BRAND.primaryHover : c.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variant === "primary" ? BRAND.primary : "transparent";
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}
