<?php

namespace App\Repositories;

use App\DataTransferObjects\Task\TaskCreateParamDto;
use App\DataTransferObjects\Task\TaskSearchParamDto;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
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

    public function store(User $authUser, TaskCreateParamDto $params): Task
    {
        return Task::create([...$params->toArray(), 'user_id' => $authUser->id]);
    }

    private function selectQuery(Builder $query): void
    {
        $query->select([
            'id',
            'title',
            'priority',
            'status',
            'created_at',
            'updated_at',
        ]);
    }

    private function sortQuery(Builder $query, TaskSearchParamDto $params): void
    {
        if ($params->sort && $params->direction) {
            $query->orderBy($params->sort, $params->direction);
        } else {
            $query->orderByDesc('updated_at');
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
