import React, { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import {
  Download, FileText, TrendingUp, FolderKanban, CheckSquare, Clock, Flag,
  CheckCircle2, Circle,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useTasksStore } from "../hooks/useTasksStore";
import { useMasterData } from "../hooks/useMasterData";
import { daysUntil, fmtDate, membersByIds } from "../data/mockData";
import { BRAND } from "../theme";
import { buildSCurve, statusBreakdown, priorityBreakdown, exportTasksCSV } from "../utils/reportUtils";
import { generateReportPDF } from "../utils/pdfReport";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Avatar from "../components/common/Avatar";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import ProgressBar from "../components/common/ProgressBar";
import StatCard from "../components/dashboard/StatCard";

export default function Reports() {
  const { c, dark } = useTheme();
  const { tasks, projects, teamMembers } = useTasksStore();
  const { taskStatuses, priorities, priorityColor, taskStatusColor, taskStatusLabel } = useMasterData();
  const [projectId, setProjectId] = useState("all");

  const scopedTasks = projectId === "all" ? tasks : tasks.filter((t) => t.projectId === projectId);
  const scopedProject = projects.find((p) => p.id === projectId);
  const scopeLabel = scopedProject ? scopedProject.name : "All Projects";

  const rangeStart = scopedProject
    ? scopedProject.startDate
    : projects.reduce((min, p) => (!min || p.startDate < min ? p.startDate : min), null);
  const rangeEnd = scopedProject
    ? scopedProject.dueDate
    : projects.reduce((max, p) => (!max || p.dueDate > max ? p.dueDate : max), null);

  // Everything below is derived live from the current `tasks` state (which
  // is persisted to localStorage) and the current Master Data configuration
  // (task statuses / priorities), so it always reflects real, up-to-date
  // task conditions — drag-and-drop status changes, checklist edits,
  // renamed/reordered workflow stages, etc.
  const sCurve = useMemo(() => buildSCurve(scopedTasks, rangeStart, rangeEnd), [scopedTasks, rangeStart, rangeEnd]);
  const byStatus = useMemo(() => statusBreakdown(scopedTasks, taskStatuses), [scopedTasks, taskStatuses]);
  const byPriority = useMemo(() => priorityBreakdown(scopedTasks, priorities), [scopedTasks, priorities]);

  const total = scopedTasks.length;
  const doneKey = taskStatuses.find((s) => s.name.toLowerCase() === "done")?.key || "done";
  const doneCount = scopedTasks.filter((t) => t.status === doneKey).length;
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  const stats = [
    { label: "Total Tasks", value: total, icon: FolderKanban, color: BRAND.primary },
    { label: "Completed", value: doneCount, icon: CheckSquare, color: BRAND.success },
    { label: "In Progress", value: scopedTasks.filter((t) => t.status !== doneKey && daysUntil(t.dueDate) >= 0).length, icon: Clock, color: BRAND.warning },
    { label: "Overdue", value: scopedTasks.filter((t) => t.status !== doneKey && daysUntil(t.dueDate) < 0).length, icon: Flag, color: BRAND.danger },
  ];

  const statusColors = {};
  taskStatuses.forEach((s) => (statusColors[s.name] = s.color));
  const priorityColors = {};
  priorities.forEach((p) => (priorityColors[p.name] = p.color));

  const gridColor = dark ? "#2D3544" : "#E9E7F0";
  const axisColor = c.muted;

  const taskRows = useMemo(
    () =>
      [...scopedTasks].sort((a, b) => {
        if ((a.status === doneKey) !== (b.status === doneKey)) return a.status === doneKey ? 1 : -1;
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      }),
    [scopedTasks, doneKey]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: c.textStrong }}>Reports</h1>
          <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>Project and team performance insights.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="!w-auto min-w-[180px]">
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
          <Button
            icon={Download}
            variant="ghost"
            onClick={() => exportTasksCSV(scopedTasks, projects, teamMembers, taskStatusLabel, `taskflow-report-${projectId}.csv`)}
          >
            CSV
          </Button>
          <Button
            icon={FileText}
            onClick={() =>
              generateReportPDF({
                scopeLabel, tasks: scopedTasks, projects, teamMembers, byStatus, byPriority,
                taskStatuses, taskStatusLabel,
              })
            }
          >
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} color={BRAND.primary} />
          <h3 className="font-semibold text-[15px]" style={{ color: c.textStrong }}>Kurva S — Planned vs Actual Progress</h3>
        </div>
        <p className="text-[12px] mb-4" style={{ color: c.muted }}>
          Kumulatif task selesai berdasarkan rencana (due date) dibanding realisasi aktual hingga hari ini. Data diambil otomatis dari status task saat ini.
        </p>
        {sCurve.length > 0 ? (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={sCurve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: axisColor }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12 }}
                  formatter={(v) => `${v}%`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="planned" name="Planned" stroke={BRAND.info} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke={BRAND.primary} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-16 text-center text-[13px]" style={{ color: c.muted }}>
            Belum cukup data (butuh due date) untuk menampilkan kurva S.
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: c.textStrong }}>Task by Status</h3>
          {total > 0 ? (
            <>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={byStatus} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                    <Tooltip contentStyle={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {byStatus.map((entry) => (
                        <Cell key={entry.name} fill={statusColors[entry.name]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 mt-4">
                {byStatus.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-[12px] mb-1" style={{ color: c.text }}>
                      <span>{s.name}</span>
                      <span style={{ color: c.muted }}>{s.value} task · {pct(s.value)}%</span>
                    </div>
                    <ProgressBar value={pct(s.value)} color={statusColors[s.name]} height={5} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-14 text-center text-[13px]" style={{ color: c.muted }}>No tasks in this scope.</div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: c.textStrong }}>Task by Priority</h3>
          {total > 0 ? (
            <>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={byPriority} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                    <Tooltip contentStyle={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {byPriority.map((entry) => (
                        <Cell key={entry.name} fill={priorityColors[entry.name]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 mt-4">
                {byPriority.map((p) => (
                  <div key={p.name}>
                    <div className="flex justify-between text-[12px] mb-1" style={{ color: c.text }}>
                      <span>{p.name}</span>
                      <span style={{ color: c.muted }}>{p.value} task · {pct(p.value)}%</span>
                    </div>
                    <ProgressBar value={pct(p.value)} color={priorityColors[p.name]} height={5} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-14 text-center text-[13px]" style={{ color: c.muted }}>No tasks in this scope.</div>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${c.border}` }}>
          <div>
            <h3 className="font-semibold text-[15px]" style={{ color: c.textStrong }}>Task Detail</h3>
            <p className="text-[12px] mt-0.5" style={{ color: c.muted }}>
              Rincian per task — status dan progress checklist dibaca langsung dari kondisi task saat ini.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[18px] font-bold" style={{ color: BRAND.primary }}>{pct(doneCount)}%</div>
            <div className="text-[11px]" style={{ color: c.muted }}>overall complete</div>
          </div>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              {["", "Task", "Project", "Status", "Priority", "Assignee", "Due Date", "Checklist"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: c.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {taskRows.map((t) => {
              const project = projects.find((p) => p.id === t.projectId);
              const assigneeMembers = membersByIds(teamMembers, t.assignees);
              const checklistDone = t.checklist.filter((x) => x.done).length;
              const checklistPct = t.checklist.length ? Math.round((checklistDone / t.checklist.length) * 100) : null;
              return (
                <tr key={t.id} style={{ borderBottom: `1px solid ${c.border}` }}>
                  <td className="px-4 py-3">
                    {t.status === doneKey ? <CheckCircle2 size={16} color={BRAND.success} /> : <Circle size={16} style={{ color: c.muted }} />}
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: c.textStrong }}>{t.title}</td>
                  <td className="px-4 py-3" style={{ color: c.text }}>{project?.name || "-"}</td>
                  <td className="px-4 py-3"><Badge color={taskStatusColor(t.status)}>{taskStatusLabel(t.status)}</Badge></td>
                  <td className="px-4 py-3"><Badge color={priorityColor(t.priority)}>{t.priority}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center -space-x-2">
                      {assigneeMembers.slice(0, 3).map((mm, idx) => (
                        <Avatar key={idx} initials={mm.initials} size={22} />
                      ))}
                      {assigneeMembers.length === 0 && <span style={{ color: c.muted }} className="text-[12px]">Unassigned</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: c.text }}>{t.dueDate ? fmtDate(t.dueDate) : "-"}</td>
                  <td className="px-4 py-3 w-32">
                    {checklistPct !== null ? (
                      <div className="flex items-center gap-2">
                        <ProgressBar value={checklistPct} height={5} />
                        <span className="text-[11px] shrink-0" style={{ color: c.muted }}>{checklistPct}%</span>
                      </div>
                    ) : (
                      <span className="text-[11px]" style={{ color: c.muted }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {taskRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[13px]" style={{ color: c.muted }}>
                  No tasks in this scope.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
