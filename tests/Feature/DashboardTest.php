<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

// TODO: Examine the response properties and structure
// This will help ensure that the Inertia response contains the expected data structure and properties.

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/dashboard')
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('dashboard')
                ->has('pendingTasks')
                ->has('inProgressTasks')
                ->has('completedTasks')
        );
});
