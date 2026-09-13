<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_task_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // stable identifier stored on tasks.status, immutable once created
            $table->string('name');
            $table->string('color', 7);
            $table->unsignedSmallInteger('order')->default(0); // drives Kanban column order
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_task_statuses');
    }
};
