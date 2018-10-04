<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Fonts extends Model
{
    use SoftDeletes;

    protected  $table = 'fonts';
    protected $fillable = ['name', 'language', 'style', 'example', 'isopen'];
    protected  $dates = ['deleted_at'];

    public function findByLangAndStyle($language, $style)
    {
        return $this->whereNull('deleted_at')->where('language', $language)->where('style', $style)->get();
    }

    public function findByName($name)
    {
        return $this->whereNull('deleted_at')->where('name', $name)->first();
    }
}
