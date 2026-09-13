<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            MasterDataSeeder::class,
            UserSeeder::class,
            ProjectSeeder::class, // writes storage/app/seed-project-map.json for TaskSeeder/ChatSeeder
            TaskSeeder::class,
            ChatSeeder::class,
            AnnouncementSeeder::class,
        ]);
    }
}
