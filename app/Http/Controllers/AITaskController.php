<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\Request;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

class AITaskController extends Controller
{
    public function __construct(private readonly TaskService $taskService) {}

    public function __invoke(Request $request)
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
            Response in bullet points:
            - Do not mention the data source.
            - Focus on the user's query and the provided data.
            - Use the data provided to generate a response.
            - Ensure the response is concise and relevant to the user's query.
            - If the data is insufficient, politely inform the user.
            - Do not include any additional information or context outside of the provided data.
            - Format the response in a way that is easy to read and understand.
            - Use markdown formatting for better readability.
            - Do not include any code blocks or technical jargon.
            - Focus on providing actionable insights or summaries based on the tasks data.
            - Ensure the response is in a friendly and helpful tone.
            - If the user asks for a specific task, provide details about that task.
            - If the user asks for a summary, provide a concise overview of the tasks.
            - If the user asks for a list, provide a bullet-point list of relevant tasks.
            - If the user asks for a status update, provide the current status of relevant tasks.
            - If the user asks for a priority update, provide the priority levels of relevant tasks.
            - If the user asks for a specific date, provide tasks related to that date.
            EOT;
    }
}
