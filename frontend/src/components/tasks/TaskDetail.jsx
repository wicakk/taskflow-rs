import React, { useEffect, useState } from "react";
import {
  X, CheckCircle2, Circle, Paperclip, MessageSquare, Calendar as CalIcon2,
  Pencil, Trash2, Plus, Check,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useTasksStore } from "../../hooks/useTasksStore";
import { useMasterData } from "../../hooks/useMasterData";
import { membersByIds } from "../../data/mockData";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import Select from "../common/Select";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import ConfirmDialog from "../common/ConfirmDialog";

export default function TaskDetail({ task, project, onClose }) {
  const { c } = useTheme();
  const { can } = useAuth();
  const {
    teamMembers, updateTask, updateTaskStatus, deleteTask,
    toggleChecklistItem, addChecklistItem, removeChecklistItem,
  } = useTasksStore();
  const { taskStatuses, priorities, labels, priorityColor, labelColor } = useMasterData();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(task);
  const [newItem, setNewItem] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const assigneeMembers = membersByIds(teamMembers, task.assignees);
  const checkedCount = task.checklist.filter((x) => x.done).length;
  const canEdit = can("task:edit");
  const canDelete = can("task:delete");

  const startEdit = () => {
    setForm(task);
    setEditing(true);
  };

  const toggleFormLabel = (name) =>
    setForm((f) => ({
      ...f,
      labels: f.labels.includes(name) ? f.labels.filter((l) => l !== name) : [...f.labels, name],
    }));

  const toggleFormAssignee = (id) =>
    setForm((f) => ({
      ...f,
      assignees: f.assignees.includes(id) ? f.assignees.filter((a) => a !== id) : [...f.assignees, id],
    }));

  const saveEdit = async (e) => {
    e.preventDefault();
    const saved = await updateTask(task.id, {
      title: form.title,
      description: form.description,
      priority: form.priority,
      assignees: form.assignees,
      dueDate: form.dueDate,
      labels: form.labels,
    });
    if (saved) setEditing(false); // on failure the edit form stays open with the user's input
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" style={{ opacity: show ? 1 : 0 }} onClick={onClose} />
      <div
        className="relative w-full max-w-[520px] h-full overflow-y-auto transition-transform duration-300 ease-out"
        style={{ background: c.card, boxShadow: "-8px 0 24px rgba(16,15,40,0.08)", transform: show ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-5 h-16 sticky top-0 z-10" style={{ background: c.card, borderBottom: `1px solid ${c.border}` }}>
          <div className="text-[12px]" style={{ color: c.muted }}>{project?.name}</div>
          <div className="flex items-center gap-1">
            {canEdit && !editing && (
              <button onClick={startEdit} className="p-1.5 rounded-md" style={{ color: c.muted }}>
                <Pencil size={16} />
              </button>
            )}
            {canDelete && (
              <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-md" style={{ color: "#EA5455" }}>
                <Trash2 size={16} />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-md" style={{ color: c.muted }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={saveEdit} className="p-5 space-y-4">
            <div>
              <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Title</label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Description</label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Priority</label>
                <Select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                  {priorities.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </Select>
              </div>
              <div className="col-span-2">
                <label className="text-[11px] mb-2 block" style={{ color: c.muted }}>
                  Assignee{form.assignees.length > 1 ? "s" : ""} <span style={{ opacity: 0.7 }}>(bisa pilih lebih dari satu)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {teamMembers.map((mm) => {
                    const active = form.assignees.includes(mm.id);
                    return (
                      <button
                        type="button"
                        key={mm.id}
                        onClick={() => toggleFormAssignee(mm.id)}
                        className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full text-[12px] font-medium"
                        style={{
                          border: `1px solid ${active ? "#7367F0" : c.border}`,
                          background: active ? "#7367F015" : "transparent",
                          color: active ? "#7367F0" : c.text,
                        }}
                      >
                        <Avatar initials={mm.initials} size={20} />
                        {mm.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Due date</label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
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
                      onClick={() => toggleFormLabel(l.name)}
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
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="p-5 space-y-5">
            <h2 className="text-[18px] font-bold leading-snug" style={{ color: c.textStrong }}>{task.title}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] mb-1.5" style={{ color: c.muted }}>Status</div>
                <Select
                  value={task.status}
                  disabled={!can("task:move") && !canEdit}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                >
                  {taskStatuses.map((s) => <option key={s.id} value={s.key}>{s.name}</option>)}
                </Select>
              </div>
              <div>
                <div className="text-[11px] mb-1.5" style={{ color: c.muted }}>Priority</div>
                <Badge color={priorityColor(task.priority)}>{task.priority}</Badge>
              </div>
              <div>
                <div className="text-[11px] mb-1.5" style={{ color: c.muted }}>Assignee{assigneeMembers.length > 1 ? "s" : ""}</div>
                <div className="flex flex-wrap items-center gap-2">
                  {assigneeMembers.map((mm, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Avatar initials={mm.initials} size={24} />
                      <span className="text-[12.5px]" style={{ color: c.text }}>{mm.name.split(" ")[0]}</span>
                    </div>
                  ))}
                  {assigneeMembers.length === 0 && <span className="text-[12.5px]" style={{ color: c.muted }}>Unassigned</span>}
                </div>
              </div>
              <div>
                <div className="text-[11px] mb-1.5" style={{ color: c.muted }}>Due Date</div>
                <div className="flex items-center gap-1.5 text-[12.5px]" style={{ color: c.text }}>
                  <CalIcon2 size={13} />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </div>
              </div>
            </div>

            {task.labels.length > 0 && (
              <div>
                <div className="text-[11px] mb-1.5" style={{ color: c.muted }}>Labels</div>
                <div className="flex gap-1.5 flex-wrap">
                  {task.labels.map((l) => <Badge key={l} color={labelColor(l)}>{l}</Badge>)}
                </div>
              </div>
            )}

            <div>
              <div className="text-[11px] mb-1.5" style={{ color: c.muted }}>Description</div>
              <p className="text-[13px] leading-relaxed" style={{ color: c.text }}>
                {task.description || <span style={{ color: c.muted }}>No description.</span>}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px]" style={{ color: c.muted }}>Checklist</div>
                {task.checklist.length > 0 && (
                  <div className="text-[11px]" style={{ color: c.muted }}>{checkedCount}/{task.checklist.length}</div>
                )}
              </div>
              {task.checklist.length > 0 && <ProgressBar value={(checkedCount / task.checklist.length) * 100} height={5} />}
              <div className="space-y-2 mt-3">
                {task.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 group">
                    <button onClick={() => toggleChecklistItem(task.id, idx)} className="shrink-0">
                      {item.done ? <CheckCircle2 size={16} color="#28C76F" /> : <Circle size={16} style={{ color: c.muted }} />}
                    </button>
                    <span
                      className="text-[13px] flex-1"
                      style={{ color: item.done ? c.muted : c.text, textDecoration: item.done ? "line-through" : "none" }}
                    >
                      {item.text}
                    </span>
                    {canEdit && (
                      <button onClick={() => removeChecklistItem(task.id, idx)} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#EA5455" }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {canEdit && (
                <div className="flex gap-2 mt-3">
                  <input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newItem.trim()) {
                        addChecklistItem(task.id, newItem.trim());
                        setNewItem("");
                      }
                    }}
                    placeholder="Add checklist item..."
                    className="flex-1 rounded-[9px] px-3 py-1.5 text-[12.5px] outline-none"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                  />
                  <button
                    onClick={() => {
                      if (newItem.trim()) {
                        addChecklistItem(task.id, newItem.trim());
                        setNewItem("");
                      }
                    }}
                    className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
                    style={{ background: "#EDEBFD", color: "#7367F0" }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-[12px]" style={{ color: c.muted }}>
              <span className="flex items-center gap-1"><Paperclip size={13} />{task.attachments} attachments</span>
              <span className="flex items-center gap-1"><MessageSquare size={13} />{task.comments} comments</span>
            </div>

            <div>
              <div className="text-[11px] mb-2" style={{ color: c.muted }}>Add comment</div>
              <div className="flex gap-2">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-[10px] px-3 py-2 text-[13px] outline-none"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                />
                <Button onClick={() => setComment("")}>Send</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this task?"
        message={`"${task.title}" will be permanently removed.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          const ok = await deleteTask(task.id);
          setConfirmDelete(false);
          if (ok) onClose();
        }}
      />
    </div>
  );
}
