<?php

namespace Database\Seeders;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        $projectMap = json_decode(file_get_contents(storage_path('app/seed-project-map.json')), true);
        $userId = fn (string $name) => User::where('name', $name)->value('id');

        $messages = [
            ['project' => 'p2', 'author' => 'Rizqi Ananda', 'text' => 'Tim, progress modul NICU sudah 45%. Minggu ini fokus ke integrasi API pasien ya.', 'at' => '2026-09-05 08:12:00'],
            ['project' => 'p2', 'author' => 'Aditya Putra', 'text' => 'Siap Pak Rizqi. Endpoint pasien sudah didesain, tinggal implementasi.', 'at' => '2026-09-05 08:20:00'],
            ['project' => 'p2', 'author' => 'Sinta Wulandari', 'text' => 'Testing modul rawat inap masih nunggu build terbaru ya, belum bisa mulai.', 'at' => '2026-09-05 10:05:00'],
            ['project' => 'p2', 'author' => 'Rizqi Ananda', 'text' => 'Noted, build baru akan saya push sore ini.', 'at' => '2026-09-05 10:30:00'],
            ['project' => 'p1', 'author' => 'Nadia Fitriani', 'text' => 'Dokumentasi business process SIMRS sudah mulai saya susun, akan share draft minggu depan.', 'at' => '2026-09-04 14:00:00'],
            ['project' => 'p1', 'author' => 'Rizqi Ananda', 'text' => 'Mantap Nadia, ditunggu ya.', 'at' => '2026-09-04 14:10:00'],
        ];

        foreach ($messages as $m) {
            ChatMessage::create([
                'project_id' => $projectMap[$m['project']],
                'author_id' => $userId($m['author']),
                'text' => $m['text'],
                'created_at' => $m['at'],
                'updated_at' => $m['at'],
            ]);
        }
    }
}
