<?php

namespace App\Services;

use App\DataTransferObjects\Task\TaskCreateParamDto;
use App\DataTransferObjects\Task\TaskSearchParamDto;
use App\Models\User;
use App\Repositories\TaskRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskService
{
    public function __construct(private readonly TaskRepository $taskRepository) {}

    public function searchTasks(User $authUser, TaskSearchParamDto $params): LengthAwarePaginator
    {
        return $this->taskRepository->getTasks($authUser, $params);
    }

    public function storeTask(User $authUser, TaskCreateParamDto $params): void
    {
        $this->taskRepository->store($authUser, $params);
    }

    public function updateTask(User $authUser, int $id, TaskCreateParamDto $params): void
    {
        $this->taskRepository->update($authUser, $id, $params);
    }

    public function deleteTask(User $authUser, int $id): void
    {
        $this->taskRepository->delete($authUser, $id);
    }
}
