import { TODAY, fmtDate, memberById } from "../data/mockData";

const DAY_MS = 86400000;

// Builds cumulative "Planned vs Actual" completion data (the classic
// S-Curve used in project tracking / Kurva S) from a list of tasks.
// - Planned: cumulative % of tasks whose due date has passed by that point.
// - Actual: cumulative % of tasks actually marked done by that point,
//   only plotted up to today (future actuals are unknown yet).
export function buildSCurve(tasks, rangeStart, rangeEnd) {
  const dated = tasks.filter((t) => t.dueDate);
  if (dated.length === 0 || !rangeStart || !rangeEnd) return [];

  const start = new Date(rangeStart);
  const end = new Date(Math.max(new Date(rangeEnd), ...dated.map((t) => new Date(t.dueDate))));
  if (isNaN(start) || isNaN(end) || end <= start) return [];

  const totalDays = Math.max(1, Math.round((end - start) / DAY_MS));
  const stepDays = Math.max(1, Math.round(totalDays / 12)); // ~12 points on the curve
  const total = dated.length;

  const points = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + stepDays)) {
    points.push(new Date(d));
  }
  if (points[points.length - 1]?.getTime() !== end.getTime()) points.push(new Date(end));

  return points.map((date) => {
    const plannedDone = dated.filter((t) => new Date(t.dueDate) <= date).length;
    const isFuture = date > TODAY;
    const actualDone = dated.filter((t) => t.status === "done" && new Date(t.dueDate) <= (isFuture ? TODAY : date)).length;
    return {
      date: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      planned: Math.round((plannedDone / total) * 100),
      actual: Math.round((actualDone / total) * 100),
    };
  });
}

// `taskStatuses` / `priorityList` come from Master Data (useMasterData()),
// so the breakdown always reflects whatever stages/priorities admins have
// configured — not a hardcoded list.
export function statusBreakdown(tasks, taskStatuses) {
  return taskStatuses.map((s) => ({ name: s.name, value: tasks.filter((t) => t.status === s.key).length }));
}

export function priorityBreakdown(tasks, priorityList) {
  return priorityList.map((p) => ({ name: p.name, value: tasks.filter((t) => t.priority === p.name).length }));
}

function csvEscape(value) {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function exportTasksCSV(tasks, projects, teamMembers, taskStatusLabel, filename = "taskflow-report.csv") {
  const headers = ["Task", "Project", "Status", "Priority", "Assignee", "Due Date", "Checklist Progress"];
  const rows = tasks.map((t) => {
    const project = projects.find((p) => p.id === t.projectId);
    const assignee = memberById(teamMembers, t.assignee);
    const checklist = t.checklist.length ? `${t.checklist.filter((c) => c.done).length}/${t.checklist.length}` : "-";
    return [t.title, project?.name || "-", taskStatusLabel(t.status), t.priority, assignee.name, t.dueDate ? fmtDate(t.dueDate) : "-", checklist];
  });

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
