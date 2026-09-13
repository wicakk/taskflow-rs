import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { BRAND } from "../../theme";
import { ROLE_LABELS, ROLE_COLORS } from "../../utils/permissions";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import MenuButton from "../common/MenuButton";

export default function TeamCard({ member, onEdit, onDelete }) {
  const { c } = useTheme();
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <Avatar initials={member.initials} size={44} online={member.online} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[14px] truncate" style={{ color: c.textStrong }}>{member.name}</div>
          <div className="text-[12px]" style={{ color: c.muted }}>{member.role}</div>
        </div>
        {(onEdit || onDelete) && (
          <MenuButton
            items={[
              onEdit && { label: "Edit Member", icon: Pencil, onClick: onEdit },
              onDelete && { label: "Remove Member", icon: Trash2, danger: true, onClick: onDelete },
            ].filter(Boolean)}
          />
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge color={ROLE_COLORS[member.accessRole]}>{ROLE_LABELS[member.accessRole]}</Badge>
        <span
          className="text-[11px] px-2 py-0.5 rounded-full"
          style={{
            background: (member.online ? BRAND.success : BRAND.muted) + "1A",
            color: member.online ? BRAND.success : c.muted,
          }}
        >
          {member.online ? "Online" : "Offline"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-[10px] p-2.5" style={{ background: c.bg }}>
          <div className="text-[16px] font-bold" style={{ color: c.textStrong }}>{member.activeTasks}</div>
          <div className="text-[11px]" style={{ color: c.muted }}>Active tasks</div>
        </div>
        <div className="rounded-[10px] p-2.5" style={{ background: c.bg }}>
          <div className="text-[16px] font-bold" style={{ color: c.textStrong }}>{member.completedTasks}</div>
          <div className="text-[11px]" style={{ color: c.muted }}>Completed</div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[11.5px] mb-1.5" style={{ color: c.muted }}>
          <span>Workload</span>
          <span style={{ color: c.textStrong, fontWeight: 600 }}>{member.workload}%</span>
        </div>
        <ProgressBar value={member.workload} color={member.workload > 65 ? BRAND.danger : BRAND.primary} />
      </div>
    </Card>
  );
}
