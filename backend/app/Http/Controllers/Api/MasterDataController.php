<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MasterDepartment;
use App\Models\MasterJobTitle;
use App\Models\MasterLabel;
use App\Models\MasterPriority;
use App\Models\MasterProjectStatus;
use App\Models\MasterTaskStatus;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class MasterDataController extends Controller
{
    /** @var array<string, class-string> */
    private const MODELS = [
        'taskStatuses' => MasterTaskStatus::class,
        'priorities' => MasterPriority::class,
        'projectStatuses' => MasterProjectStatus::class,
        'labels' => MasterLabel::class,
        'departments' => MasterDepartment::class,
        'jobTitles' => MasterJobTitle::class,
    ];

    private const HAS_COLOR = ['taskStatuses', 'priorities', 'projectStatuses', 'labels'];
    private const HAS_ORDER = ['taskStatuses', 'priorities', 'projectStatuses'];
    private const HAS_DESCRIPTION = ['departments'];

    public function index(string $type)
    {
        $model = $this->resolveModel($type);
        $query = $model::query();

        if (in_array($type, self::HAS_ORDER, true)) {
            $query->orderBy('order');
        } else {
            $query->orderBy('name');
        }

        return response()->json($query->get());
    }

    public function store(Request $request, string $type)
    {
        abort_unless($request->user()->hasPermission('master:manage'), 403);

        $model = $this->resolveModel($type);
        $data = $this->validated($request, $type);

        if (in_array($type, self::HAS_ORDER, true)) {
            $data['order'] = ($model::max('order') ?? 0) + 1;
        }

        $item = $model::create($data);

        return response()->json($item, 201);
    }

    public function update(Request $request, string $type, int $id)
    {
        abort_unless($request->user()->hasPermission('master:manage'), 403);

        $model = $this->resolveModel($type);
        $item = $model::findOrFail($id);
        $data = $this->validated($request, $type, partial: true);

        // `key` (taskStatuses only) is immutable once created — tasks reference it directly.
        unset($data['key']);

        $item->update($data);

        return response()->json($item);
    }

    public function destroy(Request $request, string $type, int $id)
    {
        abort_unless($request->user()->hasPermission('master:manage'), 403);

        $model = $this->resolveModel($type);
        $item = $model::findOrFail($id);

        $usage = $this->usageCount($type, $item);
        if ($usage > 0) {
            return response()->json([
                'message' => "Can't delete — still used by {$usage} item(s).",
            ], 422);
        }

        $item->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    /** Move a taskStatuses/priorities/projectStatuses item up (-1) or down (+1). */
    public function move(Request $request, string $type, int $id)
    {
        abort_unless($request->user()->hasPermission('master:manage'), 403);
        abort_unless(in_array($type, self::HAS_ORDER, true), 422, 'This type is not orderable.');

        $direction = (int) $request->validate(['direction' => ['required', 'integer', 'in:-1,1']])['direction'];
        $model = $this->resolveModel($type);

        DB::transaction(function () use ($model, $id, $direction) {
            $current = $model::findOrFail($id);
            $swap = $model::where('order', $current->order + $direction)->first();
            if ($swap) {
                $currentOrder = $current->order;
                $current->update(['order' => $swap->order]);
                $swap->update(['order' => $currentOrder]);
            }
        });

        return response()->json(['message' => 'Reordered.']);
    }

    private function resolveModel(string $type): string
    {
        if (! array_key_exists($type, self::MODELS)) {
            throw new BadRequestException("Unknown master data type: {$type}");
        }

        return self::MODELS[$type];
    }

    private function validated(Request $request, string $type, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        $rules = ['name' => [$required, 'string', 'max:255']];

        if (in_array($type, self::HAS_COLOR, true)) {
            $rules['color'] = [$required, 'string', 'max:7'];
        }
        if (in_array($type, self::HAS_DESCRIPTION, true)) {
            $rules['description'] = ['nullable', 'string'];
        }

        return $request->validate($rules);
    }

    /** How many tasks/projects/users currently reference this master data item — blocks deletion when > 0. */
    private function usageCount(string $type, $item): int
    {
        return match ($type) {
            'taskStatuses' => Task::where('status', $item->key)->count(),
            'priorities' => Task::where('priority', $item->name)->count() + Project::where('priority', $item->name)->count(),
            'projectStatuses' => Project::where('status', $item->name)->count(),
            'labels' => $item->tasks()->count(),
            'departments' => Project::where('department', $item->name)->count(),
            'jobTitles' => User::where('role', $item->name)->count(),
            default => 0,
        };
    }
}
