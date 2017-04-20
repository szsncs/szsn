summerready = function() {
	useGas.init();
	useGas.bindEvent();
}
var useGas = {
	pk_daily:"",
	status:true,
	savestatus:"1",
	initdata:{},
	viewid : "com.sunnercn.dailydata.ConsumeGasController",
	/**
	 *初始化 
	 */
	init : function() {
		//初始化界面
		useGas.initpage();
		if(summer.pageParam.type){
			if(summer.pageParam.type==="1"){
				//加载历史表头鸡类信息
				useGas.initInfoLoad();
			}else{
				//加载表头鸡类信息
				useGas.initLoadData();
			}
		}
		
	},
	bindEvent:function(){
		//返回按钮
		$("#top_back").click(function(){
			lastPageRefresh("refresh","dailyReport","dailyReportList");
			summer.closeWin();
		});
		//刷新按钮
		$("#top_refresh").click(function(){
			useGas.init();
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
			useGas.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function(){
			var bool = $confirm("您确定取消编辑吗？");
			if(bool){
				useGas.status=false;
				useGas.setStatus();
				useGas.initLoadData();
			}
			
		});
		//编辑按钮
		$("#bottom_update").click(function(){
			//可编辑
			$(".disable").attr("disabled",false);
			useGas.status=true;
			useGas.setStatus();
			useGas.savestatus="2";
		});
		//删除按钮
		$("#bottom_delete").click(function(){
			var bool = $confirm("您确定要删除吗？");
			if(bool){
				useGas.delete();
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
		
		//失去焦点是触发
		$(".focusevet").bind("blur", function() {
			var val=$(this).val();
			if(val==""){
				$(this).val("0.00")
			}
		});
		//获取焦点是触发
		$(".focusevet").bind("focus", function() {
			var val=parseInt($(this).val());
			if(val=="0"){
				$(this).val("")
			}
		});
		$(".daily_num").bind("keypress", function(event) {
			var event = event || window.event;
			var getValue = $(this).val();
			//控制第一个不能输入小数点"."
			if (getValue.length == 0 && event.which == 46) {
				alert("第一位不能输入小数点！")
				event.preventDefault();
				return;
			}
			//控制只能输入一个小数点"."
			if (getValue.indexOf('.') != -1 && event.which == 46) {
				event.preventDefault();
				alert("只允许输入一个小数点！")
				return;
			}
			//控制只能输入的值
			if (event.which && (event.which < 48 || event.which > 57) && event.which != 8 && event.which != 46) {
				event.preventDefault();
				return;
			}
		})
	},
	initInfoLoad : function(){
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
			callAction(useGas.viewid,"consumeGasInfo",json,"callBack");
	},
	infoLoadAction : function(){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json = {
				date:$("#body_date").text(),
				batch:$("#body_batch").text(),
				logininfo : lonininfo,
			}
			summer.showProgress({
				"title" : "加载中..."
			});
			callAction(useGas.viewid,"consumeGasInfo",json,"callBack");
	},
	initLoadData : function(){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json = {
				logininfo : lonininfo,
			}
			summer.showProgress({
				"title" : "加载中..."
			});
			callAction(useGas.viewid,"consumeGasInit",json,"callBack");
	},
	save : function(){
		if(useGas.savestatus=="1"){
			useGas.submit();//新增保存
		}else{
			useGas.update();//修改保存
		}
	},
	submit:function(){//提交
		var array= [];
		var obj = {
			pk_henhouse:$("#body_hennery").attr("pk_hennery"),
			henhouse_name:$("#body_hennery").text(),
			body_alive_num:$("#body_alive_num").text(),
			daily_consumption_type:$("#body_consumption").attr("daily_type"),
			consumption_num:$("#body_consumption").val(),
			level_num:$("#body_level").val(),
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
         callAction(useGas.viewid,"addConsumeGas",json,"addCallBack");
	},
	update : function(){
		var array= [];
		var obj = {
			pk_daily_consumption:useGas.pk_daily,
			pk_henhouse:$("#body_hennery").attr("pk_hennery"),
			henhouse_name:$("#body_hennery").text(),
			alive_num:$("#body_alive_num").text(),
			daily_consumption_type:$("#body_consumption").attr("daily_type"),
			consumption_num:$("#body_consumption").val(),
			level_num:$("#body_level").val(),
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
	        callAction(useGas.viewid,"updateConsumeGas",json,"updateCallBack");
		}else{
			UM.alert("请先输入进雏数量！");
		}
	},
	delete : function(){
		var array= [];
		var obj = {
			pk_daily_consumption:useGas.pk_daily,//采集表pk
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
	        callAction(useGas.viewid,"deleteConsumeGas",json,"deleteCallBack");
		}else{
			UM.alert("数据出错，请重新登录！");
		}
	},
	setStatus : function(){
		if(useGas.status){
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
			useGas.pk_daily = data.billinfo[0].pk_daily_consumption;
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
		var level_num = 0;
		for(var i = 0 ; i<data.billinfo.length; i++){
			sum+=parseInt(data.billinfo[i].alive_num);
			consumption_num+=parseInt(data.billinfo[i].consumption_num);
			level_num+=parseInt(data.billinfo[i].level_num);
		}
		$("#body_alive_num").text(sum);
		$("#body_consumption").val(consumption_num);//流量
		$("#body_level").val(level_num);//液位
		if(useGas.pk_daily!=null && useGas.pk_daily.length>0){
			useGas.status = false;
			$(".disable").attr("disabled",true);
		}else{
			useGas.status = true;
			$(".disable").attr("disabled",false);
		}
		useGas.setStatus();
	},
	initpage : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		if(summer.pageParam.type && summer.pageParam.type=="makeup"){//补录状态时业务时间可以修改
			$("#body_busi_date").attr("disabled",false);
		}
		//表头批次号
		$("#body_batch").text(logininfo.henneryinfo.batch);
		//鸡场名称
		$("#body_hennery").text(logininfo.henneryinfo.hennery_name);
		$("#body_hennery").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);
		$("#body_consumption").attr("daily_type","G");
	},
	
}	
function callBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	if(args.status == "0"){
		useGas.initpageTitalInfo(args.data);
	}else if (args.status == "1"){
		alert("初始化失败" + args.message);
	} else {
		alert(args.message);
	}	
}


function erresg(args){
	summer.hideProgress();
	UM.alert("系统运行异常"+JSON.stringify(args));
}

function addCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		useGas.infoLoadAction();
		//不可编辑
		$(".disable").attr("disabled",true);
		useGas.savestatus="1";
		UM.alert("保存成功");
	}else{
		UM.alert("保存失败"+args.message);
	}	
}

function updateCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		useGas.infoLoadAction();
		useGas.status=true;
		useGas.setStatus();
		UM.alert("修改成功");
	}else{
		UM.alert("修改失败"+args.message);
	}	
}

function deleteCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		/*useGas.pk_daily=null;
		useGas.init();
		useGas.status=true;
		useGas.setStatus();
		UM.alert("删除成功");*/
		useGas.savestatus="1";
		lastPageRefresh("refresh","dailyReport","dailyReportList");
		summer.closeWin();
	}else{
		UM.alert("删除失败"+args.message);
	}	
}	
