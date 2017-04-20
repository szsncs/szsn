summerready = function() {
	estimateAlive.init();
	estimateAlive.bindEvent();
}
var estimateAlive = {
	status:true,
	savestatus:"1",
	initdata:{},
	viewid : "com.sunnercn.dailydata.EstimateAliveController",
	/**
	 *初始化 
	 */
	init : function() {
		//初始化界面
		estimateAlive.initpage();
		//加载表头鸡类信息
		estimateAlive.initLoadData();
	},
	bindEvent:function(){
		//返回按钮
		$("#top_back").click(function(){
			summer.closeWin();
		});
		//刷新按钮
		$("#top_refresh").click(function(){
			estimateAlive.init();
		});
	
		//保存按钮
		$("#btn-save").click(function(){
			estimateAlive.save();
		});
		//取消按钮
		$("#btn-cancle").click(function(){
			var bool = $confirm("您确定取消编辑吗？");
			if(bool){
				estimateAlive.status=false;
				estimateAlive.setStatus();
				estimateAlive.initLoadData();
			}
			
		});
		//编辑按钮
		$("#btn-edit").click(function(){
			//可编辑
			$(".disable").attr("disabled",false);
			estimateAlive.status=true;
			estimateAlive.setStatus();
			estimateAlive.savestatus="2";
		});
		//删除按钮
		$("#btn-del").click(function(){
			var bool = $confirm("您确定要删除吗？");
				if(bool){
				estimateAlive.delete();
			}
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
	initLoadData : function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo : lonininfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(estimateAlive.viewid,"estimateAliveInit",json,"callBack");
	},
	save : function(){
		if(estimateAlive.savestatus=="1"){
			estimateAlive.submit();//新增保存
		}else{
			estimateAlive.update();//修改保存
		}
	},
	submit:function(){//提交
		var array= [];
		$(".daily_num").each(function(){
			var val= $(this).val()?$(this).val():"0";
			var house_name=$(this).attr("house_name");
			var obj = {
				pk_henhouse:$(this).attr("id"),
				henhouse_name:house_name,
				inchick_num:$(this).val(),
			};
			array.push(obj);
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_chicktype = $("#tital_type").attr("pk-chicktype");
			var chicktype_name= $("#tital_type").text();
			var json={
				billinfo:array,
				logininfo:lonininfo,
				pk_chicktype:pk_chicktype,
				chicktype_name:chicktype_name
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
	        callAction(estimateAlive.viewid,"addEstimateAlive",json,"addCallBack");
		}else{
			alert("请先输入进雏数量！");
		}
	},
	update : function(){
		var array= [];
		$(".daily_num").each(function(){
			var val= $(this).val()?$(this).val():"0";//获取数量
			var pk_daily=$(this).attr("pk_daily");//获取pk
			var house_name=$(this).attr("house_name");//获取存栏数id
			var id=$(this).attr("id");//存栏数
			var obj = {
				pk_daily_consumption:pk_daily,//日常消耗pk
				pk_henhouse:id,//鸡舍pk
				henhouse_name:house_name,//鸡舍名称
				alive_num:val,//存栏数
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
	        callAction(estimateAlive.viewid,"updateEstimateAlive",json,"updateCallBack");
		}else{
			alert("请先输入进雏数量！");
		}
	},
	delete : function(){
		var array= [];
		$(".daily_num").each(function(){
			var pk_daily=$(this).attr("pk_daily");//采集表pk
			var obj = {
				pk_daily_consumption:pk_daily,//采集表pk
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
	        callAction(estimateAlive.viewid,"deleteEstimateAlive",json,"deleteCallBack");
		}else{
			alert("数据出错，请重新登录！");
		}
	},
	setStatus : function(){
		if(estimateAlive.status){
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
		
	},
	initpage : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
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
				+'      <span> &nbsp;</span>'
				+'		</div>'
				+'		<div class="l-t-info" style="float: left">'
				+'		<input type="number" value="0" style="width: 55%;height: 25px;" id="'+billinfo[i].pk_henhouse+'"'
				+'		  house_name="'+billinfo[i].henhouse_name+'"  class="consume daily_num focusevet disable" />'
				+'			羽'
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
			for(var i=0;i<data.billinfo.length;i++){
				$("#"+billinfo[i].pk_henhouse).val(billinfo[i].alive_num);//存栏数
			}
			for(var i=0;i<data.billinfo.length;i++){
				if(!billinfo[i].pk_henhouse){//采集表PK为空时返回
					estimateAlive.status=true;
					estimateAlive.setStatus();
					estimateAlive.savestatus="1";
					return;
				}
				estimateAlive.status=false;
				estimateAlive.setStatus();
				//不可编辑
				$(".disable").attr("disabled",true);
				$("#"+billinfo[i].pk_henhouse).attr("pk_daily",billinfo[i].pk_alive_data)
				$("#"+billinfo[i].pk_henhouse).val(billinfo[i].alive_num);//添加消耗数量
			}
		}
	}
	
}	
function callBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	if(args.status == "0"){
		estimateAlive.initpageTitalInfo(args.data);
		estimateAlive.initlist(args.data);
		estimateAlive.initdata=args.data;
	}else if(args.status == "1"){
		alert("初始化失败:"+args.message);
		//lastPageRefresh("refresh","html","main");
		summer.closeWin();
	} else {
		alert(args.message);	
		//lastPageRefresh("refresh","html","main");
		summer.closeWin();
	}	
}


function erresg(args){
	summer.hideProgress();
	alert(JSON.stringify(args));
	alert("系统运行异常");
}

function addCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		estimateAlive.initLoadData();
		//不可编辑
		$(".disable").attr("disabled",true);
		estimateAlive.savestatus="1";
		alert("保存成功");
	}else{
		alert(args.message);
		alert("保存失败");
	}	
}

function updateCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		estimateAlive.initLoadData();
		estimateAlive.status=true;
		estimateAlive.setStatus();
		alert("修改成功");
	}else{
		alert(args.message);
		alert("修改失败");
	}	
}

function deleteCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		estimateAlive.init();
		estimateAlive.status=true;
		estimateAlive.setStatus();
		estimateAlive.savestatus="1";
		alert("删除成功");
	}else{
		alert(args.message);
		alert("删除失败");
	}	
}