import React from "react";

export default function Badge({ color, children, soft = true }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[7px] text-[11px] font-medium whitespace-nowrap"
      style={{ background: soft ? color + "1A" : color, color: soft ? color : "#fff" }}
    >
      {children}
    </span>
  );
}
