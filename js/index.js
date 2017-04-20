//here is your code...
summerready = function () {
		//事件绑定
		login.bindEvent();
		login.checkt();
	//$summer.byId("content").innerHTML += "<h1 style='text-align: center'>Hello friends, welcome to touch the summer frame!</h1><h2 style='text-align: center'>The frame update at " +(new Date()).toLocaleString()+"</h2>";
};
/**
 * 主功能页面，用于包括所有页面元素并加载显示其它页面部分
 *    主要还用于解析公共数据，用于其它页面数据准备工作
 * author:zhushy
 * date:2016年8月22日22:30:42
 */

var login = {
	/**
	 * bindEvent 页面事件
	 */
	bindEvent: function () {
		$("#loginSetting").unbind().on("click",function(){
			summer.openWin({
                "id" : "loginSetting",
                "url" : 'html/loginSetting.html'
            });
		});
		$("#login-btn").unbind().on("click",function(){
		    var usename = $("#login-username").val();
		    var password = $("#login-password").val();
		    if(!usename||!password){
		       alert("请输入用户名和密码");
		    }else{
		    	var host =$cache.read("host");
		     	var port =$cache.read("port");
		     	var pk_corp = $cache.read("pk_corp");
		    	if(!host||!port||! pk_corp){
			       UM.alert("请先设置IP、端口号和公司编码");
			    }else{
		    	$cache.write ("usename",usename);
		     	$cache.write ("password",password);
		     	$service.writeConfig({
					"host" : host, //向configure中写入host键值
					"port" : port//向configure中写入port键值
				});
				var json={
					usercode:usename, 
					password:password,
					pk_corp:pk_corp
				}
				summer.showProgress({
                    "title" : "加载中..."
                });
				$service.callAction({
					"viewid" : "com.sunnercn.login.LoginController", //后台带包名的Controller名
					"action" : "login", //方法名,
					"params" : json, //自定义参数
					"callback" : "callBack()", //请求回来后执行的ActionID
					"error" : "erresg()"//失败回调的ActionId
				});
		    }
		    }
		    
		});
		$("#remPwd").find("input:checkbox").on("change",function(){
		    if(this.checked) {
		       $cache.write ("remPwd","true");
		    }else{
		       $cache.write ("remPwd","false");
		       $("#autoLogin").find("input:checkbox").prop('checked',false);
		       $("#autoLogin").find("input:checkbox").trigger("change");
		    }
		});
		$("#autoLogin").find("input:checkbox").on("change",function(){
		    if(this.checked) {
		        $cache.write ("autoLogin","true");
		        $("#remPwd").find("input:checkbox").prop('checked',true);
		        $("#remPwd").find("input:checkbox").trigger("change");
		    }else{
		     	$cache.write ("autoLogin","false");
		    }
		});
		
	},
	
	checkt:function(){
			var remPwd = $cache.read("remPwd");
			var autoLogin = $cache.read("autoLogin");
			if(remPwd == "true"){
				var usename = $cache.read("usename");
			    var password = $cache.read("password");
			    if(!usename||!password){
				    $("#remPwd").find("input:checkbox").prop('checked',false);
			        $("#remPwd").find("input:checkbox").trigger("change");
			    }else{
					 $("#login-username").val(usename);
				     $("#login-password").val(password);
				     if(autoLogin =="true"){
			     		 $("#autoLogin").find("input:checkbox").prop('checked',true);
	      				 $("#autoLogin").find("input:checkbox").trigger("change");
	      				 $("#login-btn").click();
				     }else{
				     	 $("#autoLogin").find("input:checkbox").prop('checked',false);
	      				 $("#autoLogin").find("input:checkbox").trigger("change");
				     }
			    }
			}else{
				 $("#remPwd").find("input:checkbox").prop('checked',false);
			     $("#remPwd").find("input:checkbox").trigger("change");
			}
	        

	}
};

function callBack(args){
	summer.hideProgress();
	//UM.alert(JSON.stringify(args));
	if(args.status == "0"){
		var userid = args.data.cuserid;
		var username = args.data.username;
		$cache.write("userid",userid);
		$cache.write("username",username);
	   summer.openWin({
                   "id" : 'adc',
                   "url" : 'html/main.html'
               });
    }else{
    	alert("登录失败："+args.message);
    }
     
}
	function erresg(arg){
		summer.hideProgress();
		alert("登录失败："+JSON.stringify(arg));
	
	}

	$(document).ready(function(){
		//用友信息记录
//login.bindEvent();
		//加载第一个页面
		//login.init();
		//路由绑定
		//index.bindRout();
		//加载用户的所有pathRout
		//$script('js/pathRout.js?t=' + Math.random(), "pathRout");
	});
