# TaskFlow — Full Package (Frontend + Backend)

Satu paket berisi dua project terpisah:

```
taskflow/
├── frontend/   React + Vite + Tailwind (UI aplikasi TaskFlow)
└── backend/    Laravel 12 + MySQL (REST API)
```

## Status koneksi FE ↔ BE: sudah terhubung

Frontend sekarang mengambil dan menyimpan **semua** data lewat REST API Laravel, sehingga
setiap create / update / delete (project, task, checklist, chat, pengumuman, anggota tim, dan
Master Data) langsung tersimpan di **database MySQL** — bukan lagi di `localStorage` browser.

- Yang masih disimpan di browser hanya **token login** (`taskflow.auth.token`).
- Login memakai `POST /api/login` (Laravel Sanctum). Password tidak lagi ada di frontend.
- Hak akses tetap dicek di server (`app/Support/Permissions.php`); kalau aksi ditolak,
  frontend menampilkan pesan error dan membatalkan perubahan di layar.
- Data lama yang dulu tersimpan di `localStorage` (data demo) **tidak** dimigrasi otomatis —
  data awal sekarang datang dari `php artisan migrate --seed`.

**Urutan menjalankan: backend dulu, baru frontend.**

## 1. Menjalankan Frontend (setelah backend hidup)

```bash
cd frontend
npm install
npm run dev
```
Buka `http://localhost:5173` dan login (mis. `rizqi@taskflow.io` / `admin123`). Data diambil dari
backend; kalau backend belum jalan, layar akan menampilkan pesan "tidak dapat terhubung ke
server" beserta tombol *Coba lagi*.

Alamat API default `http://localhost:8000/api`. Kalau backend jalan di tempat lain, salin
`frontend/.env.example` menjadi `frontend/.env` lalu ubah `VITE_API_URL`.
Lihat `frontend/README.md` untuk akun demo & detail fitur.

## 2. Menjalankan Backend (jalankan ini lebih dulu)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# buat database MySQL kosong bernama `taskflow`, sesuaikan .env kalau perlu
php artisan migrate --seed
php artisan serve
```
API jalan di `http://localhost:8000/api`. Lihat `backend/README.md` untuk dokumentasi lengkap
semua endpoint + akun login untuk testing (email/password-nya sama dengan akun demo di frontend).

## 3. Kenapa dipisah begini?

Ini pola umum untuk aplikasi modern: frontend (SPA) dan backend (API) adalah dua project/
deployment terpisah yang berkomunikasi lewat HTTP — bukan satu aplikasi monolitik. Enaknya:
bisa di-develop, di-deploy, dan di-scale masing-masing secara independen (misalnya frontend di
Vercel/Netlify, backend di VPS terpisah).

## 4. Rencana selanjutnya (opsional)

1. Deploy: frontend bisa di-build (`npm run build`) jadi static file; backend perlu server PHP +
   MySQL (VPS, shared hosting yang support Laravel, atau Laravel Forge/Vapor). Ingat mengisi
   `FRONTEND_URL` di `backend/.env` dan `VITE_API_URL` di frontend dengan URL produksi.
2. Real-time: saat ini chat di-*polling* tiap beberapa detik dan data lain diambil saat halaman
   dibuka; untuk update instan antar user bisa ditambah Laravel Reverb / Pusher.
