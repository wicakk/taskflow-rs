import React from "react";
import { Check } from "lucide-react";

const PRESET_COLORS = [
  "#7367F0", "#28C76F", "#FF9F43", "#EA5455", "#00CFE8",
  "#9B8AFB", "#5E5873", "#FF6B9D", "#4ECDC4", "#9CA3AF",
];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((color) => (
        <button
          type="button"
          key={color}
          onClick={() => onChange(color)}
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: color }}
        >
          {value === color && <Check size={14} color="#fff" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}
