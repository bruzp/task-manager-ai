<?php

namespace App\Services\AI;

use App\Enum\PriorityEnum;
use App\Enum\StatusEnum;
use App\Models\User;
use App\Services\TaskService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TaskAssistantService
{
    public function __construct(private readonly TaskService $taskService) {}

    public function generate(User $user, string $message): string
    {
        $host = config('services.ollama.host');
        $model = config('services.ollama.model');

        if (! $host || ! $model) {
            throw new \RuntimeException('Ollama host or model not configured');
        }

        $filters = $this->extractFiltersFromMessage($message);
        $tasks = $this->taskService->getRelevantTasks($user, $filters);
        $data = $this->encodeData($tasks->toArray());
        $prompt = $this->generatePrompt($message, $data, $this->responseRules());

        Log::channel('ai_prompts')->info('Filters extracted', [
            'filters' => $filters,
        ]);

        Log::channel('ai_prompts')->info('AI Prompt', [
            'user_id' => $user->id,
            'prompt' => $prompt,
        ]);

        $response = $this->sendPrompt($host, $model, $prompt);

        Log::channel('ai_prompts')->info('AI Task Response', [
            'user_id' => $user->id,
            'response' => $response,
        ]);

        return $response;
    }

    private function extractFiltersFromMessage(string $message): array
    {
        $lowerMessage = strtolower($message);

        $statusKeywords = [
            'completed' => StatusEnum::COMPLETED,
            'done' => StatusEnum::COMPLETED,
            'in progress' => StatusEnum::IN_PROGRESS,
            'pending' => StatusEnum::PENDING,
        ];

        $status = null;
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

    private function sendPrompt(string $host, string $model, string $prompt): string
    {
        $response = Http::timeout(300)
            ->post("{$host}/api/generate", [
                'model' => $model,
                'prompt' => $prompt,
                'stream' => false,
            ]);

        if (! $response->ok()) {
            Log::warning('Ollama API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException('Ollama unavailable: HTTP '.$response->status());
        }

        $text = $response->json('response', '');

        if (empty($text)) {
            Log::warning('Ollama empty response', ['body' => $response->body()]);
            throw new \RuntimeException('Ollama returned an empty response');
        }

        return $text;
    }

    private function responseRules(): string
    {
        return <<<'EOT'
            Response rules:

            - Stay focused on the user's query and the provided data only.
            - Keep replies concise, relevant, and easy to read.
            - If data is missing or incomplete, inform the user politely.
            - Use clear markdown formatting (e.g., use bullet points for lists).
            - Do not include JSON or code blocks in the response.
            - Give 10 tasks at most in the response, ordered by priority and due date.
            - Format dates in human-readable format (e.g., "2025-08-03T08:47:17.000000Z" to "August 3, 2025 at 8:47 AM").
            EOT;
    }
}
