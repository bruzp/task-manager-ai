<?php

namespace Database\Factories;

use App\Enum\PriorityEnum;
use App\Enum\StatusEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

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

        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'priority' => $priorities->random(),
            'status' => $statuses->random(),
        ];
    }
}
