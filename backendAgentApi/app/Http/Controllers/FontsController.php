<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Models\Fonts;

class FontsController extends Controller
{
    public function findBypage(Request $request){
        $search = $request->input('search');
        $page = $request->input('page');
        $limit = $request->input('num');
        $like = '%'.$search.'%';
        $offset = ($page - 1) * $limit;

        $total = Fonts::whereNull('deleted_at');
        $lists = Fonts::whereNull('deleted_at');

        if($search){
            $total = $total->where('name', 'like', $like);
            $lists = $lists->where('name', 'like', $like);
        }

        $total = $total->orderBy('id', 'desc')->get();
        $lists = $lists->orderBy('id', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();

        if($lists){
            $res = array(
                'data' => $lists,
                'total' => count($total)
            );

            return UtilService::format_data(self::AJAX_SUCCESS, '获取成功', $res);
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '获取失败', '');
        }
    }

    public function chgstatus(Request $request){
        $idstring = $request->input('idstring');
        $status = $request->input('status');
        $this->validate(request(), [
            'idstring'=>'required|min:1',
            'status'=>'required'
        ]);

        $idarray = explode(',', $idstring);
        $res = Fonts::whereIn('id', $idarray)->update([
            "isopen" => $status
        ]);

        if($res){
            return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', $res);
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
        }
    }
}
