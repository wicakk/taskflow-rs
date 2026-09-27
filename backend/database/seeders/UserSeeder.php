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
            ['name' => 'Rizqi Ananda', 'initials' => 'RA', 'role' => 'Project Manager', 'access_role' => 'admin', 'email' => 'rizqi@taskflow.io', 'password' => 'admin123'],
            ['name' => 'Dewi Lestari', 'initials' => 'DL', 'role' => 'Frontend Engineer', 'access_role' => 'member', 'email' => 'dewi@taskflow.io', 'password' => 'member123'],
            ['name' => 'Aditya Putra', 'initials' => 'AP', 'role' => 'Backend Engineer', 'access_role' => 'member', 'email' => 'aditya@taskflow.io', 'password' => 'member123'],
            ['name' => 'Sinta Wulandari', 'initials' => 'SW', 'role' => 'QA Engineer', 'access_role' => 'member', 'email' => 'sinta@taskflow.io', 'password' => 'member123'],
            ['name' => 'Bagus Prasetyo', 'initials' => 'BP', 'role' => 'UI/UX Designer', 'access_role' => 'member', 'email' => 'bagus@taskflow.io', 'password' => 'member123'],
            ['name' => 'Nadia Fitriani', 'initials' => 'NF', 'role' => 'Business Analyst', 'access_role' => 'manager', 'email' => 'nadia@taskflow.io', 'password' => 'manager123'],
            ['name' => 'Klien RS Sehat', 'initials' => 'KR', 'role' => 'Stakeholder', 'access_role' => 'viewer', 'email' => 'klien@taskflow.io', 'password' => 'viewer123'],
        ];

        foreach ($members as $m) {
            User::create([
                ...$m,
                'password' => Hash::make($m['password']),
            ]);
        }
    }
}
