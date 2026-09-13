import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fmtDate, memberById } from "../data/mockData";

const PRIMARY = [115, 103, 240]; // #7367F0 as RGB for jsPDF

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [90, 88, 115];
};

// Generates a structured PDF report: header, summary stats, status/priority
// percentage breakdown, and a full task-by-task table — all computed live
// from whatever task data is passed in (i.e. real current state, not seed),
// with status names/colors sourced from Master Data (taskStatuses).
export function generateReportPDF({ scopeLabel, tasks, projects, teamMembers, byStatus, byPriority, taskStatuses, taskStatusLabel }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 50;

  const statusColorRgb = {};
  taskStatuses.forEach((s) => {
    statusColorRgb[s.name] = hexToRgb(s.color);
  });

  // Header
  doc.setFillColor(...PRIMARY);
  doc.roundedRect(marginX, y - 22, 26, 26, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("T", marginX + 9, y - 4);

  doc.setTextColor(43, 41, 66);
  doc.setFontSize(16);
  doc.text("TaskFlow — Project Report", marginX + 36, y - 4);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 130);
  const generatedAt = new Date().toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  doc.text(`Scope: ${scopeLabel}  •  Generated: ${generatedAt}`, marginX + 36, y + 12);

  y += 40;
  doc.setDrawColor(233, 231, 240);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 24;

  // Summary stats
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "inprogress").length;
  const overdueCount = tasks.filter((t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const completionPct = total ? Math.round((done / total) * 100) : 0;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 41, 66);
  doc.text("Summary", marginX, y);
  y += 16;

  const statRow = [
    ["Total Tasks", String(total)],
    ["Completed", `${done} (${completionPct}%)`],
    ["In Progress", String(inProgress)],
    ["Overdue", String(overdueCount)],
  ];
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: "plain",
    body: [statRow.map((s) => s[0]), statRow.map((s) => s[1])],
    styles: { fontSize: 9.5, cellPadding: 4, halign: "left" },
    bodyStyles: { textColor: [90, 88, 115] },
    didParseCell: (data) => {
      if (data.row.index === 0) {
        data.cell.styles.textColor = [150, 150, 160];
        data.cell.styles.fontSize = 8.5;
      }
      if (data.row.index === 1) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 13;
        data.cell.styles.textColor = [43, 41, 66];
      }
    },
  });
  y = doc.lastAutoTable.finalY + 24;

  // Status & priority breakdown (as percentages, read live from current data)
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 41, 66);
  doc.text("Breakdown by Status", marginX, y);
  doc.text("Breakdown by Priority", marginX + (pageWidth - marginX * 2) / 2 + 10, y);
  y += 10;

  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  const statusRows = byStatus.map((s) => [s.name, `${s.value} task`, `${pct(s.value)}%`]);
  const priorityRows = byPriority.map((p) => [p.name, `${p.value} task`, `${pct(p.value)}%`]);

  const halfWidth = (pageWidth - marginX * 2 - 20) / 2;

  autoTable(doc, {
    startY: y + 6,
    margin: { left: marginX, right: pageWidth - marginX - halfWidth },
    tableWidth: halfWidth,
    theme: "striped",
    head: [["Status", "Count", "%"]],
    body: statusRows,
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: PRIMARY, textColor: 255, fontSize: 9 },
  });
  const leftFinalY = doc.lastAutoTable.finalY;

  autoTable(doc, {
    startY: y + 6,
    margin: { left: marginX + halfWidth + 20, right: marginX },
    tableWidth: halfWidth,
    theme: "striped",
    head: [["Priority", "Count", "%"]],
    body: priorityRows,
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: PRIMARY, textColor: 255, fontSize: 9 },
  });
  const rightFinalY = doc.lastAutoTable.finalY;

  y = Math.max(leftFinalY, rightFinalY) + 28;

  // Full task breakdown table — which tasks are actually done, in progress, etc.
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 41, 66);
  doc.text("Task Detail", marginX, y);
  y += 8;

  const taskRows = tasks
    .slice()
    .sort((a, b) => (a.status === "done") - (b.status === "done") || new Date(a.dueDate || 0) - new Date(b.dueDate || 0))
    .map((t) => {
      const project = projects.find((p) => p.id === t.projectId);
      const assignee = memberById(teamMembers, t.assignee);
      const checklistPct = t.checklist.length
        ? `${Math.round((t.checklist.filter((c) => c.done).length / t.checklist.length) * 100)}%`
        : "-";
      return [
        t.title,
        project?.name || "-",
        taskStatusLabel(t.status),
        t.priority,
        assignee.name,
        t.dueDate ? fmtDate(t.dueDate) : "-",
        checklistPct,
      ];
    });

  autoTable(doc, {
    startY: y + 6,
    margin: { left: marginX, right: marginX },
    head: [["Task", "Project", "Status", "Priority", "Assignee", "Due Date", "Checklist"]],
    body: taskRows,
    styles: { fontSize: 8.5, cellPadding: 5, overflow: "linebreak" },
    headStyles: { fillColor: PRIMARY, textColor: 255, fontSize: 8.5 },
    alternateRowStyles: { fillColor: [247, 247, 251] },
    columnStyles: { 0: { cellWidth: 140 } },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 2) {
        const status = data.cell.raw;
        const rgb = statusColorRgb[status];
        if (rgb) data.cell.styles.textColor = rgb;
        data.cell.styles.fontStyle = "bold";
      }
    },
    didDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 170);
      doc.text(
        `TaskFlow — Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
        pageWidth - marginX,
        doc.internal.pageSize.getHeight() - 20,
        { align: "right" }
      );
    },
  });

  doc.save(`taskflow-report-${scopeLabel.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
