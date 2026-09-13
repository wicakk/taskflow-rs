<?php

namespace Database\Seeders;

use App\Models\MasterDepartment;
use App\Models\MasterJobTitle;
use App\Models\MasterLabel;
use App\Models\MasterPriority;
use App\Models\MasterProjectStatus;
use App\Models\MasterTaskStatus;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $taskStatuses = [
            ['key' => 'todo', 'name' => 'To Do', 'color' => '#9CA3AF', 'order' => 1],
            ['key' => 'inprogress', 'name' => 'In Progress', 'color' => '#7367F0', 'order' => 2],
            ['key' => 'review', 'name' => 'Review', 'color' => '#00CFE8', 'order' => 3],
            ['key' => 'done', 'name' => 'Done', 'color' => '#28C76F', 'order' => 4],
        ];
        foreach ($taskStatuses as $s) {
            MasterTaskStatus::create($s);
        }

        $priorities = [
            ['name' => 'Low', 'color' => '#00CFE8', 'order' => 1],
            ['name' => 'Medium', 'color' => '#FF9F43', 'order' => 2],
            ['name' => 'High', 'color' => '#EA5455', 'order' => 3],
        ];
        foreach ($priorities as $p) {
            MasterPriority::create($p);
        }

        $projectStatuses = [
            ['name' => 'Planning', 'color' => '#FF9F43', 'order' => 1],
            ['name' => 'In Progress', 'color' => '#7367F0', 'order' => 2],
            ['name' => 'Review', 'color' => '#00CFE8', 'order' => 3],
            ['name' => 'Completed', 'color' => '#28C76F', 'order' => 4],
        ];
        foreach ($projectStatuses as $s) {
            MasterProjectStatus::create($s);
        }

        $labels = [
            ['name' => 'Analysis', 'color' => '#00CFE8'],
            ['name' => 'Design', 'color' => '#9B8AFB'],
            ['name' => 'Frontend', 'color' => '#7367F0'],
            ['name' => 'Backend', 'color' => '#28C76F'],
            ['name' => 'QA', 'color' => '#FF9F43'],
            ['name' => 'Docs', 'color' => '#9CA3AF'],
            ['name' => 'Meeting', 'color' => '#00CFE8'],
            ['name' => 'Bugfix', 'color' => '#EA5455'],
            ['name' => 'DevOps', 'color' => '#5E5873'],
            ['name' => 'Security', 'color' => '#EA5455'],
            ['name' => 'Integration', 'color' => '#28C76F'],
        ];
        foreach ($labels as $l) {
            MasterLabel::create($l);
        }

        $departments = [
            ['name' => 'SIMRS SEHAT', 'description' => 'Sistem informasi manajemen rumah sakit utama'],
            ['name' => 'eLLIMS', 'description' => 'Sistem informasi laboratorium'],
            ['name' => 'NICU', 'description' => 'Neonatal intensive care unit'],
            ['name' => 'Kamar Bedah', 'description' => 'Instalasi bedah sentral'],
            ['name' => 'Kebidanan', 'description' => 'Unit kebidanan & kandungan'],
        ];
        foreach ($departments as $d) {
            MasterDepartment::create($d);
        }

        $jobTitles = ['Project Manager', 'Frontend Engineer', 'Backend Engineer', 'QA Engineer', 'UI/UX Designer', 'Business Analyst', 'Stakeholder'];
        foreach ($jobTitles as $name) {
            MasterJobTitle::create(['name' => $name]);
        }
    }
}
