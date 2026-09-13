<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return ProjectResource::collection(Project::with('members')->latest()->get());
    }

    public function show(Project $project)
    {
        return new ProjectResource($project->load('members'));
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->hasPermission('project:create'), 403);

        $data = $this->validated($request);
        $project = Project::create($data);
        $project->members()->sync($request->input('members', []));

        return new ProjectResource($project->load('members'));
    }

    public function update(Request $request, Project $project)
    {
        abort_unless($request->user()->hasPermission('project:edit'), 403);

        $data = $this->validated($request, partial: true);
        $project->update($data);

        if ($request->has('members')) {
            $project->members()->sync($request->input('members', []));
        }

        return new ProjectResource($project->load('members'));
    }

    public function destroy(Request $request, Project $project)
    {
        abort_unless($request->user()->hasPermission('project:delete'), 403);

        $project->delete(); // tasks cascade-delete via FK constraint

        return response()->json(['message' => 'Project deleted.']);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        $data = $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => [$required, 'string'],
            'priority' => [$required, 'string'],
            'department' => ['nullable', 'string'],
            'startDate' => ['nullable', 'date'],
            'dueDate' => ['nullable', 'date'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        $mapped = [];
        if (array_key_exists('name', $data)) $mapped['name'] = $data['name'];
        if (array_key_exists('description', $data)) $mapped['description'] = $data['description'];
        if (array_key_exists('status', $data)) $mapped['status'] = $data['status'];
        if (array_key_exists('priority', $data)) $mapped['priority'] = $data['priority'];
        if (array_key_exists('department', $data)) $mapped['department'] = $data['department'];
        if (array_key_exists('startDate', $data)) $mapped['start_date'] = $data['startDate'];
        if (array_key_exists('dueDate', $data)) $mapped['due_date'] = $data['dueDate'];
        if (array_key_exists('progress', $data)) $mapped['progress'] = $data['progress'];

        return $mapped;
    }
}
