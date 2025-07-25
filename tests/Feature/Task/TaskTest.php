<?php

use App\Models\Task;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('task screen can be rendered', function () {
    Task::factory()
        ->for($this->user)
        ->count(10)
        ->create();

    $response = $this
        ->actingAs($this->user)
        ->get(route('tasks.index'));

    $response
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('tasks/index')
                ->has(
                    'tasks',
                    fn (AssertableInertia $page) => $page
                        ->has('data')
                        ->has('data.0', fn (AssertableInertia $page) => $page
                            ->has('id')
                            ->has('title')
                            ->has('priority')
                            ->has('status')
                            ->has('due_date')
                        )
                        ->has('links')
                        ->has('meta')
                        ->etc()
                )
                ->has('statusOptions')
                ->has('priorityOptions')
                ->has(
                    'filters',
                    fn (AssertableInertia $page) => $page
                        ->where('search', null)
                        ->where('sort', null)
                        ->where('direction', null)
                        ->where('perPage', 10)
                        ->where('page', 1)
                )
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
                ->has(
                    'task',
                    fn (AssertableInertia $page) => $page
                        ->where('id', $task->id)
                        ->where('title', $task->title)
                        ->where('description', $task->description)
                        ->where('priority', $task->priority)
                        ->where('status', $task->status)
                        ->where('due_date', $task->due_date->toISOString())
                        ->where('remarks', $task->remarks)
                        ->etc()
                )
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
