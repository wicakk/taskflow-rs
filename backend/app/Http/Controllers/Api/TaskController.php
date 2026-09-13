<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\MasterLabel;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['labels', 'checklistItems']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->input('project_id'));
        }
        if ($request->filled('assignee_id')) {
            $query->where('assignee_id', $request->input('assignee_id'));
        }

        return TaskResource::collection($query->latest()->get());
    }

    public function show(Task $task)
    {
        return new TaskResource($task->load(['labels', 'checklistItems']));
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->hasPermission('task:create'), 403);

        $data = $request->validate([
            'projectId' => ['required', 'exists:projects,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string'],
            'priority' => ['required', 'string'],
            'assignee' => ['nullable', 'exists:users,id'],
            'dueDate' => ['nullable', 'date'],
            'labels' => ['array'],
            'labels.*' => ['string'],
        ]);

        $task = Task::create([
            'project_id' => $data['projectId'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'],
            'priority' => $data['priority'],
            'assignee_id' => $data['assignee'] ?? null,
            'due_date' => $data['dueDate'] ?? null,
        ]);

        $this->syncLabels($task, $data['labels'] ?? []);

        return new TaskResource($task->load(['labels', 'checklistItems']));
    }

    public function update(Request $request, Task $task)
    {
        $isStatusOnlyMove = $request->has('status') && count($request->all()) === 1;
        $permission = $isStatusOnlyMove ? 'task:move' : 'task:edit';
        abort_unless($request->user()->hasPermission($permission), 403);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'string'],
            'priority' => ['sometimes', 'string'],
            'assignee' => ['sometimes', 'nullable', 'exists:users,id'],
            'dueDate' => ['sometimes', 'nullable', 'date'],
            'labels' => ['sometimes', 'array'],
            'labels.*' => ['string'],
        ]);

        $mapped = collect($data)->only(['title', 'description', 'status', 'priority'])->toArray();
        if (array_key_exists('assignee', $data)) $mapped['assignee_id'] = $data['assignee'];
        if (array_key_exists('dueDate', $data)) $mapped['due_date'] = $data['dueDate'];
        $task->update($mapped);

        if (array_key_exists('labels', $data)) {
            $this->syncLabels($task, $data['labels']);
        }

        return new TaskResource($task->load(['labels', 'checklistItems']));
    }

    public function destroy(Request $request, Task $task)
    {
        abort_unless($request->user()->hasPermission('task:delete'), 403);

        $task->delete();

        return response()->json(['message' => 'Task deleted.']);
    }

    private function syncLabels(Task $task, array $labelNames): void
    {
        $ids = collect($labelNames)
            ->map(fn ($name) => MasterLabel::firstOrCreate(['name' => $name], ['color' => '#9CA3AF'])->id)
            ->all();

        $task->labels()->sync($ids);
    }
}
