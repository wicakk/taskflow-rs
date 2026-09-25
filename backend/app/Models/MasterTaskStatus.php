<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterTaskStatus extends Model
{
    protected $fillable = ['key', 'name', 'color', 'order'];

    protected static function booted(): void
    {
        static::creating(function (self $status) {
            if (empty($status->key)) {
                // Stable, unique identifier stored on tasks.status. Two stages
                // with the same name (or a name with no latin letters) must
                // not collide on the unique index, so add a numeric suffix.
                $base = \Illuminate\Support\Str::slug($status->name, '') ?: 'status';
                $key = $base;
                $i = 2;
                while (static::where('key', $key)->exists()) {
                    $key = $base.$i++;
                }
                $status->key = $key;
            }
        });
    }
}
