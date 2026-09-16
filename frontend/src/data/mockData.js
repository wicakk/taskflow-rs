// Local mock data. Shaped so it can be swapped 1:1 for a REST API / Laravel
// backend later — see README.md for the suggested endpoint mapping.

// `role` = job title (shown on Team page). `accessRole` = system permission
// role used for login & authorization (see src/utils/permissions.js).
// `password` is plain text ONLY because this is local mock data for a demo —
// never do this against a real backend.
export const teamMembers = [
  { id: 1, name: "Rizqi Ananda", initials: "RA", role: "Project Manager", accessRole: "admin", email: "rizqi@taskflow.io", password: "admin123", online: true, activeTasks: 8, completedTasks: 24, workload: 72 },
  { id: 2, name: "Dewi Lestari", initials: "DL", role: "Frontend Engineer", accessRole: "member", email: "dewi@taskflow.io", password: "member123", online: true, activeTasks: 6, completedTasks: 31, workload: 58 },
  { id: 3, name: "Aditya Putra", initials: "AP", role: "Backend Engineer", accessRole: "member", email: "aditya@taskflow.io", password: "member123", online: false, activeTasks: 5, completedTasks: 19, workload: 64 },
  { id: 4, name: "Sinta Wulandari", initials: "SW", role: "QA Engineer", accessRole: "member", email: "sinta@taskflow.io", password: "member123", online: true, activeTasks: 4, completedTasks: 27, workload: 45 },
  { id: 5, name: "Bagus Prasetyo", initials: "BP", role: "UI/UX Designer", accessRole: "member", email: "bagus@taskflow.io", password: "member123", online: false, activeTasks: 3, completedTasks: 15, workload: 38 },
  { id: 6, name: "Nadia Fitriani", initials: "NF", role: "Business Analyst", accessRole: "manager", email: "nadia@taskflow.io", password: "manager123", online: true, activeTasks: 5, completedTasks: 22, workload: 51 },
  { id: 7, name: "Klien RS Sehat", initials: "KR", role: "Stakeholder", accessRole: "viewer", email: "klien@taskflow.io", password: "viewer123", online: false, activeTasks: 0, completedTasks: 0, workload: 0 },
];

export const projectSeed = [
  { id: "p1", name: "Implementasi SIMRS", description: "Sistem informasi manajemen rumah sakit terintegrasi.", status: "In Progress", priority: "High", progress: 68, startDate: "2026-06-01", dueDate: "2026-10-15", members: [1, 2, 3, 4] },
  { id: "p2", name: "Modul NICU", description: "Modul pemantauan neonatal intensive care unit.", status: "In Progress", priority: "High", progress: 45, startDate: "2026-07-10", dueDate: "2026-09-30", members: [1, 3, 4] },
  { id: "p3", name: "Modul Kamar Bedah", description: "Penjadwalan dan pencatatan tindakan operasi.", status: "In Progress", priority: "Medium", progress: 30, startDate: "2026-07-20", dueDate: "2026-11-05", members: [2, 5] },
  { id: "p4", name: "Modul Kebidanan", description: "Pencatatan persalinan dan rekam ibu & anak.", status: "Planning", priority: "Medium", progress: 12, startDate: "2026-08-15", dueDate: "2026-12-01", members: [1, 6] },
  { id: "p5", name: "Integrasi Laboratorium", description: "Integrasi hasil lab dengan sistem rekam medis.", status: "Review", priority: "High", progress: 82, startDate: "2026-05-05", dueDate: "2026-09-20", members: [3, 4, 6] },
  { id: "p6", name: "eLLIMS Integration", description: "Sinkronisasi data laboratorium eksternal eLLIMS.", status: "Completed", priority: "Low", progress: 100, startDate: "2026-04-01", dueDate: "2026-07-30", members: [2, 3] },
];

export const taskSeed = [
  { id: "t1", projectId: "p2", title: "Analisis kebutuhan modul NICU", status: "done", priority: "High", assignees: [1], labels: ["Analysis"], dueDate: "2026-09-01", checklist: [{ text: "Wawancara unit NICU", done: true }, { text: "Dokumentasi kebutuhan", done: true }], comments: 3, attachments: 2, description: "Menggali kebutuhan fungsional dari unit NICU untuk modul pemantauan neonatal." },
  { id: "t2", projectId: "p2", title: "Mapping form assessment dokter", status: "done", priority: "Medium", assignees: [6], labels: ["Design"], dueDate: "2026-09-03", checklist: [{ text: "Review form eksisting", done: true }], comments: 1, attachments: 1, description: "Memetakan form assessment dokter ke struktur data digital." },
  { id: "t3", projectId: "p2", title: "Implementasi Modul NICU", status: "inprogress", priority: "High", assignees: [1], labels: ["Frontend", "Backend"], dueDate: "2026-09-18", checklist: [{ text: "Analisis kebutuhan", done: true }, { text: "Mapping form", done: true }, { text: "Implementasi frontend", done: false }, { text: "Implementasi backend", done: false }, { text: "Testing", done: false }, { text: "UAT", done: false }], comments: 5, attachments: 4, description: "Membangun modul NICU end-to-end mencakup frontend dan backend, termasuk integrasi data vital pasien." },
  { id: "t4", projectId: "p2", title: "Implementasi API pasien", status: "inprogress", priority: "High", assignees: [3], labels: ["Backend"], dueDate: "2026-09-14", checklist: [{ text: "Desain endpoint", done: true }, { text: "Implementasi", done: false }], comments: 2, attachments: 0, description: "Membangun REST API untuk data pasien NICU." },
  { id: "t5", projectId: "p1", title: "Testing modul rawat inap", status: "review", priority: "Medium", assignees: [4], labels: ["QA"], dueDate: "2026-09-10", checklist: [{ text: "Buat test case", done: true }, { text: "Eksekusi test", done: true }], comments: 4, attachments: 1, description: "Pengujian fungsional modul rawat inap sebelum rilis." },
  { id: "t6", projectId: "p1", title: "Dokumentasi business process", status: "todo", priority: "Low", assignees: [6], labels: ["Docs"], dueDate: "2026-09-25", checklist: [], comments: 0, attachments: 0, description: "Menyusun dokumentasi alur proses bisnis SIMRS." },
  { id: "t7", projectId: "p3", title: "Demo SIMRS ke unit", status: "todo", priority: "Medium", assignees: [1], labels: ["Meeting"], dueDate: "2026-09-20", checklist: [], comments: 1, attachments: 0, description: "Presentasi demo aplikasi ke unit kamar bedah." },
  { id: "t8", projectId: "p5", title: "Perbaikan hasil UAT", status: "review", priority: "High", assignees: [3], labels: ["Bugfix"], dueDate: "2026-09-12", checklist: [{ text: "Kumpulkan temuan UAT", done: true }, { text: "Perbaikan", done: false }], comments: 6, attachments: 3, description: "Menindaklanjuti temuan hasil User Acceptance Test." },
  { id: "t9", projectId: "p5", title: "Deployment production", status: "done", priority: "High", assignees: [1], labels: ["DevOps"], dueDate: "2026-09-05", checklist: [{ text: "Backup database", done: true }, { text: "Deploy", done: true }], comments: 2, attachments: 0, description: "Rilis modul integrasi laboratorium ke lingkungan produksi." },
  { id: "t10", projectId: "p4", title: "Wireframe modul kebidanan", status: "todo", priority: "Medium", assignees: [5], labels: ["Design"], dueDate: "2026-09-22", checklist: [], comments: 0, attachments: 1, description: "Membuat wireframe alur pencatatan persalinan." },
  { id: "t11", projectId: "p1", title: "Review keamanan API", status: "inprogress", priority: "High", assignees: [3], labels: ["Security"], dueDate: "2026-09-16", checklist: [{ text: "Audit endpoint", done: false }], comments: 1, attachments: 0, description: "Audit keamanan pada seluruh endpoint API SIMRS." },
  { id: "t12", projectId: "p6", title: "Sinkronisasi data eLLIMS", status: "done", priority: "Medium", assignees: [2], labels: ["Integration"], dueDate: "2026-07-28", checklist: [{ text: "Mapping field", done: true }, { text: "Testing sync", done: true }], comments: 3, attachments: 2, description: "Menyelaraskan struktur data antara SIMRS dan eLLIMS." },
];

// Team members are stateful (CRUD via useTasksStore), so this now takes the
// live list instead of always reading the static seed above.
export const memberById = (list, id) =>
  list?.find((m) => m.id === id) || { initials: "?", name: "Unassigned", role: "" };

// Tasks support multiple assignees — resolves an array of ids to member objects.
export const membersByIds = (list, ids) => (ids || []).map((id) => memberById(list, id));
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

// "Today" is pinned to the app's reference date so seed data (due dates)
// stays meaningful. Replace with `new Date()` once real data is wired up.
export const TODAY = new Date("2026-09-06");
export const daysUntil = (d) => Math.ceil((new Date(d) - TODAY) / 86400000);

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export const timeAgo = (d) => {
  const diffMs = TODAY - new Date(d);
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  return fmtDate(d);
};

/* ---------------- group chat (per project) ---------------- */
export const chatSeed = [
  { id: "c1", projectId: "p2", authorId: 1, text: "Tim, progress modul NICU sudah 45%. Minggu ini fokus ke integrasi API pasien ya.", timestamp: "2026-09-05T08:12:00" },
  { id: "c2", projectId: "p2", authorId: 3, text: "Siap Pak Rizqi. Endpoint pasien sudah didesain, tinggal implementasi.", timestamp: "2026-09-05T08:20:00" },
  { id: "c3", projectId: "p2", authorId: 4, text: "Testing modul rawat inap masih nunggu build terbaru ya, belum bisa mulai.", timestamp: "2026-09-05T10:05:00" },
  { id: "c4", projectId: "p2", authorId: 1, text: "Noted, build baru akan saya push sore ini.", timestamp: "2026-09-05T10:30:00" },
  { id: "c5", projectId: "p1", authorId: 6, text: "Dokumentasi business process SIMRS sudah mulai saya susun, akan share draft minggu depan.", timestamp: "2026-09-04T14:00:00" },
  { id: "c6", projectId: "p1", authorId: 1, text: "Mantap Nadia, ditunggu ya.", timestamp: "2026-09-04T14:10:00" },
];

/* ---------------- announcements (global, all roles can post) ---------------- */
export const announcementSeed = [
  {
    id: "a1",
    authorId: 1,
    title: "Rilis TaskFlow v1.0 🎉",
    body: "Aplikasi project management internal kita sudah live. Silakan mulai pindahkan tracking task dari spreadsheet ke sini secara bertahap.",
    timestamp: "2026-09-06T09:00:00",
    pinned: true,
  },
  {
    id: "a2",
    authorId: 6,
    title: "Jadwal UAT Modul Kamar Bedah",
    body: "UAT modul Kamar Bedah dijadwalkan tanggal 15 September, mohon kesediaan tim terkait untuk standby di sesi tersebut.",
    timestamp: "2026-09-05T11:30:00",
    pinned: false,
  },
  {
    id: "a3",
    authorId: 4,
    title: "Maintenance server malam ini",
    body: "Akan ada maintenance server pukul 22:00–23:00 WIB. Mohon simpan pekerjaan sebelum jam tersebut.",
    timestamp: "2026-09-03T16:45:00",
    pinned: false,
  },
];
