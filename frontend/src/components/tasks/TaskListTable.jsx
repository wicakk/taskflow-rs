import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { useTasksStore } from "../../hooks/useTasksStore";
import { useMasterData } from "../../hooks/useMasterData";
import { memberById, fmtDate } from "../../data/mockData";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Avatar from "../common/Avatar";

export default function TaskListTable({ tasks, openTask }) {
  const { c } = useTheme();
  const { teamMembers } = useTasksStore();
  const { priorityColor, taskStatusColor, taskStatusLabel } = useMasterData();
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr style={{ borderBottom: `1px solid ${c.border}` }}>
            {["Task", "Status", "Priority", "Assignee", "Due Date"].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: c.muted }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => {
            const m = memberById(teamMembers, t.assignee);
            return (
              <tr
                key={t.id}
                onClick={() => openTask(t.id)}
                className="cursor-pointer"
                style={{ borderBottom: `1px solid ${c.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3 font-medium" style={{ color: c.textStrong }}>{t.title}</td>
                <td className="px-4 py-3"><Badge color={taskStatusColor(t.status)}>{taskStatusLabel(t.status)}</Badge></td>
                <td className="px-4 py-3"><Badge color={priorityColor(t.priority)}>{t.priority}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar initials={m.initials} size={22} />
                    <span style={{ color: c.text }}>{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3" style={{ color: c.text }}>{fmtDate(t.dueDate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
