# TaskFlow — Full Package (Frontend + Backend)

Satu paket berisi dua project terpisah:

```
taskflow/
├── frontend/   React + Vite + Tailwind (UI aplikasi TaskFlow)
└── backend/    Laravel 12 + MySQL (REST API)
```

## ⚠️ Penting — status koneksi FE ↔ BE

**Kedua project ini belum saling terhubung.** Masing-masing bisa langsung dijalankan dan dipakai
sendiri-sendiri, tapi:

- **`frontend/`** saat ini masih menyimpan semua data (project, task, chat, dst) di
  **`localStorage` browser** — belum memanggil API sama sekali.
- **`backend/`** adalah REST API yang sudah lengkap (auth, CRUD, permission, Master Data) dan
  bisa langsung dites pakai `curl`/Postman, tapi belum ada yang "memanggilnya" dari frontend.

Supaya keduanya benar-benar terhubung (frontend ambil/simpan data lewat API, bukan localStorage
lagi), langkah `useTasksStore.jsx` & `useMasterData.jsx` di frontend perlu diubah dari
`useState + localStorage` menjadi `fetch()` ke `backend/`. **Ini belum saya kerjakan** — kalau
mau, bilang saja di pesan berikutnya dan saya sambungkan.

Sampai langkah itu dikerjakan, jalankan keduanya sebagai berikut:

## 1. Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```
Buka `http://localhost:5173` → langsung terpakai penuh (login, CRUD, dst) dengan data tersimpan
di browser. Lihat `frontend/README.md` untuk akun demo & detail fitur.

## 2. Menjalankan Backend

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

## 4. Rencana selanjutnya (kalau mau dilanjutkan)

1. Sambungkan `frontend/src/hooks/useTasksStore.jsx` & `useMasterData.jsx` ke endpoint di
   `backend/routes/api.php` (ganti `useState+localStorage` → `fetch`/`axios`).
2. Simpan token login (dari `POST /api/login`) di frontend, kirim sebagai header
   `Authorization: Bearer {token}` di setiap request ke backend.
3. Deploy: frontend bisa di-build (`npm run build`) jadi static file, backend perlu server PHP +
   MySQL (VPS, shared hosting yang support Laravel, atau platform seperti Laravel Forge/Vapor).
