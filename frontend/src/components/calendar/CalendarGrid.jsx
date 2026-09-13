import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { useMasterData } from "../../hooks/useMasterData";
import { TODAY } from "../../data/mockData";
import { BRAND } from "../../theme";
import Card from "../common/Card";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarGrid({ year, month, tasks, openTask }) {
  const { c, dark } = useTheme();
  const { priorityColor } = useMasterData();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const tasksOnDay = (d) =>
    tasks.filter((t) => {
      const dt = new Date(t.dueDate);
      return dt.getFullYear() === year && dt.getMonth() === month && dt.getDate() === d;
    });

  const isToday = (d) => d === TODAY.getDate() && month === TODAY.getMonth() && year === TODAY.getFullYear();

  return (
    <Card className="p-3 md:p-4">
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-[11.5px] font-medium py-2" style={{ color: c.muted }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          const dayTasks = d ? tasksOnDay(d) : [];
          const today = d && isToday(d);
          return (
            <div
              key={i}
              className="rounded-[10px] p-1.5 min-h-[84px]"
              style={{
                background: today ? (dark ? BRAND.primarySoftDark : BRAND.primarySoftLight) : c.bg,
                border: `1px solid ${c.border}`,
              }}
            >
              {d && (
                <div className="text-[11.5px] font-medium mb-1" style={{ color: today ? BRAND.primary : c.text }}>
                  {d}
                </div>
              )}
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => openTask(t.id)}
                    className="text-[10px] px-1.5 py-[3px] rounded-md truncate cursor-pointer"
                    style={{ background: priorityColor(t.priority) + "1A", color: priorityColor(t.priority) }}
                  >
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-[10px]" style={{ color: c.muted }}>
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
