<?php

namespace Database\Factories;

use App\Enum\PriorityEnum;
use App\Enum\StatusEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $priorities = collect([
            PriorityEnum::LOW,
            PriorityEnum::MEDIUM,
            PriorityEnum::HIGH,
        ]);

        $statuses = collect([
            StatusEnum::PENDING,
            StatusEnum::IN_PROGRESS,
            StatusEnum::COMPLETED,
        ]);

        $createdAt = fake()->dateTimeBetween('-1 year', 'now');

        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'priority' => $priorities->random(),
            'status' => $statuses->random(),
            'due_date' => Carbon::parse($createdAt)->addDays(rand(1, 30)), // Random due date within 30 days of created_at
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $createdAt,
        ];
    }
}
