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
            // Real presence: active within the last 2 minutes — not a static
            // seeded flag. Updated by App\Http\Middleware\TouchLastSeen on every
            // authenticated request, plus a periodic heartbeat from the frontend.
            'online' => $this->last_seen_at?->gt(now()->subMinutes(2)) ?? false,
        ];
    }
}
