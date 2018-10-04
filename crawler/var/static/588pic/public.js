// 滑块拖动
var Login = {
    /**
     * @desc 纯手机注册登录框显示
     */
    phoneRegister: function () {
        $(".down-limit").hide();
        $("#user-register").parent().show();    //注册框显示
    },
    phoneLogin: function () {
        $(".down-limit").hide();
        $("#user-login").parent().find(".qq-wechatLogin").show();
        $("#user-login").parent().find(".phone-loginbox").hide();
        $("#user-login").parent().show();       //手机登录框显示
        current_step=0;                         //手机纯登录操作
    },
    phoneSingleLogin: function () {                         //纯手机登录
        $(".down-limit").hide();
        $("#user-login").parent().find(".qq-wechatLogin").hide();
        $("#user-login").parent().find(".phone-loginbox").show();
        $("#user-login").parent().find(".phone-loginbox").find("input").val(' ');
        $("#user-login").parent().find(".phone-loginbox").find(".login-btn").removeClass("on");
        $("#user-login").parent().find(".phone-loginbox").find(".send-code").html('点击发送');
        $("#user-login").parent().show();               //手机登录框显示
    },
    userBindPhone: function () {
        $(".down-limit").hide();
        $("#user-bind").parent().find(".qq-wechatLogin").hide();
        $("#user-bind").parent().find(".phone-loginbox").show();
        $("#user-bind").parent().find(".phone-loginbox").find("input").val(' ');
        $("#user-bind").parent().find(".phone-loginbox").find(".login-btn").removeClass("on");
        $("#user-bind").parent().find(".phone-loginbox").find(".send-code").html('点击发送');
        $("#user-bind").parent().show();            //新用户绑定手机号
        current_step=1;                             //新用户绑定手机号
    }
}
/*手机登陆js*/
var phone_test=[];      //手机号码验证
phone_test[0]=0;        //纯手机登录
phone_test[1]=0;        //纯手机绑定

var phone_send=[];          //手机发送次数
phone_send[0]=0;        //纯手机登录
phone_send[1]=0;        //纯手机绑定手机

var current_step = 0;       //目前处在的步骤
var is_send = true;         //是否可以发送短信
var send_message_num = 0;   //发送短信的次数

//瀑布流js
(function(e,t,n){"use strict";var r=t.event,i;r.special.smartresize={setup:function(){t(this).bind("resize",r.special.smartresize.handler)},teardown:function(){t(this).unbind("resize",r.special.smartresize.handler)},handler:function(e,t){var n=this,s=arguments;e.type="smartresize",i&&clearTimeout(i),i=setTimeout(function(){r.dispatch.apply(n,s)},t==="execAsap"?0:100)}},t.fn.smartresize=function(e){return e?this.bind("smartresize",e):this.trigger("smartresize",["execAsap"])},t.Mason=function(e,n){this.element=t(n),this._create(e),this._init()},t.Mason.settings={isResizable:!0,isAnimated:!1,animationOptions:{queue:!1,duration:500},gutterWidth:0,isRTL:!1,isFitWidth:!1,containerStyle:{position:"relative"}},t.Mason.prototype={_filterFindBricks:function(e){var t=this.options.itemSelector;return t?e.filter(t).add(e.find(t)):e},_getBricks:function(e){var t=this._filterFindBricks(e).css({position:"absolute"}).addClass("masonry-brick");return t},_create:function(n){this.options=t.extend(!0,{},t.Mason.settings,n),this.styleQueue=[];var r=this.element[0].style;this.originalStyle={height:r.height||""};var i=this.options.containerStyle;for(var s in i)this.originalStyle[s]=r[s]||"";this.element.css(i),this.horizontalDirection=this.options.isRTL?"right":"left";var o=this.element.css("padding-"+this.horizontalDirection),u=this.element.css("padding-top");this.offset={x:o?parseInt(o,10):0,y:u?parseInt(u,10):0},this.isFluid=this.options.columnWidth&&typeof this.options.columnWidth=="function";var a=this;setTimeout(function(){a.element.addClass("masonry")},0),this.options.isResizable&&t(e).bind("smartresize.masonry",function(){a.resize()}),this.reloadItems()},_init:function(e){this._getColumns(),this._reLayout(e)},option:function(e,n){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))},layout:function(e,t){for(var n=0,r=e.length;n<r;n++)this._placeBrick(e[n]);var i={};i.height=Math.max.apply(Math,this.colYs);if(this.options.isFitWidth){var s=0;n=this.cols;while(--n){if(this.colYs[n]!==0)break;s++}i.width=(this.cols-s)*this.columnWidth-this.options.gutterWidth}this.styleQueue.push({$el:this.element,style:i});var o=this.isLaidOut?this.options.isAnimated?"animate":"css":"css",u=this.options.animationOptions,a;for(n=0,r=this.styleQueue.length;n<r;n++)a=this.styleQueue[n],a.$el[o](a.style,u);this.styleQueue=[],t&&t.call(e),this.isLaidOut=!0},_getColumns:function(){var e=this.options.isFitWidth?this.element.parent():this.element,t=e.width();this.columnWidth=this.isFluid?this.options.columnWidth(t):this.options.columnWidth||this.$bricks.outerWidth(!0)||t,this.columnWidth+=this.options.gutterWidth,this.cols=Math.floor((t+this.options.gutterWidth)/this.columnWidth),this.cols=Math.max(this.cols,1)},_placeBrick:function(e){var n=t(e),r,i,s,o,u;r=Math.ceil(n.outerWidth(!0)/this.columnWidth),r=Math.min(r,this.cols);if(r===1)s=this.colYs;else{i=this.cols+1-r,s=[];for(u=0;u<i;u++)o=this.colYs.slice(u,u+r),s[u]=Math.max.apply(Math,o)}var a=Math.min.apply(Math,s),f=0;for(var l=0,c=s.length;l<c;l++)if(s[l]===a){f=l;break}var h={top:a+this.offset.y};h[this.horizontalDirection]=this.columnWidth*f+this.offset.x,this.styleQueue.push({$el:n,style:h});var p=a+n.outerHeight(!0),d=this.cols+1-c;for(l=0;l<d;l++)this.colYs[f+l]=p},resize:function(){var e=this.cols;this._getColumns(),(this.isFluid||this.cols!==e)&&this._reLayout()},_reLayout:function(e){var t=this.cols;this.colYs=[];while(t--)this.colYs.push(0);this.layout(this.$bricks,e)},reloadItems:function(){this.$bricks=this._getBricks(this.element.children())},reload:function(e){this.reloadItems(),this._init(e)},appended:function(e,t,n){if(t){this._filterFindBricks(e).css({top:this.element.height()});var r=this;setTimeout(function(){r._appended(e,n)},1)}else this._appended(e,n)},_appended:function(e,t){var n=this._getBricks(e);this.$bricks=this.$bricks.add(n),this.layout(n,t)},remove:function(e){this.$bricks=this.$bricks.not(e),e.remove()},destroy:function(){this.$bricks.removeClass("masonry-brick").each(function(){this.style.position="",this.style.top="",this.style.left=""});var n=this.element[0].style;for(var r in this.originalStyle)n[r]=this.originalStyle[r];this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"),t(e).unbind(".masonry")}},t.fn.imagesLoaded=function(e){function u(){e.call(n,r)}function a(e){var n=e.target;n.src!==s&&t.inArray(n,o)===-1&&(o.push(n),--i<=0&&(setTimeout(u),r.unbind(".imagesLoaded",a)))}var n=this,r=n.find("img").add(n.filter("img")),i=r.length,s="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",o=[];return i||u(),r.bind("load.imagesLoaded error.imagesLoaded",a).each(function(){var e=this.src;this.src=s,this.src=e}),n};var s=function(t){e.console&&e.console.error(t)};t.fn.masonry=function(e){if(typeof e=="string"){var n=Array.prototype.slice.call(arguments,1);this.each(function(){var r=t.data(this,"masonry");if(!r){s("cannot call methods on masonry prior to initialization; attempted to call method '"+e+"'");return}if(!t.isFunction(r[e])||e.charAt(0)==="_"){s("no such method '"+e+"' for masonry instance");return}r[e].apply(r,n)})}else this.each(function(){var n=t.data(this,"masonry");n?(n.option(e||{}),n._init()):t.data(this,"masonry",new t.Mason(e,this))});return this}})(window,jQuery);/**********jquery.masonry.min.js end*************/
$("#element").masonry({

    itemSelector:".flow-box",

    singleMode:true,

    isAnimated: true,

    resizeable: true,
    //cloumnWidth:1
    //gutterWidth:1,

});
$(".home-flow").masonry({

    itemSelector:".heart-flow-box",

    singleMode:true,

    isAnimated: true,

    resizeable: true,
    //cloumnWidth:1
    //gutterWidth:1,

});

/*!
 * SuperSlide v2.1.1
 */

!function(a){a.fn.slide=function(b){return a.fn.slide.defaults={type:"slide",effect:"fade",autoPlay:!1,delayTime:500,interTime:2500,triggerTime:150,defaultIndex:0,titCell:".hd li",mainCell:".bd",targetCell:null,trigger:"mouseover",scroll:1,vis:1,titOnClassName:"on",autoPage:!1,prevCell:".prev",nextCell:".next",pageStateCell:".pageState",opp:!1,pnLoop:!0,easing:"swing",startFun:null,endFun:null,switchLoad:null,playStateCell:".playState",mouseOverStop:!0,defaultPlay:!0,returnDefault:!1},this.each(function(){var c=a.extend({},a.fn.slide.defaults,b),d=a(this),e=c.effect,f=a(c.prevCell,d),g=a(c.nextCell,d),h=a(c.pageStateCell,d),i=a(c.playStateCell,d),j=a(c.titCell,d),k=j.size(),l=a(c.mainCell,d),m=l.children().size(),n=c.switchLoad,o=a(c.targetCell,d),p=parseInt(c.defaultIndex),q=parseInt(c.delayTime),r=parseInt(c.interTime);parseInt(c.triggerTime);var Q,t=parseInt(c.scroll),u=parseInt(c.vis),v="false"==c.autoPlay||0==c.autoPlay?!1:!0,w="false"==c.opp||0==c.opp?!1:!0,x="false"==c.autoPage||0==c.autoPage?!1:!0,y="false"==c.pnLoop||0==c.pnLoop?!1:!0,z="false"==c.mouseOverStop||0==c.mouseOverStop?!1:!0,A="false"==c.defaultPlay||0==c.defaultPlay?!1:!0,B="false"==c.returnDefault||0==c.returnDefault?!1:!0,C=0,D=0,E=0,F=0,G=c.easing,H=null,I=null,J=null,K=c.titOnClassName,L=j.index(d.find("."+K)),M=p=-1==L?p:L,N=p,O=p,P=m>=u?0!=m%t?m%t:t:0,R="leftMarquee"==e||"topMarquee"==e?!0:!1,S=function(){a.isFunction(c.startFun)&&c.startFun(p,k,d,a(c.titCell,d),l,o,f,g)},T=function(){a.isFunction(c.endFun)&&c.endFun(p,k,d,a(c.titCell,d),l,o,f,g)},U=function(){j.removeClass(K),A&&j.eq(N).addClass(K)};if("menu"==c.type)return A&&j.removeClass(K).eq(p).addClass(K),j.hover(function(){Q=a(this).find(c.targetCell);var b=j.index(a(this));I=setTimeout(function(){switch(p=b,j.removeClass(K).eq(p).addClass(K),S(),e){case"fade":Q.stop(!0,!0).animate({opacity:"show"},q,G,T);break;case"slideDown":Q.stop(!0,!0).animate({height:"show"},q,G,T)}},c.triggerTime)},function(){switch(clearTimeout(I),e){case"fade":Q.animate({opacity:"hide"},q,G);break;case"slideDown":Q.animate({height:"hide"},q,G)}}),B&&d.hover(function(){clearTimeout(J)},function(){J=setTimeout(U,q)}),void 0;if(0==k&&(k=m),R&&(k=2),x){if(m>=u)if("leftLoop"==e||"topLoop"==e)k=0!=m%t?(0^m/t)+1:m/t;else{var V=m-u;k=1+parseInt(0!=V%t?V/t+1:V/t),0>=k&&(k=1)}else k=1;j.html("");var W="";if(1==c.autoPage||"true"==c.autoPage)for(var X=0;k>X;X++)W+="<li>"+(X+1)+"</li>";else for(var X=0;k>X;X++)W+=c.autoPage.replace("$",X+1);j.html(W);var j=j.children()}if(m>=u){l.children().each(function(){a(this).width()>E&&(E=a(this).width(),D=a(this).outerWidth(!0)),a(this).height()>F&&(F=a(this).height(),C=a(this).outerHeight(!0))});var Y=l.children(),Z=function(){for(var a=0;u>a;a++)Y.eq(a).clone().addClass("clone").appendTo(l);for(var a=0;P>a;a++)Y.eq(m-a-1).clone().addClass("clone").prependTo(l)};switch(e){case"fold":l.css({position:"relative",width:D,height:C}).children().css({position:"absolute",width:E,left:0,top:0,display:"none"});break;case"top":l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+u*C+'px"></div>').css({top:-(p*t)*C,position:"relative",padding:"0",margin:"0"}).children().css({height:F});break;case"left":l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+u*D+'px"></div>').css({width:m*D,left:-(p*t)*D,position:"relative",overflow:"hidden",padding:"0",margin:"0"}).children().css({"float":"left",width:E});break;case"leftLoop":case"leftMarquee":Z(),l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+u*D+'px"></div>').css({width:(m+u+P)*D,position:"relative",overflow:"hidden",padding:"0",margin:"0",left:-(P+p*t)*D}).children().css({"float":"left",width:E});break;case"topLoop":case"topMarquee":Z(),l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+u*C+'px"></div>').css({height:(m+u+P)*C,position:"relative",padding:"0",margin:"0",top:-(P+p*t)*C}).children().css({height:F})}}var $=function(a){var b=a*t;return a==k?b=m:-1==a&&0!=m%t&&(b=-m%t),b},_=function(b){var c=function(c){for(var d=c;u+c>d;d++)b.eq(d).find("img["+n+"]").each(function(){var b=a(this);if(b.attr("src",b.attr(n)).removeAttr(n),l.find(".clone")[0])for(var c=l.children(),d=0;d<c.size();d++)c.eq(d).find("img["+n+"]").each(function(){a(this).attr(n)==b.attr("src")&&a(this).attr("src",a(this).attr(n)).removeAttr(n)})})};switch(e){case"fade":case"fold":case"top":case"left":case"slideDown":c(p*t);break;case"leftLoop":case"topLoop":c(P+$(O));break;case"leftMarquee":case"topMarquee":var d="leftMarquee"==e?l.css("left").replace("px",""):l.css("top").replace("px",""),f="leftMarquee"==e?D:C,g=P;if(0!=d%f){var h=Math.abs(0^d/f);g=1==p?P+h:P+h-1}c(g)}},ab=function(a){if(!A||M!=p||a||R){if(R?p>=1?p=1:0>=p&&(p=0):(O=p,p>=k?p=0:0>p&&(p=k-1)),S(),null!=n&&_(l.children()),o[0]&&(Q=o.eq(p),null!=n&&_(o),"slideDown"==e?(o.not(Q).stop(!0,!0).slideUp(q),Q.slideDown(q,G,function(){l[0]||T()})):(o.not(Q).stop(!0,!0).hide(),Q.animate({opacity:"show"},q,function(){l[0]||T()}))),m>=u)switch(e){case"fade":l.children().stop(!0,!0).eq(p).animate({opacity:"show"},q,G,function(){T()}).siblings().hide();break;case"fold":l.children().stop(!0,!0).eq(p).animate({opacity:"show"},q,G,function(){T()}).siblings().animate({opacity:"hide"},q,G);break;case"top":l.stop(!0,!1).animate({top:-p*t*C},q,G,function(){T()});break;case"left":l.stop(!0,!1).animate({left:-p*t*D},q,G,function(){T()});break;case"leftLoop":var b=O;l.stop(!0,!0).animate({left:-($(O)+P)*D},q,G,function(){-1>=b?l.css("left",-(P+(k-1)*t)*D):b>=k&&l.css("left",-P*D),T()});break;case"topLoop":var b=O;l.stop(!0,!0).animate({top:-($(O)+P)*C},q,G,function(){-1>=b?l.css("top",-(P+(k-1)*t)*C):b>=k&&l.css("top",-P*C),T()});break;case"leftMarquee":var c=l.css("left").replace("px","");0==p?l.animate({left:++c},0,function(){l.css("left").replace("px","")>=0&&l.css("left",-m*D)}):l.animate({left:--c},0,function(){l.css("left").replace("px","")<=-(m+P)*D&&l.css("left",-P*D)});break;case"topMarquee":var d=l.css("top").replace("px","");0==p?l.animate({top:++d},0,function(){l.css("top").replace("px","")>=0&&l.css("top",-m*C)}):l.animate({top:--d},0,function(){l.css("top").replace("px","")<=-(m+P)*C&&l.css("top",-P*C)})}j.removeClass(K).eq(p).addClass(K),M=p,y||(g.removeClass("nextStop"),f.removeClass("prevStop"),0==p&&f.addClass("prevStop"),p==k-1&&g.addClass("nextStop")),h.html("<span>"+(p+1)+"</span>/"+k)}};A&&ab(!0),B&&d.hover(function(){clearTimeout(J)},function(){J=setTimeout(function(){p=N,A?ab():"slideDown"==e?Q.slideUp(q,U):Q.animate({opacity:"hide"},q,U),M=p},300)});var bb=function(a){H=setInterval(function(){w?p--:p++,ab()},a?a:r)},cb=function(a){H=setInterval(ab,a?a:r)},db=function(){z||(clearInterval(H),bb())},eb=function(){(y||p!=k-1)&&(p++,ab(),R||db())},fb=function(){(y||0!=p)&&(p--,ab(),R||db())},gb=function(){clearInterval(H),R?cb():bb(),i.removeClass("pauseState")},hb=function(){clearInterval(H),i.addClass("pauseState")};if(v?R?(w?p--:p++,cb(),z&&l.hover(hb,gb)):(bb(),z&&d.hover(hb,gb)):(R&&(w?p--:p++),i.addClass("pauseState")),i.click(function(){i.hasClass("pauseState")?gb():hb()}),"mouseover"==c.trigger?j.hover(function(){var a=j.index(this);I=setTimeout(function(){p=a,ab(),db()},c.triggerTime)},function(){clearTimeout(I)}):j.click(function(){p=j.index(this),ab(),db()}),R){if(g.mousedown(eb),f.mousedown(fb),y){var ib,jb=function(){ib=setTimeout(function(){clearInterval(H),cb(0^r/10)},150)},kb=function(){clearTimeout(ib),clearInterval(H),cb()};g.mousedown(jb),g.mouseup(kb),f.mousedown(jb),f.mouseup(kb)}"mouseover"==c.trigger&&(g.hover(eb,function(){}),f.hover(fb,function(){}))}else g.click(eb),f.click(fb)})}}(jQuery),jQuery.easing.jswing=jQuery.easing.swing,jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b+c:d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b+c:-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return 0==b?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){return 0==b?c:b==e?c+d:(b/=e/2)<1?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){return(b/=e/2)<1?-d/2*(Math.sqrt(1-b*b)-1)+c:d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(1==(b/=e))return c+d;if(g||(g=.3*e),h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(1==(b/=e))return c+d;if(g||(g=.3*e),h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(2==(b/=e/2))return c+d;if(g||(g=e*.3*1.5),h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return 1>b?-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c:.5*h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),(b/=e/2)<1?d/2*b*b*(((f*=1.525)+1)*b-f)+c:d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){return(b/=e)<1/2.75?d*7.5625*b*b+c:2/2.75>b?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:2.5/2.75>b?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c},easeInOutBounce:function(a,b,c,d,e){return e/2>b?.5*jQuery.easing.easeInBounce(a,2*b,0,d,e)+c:.5*jQuery.easing.easeOutBounce(a,2*b-e,0,d,e)+.5*d+c}});


/*延迟加载*/
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            placeholder     : "//static.588ku.com/imgPath/public/images/lz.gif"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
            settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
            !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);


/*基础公共js*/


/***********************************************/
function qqLogin(sign){
    window.open("//588ku.com/index.php?m=login&a=snsLogin&type=qq&source=" + sign,"","width=750, height=500, top=50, left=50");
}

/*弹出qq微信*/
function qqweixin(){

    // $("#gai").show();
    // $("#login").show();
    Login.phoneLogin();
}

/*公共异步加载*/


/*消息相关js*/
function newsRead(newsId){
    $.ajax({
        url:'//ajax.588ku.com/?m=ajax&a=newsRead',
        data:{newsId:newsId},
        dataType:'jsonp',
        xhrFields:{widthCredentials:true},
        success:function(data){
        }
    })
}
/*原创商用点击框点击次数js*/
function ycCollect(classtype,style){
    $.ajax({
        url:'//ajax.588ku.com/?m=ajax&a=ycCollect',
        data:{classtype:classtype,style:style},
        dataType:'jsonp',
        xhrFields:{widthCredentials:true},
        success:function(data){
        }
    })
}
$(".action-wrap").hover(function(){
        $.ajax({
            url:"//ajax.588ku.com/?m=news",
            dataType:'jsonp',
            jsonp:'callback',
            jsonpCallback:'getName',
            xhrFields:{withCredentials:true},
            success:function(data){
                $('.action-wrap .newsList').remove();
                for(i=0;i<data.length;i++){
                    if(data[i]['is_read'] == 1){
                        var li =  '<li class="list newsList"><a href="'+data[i]['url']+'" onclick="newsRead('+data[i]['id']+');$(this).children('+"'em'"+').remove();" target="_blank"><em class="news-circle"></em>'+data[i]['title']+'</a></li>'
                        $('.news-drop-icon').after(li);
                    }else{
                        var li =  '<li class="list newsList"><a class="isRead" href="'+data[i]['url']+'" onclick="newsRead('+data[i]['id']+')" target="_blank">'+data[i]['title']+'</a></li>'
                        $('.news-drop-icon').after(li);
                    }
                }
            }
        });
        $('.news-drop').show();
    },
    function(){
        $('.news-drop').hide();
    });

/*设计师调查js*/
$(".questionnaire-wd .next-ask").click(function(){
    $(this).parent().parent().hide();
    $.ajax({
        url:'//ajax.588ku.com/?m=ajax&a=question',
        dataType:'json',
        xhrFields:{withCredentials:true},
        success:function(data){
        }
    })
})
$(".questionnaire-wd .go-action").click(function(){
    $.ajax({
        url:'//ajax.588ku.com/?m=ajax&a=questionAdd',
        dataType:'json',
        xhrFields:{withCredentials:true},
        success:function(data){
        }
    })
})

//底部轮播js
$(document).ready(function(){
    $.ajax({
        url : '//588ku.com/?m=PartControl&a=getBarrageData',
        dataType:'json',
        success:function(data){
            if (data.status == 1 && data.data != null) {
                str = '';
                var dataList = data.data;
                for (var i = dataList.length - 1; i >= 0; i--) {
                    str += '<li class="clearfix"><a class="userHead-icon fl" href = "'+dataList[i].link+'" ><img src="'+dataList[i].thumb+'" width="48" height="48" /></a><div class="userContent fl"> <a href="'+dataList[i].link+'"><span class="user-name">'+dataList[i].username+'</span>'+dataList[i].text+'</a><em class="close-btn"></em></div></li>';
                }
                $('#barrage ul').html(str);
                var leftW = 0;

                jQuery.fn.extend({
                    pic_scroll: function() {
                        $(this).each(function() {
                            var _this = $(this); //存储对象
                            var ul = _this.find("ul"); //获取ul对象
                            var li = ul.find("li"); //获取所有图片所有的li
                            var w = li.size() * (li.width()+224); //统计图片的长度
                            li.clone().prependTo(ul); //克隆图片一份放入ul里
                            ul.width(4 * w); //设置ul的长度，使所有图片排成一排
                            var i = 1;
                            $("#barrage li").on("mouseout",function() {
                                i=1;
                            });
                            $("#barrage li").on("mouseover",function() {
                                i=0;
                            });


                            setInterval(function() {
                                if(1 == i){
                                    leftW -= 2;
                                    if(leftW > -w){
                                        _this.css('left', leftW + 'px');
                                    } else {
                                        leftW = 0;
                                        _this.css('left', '0px');
                                    }
                                }
                            }, 20);
                        })
                    }
                });
                $('#barrage').pic_scroll();
                $("#barrage").find('li').find('.close-btn').click(function () {
                    $(this).parent().parent().parent().parent().remove();
                    $.ajax({
                        url:'//588ku.com/?m=index&a=indextest',
                        dataType:'json',
                        success:function(data){}
                    })
                })
            }
        }
    })
})

/**
 *红包弹出关闭JS
 */
$('.hb_close').on('click',function(){
    $('.down-limit').hide();
});
$('.hb_kk').on('click',function(){
    $('.down-limit').hide();
});

function baiduTongji(){
    _hmt.push(['_trackEvent', 'nav', 'click', 'literature']);
}

/**
 * 检查字符串是否为合法QQ号码
 * @param {String} 字符串
 * @return {bool} 是否为合法QQ号码
 */
function isQQ(aQQ) {
    var bValidate = RegExp(/^[1-9][0-9]{4,9}$/).test(aQQ);
    if (bValidate) {
        return true;
    }
    else
        return false;
}

$(document).ready(function(){
    // $.get('//ajax.588ku.com/?m=ajaxUserTime&a=ajaxTimer');
    // $.ajax({
    //     url:'//ajax.588ku.com/?m=ajaxUserTime&a=ajaxTimers',
    //     data:"",
    //     async:true,
    // });

    $.ajax({
        url:'//ajax.588ku.com/?m=ajaxUserTime&a=ajaxTimers',
        dataType:'json',
        // jsonp:'callback',
        // jsonpCallback:'getName',
        xhrFields:{withCredentials:true},
        success:function(data){
            if(data.status == 1){
                $('.questionnaire-wd').closest('.down-limit').show();
            }
        }
    })
    // $.getJSON(
    //     "//ajax.588ku.com/index.php?m=ajax&a=page_cost&exec_time=" + c + "&tp_cost_time=" + tp_cost_time + "&type=" + b + "&callback=?",
    //     function(e) {}
    // );
//  var timestamp = new Date().getTime();
//  var timestamp = parseInt(timestamp/1000);
//  $.post('//ajax.588ku.com/?m=ajaxUserTime&a=ajaxTimer',{time:timestamp},function(data){
//  });
});


$('.header-detail-wrap').hover(function(){
    $(".header-detail-wrap #download-action").stop().slideDown(100);
},function(){
    $(".header-detail-wrap #download-action").stop().slideUp(300);
});
// $(".down-limit-content").css({
//     left: ($(window).width() - 611) / 2 + "px",
//     top: ($(window).height() - 414) / 2 + "px"
// });
$('.down-limit-close-btn').bind('click',function(){
    $('.down-limit').hide();
})

function vip(type,stype){
    if (!stype) stype = 0;
    $.ajax({
        url:'/index.php?m=ajaxone&a=vipClick',
        data:"type="+type+"&stype="+stype,
        async:false,
        success:function(){
        }
    });
}

function headVip(){
    $.ajax({
        url:'/index.php?m=ajaxone&a=headVip',
        async:false,
        success:function(){
        }
    });
}

//企业VIP点击次数
$(function(){
    $(".companytotal").click(function(){

        $.ajax({
            url:'/index.php?m=ajaxone&a=companytotalclick',
            async:false,
            success:function(){
            }
        });
    })
})



function picfind(type){
    $.ajax({
        url:'/index.php?m=ajax&a=picFindClick',
        data:"type="+type,
        async:false,
        success:function(){
        }
    });
}

$(function(){
    /*全站img 屏蔽*/
    $('img').bind("contextmenu", function(e){ return false; });

    /*login-limit*/
    $(".login-limit-content-b-sure").bind('click',function(){
        $.ajax({url:'/index.php?m=login&a=relogin',dataType:'json',type:'get'})
            .success(function(data){
                if (data.status == 0) {
                    $("#login-limit-pane").closest('.down-limit').hide();
                } else{
                    $("#login-limit-pane").closest('.down-limit').hide();
                }
            })
            .fail(function(data){

            })
    });
    if (typeof login_limit_status !='undefined' && login_limit_status) {
        $("#login-limit-pane").closest('.down-limit').show();
    }
    /*关掉收藏网站提示*/
    $('.coll-net-close').bind('click',function(){
        $('.coll-net-close').closest('.down-limit').hide();
        $.ajax({
            url:'//ajax.588ku.com/?m=ajax&a=collNetClose',
            dataType:'jsonp',
            xhrFields: {withCredentials: true},
            success:function(data){
            }
        })
    })

    //头部个人信息下拉框
    $('.user-info').hover(function(){
        $('.user-info .user-drop').stop().slideDown(100);
    },function(){
        $('.user-info .user-drop').stop().slideUp(300);
    });

    //加入vip条悬挂
    $(window).scroll(function() {
        var scrollTop = $(document).scrollTop();
        if(scrollTop>335) {
            $(".top-nav").addClass("vip-fixed");
        }
        else {
            $(".top-nav").removeClass("vip-fixed");
        }
    })

    //搜索框中的热门搜索展开与隐藏
    $('.hot-more').click(function(){
        $(this).parents('.hot-search').siblings().toggle();
    })

    //首页小图片列表奇数右浮动
    $('.small-pic-box .pic-list:odd').css('float','right');

    //关闭弹出框
    $(".switch,.off,.orange").click(function(){
        $('.down-limit').fadeOut(500);
    });

    //搜索切换关键词
    $(".search-left").on('mouseenter', function(){
        $('.select-list').show();

    });

    //收索下拉开始
    $(".search-left").on('mouseleave', function(){
        $('.select-list').hide();
    });
    $("body").on("click", function(e){
        if(!$(e.target).hasClass('select-list')&&!$(e.target).hasClass('current-select')&&!$(e.target).hasClass('btn-select-search')) {
            $('.select-list').slideUp(100);
        }
    });
    $(".select-list a").on('click', function(){
        var title = $(this).attr('data-title');
        var num = $(this).attr('data-num');
        var text = $(this).attr('data-text');
        var index = $(this).attr('data-index');
        $('.current-select').html(title);
        $('.current-select').attr('data-index',index);
        $('#mask-topkeyword .num').html(num);
        $('#mask-topkeyword .text').html(text);
        $(".select-list a.active").removeClass('active');
        $(this).addClass('active');
    });
    //搜索下拉结束


    /*新弹窗验证*/
    $("#inspect .inspect-cont").find('.list').on('click',function(){
        if($(this).hasClass('on')){
            $(this).removeClass("on")
            $(this).find('input').val('');

        }else{
            $(this).addClass('on');
            if ($(this).find('input').attr('id') != 'designer_F') {
                $(this).find('input').val(1);
            }
            //变成单选
            $(this).siblings().removeClass('on');
            $(this).siblings().find('input').val('');
        }
    });
    $('#inspect .cont-close,#inspect .sc-close').on('click',function(){
        $("#inspect").fadeOut();
    });
    $('#inspect .sureBtn').on('click',function(){
        //复选框检测
        var chk_value =[];
        var designer = '';
        $(".list").find("input").each(function () {
            if ($(this).val() != '') {
                chk_value.push($(this).attr('datasort'));
            }
        });
        if (chk_value.length <= 0 || (chk_value == 'F' && $('#designer_F').val() == '')) {
            alert('职业未选择!');
            return false;
        }
        designer = chk_value.join(',');
        //qq检测
        var qq = $('#inspect_qq').val();
        qq = qq.replace(/\s+/g, "");
        if (qq.length <= 0) {
            alert('QQ号码未填写!');
            return false;
        }
        if (!isQQ(qq)) {
            alert('QQ号码错误!');
            return false;
        }
        describe = $('#designer_F').val();

        $.ajax({
            url:'//588ku.com/index.php?m=ajax&a=survey',
            type:'post',
            dataType:'json',
            data:{designer:designer,qq:qq,describe:describe}
        })
            .success(function(data){
                if (data.status == 0) {
                    $(".cm-form").css('display','none');
                    $(".cont-top").css('display','none');
                    $('.cm-succ').css('display','block');
                }
            })
            .fail(function(data){

            });
    });
    // $(function() {
    //     $(".scClose,.scOK-close").click(function() {
    //         $(".survey").fadeOut()
    //     })

    //     $(".scDcitem").click(function() {

    //         if($(this).find("i").hasClass('checked')) {
    //             $(this).find("i").removeClass('checked')
    //             $(this).css({
    //                 border: "1px solid #d4d4d4",
    //                 margin: "0px 10px 10px 0px"
    //             })
    //         } else {
    //             $(this).find("i").addClass("checked");
    //             $(this).css({
    //                 border: "2px solid #169dea",
    //                 margin: "-1px 9px 9px -1px"
    //             })
    //         }
    //     });


    //     $("#scSub").bind('click',function(){

    //         //复选框检测
    //         var chk_value =[];
    //         var designer = '';
    //         $('.scDcitem i[class="checked"]').each(function(){
    //             chk_value.push($(this).next().val());
    //         });

    //         if (chk_value.length <= 0) {
    //             $(".scdesigner .scNotice").show();
    //             //setTimeout('$(".diaocha-designer-title .notice").hide();',2000);
    //             return false;
    //         }else{
    //             $(".scdesigner .scNotice").hide();
    //         }
    //         designer = chk_value.join(',');

    //         var describe = $('.otherInput').val();

    //         //qq检测
    //         var qq = $('.diaocha-qq').val();
    //         qq = qq.replace(/\s+/g, "");
    //         if (qq.length <= 0) {
    //             $(".screla .scNotice").show();
    //             //setTimeout('$(".diaocha-qq-title .notice").hide();',2000);
    //             return false;
    //         }
    //         if (!isQQ(qq)) {
    //             $(".screla .scNotice").text('qq格式不正确').show();
    //             //setTimeout('$(".diaocha-qq-title .notice").hide();',2000);
    //             return false;
    //         }

    //         $.ajax({url:'//588ku.com/index.php?m=ajax&a=survey',type:'post',dataType:'json',data:{designer:designer,qq:qq,describe:describe}})
    //             .success(function(data){

    //                 if (data.status == 0) {
    //                     // $(".diaocha-content-item").hide();
    //                     $(".scDchoise").remove();
    //                     $('.scSubmit').remove();
    //                     $('.scHead').remove();
    //                     $(".diaocha-content-ok").show();
    //                 }
    //             })
    //             .fail(function(data){

    //             });
    //     });
    // })
    //调查js结束



});

$(document).ready(function(){
    $('.bglist').bind("contextmenu",function(e){
        return false;
    });
});

$('.dibu a.remeng').mouseover(function(){
    $(this).addClass('colo').siblings().removeClass('colo');
    $('.dldd').eq($(this).index()).show().siblings('.dldd').hide();
})
//头部消息中心下拉框

/*广告浏览监控*/
function totalAdIp(webcode,partcode){
    $.getJSON("//ajax.588ku.com/index.php?m=adIpTotal&webcode="+webcode+"&partcode="+partcode+"&callback=?", function(e) {
    });
}

$(function(){
    //搜索切换关键词
    $(".current-select,.trangle").on('mouseenter', function(){
        $('.select-list').show();
        $('.select-list').addClass('shown');
    });

    $(".btn-select-search").on('mouseleave', function(){
        $('.select-list').hide();
        $('.select-list').removeClass('shown');
    });

    $("body").on("click", function(e){
        if(!$(e.target).hasClass('select-list')&&!$(e.target).hasClass('current-select')&&!$(e.target).hasClass('btn-select-search')) {
            $('.select-list').slideUp(100);
            $('.select-list').removeClass('shown');
        }
    });


    $(".select-list a").on('click', function(){
        var title = $(this).attr('data-title');
        var num = $(this).attr('data-num');
        var text = $(this).attr('data-text');
        var index = $(this).attr('data-index');
        $('.current-select').html(title);
        $('.current-select').attr('data-index',index);
        $('#mask-topkeyword .num').html(num);
        $('#mask-topkeyword .text').html(text);
        $(".select-list a.active").removeClass('active');
        $(this).addClass('active');
    });

})
/*搜索切换结束*/

/*搜索导航*/
$(function(){
    $(".search-sug").on("click",".sokeyup_1",function() {
        var G = $(this).find(".sokeyup_2").text();
        $("#topkeyword").val(G);//输入到input框
        $("#btn-search").click();//提交数据
        $(".search-sug").hide();
    })
    // 去艺术字库搜索
    $(".search-sug").on("click",".go-wordart-search",function(){
        var val = $("#topkeyword").val();
        doSearch(val, 23);
    });
    $(".search-sug-float").on("click",".go-wordart-search",function(){
        var val = $("#topkeyword_float").val();
        doSearch(val, 23);
    });
    $("#topkeyword").keyup(function(J) {
        // var SI = $('.current-select').attr('data-index');
        var SI = $(this).attr('data-index');
        var sType = $(this).attr('data-type');
        if(!sType){
            sType="";
        }

        if (window.event) {
            var H = window.event.keyCode;
        } else {
            var H = J.which;
        }
        var I = $("#topkeyword");
        var G = I.width();
        if (H != 38 && H != 40 && H != 13) {
            var K = I.val();
            if (K == "") {
                var htmls = $("#hot-search").html();
                if(htmls){
                    $(".search-sug").html(htmls).show();
                }
                return false;
            }
            var L = "//ajax2.588ku.com/index.php?m=searchtips&a=search&kw=" + K + "&select_index=" + SI + "&type=" + sType + "&callback=?";
            $.getJSON(L, function(M) {
                if (M != "") {
                    $(".search-sug").html(M).show();
                } else {
                    $(".search-sug").hide();
                }
            });
        }
    });

    $("#topkeyword").click(function() {
        if ($(".search-sug").text() != "") {
            $(".search-sug").show();
        } else {
            var I = $("#topkeyword");
            var K = I.val();
            if( K == ""){
                var htmls = $("#hot-search").html();
                if(htmls){
                    $(".search-sug").html(htmls).show();
                }
            }else{
                // var SI = $('.current-select').attr('data-index');
                var SI = $(this).attr('data-index');
                var sType = $(this).attr('data-type');
                if (!sType) {
                    sType = "";
                }
                var L = "//ajax2.588ku.com/index.php?m=searchtips&a=search&kw=" + K + "&select_index=" + SI + "&type=" + sType + "&callback=?";
                $.getJSON(L, function(M) {
                    if (M != "") {
                        $(".search-sug").html(M).show();
                    } else {
                        $(".search-sug").hide();
                    }
                });
            }
        }
    });

    $("#topkeyword").blur(function() {
        setTimeout('$(".search-sug").hide();', 500);
    });


    var D = 0;
    $("#topkeyword").keyup(function(H) {
        if (window.event) {
            var G = window.event.keyCode;
        } else {
            var G = H.which;
        }
        if (G != 38 && G != 40 && G != 13) {
            D = 0;
        } else {
            if ($(".search-sug").css("display") == "block") {
                var I = $(".search-sug ul").length;
                if (G == 38) {
                    D--;
                    if (D < 1) {
                        D = I;
                        C(D);
                        F(1);
                    } else {
                        F(D + 1);
                        C(D);
                    }
                    $("#topkeyword").val($("#l_" + D).html());
                    return false;
                }
                if (G == 40) {
                    D++;
                    if (D > I) {
                        D = 1;
                        C(1);
                        F(I);
                    } else {
                        F(D - 1);
                        C(D);
                    }
                    $("#topkeyword").val($("#l_" + D).html());
                    return false;
                }
            } else {
                D = 0;
            }
        }
    });

    function C(G) {
        $("#u_" + G).addClass("changeColor");
        $("#l_" + G).addClass("changeColor");
        $("#r_" + G).addClass("changeColor");
    }
    function F(G) {
        $("#u_" + G).removeClass("changeColor");
        $("#l_" + G).removeClass("changeColor");
        $("#r_" + G).removeClass("changeColor");
    }
});

/*搜索下载js*/
/******************search**********************/
$(function(){

    //搜元素点击按钮
    $('#btn-search').click(function(){
        var val = $("#topkeyword").val();            //搜索词
        var index = parseInt($(this).data('index'));//跳转的链接 //元素
        doSearch(val,index);
    });

    //第二个按钮 点击按钮
    $('#btn-search-back').click(function(){
        var val = $("#topkeyword").val(); //搜索词
        var index =parseInt($(this).data('index'));//跳转的链接 //元素
        //搜背景，并且搜索词为空时
        if((index == 0) && (typeof val == 'undefined' || val == null || val == '')){
            window.location.href="//588ku.com/beijing/";
        }else{
            doSearch(val,index);   // 全部背景
        }

    });


    $("#topkeyword").on("keydown",function(e){
        if(e.which==13) {
            var val = $(this).val();
            var index = parseInt($(this).data('index'));//跳转的链接 //元素
            doSearch(val,index);
        }
    });


});


var CookieHandle = {
    setCookie: function (name, value , days) {
        var exp = new Date();
        var days = arguments[2]?arguments[2]:1;
        exp.setTime(exp.getTime() + days*24*60*60*1000);
        document.cookie = name + "="+ escape(value) + ";domain=.588ku.com;expires=" + exp.toGMTString() + ";path=/";
    },
    setSecCookie: function (name, value , sec) {
        var exp = new Date();
        var days = arguments[2]?arguments[2]:1;
        exp.setTime(exp.getTime() + sec*1000);
        document.cookie = name + "="+ escape(value) + ";domain=.588ku.com;expires=" + exp.toGMTString() + ";path=/";
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    unsetCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);alert(cval);
        if(cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}
if (!Object.create) {
    Object.create = function(o, properties) {
        if (typeof o !== 'object' && typeof o !== 'function') throw new TypeError('Object prototype may only be an Object: ' + o);
        else if (o === null) throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");

        if (typeof properties != 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

        function F() {}

        F.prototype = o;

        return new F();
    };
}
var Cookie = Object.create(CookieHandle);
/*******************收藏+不喜欢+下载**********/
$(function(){
    $('body').on('click','.down-big-img,.nonofav,.unlike,.down-big-y,.recollect-a,.collect-a,.unlikeon,.favon,.favonV2,.nonofavV2,.favonV3,.nonofavV3',function(){

        if(!globaluid) {
            qqweixin();
            return false;
        }

        if($(this).hasClass("down-big-img")){
            //下载原图
            var id = $(this).attr('data');
            var tab = $(this).attr('data-from');
            var type = $(this).attr('type');
            var pro = $(this).attr("data-pro");
            // add by zhihong.zhang @2016-11-28背景模块把分类信息传入统计
            var pictype = $(this).attr('pictype');
            var refererUrl = document.referrer;
            if(type == 1){
                if(typeof(tab) == "undefined"){
                    if (typeof(pictype) == "undefined") {
                        picDown(rootUrl+"?m=back&a=down&id="+id,refererUrl);
                    } else {
                        var cookiePictype = Cookie.getCookie('search_word_to_type');
                        var cookieKeyword = Cookie.getCookie('back_search_keyword');
                        if (cookiePictype) {
                            var cookePictypeArr = cookiePictype.split('_');
                            if (cookePictypeArr[0] == cookieKeyword) {
                                pictype = cookePictypeArr[1];
                            }
                        }
                        picDown(rootUrl+"?m=back&a=down&id="+id+"&pictype="+pictype,refererUrl);
                    }
                }else{
                    picDown(rootUrl+"?m=back&a=down&id="+id+"&tab="+tab+"&pro="+pro,refererUrl);//统计多了个参数，区分是成套入口下载的
                }
            }else if(type == 13){
                picDown('/index.php?m=Download&a=downtempletIMG&id=' + id,refererUrl);
            }else if(type == 3){
                picDown('/index.php?m=Download&a=peituDownLoad&id=' + id,refererUrl);
            }else if(type == 6){
                picDown('/?m=Video&a=download&id='+id,refererUrl);
            }else if(type == 10){
                picDown('/?m=Audio&a=download&id='+id,refererUrl);
            }else if(type == 7){
                if(isOriginalVip){
                    picDown('/?m=Original&a=download&id='+id,refererUrl);
                }else{
                    var comb = $(this).attr('data-comb');
                    originalSingle(id, 'img', comb);
                }
            }else if(type == 23){

                picDown('/?m=WordArt&a=download&id='+id,refererUrl);

            }else if(type == 24){
                var ddown = $(this).attr('data-down');
                picDown('/?m=Illus&a=down&id='+id+"&data_type="+ddown,refererUrl);
            }else{
                if(typeof(tab) == 'undefined'){
                    picDown(rootUrl+"?m=element&a=down&id="+id,refererUrl);
                }else{
                    picDown(rootUrl+"?m=element&a=down&id="+id+"&tab="+tab+"&pro="+pro,refererUrl);//统计多了个参数，区分是成套入口下载的
                }
            }
            return false;

        }else if($(this).hasClass("down-big-y")){
            //下载psd
            var id = $(this).attr('data');
            var tab = $(this).attr('data-from');
            var type = $(this).attr('type');
            // add by zhihong.zhang @2016-11-28背景模块把分类信息传入统计
            var pictype = $(this).attr('pictype');
            var refererUrl = document.referrer;
            if(type == 1){
                if (typeof(pictype) == "undefined") {
                    picDown(rootUrl+"?m=back&a=downpsd&id="+id,refererUrl);
                } else {
                    var cookiePictype = Cookie.getCookie('search_word_to_type');
                    var cookieKeyword = Cookie.getCookie('back_search_keyword');
                    if (cookiePictype) {
                        var cookePictypeArr = cookiePictype.split('_');
                        if (cookePictypeArr[0] == cookieKeyword) {
                            pictype = cookePictypeArr[1];
                        }
                    }
                    picDown(rootUrl+"?m=back&a=downpsd&id="+id+"&pictype="+pictype,refererUrl);
                }
            }else if(type == 2){
                picDown('/index.php?m=Download&a=downloadPSD&id=' + id + '&picType='+pictype,refererUrl);
            }else if(type == 3){
                picDown('/?m=Download&a=downloadOffice&id=' + id + '&picType='+pictype,refererUrl);
            }else if(type == 5){
                picDown('/index.php?m=Download&a=peituDownLoadPsd&id=' + id + '&picType='+pictype,refererUrl);
            }else if(type == 7){
                if(isOriginalVip){
                    picDown('/?m=Original&a=downloadPsd&id='+id,refererUrl);
                }else{
                    var comb = $(this).attr('data-comb');
                    originalSingle(id, 'zip', comb);
                }
            }else if(type == 23){

                picDown('/?m=WordArt&a=downloadPSD&id='+id,refererUrl);

            }else if(type == 24){
                picDown('/?m=Illus&a=downPsd&id='+id,refererUrl);
            }else{
                if(typeof(tab) == 'undefined'){
                    picDown(rootUrl+"?m=element&a=downpsd&id="+id,refererUrl);
                }else{
                    picDown(rootUrl+"?m=element&a=downpsd&id="+id+"&tab="+tab,refererUrl);
                }
            }
            return false;
        }else if($(this).hasClass("nonofav")){
            var id = $(this).attr('data');
            var type = $(this).attr('type');
            if(type == 1){
                picCollect(rootUrl+'?m=backp&a=collect_ajax',id);
            }else if(type == 2){
                picCollect('/?m=Templetp&a=collect_add_ajax',id);
            }else if(type == 3){
                picCollect('/?m=peitup&a=collect_add_ajax',id);
            }else if(type == 4){
                picCollect('/?m=Office&a=collect_add_ajax', id);
            }else if(type == 5){
                picCollect('/?m=Video&a=collect',id);
            }else if(type == 7){
                picCollect('/?m=Original&a=collect',id);
            }else if(type == 23){
                picCollect(rootUrl+'?m=WordArt&a=collect_add_ajax',id);
            }else if(type == 24){
                var obj = $(this);
                var id = $(this).attr('data-id');
                var typec = $(this).attr('data-collect');
                var data = {
                    type:typec,
                    collect:id
                }
                picCollectch('/?m=Illus&a=collect',data,function(res){
                    if(res.status==1){
                        obj.text('已收藏');
                        obj.addClass('favon').removeClass('nonofav');
                        obj.attr('data-collect','2');
                    }
                });
            } else{
                picCollect(rootUrl+'?m=elementp&a=ajaxAddCollectList',id);
            }
            return false;
        }else if ($(this).hasClass("nonofavV2")) {
            var id = $(this).attr('data');
            var type = $(this).attr('type');
            if(type == 1){
                picCollectV2(rootUrl+'?m=backp&a=collect_ajax',id);
            }else if(type == 2){
                picCollectV2Alter('/?m=Templetp&a=collect_add_ajax', id);
            }else if(type == 12){
                picCollectV2('/?m=Templetp&a=collect_add_ajax', id);
            }else if(type == 3){
                picCollectV2('/?m=peitup&a=collect_add_ajax',id);
            }else if(type == 4) {
                picCollectV2Alter('/?m=Office&a=collect_add_ajax', id);
            }else if(type == 5){
                picCollectV2('/?m=Video&a=collect',id);
            }else if(type == 7){
                picCollectV2('/?m=Original&a=collect',id);
            }else if(type == 10){
                picCollectV2('/?m=Audio&a=collectAudio',id);
            }else if(type == 23){
                picCollectV2(rootUrl+'?m=WordArt&a=collect_add_ajax',id);
            }else if(type == 24){
                var obj = $(this);
                var id = $(this).attr('data-id');
                var typec = $(this).attr('data-collect');
                var data = {
                    type:typec,
                    collect:id
                }
                picCollectch('/?m=Illus&a=collect',data,function(res){
                    if(res.status==1){
                        if(typec=='1'){
                            obj.addClass('favonV2');
                            obj.attr('data-collect','2');
                        }else{
                            obj.removeClass('favonV2').addClass('nonofavV2');
                            obj.attr('data-collect','1');
                        }
                    }
                });
            }else{
                picCollectV2(rootUrl+'?m=elementp&a=ajaxAddCollectList',id);
            }
            return false;
        }else if ($(this).hasClass("nonofavV3")) {
            var id = $(this).attr('data');
            var type = $(this).attr('type');
            if(type == 1){
                picCollectV3(rootUrl+'?m=backp&a=collect_ajax',id);
            }else if(type == 2){
                picCollectV3('/?m=Templetp&a=collect_add_ajax',id);
            }else if(type == 3){
                picCollectV3('/?m=peitup&a=collect_add_ajax',id);
            }else if(type == 4){
                picCollectWpV3('/?m=Office&a=collect_add_ajax', id);
            }else if(type == 5){
                picCollectV3('/?m=Video&a=collect',id);
            }else if(type == 7){
                picCollectV3('/?m=Original&a=collect',id);
            }else if (type == 10) {
                picCollectV3('/?m=Audio&a=collectAudio', id);
            }else if(type == 23){
                picCollectV3(rootUrl+'?m=WordArt&a=collect_add_ajax',id);
            }else if(type == 24){
                var obj = $(this);
                var id = $(this).attr('data-id');
                var typec = $(this).attr('data-collect');
                var data = {
                    type:typec,
                    collect:id
                }
                picCollectch('/?m=Illus&a=collect',data,function(res){
                    var pnum = parseInt(obj.children('b').text());
                    if(res.status==1){
                        if(typec=='1'){
                            obj.addClass('on favonV3');
                            obj.attr('data-collect','2');
                            obj.children('b').text(pnum+1);
                        }else{
                            obj.removeClass('on favonV3').addClass('nonofavV3');
                            obj.attr('data-collect','1');
                            obj.children('b').text(pnum-1);
                        }
                    }
                });
            }else{
                picCollectV3(rootUrl+'?m=elementp&a=ajaxAddCollectList',id);
            }
            return false;
        }else if($(this).hasClass("unlike")){
            //不喜欢
            var id = $(this).attr('data');
            var type = $(this).attr('type');
            if(type == 1){
                picUnlike(rootUrl+'?m=backp&a=unlike_ajax',id);
            }else{
                picUnlike(rootUrl+'?m=elementp&a=unlike_ajax',id);
            }
            return false;
        }else if($(this).hasClass('favon')){
            //取消收藏
            var id = $(this).attr('data');
            var type = $(this).attr('type');
            if(type == 1){
                picRemoveCollect(rootUrl+'?m=backp&a=remove_collect',id);
            }else if(type == 2){
                picRemoveCollect('/?m=Templetp&a=remove_collect',id);
            }else if(type == 4){
                picRemoveCollect('/?m=Office&a=remove_collect', id);
            }else if(type == 23){
                picRemoveCollect(rootUrl+'?m=WordArt&a=remove_collect',id);
            }else if(type == 24){
                var obj = $(this);
                var id = $(this).attr('data-id');
                var typec = $(this).attr('data-collect');
                var data = {
                    type:typec,
                    collect:id
                }
                picCollectch('/?m=Illus&a=collect',data,function(res){
                    if(res.status==1){
                        obj.text('收藏');
                        obj.addClass('nonofav').removeClass('favon');
                        obj.attr('data-collect','1');
                    }
                });
            } else{
                picRemoveCollect(rootUrl+'?m=elementp&a=remove_collect',id);
            }
            return false;
        }else if($(this).hasClass('favonV2')){
            //取消收藏
            var id = $(this).attr('data');
            var type = $(this).attr('type');
            if(type == 1){
                picRemoveCollectV2(rootUrl+'?m=backp&a=remove_collect',id);
            }else if(type == 2){
                picRemoveCollectV2Alter('/?m=Templetp&a=remove_collect', id);
            }else if(type == 12){
                picRemoveCollectV2('/?m=Templetp&a=remove_collect', id);
            }else if(type == 4){
                picRemoveCollectV2Alter('/?m=Office&a=remove_collect', id);
            }else if(type == 5){
                picRemoveCollectV2('/?m=Video&a=removeCollect',id);
            }else if (type == 10) {
                picRemoveCollectV2('/?m=Audio&a=collectAudio', id);
            }else if(type == 23){
                picRemoveCollectV2(rootUrl+'?m=WordArt&a=remove_collect',id);
            }else{
                picRemoveCollectV2(rootUrl+'?m=elementp&a=remove_collect',id);
            }
            return false;
        }else if($(this).hasClass('favonV3')){
            //取消收藏
            var id = $(this).attr('data');
            var type = $(this).attr('type');
            if(type == 1){
                picRemoveCollectV3(rootUrl+'?m=backp&a=remove_collect',id);
            }else if(type == 2){
                picRemoveCollectV3('/?m=Templetp&a=remove_collect',id);
            }else if(type == 4){
                picRemoveCollectV3('/?m=Office&a=remove_collect', id);
            }else if(type == 5){
                picRemoveCollectV3('/?m=Video&a=removeCollect',id);
            }else if (type == 10) {
                picRemoveCollectV2('/?m=Audio&a=collectAudio', id);
            }else if(type == 23){
                picRemoveCollectV3(rootUrl+'?m=WordArt&a=remove_collect',id);
            }else{
                picRemoveCollectV3(rootUrl+'?m=elementp&a=remove_collect',id);
            }
            return false;
        }else if($(this).hasClass('unlikeon')){
            //取消不喜欢
            var id = $(this).attr('data');
            var type = $(this).attr('type');
            if(type == 1){
                picRemoveUnlike(rootUrl+'?m=backp&a=remove_unlike',id);
            }else{
                picRemoveUnlike(rootUrl+'?m=elementp&a=remove_unlike',id);
            }
            return false;
        }else if($(this).hasClass("collect-a")){
            //收藏专辑
            //$("body").on("click",".collect-a",function(){
            var id = $(this).attr('data');
            $.post(rootUrl+"?m=elementp&a=collect_special",{id:id},function(data){
                $('.element-list'+id).find(".collect-a").text('已收藏').addClass('recollect-a').removeClass('collect-a');
                $('.ts-coll').show();
            })
            //})
            return false;
        }else if($(this).hasClass('recollect-a')){
            var id = $(this).attr('data');
            $.post(rootUrl+"?m=elementp&a=remove_collect_special",{id:id},function(data){
                $('.element-list'+id).find(".recollect-a").text('收藏专辑').addClass('collect-a').removeClass('recollect-a');
                $('.ts-coll').hide();
            })
            return false;
        }
    });

    //取消不喜欢
    $("body").on("mouseover mouseout",'.unlikeon',function(event){
        if(event.type == "mouseover"){
            //鼠标悬浮
            $(this).text('取消');
        }else if(event.type == "mouseout"){
            $(this).text('已不喜欢');
        }
    });
    $("body").on("click",".unlikeon",function(){
        var id = $(this).attr('data');
        //去掉我不喜欢
        $.post(rootUrl+"?m=backp&a=remove_unlike",{id:id},function(data){
            if (data.status == 0) {
                $(".bglist_"+id).find(".unlikeon").text('不喜欢').addClass('unlike').removeClass('unlikeon');
            } else {
                alert(data.info);
            }
        },'json');
    });
    //取消收藏
    $("body").on("mouseover mouseout",'.favon',function(event){
        if(event.type == "mouseover"){
            //鼠标悬浮
            $(this).text('取消收藏');
        }else if(event.type == "mouseout"){
            $(this).text('已收藏');
        }
    });

    /*
     $("body").on("click",".favon",function(){
     var id = $(this).attr('data');
     //去掉收藏
     $.post(rootUrl+"?m=backp&a=remove_collect",{id:id},function(data){
     if (data.status == 0) {
     $(".bglist_"+id).find(".favon").text('收藏').addClass('nonofav').removeClass('favon');
     } else {
     alert(data.info);
     }
     },'json');
     });
     */


});

/******************function******************/
function doSearch(val,index,button){
    if(typeof index == 'undefined'){
        index = $('.current-select').attr('data-index');
    }

    if(typeof val == 'undefined' || val == null || val == ''){
        if(index == 15){
            // 搜索直接跳转
            window.location.href = '//588ku.com/video/shipin/';
            return false;
        }
        if(typeof button == 'undefined' || button == null || button == !true){
            alert('请输入要查找的关键词');
        }
    }

    var btypez = $("#bTypeZ").val();

    var url = rootUrl+'?m=search&a=pinYin&keyword='+val+'&stype='+index+'&drawingz='+btypez;
    var reurl;

    /*3 banner 4 详情页海报 2 主图 0 背景全部  6 成套  7-> 创意图 8->H5 9-> 店铺  10-> 印刷 5元素   11->模板 12->配图 13->PPT 18原创元素 19原创背景 20原创高清摄影图 23 艺术字*/

    if(index == 5){
        reurl = '//588ku.com/image/';
    }else if(index == 6){
        reurl = '//588ku.com/image/';
    }else if(index == 2){
        reurl = '//588ku.com/tuku/';
    }else if(index == 12){
        reurl = '//588ku.com/pt/';
    }else if(index == 13){
        reurl = '//588ku.com/ppt/';
    }else if(index == 14){
        reurl = '//588ku.com/resume/';
    }else if(index == 15 || index == 21 || index == 22){
        reurl = '//588ku.com/video/';
    }else if(index == 23){
        reurl = '//588ku.com/yishuzi/';
    }else if(index == 24){
        reurl = '//588ku.com/chahua/';
    }else if(index == 16){
        reurl = '//588ku.com/?m=Video&a=searchDv&keyword=';
    }else if(index == 17){
        reurl = '//588ku.com/?m=Video&a=audioCateList&keyword=';
    }else if(index == 18 || index == 19 || index == 20){
        reurl = '//588ku.com/original/';
    }else if(index == 25){
        reurl = '//588ku.com/excel/';
    }else if(index == 26){
        reurl = '//588ku.com/scb/';
    }else{
        reurl = '//588ku.com/tuku/';
    }

    var zstrUrl;

    if(btypez == 4){
        zstrUrl = '-collect.html';
    }else if(btypez == 3){
        zstrUrl = '-square.html';
    }else if(btypez == 2){
        zstrUrl = '-vertical.html';
    }else if(btypez == 1){
        zstrUrl = '-cross.html';
    }else{
        zstrUrl = '.html';
    }
    if(globaluid == 0 && CookieHandle.getCookie('huke_popup_lock') != 1 && CookieHandle.getCookie('non_search_first') != 1 && CookieHandle.getCookie('user_source') != 'sem'){
        CookieHandle.setCookie('non_search_first', 1);
    }
    $.post(url,{},function(data){
        if (data.status == 0) {
            if(data.noshow == 1){
                reurl = reurl+'n-';
                zstrUrl = '.html';
            }
            if(index == 0){
                if(typeof zstrUrl == 'undefined'){
                    zstrUrl = '.html';
                }
                reurl = reurl+data.res+zstrUrl;
            }
            // else if(index == 2){
            //     reurl = reurl+data.res+zstrUrl;
            // }else if(index == 4){
            //     reurl = reurl+data.res+'-cross.html';
            // }
            else if(index == 5){
                reurl = reurl+data.res+'.html';
            }
            // else if(index == 6){
            //     reurl = reurl+data.res+'-png.html';
            // }else if(index == 8){
            //     reurl = reurl+data.res+'-vertical.html';
            // }else if(index == 9){
            //     reurl = reurl+data.res+'-vertical.html';
            // }else if(index == 10){
            //     reurl = reurl+data.res+'-vertical.html';
            // }else if(index == 3){
            //     reurl = reurl+data.res+'-cross.html';
            // }
            // else if(index == 7){
            //     reurl = reurl+data.res+'-photo.html';
            // }
            else if ( index == 11) {
                reurl = reurl+data.res+'-moban.html';
            }else if ( index == 12){
                reurl = reurl+data.res+'.html';
            }else if(index == 13){
                reurl = reurl+data.res+'.html';
            }else if(index == 14){
                reurl = reurl+data.res+'.html';
            }else if(index == 18 || index == 15){
                reurl = reurl+data.res+'-1.html';
            }else if(index == 19 || index == 21){
                reurl = reurl+data.res+'-2.html';
            }else if(index == 20 || index == 22){
                reurl = reurl+data.res+'-3.html';
            }else if ( index == 23){
                reurl = reurl+data.res+'.html';
            }else if ( index == 24){
                reurl = reurl+data.res+'.html';
            }else if(index == 25||index == 26){
                reurl = reurl+data.res+'.html';
            }else {
                reurl = reurl+data.res+zstrUrl;
            }

            // do statistical request add by zhihong.zhang @2016.11.11
            // $.get('//ajax.588ku.com/?m=search&a=recordBGStatisicalData&uid=' + data.uid + '&guid=' + data.guid + '&keyword=' + val + '&pinyin=' + data.res + '&index=' + index);
            $.ajax({
                url:"//ajax.588ku.com/?m=search&a=recordBGStatisicalData",
                dataType:'jsonp',
                data:{uid:data.uid,guid:data.guid,keyword:val,pinyin:data.res,index:index},
                type:'get',
                jsonp:'callback',
                jsonpCallback:'getName',
                xhrFields:{withCredentials:true},
                success:function(data){
                }
            });
            Cookie.setCookie('search_word_to_type', val + '_' + $('.down-big-img').attr('pictype'));
            Cookie.setCookie('back_search_keyword', val);
        }else if(data.status == 2){
        }else if(data.status == 3){
        }
    },'json');
}

// 兼容ie浏览器下载
function gotoUrl(url){
    if(window.VBArray){
        var gotoLink = document.createElement('a');
        gotoLink.href = url;
        document.body.appendChild(gotoLink);
        gotoLink.click();
    }else{
    }
}


function picDown(url,refUrl) {
    $.ajax({
        url:url,
        data: {refererUrl:refUrl},
        dataType:'json',
        type:'get',
        async:false,
        dataFilter:function(data,type){
            var r_type = typeof data;
            if (r_type != type) {
                //劫持修改
                var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
                data = data.replace(SCRIPT_REGEX, ""); //正则替换为空
                return data;
            }
        },
        success:function(data){
            var vipType;
            var vipclass;
            if(data.type == 1){
                vipType = '#online';
                vipclass = '.bg';
            }else if(data.type == 3){
                vipType = '#template';
                vipclass = '.model';
            }else if(data.type == 4){
                vipType =  '#ppt';
                vipclass = '.ppt';
            }else if(data.type == 6){
                vipType = '#video';
                vipclass = '.video';
            }else if(data.type == 10){
                vipType = '#video';
                vipclass = '.video';
            }else if(data.type == 9){
                vipType = '#original';
                vipclass = '.original';
            }else if(data.type == 13){
                vipType = '#wordart';
                vipclass = '.wordart';
            }else if(data.type == 21){
                vipType = '#illus';
                vipclass = '.illus';
            }else{
                vipType = '#element'
                vipclass = '.element';
            }
            if (data.status == 0) {
                ;
                if(data.pic_class == 1){
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=backDownStatist",
                        dataType:'jsonp',
                        data:{uid:data.uid,isvip:data.isvip,create_time:data.create_time,id:data.id,type:data.type,pictype:data.pictype,keyword:data.keyword},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }else if(data.pic_class == 2){
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=elementDownStatist",
                        dataType:'jsonp',
                        data:{uid:data.uid,isvip:data.isvip,create_time:data.create_time,id:data.id,keyword:data.keyword},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }else if(data.pic_class == 13){
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=yishuziDownStatist",
                        dataType:'jsonp',
                        data:{uid:data.uid,isvip:data.isvip,create_time:data.create_time,id:data.id,keyword:data.keyword},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }else if(data.pic_class == 4){
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=peituDownStatist",
                        dataType:'jsonp',
                        data:{uid:data.uid,create_time:data.create_time,id:data.id,keyword:data.keyword},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }else if(data.pic_class == 9){
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=originalDownStatist",
                        dataType:'jsonp',
                        data:{id:data.id},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }else if(data.pic_class == 6){
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=videoDownStatic",
                        dataType:'jsonp',
                        data:{vid:data.vid},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }else if(data.pic_class == 10){
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=audioDownStatic",
                        dataType:'jsonp',
                        data:{id:data.audio_id},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }
            } else if(data.status == -1){
                $("#login-limit-pane").closest('.down-limit').show();
            } else if (data.status == -10) {
                $(vipclass+'-same-limit').closest('.down-limit').show();
                $(vipclass+'-same-limit').show();
                if(data.type==4){
                    picrecharge(picidone,4,2,2);
                }
            } else if (data.status == -11) {
                $(vipType+'-pro-vip-limit-pane').parent('.down-limit').find('.blue-num').text(data.dsdowncnt);
                $(vipType+'-pro-vip-limit-pane').closest('.down-limit').show();
            } else if (data.status == -14) {
                $(vipType+'-down-limit-pane').parent('.down-limit').find('.blue-num').text(data.dsdowncnt);
                $(vipType+"-down-limit-pane").closest('.down-limit').show();
            }else if (data.status == -21){
                $(".script-abnormal-wd").show();
                $(".script-abnormal-wd").closest('.down-limit').show();
            } else if (data.status == -15){
                $(vipclass+'-ip-limit').closest('.down-limit').show();
                $(vipclass+'-ip-limit').show();
            } else if (data.status == -35){
                $(vipclass+'-psd-free-limit').closest('.down-limit').show();
                $(vipclass+'-psd-free-limit').show();
            }else if (data.status == -12) {
                $(vipclass+'-free-limit').closest('.down-limit').show();
                $(vipclass+'-free-limit').show();
                if (vipclass == '.model') {
                    // 模板下载限制提醒次数记录
                    $.get('//ajax.588ku.com/?m=SponsorFunnel&a=update&mod=1&type=1&uid=' + globaluid);
                }
                if(data.type==4){
                    picrecharge(picidone,4,2,1);
                }
            }else if (data.status == -17 && data.type ==  1) {
                // 背景源文件下载限制
                $(vipclass+'-source-limit').closest('.down-limit').show();
                $(vipclass+'-source-limit').show();
            } else if (data.status == -17 && (data.type == 6 || data.type == 10)) {
                if(data.type == 10){
                    $('#audio_popup').hide();
                }
                $(vipclass + '-source-limit').closest('.down-limit').show();
                $(vipclass + '-source-limit').show().parent().show();
            } else if (data.status == -33 && data.type == 1) {
                // 合集文件下载限制
                $(vipclass+'-collect-limit').closest('.down-limit').show();
                $(vipclass+'-collect-limit').show();
            } else if (data.status == -2) {
                // $('.diaocha').show();// cancelled by zhihong.zhang
                $('#inspect').show();
            }else if (data.status == -3) {
                $('#fixed').after(data.html);
                $('#fixed').attr('data-id',data.id);
                $('#fixed').attr('type',data.type);
                $('#fixed').attr('down_type',data.down_type);
            } else if(data.status== -4) {
                $("#collect_network").closest('.down-limit').show();
            } else if(data.status== -18) {
                $("#origin-vip-limit").closest('.down-limit').show();
                $("#origin-vip-limit").show();
            } else if(data.status== -19) {
                $("#origin-num-limit").closest('.down-limit').show();
                $("#origin-num-limit").show();
            }else if(data.status == -22 && data.type == 21){
                $(".illus-day2-limit").closest('.down-limit').show();
                $(".illus-day2-limit").show();
            } else if(data.status == -23 && data.type == 21){
                $(".illus-Jurisd-limit").closest('.down-limit').show();
                $(".illus-Jurisd-limit").show();
            }else {
                alert('下载失败');
            }
        },
    })
}

function picrecharge(pic,vlpclass,style,limit){
    $.ajax({
        url:'//ajax.588ku.com/?m=ajaxrecharge&a=pic',
        data:{pic:pic,vipclass:vlpclass,style:style,limit:limit},
        dataType:'jsonp',
        xhrFields:{widthCredentials:true},
        success:function(data){
        }
    })
}


function picCollect(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                //$("#collect-btn").addClass('on');
                //$("#collect-btn").addClass('favon').removeClass('nonofav');
                //$('#collect-btn').find('b').text(data.num);

                $(".bglist_"+id).find(".nonofav").text('已收藏').addClass('favon').removeClass('nonofav');
            } else {
                //alert(data.info);
            }
        })
        .fail(function(data){

        });
}
//插画收藏
function picCollectch(url,data,fn){
    $.ajax({url:url,data:data,dataType:'json',type:'post'})
        .success(function(data){
            fn(data);
        })
        .fail(function(data){});
}
function picCollectV2(url, id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $(".bglist_"+id).find(".nonofavV2").addClass('favonV2').removeClass('nonofavV2');
            }
        })
        .fail(function(data){});
}

function picCollectV2Alter(url, id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $(".bglist_" + id).find(".nonofavV2").text('已收藏').addClass('favonV2').removeClass('nonofavV2');
            }
        })
        .fail(function(data){});
}

function picCollectV3(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $("#collect-btn").addClass('on');
                $("#collect-btn").addClass('favonV3').removeClass('nonofavV3');
                $('#collect-btn').find('b').text(data.num);

                //$(".bglist_"+id).find(".nonofav").text('已收藏').addClass('favon').removeClass('nonofav');
            } else {
                //alert(data.info);
            }
        })
        .fail(function(data){

        });
}

// 办公排行榜收藏
function picCollectWpV3(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $(".bglist_"+id).find(".nonofavV3").addClass('favonV3').removeClass('nonofavV3');
            } else {
                //alert(data.info);
            }
        })
        .fail(function(data){

        });
}

function picUnlike(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $(".bglist_"+id).find(".unlike").text('已不喜欢').addClass('unlikeon').removeClass('unlike');
            } else {
                alert(data.info);
            }
        })
        .fail(function(data){

        });
}

function picRemoveCollect(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                //$("#collect-btn").removeClass('on');
                //$("#collect-btn").addClass('nonofav').removeClass('favon');
                $(".bglist_"+id).find(".favon").text('收藏').addClass('nonofav').removeClass('favon');
            } else {
                alert(data.info);
            }
        })
        .fail(function(data){

        });
}

function picRemoveCollectV2(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $(".bglist_"+id).find(".favonV2").addClass('nonofavV2').removeClass('favonV2');
            } else {
                alert(data.info);
            }
        })
        .fail(function(data){}
        );
}
// 取消收藏并且显示为收藏
function picRemoveCollectV2Alter(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $(".bglist_"+id).find(".favonV2").text('收藏').addClass('nonofavV2').removeClass('favonV2');
            } else {
                alert(data.info);
            }
        })
        .fail(function(data){}
        );
}

function picRemoveCollectV3(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $("#collect-btn").removeClass('on');
                $("#collect-btn").addClass('nonofavV3').removeClass('favonV3');
                //$(".bglist_"+id).find(".favon").text('收藏').addClass('nonofav').removeClass('favon');
            } else {
                alert(data.info);
            }
        })
        .fail(function(data){

        });
}

function picRemoveUnlike(url,id){
    $.ajax({url:url,data:{id:id},dataType:'json',type:'post'})
        .success(function(data){
            if (data.status == 0){
                $(".bglist_"+id).find(".unlikeon").text('不喜欢').addClass('unlike').removeClass('unlikeon');
            } else {
                alert(data.info);
            }
        })
        .fail(function(data){

        });
}
// 多人登录提示
var multiClient = CookieHandle.getCookie('MULTI_LOGIN_FLAG');
if (multiClient) {
    $.post("/?m=ajax&a=checkMultiClient",function (data) {
        if (data.status == 1) {
            // $("#login-limit-pane").parent().parent().show();
            alert("您的账号已在其他地方登陆。若非本人操作，请注意账号安全。");
        }
    }, 'json');
}
//回到顶部js开始
function goTopEx(){
    window.onscroll=function(){
        var obj=document.getElementById("right_goTopBtn");
        if (!obj) {return;}
        if (window.navigator.userAgent.indexOf ("Chrome") >=0) {
            if(document.body.scrollTop>300){
                obj.style.display = "";
                obj.style.height = obj.offsetHeight + "px";
            }else{
                obj.style.display = "none";
            }
        }else{
            if(window.navigator.userAgent.indexOf("Safari")>-1){
                window.pageYOffset >300 ? obj.style.display="":obj.style.display="none";
            }else{
                document.documentElement.scrollTop >300?obj.style.display="":obj.style.display="none";
            }
        }
    }
}
goTopEx();
if(document.getElementById("right_goTopBtn")){
    document.getElementById("right_goTopBtn").style.display="none";
}
$("#right_goTopBtn").click(function() {
    $("html,body").animate({
        scrollTop: 0
    }, 500);
});


//右侧二维码
$('.side-barBox .wechat').hover(function(){
    $('.side-barBox .wechat .introduce').append('<img  src="//js.588ku.com/comp/rightbtn/images/qr-code.png" />');
},function(){
    $('.side-barBox .wechat .introduce').html('');
});
function goTopExNew(){
    window.onscroll=function(){
        var obj=document.getElementById("right_goTopBtn_new");
        if (!obj) {return;}
        if(document.body.scrollTop>300){
            obj.style.display = "block";
        }else{
            obj.style.display = "none";
        }

    }
}
goTopExNew();

$("#right_goTopBtn_new").click(function() {
    $("html,body").animate({
        scrollTop: 0
    }, 500);
});


$(".button-qq-group").on('mouseenter', function(){
    $("#qq-group-detail").show();
})
$(".button-qq-group").on('mouseleave', function(){
    $("#qq-group-detail").hide();
});
$(".weixin-group").on('mouseenter', function(){
    $("#weixin-detail").show();
})
$(".weixin-group").on('mouseleave', function(){
    $("#weixin-detail").hide();
});
//回到顶部js结束

/******新版收藏******/

// $(function(){
//  //关闭弹出框
//  $(".colt-clsbtn").click(function(){
//      $('#collect-element').fadeOut(500);
//  });
//  //下拉框的显示与隐藏
//  $('.addTypes').click(function(event) {
//      event.stopPropagation();
//      $('.addTypes .selectType-drop').hide();
//      $(this).find('.selectType-drop').show();
//  })
//  $('.selectType-drop').hover(function(){},function(){
//      $('.addTypes .selectType-drop').hide();
//  })
//      //下拉框赋值给input
//  $('.selectType-drop').on('click', 'a', function(event) {
//      event.stopPropagation();
//      $(this).parents('.selectType-drop').siblings('label').find("input").val($(this).text()).attr('data-id', $(this).attr('data-id'));
//      $(this).parents('.selectType-drop').hide();
//  });

//  $('.coltto-add-btn').click(function(){
//      collectResetAll();
//      var txt  = $('.addNewName').val();
//      $('.coltto-add-btn').hide();
//      $('.error-show').show();
//      $('.coltName').val(txt);
//      $('.addNewName').parents(".selectType-drop").hide();
//      $('.change-collect').hide();
//      $('.add-collect').show();
//      $('.coltto-btn a').text('创建并收藏');
//  })
//  $('.element-collect').click(function(){
//      submitCollect = true;
//      var _self = $(this),
//          dataId,
//          img,
//          title,
//          html;
//      collectResetAll();
//      $('.coltto-add-btn').show();
//      $('.error-show').hide();
//      $.post('/?m=elementp&a=ajaxCollectList',{name:'test'}, function(data){
//          if(0 == data.isError){
//              $('#collect-element').show();
//              dataId = _self.attr('data');
//              img = _self.parent().prev('a').find('img').attr('src');
//              if(typeof(img) == "undefined"){
//                  img = _self.parents('.img-box').find('img').attr('src');
//              }
//              title = _self.parent().prev('a').find('img').attr('title');
//              $('#collect-element .viewImg-info img').attr('src', img);
//              $('#collect-element .viewImg-info .viewImg-intro').text(title);
//              $('.coltto-btn a').attr('data-id', dataId);
//              $('.coltto-btn-list a').attr('data-id', dataId);
//              if(null == data.list){
//                  $('.change-collect').hide();
//                  $('.add-collect').show();
//                  $('.coltto-btn a').text('创建并收藏');
//              } else {
//                  $('.coltto-btn a').text('收藏到专辑');
//                  $('.add-collect').hide();
//                  $('.change-collect').show();
//                  $('.defaulName').val(data.list[0].title).attr('data-id', data.list[0].id);
//                  html = '';
//                  for(var i in data.list){
//                      html += '<a href="javascript:;" data-id="' + data.list[i].id + '">' + data.list[i].title + '</a>';
//                  }

//                  $('.change-collect .selectType-drop').html(html);
//              }
//          } else if(1 == data.isError) {
//              alert(data.message);
//          }
//      },'json')
//  })
//  $('.coltto-btn-list a').click(function(){
//      var dataId = $(this).attr('data-id');
//      $.post('/?m=elementp&a=ajaxAddCollectList', {id:dataId}, function(data){
//          if(1 == data.isError){
//              alert(data.message);
//          } else if(0 == data.isError) {
//              $('.coltto-btn-list a').text('收藏成功');
//              $('#collect-element').fadeOut(500);
//          }
//      }, 'json')
//  });
//  var submitCollect = true;
//  $('.coltto-btn a').click(function(){
//      if(submitCollect == true){
//          submitCollect = false;
//          var collectName = $('.coltName').val(),
//              defaulName = $('.defaulName').attr('data-id'),
//              collectSort = $('.selectSort').attr('data-id'),
//              collectType = $('.selectType').attr('data-id')
//              dataId = $(this).attr('data-id');

//          if(collectName && collectSort && collectType){
//              if(!collectName)return $('.error-show').text('请填写专辑名称');
//              if(!collectSort)return $('.error-show').text('请填写分类');
//              if(!collectType)return $('.error-show').text('请填写素材类别');
//              $.post('/?m=elementp&a=ajaxAddSp',{id:dataId, collectName:collectName, collectSort:collectSort, collectType:collectType}, function(data){
//                  if(1 == data.isError){
//                      alert(data.message);
//                  } else if(0 == data.isError) {
//                      $('.coltto-btn a').text('收藏成功');
//                      $('#collect-element').fadeOut(500);
//                  }
//              }, 'json');
//          } else if(defaulName){
//              $.post('/?m=elementp&a=ajaxAddCollect',{id:dataId, defaulName:defaulName}, function(data){
//                  if(1 == data.isError){
//                      alert(data.message);
//                  } else if(0 == data.isError) {
//                      $('.coltto-btn a').text('收藏成功');
//                      $('#collect-element').fadeOut(500);
//                  }
//              }, 'json');
//          } else {
//              alert('请选择或者创建专辑');
//          }
//      }
//  })
// })

// an eye for an eye
function nzdszjc() {
    setTimeout('$("#qtvip-dl").remove()',1e3);
    setTimeout('$("#qtvip-dl").remove()',1.02e3);
    setTimeout('$("#qtvip-dl").remove()',1010);
    setTimeout('$("#qtvip-dl").remove()',1050);
    setTimeout('$("#qtvip-dl").remove()',1100);
    $(".ikrong-musicdownload").remove();
    $("#play11").remove();
    $("#down11").remove();
}

function collectResetAll(){
    $('.error-show').text('');
    $('.coltName').val('');
    $('.defaulName').removeAttr('data-id');
    $('.selectSort').val('');
    $('.selectSort').removeAttr('data-id');
    $('.selectType').val('');
    $('.selectType').removeAttr('data-id');
    $('.coltto-btn a').text('收藏到专辑');
    $('.coltto-btn-list a').text('收藏元素');
}

// var CookieHandle = {
//     setCookie: function (name, value) {
//         var exp = new Date();
//         var days = arguments[2]?arguments[2]:1;
//         exp.setTime(exp.getTime() + days*24*60*60*1000);
//         document.cookie = name + "="+ escape(value) + ";domain=.588ku.com;expires=" + exp.toGMTString() + ";path=/";
//     },
//     getCookie: function (name) {
//         var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//         if(arr = document.cookie.match(reg)) {
//             return unescape(arr[2]);
//         } else {
//             return null;
//         }
//     },
//     unsetCookie: function (name) {
//         var exp = new Date();
//         exp.setTime(exp.getTime() - 1);
//         var cval = this.getCookie(name);alert(cval);
//         if(cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
//     }
// }

var URLHandle=(function(urlhandle){
    var objURL=function(url){
        this.ourl=url||window.location.href;
        this.href="";//?前面部分
        this.params={};//url参数对象
        this.jing="";//#及后面部分
        this.init();
    }
    //分析url,得到?前面存入this.href,参数解析为this.params对象，#号及后面存入this.jing
    objURL.prototype.init=function(){
        var str=this.ourl;
        var index=str.indexOf("#");
        if(index>0){
            this.jing=str.substr(index);
            str=str.substring(0,index);
        }
        index=str.indexOf("?");
        if(index>0){
            this.href=str.substring(0,index);
            str=str.substr(index+1);
            var parts=str.split("&");
            for(var i=0;i<parts.length;i++){
                var kv=parts[i].split("=");
                this.params[kv[0]]=kv[1];
            }
        }
        else{
            this.href=this.ourl;
            this.params={};
        }
    }
    //只是修改this.params
    objURL.prototype.set=function(key,val){
        this.params[key]=val;
    }
    //只是设置this.params
    objURL.prototype.remove=function(key){
        this.params[key]=undefined;
    }
    //根据三部分组成操作后的url
    objURL.prototype.url=function(){
        var strurl=this.href;
        var objps=[];//这里用数组组织,再做join操作
        for(var k in this.params){
            if(this.params[k]){
                objps.push(k+"="+this.params[k]);
            }
        }
        if(objps.length>0){
            strurl+="?"+objps.join("&");
        }
        if(this.jing.length>0){
            strurl+=this.jing;
        }
        return strurl;
    }
    //得到参数值
    objURL.prototype.get=function(key){
        return this.params[key];
    }
    urlhandle.URL=objURL;
    return urlhandle;
}(URLHandle||{}));
var Urlobj = new URLHandle.URL(window.location.href);

// 模板下载限制 购买全站VIP提示点击记录
$('.down-limit .all-noLimit').on('click', function(){
    $.get('//ajax.588ku.com/?m=SponsorFunnel&a=update&mod=1&type=2&uid=' + globaluid);
})

// 模板下载限制 企业VIP点击购买提示点击记录
$('#compay').on('click', function(){
    if (Urlobj.get('mod') == 1) {
        $.get('//ajax.588ku.com/?m=SponsorFunnel&a=update&mod=1&type=4&uid=' + globalUid);
    }
});


//VIP当期提醒
$(function(){
    // 关闭vip到期提醒
    $(".expire-hint .switch-close-vip").on("click",function(){
        $("#vip-expire-hint").css("bottom","-260px").hide(100);
    })

    $('body').on('click','.down-big-img,.down-big-y',function(){
        if(!globaluid) {
            qqweixin();return false;
        }
        var cate_name = '';
        var cate_date = '';
        var cate_url  = '';
        var cate_type  = 0;
        var type = $(this).attr('type');

        var myDate = new Date();
        var date = myDate.toLocaleDateString();

        var is_com_vip =  parseInt($("#vip-expire-hint").find(".hidden-companyvip-hint").val());

        if(is_com_vip == 1){
            if(type == 1){
                cate_type=2;
                cate_name = '背景VIP';
                cate_date = parseInt($("#vip-expire-hint").find(".hidden-dsvip-hint").val());
                cate_url = '//588ku.com/?m=ProSponsorN&t=2&proType=2&cj=11';
                var cookie_key = 'dsvip'+date;
                var is_show_vip_drop = CookieHandle.getCookie(cookie_key);
                if(cate_date <= 7) {
                    if (is_show_vip_drop) {
                    } else {
                        completeVipHint(cate_type, cate_name, cate_date, cate_url);
                        $(".expire-hint").stop().show().animate({"bottom": "0"});
                        CookieHandle.setCookie(cookie_key, 1);
                    }
                }

            }else if(type == 2){  //模板
                cate_type=3;
                cate_name = '模板VIP';
                cate_date = parseInt($("#vip-expire-hint").find(".hidden-mbvip-hint").val());
                cate_url = '//588ku.com/?m=ProSponsorN&t=3&proType=2&cj=11';
                var cookie_key = 'mbvip'+date;
                var is_show_vip_drop = CookieHandle.getCookie(cookie_key);
                if(cate_date <= 7) {
                    if (is_show_vip_drop) {
                    } else {
                        completeVipHint(cate_type, cate_name, cate_date, cate_url);
                        $(".expire-hint").stop().show().animate({"bottom": "0"});
                        CookieHandle.setCookie(cookie_key, 1);
                    }
                }

            }else{  //元素
                cate_type=1;
                cate_name = '元素VIP';
                cate_date = parseInt($("#vip-expire-hint").find(".hidden-ysvip-hint").val());
                cate_url = '//588ku.com/?m=ProSponsorN&proType=2&cj=11';
                var cookie_key = 'ysvip'+date;
                var is_show_vip_drop = CookieHandle.getCookie(cookie_key);
                if(cate_date <= 7) {
                    if (is_show_vip_drop) {
                    } else {
                        completeVipHint(cate_type, cate_name, cate_date, cate_url);
                        $(".expire-hint").stop().show().animate({"bottom": "0"});
                        CookieHandle.setCookie(cookie_key, 1);
                    }
                }
            }
        }
    });

})

//模板兼容下载按钮

$('body').on('click','#download-btn,.download-newPPT',function(){
    if(!globaluid) {
        qqweixin();return false;
    }
    var is_com_vip =  parseInt($("#vip-expire-hint").find(".hidden-companyvip-hint").val());

    if(is_com_vip == 1){
        var myDate = new Date();
        var date = myDate.toLocaleDateString();
        var cate_name = '';
        var cate_date = '';
        var cate_url  = '';
        var cate_type  = 0;
        cate_type=3;
        cate_name = '模板VIP';
        cate_date = parseInt($("#vip-expire-hint").find(".hidden-mbvip-hint").val());
        cate_url = '//588ku.com/?m=ProSponsorN&t=3&proType=2&cj=11';
        var cookie_key = 'mbvip'+date;
        var is_show_vip_drop = CookieHandle.getCookie(cookie_key);
        if(cate_date <= 7) {
            if (is_show_vip_drop) {
            } else {
                completeVipHint(cate_type, cate_name, cate_date, cate_url);
                $(".expire-hint").stop().show().animate({"bottom": "0"});
                CookieHandle.setCookie(cookie_key, 1);
            }
        }
    }
});

/*提醒显示*/
function completeVipHint(cate_type,cate_name,cate_date,cate_url){
    $("#vip-expire-hint").find(".vip-cate-name").html(cate_name);
    $("#vip-expire-hint").find(".vip-cate-date").html(cate_date);
    $("#vip-expire-hint").find(".renew-btn").attr('href',cate_url);
    $.ajax({
        url:'//ajax.588ku.com/?m=BruthAjax&a=vipTotal',
        data:{'vip_type':cate_type},
        dataType:'jsonp',
        xhrFields:{widthCredentials:true},
        success:function(data){
        }
    })
}

/*搜索页右侧倒流广告js*/
$(function(){
    /*屏幕大于1850出现广告*/
    $(window).resize(function(){
        var _width = $(document).width();
        if(_width >= 1850){
            $(".advert-sideBar").show();
        }else{
            $(".advert-sideBar").hide();
        }
    })
    $('body').on('click','.advert-sideBar .close-btn', function(){
        $('.advert-sideBar').hide();
        var cookie_key = 'closead';
        CookieHandle.setCookie(cookie_key, 1, 86400);
    })
})
/*右侧js*/
$(function(){
    window.onload=function(){
        resizeWindow();
    };
    $(window).resize(function(){
        resizeWindow();
    });
    function resizeWindow(){
        var winH = $(window).height();
        var sideBar = $(".side-barBox").height();
        $(".side-barBox").css('height',winH+'px');
        $(".bar-menu-top").css('top',winH-'px');
        if(sideBar<=720){
            $(".bar-menu-top").addClass("fix");
        }else{
            $(".bar-menu-top").removeClass("fix");
        }
    }
})

/*下载弹窗限制js*/
$(function(){
    $(".down-limitPublic .cancel,.upload-vip").on("click",function(){
        $(this).parent().hide();
        $('.down-limit').hide();
    })
    $(".down-limitPublic .know-btn").on("click",function(){
        $(this).parent().hide();
        $('.down-limit').hide();
    })
    $(".script-warn-wd").on("click",function(){
        $(this).hide();
        $('.down-limit').hide();
    })
})


$(function(){

//      Login.userBindPhone();


    //js进行60秒倒计时
    function jssendMessageTime(obj){
        var time=60;
        is_send = false;
        var t = setInterval(function () {
            time--;
            obj.html(time + 's后重新发送');
            if (time == 0) {
                clearInterval(t);
                obj.html("重新发送");
                is_send = true;
            }
        }, 1000)

    }
    //加载图标
    function changeStatus(obj,txt,addition){
        if(addition){
            obj.html('<em class="loading-icon"></em>');
        }else{
            obj.html(txt);
        }
    }


    //手机号输入验证
    $(".phone-input").blur(function(){
        var registerB = /^[1][34578][0-9]{9}$/;
        var putVal = $(this).val();
        if(!registerB.test(putVal)){
            $(this).siblings(".error-info").html("<em></em>请输入有效的手机号码").show();
        }else{
            $(this).siblings(".error-info").hide();  //手机输入成功
        }
    });


    //登录 验证码点击
    $("#user-login-box .send-code").click(function(){
        var that = $(this);
        var phone = that.parent().parent().find(".phone-input").val();  //手机号
        var error_obj = that.parent().parent().find(".error-info");
        var registerB = /^[1][34578][0-9]{9}$/;

        if(!registerB.test(phone)){
            error_obj.html("<em></em>请输入有效的手机号码").show();
            console.log(phone);
        }else{
            console.log(1111);
            error_obj.hide();  //手机输入成功
            if(is_send){   //可以发送

                $.ajax({
                    type: "post",
                    url: "/index.php?m=LoginPhoneNew&a=sendMessageLogin",  //加载到对应的模块
                    data: {'phone': phone},
                    dataType: 'json',
                    success: function (data) { //
                        console.log(data);
                        if (data.status == 1) {
                            //第二步验证
                            jssendMessageTime(that);
                            that.parent().find(".correct-info").show();  //短信已经发送提示
                        }
                        if (data.status <= 0) {
                            error_obj.html("<em></em>" + data.info).show();
                        }
                        if(data.status == 10){
                            console.log(1111);
                            console.log(data.status);
                            console.log(data.info);
                            console.log(222);
                            error_obj.html(data.info+"<a class='return-qqWx-hint' href='javascript:;' onclick=Login.phoneLogin();>返回QQ/微信登录</a>").show();
                        }
                    }
                });

            }
        }
    });

    //直接登录按钮点击
    $("#user-login-box .login-btn").click(function(){
        var that  = $(this);
        var cango = $(this).hasClass("on");
        var phone = that.parent().find(".phone-input").val();     //手机号
        var code  = that.parent().find(".code-input").val();       //验证码
        var error_obj = that.parent().find(".error-info");
        if(cango) {

            changeStatus(that,'登录',1);
            $.ajax({
                type: "post",
                url: "/index.php?m=LoginPhoneNew&a=userLogin",  //加载到对应的模块
                data: {'phone': phone, 'code': code},
                dataType: 'json',
                success: function (data) { //
//                      console.log(data);
                    if (data.status == 1) {
                        location.reload();
                    }
                    if (data.status <= 0) {
                        error_obj.html("<em></em>" + data.info).show();
                        changeStatus(that,'登录',0);
                    }
                }
            });
        }
    });


    //绑定手机号
    //登录 验证码点击
    $("#user-bind-box .send-code").click(function(){
        var that = $(this);
        var phone = that.parent().parent().find(".phone-input").val();  //手机号
        var error_obj = that.parent().parent().find(".error-info");
        var registerB = /^[1][34578][0-9]{9}$/;

        if(!registerB.test(phone)){
            error_obj.html("<em></em>请输入有效的手机号码").show();
        }else{
            error_obj.hide();  //手机输入成功
            if(is_send){   //可以发送

                $.ajax({
                    type: "post",
                    url: "/index.php?m=LoginPhoneNew&a=sendMessageBind",  //加载到对应的模块
                    data: {'phone': phone},
                    dataType: 'json',
                    success: function (data) { //
//                      console.log(data);
                        if (data.status == 1) {
                            //第二步验证
                            jssendMessageTime(that);
                            that.parent().find(".correct-info").show();  //短信已经发送提示
                        }
                        if (data.status <= 0) {
                            error_obj.html("<em></em>" + data.info).show();
                        }

                    }
                });

            }
        }
    });


    //绑定按钮登录
    $("#user-bind-box .login-btn").click(function(){
        var that  = $(this);
        var cango = $(this).hasClass("on");
        var phone = that.parent().find(".phone-input").val();     //手机号
        var code  = that.parent().find(".code-input").val();       //验证码
        var uid  = that.attr('data-uid');       //验证码
        var error_obj = that.parent().find(".error-info");
        if(cango) {

            changeStatus(that,'提交',1);
            $.ajax({
                type: "post",
                url: "/index.php?m=LoginPhoneNew&a=userBind",  //加载到对应的模块
                data: {'phone': phone, 'code': code,'uid':uid},
                dataType: 'json',
                success: function (data) { //
//                      console.log(data);
                    if (data.status == 1) {
                        location.reload();
                    }
                    if (data.status <= 0) {
                        error_obj.html("<em></em>" + data.info).show();
                        changeStatus(that,'提交',0);
                    }
                }
            });
        }
    });


    //验证码输入 是下面的按钮亮
    $(".code-input").keyup(function(){
        var  securityC = $(this).val().length;
        if(securityC == 6){
            $(this).parent().parent().find(".login-btn").addClass("on");
        }else{
            $(this).parent().parent().find(".login-btn").removeClass("on");
        }
    })

    //输入框获得焦点
    $(".phone-loginbox input").focus(function(){
        $(this).css("border-color","#0063cd");
    });

    // 失去焦点边框变色
    $(".phone-loginbox input").blur(function(){
        $(this).css("border-color","#dddddd");
    })

    //关闭×号按钮
    $(".switch-close").on("click",function(){
        $(this).parent().parent().parent().hide();
        Cookie.setCookie('temp_login_flag2',null);
    })
    //从手机登录框 返回qq微信登录
    $(".return-qqWechat").on("click",function(){
        Login.phoneLogin();
    })

    //qq微信登录框到手机登录框
    $(".phone-login").on("click",function(){
        Login.phoneSingleLogin();
    })


    //搜索悬浮框js start
    $(function(){
        if(modelName == 'BackgroundGallery'){
            if(isindex == 1){
                $(function(){
                    $(".search-tab li").on("click",function(){
                        var element = $(this).hasClass("element-search");
                        var background = $(this).hasClass("background-search");
                        var model = $(this).hasClass("model-search");
                        var wordart = $(this).hasClass("wordart-search");
                        var val = $("#topkeyword").val();
                        var isSearchTab = true;
                        $(this).addClass("selected").siblings().removeClass("selected");
                        if(element){

                            $(".element-h2").show().siblings().hide();
                            $(".search-con .search-btnTab .element").show().siblings().hide();
                            $(".search-con .search").removeClass("background model wordart").addClass("element");
                            $(".search-con .search-sug").removeClass("background model wordart").addClass("element");
                            $('#topkeyword').attr('placeholder', "共 "+ element_num +" 张 / 昨日更新"+ yday_up_element +"张");
                            $('#topkeyword').attr('data-index', 5);

                            $('#btn-search').html('<i></i>搜元素');
                            $('#btn-search').addClass('element');
                            $('#btn-search').removeClass('background model');
                            $('#btn-search').css('background-color', '#0082df');
                            $('#btn-search').attr('data-index', 5);

                            $.getJSON(domainUrl+'/?m=element&a=searchHistory', function(result) {
                                reloadHotWords(result, 'element');
                            });
                            doSearch(val, 5, isSearchTab);
                        }else if(background){

                            $(".background-h2").show().siblings().hide();
                            $(".search-con .search-btnTab .background").show().siblings().hide();
                            $(".search-con .search").removeClass("element model wordart").addClass("background");
                            $(".search-con .search-sug").removeClass("element model wordart").addClass("background");
                            $('#topkeyword').attr('placeholder', "共"+ back_num +" 张 / 昨日更新"+ yday_up_back+"张");
                            $('#topkeyword').attr('data-index', "0");

                            $('#btn-search').html('<i></i>搜背景');
                            $('#btn-search').addClass('background');
                            $('#btn-search').removeClass('element model');
                            $('#btn-search').css('background-color', '#dd0000');
                            $('#btn-search').attr('data-index', "0");

                            $.getJSON(domainUrl+'/?m=BackgroundGallery&a=searchHistory', function(result) {
                                reloadHotWords(result, 'background');
                            });
                            doSearch(val, 0, isSearchTab);
                        }else if(model){

                            $(".model-h2").show().siblings().hide();
                            $(".search-con .search-btnTab .model").show().siblings().hide();
                            $(".search-con .search").removeClass("element background wordart").addClass("model");
                            $(".search-con .search-sug").removeClass("element background wordart").addClass("model");
                            $('#topkeyword').attr('placeholder', "共 "+templet_num+" 张 / 昨日更新"+yday_up_templet+"张");
                            $('#topkeyword').attr('data-index', 11);

                            $('#btn-search').html('<i></i>搜模板');
                            $('#btn-search').addClass('model');
                            $('#btn-search').removeClass('element background');
                            $('#btn-search').css('background-color', '#ff7200');
                            $('#btn-search').attr('data-index', 11);

                            $.getJSON(domainUrl+'/?m=Templet&a=searchHistory', function(result) {
                                reloadHotWords(result, 'templet');
                            });
                            doSearch(val, 11, isSearchTab);
                        }else if(wordart){

                            $(".wordart-h2").show().siblings().hide();
                            $(".search-con .search-btnTab .wordart").show().siblings().hide();
                            $(".search-con .search").removeClass("background model element").addClass("wordart");
                            $(".search-con .search-sug").removeClass("background model element").addClass("wordart");
                            $('#topkeyword').attr('placeholder', "共 " + art_num + " 张 / 昨日更新" + yday_up_art + "张");
                            $('#topkeyword').attr('data-index', 23);

                            $('#btn-search').html('<i></i>搜艺术字');
                            $('#btn-search').addClass('wordart');
                            $('#btn-search').removeClass('background model element');
                            $('#btn-search').css('background-color', '#009eb9');
                            $('#btn-search').attr('data-index', 23);

                            $.getJSON(domainUrl + '/?m=WordArt&a=searchHistory', function (result) {
                                reloadHotWords(result, 'wordart');
                            });
                            doSearch(val, 23,isSearchTab);
                        }else{
                            return;
                        }
                    })
                    // 新版搜索框升级提醒关闭
                    $(".new-search-opacityBox a").on("click",function(){
                        $(this).parents(".new-search-opacityBox").hide();
                    })

                    function reloadHotWords(data, type) {
                        var retStr = stype = lastm = '';
                        if (data.data.search_log.length != 0) {
                            if (type == 'element') {
                                stype = 'image';
                            } else if(type == 'wordart'){

                                stype = 'yishuzi';

                            }else if(type == 'illus'){
                                stype = 'chahua';
                            }else {
                                stype = 'tuku';
                            }
                            if (type == 'templet') {
                                lastm = '-moban';
                            }
                            var searchLog = data.data.search_log;
                            retStr = '<div class="search-log"><ul class="clearfix"><li class="recent-search">最近搜索：</li>';
                            for (var i in searchLog) {
                                retStr += '<li><a href="'+domainUrl+'/' + stype + '/' + searchLog[i]['pinyin'] + lastm + '.html" onclick="search_static(1)">' + searchLog[i]['keyword'] + '</a></li>';
                            }
                            retStr += '</ul></div>';
                        }
                        if (data.data.hotwords) {
                            var hotwords = data.data.hotwords;
                            for (var j in hotwords) {
                                var extendw = addone = '';
                                if (j > 8) {
                                    break;
                                }
                                if (j <= 2) {
                                    extendw = 'hot';
                                }
                                addone = (j+1);
                                retStr += '<ul class="sokeyup_1 '+extendw+' data-id="'+addone+'" id="u_'+addone+'"><li class="sokeyup_2" id="l_' + addone + '">' + hotwords[j]['hot_word'] + '</li>';

                                retStr += '<li class="sokeyup_3" id="r_' + addone + '">' + hotwords[j]['total'] + ' 结果</li>';

                                retStr += '</ul>';
                            }
                        }
                        $('#hot-search').html(retStr);
                        $('.search-sug').html(retStr);
                    }
                })
            }else{
                $(function(){
                    $(".search-tab li").on("click",function(){
                        var element = $(this).hasClass("element-search");
                        var background = $(this).hasClass("background-search");
                        var model = $(this).hasClass("model-search");
                        var wordart = $(this).hasClass("wordart-search");
                        var val = $("#topkeyword").val();
                        var isSearchTab = true;
                        $(this).addClass("selected").siblings().removeClass("selected");
                        if(element){

                            $(".element-h2").show().siblings().hide();
                            $(".search-con .search-btnTab .element").show().siblings().hide();
                            $(".search-con .search").removeClass("background model wordart").addClass("element");
                            $(".search-con .search-sug").removeClass("background model wordart").addClass("element");
                            $('#topkeyword').attr('placeholder', "共 "+ element_num +" 张 / 昨日更新"+ yday_up_element +"张");
                            $('#topkeyword').attr('data-index', 5);

                            $('#btn-search').html('<i></i>搜元素');
                            $('#btn-search').addClass('element');
                            $('#btn-search').removeClass('background model');
                            $('#btn-search').css('background-color', '#0082df');
                            $('#btn-search').attr('data-index', 5);

                            $.getJSON(domainUrl+'/?m=element&a=searchHistory', function(result) {
                                reloadHotWords(result, 'element');
                            });
                            doSearch(val, 5, isSearchTab);
                        }else if(background){

                            $(".background-h2").show().siblings().hide();
                            $(".search-con .search-btnTab .background").show().siblings().hide();
                            $(".search-con .search").removeClass("element model wordart").addClass("background");
                            $(".search-con .search-sug").removeClass("element model wordart").addClass("background");
                            $('#topkeyword').attr('placeholder', "共"+ back_num +" 张 / 昨日更新"+ yday_up_back+"张" );
                            $('#topkeyword').attr('data-index', "{$searchIndex}");

                            $('#btn-search').html('<i></i>搜背景')
                            $('#btn-search').addClass('background');
                            $('#btn-search').removeClass('element model');
                            $('#btn-search').css('background-color', '#dd0000');
                            $('#btn-search').attr('data-index', "{$searchIndex}");

                            $.getJSON(domainUrl+'/?m=BackgroundGallery&a=searchHistory', function(result) {
                                reloadHotWords(result, 'background');
                            });
                            doSearch(val, 0, isSearchTab);
                        }else if(model){

                            $(".model-h2").show().siblings().hide();
                            $(".search-con .search-btnTab .model").show().siblings().hide();
                            $(".search-con .search").removeClass("element background wordart").addClass("model");
                            $(".search-con .search-sug").removeClass("element background wordart").addClass("model");
                            $('#topkeyword').attr('placeholder',"共 "+templet_num+" 张 / 昨日更新"+yday_up_templet+"张");
                            $('#topkeyword').attr('data-index', 11);

                            $('#btn-search').html('<i></i>搜模板');
                            $('#btn-search').addClass('model');
                            $('#btn-search').removeClass('element background');
                            $('#btn-search').css('background-color', '#ff7200');
                            $('#btn-search').attr('data-index', 11);

                            $.getJSON(domainUrl+'/?m=Templet&a=searchHistory', function(result) {
                                reloadHotWords(result, 'templet');
                            });
                            doSearch(val, 11, isSearchTab);
                        }else if(wordart){

                            $(".wordart-h2").show().siblings().hide();
                            $(".search-con .search-btnTab .wordart").show().siblings().hide();
                            $(".search-con .search").removeClass("background model element").addClass("wordart");
                            $(".search-con .search-sug").removeClass("background model element").addClass("wordart");
                            $('#topkeyword').attr('placeholder', "共 " + art_num + " 张 / 昨日更新" + yday_up_art + "张");
                            $('#topkeyword').attr('data-index', 23);

                            $('#btn-search').html('<i></i>搜艺术字');
                            $('#btn-search').addClass('wordart');
                            $('#btn-search').removeClass('background model element');
                            $('#btn-search').css('background-color', '#009eb9');
                            $('#btn-search').attr('data-index', 23);

                            $.getJSON(domainUrl + '/?m=WordArt&a=searchHistory', function (result) {
                                reloadHotWords(result, 'wordart');
                            });
                            doSearch(val, 23, isSearchTab);
                        }else{
                            return;
                        }
                    })
                    // 新版搜索框升级提醒关闭
                    $(".new-search-opacityBox a").on("click",function(){
                        $(this).parents(".new-search-opacityBox").hide();
                    })

                    function reloadHotWords(data, type) {
                        var retStr = stype = lastm = '';
                        if (data.data.search_log.length != 0) {
                            if (type == 'element') {
                                stype = 'image';
                            } else if(type == 'wordart'){

                                stype = 'yishuzi';

                            }else if(type == 'illus'){
                                stype = 'chahua';
                            }else {
                                stype = 'tuku';
                            }
                            if (type == 'templet') {
                                lastm = '-moban';
                            }
                            var searchLog = data.data.search_log;
                            retStr = '<div class="search-log"><ul class="clearfix"><li class="recent-search">最近搜索：</li> ';
                            for (var i in searchLog) {
                                retStr += '<li><a href="'+domainUrl+'/' + stype + '/' + searchLog[i]['pinyin'] + lastm + '.html" onclick="search_static(1)">' + searchLog[i]['keyword'] + '</a></li>';
                            }
                            retStr += '</ul></div>';
                        }
                        if (data.data.hotwords) {
                            var hotwords = data.data.hotwords;
                            for (var j in hotwords) {
                                var extendw = addone = '';
                                if (j > 8) {
                                    break;
                                }
                                if (j <= 2) {
                                    extendw = 'hot';
                                }
                                addone = (j+1);
                                retStr += '<ul class="sokeyup_1 '+extendw+' data-id="'+addone+'" id="u_'+addone+'"><li class="sokeyup_2" id="l_' + addone + '">' + hotwords[j]['hot_word'] + '</li>';

                                retStr += '<li class="sokeyup_3" id="r_' + addone + '">' + hotwords[j]['total'] + ' 结果</li>';

                                retStr += '</ul>';
                            }
                        }
                        $('#hot-search').html(retStr);
                        $('.search-sug').html(retStr);
                    }
                })
            }
        }else if(modelName == 'Templet'){
            $(function(){
                $(".search-tab li").on("click",function(){
                    var element = $(this).hasClass("element-search");
                    var background = $(this).hasClass("background-search");
                    var model = $(this).hasClass("model-search");
                    var wordart = $(this).hasClass("wordart-search");
                    var val = $("#topkeyword").val();
                    var isSearchTab = true;
                    $(this).addClass("selected").siblings().removeClass("selected");
                    if(element){
                        $(".element-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .element").show().siblings().hide();
                        $(".search-con .search").removeClass("background model wordart").addClass("element");
                        $(".search-con .search-sug").removeClass("background model wordart").addClass("element");
                        $('#topkeyword').attr('placeholder', "共 "+ element_num +" 张 / 昨日更新"+ yday_up_element +"张");
                        $('#topkeyword').attr('data-index', 5);

                        $('#btn-search').html('<i></i>搜元素');
                        $('#btn-search').addClass('element');
                        $('#btn-search').removeClass('background model');
                        $('#btn-search').css('background-color', '#0082df');
                        $('#btn-search').attr('data-index', 5);

                        $.getJSON(domainUrl+'/?m=element&a=searchHistory', function(result) {
                            reloadHotWords(result, 'element');
                        });
                        doSearch(val, 5, isSearchTab);
                    }else if(background){
                        $(".background-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .background").show().siblings().hide();
                        $(".search-con .search").removeClass("element model wordart").addClass("background");
                        $(".search-con .search-sug").removeClass("element model wordart").addClass("background");
                        $('#topkeyword').attr('placeholder',  "共"+ back_num +" 张 / 昨日更新"+ yday_up_back+"张");
                        $('#topkeyword').attr('data-index', 0);

                        $('#btn-search').html('<i></i>搜背景')
                        $('#btn-search').addClass('background');
                        $('#btn-search').removeClass('element model');
                        $('#btn-search').css('background-color', '#dd0000');
                        $('#btn-search').attr('data-index', 0);

                        $.getJSON(domainUrl+'/?m=BackgroundGallery&a=searchHistory', function(result) {
                            reloadHotWords(result, 'background');
                        });
                        doSearch(val, 0,isSearchTab);
                    }else if(model){
                        $(".model-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .model").show().siblings().hide();
                        $(".search-con .search").removeClass("element background wordart").addClass("model");
                        $(".search-con .search-sug").removeClass("element background wordart").addClass("model");
                        $('#topkeyword').attr('placeholder', "共 " + art_num + " 张 / 昨日更新" + yday_up_art + "张");
                        $('#topkeyword').attr('data-index', 11);

                        $('#btn-search').html('<i></i>搜模板');
                        $('#btn-search').addClass('model');
                        $('#btn-search').removeClass('element background');
                        $('#btn-search').css('background-color', '#ff7200');
                        $('#btn-search').attr('data-index', 11);

                        $.getJSON(domainUrl+'/?m=Templet&a=searchHistory', function(result) {
                            reloadHotWords(result, 'templet');
                        });
                        doSearch(val, 11, isSearchTab);
                    }else if(wordart){
                        $(".wordart-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .wordart").show().siblings().hide();
                        $(".search-con .search").removeClass("background model element").addClass("wordart");
                        $(".search-con .search-sug").removeClass("background model element").addClass("wordart");
                        $('#topkeyword').attr('placeholder', "共 " + art_num + " 张 / 昨日更新" + yday_up_art + "张");
                        $('#topkeyword').attr('data-index', 23);

                        $('#btn-search').html('<i></i>搜艺术字');
                        $('#btn-search').addClass('wordart');
                        $('#btn-search').removeClass('background model element');
                        $('#btn-search').css('background-color', '#009eb9');
                        $('#btn-search').attr('data-index', 23);

                        $.getJSON(domainUrl + '/?m=WordArt&a=searchHistory', function (result) {
                            reloadHotWords(result, 'wordart');
                        });
                        doSearch(val, 23, isSearchTab);
                    }else{
                        return;
                    }
                })
                // 新版搜索框升级提醒关闭
                $(".new-search-opacityBox a").on("click",function(){
                    $(this).parents(".new-search-opacityBox").hide();
                })

                function reloadHotWords(data, type) {
                    var retStr = stype = lastm = '';
                    if (data.data.search_log.length != 0) {
                        if (type == 'element') {
                            stype = 'image';
                        }else if(type == 'office') {
                            stype = 'ppt';
                        } else if(type == 'wordart'){

                            stype = 'yishuzi';

                        }else if(type == 'illus'){
                            stype = 'chahua';
                        }else {
                            stype = 'tuku';
                        }
                        if (type == 'templet') {
                            lastm = '-moban';
                        }
                        var searchLog = data.data.search_log;
                        retStr = '<div class="search-log"><ul class="clearfix"><li class="recent-search">最近搜索：</li> ';
                        for (var i in searchLog) {
                            retStr += '<li><a href="'+domainUrl+'/' + stype + '/' + searchLog[i]['pinyin'] + lastm + '.html" onclick="search_static(1)">' + searchLog[i]['keyword'] + '</a></li>';
                        }
                        retStr += '</ul></div>';
                    }
                    if (data.data.hotwords) {
                        var hotwords = data.data.hotwords;
                        for (var j in hotwords) {
                            var extendw = addone = '';
                            if (j > 8) {
                                break;
                            }
                            if (j <= 2) {
                                extendw = 'hot';
                            }
                            addone = (j+1);
                            retStr += '<ul class="sokeyup_1 '+extendw+' data-id="'+addone+'" id="u_'+addone+'"><li class="sokeyup_2" id="l_' + addone + '">' + hotwords[j]['hot_word'] + '</li>';

                            retStr += '<li class="sokeyup_3" id="r_' + addone + '">' + hotwords[j]['total'] + ' 结果</li>';

                            retStr += '</ul>';
                        }
                    }
                    $('#hot-search').html(retStr);
                    $('.search-sug').html(retStr);
                }
            })
        }else{
            $(function(){
                $(".search-tab li").on("click",function(){
                    var element = $(this).hasClass("element-search");
                    var background = $(this).hasClass("background-search");
                    var model = $(this).hasClass("model-search");
                    var office = $(this).hasClass("office-search");
                    var wordart = $(this).hasClass("wordart-search");
                    var val = $("#topkeyword").val();
                    var isSearchTab = true;
                    $(this).addClass("selected").siblings().removeClass("selected");
                    if(element){
                        $(".element-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .element").show().siblings().hide();
                        $(".search-con .search").removeClass("background model office wordart").addClass("element");
                        $(".search-con .search-sug").removeClass("background model office wordart").addClass("element");
                        $('#topkeyword').attr('placeholder', "共 "+ element_num +" 张 / 昨日更新"+ yday_up_element +"张");
                        $('#topkeyword').attr('data-index', 5);

                        $('#btn-search').html('<i></i>搜元素');
                        $('#btn-search').addClass('element');
                        $('#btn-search').removeClass('background model office');
                        $('#btn-search').css('background-color', '#0082df');
                        $('#btn-search').attr('data-index', 5);

                        $.getJSON(domainUrl+'/?m=element&a=searchHistory', function(result) {
                            reloadHotWords(result, 'element');
                        });
                        doSearch(val, 5, isSearchTab);
                    }else if(background){
                        $(".background-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .background").show().siblings().hide();
                        $(".search-con .search").removeClass("element model office wordart").addClass("background");
                        $(".search-con .search-sug").removeClass("element model office wordart").addClass("background");
                        $('#topkeyword').attr('placeholder', "共"+ back_num +" 张 / 昨日更新"+ yday_up_back+"张");
                        $('#topkeyword').attr('data-index', 0);

                        $('#btn-search').html('<i></i>搜背景')
                        $('#btn-search').addClass('background');
                        $('#btn-search').removeClass('element model office');
                        $('#btn-search').css('background-color', '#dd0000');
                        $('#btn-search').attr('data-index', 0);

                        $.getJSON(domainUrl+'/?m=BackgroundGallery&a=searchHistory', function(result) {
                            reloadHotWords(result, 'background');
                        });
                        doSearch(val, 0, isSearchTab);
                    }else if(model){
                        $(".model-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .model").show().siblings().hide();
                        $(".search-con .search").removeClass("element background office wordart").addClass("model");
                        $(".search-con .search-sug").removeClass("element background office wordart").addClass("model");
                        $('#topkeyword').attr('placeholder', "共 "+templet_num+" 张 / 昨日更新"+yday_up_templet+"张");
                        $('#topkeyword').attr('data-index', 11);

                        $('#btn-search').html('<i></i>搜模板');
                        $('#btn-search').addClass('model');
                        $('#btn-search').removeClass('element background office');
                        $('#btn-search').css('background-color', '#ff7200');
                        $('#btn-search').attr('data-index', 11);

                        $.getJSON(domainUrl+'/?m=Templet&a=searchHistory', function(result) {
                            reloadHotWords(result, 'templet');
                        });
                        doSearch(val, 11, isSearchTab);
                    }else if(office){
                        $(".office-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .office").show().siblings().hide();
                        $(".search-con .search").removeClass("element background model wordart").addClass("office");
                        $(".search-con .search-sug").removeClass("element background model wordart").addClass("office");
                        $('#topkeyword').attr('placeholder', "共 "+office_num+" 张 / 昨日更新"+yday_up_office+"张");
                        $('#topkeyword').attr('data-index', 13);

                        $('#btn-search').html('<i></i>');
                        $('#btn-search').addClass('office');
                        $('#btn-search').removeClass('element background model');
                        $('#btn-search').css('background-color', '#ffc000');
                        $('#btn-search').attr('data-index', 13);

                        $.getJSON(domainUrl+'/?m=Office&a=searchHistory', function(result) {
                            reloadHotWords(result, 'office');
                        });
                        doSearch(val, 13, isSearchTab);
                    }else if(wordart) {
                        $(".wordart-h2").show().siblings().hide();
                        $(".search-con .search-btnTab .wordart").show().siblings().hide();
                        $(".search-con .search").removeClass("background model element office").addClass("wordart");
                        $(".search-con .search-sug").removeClass("background model element office").addClass("wordart");
                        $('#topkeyword').attr('placeholder', "共 " + art_num + " 张 / 昨日更新" + yday_up_art + "张");
                        $('#topkeyword').attr('data-index', 23);

                        $('#btn-search').html('<i></i>搜艺术字');
                        $('#btn-search').addClass('wordart');
                        $('#btn-search').removeClass('background model element');
                        $('#btn-search').css('background-color', '#009eb9');
                        $('#btn-search').attr('data-index', 23);

                        $.getJSON(domainUrl+'/?m=WordArt&a=searchHistory', function(result) {
                            reloadHotWords(result, 'wordart');
                        });
                        doSearch(val, 23, isSearchTab);
                    }else {
                        return;
                    }
                })
                // 新版搜索框升级提醒关闭
                $(".new-search-opacityBox a").on("click",function(){
                    $(this).parents(".new-search-opacityBox").hide();
                })

                function reloadHotWords(data, type) {
                    var retStr = stype = lastm = '';
                    if (data.data.search_log.length != 0) {
                        if (type == 'element') {
                            stype = 'image';
                        } else if(type == 'wordart'){

                            stype = 'yishuzi';

                        }else if(type == 'illus'){
                            stype = 'chahua';
                        }else {
                            stype = 'tuku';
                        }
                        if (type == 'templet') {
                            lastm = '-moban';
                        }
                        var searchLog = data.data.search_log;
                        retStr = '<div class="search-log"><ul class="clearfix"><li class="recent-search">最近搜索：</li> ';
                        for (var i in searchLog) {
                            retStr += '<li><a href="'+domainUrl+'/' + stype + '/' + searchLog[i]['pinyin'] + lastm + '.html" onclick="search_static(1)">' + searchLog[i]['keyword'] + '</a></li>';
                        }
                        retStr += '</ul></div>';
                    }
                    if (data.data.hotwords) {
                        var hotwords = data.data.hotwords;
                        for (var j in hotwords) {
                            var extendw = addone = '';
                            if (j > 8) {
                                break;
                            }
                            if (j <= 2) {
                                extendw = 'hot';
                            }
                            addone = (j+1);
                            retStr += '<ul class="sokeyup_1 '+extendw+' data-id="'+addone+'" id="u_'+addone+'"><li class="sokeyup_2" id="l_' + addone + '">' + hotwords[j]['hot_word'] + '</li>';
                            retStr += '<li class="sokeyup_3" id="r_' + addone + '">' + hotwords[j]['total'] + ' 结果</li>';
                            retStr += '</ul>';
                        }
                    }
                    $('#hot-search').html(retStr);
                    $('.search-sug').html(retStr);
                }
            })
        }

        function reloadHotWords(data, type) {
            var retStr = stype = lastm = '';
            if (data.data.search_log.length != 0) {
                if (type == 'element') {
                    stype = 'image';
                } else if(type == 'wordart'){

                    stype = 'yishuzi';

                }else if(type == 'illus'){
                    stype = 'chahua';
                }else {
                    stype = 'tuku';
                }
                if (type == 'templet') {
                    lastm = '-moban';
                }
                var searchLog = data.data.search_log;
                retStr = '<div class="search-log"><ul class="clearfix"><li class="recent-search">最近搜索：</li> ';
                for (var i in searchLog) {
                    retStr += '<li><a href="'+domainUrl+'/' + stype + '/' + searchLog[i]['pinyin'] + lastm + '.html" onclick="search_static(1)">' + searchLog[i]['keyword'] + '</a></li>';
                }
                retStr += '</ul></div>';
            }
            if (data.data.hotwords) {
                var hotwords = data.data.hotwords;
                for (var j in hotwords) {
                    var extendw = addone = '';
                    if (j > 8) {
                        break;
                    }
                    if (j <= 2) {
                        extendw = 'hot';
                    }
                    addone = (j+1);
                    retStr += '<ul class="sokeyup_1 '+extendw+' data-id="'+addone+'" id="u_'+addone+'"><li class="sokeyup_2" id="l_' + addone + '">' + hotwords[j]['hot_word'] + '</li>';
                    retStr += '<li class="sokeyup_3" id="r_' + addone + '">' + hotwords[j]['total'] + ' 结果</li>';
                    retStr += '</ul>';
                }
            }
            $('#hot-search').html(retStr);
            $('.search-sug').html(retStr);
        }
    })

    $(function(){
        $(".search-left").hover(function(){
            $(this).children(".current-selectOther").stop().slideDown('fast');
        },function(){
            $(this).children(".current-selectOther").stop().slideUp('fast');
        });
//         $(".search-left").mouseout(function(){
//            $(this).children(".current-selectOther").stop().slideUp('fast');
//        })
        /*赋值给文本框*/
        $(".current-selectOther li").click(function(){
            $('#topkeyword_float').attr('data-index', $(this).attr('data-index'));
            $('#btn-search-float').attr('data-index', $(this).attr('data-index'));

            if ($('#topkeyword_float').attr('data-index') == 0) {
                $('.search-sug-float').removeClass("element model wordart").addClass('background');
                if(modelName == 'BackgroundGallery'){
                    if(isindex == 1){
                        $('#topkeyword_float').attr('placeholder', "");
                    } else {
                        $('#topkeyword_float').attr('placeholder', "");
                    }
                } else if(modelName == 'Templet'){
                    $('#topkeyword_float').attr('placeholder', "");
                } else {
                    $('#topkeyword_float').attr('placeholder', "");
                }
            } else if ($('#topkeyword_float').attr('data-index') == 5) {
                $('.search-sug-float').removeClass("model background wordart").addClass('element');
                if(modelName == 'BackgroundGallery') {
                    if(isindex == 1){
                        $('#topkeyword_float').attr('placeholder', "");
                    } else {
                        $('#topkeyword_float').attr('placeholder', "");
                    }
                } else if(modelName == 'Templet'){
                    $('#topkeyword_float').attr('placeholder', "");
                } else {
                    $('#topkeyword_float').attr('placeholder', "");
                }
            } else if ($('#topkeyword_float').attr('data-index') == 11) {
                $('.search-sug-float').removeClass("element background wordart").addClass('model');
                if(modelName == 'BackgroundGallery') {
                    if(isindex == 1){
                        $('#topkeyword_float').attr('placeholder', "");
                    } else {
                        $('#topkeyword_float').attr('placeholder', "");
                    }
                } else if(modelName == 'Templet'){
                    $('#topkeyword_float').attr('placeholder', "");
                } else {
                    $('#topkeyword_float').attr('placeholder', "");
                }
            } else if ($('#topkeyword_float').attr('data-index') == 23) {
                $('.search-sug-float').removeClass("element background model").addClass('wordart');
                if (modelName == 'WordArt') {
                    if (isindex == 1) {
                        $('#topkeyword_float').attr('placeholder', "");
                    } else {
                        $('#topkeyword_float').attr('placeholder', "");
                    }
                } else if (modelName == 'Templet') {
                    $('#topkeyword_float').attr('placeholder', "");
                } else {
                    $('#topkeyword_float').attr('placeholder', "");
                }
            }

            $(this).parent().hide();
            var value=$(this).html();
            var valtag = $(".current-select").html();
            $(".current-select").html(value);
            $(this).hide().siblings().show();
            var ele = $(this).hasClass("element");
            var bg = $(this).hasClass("background");
            var mod = $(this).hasClass("model");
            var wa = $(this).hasClass("wordart");
            if(ele){
                $(".search-fixTop .search").removeClass("background model wordart").addClass("element");
                $(".search-fixTop .search-but").removeClass("background model wordart").addClass("element");
                $(".search-fixTop .search-sug").removeClass("background model wordart").addClass("element");
            }else if(bg){
                $(".search-fixTop .search").removeClass("element model wordart").addClass("background");
                $(".search-fixTop .search-but").removeClass("element model wordart").addClass("background");
                $(".search-fixTop .search-sug").removeClass("element model wordart").addClass("background");
            }else if(mod){
                $(".search-fixTop .search").removeClass("element background wordart").addClass("model");
                $(".search-fixTop .search-but").removeClass("element background wordart").addClass("model");
                $(".search-fixTop .search-sug").removeClass("element background wordart").addClass("model");
            }else if(wa) {
                $(".search-fixTop .search").removeClass("element background model").addClass("wordart");
                $(".search-fixTop .search-but").removeClass("element background model").addClass("wordart");
                $(".search-fixTop .search-sug").removeClass("element background model").addClass("wordart");
            }else{
                return;
            }
        })
    })

    $(function(){
        (function($){
            var tools={
                TimeOutRun:function (obj, Event, callBack, time) {
                    var timeOutId = "",
                        reStart = true;
                    obj.on(Event, function () {
                        clearTimeout(timeOutId);
                        if (reStart) {
                            timeOutRun(time)
                        }
                    });
                    function timeOutRun(time) {
                        reStart = false;
                        var timeOutId = setTimeout(function () {
                            reStart = true;
                            callBack()
                        }, time);
                    }
                },
                log:function(log){
                    if(window.console){}
                }
            };
            function FixedPointShow($el,config){
                var def = {
                    zIndex:100,        //Z轴
                    st:200               //滚动多少距离的时候出现导航
                };
                this.opts = $.extend(true,def,config);
                this.el = $el;
            }
            FixedPointShow.prototype = {
                scrollNav:function(){
                    var isOpen = false,This = this,
                        fixTopH = This['el'].outerHeight();

                    This['el'].css({"z-index":this.opts.zIndex});

                    tools.TimeOutRun($(window),"scroll",function(){
                        var st = $(this).scrollTop();
                        if(st > This.opts.st){
                            !isOpen && This.el.stop().animate({"top":0},400,function(){
                                $(this).show();
                                isOpen = true;
                            });
                        }else{
                            This.el.stop().animate({"top":-fixTopH-140},400,function(){
                                $(this).hide();
                                isOpen = false;
                            });
                        }
                        tools.log(st)
                    },200)
                }
            };
            FixedPointShow.prototype.constructor = FixedPointShow;
            $.extend($.fn,{
                fixedPointShow:function(config){
                    //IE6 返回
                    if(!("maxHeight" in document.createElement("div").style)){
                        $(this).remove();
                        return
                    }
                    var fixedPointNav = new FixedPointShow($(this));
                    fixedPointNav.scrollNav();
                    return this;
                }
            });
        }(jQuery));
        $('#btn-search-float').click(function(){
            var val = $("#topkeyword_float").val();
            var index = parseInt($(this).data('index'));
            doSearch(val,index);
        });
        $(".search-sug-float").on("click",".sokeyup_1",function() {
            var G = $(this).find(".sokeyup_2").text();
            $("#topkeyword_float").val(G);//输入到input框
            $("#btn-search-float").click();//提交数据
            $(".search-sug-float").hide();
        })
        $("#topkeyword_float").keyup(function(J) {
            var SI = $(this).attr('data-index');
            var sType = $(this).attr('data-type');
            if (!sType) {
                sType = "";
            }
            if (window.event) {
                var H = window.event.keyCode;
            } else {
                var H = J.which;
            }
            var I = $("#topkeyword_float");
            var G = I.width();
            if (H != 38 && H != 40 && H != 13) {
                var K = I.val();
                if (K == "") {
                    return false;
                }
                var L = "//ajax2.588ku.com/index.php?m=searchtips&a=search&kw=" + K + "&select_index=" + SI + "&type=" + sType + "&callback=?";
                $.getJSON(L, function(M) {
                    if (M != "") {
                        $(".search-sug-float").html(M).show();
                    } else {
                        $(".search-sug-float").hide();
                    }
                });
            }
        });

        $("#topkeyword_float").blur(function() {
            setTimeout('$(".search-sug-float").hide();', 500);
        });

        var D = 0;
        $("#topkeyword_float").keyup(function(H) {
            if (window.event) {
                var G = window.event.keyCode;
            } else {
                var G = H.which;
            }
            if (G != 38 && G != 40 && G != 13) {
                D = 0;
            } else {
                if ($(".search-sug-float").css("display") == "block") {
                    var I = $(".search-sug-float ul").length;
                    if (G == 38) {
                        D--;
                        if (D < 1) {
                            D = I;
                            C(D);
                            F(1);
                        } else {
                            F(D + 1);
                            C(D);
                        }
                        $("#topkeyword_float").val($("#l_" + D).html());
                        return false;
                    }
                    if (G == 40) {
                        D++;
                        if (D > I) {
                            D = 1;
                            C(1);
                            F(I);
                        } else {
                            F(D - 1);
                            C(D);
                        }
                        $("#topkeyword_float").val($("#l_" + D).html());
                        return false;
                    }
                    if (G == 13) {
                        var val = $("#topkeyword_float").val();
                        var index = parseInt($('#btn-search-float').data('index'));
                        doSearch(val,index);
                    }
                } else {
                    D = 0;
                }
            }
        });
    });

    $(function(){
        // 顶部悬浮搜索框
        $(".search-fixTop").fixedPointShow({
            zIndex:100,
            st:200
        });
        //$(window).scroll(function(){
        //    if ($('.search-fixTop').offset().top < 200) {
        //        $('.search-sug-float').slideUp();
        //    }
        //})
    })
    //搜索悬浮框end
})

$.fn.extend({
    searchFixTop:function(){
        var $this = $(this);
        $(window).scroll(function(){
            if($this.offset().top <200){
                $('.search-sug-float').slideUp();
            }
        });
    }
});

//VIP到期提醒弹窗
$(function(){
    $(".vip-expire-wd .close-btn").click(function(){
        $(this).parent().parent().parent().hide();
        var vip_class = $(this).attr('data-id');
        $.ajax({
            url:'/?m=ajax&a=cookievipexpire',
            data:{vip_class:vip_class},
            type: "post",
            dataType:'json',
            success:function(data){}

        })
    })
    //底部办公升级弹窗关闭
    $("#wpDialog .close-wppay").click(function () {
        $.ajax({
            url:'/?m=ajax&a=officedivprorecharhe',
            type: "post",
            dataType:'json',
            success:function(data){}

        })
    })
    // 左右侧边栏
    $(window).scroll(function(){
        if($(window).scrollTop()>100){
            $(".return-top").stop().fadeIn(500);
        }else{
            $(".return-top").stop().fadeOut(500);
        }
    })
    $("body").on("click", ".return-top", function () {
        var speed=400;
        $("body,html").stop().animate({
            scrollTop: 0
        }, speed);
        return false;
    })
})
function judgeScrollTop(num) {
    if ($(window).scrollTop() > num) {
        $("#left-slideBar").fadeIn(150);
    } else {
        $("#left-slideBar").fadeOut(150);
    }
}
function _judgeScrollTop(num) {
    return function () {
        judgeScrollTop(num);
    }
}

function rnzszzmc(){
    setTimeout('$(".qtvip-dl-btn").remove()',1e3);
    setTimeout('$(".qtvip-dl-btn").remove()',1.02e3);
    setTimeout('$(".qtvip-dl-btn").remove()',1010);
    setTimeout('$(".qtvip-dl-btn").remove()',1050);
    setTimeout('$(".qtvip-dl-btn").remove()',1100);
    $(".ikrong-musicdownload").remove();
    $("#play11").remove();
    $("#down11").remove();
}

// 统计qq加群人数
function joinqqGroupStat() {
    $.post('/?m=ajax&a=clickAddGroup', function () {
        return true;
    }, 'json');
}
$("#regCheckBtn").on("click", function () {
    $(".regCheckHint").show();
    setTimeout(function () {
        $(".regCheckHint").stop().fadeOut();
    }, 2000)
});
// 摄图用户弹窗广告
$(function(){
    $("body").on("click","#popup-st-user-popup .advert-public-wd .close-btn",function(){
        $(this).parent().parent().hide().parent().hide();
        $.get('/?m=Popup&a=stClosePopup',{'sign':1});
    });

    $("body").on("click","#popup-st-user-popup .advert-public-wd .got-it",function(){
        $(this).parent().hide().parent().hide();
        $.get('/?m=Popup&a=stClosePopup',{'sign':2});
    });

    $('body').on('click','#popup-st-user-popup img',function(){
        var url = $(this).attr('data-url');
        $(this).parent().parent().hide().parent().hide();
        $.get('/?m=Popup&a=stClosePopup',{'sign':2});
        window.open(url);
    });

    var param_hd = GetQueryString('hd');
    var param_sem = GetQueryString('sem');

    if (param_sem > 0 || param_sem == 1 || param_sem == 2 || param_hd == 111 || param_hd == 127 || param_hd == 129) {
        if(CookieHandle.getCookie('user_sem_source') == null && param_sem > 0){
            CookieHandle.setCookie('user_sem_source',param_sem,3);
        }
        CookieHandle.setCookie("699pic_popup_lock", 1 ,30);
        if (CookieHandle.getCookie('user_source') != 'sem') {
            // sem来源
            CookieHandle.setCookie('user_source','sem',365);
        }
        return true;
    }


    // 获取url参数
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
});


function originalSingle(id, type, comb){
    var add = type == 'zip' ? 'Psd' : '';
    picDown('/?m=Original&a=download'+add+'&id='+id);
    return false;
    $.ajax({
        url: '/?m=Original&a=checkSingleDown',
        data: {id: id},
        type: 'post',
        dataType: 'json',
        success:function(data){
            if(data.status == 0){
                picDown('/?m=Original&a=download'+add+'&id='+id);
            }else if(data.status == -4){
                $("#origin-vip-limit").closest('.down-limit').show();
                $("#origin-vip-limit").show();
            }else{
                $.ajax({
                    url:'?m=OriginalPay&a=wxQrcode',
                    data:{id: id, 'pay-money': 1, 'pay-type': 'wx'},
                    type: "post",
                    dataType:'json',
                    success:function(datas){
                        if(datas.status == 0){
                            $('.org-oneYuan-content .wx img').attr('src', datas.data.qrcode);
                            $('.org-oneYuan-content .wx img').attr('data-order', datas.data.order_no);
                            $('.org-oneYuan-content .wx img').attr('data-id', id);
                            $('.org-oneYuan-content .wx img').attr('data-type', type);
                            t1 =window.setInterval(update_native_state,2000);
                        }
                    }
                });

                $('.org-oneYuan-content .alipay input').attr('data-url','//588ku.com/?m=OriginalPay&a=alipay&id='+id+'&pay-money=1&pay-type=ali');
                $('.org-oneYuan-wd').parent('.down-limit').show();
                $.ajax({
                    url:'//ajax.588ku.com?m=ajax&a=originalSingle',
                    data:{},
                    type: "get",
                    dataType:'json',
                    success:function(datas){}
                });
            }
        }
    });
}

// VIP下拉自动展开
function vipGatherSlide(){
    $("#vipGatherDrop").stop().slideDown(1000);
}

$('.down-limit .org-oneYuan-wd .orgWd-close').click(function(){
    $('.org-oneYuan-content .wx img').attr('src', '//static.588ku.com/comp/original/images/qr-scan.gif');
    $('.org-oneYuan-content .wx img').attr('data-order', '');
    $('.org-oneYuan-content .wx img').attr('data-id', '');
    clearInterval(t1);
    $('.org-oneYuan-content .alipay input').attr('data-url', '');
    $('.org-oneYuan-wd').parent('.down-limit').fadeOut();
});

$('body').on("click", ".download-file", function(){
    if(!globaluid) {
        qqweixin();
        return false;
    }
    var model = $(this).data('model');
    var type = $(this).data('type');
    var picid = $(this).data('id');
    var refererUrl = document.referrer;
    var typeName = '';
    if(type == 1){
        typeName = 'pic';
    }else if(type == 2){
        typeName = 'rar';
    }else if(model == 7 && type == 3){
        typeName = 'water-pic';
    }else{
        return false;
    }

    var url = '//dl.588ku.com/down/' +  typeName;
    $.ajax({
        url: url,
        data: {type:model, picid: picid, refererUrl: refererUrl},
        dataType:'jsonp',
        type:'get',
        async:false,
        jsonp:'callback',
        jsonpCallback:'handleResponse',
        xhrFields:{withCredentials:true},
        success:function(response,status,xhr){
            if (response.code == 401) {
                qqweixin();
                return false;
            }else if(response.code != 200){
                alert(response.msg);
                return false;
            }
            var data = response.data;
            var vipType;
            var vipclass;
            if(model == 6){
                vipType = '#wordart';
                vipclass = '.wordart';
            }else if(model == 7){
                vipType = '#illus';
                vipclass = '.illus';
            }else if(model == 3){
                vipType = '#template';
                vipclass = '.model';
            }else if(model == 4){
                vipType =  '#ppt';
                vipclass = '.ppt';
            }else if(model == 5 || model == 8){
                vipType = '#video';
                vipclass = '.video';
            }else{
                return false;
            }
            if (data.status == 0) {
                if(model == 6){
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=yishuziDownStatist",
                        dataType:'jsonp',
                        data:{uid:data.uid,isvip:data.isvip,create_time:data.create_time,id:data.id,keyword:data.keyword},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }else if (model == 5) {
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=videoDownStatic",
                        dataType:'jsonp',
                        data:{vid:picid},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }else if (model == 8) {
                    $.ajax({
                        url:"//ajax.588ku.com/?m=downStatist&a=audioDownStatic",
                        dataType:'jsonp',
                        data:{id:picid},
                        type:'get',
                        jsonp:'callback',
                        jsonpCallback:'getName',
                        xhrFields:{withCredentials:true},
                        success:function(data){
                        }
                    });
                }
            } else if(data.status == -1){
                $("#login-limit-pane").closest('.down-limit').show();
            } else if (data.status == -10) {
                $(vipclass+'-same-limit').closest('.down-limit').show();
                $(vipclass+'-same-limit').show();
                if(model == 5){
                    picrecharge(picid,4,2,2);
                }
            } else if (data.status == -11) {
                $(vipType+'-pro-vip-limit-pane').parent('.down-limit').find('.blue-num').text(data.dsdowncnt);
                $(vipType+'-pro-vip-limit-pane').closest('.down-limit').show();
            } else if (data.status == -14) {
                $(vipType+'-down-limit-pane').parent('.down-limit').find('.blue-num').text(data.dsdowncnt);
                $(vipType+"-down-limit-pane").closest('.down-limit').show();
            }else if (data.status == -21){
                $(".script-abnormal-wd").show();
                $(".script-abnormal-wd").closest('.down-limit').show();
            } else if (data.status == -15){
                $(vipclass+'-ip-limit').closest('.down-limit').show();
                $(vipclass+'-ip-limit').show();
            } else if (data.status == -35){
                $(vipclass+'-psd-free-limit').closest('.down-limit').show();
                $(vipclass+'-psd-free-limit').show();
            }else if (data.status == -12) {
                $(vipclass+'-free-limit').closest('.down-limit').show();
                $(vipclass+'-free-limit').show();
                if (model == 3) {
                    // 模板下载限制提醒次数记录
                    $.get('//ajax.588ku.com/?m=SponsorFunnel&a=update&mod=1&type=1&uid=' + globaluid);
                }
                if(model == 5){
                    picrecharge(picid,4,2,1);
                }
            }else if (data.status == -17 && data.type ==  1) {
                // 背景源文件下载限制
                $(vipclass+'-source-limit').closest('.down-limit').show();
                $(vipclass+'-source-limit').show();
            } else if (data.status == -17 && (model == 5 || model == 8)) {
                if(model == 8){
                    $('#audio_popup').hide();
                }
                $(vipclass + '-source-limit').closest('.down-limit').show();
                $(vipclass + '-source-limit').show().parent().show();
            } else if (data.status == -33 && data.type == 1) {
                // 合集文件下载限制
                $(vipclass+'-collect-limit').closest('.down-limit').show();
                $(vipclass+'-collect-limit').show();
            } else if (data.status == -2) {
                $('#inspect').show();
            }else if (data.status == -3) {
                $('#fixed').after(data.html);
                $('#fixed').attr('data-id',data.id);
                $('#fixed').attr('type',data.type);
                $('#fixed').attr('down_type',data.down_type);
            } else if(data.status== -4) {
                $("#collect_network").closest('.down-limit').show();
            }else if(data.status == -22 && model == 7){
                $(".illus-day2-limit").closest('.down-limit').show();
                $(".illus-day2-limit").show();
            } else if(data.status == -23 && model == 7){
                $(".illus-Jurisd-limit").closest('.down-limit').show();
                $(".illus-Jurisd-limit").show();
            }else {
                alert('下载失败');
            }
        },
    });
});
