<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $byName = fn (array $names) => User::whereIn('name', $names)->pluck('id')->all();

        $projects = [
            'p1' => ['name' => 'Implementasi SIMRS', 'description' => 'Sistem informasi manajemen rumah sakit terintegrasi.', 'status' => 'In Progress', 'priority' => 'High', 'department' => 'SIMRS SEHAT', 'progress' => 68, 'start_date' => '2026-06-01', 'due_date' => '2026-10-15', 'members' => ['Rizqi Ananda', 'Dewi Lestari', 'Aditya Putra', 'Sinta Wulandari']],
            'p2' => ['name' => 'Modul NICU', 'description' => 'Modul pemantauan neonatal intensive care unit.', 'status' => 'In Progress', 'priority' => 'High', 'department' => 'NICU', 'progress' => 45, 'start_date' => '2026-07-10', 'due_date' => '2026-09-30', 'members' => ['Rizqi Ananda', 'Aditya Putra', 'Sinta Wulandari']],
            'p3' => ['name' => 'Modul Kamar Bedah', 'description' => 'Penjadwalan dan pencatatan tindakan operasi.', 'status' => 'In Progress', 'priority' => 'Medium', 'department' => 'Kamar Bedah', 'progress' => 30, 'start_date' => '2026-07-20', 'due_date' => '2026-11-05', 'members' => ['Dewi Lestari', 'Bagus Prasetyo']],
            'p4' => ['name' => 'Modul Kebidanan', 'description' => 'Pencatatan persalinan dan rekam ibu & anak.', 'status' => 'Planning', 'priority' => 'Medium', 'department' => 'Kebidanan', 'progress' => 12, 'start_date' => '2026-08-15', 'due_date' => '2026-12-01', 'members' => ['Rizqi Ananda', 'Nadia Fitriani']],
            'p5' => ['name' => 'Integrasi Laboratorium', 'description' => 'Integrasi hasil lab dengan sistem rekam medis.', 'status' => 'Review', 'priority' => 'High', 'department' => 'eLLIMS', 'progress' => 82, 'start_date' => '2026-05-05', 'due_date' => '2026-09-20', 'members' => ['Aditya Putra', 'Sinta Wulandari', 'Nadia Fitriani']],
            'p6' => ['name' => 'eLLIMS Integration', 'description' => 'Sinkronisasi data laboratorium eksternal eLLIMS.', 'status' => 'Completed', 'priority' => 'Low', 'department' => 'eLLIMS', 'progress' => 100, 'start_date' => '2026-04-01', 'due_date' => '2026-07-30', 'members' => ['Dewi Lestari', 'Aditya Putra']],
        ];

        // Exposed so TaskSeeder/ChatSeeder can look up real DB ids via these mock keys.
        $map = [];

        foreach ($projects as $key => $data) {
            $memberNames = $data['members'];
            unset($data['members']);

            $project = Project::create($data);
            $project->members()->sync($byName($memberNames));

            $map[$key] = $project->id;
        }

        file_put_contents(storage_path('app/seed-project-map.json'), json_encode($map));
    }
}
