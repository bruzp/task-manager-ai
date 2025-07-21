<?php

namespace App\Http\Controllers;

use App\DataTransferObjects\Task\TaskCreateParamDto;
use App\DataTransferObjects\Task\TaskSearchParamDto;
use App\Enum\PriorityEnum;
use App\Enum\StatusEnum;
use App\Http\Requests\Task\SearchRequest;
use App\Http\Requests\Task\StoreRequest;
use App\Http\Resources\Task\TaskResourceCollection;
use App\Services\TaskService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function __construct(private readonly TaskService $taskService) {}

    public function index(SearchRequest $request): Response
    {
        $authUser = $request->user();
        $params = TaskSearchParamDto::fromRequest($request);
        $tasks = $this->taskService->searchTasks($authUser, $params);

        return Inertia::render('tasks/index', [
            'tasks' => new TaskResourceCollection($tasks),
            'statusOptions' => StatusEnum::toArray(),
            'priorityOptions' => PriorityEnum::toArray(),
            'filters' => $params->toArray(),
        ]);
    }

    public function store(StoreRequest $request): RedirectResponse
    {
        // dd($request->all()); // Debugging line, remove in production
        $authUser = $request->user();
        $params = TaskCreateParamDto::fromRequest($request);

        $this->taskService->storeTask($authUser, $params);

        return back();
    }

    public function destroy(int $id): RedirectResponse
    {
        // dd($id); // Debugging line, remove in production
        $authUser = auth()->user();
        $this->taskService->deleteTask($authUser, $id);

        return back();
    }
}
