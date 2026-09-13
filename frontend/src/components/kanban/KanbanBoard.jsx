import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMasterData } from "../../hooks/useMasterData";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({ tasks, openTask, updateTaskStatus, onAddTask }) {
  const [dragId, setDragId] = useState(null);
  const { can } = useAuth();
  const { taskStatuses } = useMasterData();
  const canMove = can("task:move");

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))` }}
    >
      {taskStatuses.map((col) => (
        <KanbanColumn
          key={col.key}
          column={{ key: col.key, label: col.name }}
          color={col.color}
          tasks={tasks.filter((t) => t.status === col.key)}
          canMove={canMove}
          onDragStart={setDragId}
          onDrop={() => {
            if (canMove && dragId) updateTaskStatus(dragId, col.key);
            setDragId(null);
          }}
          openTask={openTask}
          onAddTask={onAddTask ? () => onAddTask(col.key) : undefined}
        />
      ))}
    </div>
  );
}
