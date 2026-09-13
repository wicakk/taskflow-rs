import React, { useState } from "react";
import { Plus, Megaphone } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useTasksStore } from "../hooks/useTasksStore";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import AnnouncementCard from "../components/announcements/AnnouncementCard";
import AnnouncementFormModal from "../components/announcements/AnnouncementFormModal";

export default function Announcements() {
  const { c } = useTheme();
  const { announcements } = useTasksStore();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: c.textStrong }}>Announcements</h1>
          <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>Updates and news for the whole team.</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>New Announcement</Button>
      </div>

      <div className="space-y-4 max-w-2xl">
        {announcements.length === 0 && (
          <Card className="p-16 flex flex-col items-center justify-center text-center">
            <Megaphone size={26} style={{ color: c.muted }} className="mb-3" />
            <div className="text-[14px] font-semibold" style={{ color: c.textStrong }}>No announcements yet</div>
            <div className="text-[12.5px] mt-1" style={{ color: c.muted }}>Be the first to share an update with the team.</div>
          </Card>
        )}
        {announcements.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} />
        ))}
      </div>

      <AnnouncementFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
