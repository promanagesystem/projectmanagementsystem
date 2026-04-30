<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('report_tasks', function (Blueprint $table) {
            $table->id();
             $table->foreignId('report_sprint_id')->constrained('report_sprints')->cascadeOnDelete();
    $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('status');
    $table->tinyInteger('progress_percentage')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_tasks');
    }
};
