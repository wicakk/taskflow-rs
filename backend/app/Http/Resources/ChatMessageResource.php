<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'projectId' => $this->project_id,
            'authorId' => $this->author_id,
            'text' => $this->text,
            'timestamp' => $this->created_at->toIso8601String(),
        ];
    }
}
