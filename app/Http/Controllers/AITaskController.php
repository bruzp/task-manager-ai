<?php

namespace App\Http\Controllers;

use App\Enum\PriorityEnum;
use App\Enum\StatusEnum;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

class AITaskController extends Controller
{
    public function __construct(private readonly TaskService $taskService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'message' => ['required', 'string'],
        ]);

        $filters = $this->extractFiltersFromMessage($request->input('message'));
        $tasks = $this->taskService->getRelevantTasks($request->user(), $filters);
        $data = $this->encodeData($tasks->toArray());
        $prompt = $this->generatePrompt($request->input('message'), $data, $this->aiResponseRules());
        $response = $this->sendPrompt($prompt);

        Log::channel('ai_prompts')->info('Filters extracted', [
            'filters' => $filters,
        ]);

        Log::channel('ai_prompts')->info('AI Prompt', [
            'user_id' => $request->user()->id,
            'prompt' => $prompt,
        ]);

        Log::channel('ai_prompts')->info('AI Task Response', [
            'user_id' => $request->user()->id,
            'response' => $response,
        ]);

        return response()->json([
            'reply' => $response,
        ]);
    }

    private function extractFiltersFromMessage(string $message): array
    {
        $statusKeywords = [
            'completed' => StatusEnum::COMPLETED,
            'done' => StatusEnum::COMPLETED,
            'in progress' => StatusEnum::IN_PROGRESS,
            'pending' => StatusEnum::PENDING,
        ];

        $status = null;
        $lowerMessage = strtolower($message);

        foreach ($statusKeywords as $keyword => $mappedStatus) {
            if (str_contains($lowerMessage, $keyword)) {
                $status = $mappedStatus;
                break;
            }
        }

        $priorityKeywords = [
            'high' => PriorityEnum::HIGH,
            'highest' => PriorityEnum::HIGH,
            'medium' => PriorityEnum::MEDIUM,
            'fair' => PriorityEnum::MEDIUM,
            'low' => PriorityEnum::LOW,
            'least' => PriorityEnum::LOW,
        ];

        $priority = null;
        $lowerMessage = strtolower($message);

        foreach ($priorityKeywords as $keyword => $mappedPriority) {
            if (str_contains($lowerMessage, $keyword)) {
                $priority = $mappedPriority;
                break;
            }
        }

        return [
            'status' => $status,
            'priority' => $priority,
        ];
    }

    private function encodeData(array $data): string
    {
        return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    private function generatePrompt(string $message, string $data, string $responseRules): string
    {
        return <<<EOT
            {$message}

            Here are the tasks data:
            Note: The following data is JSON encoded. Decode and decompress it before continuing:
            {$data}

            {$responseRules}
            EOT;
    }

    private function sendPrompt(string $prompt): string
    {
        return Prism::text()
            ->using(Provider::Ollama, config('prism.providers.ollama.model'))
            ->withPrompt($prompt)
            ->withClientOptions(['timeout' => 300])
            ->asText()
            ->text;
    }

    private function aiResponseRules(): string
    {
        return <<<'EOT'
            Response rules:

            - Stay focused on the user's query and the provided data only.
            - Keep replies concise, relevant, and easy to read.
            - If data is missing or incomplete, inform the user politely.
            - Use clear markdown formatting. (e.g., use bullet points for lists).
            - Do not include json or code blocks in the response.
            - Give 10 tasks at most in the response, ordered by priority and due date.
            - Format dates in human-readable format (e.g., "2025-08-03T08:47:17.000000Z" to "August 3, 2025 at 8:47 AM").
            EOT;
    }
}
