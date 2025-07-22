<?php

namespace App\Http\Requests\Task;

use App\Enum\PriorityEnum;
use App\Enum\StatusEnum;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['required', 'string', 'in:'.implode(',', PriorityEnum::toArray())],
            'status' => ['required', 'string', 'in:'.implode(',', StatusEnum::toArray())],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'remarks' => ['nullable', 'string'],
        ];
    }
}
