# TaskFlow API — Laravel 12 + MySQL

Backend siap pakai untuk aplikasi TaskFlow (React frontend). Ini adalah **project Laravel 12
lengkap** (skeleton resmi dari `laravel/laravel`, bukan tempelan file) + kode aplikasi
(model, controller, migration, seeder) sudah digabungkan di dalamnya. Kamu tinggal
`composer install` dan jalankan.

> **Transparansi:** Skeleton Laravel (struktur folder, `bootstrap/app.php`, `public/index.php`,
> config bawaan, dll) diambil langsung dari repo resmi `laravel/laravel` branch `12.x` — jadi
> itu bagian yang 100% asli dan terjamin valid. Kode aplikasi di atasnya (folder
> `app/Models`, `app/Http/Controllers/Api`, `app/Http/Resources`, `app/Support`, migration,
> seeder, `routes/api.php`) saya tulis manual dan sudah lolos cek sintaks PHP
> (`php -l`, 0 error). Yang **belum** bisa saya lakukan di sisi saya: menjalankan
> `composer install` sungguhan dan `php artisan migrate --seed` end-to-end, karena
> environment saya tidak punya akses ke Packagist maupun server MySQL. Jalankan langkah
> di bawah ini di komputermu untuk verifikasi — kemungkinan besar langsung jalan, tapi
> kalau ada error kecil, cek bagian **Troubleshooting** di paling bawah.

## 1. Kebutuhan

- PHP 8.2+
- Composer
- MySQL (atau MariaDB) yang sudah jalan

## 2. Instalasi

```bash
cd taskflow-backend

# 1. Install dependency (Laravel framework, Sanctum, dll)
composer install

# 2. Salin file environment
cp .env.example .env
php artisan key:generate

# 3. Buat database kosong bernama `taskflow` di MySQL, lalu sesuaikan
#    DB_USERNAME / DB_PASSWORD di .env kalau perlu

# 4. Migrate + seed — otomatis mengisi data contoh yang IDENTIK dengan
#    frontend (7 user, 6 project, 12 task, chat, pengumuman, semua Master Data)
php artisan migrate --seed

# 5. Jalankan server
php artisan serve
```

API akan jalan di **http://localhost:8000/api**.

## 3. Login untuk testing

Akun sama persis dengan demo akun di frontend:

| Role | Email | Password |
|---|---|---|
| Admin | rizqi@taskflow.io | admin123 |
| Project Manager | nadia@taskflow.io | manager123 |
| Member | dewi@taskflow.io | member123 |
| Viewer | klien@taskflow.io | viewer123 |

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rizqi@taskflow.io","password":"admin123"}'
# -> { "user": {...}, "token": "1|xxxxxxxxxxxxx" }

curl http://localhost:8000/api/projects \
  -H "Authorization: Bearer 1|xxxxxxxxxxxxx"
```

## 4. Apa yang beda dari skeleton `laravel new` polos

| Bagian | Keterangan |
|---|---|
| `app/Models/User.php` | Ditambah kolom `initials`, `role`, `access_role`, `online`, `active_tasks`, `completed_tasks`, `workload` + method `hasPermission()` |
| `app/Models/*` lainnya | Project, Task, ChecklistItem, ChatMessage, Announcement, + 6 model Master Data |
| `app/Http/Controllers/Api/*` | 8 controller: Auth, Project, Task, ChecklistItem, User (Team), Chat, Announcement, MasterData |
| `app/Http/Resources/*` | Transformer JSON ke camelCase, cocok langsung dengan struktur data frontend |
| `app/Http/Middleware/EnsurePermission.php` | Middleware `permission:xxx` untuk proteksi route (didaftarkan di `bootstrap/app.php`) |
| `app/Support/Permissions.php` | Matrix hak akses — **sama persis** dengan `src/utils/permissions.js` di frontend |
| `database/migrations/0001_01_01_000000_create_users_table.php` | Tabel `users` bawaan dimodifikasi (kolom tambahan di atas) |
| `database/migrations/0001_01_01_000003_create_personal_access_tokens_table.php` | Migration Sanctum (biasanya didapat lewat `vendor:publish`, sudah saya sertakan langsung) |
| `database/migrations/2024_01_01_*` | 12 migration tambahan: Master Data (6 tabel), projects, project_user, tasks, master_label_task, checklist_items, chat_messages, announcements |
| `database/seeders/*` | Data contoh identik dengan `mockData.js` & `useMasterData.jsx` frontend |
| `routes/api.php` | Semua endpoint API, dikelompokkan di bawah `auth:sanctum` |
| `config/auth.php` | Ditambah guard `sanctum` |
| `config/cors.php` | Baru — izinkan origin `http://localhost:5173` (Vite dev server) mengakses API dengan credentials |
| `bootstrap/app.php` | Ditambah routing `api: routes/api.php` + alias middleware `permission` |
| `.env.example` | Default ke MySQL (bukan SQLite), session/cache pakai `file` (bukan `database`, jadi tidak perlu tabel sessions/cache aktif), queue `sync`, + `FRONTEND_URL` |

## 5. Referensi API

Semua endpoint (kecuali `/login`) butuh header `Authorization: Bearer {token}`.

### Auth
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/login` | `{ email, password }` → `{ user, token }` |
| POST | `/api/logout` | Cabut token yang sedang dipakai |
| GET | `/api/me` | User yang sedang login |

### Projects
| Method | Endpoint | Permission | Keterangan |
|---|---|---|---|
| GET | `/api/projects` | — | List semua project + members |
| GET | `/api/projects/{id}` | — | Detail 1 project |
| POST | `/api/projects` | `project:create` | Body: name, description, status, priority, department, startDate, dueDate, progress, members[] |
| PUT | `/api/projects/{id}` | `project:edit` | Partial update |
| DELETE | `/api/projects/{id}` | `project:delete` | Task di dalamnya ikut terhapus (cascade) |

### Tasks
| Method | Endpoint | Permission | Keterangan |
|---|---|---|---|
| GET | `/api/tasks?project_id=&assignee_id=` | — | Filter opsional |
| GET | `/api/tasks/{id}` | — | Detail + labels + checklist |
| POST | `/api/tasks` | `task:create` | Body: projectId, title, description, status, priority, assignees[] (array of user id), dueDate, labels[] |
| PUT | `/api/tasks/{id}` | `task:edit` (atau `task:move` kalau body cuma `{status}`) | Partial update |
| DELETE | `/api/tasks/{id}` | `task:delete` | |
| POST | `/api/tasks/{id}/checklist` | `task:edit` | `{ text }` |
| PUT | `/api/checklist/{id}` | `task:edit` (atau `task:move` kalau cuma toggle `{done}`) | |
| DELETE | `/api/checklist/{id}` | `task:edit` | |

### Team (Users)
| Method | Endpoint | Permission | Keterangan |
|---|---|---|---|
| GET | `/api/users` | — | List semua anggota tim |
| POST | `/api/users` | `team:manage` (admin) | Body: name, email, password, role, accessRole |
| PUT | `/api/users/{id}` | `team:manage` (admin) | Password opsional (kosongkan = tidak berubah) |
| DELETE | `/api/users/{id}` | `team:manage` (admin) | Tidak bisa hapus akun sendiri |

### Chat (per project)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/projects/{id}/chat` | List pesan, urut waktu |
| POST | `/api/projects/{id}/chat` | `{ text }` |
| DELETE | `/api/chat/{id}` | Hanya pengirim sendiri atau Admin |

### Announcements
| Method | Endpoint | Permission | Keterangan |
|---|---|---|---|
| GET | `/api/announcements` | — | Pinned dulu, lalu terbaru |
| POST | `/api/announcements` | — (semua role) | `{ title, body, pinned? }` — `pinned` diabaikan kalau role tidak punya `announcement:pin` |
| PUT | `/api/announcements/{id}` | `announcement:pin` | Toggle pin |
| DELETE | `/api/announcements/{id}` | Penulis sendiri atau Admin | |

### Master Data
`{type}` = `taskStatuses` \| `priorities` \| `projectStatuses` \| `labels` \| `departments` \| `jobTitles`

| Method | Endpoint | Permission | Keterangan |
|---|---|---|---|
| GET | `/api/master-data/{type}` | — | List, urut `order` (kalau ada) atau `name` |
| POST | `/api/master-data/{type}` | `master:manage` (admin) | |
| PUT | `/api/master-data/{type}/{id}` | `master:manage` | `key` (taskStatuses) tidak bisa diubah |
| DELETE | `/api/master-data/{type}/{id}` | `master:manage` | Ditolak (422) kalau masih dipakai |
| POST | `/api/master-data/{type}/{id}/move` | `master:manage` | `{ direction: -1 \| 1 }` — reorder |

## 6. Menyambungkan ke frontend React

Di project React, ganti isi `src/hooks/useTasksStore.jsx` dan `src/hooks/useMasterData.jsx`
dari `useState(seed) + localStorage` menjadi `fetch()`/`axios` ke endpoint di atas. Resource
class di backend ini sudah dibuat camelCase dan strukturnya sama persis dengan mock data
frontend, jadi sebagian besar komponen UI **tidak perlu diubah** — cukup sumber datanya saja
yang pindah. Simpan `token` hasil login di frontend, kirim sebagai header
`Authorization: Bearer {token}` di setiap request. Bilang saja kalau mau saya bantu kerjakan
langkah ini di sesi berikutnya.

## 7. Troubleshooting

- **`Class "Laravel\Sanctum\HasApiTokens" not found`** → jalankan `composer install` dulu,
  pastikan tidak ada error saat instalasi.
- **`SQLSTATE[HY000] [1049] Unknown database 'taskflow'`** → buat databasenya dulu secara
  manual di MySQL: `CREATE DATABASE taskflow;`
- **`Auth guard [sanctum] is not defined`** → pastikan `config/auth.php` punya entri
  `'sanctum' => ['driver' => 'sanctum', 'provider' => 'users']` di dalam `'guards'` (sudah saya
  tambahkan di file ini, tapi cek lagi kalau ke-overwrite).
- **CORS error di browser saat frontend memanggil API** → pastikan `FRONTEND_URL` di `.env`
  cocok dengan alamat Vite dev server kamu (default `http://localhost:5173`).
- **Enum `access_role` error di MySQL versi lama/MariaDB** → ganti tipe kolom itu di migration
  `0001_01_01_000000_create_users_table.php` dari `enum(...)` jadi `string()`; validasi
  `Rule::in()` di `UserController` tetap menjaga nilainya valid.
