import React from "react";
import { Trash2 } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { memberById, timeAgo } from "../../data/mockData";
import { useTasksStore } from "../../hooks/useTasksStore";
import Avatar from "../common/Avatar";

export default function ChatMessage({ message, isMine, onDelete }) {
  const { c } = useTheme();
  const { teamMembers } = useTasksStore();
  const author = memberById(teamMembers, message.authorId);

  return (
    <div className={`flex gap-2.5 group ${isMine ? "flex-row-reverse" : ""}`}>
      <Avatar initials={author.initials} size={30} />
      <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`flex items-center gap-2 mb-1 ${isMine ? "flex-row-reverse" : ""}`}>
          <span className="text-[12px] font-semibold" style={{ color: c.textStrong }}>
            {isMine ? "You" : author.name.split(" ")[0]}
          </span>
          <span className="text-[10.5px]" style={{ color: c.muted }}>{timeAgo(message.timestamp)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isMine && onDelete && (
            <button
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "#EA5455" }}
            >
              <Trash2 size={12} />
            </button>
          )}
          <div
            className="px-3.5 py-2 text-[13px] leading-relaxed"
            style={{
              background: isMine ? "#7367F0" : c.bg,
              color: isMine ? "#fff" : c.text,
              border: isMine ? "none" : `1px solid ${c.border}`,
              borderRadius: isMine ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
            }}
          >
            {message.text}
          </div>
        </div>
      </div>
    </div>
  );
}
