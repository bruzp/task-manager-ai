<?php

namespace App\DataTransferObjects\Task;

use App\DataTransferObjects\Dto;
use App\Enum\PriorityEnum;
use App\Enum\StatusEnum;
use App\Http\Requests\Task\StoreRequest;
use Illuminate\Support\Carbon;

readonly class TaskCreateParamDto extends Dto
{
    public function __construct(
        public string $title,
        public ?string $description,
        public PriorityEnum $priority,
        public StatusEnum $status,
        public ?Carbon $dueDate,
        public ?string $remarks = null
    ) {}

    public static function fromRequest(StoreRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            title: $validated['title'],
            description: $validated['description'] ?? null,
            priority: PriorityEnum::from($validated['priority']),
            status: StatusEnum::from($validated['status']),
            dueDate: isset($validated['due_date']) ? Carbon::parse($validated['due_date'])->timezone(config('app.timezone')) : null,
            remarks: $validated['remarks'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => $this->status,
            'due_date' => $this->dueDate?->toIso8601String(),
            'remarks' => $this->remarks,
        ];
    }
}
