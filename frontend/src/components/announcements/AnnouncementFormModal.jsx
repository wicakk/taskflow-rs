import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useTasksStore } from "../../hooks/useTasksStore";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Button from "../common/Button";

export default function AnnouncementFormModal({ open, onClose }) {
  const { c } = useTheme();
  const { user, can } = useAuth();
  const { addAnnouncement } = useTasksStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || saving) return;
    setSaving(true);
    const saved = await addAnnouncement({ title: title.trim(), body: body.trim(), pinned: can("announcement:pin") ? pinned : false });
    setSaving(false);
    if (!saved) return; // API error toast already shown; keep the text so nothing is lost
    setTitle("");
    setBody("");
    setPinned(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Announcement" width={480}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Jadwal maintenance server" required />
        </div>
        <div>
          <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Message</label>
          <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tulis pengumuman kamu..." required />
        </div>
        {can("announcement:pin") && (
          <label className="flex items-center gap-2 text-[12.5px] cursor-pointer" style={{ color: c.text }}>
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="accent-[#7367F0]" />
            Pin to top
          </label>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Posting..." : "Post Announcement"}</Button>
        </div>
      </form>
    </Modal>
  );
}
