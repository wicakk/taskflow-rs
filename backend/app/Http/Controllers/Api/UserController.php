<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->hasPermission('team:manage'), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', 'string'],
            'accessRole' => ['required', Rule::in(['admin', 'manager', 'member', 'viewer'])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'initials' => $this->initialsFrom($data['name']),
            'role' => $data['role'] ?? null,
            'access_role' => $data['accessRole'],
        ]);

        return new UserResource($user);
    }

    public function update(Request $request, User $user)
    {
        abort_unless($request->user()->hasPermission('team:manage'), 403);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:6'],
            'role' => ['sometimes', 'nullable', 'string'],
            'accessRole' => ['sometimes', Rule::in(['admin', 'manager', 'member', 'viewer'])],
        ]);

        $mapped = collect($data)->only(['name', 'email', 'role'])->toArray();
        if (! empty($data['password'])) {
            $mapped['password'] = Hash::make($data['password']);
        }
        if (array_key_exists('accessRole', $data)) {
            $mapped['access_role'] = $data['accessRole'];
        }
        if (array_key_exists('name', $data)) {
            $mapped['initials'] = $this->initialsFrom($data['name']);
        }

        $user->update($mapped);

        return new UserResource($user);
    }

    public function destroy(Request $request, User $user)
    {
        abort_unless($request->user()->hasPermission('team:manage'), 403);
        abort_if($request->user()->id === $user->id, 422, "You can't remove your own account.");

        $user->delete();

        return response()->json(['message' => 'Member removed.']);
    }

    private function initialsFrom(string $name): string
    {
        $parts = array_filter(explode(' ', $name));
        $initials = collect($parts)->map(fn ($p) => mb_strtoupper(mb_substr($p, 0, 1)))->take(2)->implode('');

        return $initials ?: '?';
    }
}
