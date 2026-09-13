import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { BRAND } from "../../theme";
import Button from "./Button";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  const { c } = useTheme();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-[14px] p-5" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: BRAND.danger + "1A" }}>
            <AlertTriangle size={17} color={BRAND.danger} />
          </div>
          <div>
            <div className="text-[14.5px] font-semibold" style={{ color: c.textStrong }}>{title}</div>
            <p className="text-[12.5px] mt-1" style={{ color: c.muted }}>{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <button
            onClick={onConfirm}
            className="px-3.5 py-2 rounded-[10px] text-[13px] font-medium text-white"
            style={{ background: BRAND.danger }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
