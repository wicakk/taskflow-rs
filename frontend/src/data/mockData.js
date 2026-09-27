// Small formatting/lookup helpers shared across the app. All actual data
// (projects, tasks, team, chat, announcements, master data) now lives in the
// database and is fetched through src/api.js — nothing here is seed/demo
// data any more.

// Team members are fetched live from the API (`useTasksStore().teamMembers`),
// so this looks them up in whatever list is passed in — never a static array.
export const memberById = (list, id) =>
  list?.find((m) => m.id === id) || { initials: "?", name: "Unassigned", role: "" };

// Tasks support multiple assignees — resolves an array of ids to member objects.
export const membersByIds = (list, ids) => (ids || []).map((id) => memberById(list, id));

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

// The real current date/time — used for "days until due", the Calendar's
// "today" highlight, and Reports' overdue calculation. Evaluated once when
// the app loads (not pinned to a fixed demo date), so it always reflects
// reality rather than a hardcoded day.
export const TODAY = new Date();

export const daysUntil = (d) => Math.ceil((new Date(d) - TODAY) / 86400000);

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export const timeAgo = (d) => {
  const diffMs = new Date() - new Date(d);
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  return fmtDate(d);
};
