<?php

use App\Enum\StatusEnum;
use App\Models\Task;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();

    Task::factory()
        ->for($user)
        ->count(5)
        ->create([
            'status' => StatusEnum::PENDING,
        ]);
    Task::factory()
        ->for($user)
        ->count(5)
        ->create([
            'status' => StatusEnum::IN_PROGRESS,
        ]);
    Task::factory()
        ->for($user)
        ->count(5)
        ->create([
            'status' => StatusEnum::COMPLETED,
        ]);

    $this->actingAs($user);

    $this->get('/dashboard')
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('dashboard')
                ->has(
                    'pendingTasks',
                    fn (AssertableInertia $page) => $page
                        ->has(
                            '0',
                            fn (AssertableInertia $page) => $page
                                ->has('id')
                                ->has('title')
                                ->has('priority')
                                ->has('status')
                                ->has('due_date')
                        )
                        ->etc()
                )
                ->has('inProgressTasks', fn (AssertableInertia $page) => $page
                    ->has(
                        '0',
                        fn (AssertableInertia $page) => $page
                            ->has('id')
                            ->has('title')
                            ->has('priority')
                            ->has('status')
                            ->has('due_date')
                    )
                    ->etc())
                ->has('completedTasks', fn (AssertableInertia $page) => $page
                    ->has(
                        '0',
                        fn (AssertableInertia $page) => $page
                            ->has('id')
                            ->has('title')
                            ->has('priority')
                            ->has('status')
                            ->has('due_date')
                    )
                    ->etc())
        );
});
