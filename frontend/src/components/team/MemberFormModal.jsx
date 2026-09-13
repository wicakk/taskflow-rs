import React, { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useTasksStore } from "../../hooks/useTasksStore";
import { useMasterData } from "../../hooks/useMasterData";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "../../utils/permissions";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const empty = { name: "", role: "", email: "", password: "", accessRole: "member" };

export default function MemberFormModal({ open, onClose, member, onSaved }) {
  const { c } = useTheme();
  const { addMember, updateMember } = useTasksStore();
  const { jobTitles } = useMasterData();
  const [form, setForm] = useState(empty);
  const isEdit = !!member;

  useEffect(() => {
    if (open) setForm(member ? { ...empty, ...member, password: "" } : empty);
  }, [open, member]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password; // keep old password if left blank
    const saved = isEdit ? (updateMember(member.id, payload), { ...member, ...payload }) : addMember(payload);
    onSaved?.(saved);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Member" : "Add Team Member"} width={440}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Full name</label>
          <Input value={form.name} onChange={set("name")} placeholder="e.g. Putri Amelia" required />
        </div>
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Job title</label>
          <Select value={form.role} onChange={set("role")}>
            <option value="">— Select —</option>
            {jobTitles.map((j) => (
              <option key={j.id} value={j.name}>{j.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Email (used to log in)</label>
          <Input type="email" value={form.email} onChange={set("email")} placeholder="name@taskflow.io" required />
        </div>
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>
            Password {isEdit && <span style={{ opacity: 0.7 }}>(leave blank to keep current)</span>}
          </label>
          <Input type="text" value={form.password} onChange={set("password")} placeholder={isEdit ? "••••••••" : "Set a password"} required={!isEdit} />
        </div>
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Access role</label>
          <Select value={form.accessRole} onChange={set("accessRole")}>
            {Object.keys(ROLE_LABELS).map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </Select>
          <p className="text-[11px] mt-1.5" style={{ color: c.muted }}>{ROLE_DESCRIPTIONS[form.accessRole]}</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEdit ? "Save Changes" : "Add Member"}</Button>
        </div>
      </form>
    </Modal>
  );
}
