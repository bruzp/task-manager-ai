<?php

namespace App\Repositories;

use App\DataTransferObjects\Task\TaskCreateParamDto;
use App\DataTransferObjects\Task\TaskSearchParamDto;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskRepository
{
    public function getTasks(User $authUser, TaskSearchParamDto $params): LengthAwarePaginator
    {
        $query = Task::query()->belongsToUser($authUser->id);

        $this->selectQuery($query);
        $this->sortQuery($query, $params);
        $this->searchQuery($query, $params);

        return $query->paginate($params->perPage);
    }

    public function getTaskById(User $authUser, int $id): Task
    {
        return Task::where('id', $id)
            ->where('user_id', $authUser->id)
            ->firstOrFail();
    }

    public function store(User $authUser, TaskCreateParamDto $params): Task
    {
        return Task::create([...$params->toArray(), 'user_id' => $authUser->id]);
    }

    public function update(User $authUser, int $id, TaskCreateParamDto $params): Task
    {
        $task = Task::where('id', $id)
            ->where('user_id', $authUser->id)
            ->firstOrFail();

        $task->update($params->toArray());

        return $task;
    }

    public function delete(User $authUser, int $id): void
    {
        $task = Task::where('id', $id)
            ->where('user_id', $authUser->id)
            ->firstOrFail();
        $task->delete();
    }

    // TODO: Update to get more relevant tasks.
    /**
     * Get tasks relevant to the user, such as pending or in-progress tasks created in the last 3 months.
     */
    public function getRelevantTasks(User $authUser): Collection
    {
        return Task::select([
            'id',
            'title',
            'priority',
            'status',
            'due_date',
            'remarks',
        ])
            ->where('user_id', $authUser->id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('created_at', '>=', now()->subMonths(3))
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();
    }

    private function selectQuery(Builder $query): void
    {
        $query->select([
            'id',
            'title',
            'priority',
            'status',
            'due_date',
        ]);
    }

    private function sortQuery(Builder $query, TaskSearchParamDto $params): void
    {
        if ($params->sort && $params->direction) {
            $query->orderBy($params->sort, $params->direction);
        } else {
            $query->orderBy('due_date');
        }
    }

    private function searchQuery(Builder $query, TaskSearchParamDto $params): void
    {
        if ($params->search) {
            $query->where('title', 'like', '%'.$params->search.'%')
                ->orWhere('description', 'like', '%'.$params->search.'%');
        }
    }
}
