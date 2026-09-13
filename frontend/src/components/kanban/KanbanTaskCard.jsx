import React from "react";
import { CheckSquare, MessageSquare, Paperclip, Clock } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useTasksStore } from "../../hooks/useTasksStore";
import { useMasterData } from "../../hooks/useMasterData";
import { memberById, fmtDate, daysUntil } from "../../data/mockData";
import { BRAND } from "../../theme";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Avatar from "../common/Avatar";

export default function KanbanTaskCard({ task }) {
  const { c } = useTheme();
  const { teamMembers } = useTasksStore();
  const { priorityColor, labelColor } = useMasterData();
  const m = memberById(teamMembers, task.assignee);
  const checkedCount = task.checklist.filter((x) => x.done).length;
  const overdue = daysUntil(task.dueDate) < 0 && task.status !== "done";

  return (
    <Card className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <Badge color={priorityColor(task.priority)}>{task.priority}</Badge>
        {task.labels[0] && (
          <span className="text-[10.5px] px-1.5 py-[2px] rounded-md" style={{ background: labelColor(task.labels[0]) + "1A", color: labelColor(task.labels[0]) }}>
            {task.labels[0]}
          </span>
        )}
      </div>
      <div className="text-[13px] font-medium mb-3 leading-snug" style={{ color: c.textStrong }}>
        {task.title}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[11px]" style={{ color: c.muted }}>
          {task.checklist.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare size={12} />
              {checkedCount}/{task.checklist.length}
            </span>
          )}
          {task.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip size={12} />
              {task.attachments}
            </span>
          )}
        </div>
        <Avatar initials={m.initials} size={24} />
      </div>
      <div className="flex items-center gap-1 mt-2 text-[10.5px]" style={{ color: overdue ? BRAND.danger : c.muted }}>
        <Clock size={11} /> {fmtDate(task.dueDate)}
      </div>
    </Card>
  );
}
