<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'authorId' => $this->author_id,
            'title' => $this->title,
            'body' => $this->body,
            'pinned' => (bool) $this->pinned,
            'timestamp' => $this->created_at->toIso8601String(),
        ];
    }
}
