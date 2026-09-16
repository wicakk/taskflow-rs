import React, { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useTasksStore } from "../../hooks/useTasksStore";
import { useMasterData } from "../../hooks/useMasterData";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Select from "../common/Select";
import Button from "../common/Button";
import Avatar from "../common/Avatar";

// `projectId` fixed (e.g. called from inside a project's Kanban) hides the
// project picker. Omit it (e.g. called from My Tasks) to let the user pick
// which project the new task belongs to.
export default function TaskFormModal({ open, onClose, projectId, defaultStatus, defaultAssignee, onSaved }) {
  const { c } = useTheme();
  const { teamMembers, projects, addTask } = useTasksStore();
  const { taskStatuses, priorities, labels } = useMasterData();

  const empty = {
    projectId: projectId || projects[0]?.id || "",
    title: "",
    description: "",
    status: defaultStatus || taskStatuses[0]?.key || "",
    priority: priorities[1]?.name || priorities[0]?.name || "",
    assignees: defaultAssignee ? [defaultAssignee] : teamMembers[0] ? [teamMembers[0].id] : [],
    dueDate: "",
    labels: [],
  };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (open) {
      setForm({
        ...empty,
        projectId: projectId || projects[0]?.id || "",
        status: defaultStatus || taskStatuses[0]?.key || "",
        assignees: defaultAssignee ? [defaultAssignee] : teamMembers[0] ? [teamMembers[0].id] : [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultStatus, projectId, defaultAssignee]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleLabel = (name) =>
    setForm((f) => ({
      ...f,
      labels: f.labels.includes(name) ? f.labels.filter((l) => l !== name) : [...f.labels, name],
    }));

  const toggleAssignee = (id) =>
    setForm((f) => ({
      ...f,
      assignees: f.assignees.includes(id) ? f.assignees.filter((a) => a !== id) : [...f.assignees, id],
    }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) return;
    const task = addTask({
      projectId: form.projectId,
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      assignees: form.assignees,
      dueDate: form.dueDate,
      labels: form.labels,
    });
    onSaved?.(task);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Task" width={480}>
      <form onSubmit={submit} className="space-y-4">
        {!projectId && (
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Project</label>
            <Select value={form.projectId} onChange={set("projectId")} required>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
        )}
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Task title</label>
          <Input value={form.title} onChange={set("title")} placeholder="e.g. Perbaikan halaman login" required />
        </div>
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Description</label>
          <Textarea rows={3} value={form.description} onChange={set("description")} placeholder="Short description..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Status</label>
            <Select value={form.status} onChange={set("status")}>
              {taskStatuses.map((s) => (
                <option key={s.id} value={s.key}>{s.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Priority</label>
            <Select value={form.priority} onChange={set("priority")}>
              {priorities.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </Select>
          </div>
          <div className="col-span-2">
            <label className="text-[11px] mb-2 block" style={{ color: c.muted }}>
              Assignee{form.assignees.length > 1 ? "s" : ""} <span style={{ opacity: 0.7 }}>(bisa pilih lebih dari satu)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((m) => {
                const active = form.assignees.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => toggleAssignee(m.id)}
                    className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full text-[12px] font-medium"
                    style={{
                      border: `1px solid ${active ? "#7367F0" : c.border}`,
                      background: active ? "#7367F015" : "transparent",
                      color: active ? "#7367F0" : c.text,
                    }}
                  >
                    <Avatar initials={m.initials} size={20} />
                    {m.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Due date</label>
            <Input type="date" value={form.dueDate} onChange={set("dueDate")} />
          </div>
        </div>
        <div>
          <label className="text-[11px] mb-2 block" style={{ color: c.muted }}>Labels</label>
          <div className="flex flex-wrap gap-2">
            {labels.map((l) => {
              const active = form.labels.includes(l.name);
              return (
                <button
                  type="button"
                  key={l.id}
                  onClick={() => toggleLabel(l.name)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium"
                  style={{
                    border: `1px solid ${active ? l.color : c.border}`,
                    background: active ? l.color + "1A" : "transparent",
                    color: active ? l.color : c.text,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                  {l.name}
                </button>
              );
            })}
            {labels.length === 0 && (
              <span className="text-[12px]" style={{ color: c.muted }}>Belum ada label. Tambahkan di Master Data → Labels.</span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}
