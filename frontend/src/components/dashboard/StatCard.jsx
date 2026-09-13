import React from "react";
import { useTheme } from "../../hooks/useTheme";
import Card from "../common/Card";

export default function StatCard({ label, value, icon: Icon, color }) {
  const { c } = useTheme();
  return (
    <Card className="p-4">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3" style={{ background: color + "1A" }}>
        <Icon size={17} color={color} />
      </div>
      <div className="text-[22px] font-bold" style={{ color: c.textStrong }}>{value}</div>
      <div className="text-[12px] mt-0.5" style={{ color: c.muted }}>{label}</div>
    </Card>
  );
}
