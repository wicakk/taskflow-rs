<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPriority extends Model
{
    protected $fillable = ['name', 'color', 'order'];
}
