<?php

namespace Database\Seeders;

use App\Models\MasterLabel;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $projectMap = json_decode(file_get_contents(storage_path('app/seed-project-map.json')), true);
        $userId = fn (string $name) => User::where('name', $name)->value('id');

        $tasks = [
            ['project' => 'p2', 'title' => 'Analisis kebutuhan modul NICU', 'status' => 'done', 'priority' => 'High', 'assignee' => 'Rizqi Ananda', 'labels' => ['Analysis'], 'due' => '2026-09-01', 'comments' => 3, 'attachments' => 2, 'description' => 'Menggali kebutuhan fungsional dari unit NICU untuk modul pemantauan neonatal.', 'checklist' => [['Wawancara unit NICU', true], ['Dokumentasi kebutuhan', true]]],
            ['project' => 'p2', 'title' => 'Mapping form assessment dokter', 'status' => 'done', 'priority' => 'Medium', 'assignee' => 'Nadia Fitriani', 'labels' => ['Design'], 'due' => '2026-09-03', 'comments' => 1, 'attachments' => 1, 'description' => 'Memetakan form assessment dokter ke struktur data digital.', 'checklist' => [['Review form eksisting', true]]],
            ['project' => 'p2', 'title' => 'Implementasi Modul NICU', 'status' => 'inprogress', 'priority' => 'High', 'assignee' => 'Rizqi Ananda', 'labels' => ['Frontend', 'Backend'], 'due' => '2026-09-18', 'comments' => 5, 'attachments' => 4, 'description' => 'Membangun modul NICU end-to-end mencakup frontend dan backend, termasuk integrasi data vital pasien.', 'checklist' => [['Analisis kebutuhan', true], ['Mapping form', true], ['Implementasi frontend', false], ['Implementasi backend', false], ['Testing', false], ['UAT', false]]],
            ['project' => 'p2', 'title' => 'Implementasi API pasien', 'status' => 'inprogress', 'priority' => 'High', 'assignee' => 'Aditya Putra', 'labels' => ['Backend'], 'due' => '2026-09-14', 'comments' => 2, 'attachments' => 0, 'description' => 'Membangun REST API untuk data pasien NICU.', 'checklist' => [['Desain endpoint', true], ['Implementasi', false]]],
            ['project' => 'p1', 'title' => 'Testing modul rawat inap', 'status' => 'review', 'priority' => 'Medium', 'assignee' => 'Sinta Wulandari', 'labels' => ['QA'], 'due' => '2026-09-10', 'comments' => 4, 'attachments' => 1, 'description' => 'Pengujian fungsional modul rawat inap sebelum rilis.', 'checklist' => [['Buat test case', true], ['Eksekusi test', true]]],
            ['project' => 'p1', 'title' => 'Dokumentasi business process', 'status' => 'todo', 'priority' => 'Low', 'assignee' => 'Nadia Fitriani', 'labels' => ['Docs'], 'due' => '2026-09-25', 'comments' => 0, 'attachments' => 0, 'description' => 'Menyusun dokumentasi alur proses bisnis SIMRS.', 'checklist' => []],
            ['project' => 'p3', 'title' => 'Demo SIMRS ke unit', 'status' => 'todo', 'priority' => 'Medium', 'assignee' => 'Rizqi Ananda', 'labels' => ['Meeting'], 'due' => '2026-09-20', 'comments' => 1, 'attachments' => 0, 'description' => 'Presentasi demo aplikasi ke unit kamar bedah.', 'checklist' => []],
            ['project' => 'p5', 'title' => 'Perbaikan hasil UAT', 'status' => 'review', 'priority' => 'High', 'assignee' => 'Aditya Putra', 'labels' => ['Bugfix'], 'due' => '2026-09-12', 'comments' => 6, 'attachments' => 3, 'description' => 'Menindaklanjuti temuan hasil User Acceptance Test.', 'checklist' => [['Kumpulkan temuan UAT', true], ['Perbaikan', false]]],
            ['project' => 'p5', 'title' => 'Deployment production', 'status' => 'done', 'priority' => 'High', 'assignee' => 'Rizqi Ananda', 'labels' => ['DevOps'], 'due' => '2026-09-05', 'comments' => 2, 'attachments' => 0, 'description' => 'Rilis modul integrasi laboratorium ke lingkungan produksi.', 'checklist' => [['Backup database', true], ['Deploy', true]]],
            ['project' => 'p4', 'title' => 'Wireframe modul kebidanan', 'status' => 'todo', 'priority' => 'Medium', 'assignee' => 'Bagus Prasetyo', 'labels' => ['Design'], 'due' => '2026-09-22', 'comments' => 0, 'attachments' => 1, 'description' => 'Membuat wireframe alur pencatatan persalinan.', 'checklist' => []],
            ['project' => 'p1', 'title' => 'Review keamanan API', 'status' => 'inprogress', 'priority' => 'High', 'assignee' => 'Aditya Putra', 'labels' => ['Security'], 'due' => '2026-09-16', 'comments' => 1, 'attachments' => 0, 'description' => 'Audit keamanan pada seluruh endpoint API SIMRS.', 'checklist' => [['Audit endpoint', false]]],
            ['project' => 'p6', 'title' => 'Sinkronisasi data eLLIMS', 'status' => 'done', 'priority' => 'Medium', 'assignee' => 'Dewi Lestari', 'labels' => ['Integration'], 'due' => '2026-07-28', 'comments' => 3, 'attachments' => 2, 'description' => 'Menyelaraskan struktur data antara SIMRS dan eLLIMS.', 'checklist' => [['Mapping field', true], ['Testing sync', true]]],
        ];

        foreach ($tasks as $t) {
            $task = Task::create([
                'project_id' => $projectMap[$t['project']],
                'title' => $t['title'],
                'description' => $t['description'],
                'status' => $t['status'],
                'priority' => $t['priority'],
                'assignee_id' => $userId($t['assignee']),
                'due_date' => $t['due'],
                'comments_count' => $t['comments'],
                'attachments_count' => $t['attachments'],
            ]);

            $labelIds = collect($t['labels'])->map(fn ($name) => MasterLabel::where('name', $name)->value('id'))->filter()->all();
            $task->labels()->sync($labelIds);

            foreach ($t['checklist'] as $order => [$text, $done]) {
                $task->checklistItems()->create(['text' => $text, 'done' => $done, 'order' => $order]);
            }
        }
    }
}
