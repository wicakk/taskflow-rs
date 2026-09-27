<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// active_tasks/completed_tasks/workload used to be static numbers on the user
// row (seeded once, never updated as tasks changed). They're now computed
// live from the real tasks table on the frontend (see src/utils/memberStats.js),
// so the static columns are no longer read anywhere and are removed here.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['active_tasks', 'completed_tasks', 'workload']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('active_tasks')->default(0);
            $table->unsignedInteger('completed_tasks')->default(0);
            $table->unsignedTinyInteger('workload')->default(0);
        });
    }
};
