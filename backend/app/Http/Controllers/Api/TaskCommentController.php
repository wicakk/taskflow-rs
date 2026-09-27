<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskCommentResource;
use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    // Anyone who can see the task can comment on it (same rule as project chat) —
    // there's no separate "task:comment" permission in the matrix.
    public function store(Request $request, Task $task)
    {
        $data = $request->validate(['text' => ['required', 'string', 'max:2000']]);

        $comment = $task->comments()->create([
            'author_id' => $request->user()->id,
            'text' => $data['text'],
        ]);

        return new TaskCommentResource($comment);
    }

    public function destroy(Request $request, TaskComment $taskComment)
    {
        abort_unless(
            $taskComment->author_id === $request->user()->id || $request->user()->access_role === 'admin',
            403
        );

        $taskComment->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }
}
