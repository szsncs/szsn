summerready = function() {
	useElectricity.init();
	useElectricity.bindEvent();
}
var useElectricity = {
	pk_daily:"",
	status:true,
	savestatus:"1",
	initdata:{},
	/**
	 *初始化 
	 */
	init : function() {
		//初始化界面
		useElectricity.initpage();
		//加载表头鸡类信息
		useElectricity.initLoadData();
	},
	bindEvent:function(){
		//返回按钮
		$("#top_back").click(function(){
			summer.closeWin();
			/*	
			if(useElectricity.savestatus=="2"){
				var bool = $confirm("当前正在编辑您确定返回吗？");
				if(bool){
					summer.closeWin();
				}
			}else{
				summer.closeWin();
			}*/
		});
		//刷新按钮
		$("#top_refresh").click(function(){
			useElectricity.init();
		});
		//主页按钮
		$("#home").click(function(){ 
			summer.openWin({
					"id" : 'main',
					"url" : 'html/main.html',
			});
		});
		//保存按钮
		$("#bottom_submit").click(function(){
			useElectricity.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function(){
			var bool = $confirm("您确定取消编辑吗？");
			if(bool){
				useElectricity.status=false;
				useElectricity.setStatus();
				useElectricity.initLoadData();
			}
			
		});
		//编辑按钮
		$("#bottom_update").click(function(){
			//可编辑
			$(".disable").attr("disabled",false);
			useElectricity.status=true;
			useElectricity.setStatus();
			useElectricity.savestatus="2";
		});
		//删除按钮
		$("#bottom_delete").click(function(){
			var bool = $confirm("您确定要删除吗？");
			if(bool){
				useElectricity.delete();
			}
		});
		
		//列表按钮
		$(".um_list").click(function(){
			summer.openWin({
				"id" : 'dailyReportList',
				"url" : 'html/dailyReport/dailyReportList.html',
				"pageParam" : {
					"type" : "Gas",
					"consumeType" : "'G'"
				}
			});
		});
		
		// TODO
		//失去焦点是触发
		$(".focusevet").bind("blur", function() {
			if($(this).val()==""){$(this).val("0")}
		});
		//获取焦点是触发
		$(".focusevet").bind("focus", function() {
			if($(this).val()=="0"){$(this).val("")}
		});
		
		$(".daily_num").on('keyup', function(event) {
			var $amountInput = $(this);
			//响应鼠标事件，允许左右方向键移动
			event = window.event || event;
			if (event.keyCode == 37 | event.keyCode == 39) {
				return;
			}
			//先把非数字的都替换掉，除了数字和.
			$amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
			//只允许一个小数点
			replace(/^\./g, "").replace(/\.{2,}/g, ".").
			//只能输入小数点后两位
			replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
		});
		$(".daily_num").on('blur', function() {
			var $amountInput = $(this);
			//最后一位是小数点的话，移除
			$amountInput.val(($amountInput.val().replace(/\.$/g, "")));
		});
	},
	initLoadData : function(){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json = {
				date:summer.pageParam.date,
				batch:summer.pageParam.batch,
				logininfo : lonininfo,
			}
			summer.showProgress({
				"title" : "加载中..."
			});
			$service.callAction({
					"viewid" : "com.sunnercn.dailydata.ConsumeElectricityController", //后台带包名的Controller名
					"action" : "consumeElectricityInit", //方法名,
					"params" : json, //自定义参数
					"callback" : "callBack()", //请求回来后执行的ActionID
					"error" : "erresg()"//失败回调的ActionId
			});
	},
	save : function(){
		if(useElectricity.savestatus=="1"){
			useElectricity.submit();//新增保存
		}else{
			useElectricity.update();//修改保存
		}
	},
	submit:function(){//提交
		var array= [];
		var obj = {
			pk_henhouse:$("#body_hennery").attr("pk_hennery"),
			henhouse_name:$("#body_hennery").text(),
			body_alive_num:$("#body_alive_num").text(),
			daily_consumption_type:$("#body_level").attr("daily_type"),
			consumption_num:$("#body_level").val()
		} 
		array.push(obj);
		
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var pk_chicktype = $("#body_type").attr("pk_chicktype");
		var chicktype_name= $("#body_type").text();
		var json={
			billinfo:array,
			logininfo:lonininfo,
			pk_chicktype:pk_chicktype,
			chicktype_name:chicktype_name
		}
		
		 summer.showProgress({
			            "title" : "加载中..."
			        }); 
			$service.callAction({
				"viewid" : "com.sunnercn.dailydata.ConsumeElectricityController", //后台带包名的Controller名
				"action" : "addConsumeElectricity", //方法名,
				"params" : json, //自定义参数
				"callback" : "addCallBack(args)", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		
	},
	update : function(){
		var array= [];
		var obj = {
			pk_daily_consumption:useElectricity.pk_daily,
			pk_henhouse:$("#body_hennery").attr("pk_hennery"),
			henhouse_name:$("#body_hennery").text(),
			alive_num:$("#body_alive_num").text(),
			daily_consumption_type:$("#body_level").attr("daily_type"),
			consumption_num:$("#body_level").val()
		}
		array.push(obj);
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_chicktype = $("#tital_type").attr("pk_chicktype");
			var chicktype_name= $("#tital_type").text();
			var json={
				billinfo:array,
				logininfo:lonininfo,
				pk_chicktype:pk_chicktype,//鸡类
				chicktype_name:chicktype_name//鸡类名称
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.dailydata.ConsumeElectricityController", //后台带包名的Controller名
				"action" : "updateConsumeElectricity", //方法名,
				"params" : json, //自定义参数
				"callback" : "updateCallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		}else{
			UM.alert("请先输入进雏数量！");
		}
	},
	delete : function(){
		var array= [];
		var obj = {
			pk_daily_consumption:useElectricity.pk_daily,//采集表pk
		};
		array.push(obj);
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json={
				billinfo:array,
				logininfo:lonininfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.dailydata.ConsumeElectricityController", //后台带包名的Controller名
				"action" : "deletConsumeElectricity", //方法名,
				"params" : json, //自定义参数
				"callback" : "deleteCallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});	
		}else{
			UM.alert("数据出错，请重新登录！");
		}
	},
	setStatus : function(){
		if(useElectricity.status){
			$(".status3").show();//显示取消、保存
			$(".status2").hide();//隐藏编辑、删除
		}else{
			$(".status3").hide();//隐藏取消、保存
			$(".status2").show();//显示编辑、删除
		}
	},
	initpageTitalInfo : function(data){
		//日常消耗pk
		if(data.billinfo.length>0){
		useElectricity.pk_daily = data.billinfo[0].pk_daily_consumption;
		}
		//存货种类
		$("#body_type").text(data.chicktype_name);
		$("#body_type").attr("pk_chicktype",data.pk_chicktype);
		//填报时间
		$("#body_date").text(data.create_date);
		//业务时间
		$("#body_busi_date").val(data.busi_date);
		//存栏数
		var sum = 0;
		//使用量
		var consumption_num = 0;
		for(var i = 0 ; i<data.billinfo.length; i++){
			sum+=parseInt(data.billinfo[i].alive_num);
			//consumption_num+=parseInt(data.billinfo[i].consumption_num);
		}
		$("#body_alive_num").text(sum);
		//$("#body_level").val(consumption_num);
		if(useElectricity.pk_daily!=null&&useElectricity.pk_daily.length>0){
			useElectricity.status = false;
			$(".disable").attr("disabled",true);
		}else{
			useElectricity.status = true;
			$(".disable").attr("disabled",false);
		}
		useElectricity.setStatus();
	},
	initpage : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		//表头批次号
		$("#body_batch").text(logininfo.henneryinfo.batch);
		//鸡场名称
		$("#body_hennery").text(logininfo.henneryinfo.hennery_name);
		$("#body_hennery").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);
		$("#body_level").attr("daily_type","E");
	},
	
}	
function callBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		useElectricity.initpageTitalInfo(args.data);
	}else{
		UM.alert("初始化失败"+args.message);
	}	
}


function erresg(args){
	summer.hideProgress();
	UM.alert("系统运行异常"+JSON.stringify(args));
}

function addCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		useElectricity.initLoadData();
		//不可编辑
		$(".disable").attr("disabled",true);
		useElectricity.savestatus="1";
		UM.alert("保存成功");
	}else{
		UM.alert("保存失败"+args.message);
	}	
}

function updateCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		useElectricity.initLoadData();
		useElectricity.status=true;
		useElectricity.setStatus();
		UM.alert("修改成功");
	}else{
		UM.alert("修改失败"+args.message);
	}	
}

function deleteCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		/*useElectricity.pk_daily=null;
		useElectricity.init();
		useElectricity.status=true;
		useElectricity.setStatus();*/
		useElectricity.savestatus="1";
		summer.closeWin();
		//UM.alert("删除成功");
	}else{
		UM.alert("删除失败"+args.message);
	}	
}	
