//here is your code...
summerready = function () {
		  // =========================PhoneGap================================== 
        // 等待加载PhoneGap 
        document.addEventListener("deviceready", onDeviceReady, false); 
        // PhoneGap加载完毕 
        function onDeviceReady() { 
                // 按钮事件 
                document.addEventListener("backbutton", eventBackButton, false); // 返回键 
               
        } 
          
        // 返回键 
        
        function eventBackButton() { 
            
             UM.alert('5秒内再次点击返回键将退出应用!'); 
            document.removeEventListener("backbutton", eventBackButton, false); // 注销返回键 
            document.addEventListener("backbutton", exitApp, false);//绑定退出事件 
            // 3秒后重新注册 
            var intervalID = window.setInterval(function() { 
                    window.clearInterval(intervalID); 
                    document.removeEventListener("backbutton", exitApp, false); // 注销返回键 
                    document.addEventListener("backbutton", eventBackButton, false); // 返回键 
            }, 5000);                     
        }      
        function exitApp(){ 
                summer.exitApp(); 
        } 
    
		main.bindEvent();
		//加载第一个页面
		main.init();
	//$summer.byId("content").innerHTML += "<h1 style='text-align: center'>Hello friends, welcome to touch the summer frame!</h1><h2 style='text-align: center'>The frame update at " +(new Date()).toLocaleString()+"</h2>";
};
function callBack(arg){
	//UM.alert(JSON.stringify(arg));
	if(arg.status == "0"){
		main.initMainPage(arg.data);
		main.initMyPage(arg.data);
	}else{
		UM.alert(arg.message);
	}
	
}
function erresg(arg){
	UM.alert("失败");
	UM.alert(JSON.stringify(arg));
}
/**
 * author:zhangjlt
 * date:2016年8月22日22:30:42
 */
var main = {
	/**
	 * bindEvent 页面事件
	 */
	bindEvent: function () {
		 $('#footer>a').click(function(){
		 	var a=['数智圣农','数智圣农','我'];
		 	$(this).addClass('active').siblings('.active').removeClass('active');
			var tar=$(this).attr('data-tar');
			$(tar).addClass('active').siblings('.active').removeClass('active');
			var num=$(this).index(); 
			$('#header h3').html(a[num]);
		});	
		$("#logoff").click(function(){
			summer.openWin({
				"id" : 'index',
				"url" : 'index.html',
			});
		}); 
	

	},
	init:function(){
	   var usercode = $cache.read("userid");
	   var username = $cache.read("username");
	   var pk_corp = $cache.read("pk_corp");
		var json={
			cuserid : usercode,
			pk_corp : pk_corp ,
			username : username
		}
		$service.callAction({
			"viewid" : "com.sunnercn.login.LoginController", //后台带包名的Controller名
			"action" : "role", //方法名,
			"params" : json, //自定义参数
			"callback" : "callBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	    
	},
	//应用界面加载
	initMainPage:function(arg){
		//1.调用接口 返回数据
	    //$cache.write ("role","2");
		//2.成功回调中处理数据 清空dom
		$("#apply").html("");
		//2.1 加载轮播图
		main.loadBanner();
		var logininfo = arg.logininfo;
		$cache.write("logininfo",JSON.stringify(logininfo));
		//2.2 成功回调中加载 用户信息
		var username = arg.logininfo.userinfo.username;
		var userChang = arg.logininfo.henneryinfo.hennery_name;
		var userhtml = '<label class="um-label um-box-justify"><div style="padding-left: 15px;">'+userChang+'，'+ username+'，你好!</div> </label>';
		$("#apply").append(userhtml);
		
		//2.3 加载场舍数据
		main.loadChickenFarm(arg);
		//2.4 加载应用图标
		main.loadapp(arg.app);
		
	},
	loadapp:function(appArray){
		var list =appArray;
		var data = {
			id:"0",
			name:"",
			picname:"",
			url:""
		}
		if(list.length%4 >0){
			list.push(data); 
		}
		if(list.length%4 >0){
			list.push(data); 
		}
		if(list.length%4 >0){
			list.push(data); 
		}
		var html ='<div class="um-grid">';
		for(var i=0;i<list.length;i++){
			if(i%4 ==0){
				html +='<div class="um-grid-row tc">';
			}
			var funcode = list[i].id;
			list[i].resid;
			if(funcode !=0){	
			var str = list[i].name;
			if(str.length >4){
				var str1=str.substring(0,4);
				var str2 = str.substr(4,4);
				str = str1 +str2;
			}
			var helpNames = list[i].picname.split("@");
			var imgName = helpNames[0];
			var backColor = helpNames[1];
			//设置按钮图标
			html +='<div class="um-box-center um-click"  style="background:none;">'
				  +'<div class="icon_box" style="width:55px;height:55px;background:rgba'+backColor+'">'
				  +'<div class="icon" style="background-image:url(../img/btn/'+funcode+'.png);">'
				  //+'<img src="../img/btn/'+funcode+'.png">'
				  +'</div>'
				  +'</div>'
                  +' <a href="#" class="w85 h40 um-box-center click" dataurl="'+list[i].url +'">'             
                  +' <div>'                                          
                  +' <div class="um-black f14"> '+str+' </div>'                      
                  +' </div>'                          
                  +'</a>'                      
                  +' </div>'; 
			}  else{
				html +='<div></div>';
			}                 
			if(i%4==3){
				html +='</div>';
			}

		}
		html +='</div>';
		$("#apply").append(html);
		$(".um-click").click(function(){
			var str =$(this).find('a').attr("dataurl");
			var url = 'html'+str;
			
			summer.openWin({
	            "id" : str,
	            "url" : url
	        });
		});
		
	},

	loadChickenFarm:function(arg){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		var farmdata = arg.farmdata;
		var list=[];
		var id;
		var name;
		var msg;
		for(var i=0;i<farmdata.length;i++){
			id=farmdata[i].id;
			name=farmdata[i].name,
			msg=farmdata[i].data
			var json = {
				id:id,
				name:name,
				data:msg
			};
			list.push(json);
		}
		var data = {
			id:"0",
			name:"",
			data:""
		}
		if(list.length%2 >0){
			list.push(data); 
		}
		var html = '<div style="margin-top: 5px "class="um-border-top" >';
		for(var i =0;i<list.length;i++){
			if(i%2==0){

				html += '<div class="um-row  um-bgc-white um-border-bottom">'
                       +'	<div class="um-xs-6 um-bgc-white p10 um-border-right">'
                       +'		<p class="f14">'+list[i].name+'</p>'		
                       +'		<p class="um-red f14">'+list[i].data+'</p>'		
                       +'	</div>';	           	
			}else{
				if(list[i].id!=0){
					html +='	<div class="um-xs-6 um-bgc-white p10 ">'
					      +'		<p class="f14">'+list[i].name+'</p>'
                      	  +'		<p class="um-red f14">'+list[i].data+'</p>'
                      	  +'	</div>'	;
				}else{
					html +='	<div class="um-xs-6 um-bgc-white p10">' 
						  +'	</div>'

				}
				html+='</div>';
			}
		}
		html +='</div>';
		$("#apply").append(html);

	},
	loadBanner:function(){
		var html ='<div class="um-row"><div id="iSlider-wrapper" class="iSlider-wrapper"></div></div>';
		$("#apply").append(html);

		var list = [
			{
				content: "../img/g1.jpg"
			}, 
			{
				content: "../img/g2.jpg"
			}, 
			{
				content: "../img/g3.jpg"
			}
		];
		var islider = new iSlider({
			type: 'pic',
			data: list,
			dom: document.getElementById("iSlider-wrapper"),
			isLooping: true,
			animateType: 'default',
			isAutoplay: true,
			animateTime: 1000
		});
		islider.addDot();
	},
	// 我  界面加载
	initMyPage:function(arg){
		var logininfo = arg.logininfo;
		//2.2 成功回调中加载 用户信息
		var username = logininfo.userinfo.username;
		var userChang = logininfo.henneryinfo.hennery_name;
		$(".login_name").html(username);
		$(".hennery_name").html(userChang);
	},
	// 消息界面加载
	initMessagePage:function(){

	}
	
};
