<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'department' => $this->department,
            'startDate' => optional($this->start_date)->toDateString(),
            'dueDate' => optional($this->due_date)->toDateString(),
            'progress' => $this->progress,
            'members' => $this->whenLoaded('members', fn () => $this->members->pluck('id')),
        ];
    }
}
