import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Settings, Trash2, Plus } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useTasksStore } from "../hooks/useTasksStore";
import { memberById, fmtDate } from "../data/mockData";
import { useMasterData } from "../hooks/useMasterData";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Avatar from "../components/common/Avatar";
import ProgressBar from "../components/common/ProgressBar";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TaskListTable from "../components/tasks/TaskListTable";
import ProjectTimeline from "../components/projects/ProjectTimeline";
import ProjectFormModal from "../components/projects/ProjectFormModal";
import TaskFormModal from "../components/tasks/TaskFormModal";
import ChatPanel from "../components/chat/ChatPanel";

const tabs = ["Board", "List", "Timeline", "Chat", "Calendar", "Files", "Activity"];

function ComingSoon({ label }) {
  const { c } = useTheme();
  return (
    <Card className="p-16 flex flex-col items-center justify-center text-center">
      <Settings size={28} style={{ color: c.muted }} className="mb-3" />
      <div className="text-[15px] font-semibold" style={{ color: c.textStrong }}>{label} is on the way</div>
      <div className="text-[13px] mt-1" style={{ color: c.muted }}>This section isn't built yet in this preview.</div>
    </Card>
  );
}

export default function ProjectDetail() {
  const { c } = useTheme();
  const { can } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, teamMembers, openTask, updateTaskStatus, deleteProject, chatForProject } = useTasksStore();
  const { projectStatusColor, priorityColor, taskStatuses } = useMasterData();
  const [tab, setTab] = useState("board");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskModal, setTaskModal] = useState(null); // { status } | null

  const project = projects.find((p) => p.id === id);
  if (!project) {
    return (
      <Card className="p-10 text-center">
        <p style={{ color: c.muted }}>Project not found.</p>
      </Card>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  return (
    <div className="space-y-5">
      <button onClick={() => navigate("/projects")} className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: c.muted }}>
        <ChevronLeft size={14} /> Back to Projects
      </button>

      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[19px] font-bold" style={{ color: c.textStrong }}>{project.name}</h1>
              <Badge color={projectStatusColor(project.status)}>{project.status}</Badge>
              <Badge color={priorityColor(project.priority)}>{project.priority}</Badge>
            </div>
            <p className="text-[13px] mt-1" style={{ color: c.muted }}>{project.description}</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex -space-x-2">
              {project.members.map((memberId) => (
                <Avatar key={memberId} initials={memberById(teamMembers, memberId).initials} size={30} />
              ))}
            </div>
            {can("project:edit") && (
              <button onClick={() => setEditOpen(true)} className="p-2 rounded-[10px]" style={{ border: `1px solid ${c.border}`, color: c.muted }}>
                <Settings size={15} />
              </button>
            )}
            {can("project:delete") && (
              <button onClick={() => setDeleteOpen(true)} className="p-2 rounded-[10px]" style={{ border: `1px solid ${c.border}`, color: "#EA5455" }}>
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
          <div>
            <div className="text-[11px]" style={{ color: c.muted }}>Start Date</div>
            <div className="text-[13px] font-medium mt-0.5" style={{ color: c.text }}>{fmtDate(project.startDate)}</div>
          </div>
          <div>
            <div className="text-[11px]" style={{ color: c.muted }}>Due Date</div>
            <div className="text-[13px] font-medium mt-0.5" style={{ color: c.text }}>{fmtDate(project.dueDate)}</div>
          </div>
          <div>
            <div className="text-[11px]" style={{ color: c.muted }}>Tasks</div>
            <div className="text-[13px] font-medium mt-0.5" style={{ color: c.text }}>{projectTasks.length} total</div>
          </div>
          <div className="min-w-[120px]">
            <div className="text-[11px]" style={{ color: c.muted }}>Progress</div>
            <div className="flex items-center gap-2 mt-1.5">
              <ProgressBar value={project.progress} />
              <span className="text-[12px] font-semibold" style={{ color: c.textStrong }}>{project.progress}%</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto pb-0.5 flex-1" style={{ borderBottom: `1px solid ${c.border}` }}>
          {tabs.map((t) => {
            const key = t.toLowerCase();
            const active = tab === key;
            const chatCount = key === "chat" ? chatForProject(project.id).length : 0;
            return (
              <button
                key={t}
                onClick={() => setTab(key)}
                className="px-4 py-2.5 text-[13px] font-medium whitespace-nowrap relative flex items-center gap-1.5"
                style={{ color: active ? "#7367F0" : c.muted }}
              >
                {t}
                {key === "chat" && chatCount > 0 && (
                  <span className="text-[10px] px-1.5 py-[1px] rounded-full" style={{ background: active ? "#7367F0" : c.border, color: active ? "#fff" : c.muted }}>
                    {chatCount}
                  </span>
                )}
                {active && <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full" style={{ background: "#7367F0" }} />}
              </button>
            );
          })}
        </div>
        {tab === "board" && can("task:create") && (
          <Button icon={Plus} onClick={() => setTaskModal({ status: taskStatuses[0]?.key })} className="shrink-0 mb-0.5">
            Add Task
          </Button>
        )}
      </div>

      {tab === "board" && (
        <KanbanBoard
          tasks={projectTasks}
          openTask={openTask}
          updateTaskStatus={updateTaskStatus}
          onAddTask={can("task:create") ? (status) => setTaskModal({ status }) : undefined}
        />
      )}
      {tab === "list" && <TaskListTable tasks={projectTasks} openTask={openTask} />}
      {tab === "timeline" && <ProjectTimeline project={project} />}
      {tab === "chat" && <ChatPanel projectId={project.id} />}
      {["calendar", "files", "activity"].includes(tab) && <ComingSoon label={tab[0].toUpperCase() + tab.slice(1)} />}

      <ProjectFormModal open={editOpen} onClose={() => setEditOpen(false)} project={project} />

      <TaskFormModal
        open={!!taskModal}
        onClose={() => setTaskModal(null)}
        projectId={project.id}
        defaultStatus={taskModal?.status}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this project?"
        message={`"${project.name}" and all its tasks will be permanently removed. This can't be undone.`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteProject(project.id);
          navigate("/projects");
        }}
      />
    </div>
  );
}
