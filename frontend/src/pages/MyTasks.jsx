import React, { useState } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useTasksStore } from "../hooks/useTasksStore";
import { useMasterData } from "../hooks/useMasterData";
import { fmtDate, daysUntil } from "../data/mockData";
import { BRAND } from "../theme";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import TaskFormModal from "../components/tasks/TaskFormModal";

export default function MyTasks() {
  const { c } = useTheme();
  const { user, can } = useAuth();
  const { tasks, projects, openTask } = useTasksStore();
  const { priorityColor, taskStatusColor, taskStatusLabel } = useMasterData();
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const mine = tasks.filter((t) => t.assignees?.includes(user?.id));
  const filters = {
    All: mine,
    Today: mine.filter((t) => daysUntil(t.dueDate) === 0),
    Upcoming: mine.filter((t) => daysUntil(t.dueDate) > 0 && t.status !== "done"),
    Overdue: mine.filter((t) => daysUntil(t.dueDate) < 0 && t.status !== "done"),
    Completed: mine.filter((t) => t.status === "done"),
  };
  const rows = filters[filter];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: c.textStrong }}>My Tasks</h1>
          <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>Everything assigned to you, in one list.</p>
        </div>
        {can("task:create") && (
          <Button icon={Plus} onClick={() => setModalOpen(true)}>New Task</Button>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {Object.keys(filters).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium"
            style={{
              background: filter === f ? BRAND.primary : c.card,
              color: filter === f ? "#fff" : c.text,
              border: `1px solid ${filter === f ? BRAND.primary : c.border}`,
            }}
          >
            {f} <span style={{ opacity: 0.75 }}>({filters[f].length})</span>
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              {["Task", "Project", "Priority", "Status", "Due Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: c.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const proj = projects.find((p) => p.id === t.projectId);
              const overdue = daysUntil(t.dueDate) < 0 && t.status !== "done";
              return (
                <tr
                  key={t.id}
                  onClick={() => openTask(t.id)}
                  className="cursor-pointer"
                  style={{ borderBottom: `1px solid ${c.border}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-4 py-3 font-medium flex items-center gap-2" style={{ color: c.textStrong }}>
                    {t.status === "done" ? <CheckCircle2 size={15} color={BRAND.success} /> : <Circle size={15} style={{ color: c.muted }} />}
                    {t.title}
                  </td>
                  <td className="px-4 py-3" style={{ color: c.text }}>{proj?.name}</td>
                  <td className="px-4 py-3"><Badge color={priorityColor(t.priority)}>{t.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge color={taskStatusColor(t.status)}>{taskStatusLabel(t.status)}</Badge></td>
                  <td className="px-4 py-3" style={{ color: overdue ? BRAND.danger : c.text }}>{fmtDate(t.dueDate)}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[13px]" style={{ color: c.muted }}>
                  No tasks here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultAssignee={user?.id}
      />
    </div>
  );
}
