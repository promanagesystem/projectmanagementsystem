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
        Schema::create('finance_attachments', function (Blueprint $table) {
            $table->id();
            // income khusus proyek
    $table->foreignId('project_income_id')
        ->nullable()
        ->constrained('project_incomes')
        ->cascadeOnDelete();

    // expense khusus proyek
    $table->foreignId('project_expense_id')
        ->nullable()
        ->constrained('project_expenses')
        ->cascadeOnDelete();

    // expense umum (operasional)
    $table->foreignId('general_expense_id')
        ->nullable()
        ->constrained('general_expenses')
        ->cascadeOnDelete();

    // file
    $table->string('file_path')->nullable();
    $table->string('file_name')->nullable();
    $table->string('file_type')->nullable();
    
    $table->text('description')->nullable();

    $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finance_attachments');
    }
};
