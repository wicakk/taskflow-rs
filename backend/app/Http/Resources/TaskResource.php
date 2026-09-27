<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\TaskCommentResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'projectId' => $this->project_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'assignees' => $this->whenLoaded('assignees', fn () => $this->assignees->pluck('id')),
            'dueDate' => optional($this->due_date)->toDateString(),
            // Real, live count — not a static counter — so it always matches the
            // comments actually stored for this task.
            'comments' => $this->whenLoaded('comments', fn () => $this->comments->count(), $this->comments()->count()),
            'attachments' => $this->attachments_count,
            'labels' => $this->whenLoaded('labels', fn () => $this->labels->pluck('name')),
            'checklist' => $this->whenLoaded('checklistItems', fn () => $this->checklistItems->map(fn ($item) => [
                'id' => $item->id,
                'text' => $item->text,
                'done' => (bool) $item->done,
            ])),
            'commentList' => $this->whenLoaded('comments', fn () => TaskCommentResource::collection($this->comments)),
        ];
    }
}
