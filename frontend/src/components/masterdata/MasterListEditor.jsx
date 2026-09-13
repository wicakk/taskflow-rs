import React, { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Check, X } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useMasterData } from "../../hooks/useMasterData";
import Card from "../common/Card";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import ColorPicker from "./ColorPicker";
import ConfirmDialog from "../common/ConfirmDialog";

// listName: key into useMasterData() state ("priorities", "taskStatuses", ...)
// colorEnabled / descriptionEnabled: which extra fields this master data type has
// reorderEnabled: show up/down arrows (used for taskStatuses — Kanban column order)
// getUsageCount(item): how many tasks/projects reference this item — blocks delete when > 0
export default function MasterListEditor({
  listName,
  header,
  colorEnabled = false,
  descriptionEnabled = false,
  reorderEnabled = false,
  getUsageCount,
  usageNoun = "item",
  namePlaceholder = "Name",
}) {
  const { c } = useTheme();
  const store = useMasterData();
  const items = store[listName];
  const { addItem, updateItem, deleteItem, moveItem } = store;

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState({ name: "", description: "", color: "#7367F0" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const startEdit = (item) => {
    setEditingId(item.id);
    setDraft(item);
  };

  const saveEdit = () => {
    if (!draft.name?.trim()) return;
    updateItem(listName, editingId, draft);
    setEditingId(null);
  };

  const submitAdd = (e) => {
    e.preventDefault();
    if (!newDraft.name.trim()) return;
    addItem(listName, newDraft);
    setNewDraft({ name: "", description: "", color: "#7367F0" });
    setAdding(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-3" style={{ borderBottom: `1px solid ${c.border}` }}>
        <div>
          <h3 className="font-semibold text-[14.5px]" style={{ color: c.textStrong }}>{header.title}</h3>
          <p className="text-[12px] mt-0.5" style={{ color: c.muted }}>{header.subtitle}</p>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[12.5px] font-medium shrink-0"
          style={{ background: "#EDEBFD", color: "#7367F0" }}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {adding && (
        <form onSubmit={submitAdd} className="p-4 space-y-3" style={{ borderBottom: `1px solid ${c.border}`, background: c.bg }}>
          <Input
            value={newDraft.name}
            onChange={(e) => setNewDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder={namePlaceholder}
            autoFocus
            required
          />
          {descriptionEnabled && (
            <Textarea
              rows={2}
              value={newDraft.description}
              onChange={(e) => setNewDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Description (optional)"
            />
          )}
          {colorEnabled && <ColorPicker value={newDraft.color} onChange={(color) => setNewDraft((d) => ({ ...d, color }))} />}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-[8px] text-[12.5px]" style={{ color: c.muted }}>
              Cancel
            </button>
            <button type="submit" className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-white" style={{ background: "#7367F0" }}>
              Save
            </button>
          </div>
        </form>
      )}

      <div>
        {items.length === 0 && (
          <div className="px-5 py-10 text-center text-[13px]" style={{ color: c.muted }}>No data yet — click Add to create one.</div>
        )}
        {items.map((item, idx) => {
          const isEditing = editingId === item.id;
          const usage = getUsageCount ? getUsageCount(item) : 0;

          return (
            <div key={item.id} className="px-5 py-3.5 flex items-start gap-3" style={{ borderBottom: `1px solid ${c.border}` }}>
              {reorderEnabled && (
                <div className="flex flex-col gap-0.5 pt-0.5 shrink-0">
                  <button disabled={idx === 0} onClick={() => moveItem(listName, item.id, -1)} style={{ color: idx === 0 ? c.border : c.muted }}>
                    <ArrowUp size={13} />
                  </button>
                  <button disabled={idx === items.length - 1} onClick={() => moveItem(listName, item.id, 1)} style={{ color: idx === items.length - 1 ? c.border : c.muted }}>
                    <ArrowDown size={13} />
                  </button>
                </div>
              )}

              {isEditing ? (
                <div className="flex-1 space-y-2.5">
                  <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} autoFocus />
                  {descriptionEnabled && (
                    <Textarea rows={2} value={draft.description || ""} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
                  )}
                  {colorEnabled && <ColorPicker value={draft.color} onChange={(color) => setDraft((d) => ({ ...d, color }))} />}
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-white" style={{ background: "#28C76F" }}>
                      <Check size={13} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] text-[12px]" style={{ color: c.muted, border: `1px solid ${c.border}` }}>
                      <X size={13} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {colorEnabled && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />}
                      <span className="text-[13.5px] font-medium" style={{ color: c.textStrong }}>{item.name}</span>
                      {reorderEnabled && item.key && (
                        <span className="text-[10.5px] px-1.5 py-[1px] rounded-md" style={{ background: c.bg, color: c.muted }}>key: {item.key}</span>
                      )}
                      {getUsageCount && (
                        <span className="text-[11px]" style={{ color: c.muted }}>
                          used by {usage} {usageNoun}{usage === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                    {descriptionEnabled && item.description && (
                      <p className="text-[12px] mt-1" style={{ color: c.muted }}>{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(item)} className="p-1.5 rounded-md" style={{ color: c.muted }}>
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => (usage > 0 ? null : setDeleteTarget(item))}
                      disabled={usage > 0}
                      title={usage > 0 ? `Can't delete — still used by ${usage} ${usageNoun}(s)` : "Delete"}
                      className="p-1.5 rounded-md"
                      style={{ color: usage > 0 ? c.border : "#EA5455", cursor: usage > 0 ? "not-allowed" : "pointer" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This item will be permanently removed from the list."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteItem(listName, deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Card>
  );
}
