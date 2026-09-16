<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'comments' => $this->comments_count,
            'attachments' => $this->attachments_count,
            'labels' => $this->whenLoaded('labels', fn () => $this->labels->pluck('name')),
            'checklist' => $this->whenLoaded('checklistItems', fn () => $this->checklistItems->map(fn ($item) => [
                'id' => $item->id,
                'text' => $item->text,
                'done' => (bool) $item->done,
            ])),
        ];
    }
}
