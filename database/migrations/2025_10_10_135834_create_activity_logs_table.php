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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
             $table->morphs('subject'); 
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); 
            $table->enum('action', ['created', 'updated', 'deleted'])->index();

            $table->text('description'); 
            $table->json('changes')->nullable(); 

            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();

            $table->index('created_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
