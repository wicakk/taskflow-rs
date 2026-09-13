import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useTasksStore } from "../hooks/useTasksStore";
import { TODAY } from "../data/mockData";
import CalendarGrid from "../components/calendar/CalendarGrid";

export default function CalendarPage() {
  const { c } = useTheme();
  const { tasks, openTask } = useTasksStore();
  const [monthOffset, setMonthOffset] = useState(0);

  const base = new Date(TODAY.getFullYear(), TODAY.getMonth() + monthOffset, 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const monthName = base.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: c.textStrong }}>Calendar</h1>
          <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>Track project and task deadlines.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMonthOffset((m) => m - 1)} className="p-2 rounded-[10px]" style={{ border: `1px solid ${c.border}`, color: c.text }}>
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13.5px] font-semibold w-40 text-center" style={{ color: c.textStrong }}>{monthName}</span>
          <button onClick={() => setMonthOffset((m) => m + 1)} className="p-2 rounded-[10px]" style={{ border: `1px solid ${c.border}`, color: c.text }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <CalendarGrid year={year} month={month} tasks={tasks} openTask={openTask} />
    </div>
  );
}
