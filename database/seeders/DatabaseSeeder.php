<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'ridhwananang@gmail.com'],
            [
                'name' => 'Ridhwan Anang Maruf',
                'password' => Hash::make('Veena123!'),
                'role' => 'system_architect_and_technical_lead',
                'email_verified_at' => now(),
            ]
        );
    }
}
