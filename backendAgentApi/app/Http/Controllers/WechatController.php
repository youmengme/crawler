<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class WechatController extends Controller
{
    private $_USERDATA = array();

    /**
     * 微信接口认证与执行...
     */
    public function main(){
        //初始化时
        if(isset($_GET["echostr"])){
            if($this->checkSignature()){
                echo $_GET["echostr"];
            }
            else{
                echo '验证失败';
            }
            exit;
        }
        else{
            //非初始化，已经认证过时
            $this->run();
        }
    }

    /**
     * 微信主运行方法...
     */
    private function run() {
        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
        if (!empty($postStr)) {
            $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
            $this->_USERDATA['fromusername'] = $postObj->FromUserName;
            $this->_USERDATA['tousername'] = $postObj->ToUserName;
            $this->_USERDATA['msgtype'] = $postObj->MsgType;
            $openid = $postObj->FromUserName;
            $param = $this->objectToArray($postObj);
            switch ($this->_USERDATA['msgtype']) {
                case 'event':
                    $this->_USERDATA['event'] = strtolower($postObj->Event);

                    if ($this->_USERDATA['event'] == 'subscribe') {
                        $this->subscribe($param);
                    }
                    elseif ($this->_USERDATA['event'] == 'unsubscribe') {
                        //取消关注事件
                        $return = $this->unsubscribe($param);
                    }
                    elseif ($this->_USERDATA['event'] == 'scan') {
                        //用户已关注时的扫码事件推送
                        $this->scan($param);
                    }
                    elseif ($this->_USERDATA['event'] == 'location') {
                        //上报地理位置事件，每次进入公众号会话时
                    }
                    elseif ($this->_USERDATA['event'] == 'view') {
                        //点击菜单跳转链接时的事件推送
                    }
                    elseif ($this->_USERDATA['event'] == 'click') {
                        //点击菜单拉取消息时的事件推送
                        $this->_USERDATA['event_key'] = $postObj->EventKey;
                        switch ($this->_USERDATA['event_key']) {
                            case 'V1001_FIRST':
                                $url = 'https://maoxy.com';
                                $return = array(
                                    'title' => '欢迎光临',
                                    'desc' => '点击查看~',
                                    'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                    'url' => $url
                                );
                                $this->returnNews($return);
                                break;
                            case 'V1002_SECOND':
                                //单图文消息
                                $url = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942415&idx=1&sn=f5b9a0a0adab47676e0e91cd71cd56b7#rd";
                                $return = array(
                                    'title' => '公司介绍',
                                    'desc' => '沪深通投资管理有限公司是一家集资产管理、投资管理、财富管理、股指期货等业务于一体的综合性现代服务行业',
                                    'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                    'url' => $url
                                );
                                $this->returnNews($return);
                                break;
                            case 'V1003_THIRD':
                                //单图文消息
                                $url = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942415&idx=1&sn=f5b9a0a0adab47676e0e91cd71cd56b7#rd";
                                $return = array(
                                    'title' => '平台公告',
                                    'desc' => '公告列表！点我~',
                                    'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                    'url' => $url
                                );
                                $this->returnNews($return);
                                break;
                            case 'V2001_JOINUS':
                                //多图文消息
                                $urlOne = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942587&idx=1&sn=b6c980edd0c9b621093a18104baae6df&scene=4#wechat_redirect";
                                $urlTwo = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942587&idx=2&sn=ce2453ea769c7af35d1313edad92210e&scene=4#wechat_redirect";
                                $urlThree = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942587&idx=3&sn=35cb2e0fc23bac3686792d801c332e3b&scene=4#wechat_redirect";
                                $urlFour = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942587&idx=4&sn=d412a0f8e32ee623b296ff5627b61ac7&scene=4#wechat_redirect";
                                $return = array(
                                    'a' => array(
                                        'title' => '沪深通公司简介',
                                        'desc' => '沪深通公司简介',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlOne
                                    ),
                                    'b' => array(
                                        'title' => '沪深通公司文化',
                                        'desc' => '沪深通公司文化',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlTwo
                                    ),
                                    'c' => array(
                                        'title' => '沪深通办公环境',
                                        'desc' => '沪深通办公环境',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlThree
                                    ),
                                    'd' => array(
                                        'title' => '加盟沪深通 携手财富盛宴',
                                        'desc' => '加盟沪深通 携手财富盛宴',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlFour
                                    )
                                );
                                $this->returnManyNews($return);
                                break;
                            case 'V2002_HUATONG':
                                //多图文消息
                                $urlOne = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942500&idx=1&sn=78e1fb051fbdf3a397693ffad3bfc512&scene=0#wechat_redirect";
                                $urlTwo = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942500&idx=2&sn=22d8f0d0e652afc3213d91f9bb4d2aac&scene=0#wechat_redirect";
                                $urlThree = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942500&idx=3&sn=2c52cecc782eca5f43dc3cf68623b887&scene=0#wechat_redirect";
                                $urlFour = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942500&idx=4&sn=ab9a0cda3a793c39d72f447443615dd3&scene=0#wechat_redirect";
                                $return = array(
                                    'a' => array(
                                        'title' => '白银"微交易" 重磅来袭',
                                        'desc' => '白银"微交易" 重磅来袭',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlOne
                                    ),
                                    'b' => array(
                                        'title' => '白银升贴水1000',
                                        'desc' => '白银升贴水1000',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlTwo
                                    ),
                                    'c' => array(
                                        'title' => '白银基差1000',
                                        'desc' => '白银基差1000',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlThree
                                    ),
                                    'd' => array(
                                        'title' => '华通白银(排期)',
                                        'desc' => '华通白银(排期)',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlFour
                                    )
                                );
                                $this->returnManyNews($return);
                                break;
                            case 'V2003_OPEN':
                                //单图文消息
                                $url = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942501&idx=1&sn=20765a9c3134d1b61e4ac4b0b31f6f74&scene=0#wechat_redirect";
                                $return = array(
                                    'title' => '开户流程',
                                    'desc' => '华通铂银开户流程介绍~',
                                    'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                    'url' => $url
                                );
                                $this->returnNews($return);
                                break;
                            case 'V3001_GUID':
                                //多图文消息
                                $urlOne = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942659&idx=1&sn=d9ee3213ca474c9a29fa8e94171e9e4e&scene=4#wechat_redirect";
                                $urlTwo = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942659&idx=2&sn=9a538e392cb4b3cdc3056668d3e35c4e&scene=4#wechat_redirect";
                                $urlThree = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942659&idx=3&sn=683500698b6e37d64da354d4e0b2c61a&scene=4#wechat_redirect";
                                $urlFour = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942659&idx=4&sn=43511a0cf3714747d015420f1e299491&scene=4#wechat_redirect";
                                $urlFive = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942659&idx=5&sn=a001f77b1536517c2feeb7f3e3836839&scene=4#wechat_redirect";
                                $urlSix = "http://mp.weixin.qq.com/s?__biz=MzAxNDE3NzAwNA==&mid=2451942659&idx=6&sn=ad995f8165f318a3c6f82b5bb337cbb8&scene=4#wechat_redirect";
                                $return = array(
                                    'a' => array(
                                        'title' => '新手操作指南',
                                        'desc' => '新手操作指南',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlOne
                                    ),
                                    'b' => array(
                                        'title' => '微信注册网络居间商',
                                        'desc' => '微信注册网络居间商',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlTwo
                                    ),
                                    'c' => array(
                                        'title' => '开户注册华通铂银',
                                        'desc' => '开户注册华通铂银',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlThree
                                    ),
                                    'd' => array(
                                        'title' => '绑定签约银行卡',
                                        'desc' => '绑定签约银行卡',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlFour
                                    ),
                                    'e' => array(
                                        'title' => 'PC端软件使用操作',
                                        'desc' => 'PC端软件使用操作',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlFive
                                    ),
                                    'f' => array(
                                        'title' => '手机端软件使用操作',
                                        'desc' => '手机端软件使用操作',
                                        'picurl' => 'https://share.voc.so/app/images/t77_thumb@2x.png',
                                        'url' => $urlSix
                                    )
                                );
                                $this->returnManyNews($return);
                                break;
                            default :
                                break;
                        }
                    }
                    elseif ($this->_USERDATA['event'] == 'templatesendjobfinish') {
                        //模版消息发送任务完成

                    }
                    break;
                case 'transfer_customer_service':
                    break;
                case 'image':
                    break;
                case 'link':
                    break;
                case 'voice':
                    break;
                case 'video':
                    break;
                case 'text':
                    $keyword = $postObj->Content;
                    if (strstr($keyword, "投诉") || strstr($keyword, "您好") || strstr($keyword, "你好") || strstr($keyword, "有人在吗") || strstr($keyword, "在吗") || strstr($keyword, "有人吗")){

                    }
                    break;
                case 'location':
                    $this->_USERDATA['Location_X'] = $postObj->Location_X;
                    $this->_USERDATA['Location_Y'] = $postObj->Location_Y;
                    $this->_USERDATA['Scale'] = $postObj->Scale;
                    $this->_USERDATA['Label'] = $postObj->Label;
                    break;
                default:
                    break;
            }
        } else {
            echo "";
            exit;
        }
    }

    /**
     * 微信接口验证...
     */
    private function checkSignature()
    {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

        $token = config('wxpay.token');
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr);
        $tmpStr = implode( $tmpArr );
        $tmpStr = sha1( $tmpStr );

        if( $tmpStr == $signature ){
            return true;
        }else{
            return false;
        }
    }


    /**
     * 微信返回文本信息...
     */
    private function returnTxt($string) {
        $textTpl = "<xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[%s]]></MsgType>
                    <Content><![CDATA[%s]]></Content>
                    <FuncFlag>0</FuncFlag>
                    </xml>";
        $msgType = "text";
        $contentStr = $string;
        $resultStr = sprintf($textTpl, $this->_USERDATA['fromusername'], $this->_USERDATA['tousername'], time(), $msgType, $contentStr);
        echo $resultStr;
        exit;
    }

    /**
     * 微信图片信息...
     */
    private function returnImage($media_id) {
        $textTpl = "<xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[%s]]></MsgType>
                    <MediaId ><![CDATA[%s]]></MediaId >
                    <FuncFlag>0</FuncFlag>
                    </xml>";
        $msgType = "image";
        $contentStr = $media_id;
        $resultStr = sprintf($textTpl, $this->_USERDATA['fromusername'], $this->_USERDATA['tousername'], time(), $msgType, $contentStr);
        echo $resultStr;
        exit;
    }

    /**
     * 微信返回图文信息...
     */
    private function returnNews($array) {
        if (!empty($array) && $array!= null) {
            $str = '';
            $title = $array['title'];
            $desc = $array['desc'];
            $picurl = $array['picurl'];
            $url = $array['url'];
            $str .= "<item>
                     <Title><![CDATA[".$title."]]></Title>
                     <Description><![CDATA[".$desc."]]></Description>
                     <PicUrl><![CDATA[".$picurl."]]></PicUrl>
                     <Url><![CDATA[".$url."]]></Url>
                     </item>";
        } else {
            exit;
        }

        $textTpl = " <xml>
                    <ToUserName><![CDATA[" . $this->_USERDATA['fromusername'] . "]]></ToUserName>
                    <FromUserName><![CDATA[" . $this->_USERDATA['tousername'] . "]]></FromUserName>
                    <CreateTime>" . time() . "</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>

                    <ArticleCount>1</ArticleCount>

                    <Articles>

                            " . $str . "

                    </Articles>
                    </xml> ";
        echo $textTpl;
        exit;
    }

    /**
     * 微信返回多图文信息...
     */
    private function returnManyNews($array) {
        $count = 0;
        if (!empty($array) && $array!= null) {
            $str = '';
            foreach($array as $item){
                $title = $item['title'];
                $desc = $item['desc'];
                $picurl = $item['picurl'];
                $url = $item['url'];
                $str .= "<item>
	                     <Title><![CDATA[".$title."]]></Title>
	                     <Description><![CDATA[".$desc."]]></Description>
	                     <PicUrl><![CDATA[".$picurl."]]></PicUrl>
	                     <Url><![CDATA[".$url."]]></Url>
	                     </item>";
            }
            $count = count($array);
        } else {
            exit;
        }

        $textTpl = " <xml>
                    <ToUserName><![CDATA[" . $this->_USERDATA['fromusername'] . "]]></ToUserName>
                    <FromUserName><![CDATA[" . $this->_USERDATA['tousername'] . "]]></FromUserName>
                    <CreateTime>" . time() . "</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>

                    <ArticleCount>" . $count . "</ArticleCount>

                    <Articles>

                            " . $str . "

                    </Articles>
                    </xml> ";
        echo $textTpl;
        exit;
    }

    private function scan($param){

    }

    private function subscribe($param){
        $json = '{"content":"欢迎您！\n这里是阿猫阿狗大家庭"}';
        $json = json_decode($json, true);
        $this->returnTxt($json['content']);
    }

    private function unsubscribe($param){

    }
}
