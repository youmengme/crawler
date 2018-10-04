<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class System extends Model
{
    use SoftDeletes;

    protected  $table = 'system';
    protected $fillable = ['uid', 'service', 'qq', 'buy_link', 'announce']; //批量赋值
    protected  $dates = ['deleted_at'];
}
