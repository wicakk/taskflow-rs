import React from "react";
import { Pin, Trash2 } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useTasksStore } from "../../hooks/useTasksStore";
import { memberById, timeAgo } from "../../data/mockData";
import { ROLE_COLORS } from "../../utils/permissions";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import MenuButton from "../common/MenuButton";

export default function AnnouncementCard({ announcement }) {
  const { c } = useTheme();
  const { user, can } = useAuth();
  const { teamMembers, deleteAnnouncement, togglePinAnnouncement } = useTasksStore();
  const author = memberById(teamMembers, announcement.authorId);

  const canDelete = announcement.authorId === user?.id || user?.accessRole === "admin";
  const canPin = can("announcement:pin");

  return (
    <Card className="p-5" style={{ borderColor: announcement.pinned ? "#7367F0" : undefined }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {announcement.pinned && (
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#7367F0" }}>
              <Pin size={12} /> Pinned
            </span>
          )}
        </div>
        {(canDelete || canPin) && (
          <MenuButton
            items={[
              canPin && { label: announcement.pinned ? "Unpin" : "Pin to top", icon: Pin, onClick: () => togglePinAnnouncement(announcement.id) },
              canDelete && { label: "Delete", icon: Trash2, danger: true, onClick: () => deleteAnnouncement(announcement.id) },
            ].filter(Boolean)}
          />
        )}
      </div>

      <h3 className="text-[15px] font-bold mb-1.5" style={{ color: c.textStrong }}>{announcement.title}</h3>
      <p className="text-[13px] leading-relaxed mb-4" style={{ color: c.text }}>{announcement.body}</p>

      <div className="flex items-center gap-2.5 pt-3" style={{ borderTop: `1px solid ${c.border}` }}>
        <Avatar initials={author.initials} size={26} />
        <div className="min-w-0">
          <div className="text-[12px] font-medium truncate" style={{ color: c.textStrong }}>{author.name}</div>
          <div className="text-[11px]" style={{ color: c.muted }}>{timeAgo(announcement.timestamp)} ago</div>
        </div>
        <Badge color={ROLE_COLORS[author.accessRole]}>{author.role}</Badge>
      </div>
    </Card>
  );
}
