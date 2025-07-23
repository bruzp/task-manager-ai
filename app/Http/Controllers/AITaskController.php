<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        $tasks = $this->taskService->getRelevantTasks($request->user());
        $data = $this->encodeData($tasks->toArray());
        $prompt = $this->generatePrompt($request->input('message'), $data, $this->aiResponseRules());
        $response = $this->sendPrompt($prompt);

        info('AI Task Response', [
            'user_id' => $request->user()->id,
            'response' => $response,
        ]);

        return response()->json([
            'reply' => $response,
        ]);
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
            ->using(Provider::Ollama, 'gemma3:1b')
            ->withPrompt($prompt)
            ->withClientOptions(['timeout' => 300])
            ->asText()
            ->text;
    }

    private function aiResponseRules(): string
    {
        return <<<'EOT'
            Response rules (in bullet points):

            - Stay focused on the user's query and the provided data only.
            - Generate responses strictly based on the data given.
            - Keep replies concise, relevant, and easy to read.
            - If data is missing or incomplete, inform the user politely.
            - Do not add outside context or extra information.
            - Use clear markdown formatting (no code blocks or technical jargon).
            - Maintain a friendly and helpful tone.

            Respond according to the query type:
            - **Specific task** → Provide key details.
            - **Summary** → Give a concise overview of tasks.
            - **List** → Return bullet-pointed list of relevant tasks.
            - **Status update** → Report current task statuses.
            - **Priority update** → Report task priority levels.
            - **Date-based** → Show tasks related to the given date.
            - **No match** → Let the user know no relevant tasks were found.
            EOT;
    }
}
