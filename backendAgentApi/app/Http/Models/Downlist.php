<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Downlist extends Model
{
    use SoftDeletes;

    protected  $table = 'downlist';
    protected $fillable = ['id', 'site', 'title', 'source', 'item_id', 'status', 'error_info', 'fail_reason', 'attachments']; //批量赋值
    protected  $dates = ['deleted_at'];
}
