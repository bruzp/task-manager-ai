<?php

namespace App\Http\Controllers;

use App\Enum\StatusEnum;
use App\Http\Resources\Dashboard\TaskResource;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private readonly TaskService $taskService) {}

    public function index(Request $request)
    {
        $pendingTasks = $this->taskService->getHighPriorityTasks($request->user(), 5, StatusEnum::PENDING);
        $inProgressTasks = $this->taskService->getHighPriorityTasks($request->user(), 5, StatusEnum::IN_PROGRESS);
        $completedTasks = $this->taskService->getHighPriorityTasks($request->user(), 5, StatusEnum::COMPLETED);

        return Inertia::render('dashboard', [
            'pendingTasks' => new TaskResource($pendingTasks),
            'inProgressTasks' => new TaskResource($inProgressTasks),
            'completedTasks' => new TaskResource($completedTasks),
        ]);
    }
}
