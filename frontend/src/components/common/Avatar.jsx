import React from "react";

const hues = ["#7367F0", "#28C76F", "#FF9F43", "#00CFE8", "#EA5455", "#9B8AFB", "#5E5873"];

export default function Avatar({ initials = "?", size = 30, online }) {
  const hue = hues[(initials.charCodeAt(0) || 0) % hues.length];
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-semibold text-white"
        style={{ background: hue, fontSize: size * 0.36 }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2"
          style={{
            width: size * 0.32,
            height: size * 0.32,
            background: online ? "#28C76F" : "#9CA3AF",
            borderColor: "#fff",
          }}
        />
      )}
    </div>
  );
}
