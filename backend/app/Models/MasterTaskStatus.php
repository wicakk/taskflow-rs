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
                $status->key = \Illuminate\Support\Str::slug($status->name, '');
            }
        });
    }
}
