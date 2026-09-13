import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, ArrowUpDown, LayoutGrid, List as ListIcon, Pencil, Trash2 } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useTasksStore } from "../hooks/useTasksStore";
import { useMasterData } from "../hooks/useMasterData";
import { memberById, fmtDate } from "../data/mockData";
import { BRAND } from "../theme";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Avatar from "../components/common/Avatar";
import ProgressBar from "../components/common/ProgressBar";
import MenuButton from "../components/common/MenuButton";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectFormModal from "../components/projects/ProjectFormModal";

export default function Projects() {
  const { c, dark } = useTheme();
  const { can } = useAuth();
  const { projects, tasks, teamMembers, deleteProject } = useTasksStore();
  const { projectStatusColor, priorityColor } = useMasterData();
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const openProject = (id) => navigate(`/projects/${id}`);

  const openCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditingProject(p);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: c.textStrong }}>Projects</h1>
          <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>Manage all your projects in one place.</p>
        </div>
        {can("project:create") && (
          <Button icon={Plus} onClick={openCreate}>New Project</Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project..."
            className="w-full rounded-[10px] pl-8 pr-3 py-2 text-[13px] outline-none"
            style={{ background: c.card, border: `1px solid ${c.border}`, color: c.text }}
          />
        </div>
        <Button variant="ghost" icon={Filter}>Filter</Button>
        <Button variant="ghost" icon={ArrowUpDown}>Sort</Button>
        <div className="ml-auto flex items-center gap-1 p-1 rounded-[10px]" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <button
            onClick={() => setView("grid")}
            className="p-1.5 rounded-[7px]"
            style={{ background: view === "grid" ? (dark ? BRAND.primarySoftDark : BRAND.primarySoftLight) : "transparent", color: view === "grid" ? BRAND.primary : c.muted }}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setView("list")}
            className="p-1.5 rounded-[7px]"
            style={{ background: view === "list" ? (dark ? BRAND.primarySoftDark : BRAND.primarySoftLight) : "transparent", color: view === "list" ? BRAND.primary : c.muted }}
          >
            <ListIcon size={15} />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              idx={i}
              tasks={tasks}
              onClick={() => openProject(p.id)}
              onEdit={can("project:edit") ? () => openEdit(p) : undefined}
              onDelete={can("project:delete") ? () => setDeleteTarget(p) : undefined}
            />
          ))}
          {filtered.length === 0 && (
            <Card className="p-10 text-center col-span-full">
              <p style={{ color: c.muted }} className="text-[13px]">No projects match your search.</p>
            </Card>
          )}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                {["Project", "Status", "Priority", "Progress", "Due date", "Members", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: c.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => openProject(p.id)}
                  className="cursor-pointer"
                  style={{ borderBottom: `1px solid ${c.border}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: c.textStrong }}>{p.name}</td>
                  <td className="px-4 py-3"><Badge color={projectStatusColor(p.status)}>{p.status}</Badge></td>
                  <td className="px-4 py-3"><Badge color={priorityColor(p.priority)}>{p.priority}</Badge></td>
                  <td className="px-4 py-3 w-40">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={p.progress} />
                      <span style={{ color: c.muted }} className="text-[11.5px]">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: c.text }}>{fmtDate(p.dueDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-2">
                      {p.members.slice(0, 3).map((id) => (
                        <Avatar key={id} initials={memberById(teamMembers, id).initials} size={24} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <MenuButton
                      items={[
                        can("project:edit") && { label: "Edit Project", icon: Pencil, onClick: () => openEdit(p) },
                        can("project:delete") && { label: "Delete Project", icon: Trash2, danger: true, onClick: () => setDeleteTarget(p) },
                      ].filter(Boolean)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <ProjectFormModal open={modalOpen} onClose={() => setModalOpen(false)} project={editingProject} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this project?"
        message={`"${deleteTarget?.name}" and all its tasks will be permanently removed. This can't be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteProject(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
