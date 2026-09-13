<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChatMessageResource;
use App\Models\ChatMessage;
use App\Models\Project;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Project $project)
    {
        return ChatMessageResource::collection($project->chatMessages);
    }

    public function store(Request $request, Project $project)
    {
        $data = $request->validate(['text' => ['required', 'string']]);

        $message = $project->chatMessages()->create([
            'author_id' => $request->user()->id,
            'text' => $data['text'],
        ]);

        return new ChatMessageResource($message);
    }

    public function destroy(Request $request, ChatMessage $chatMessage)
    {
        abort_unless(
            $chatMessage->author_id === $request->user()->id || $request->user()->access_role === 'admin',
            403
        );

        $chatMessage->delete();

        return response()->json(['message' => 'Message deleted.']);
    }
}
