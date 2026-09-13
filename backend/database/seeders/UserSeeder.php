<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            ['name' => 'Rizqi Ananda', 'initials' => 'RA', 'role' => 'Project Manager', 'access_role' => 'admin', 'email' => 'rizqi@taskflow.io', 'password' => 'admin123', 'online' => true, 'active_tasks' => 8, 'completed_tasks' => 24, 'workload' => 72],
            ['name' => 'Dewi Lestari', 'initials' => 'DL', 'role' => 'Frontend Engineer', 'access_role' => 'member', 'email' => 'dewi@taskflow.io', 'password' => 'member123', 'online' => true, 'active_tasks' => 6, 'completed_tasks' => 31, 'workload' => 58],
            ['name' => 'Aditya Putra', 'initials' => 'AP', 'role' => 'Backend Engineer', 'access_role' => 'member', 'email' => 'aditya@taskflow.io', 'password' => 'member123', 'online' => false, 'active_tasks' => 5, 'completed_tasks' => 19, 'workload' => 64],
            ['name' => 'Sinta Wulandari', 'initials' => 'SW', 'role' => 'QA Engineer', 'access_role' => 'member', 'email' => 'sinta@taskflow.io', 'password' => 'member123', 'online' => true, 'active_tasks' => 4, 'completed_tasks' => 27, 'workload' => 45],
            ['name' => 'Bagus Prasetyo', 'initials' => 'BP', 'role' => 'UI/UX Designer', 'access_role' => 'member', 'email' => 'bagus@taskflow.io', 'password' => 'member123', 'online' => false, 'active_tasks' => 3, 'completed_tasks' => 15, 'workload' => 38],
            ['name' => 'Nadia Fitriani', 'initials' => 'NF', 'role' => 'Business Analyst', 'access_role' => 'manager', 'email' => 'nadia@taskflow.io', 'password' => 'manager123', 'online' => true, 'active_tasks' => 5, 'completed_tasks' => 22, 'workload' => 51],
            ['name' => 'Klien RS Sehat', 'initials' => 'KR', 'role' => 'Stakeholder', 'access_role' => 'viewer', 'email' => 'klien@taskflow.io', 'password' => 'viewer123', 'online' => false, 'active_tasks' => 0, 'completed_tasks' => 0, 'workload' => 0],
        ];

        foreach ($members as $m) {
            User::create([
                ...$m,
                'password' => Hash::make($m['password']),
            ]);
        }
    }
}
