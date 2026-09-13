import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { fmtDate } from "../../data/mockData";
import { BRAND } from "../../theme";
import Card from "../common/Card";

const phases = [
  { name: "Analysis", start: 0, len: 15, color: BRAND.info },
  { name: "Development", start: 12, len: 35, color: BRAND.primary },
  { name: "Testing", start: 45, len: 20, color: BRAND.warning },
  { name: "UAT", start: 62, len: 15, color: BRAND.success },
  { name: "Deployment", start: 85, len: 12, color: BRAND.danger },
];

export default function ProjectTimeline({ project }) {
  const { c } = useTheme();
  return (
    <Card className="p-5">
      <div className="font-semibold text-[14px] mb-5" style={{ color: c.textStrong }}>
        {project.name} — Timeline
      </div>
      <div className="space-y-4">
        {phases.map((p) => (
          <div key={p.name} className="flex items-center gap-4">
            <div className="w-28 text-[12.5px] shrink-0" style={{ color: c.text }}>{p.name}</div>
            <div className="flex-1 h-6 rounded-full relative" style={{ background: c.bg }}>
              <div
                className="absolute top-0 h-6 rounded-full flex items-center px-2"
                style={{ left: `${p.start}%`, width: `${p.len}%`, background: p.color + "26" }}
              >
                <div className="w-full h-1.5 rounded-full" style={{ background: p.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3 text-[11px]" style={{ color: c.muted }}>
        <span>{fmtDate(project.startDate)}</span>
        <span>{fmtDate(project.dueDate)}</span>
      </div>
    </Card>
  );
}
