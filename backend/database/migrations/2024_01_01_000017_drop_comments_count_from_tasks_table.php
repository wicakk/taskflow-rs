<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// The task comment count is now derived live from the task_comments table
// (see TaskResource / TaskController::index withCount('comments')) instead
// of a static counter that had to be kept in sync by hand.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('comments_count');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->unsignedInteger('comments_count')->default(0);
        });
    }
};
