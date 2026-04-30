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
        Schema::create('project_incomes', function (Blueprint $table) {
            $table->id();
             $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('source')->nullable(); // sumber pendapatan (misal "Termin 1", "Client A")
            $table->decimal('amount', 15, 2);
            $table->date('received_date')->nullable();
            $table->text('note')->nullable();
            $table->foreignId('recorded_by')->constrained('users')->cascadeOnDelete(); // siapa yang input
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_incomes');
    }
};
