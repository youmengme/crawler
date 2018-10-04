<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use JWTAuth;
use UtilService;
use App\Http\Models\Website;
use App\Http\Models\Combo;
use App\Http\Models\Password;
use Illuminate\Support\Facades\DB;
use App\Http\Models\Server;
use App\Http\Models\Backend;
use App\Http\Models\Downlist;
use App\Http\Models\Member;
use Illuminate\Support\Facades\Log;
use App\Http\Models\Cashlog;
use App\Http\Models\System;

class SettingController extends Controller
{
    const AJAX_SUCCESS = 0;
    const AJAX_FAIL = -1;
    const AJAX_NO_DATA = 10001;
    const AJAX_NO_AUTH = 99999;
    private $key = '67280552dd9f0a53389ce2fca801cf42';

    public function website(Request $request){
        $id = $request->input('id');
        $name = $request->input('name');
        $alias = $request->input('alias');
        $url = $request->input('url');
        $type = $request->input('type');
        $isopen = $request->input('isopen');

        $this->validate(request(), [
            'name'=>'required|min:1'
        ]);

        if($id){
            $obj = Website::find($id);
            $obj->id = $id;
            $obj->name = $name;
            $obj->alias = $alias;
            $obj->url = $url;
            $obj->type = $type ? $type : 'point';
            $obj->isopen = $isopen;
            $res = $obj->save();
        }
        else{
            $param = request(['name', 'url', 'isopen', 'alias']);
            $param['type'] = $type ? $type : 'point';
            $res = Website::create($param);
        }

        if($res){
            return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', $res);
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
        }
    }

    public function combo(Request $request){
        $this->validate(request(), [
            'name'=>'required|min:1',
            'price'=>'required',
            'type'=>'required',
            'timelong'=>'required',
            'count'=>'required',
            'sites'=>'required'
        ]);
        $id = $request->input('id');
        $name = $request->input('name');
        $price = $request->input('price');
        $type = $request->input('type');
        $timelong = $request->input('timelong');
        $count = $request->input('count');
        $point = $request->input('point');
        $isopen = $request->input('isopen');
        $sites = $request->input('sites');
        $ids = array();
        foreach ($sites as $item){
            $ids[] = $item['id'];
        }

        //按天是分别对应每个网站的下载次数，每天下载的最高上限次数
        if($type == 'day'){
            $count = 0;
            foreach ($sites as $item){
                $value = $item['value'] ? $item['value'] : 0;
                $count = $count + $value;
            }
        }

        $site_arr = Website::findMany($ids);
        if($type == 'day' || $type == 'count') {
            DB::beginTransaction();
            try {
                if ($id) {
                    $obj = Combo::find($id);
                    $obj->name = $name;
                    $obj->price = $price;
                    $obj->type = $type;
                    $obj->timelong = $timelong;
                    $obj->count = $count;
                    $obj->point = $point;
                    $obj->isopen = $isopen;
                    $obj->save();

                    $currSites = $obj->websites;
                    $addSites = $site_arr->diff($currSites);
                    if(count($addSites) > 0) {
                        foreach ($addSites as $site) {
                            $obj->grantSite($site);

                            $value = array(
                                "count" => 0
                            );
                            foreach ($sites as $item) {
                                if ($item['id'] == $site->id) {
                                    $value['count'] = $item['value'] ? $item['value'] : 0;
                                }
                            }
                            $obj->grantComboDetail($value, $site);
                        }
                    }
                    else{
                        $value = array(
                            "count" => 0,
                            "updated_at" => date('Y-m-d H:i:s')
                        );
                        foreach ($site_arr as $site) {
                            foreach ($sites as $item) {
                                if ($item['id'] == $site->id) {
                                    $value['count'] = $item['value'] ? $item['value'] : 0;
                                }
                            }
                            $obj->grantComboDetail($value, $site);
                        }
                    }

                    $deleteSites = $currSites->diff($site_arr);
                    foreach ($deleteSites as $site) {
                        $obj->deleteSite($site);
                    }
                }
                else {
                    $param = request(['name', 'url', 'price', 'type', 'timelong', 'isopen', 'point']);
                    $param['count'] = $count;
                    $obj = Combo::create($param);
                    if ($obj) {
                        $value = array(
                            "count"=>0,
                            "updated_at" => date('Y-m-d H:i:s')
                        );
                        foreach ($site_arr as $site) {
                            foreach ($sites as $item){
                                if($item['id'] == $site->id){
                                    $value['count'] = $item['value'] ? $item['value'] : 0;
                                }
                            }

                            $obj->grantSite($site);
                            $obj->grantComboDetail($value, $site);
                        }
                    }
                }
                DB::commit();
                return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', '');
            } catch (QueryException $ex) {
                DB::rollback();
                return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '参数错误', '');
        }
    }

    public function combolist(Request $request){
        $lists = Combo::whereNull('deleted_at')->get();

        if($lists){
            foreach ($lists as $key=>$list) {
                $lists[$key]['sites'] = $list->websites;
            }
            return UtilService::format_data(self::AJAX_SUCCESS, '获取成功', $lists);
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '获取失败', '');
        }
    }

    public function sitelist(Request $request){
        $lists = Website::whereNull('deleted_at')->get();

        if($lists){
            return UtilService::format_data(self::AJAX_SUCCESS, '获取成功', $lists);
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '获取失败', '');
        }
    }

    public function sitepage(Request $request){
        $search = $request->input('search');
        $page = $request->input('page');
        $limit = $request->input('num');
        $start = $request->input('start');
        $end = $request->input('end');
        $start_time = $start.' 00:00:00';
        $end_time = $end.' 23:59:59';
        $like = '%'.$search.'%';
        $offset = ($page - 1) * $limit;

        $total = Website::whereNull('deleted_at');
        $lists = Website::whereNull('deleted_at');
        if($start && $end){
            $total = $total->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
            $lists = $lists->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
        }

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

    public function combopage(Request $request){
        $search = $request->input('search');
        $page = $request->input('page');
        $limit = $request->input('num');
        $start = $request->input('start');
        $end = $request->input('end');
        $start_time = $start.' 00:00:00';
        $end_time = $end.' 23:59:59';
        $like = '%'.$search.'%';
        $offset = ($page - 1) * $limit;

        $total = Combo::whereNull('deleted_at');
        $lists = Combo::whereNull('deleted_at');
        if($start && $end){
            $total = $total->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
            $lists = $lists->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
        }

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
            foreach ($lists as $key=>$list) {
                $lists[$key]['sites'] = $list->websites;
            }
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

    public function generatepwd(Request $request){
        $user = JWTAuth::parseToken()->authenticate();
        $combo_id = $request->input('combo_id');
        $num = $request->input('num');

        $this->validate(request(), [
            'combo_id'=>'required',
            'num'=>'required'
        ]);

        $arr = array();
        for($i=0 ;$i<$num; $i++){
            $str = 'goodluck'.$i.'cat'.time();
            $password = md5($str);

            $params = array(
                "combo_id" => $combo_id,
                "uid" => $user->id,
                "isopen" => 1,
                "password" => $password,
                "created_at" => date('Y-m-d H:i:s'),
                "updated_at" => date('Y-m-d H:i:s')
            );
            $arr[] = $params;
        }

        $combo = DB::table('combo')->where('id', $combo_id)->first();
        $total_money = $combo->price * $num * $user->discount * 0.01;
        $row = DB::table('users')->where('id', $user->id)->first();
        if($row && $row->money >= $total_money) {
            DB::beginTransaction();
            try {
                DB::table('users')->where('id', $user->id)->where('money', '>=', $total_money)->decrement('money', $total_money);;
                DB::table('password')->insert($arr);
                Cashlog::create(array(
                    "uid" => $user->id,
                    "type" => 'money',
                    "mark" => 'consume',
                    "money" => $total_money,
                ));
                DB::commit();
                return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', '');
            } catch (QueryException $ex) {
                DB::rollback();
                return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '余额不足', '');
        }
    }

    public function pwdlist(Request $request){
        $user = JWTAuth::parseToken()->authenticate();
        $roles = $user->roles;
        $flag = false;
        foreach ($roles as $role){
            if($role->name == '管理员'){
                $flag = true;
                break;
            }
        }

        $search = $request->input('search');
        $page = $request->input('page');
        $limit = $request->input('num');
        $uid = $request->input('uid');
        $start = $request->input('start');
        $end = $request->input('end');
        $start_time = $start.' 00:00:00';
        $end_time = $end.' 23:59:59';
        $like = '%'.$search.'%';
        $offset = ($page - 1) * $limit;
        if(!$flag){
            $uid = $user->id;
        }

        $total = Password::whereNull('deleted_at');
        $lists = Password::whereNull('deleted_at');
        if($start && $end){
            $total = $total->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
            $lists = $lists->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
        }

        if($uid != 'all' && $uid){
            $total = $total->where('uid', $uid);
            $lists = $lists->where('uid', $uid);
        }

        if($search){
            $total = $total->where('password', 'like', $like);
            $lists = $lists->where('password', 'like', $like);
        }

        $total = $total->orderBy('id', 'desc')->get();
        $lists = $lists->orderBy('id', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();

        if($lists){
            foreach ($lists as $key=>$list) {
                $combo = Combo::find($list->combo_id);
                $lists[$key]['combo'] = $combo;
                $row = \App\User::find($list->uid);
                $lists[$key]['agentname'] = $row ? $row->name: '';

                $row = Member::find($list->member_id);
                $lists[$key]['username'] = $row ? $row->mobile: '';
            }

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

    public function pwdfreeze(Request $request){
        $idstring = $request->input('idstring');
        $this->validate(request(), [
            'idstring'=>'required|min:1'
        ]);

        $idarray = explode(',', $idstring);
        $res = Password::whereIn('id', $idarray)->update([
            "isopen" => 0
        ]);

        if($res){
            return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', $res);
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
        }
    }

    public function backend(Request $request){
        $id = $request->input('id');
        $site_id = $request->input('site_id');
        $server_id = $request->input('server_id');
        $username = $request->input('username');
        $password = $request->input('password');
        $isopen = $request->input('isopen');
        $login_type = $request->input('login_type');

        if($site_id && $server_id && $username && $password && $login_type) {
            $this->validate(request(), [
                'site_id' => 'required|min:1',
                'server_id' => 'required',
                'username' => 'required',
                'password' => 'required',
                'login_type' => 'required'
            ]);

            //推送参数
            $p = array(
                "username" => $username,
                "password" => $password,
                "site" => '',
                "type" => $login_type,
                "enable" => $isopen ? true : false,
                "server_ip" => '',
                "ua" => 'Mozilla/5.0 AppleWebKit/537.46 (KHTML, like Gecko) Chrome/68.0.3376.99'
            );

            if ($id) {
                $obj = Backend::find($id);
                $p['id'] = $obj->sync_id ? $obj->sync_id : '';
                $obj->id = $id;
                $obj->site_id = $site_id;
                $obj->server_id = $server_id;
                $obj->username = $username;
                $obj->password = $password;
                $obj->login_type = $login_type;
                $obj->isopen = $isopen;
                $res = $obj->save();  //返回真假
            }
            else {
                $param = request(['site_id', 'server_id', 'password', 'username', 'isopen', 'login_type']);
                $res = Backend::create($param);  //返回值Model对象
            }

            if ($res) {
                $siteObj = Website::find($site_id);
                $serverObj = Server::find($server_id);
                if($siteObj && $serverObj) {
                    $p['site'] = $siteObj->alias;
                    $p['server_ip'] = $serverObj->ip;

                    $rtn = $this->serverpush($p);
                    if($rtn['code'] == 0 && isset($rtn['data']) && isset($rtn['data']['id'])){
                        //插入同步id
                        if($id){
                            $bObj = Backend::find($id);
                        }
                        else if(isset($res->id)){
                            $bObj = Backend::find($res->id);
                        }

                        if(isset($bObj)){
                            $bObj->sync_id = $rtn['data']['id'];
                            $bObj->save();
                        }
                    }
                }

                return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', $res);
            } else {
                return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '参数错误', '');
        }
    }

    public function server(Request $request){
        $id = $request->input('id');
        $ip = $request->input('ip');
        $name = $request->input('name');
        $isopen = $request->input('isopen');

        if($ip && $name) {
            $this->validate(request(), [
                'ip' => 'required|min:1',
                'name' => 'required'
            ]);

            if ($id) {
                $obj = Server::find($id);
                $obj->id = $id;
                $obj->name = $name;
                $obj->ip = $ip;
                $obj->isopen = $isopen;
                $res = $obj->save();
            } else {
                $param = request(['name', 'ip', 'isopen']);
                $res = Server::create($param);
            }

            if ($res) {
                return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', $res);
            } else {
                return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '参数错误', '');
        }
    }

    public function serverlist(Request $request){
        $search = $request->input('search');
        $page = $request->input('page');
        $limit = $request->input('num');
        $start = $request->input('start');
        $end = $request->input('end');
        $start_time = $start.' 00:00:00';
        $end_time = $end.' 23:59:59';
        $like = '%'.$search.'%';
        $offset = ($page - 1) * $limit;

        $total = Server::whereNull('deleted_at');
        $lists = Server::whereNull('deleted_at');
        if($start && $end){
            $total = $total->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
            $lists = $lists->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
        }

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

    public function backendlist(Request $request){
        $search = $request->input('search');
        $page = $request->input('page');
        $limit = $request->input('num');
        $start = $request->input('start');
        $end = $request->input('end');
        $start_time = $start.' 00:00:00';
        $end_time = $end.' 23:59:59';
        $like = '%'.$search.'%';
        $offset = ($page - 1) * $limit;

        $total = Backend::whereNull('deleted_at');
        $lists = Backend::whereNull('deleted_at');
        if($start && $end){
            $total = $total->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
            $lists = $lists->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
        }

        if($search){
            $total = $total->where('username', 'like', $like);
            $lists = $lists->where('username', 'like', $like);
        }

        $total = $total->orderBy('id', 'desc')->get();
        $lists = $lists->orderBy('id', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();

        if($lists){
            foreach ($lists as $key=>$list) {
                $server = Server::find($list->server_id);
                $website = Website::find($list->site_id);
                $lists[$key]['server'] = $server;
                $lists[$key]['website'] = $website;
            }

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

    public function downaccounts(Request $request){
        $rtn = $this->check_sign(request(['site', 'timestamp', 'sign']));
        if($rtn['code'] == 0) {
            $site = $request->input('site');
            if ($site) {
                $lists = DB::table('backend')
                    ->join('website', 'backend.site_id', '=', 'website.id')
                    ->join('server', 'backend.server_id', '=', 'server.id')
                    ->select('backend.username', 'backend.password', 'backend.login_type AS type', 'backend.server_id', 'server.name AS server_name', 'server.ip AS server_ip')
                    ->whereNull('backend.deleted_at')
                    ->where('backend.isopen', 1)
                    ->where('website.alias', $site)
                    ->get();

                if ($lists) {
                    return UtilService::format_data(self::AJAX_SUCCESS, '获取成功', $lists);
                } else {
                    return UtilService::format_data(self::AJAX_FAIL, '获取失败', array());
                }
            } else {
                return UtilService::format_data(self::AJAX_SUCCESS, '参数错误', array());
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, $rtn['message'], array());
        }
    }

    public function downreport(Request $request){
        Log::info(request(['data', 'timestamp', 'sign']));
        $rtn = $this->check_sign(request(['data', 'timestamp', 'sign']));
        if($rtn['code'] == 0) {
            $data = $request->input('data');
            $data = json_decode($data, true);
            $id = isset($data['id']) ? $data['id'] : '';
            if($id){
	            $obj = Downlist::find($id);
	            if(!$obj){
		            $param = array(
		                "id" => $id,
		                "site" => isset($data['site']) ? $data['site'] : '',
		                "title" => isset($data['title']) ? $data['title'] : '',
		                "source" => isset($data['source']) ? $data['source'] : '',
		                "item_id" => isset($data['item_id']) ? $data['item_id'] : '',
		                "status" => isset($data['status']) ? $data['status'] : '',
		                "error_info" => isset($data['error_info']) ? $data['error_info'] : '',
		                "fail_reason" => isset($data['fail_reason']) ? $data['fail_reason'] : '',
		                "attachments" => isset($data['attachments']) ? json_encode($data['attachments']) : ''
		            );
		
		            $res = Downlist::create($param);
	            }
	            else{
	            	$attachments = isset($data['attachments']) ? json_encode($data['attachments']) : '';
	            	if(isset($data['title']) && $data['title']){
                        $obj->title = $data['title'];
                    }
                    if(isset($data['status']) && $data['status']){
                        $obj->status = $data['status'];
                    }

	            	$obj->attachments = $attachments;
	            	$res = $obj->save();
	            }
	            
	            if ($res) {
	                return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', $res);
	            } else {
	                return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
	            }
            }
            else{
            	return UtilService::format_data(self::AJAX_FAIL, '缺少ID', '');
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, $rtn['message'], array());
        }
    }

    private function check_sign($param, $urlencode=false)
    {
        $rtn = array(
            "code" => 0,
            "message" => ''
        );
        //添加时间戳，隔太久失效，防止被截取重复调用
        if((time() - $param['timestamp'] ) <= 30){
            $buff = "";
            ksort($param);
            foreach ($param as $k => $v)
            {
                if($k != 'sign') {
                    if ($urlencode) {
                        $v = urlencode($v);
                    }
                    $buff .= $k . "=" . $v . "&";
                }
            }

            $string = '';
            if (strlen($buff) > 0)
            {
                //签名步骤一：按字典序排序参数
                $string = substr($buff, 0, strlen($buff)-1);
            }

            //签名步骤二：在string后加入KEY
            $string = $string."&key=".$this->key;
            //签名步骤三：MD5加密
            $string = md5($string);
            //签名步骤四：所有字符转为大写
            $res_sign = strtoupper($string);
            if($param['sign'] == $res_sign){
                //right
                $rtn['code'] = 0;
                $rtn['message'] = 'sign success';
            }
            else{
                //wrong
                $rtn['code'] = -1;
                $rtn['message'] = 'sign fail';
            }
        }
        else{
            //timeout
            $rtn['code'] = -1;
            $rtn['message'] = 'api timeout';
        }

        return $rtn;
    }

    private function sign($param, $key, $urlencode=false)
    {
        $buff = "";
        ksort($param);
        foreach ($param as $k => $v)
        {
            if ($urlencode) {
                $v = urlencode($v);
            }
            $buff .= $k . "=" . $v . "&";
        }

        $string = '';
        if (strlen($buff) > 0)
        {
            //签名步骤一：按字典序排序参数
            $string = substr($buff, 0, strlen($buff)-1);
        }

        //签名步骤二：在string后加入KEY
        $string = $string."&key=".$key;
        //签名步骤三：MD5加密
        $string = md5($string);
        //签名步骤四：所有字符转为大写
        $res_sign = strtoupper($string);

        return $res_sign;
    }

    public function testget(Request $request){
        $domain = UtilService::domain();
        $timestamp = time();
        $site = "58pic";
        $param = array(
            "site"=> $site,
            "timestamp"=> $timestamp
        );
        $sign = $this->sign($param, $this->key);
        $url = $domain.'/api/downaccounts?site='.$site.'&timestamp='.$timestamp.'&sign='.$sign;
        $res = UtilService::curl_get($url);
        dd($res);
    }

    public function testpost(Request $request){
        $domain = UtilService::domain();
        $timestamp = time();
        $data = array(
            "id"=> 1,
            "site" => '111',
            "title" => '111',
            "source" => '111',
            "item_id" => 2,
            "status" => 5,
            "error_info" => '111',
            "fail_reason" => '111',
            "attachments" => '111'
        );
        $param = array(
            "data"=> json_encode($data),
            "timestamp"=> $timestamp
        );
        $sign = $this->sign($param, $this->key);
        $param['sign'] = $sign;
        $param['json'] = true;
        $param['diy_header'] = 'Content-Type: application/json';
        $url = $domain.'/api/downreport';
        $res = UtilService::curl_post($url, $param);
        dd($res);
    }

    public function system(Request $request){
        $user = JWTAuth::parseToken()->authenticate();
        $id = $request->input('id');
        $service = $request->input('service');
        $qq = $request->input('qq');
        $buy_link = $request->input('buy_link');
        $announce = $request->input('announce');

        if($service) {
            $this->validate(request(), [
                'service' => 'required'
            ]);

            if ($id) {
                $obj = System::find($id);
                $obj->service = $service;
                $obj->qq = $qq;
                $obj->buy_link = $buy_link;
                $obj->announce = $announce;
                $res = $obj->save();
            } else {
                $param = request(['service', 'qq', 'buy_link', 'announce']);
                $param['uid'] = $user->id;
                $res = System::create($param);
            }

            if ($res) {
                return UtilService::format_data(self::AJAX_SUCCESS, '操作成功', $res);
            } else {
                return UtilService::format_data(self::AJAX_FAIL, '操作失败', '');
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '参数错误', '');
        }
    }

    public function sysinfo(Request $request){
        $user = JWTAuth::parseToken()->authenticate();
        $obj = System::whereNull('deleted_at')->where('uid', $user->id)->first();
        if ($obj) {
            return UtilService::format_data(self::AJAX_SUCCESS, '获取成功', $obj);
        } else {
            return UtilService::format_data(self::AJAX_FAIL, '获取失败', '');
        }
    }

    private function serverpush($param){
        $url = 'http://10.47.105.170:12333/api/site/account';
        $param['diy_header'] = 'Content-Type: application/x-www-form-urlencoded';        
        $param['http_build_query'] = true;
        $res = UtilService::curl_post($url, $param);

        return $res;
    }

    public function downlist(Request $request){
        $user = JWTAuth::parseToken()->authenticate();
        $roles = $user->roles;
        $flag = false;
        foreach ($roles as $role){
            if($role->name == '管理员'){
                $flag = true;
                break;
            }
        }

        if($flag) {
            $search = $request->input('search');
            $page = $request->input('page');
            $limit = $request->input('num');
            $site = $request->input('site');
            $start = $request->input('start');
            $end = $request->input('end');
            $start_time = $start . ' 00:00:00';
            $end_time = $end . ' 23:59:59';
            $like = '%' . $search . '%';
            $offset = ($page - 1) * $limit;

            $total = Downlist::whereNull('deleted_at');
            $lists = Downlist::whereNull('deleted_at');
            if ($start && $end) {
                $total = $total->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
                $lists = $lists->where('created_at', '>=', $start_time)->where('created_at', '<=', $end_time);
            }

            if ($site) {
                $total = $total->where('site', $site);
                $lists = $lists->where('site', $site);
            }

            if ($search) {
                $total = $total->where('source', 'like', $like);
                $lists = $lists->where('source', 'like', $like);
            }

            $total = $total->orderBy('id', 'desc')->get();
            $lists = $lists->orderBy('id', 'desc')
                ->offset($offset)
                ->limit($limit)
                ->get();

            if ($lists) {
                $res = array(
                    'data' => $lists,
                    'total' => count($total)
                );

                return UtilService::format_data(self::AJAX_SUCCESS, '获取成功', $res);
            } else {
                return UtilService::format_data(self::AJAX_FAIL, '获取失败', '');
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '没有权限', '');
        }
    }

    public function statistic(){
        $user = JWTAuth::parseToken()->authenticate();
        $roles = $user->roles;
        $flag = false;
        foreach ($roles as $role){
            if($role->name == '管理员'){
                $flag = true;
                break;
            }
        }

        if($flag) {
            $begin = date("y-m-d", time() - 7 * 24 * 60 * 60) . "00:00:00";
            $lists = Downlist::whereNull('deleted_at')
                ->where('created_at', '>=', $begin)
                ->get();

            $sites = Website::whereNull('deleted_at')->where('isopen', 1)->get();

            if ($lists && $sites) {
                $init = array();
                foreach ($sites as $site) {
                    if ($site->alias) {
                        $init[$site->alias] = array(
                            'name'=>$site->name,
                            'alias'=>$site->alias,
                            'value'=>0
                        );
                    }
                }
                $data = array(
                    date('Y-m-d', time() - 6 * 24 * 60 * 60) => $init,
                    date('Y-m-d', time() - 5 * 24 * 60 * 60) => $init,
                    date('Y-m-d', time() - 4 * 24 * 60 * 60) => $init,
                    date('Y-m-d', time() - 3 * 24 * 60 * 60) => $init,
                    date('Y-m-d', time() - 2 * 24 * 60 * 60) => $init,
                    date('Y-m-d', time() - 24 * 60 * 60) => $init,
                    date('Y-m-d', time()) => $init
                );

                foreach ($lists as $item) {
                    $day = substr($item->created_at, 0, 10);
                    foreach ($data as $key => $val) {
                        if ($day == $key) {
                            foreach ($data[$key] as $k => $sub) {
                                if ($k == $item->site) {
                                    $data[$key][$k]['value'] = $sub['value'] + 1;
                                }
                            }
                            break;
                        }
                    }
                }

                return UtilService::format_data(self::AJAX_SUCCESS, '获取成功', $data);
            } else {
                return UtilService::format_data(self::AJAX_FAIL, '没有数据', '');
            }
        }
        else{
            return UtilService::format_data(self::AJAX_FAIL, '没有权限', '');
        }
    }
}
