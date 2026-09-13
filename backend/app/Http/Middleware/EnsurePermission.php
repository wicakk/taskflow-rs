<?php

namespace App\Http\Middleware;

use App\Support\Permissions;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Usage in routes: ->middleware('permission:project:create')
 * Register the alias in bootstrap/app.php — see README for the exact line.
 */
class EnsurePermission
{
    public function handle(Request $request, Closure $next, string $action): Response
    {
        abort_unless(
            Permissions::can($request->user()?->access_role, $action),
            403,
            "You don't have permission to perform this action."
        );

        return $next($request);
    }
}
