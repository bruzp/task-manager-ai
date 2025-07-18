<?php

namespace App\DataTransferObjects\Task;

use App\DataTransferObjects\Dto;
use App\Http\Requests\Task\SearchRequest;

readonly class TaskSearchParamDto extends Dto
{
    public function __construct(
        public ?string $search = null,
        public ?string $sort = null,
        public ?string $direction = null,
        public ?int $perPage = null,
        public ?int $page = null
    ) {}

    public static function fromRequest(SearchRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            search: $validated['search'] ?? null,
            sort: $validated['sort'] ?? null,
            direction: $validated['direction'] ?? null,
            perPage: $validated['perPage'] ?? 10,
            page: $validated['page'] ?? 1
        );
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'sort' => $this->sort,
            'direction' => $this->direction,
            'perPage' => $this->perPage,
            'page' => $this->page,
        ];
    }
}
