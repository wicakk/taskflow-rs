<?php

namespace App\Support;

/**
 * Mirrors the frontend's src/utils/permissions.js matrix exactly. Keep the
 * two in sync manually — this is the source of truth for the API; the
 * frontend copy only gates the UI (buttons/menus), never trust it alone.
 */
class Permissions
{
    private const MATRIX = [
        'admin' => [
            'project:create' => true, 'project:edit' => true, 'project:delete' => true,
            'task:create' => true, 'task:edit' => true, 'task:delete' => true, 'task:move' => true,
            'team:manage' => true, 'announcement:pin' => true, 'master:manage' => true,
        ],
        'manager' => [
            'project:create' => true, 'project:edit' => true, 'project:delete' => true,
            'task:create' => true, 'task:edit' => true, 'task:delete' => true, 'task:move' => true,
            'team:manage' => false, 'announcement:pin' => true, 'master:manage' => false,
        ],
        'member' => [
            'project:create' => false, 'project:edit' => false, 'project:delete' => false,
            'task:create' => true, 'task:edit' => true, 'task:delete' => false, 'task:move' => true,
            'team:manage' => false, 'announcement:pin' => false, 'master:manage' => false,
        ],
        'viewer' => [
            'project:create' => false, 'project:edit' => false, 'project:delete' => false,
            'task:create' => false, 'task:edit' => false, 'task:delete' => false, 'task:move' => false,
            'team:manage' => false, 'announcement:pin' => false, 'master:manage' => false,
        ],
    ];

    public static function can(?string $accessRole, string $action): bool
    {
        return self::MATRIX[$accessRole][$action] ?? false;
    }
}
