<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Marks the authenticated user as "recently active". Writes are throttled to
 * once a minute per user so this doesn't turn every API call into an extra
 * UPDATE query; the "online" badge (UserResource / see also the frontend
 * heartbeat in App.jsx) tolerates being up to ~60s stale.
 */
class TouchLastSeen
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && (! $user->last_seen_at || $user->last_seen_at->lt(now()->subMinute()))) {
            $user->forceFill(['last_seen_at' => now()])->saveQuietly();
        }

        return $next($request);
    }
}
