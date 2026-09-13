<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_label_task', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('master_label_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['task_id', 'master_label_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_label_task');
    }
};
