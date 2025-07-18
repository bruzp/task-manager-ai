<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();
        Task::truncate();

        User::factory()
            ->has(Task::factory()->count(200))
            ->create([
                'name' => 'bruce',
                'email' => 'bruce@test.com',
            ]);
    }
}
