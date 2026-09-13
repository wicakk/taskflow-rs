<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'initials' => $this->initials,
            'role' => $this->role,
            'accessRole' => $this->access_role,
            'online' => (bool) $this->online,
            'activeTasks' => $this->active_tasks,
            'completedTasks' => $this->completed_tasks,
            'workload' => $this->workload,
        ];
    }
}
