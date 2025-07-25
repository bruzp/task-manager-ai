<?php

namespace App\Http\Controllers;

use App\DataTransferObjects\Task\TaskCreateParamDto;
use App\DataTransferObjects\Task\TaskSearchParamDto;
use App\Enum\PriorityEnum;
use App\Enum\StatusEnum;
use App\Http\Requests\Task\SearchRequest;
use App\Http\Requests\Task\StoreRequest;
use App\Http\Resources\Task\TaskResource;
use App\Http\Resources\Task\TaskResourceCollection;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
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

    public function show(int $id): Response
    {
        $authUser = auth()->user();
        $task = $this->taskService->getTaskById($authUser, $id);

        return Inertia::render('tasks/show', [
            'task' => new TaskResource($task),
        ]);
    }

    public function showData(int $id): JsonResponse
    {
        $authUser = auth()->user();
        $task = $this->taskService->getTaskById($authUser, $id);

        return response()->json([
            'task' => new TaskResource($task),
        ]);
    }

    public function store(StoreRequest $request): RedirectResponse
    {
        $authUser = $request->user();
        $params = TaskCreateParamDto::fromRequest($request);

        $this->taskService->storeTask($authUser, $params);

        return back();
    }

    public function update(StoreRequest $request, int $id): RedirectResponse
    {
        $authUser = $request->user();
        $params = TaskCreateParamDto::fromRequest($request);

        $this->taskService->updateTask($authUser, $id, $params);

        return back();
    }

    public function destroy(SearchRequest $request, int $id): RedirectResponse
    {
        $params = TaskSearchParamDto::fromRequest($request);

        $authUser = auth()->user();
        $this->taskService->deleteTask($authUser, $id);

        return redirect()
            ->route('tasks.index', $params->toArray());
    }
}
