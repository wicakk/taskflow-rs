import React from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, FolderKanban, CheckSquare, Clock, CheckCircle2, Flag, Circle } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useTasksStore } from "../hooks/useTasksStore";
import { fmtDate, daysUntil, timeAgo } from "../data/mockData";
import { BRAND, projectColors } from "../theme";
import { useMasterData } from "../hooks/useMasterData";
import { computeMemberTaskStats, resolveDoneKey } from "../utils/memberStats";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import ProgressBar from "../components/common/ProgressBar";
import Avatar from "../components/common/Avatar";
import StatCard from "../components/dashboard/StatCard";

export default function Dashboard() {
  const { c } = useTheme();
  const { user } = useAuth();
  const { tasks, projects, teamMembers, openTask, announcements } = useTasksStore();
  const { taskStatuses, priorityColor, taskStatusColor } = useMasterData();
  const doneKey = resolveDoneKey(taskStatuses);
  const navigate = useNavigate();

  const latestAnnouncement = announcements[0];

  const myTasks = tasks.filter((t) => t.assignees?.includes(user?.id));
  const firstName = user?.name?.split(" ")[0] || "there";
  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban, color: BRAND.primary },
    { label: "My Tasks", value: myTasks.length, icon: CheckSquare, color: BRAND.info },
    { label: "In Progress", value: tasks.filter((t) => t.status === "inprogress").length, icon: Clock, color: BRAND.warning },
    { label: "Completed", value: tasks.filter((t) => t.status === "done").length, icon: CheckCircle2, color: BRAND.success },
    { label: "Overdue", value: tasks.filter((t) => t.status !== "done" && daysUntil(t.dueDate) < 0).length, icon: Flag, color: BRAND.danger },
  ];

  const upcoming = [...tasks]
    .filter((t) => t.status !== "done")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold" style={{ color: c.textStrong }}>Good Morning, {firstName}</h1>
        <p className="text-[13.5px] mt-1" style={{ color: c.muted }}>Manage your projects and tasks efficiently.</p>
      </div>

      {latestAnnouncement && (
        <Card
          className="p-4 flex items-start gap-3 cursor-pointer"
          onClick={() => navigate("/announcements")}
        >
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: BRAND.primary + "1A" }}>
            <Megaphone size={16} color={BRAND.primary} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: BRAND.primary }}>Announcement</span>
              <span className="text-[11px]" style={{ color: c.muted }}>{timeAgo(latestAnnouncement.timestamp)} ago</span>
            </div>
            <div className="text-[13.5px] font-semibold mt-0.5 truncate" style={{ color: c.textStrong }}>{latestAnnouncement.title}</div>
            <p className="text-[12.5px] mt-0.5 line-clamp-2" style={{ color: c.muted }}>{latestAnnouncement.body}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px]" style={{ color: c.textStrong }}>Recent Projects</h3>
            <button onClick={() => navigate("/projects")} className="text-[12.5px] font-medium" style={{ color: BRAND.primary }}>
              View all
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="flex items-center gap-3 p-2.5 rounded-[10px] cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: projectColors[i % projectColors.length] + "1A" }}>
                  <FolderKanban size={16} color={projectColors[i % projectColors.length]} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium truncate" style={{ color: c.textStrong }}>{p.name}</div>
                  <div className="text-[11.5px]" style={{ color: c.muted }}>Due {fmtDate(p.dueDate)}</div>
                </div>
                <div className="w-24 hidden sm:block">
                  <ProgressBar value={p.progress} />
                </div>
                <span className="text-[12px] font-semibold w-9 text-right" style={{ color: c.textStrong }}>{p.progress}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: c.textStrong }}>Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcoming.map((t) => (
              <div key={t.id} onClick={() => openTask(t.id)} className="flex items-start gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-[9px] flex flex-col items-center justify-center shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <span className="text-[10px] font-bold leading-none" style={{ color: BRAND.primary }}>
                    {new Date(t.dueDate).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium truncate" style={{ color: c.textStrong }}>{t.title}</div>
                  <div className="text-[11px]" style={{ color: c.muted }}>{fmtDate(t.dueDate)}</div>
                </div>
                <Badge color={priorityColor(t.priority)}>{t.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: c.textStrong }}>My Tasks</h3>
          <div className="space-y-3">
            {myTasks.slice(0, 4).map((t) => (
              <div key={t.id} onClick={() => openTask(t.id)} className="flex items-center gap-2.5 cursor-pointer">
                {t.status === "done" ? <CheckCircle2 size={16} color={BRAND.success} /> : <Circle size={16} style={{ color: c.muted }} />}
                <span
                  className="text-[12.5px] flex-1 truncate"
                  style={{ color: t.status === "done" ? c.muted : c.text, textDecoration: t.status === "done" ? "line-through" : "none" }}
                >
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: c.textStrong }}>Task Progress</h3>
          <div className="space-y-3.5">
            {taskStatuses.map((col) => {
              const count = tasks.filter((t) => t.status === col.key).length;
              const pct = Math.round((count / tasks.length) * 100);
              return (
                <div key={col.key}>
                  <div className="flex justify-between text-[12px] mb-1.5" style={{ color: c.text }}>
                    <span>{col.name}</span>
                    <span style={{ color: c.muted }}>{count}</span>
                  </div>
                  <ProgressBar value={pct} color={taskStatusColor(col.key)} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: c.textStrong }}>Team Activity</h3>
          <div className="space-y-3.5">
            {teamMembers.slice(0, 4).map((m) => {
              const { activeTasks } = computeMemberTaskStats(tasks, m.id, doneKey);
              return (
                <div key={m.id} className="flex items-center gap-2.5">
                  <Avatar initials={m.initials} size={28} online={m.online} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium truncate" style={{ color: c.text }}>{m.name}</div>
                    <div className="text-[11px]" style={{ color: c.muted }}>{activeTasks} active tasks</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
