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

export default function ProjectFormModal({ open, onClose, project, onSaved }) {
  const { c } = useTheme();
  const { teamMembers, addProject, updateProject } = useTasksStore();
  const { projectStatuses, priorities, departments } = useMasterData();

  const empty = {
    name: "",
    description: "",
    status: projectStatuses[0]?.name || "",
    priority: priorities[1]?.name || priorities[0]?.name || "",
    department: "",
    startDate: "",
    dueDate: "",
    progress: 0,
    members: [],
  };
  const [form, setForm] = useState(empty);
  const isEdit = !!project;

  useEffect(() => {
    if (open) setForm(project ? { ...empty, ...project } : empty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleMember = (id) =>
    setForm((f) => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter((m) => m !== id) : [...f.members, id],
    }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = { ...form, progress: Number(form.progress) || 0 };
    const saved = isEdit ? (updateProject(project.id, payload), { ...project, ...payload }) : addProject(payload);
    onSaved?.(saved);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Project" : "New Project"} width={520}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Project name</label>
          <Input value={form.name} onChange={set("name")} placeholder="e.g. Modul Rawat Jalan" required />
        </div>
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Description</label>
          <Textarea rows={3} value={form.description} onChange={set("description")} placeholder="Short description..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Status</label>
            <Select value={form.status} onChange={set("status")}>
              {projectStatuses.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
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
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Department / Unit</label>
            <Select value={form.department} onChange={set("department")}>
              <option value="">— None —</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Start date</label>
            <Input type="date" value={form.startDate} onChange={set("startDate")} />
          </div>
          <div>
            <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Due date</label>
            <Input type="date" value={form.dueDate} onChange={set("dueDate")} />
          </div>
        </div>

        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Progress ({form.progress}%)</label>
          <input
            type="range"
            min={0}
            max={100}
            value={form.progress}
            onChange={set("progress")}
            className="w-full accent-[#7367F0]"
          />
        </div>

        <div>
          <label className="text-[11px] mb-2 block" style={{ color: c.muted }}>Members</label>
          <div className="flex flex-wrap gap-2">
            {teamMembers.map((m) => {
              const active = form.members.includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => toggleMember(m.id)}
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

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEdit ? "Save Changes" : "Create Project"}</Button>
        </div>
      </form>
    </Modal>
  );
}
