<?php

use App\Models\Task;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

beforeEach(function () {
    $this->user = User::factory()->create();
});

// TODO: Examine the response propties and structure
// This will help ensure that the Inertia response contains the expected data structure and properties.

// TODO: Check why task created  here is in UTC not Asia/Manila timezone.
// Maybe add .env.test and set timezone to Asia/Manila.

test('task screen can be rendered', function () {
    $response = $this
        ->actingAs($this->user)
        ->get(route('tasks.index'));

    $response
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('tasks/index')
                ->has('tasks')
                ->has('statusOptions')
                ->has('priorityOptions')
                ->has('filters')
        )
        ->assertOk();
});

test('task detail screen can be rendered', function () {
    $task = Task::factory()
        ->for($this->user)
        ->create();

    $response = $this
        ->actingAs($this->user)
        ->get(route('tasks.show', $task));

    $response
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('tasks/show')
                ->has('task')
        )
        ->assertOk();
});

test('task data can be retreived', function () {
    $task = Task::factory()
        ->for($this->user)
        ->create();

    $response = $this
        ->actingAs($this->user)
        ->get(route('tasks.show.data', $task));

    $response->assertJson([
        'task' => $task->toArray(),
    ]);
});

test('new tasks can be created', function () {
    $data = [
        'title' => fake()->sentence.now()->timestamp,
        'description' => fake()->sentence,
        'priority' => 'high',
        'status' => 'pending',
        'due_date' => now()->addDays(3)->toDateTimeString(),
        'remarks' => fake()->sentence,
    ];

    $response = $this
        ->actingAs($this->user)
        ->post(route('tasks.store'), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('tasks', $data);
});

test('tasks can be updated', function () {
    $task = Task::factory()
        ->for($this->user)
        ->create();

    $data = [
        'title' => fake()->sentence.now()->timestamp,
        'description' => fake()->sentence,
        'priority' => 'high',
        'status' => 'pending',
        'due_date' => now()->addDays(3)->toDateTimeString(),
        'remarks' => fake()->sentence,
    ];

    $response = $this
        ->actingAs($this->user)
        ->put(route('tasks.update', $task), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('tasks', $data);
});

test('task can be deleted', function () {
    $task = Task::factory()
        ->for($this->user)
        ->create();

    $filters = [
        'perPage' => 10,
        'page' => 1,
    ];

    $response = $this
        ->actingAs($this->user)
        ->delete(route('tasks.destroy', $task), $filters);

    $response->assertRedirect(route('tasks.index', $filters));
    $this->assertSoftDeleted('tasks', [
        'id' => $task->id,
    ]);
});
