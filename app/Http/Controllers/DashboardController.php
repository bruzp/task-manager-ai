<?php

namespace App\Http\Controllers;

use App\Enum\StatusEnum;
use App\Http\Resources\Dashboard\TaskResource;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Inertia\Inertia;

// TODO: add github worflows

class DashboardController extends Controller
{
    private const NUMBER_OF_TASKS = 10;

    public function __construct(private readonly TaskService $taskService) {}

    public function index(Request $request)
    {
        $pendingTasks = $this->taskService->getHighPriorityTasks($request->user(), self::NUMBER_OF_TASKS, StatusEnum::PENDING);
        $inProgressTasks = $this->taskService->getHighPriorityTasks($request->user(), self::NUMBER_OF_TASKS, StatusEnum::IN_PROGRESS);
        $completedTasks = $this->taskService->getHighPriorityTasks($request->user(), self::NUMBER_OF_TASKS, StatusEnum::COMPLETED);

        return Inertia::render('dashboard', [
            'pendingTasks' => new TaskResource($pendingTasks),
            'inProgressTasks' => new TaskResource($inProgressTasks),
            'completedTasks' => new TaskResource($completedTasks),
        ]);
    }
}
