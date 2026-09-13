import React from "react";
import { Plus } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import KanbanTaskCard from "./KanbanTaskCard";

export default function KanbanColumn({ column, color, tasks, onDrop, onDragStart, openTask, canMove = true, onAddTask }) {
  const { c, dark } = useTheme();

  return (
    <div
      onDragOver={(e) => canMove && e.preventDefault()}
      onDrop={onDrop}
      className="rounded-[14px] p-3 flex flex-col"
      style={{ background: dark ? "#171E2B" : "#F0EFF7", minHeight: 200 }}
    >
      <div className="flex items-center justify-between px-1 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-[13px] font-semibold" style={{ color: c.textStrong }}>{column.label}</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ background: c.card, color: c.muted }}>
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button onClick={onAddTask} style={{ color: c.muted }}>
            <Plus size={15} />
          </button>
        )}
      </div>
      <div className="space-y-2.5 flex-1">
        {tasks.map((t) => (
          <div
            key={t.id}
            draggable={canMove}
            onDragStart={() => canMove && onDragStart(t.id)}
            onClick={() => openTask(t.id)}
            className={canMove ? "" : "cursor-pointer"}
          >
            <KanbanTaskCard task={t} />
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-[12px] text-center py-6 rounded-[10px] border border-dashed" style={{ color: c.muted, borderColor: c.border }}>
            Drop task here
          </div>
        )}
      </div>
    </div>
  );
}
