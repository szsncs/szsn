//here is your code...
summerready = function () {
		//事件绑定
		loginSetting.bindEvent();
		loginSetting.init();
	//$summer.byId("content").innerHTML += "<h1 style='text-align: center'>Hello friends, welcome to touch the summer frame!</h1><h2 style='text-align: center'>The frame update at " +(new Date()).toLocaleString()+"</h2>";
};
var loginSetting = {
	bindEvent: function () {
		$("#saveSetting").unbind().on("click",function(){
			var host = $("#ip").val();
			var port = $("#port").val();
			var pk_corp = $("#pk_corp").val();
			if(!host||!port){
		       alert("请输入IP、端口号和公司编码");
		    }else{
		    	$cache.write ("host",host);
		     	$cache.write ("port",port);
		     	$cache.write ("pk_corp",pk_corp);
		     	summer.closeWin();
		    }	
		});
		$("#settingBack").unbind().on("click",function(){
			summer.closeWin();
		});	
	},
	init:function(){
		var host =$cache.read("host");
		var port =$cache.read("port");
		var pk_corp =$cache.read("pk_corp"); 
		 $("#ip").val(host);
		 $("#port").val(port);
		 $("#pk_corp").val(pk_corp);
	}
}