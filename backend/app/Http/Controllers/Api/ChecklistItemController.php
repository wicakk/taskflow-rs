<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChecklistItem;
use App\Models\Task;
use Illuminate\Http\Request;

class ChecklistItemController extends Controller
{
    public function store(Request $request, Task $task)
    {
        abort_unless($request->user()->hasPermission('task:edit'), 403);

        $data = $request->validate(['text' => ['required', 'string', 'max:255']]);

        $order = $task->checklistItems()->max('order') + 1;
        $item = $task->checklistItems()->create(['text' => $data['text'], 'order' => $order]);

        return response()->json($item->refresh(), 201);
    }

    public function update(Request $request, ChecklistItem $checklistItem)
    {
        $isToggleOnly = $request->has('done') && count($request->all()) === 1;
        $permission = $isToggleOnly ? 'task:move' : 'task:edit';
        abort_unless($request->user()->hasPermission($permission), 403);

        $data = $request->validate([
            'text' => ['sometimes', 'string', 'max:255'],
            'done' => ['sometimes', 'boolean'],
        ]);

        $checklistItem->update($data);

        return response()->json($checklistItem);
    }

    public function destroy(Request $request, ChecklistItem $checklistItem)
    {
        abort_unless($request->user()->hasPermission('task:edit'), 403);

        $checklistItem->delete();

        return response()->json(['message' => 'Checklist item deleted.']);
    }
}
