<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Server extends Model
{
    use SoftDeletes;

    protected  $table = 'server';
    protected $fillable = ['name', 'ip', 'isopen']; //批量赋值
    protected  $dates = ['deleted_at'];
}
