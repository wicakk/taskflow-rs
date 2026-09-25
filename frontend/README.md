# TaskFlow — Project Management App

Aplikasi project management modern (React.js + Tailwind CSS), terinspirasi ClickUp / Monday.com / Linear,
dengan visual language ungu (#7367F0) sesuai design system yang diminta.

## Menjalankan secara lokal

Butuh Node.js 18+ terpasang.

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:5173` di browser.

Untuk build production:

```bash
npm run build
npm run preview
```

## Struktur proyek

```
src/
├── components/
│   ├── auth/        ProtectedRoute
│   ├── layout/      Sidebar, Header
│   ├── dashboard/   StatCard
│   ├── projects/    ProjectCard, ProjectTimeline, ProjectFormModal
│   ├── tasks/       TaskDetail (drawer, with inline edit), TaskListTable, TaskFormModal
│   ├── kanban/       KanbanBoard, KanbanColumn, KanbanTaskCard
│   ├── calendar/    CalendarGrid
│   ├── team/        TeamCard, MemberFormModal
│   └── common/      Button, Badge, Avatar, Card, ProgressBar, Input, Textarea, Select,
│                    Dropdown, Modal, MenuButton, ConfirmDialog
├── pages/           Login, Dashboard, Projects, ProjectDetail, MyTasks, Calendar, Team, Reports, Settings
├── layouts/         MainLayout (sidebar + header + outlet + task modal)
├── hooks/           useTheme (dark mode), useTasksStore (projects/tasks/team + CRUD), useAuth (login/logout/permissions)
├── utils/           permissions.js — role → action matrix
├── data/            mockData.js — local mock data (projects, tasks, team incl. login credentials)
├── theme.js         design tokens shared between Tailwind config and JS (colors, helpers)
├── App.jsx          route definitions + provider wiring
└── main.jsx         entry point (BrowserRouter)
```

## Login & Demo Accounts

Aplikasi sekarang mewajibkan login (route selain `/login` dilindungi `ProtectedRoute`).
Ada 4 role dengan hak akses berbeda — gunakan salah satu akun demo di bawah, atau klik
kartu "Demo accounts" di halaman login untuk login otomatis:

| Role | Email | Password | Hak akses |
|---|---|---|---|
| Admin | rizqi@taskflow.io | admin123 | Semua akses, termasuk kelola tim & role |
| Project Manager | nadia@taskflow.io | manager123 | CRUD project & task penuh, tidak bisa kelola role tim |
| Member | dewi@taskflow.io | member123 | Bisa buat/ubah task, tidak bisa hapus/kelola project |
| Viewer | klien@taskflow.io | viewer123 | Read-only — tidak ada tombol create/edit/delete, drag & drop kanban nonaktif |

Login memakai API backend (`POST /api/login`); token-nya disimpan di `localStorage` (key
`taskflow.auth.token`) sehingga tetap login setelah refresh. Logout tersedia di sidebar (ikon di sebelah nama) dan di dropdown profil
pada header.

Matrix hak akses ada di `src/utils/permissions.js` — mudah diubah kalau kebutuhan role
berbeda dari yang di atas.

## Fitur

- Dashboard dengan stat card, recent projects, upcoming deadlines, task progress, team activity
- Projects — grid/list view, search, **create/edit/delete project** (modal form lengkap, dengan pemilihan member)
- Project Detail — tab Board / List / Timeline / **Chat** / Calendar / Files / Activity, Kanban board drag & drop, tombol **Add Task** per kolom
- **Group Chat per Project** — tab "Chat" di setiap project, kirim & hapus pesan sendiri, badge jumlah pesan di tab
- **Announcements** — papan pengumuman untuk seluruh tim (menu tersendiri di sidebar), semua role bisa posting, pin ke atas (Admin/Manager), hapus milik sendiri atau siapa saja (Admin), muncul juga sebagai banner di Dashboard
- Task Detail drawer — **edit inline** (judul, deskripsi, priority, **multi-assignee**, due date, label), **tambah/hapus checklist item**, **hapus task**, ubah status
- My Tasks — filter All / Today / Upcoming / Overdue / Completed, berdasarkan user yang sedang login, plus **tombol New Task** (langsung pilih project)
- **Reports** — filter per project / semua project, **Kurva S** (planned vs actual progress berdasarkan due date, pakai Recharts), grafik + **persentase breakdown** task by status & by priority, **tabel rincian setiap task** (status, progress checklist per task), **Export CSV** dan **Export PDF** (laporan siap cetak lengkap dengan ringkasan, breakdown %, dan daftar task)
- **Master Data** (khusus Admin) — kelola data acuan yang dipakai di seluruh aplikasi, dengan sub-menu:
  - **Task Status** (kolom Kanban) — bisa tambah/ubah/hapus/reorder tahapan workflow, warna & nama bebas diubah
  - **Priority** — level prioritas (Low/Medium/High) beserta warnanya
  - **Project Status** — status project (Planning/In Progress/dst)
  - **Labels** — tag untuk task, dipilih via chip multi-select saat membuat/edit task
  - **Departments/Units** — unit/modul yang bisa dikaitkan ke project
  - **Job Titles** — jabatan untuk dropdown saat menambah anggota tim
  
  Semua form (New Project, New Task, Add Member) dan tampilan (Kanban, badge status/priority, Reports) otomatis mengikuti data dari Master Data ini — bukan lagi hardcode. Item yang masih dipakai (ditandai "used by N task/project") tidak bisa dihapus untuk mencegah data rusak.
- **Semua form tampil sebagai drawer dari samping kanan** (New Project, New Task, Add Member, New Announcement) — bukan popup di tengah, konsisten dengan drawer Task Detail, lengkap dengan animasi slide.
- **Data tersimpan di database** — semua perubahan (task, project, chat, pengumuman, anggota tim, dan Master Data) dikirim ke REST API Laravel dan tersimpan di MySQL, jadi konsisten di semua perangkat dan tetap ada setelah reload. Halaman Settings punya tombol *Muat ulang data* untuk mengambil data terbaru dari server.
- Calendar — month view dengan deadline per tanggal
- Team — **tambah/edit/hapus anggota** beserta role akses (khusus Admin)
- Dark mode penuh lewat `ThemeProvider` + `useTheme()`
- Routing nyata dengan `react-router-dom`, dilindungi `ProtectedRoute`
- **Login/logout** dengan 4 role (Admin, Project Manager, Member, Viewer) dan matrix hak akses granular per aksi (create/edit/delete project, create/edit/delete/move task, kelola tim)


## Database & koneksi ke backend

Aplikasi ini terhubung ke backend Laravel (`../backend`). Semua data disimpan di database MySQL
lewat REST API; browser hanya menyimpan token login.

- `src/api.js` — pembungkus `fetch` (base URL dari `VITE_API_URL`, header `Authorization: Bearer`,
  pesan error dari validasi Laravel, logout otomatis kalau token kedaluwarsa).
- `src/hooks/useAuth.jsx` — login/logout/`/me` ke API.
- `src/hooks/useTasksStore.jsx` — project, task, checklist, tim, chat, pengumuman (semua CRUD ke API;
  drag & drop kanban dan checklist memakai *optimistic update* dengan rollback kalau server menolak).
- `src/hooks/useMasterData.jsx` — Master Data lewat `/api/master-data/{type}`.
- `src/hooks/useToast.jsx` — notifikasi error (mis. tidak punya izin, validasi gagal, server mati).

Jalankan backend dulu (`cd ../backend && php artisan serve`), lalu `npm run dev`.
Alamat API bisa diubah lewat `.env` (lihat `.env.example`).

## Catatan

- Warna dan token desain didefinisikan dua kali secara sengaja: sekali di `tailwind.config.js`
  (untuk class utility seperti `bg-primary`) dan sekali di `src/theme.js` (untuk nilai dinamis
  yang dipakai lewat inline style, misalnya warna avatar/badge yang bergantung data). Keduanya
  memakai hex yang sama persis dari brief.
- Tanggal "hari ini" untuk keperluan mock (badge overdue, kalender) di-pin ke `2026-09-06` di
  `src/data/mockData.js` (`TODAY`). Data seed di file itu sudah tidak dipakai lagi (data asli dari
  database); yang masih dipakai hanya fungsi bantu seperti `fmtDate`, `memberById`, dan `TODAY`.
  Ganti `TODAY` ke `new Date()` kalau ingin badge overdue/kalender mengikuti tanggal sebenarnya.
