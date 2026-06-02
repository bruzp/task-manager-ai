<?php

namespace App\Http\Controllers;

use App\Services\AI\TaskAssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AITaskController extends Controller
{
    public function __construct(private readonly TaskAssistantService $taskAssistantService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'message' => ['required', 'string'],
        ]);

        $response = $this->taskAssistantService->generate(
            $request->user(),
            $request->input('message')
        );

        return response()->json(['reply' => $response]);
    }
}
