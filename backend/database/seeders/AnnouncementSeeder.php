<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $userId = fn (string $name) => User::where('name', $name)->value('id');

        $announcements = [
            ['author' => 'Rizqi Ananda', 'title' => 'Rilis TaskFlow v1.0 🎉', 'body' => 'Aplikasi project management internal kita sudah live. Silakan mulai pindahkan tracking task dari spreadsheet ke sini secara bertahap.', 'pinned' => true, 'at' => '2026-09-06 09:00:00'],
            ['author' => 'Nadia Fitriani', 'title' => 'Jadwal UAT Modul Kamar Bedah', 'body' => 'UAT modul Kamar Bedah dijadwalkan tanggal 15 September, mohon kesediaan tim terkait untuk standby di sesi tersebut.', 'pinned' => false, 'at' => '2026-09-05 11:30:00'],
            ['author' => 'Sinta Wulandari', 'title' => 'Maintenance server malam ini', 'body' => 'Akan ada maintenance server pukul 22:00–23:00 WIB. Mohon simpan pekerjaan sebelum jam tersebut.', 'pinned' => false, 'at' => '2026-09-03 16:45:00'],
        ];

        foreach ($announcements as $a) {
            Announcement::create([
                'author_id' => $userId($a['author']),
                'title' => $a['title'],
                'body' => $a['body'],
                'pinned' => $a['pinned'],
                'created_at' => $a['at'],
                'updated_at' => $a['at'],
            ]);
        }
    }
}
