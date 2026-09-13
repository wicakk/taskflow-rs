import React from "react";
import { FolderKanban, Calendar as CalIcon2, Pencil, Trash2 } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useTasksStore } from "../../hooks/useTasksStore";
import { useMasterData } from "../../hooks/useMasterData";
import { memberById, fmtDate } from "../../data/mockData";
import { projectColors } from "../../theme";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Avatar from "../common/Avatar";
import ProgressBar from "../common/ProgressBar";
import MenuButton from "../common/MenuButton";

export default function ProjectCard({ project, idx, tasks, onClick, onEdit, onDelete }) {
  const { c } = useTheme();
  const { teamMembers } = useTasksStore();
  const { projectStatusColor, priorityColor } = useMasterData();
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const done = projectTasks.filter((t) => t.status === "done").length;
  const color = projectColors[idx % projectColors.length];

  return (
    <Card className="p-5 cursor-pointer transition-shadow hover:shadow-md">
      <div onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: color + "1A" }}>
            <FolderKanban size={17} color={color} />
          </div>
          <MenuButton
            items={[
              onEdit && { label: "Edit Project", icon: Pencil, onClick: onEdit },
              onDelete && { label: "Delete Project", icon: Trash2, danger: true, onClick: onDelete },
            ].filter(Boolean)}
          />
        </div>
        <div className="font-semibold text-[14.5px] mb-1" style={{ color: c.textStrong }}>{project.name}</div>
        <p className="text-[12.5px] mb-4 line-clamp-2" style={{ color: c.muted }}>{project.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <Badge color={projectStatusColor(project.status)}>{project.status}</Badge>
          <Badge color={priorityColor(project.priority)}>{project.priority}</Badge>
          {project.department && <Badge color="#9CA3AF">{project.department}</Badge>}
        </div>

        <div className="mb-3.5">
          <div className="flex justify-between text-[11.5px] mb-1.5" style={{ color: c.muted }}>
            <span>Progress</span>
            <span style={{ color: c.textStrong, fontWeight: 600 }}>{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 4).map((id) => (
              <Avatar key={id} initials={memberById(teamMembers, id).initials} size={26} />
            ))}
          </div>
          <div className="text-[11.5px]" style={{ color: c.muted }}>
            {done}/{projectTasks.length} tasks
          </div>
        </div>
        <div className="mt-3 pt-3 flex items-center gap-1.5 text-[11.5px]" style={{ borderTop: `1px solid ${c.border}`, color: c.muted }}>
          <CalIcon2 size={12} /> Due {fmtDate(project.dueDate)}
        </div>
      </div>
    </Card>
  );
}
