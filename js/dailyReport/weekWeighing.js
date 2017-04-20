summerready = function() {
	weekWeight.init();
	weekWeight.bindEvent();
}
var weekWeight = {
	status:true,
	savestatus:"1",
	initdata:{},
	showstatus:"1",
	viewid : "com.sunnercn.dailydata.WeeklyWeighController",
	/**
	 *初始化 
	 */
	init : function() {
		//初始化界面
		weekWeight.initpage();
		if(summer.pageParam.type){
			if(summer.pageParam.type==="1"){
				//加载历史表头鸡类信息
				weekWeight.initInfoLoad();
			}else{
				weekWeight.initLoadData();
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
			weekWeight.init();
		});
		//主页按钮
		$("#home").click(function(){ 
			summer.closeToWin({
				id:'main'
			})
		});
		//保存按钮
		$("#bottom_submit").click(function(){
			weekWeight.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function(){
			var bool = $confirm("您确定取消编辑吗？");
			if(bool){
				weekWeight.status=false;
				weekWeight.setStatus();
				weekWeight.initInfoLoad();
			}
			
		});
		//编辑按钮
		$("#bottom_update").click(function(){
			//可编辑
			$(".disable").attr("disabled",false);
			weekWeight.status=true;
			weekWeight.setStatus();
			weekWeight.savestatus="2";
		});
		//删除按钮
		$("#bottom_delete").click(function(){
			var bool = $confirm("您确定要删除吗？");
			if(bool){
				weekWeight.delete();
			}
		});
		//列表按钮
		$(".um_list").click(function(){
			summer.openWin({
				"id" : 'dailyReportList',
				"url" : 'html/dailyReport/dailyReportList.html',
				"pageParam" : {
					"type" : "week",
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
		var date=summer.pageParam.date;
		var batch=summer.pageParam.batch;
		var pk_daily=summer.pageParam.pk_daily;
		var json = {
			date:date,
			batch:batch,
			pk_daily:pk_daily,
			logininfo : lonininfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(weekWeight.viewid,"weeklyWeightInfo",json,"callBack");
	},
	infoLoadAction : function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			date:$("#tital_date").text(),
			batch:$("#tital_batch").text(),
			logininfo : lonininfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(weekWeight.viewid,"weeklyWeightInfo",json,"callBack");
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
		callAction(weekWeight.viewid,"weeklyWeightInit",json,"callBack");
	},
	save : function(){
		if(weekWeight.savestatus=="1"){
			weekWeight.submit();//新增保存
		}else{
			weekWeight.update();//修改保存
		}
	},
	submit:function(){//提交
		var array= [];
		$(".alive_num").each(function(){
			var val= $(this).text()?$(this).text():"0";
			var house_name=$(this).attr("house");
			var primary_key=$(this).attr("primary_key");
			var obj = {
				pk_henhouse:$(this).attr("id"),//鸡舍pk
				henhouse_name:$("#"+house_name).text(),//鸡舍名称
				alive_num:$(this).text(),//存栏数
				ave_weight:$("#"+primary_key).val()	//每羽重量
			};
			array.push(obj);
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_chicktype = $("#tital_type").attr("pk_chicktype");
			var chicktype_name= $("#tital_type").text();
			var busi_date=$(".busi_date").val();
			var create_date=$(".create_date").text();
			var json={
				billinfo:array,
				logininfo:lonininfo,
				busi_date:busi_date,
				create_date:create_date,
				pk_chicktype:pk_chicktype,
				chicktype_name:chicktype_name
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
	        callAction(weekWeight.viewid,"addWeeklyWeight",json,"addCallBack");
		}else{
			alert("请先输入进雏数量！");
		}
	},
	update : function(){
		var array= [];
		$(".alive_num").each(function(){
			var val= $(this).val()?$(this).val():"0";
			var primary_key=$(this).attr("primary_key");//获取每羽重量id标签
			var obj = {
				pk_henhouse:$(this).attr("id"),
				henhouse_name:$(this).attr("henhouse_name"),
				alive_num:$(this).text(),//存栏数
				ave_weight:$("#"+primary_key).val(),//每羽重量
				pk_weekly_weigh:$("#"+primary_key).attr("pk_weekly_weigh")//周称重pk
			};
			array.push(obj);
		});
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
	        callAction(weekWeight.viewid,"updateWeeklyWeight",json,"updateCallBack");
		}else{
			alert("请先输入进雏数量！");
		}
	},
	delete : function(){
		var array= [];
		$(".daily_num").each(function(){
			var pk_weekly_weigh=$(this).attr("pk_weekly_weigh");//采集表pk
			var obj = {
				pk_weekly_weigh:pk_weekly_weigh,//采集表pk
			};
			array.push(obj);
		});
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
	        callAction(weekWeight.viewid,"deleteWeeklyWeight",json,"deleteCallBack");
		}else{
			alert("数据出错，请重新登录！");
		}
	},
	setStatus : function(){
		if(weekWeight.status){
			$(".status3").show();//显示取消、保存
			$(".status2").hide();//隐藏编辑、删除
		}else{
			$(".status3").hide();//隐藏取消、保存
			$(".status2").show();//显示编辑、删除
		}
	},
	initpageTitalInfo : function(data){
		//存货种类
		$("#tital_type").text(data.chicktype_name);
		$("#tital_type").attr("pk_chicktype",data.pk_chicktype);
		//填报时间
		$("#tital_date").text(data.create_date);
		//业务时间
		$(".busi_date").val(data.busi_date);
		
	},
	initpage : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		if(summer.pageParam.type && summer.pageParam.type=="makeup"){//补录状态时业务时间可以修改
			$(".busi_date").attr("disabled",false);
		}
		//表头批次号
		$("#tital_batch").text(logininfo.henneryinfo.batch);
		//日龄
		$("#tital_age").text(logininfo.henneryinfo.days);
		//鸡场名称
		$("#tital_hennery").text(logininfo.henneryinfo.hennery_name);
		$("#tital_hennery").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);
		//将列表至空
		$(".info_list_item").html("");
		var html="";
		for (var i = 0; i < logininfo.henhouseinfo.length; i++) {
		 	var billinfo =logininfo.henhouseinfo; 
				html+='<div   class="um-list-item">'
				+'		<div class="um-list-item-inner">'
				+'		<div class="um-list-item-body f14 ">'
				+'		<div class="l-t-info" style="float: left;" >'
				+'		<span id="house-name'+i+'">'+billinfo[i].henhouse_name+'</span>'
				+'		</div>'
				+'		<div class="l-t-info" style="float: left">'
				+'		<span style="width: 50%"  house="house-name'+i+'" primary_key="primary_key'+i+' " class="alive_num alive_edit_status" id="'+billinfo[i].pk_henhouse+'" '
				+' 		henhouse_name="'+billinfo[i].henhouse_name+'" >0</span>'
				+'		羽'
				+'		</div>'
				+'		<div class="l-t-info" style="float: left">'
				+'		<input type="number" value="0.00" style="width: 55%;height:25px;" id="primary_key'+i+'"  class="primary_key daily_num focusevet status disable" />'
				+'			克'
				+'			</div>'
				+'			</div>'
				+'			</div>'
				+'		</div>'
		};
		$(".info_list_item").html(html);
	},
	initlist : function(data){
		var billinfo = data.billinfo;
		if(billinfo && billinfo.length>0){
			//日龄
			$("#tital_age").text(billinfo[0].days);
			for(var i=0;i<data.billinfo.length;i++){
				$("#"+billinfo[i].pk_henhouse).text(billinfo[i].alive_num);//存栏数
				var primary_key=$("#"+billinfo[i].pk_henhouse).attr("primary_key");//获取鸡场pk
				$("#"+primary_key).removeClass("status");
				
			}
			//不可编辑
			$(".status").attr("disabled",true);
			for(var i=0;i<data.billinfo.length;i++){
				if(!billinfo[i].pk_weekly_weigh){//周称重PK为空时返回
					weekWeight.status=true;
					weekWeight.setStatus();
					weekWeight.savestatus="1";
					return;
				}
				weekWeight.status=false;
				weekWeight.setStatus();
				//不可编辑
				$(".disable").attr("disabled",true);
				var primary_key=$("#"+billinfo[i].pk_henhouse).attr("primary_key");//获取鸡场pk
				$("#"+primary_key).attr("pk_weekly_weigh",billinfo[i].pk_weekly_weigh);//添加周称重pk
				$("#"+primary_key).val(billinfo[i].ave_weight);//添加重量
				
			}
		}
	}
	
}	
function callBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	if(args.status == "0"){
		weekWeight.initpageTitalInfo(args.data);
		weekWeight.initlist(args.data);
		weekWeight.initdata=args.data;
	}else if (args.status == "1"){
		alert("初始化失败" + args.message);
	} else {
		alert(args.message);
	}	
}

function listDataCallBack(args){
		summer.hideProgress();
		if(args.status == "0"){
			weekWeight.initpageTitalInfo(args.data);
			weekWeight.initlist(args.data);
			weekWeight.initdata=args.data;
		}else{
			if(args.message=="Index: 0, Size: 0"){
				alert("没有录入进雏，请先录入！")
				return;
		}
		alert("初始化失败"+args.message);
	}
}

function erresg(args){
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(args));
}

function addCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		weekWeight.showstatus="2";
		weekWeight.infoLoadAction();
		//不可编辑
		$(".disable").attr("disabled",true);
		weekWeight.savestatus="1";
		alert("保存成功");
	}else{
		alert("保存失败"+args.message);
	}	
}

function updateCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		weekWeight.infoLoadAction();
		weekWeight.status=true;
		weekWeight.setStatus();
		alert("修改成功");
	}else{
		alert("修改失败"+args.message);
	}	
}

function deleteCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		/*weekWeight.init();
		weekWeight.status=true;
		weekWeight.setStatus();*/
		weekWeight.savestatus="1";
		lastPageRefresh("refresh","dailyReport","dailyReportList");
		summer.closeWin();
	}else{
		alert("删除失败"+args.message);
	}	
}	