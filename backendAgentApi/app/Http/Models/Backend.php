<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Backend extends Model
{
    use SoftDeletes;

    protected  $table = 'backend';
    protected $fillable = ['site_id', 'server_id', 'password', 'username', 'isopen', 'login_type', 'sync_id']; //批量赋值
    protected  $dates = ['deleted_at'];
}
