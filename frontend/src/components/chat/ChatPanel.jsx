import React, { useEffect, useRef, useState } from "react";
import { Send, MessagesSquare } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useTasksStore } from "../../hooks/useTasksStore";
import Card from "../common/Card";
import ChatMessage from "./ChatMessage";

export default function ChatPanel({ projectId }) {
  const { c } = useTheme();
  const { user } = useAuth();
  const { chatForProject, loadChat, sendChatMessage, deleteChatMessage } = useTasksStore();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const messages = chatForProject(projectId);

  // Load this project's messages from the database, then poll so messages
  // sent by teammates show up without a manual refresh.
  useEffect(() => {
    loadChat(projectId);
    const timer = setInterval(() => loadChat(projectId), 8000);
    return () => clearInterval(timer);
  }, [projectId, loadChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const submit = async (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message) return;
    setText("");
    const sent = await sendChatMessage(projectId, user.id, message);
    if (!sent) setText(message); // failed: put the text back so it isn't lost
  };

  return (
    <Card className="flex flex-col" style={{ height: 560 }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${c.border}` }}>
        <MessagesSquare size={16} style={{ color: "#7367F0" }} />
        <span className="text-[13.5px] font-semibold" style={{ color: c.textStrong }}>Project Group Chat</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <MessagesSquare size={26} style={{ color: c.muted }} className="mb-2" />
            <p className="text-[12.5px]" style={{ color: c.muted }}>Belum ada pesan. Mulai diskusi dengan tim project ini.</p>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m}
            isMine={m.authorId === user?.id}
            onDelete={() => deleteChatMessage(m.id)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="p-3 flex gap-2 shrink-0" style={{ borderTop: `1px solid ${c.border}` }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis pesan ke tim project..."
          className="flex-1 rounded-[10px] px-3.5 py-2.5 text-[13px] outline-none"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-white"
          style={{ background: "#7367F0" }}
        >
          <Send size={16} />
        </button>
      </form>
    </Card>
  );
}
