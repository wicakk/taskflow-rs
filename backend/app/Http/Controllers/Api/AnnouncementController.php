<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::orderByDesc('pinned')->orderByDesc('created_at')->get();

        return AnnouncementResource::collection($announcements);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'pinned' => ['sometimes', 'boolean'],
        ]);

        $pinned = ($data['pinned'] ?? false) && $request->user()->hasPermission('announcement:pin');

        $announcement = Announcement::create([
            'author_id' => $request->user()->id,
            'title' => $data['title'],
            'body' => $data['body'],
            'pinned' => $pinned,
        ]);

        return new AnnouncementResource($announcement);
    }

    public function update(Request $request, Announcement $announcement)
    {
        abort_unless($request->user()->hasPermission('announcement:pin'), 403);

        $data = $request->validate(['pinned' => ['required', 'boolean']]);
        $announcement->update($data);

        return new AnnouncementResource($announcement);
    }

    public function destroy(Request $request, Announcement $announcement)
    {
        abort_unless(
            $announcement->author_id === $request->user()->id || $request->user()->access_role === 'admin',
            403
        );

        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted.']);
    }
}
