summerready = function() {
	illness.init();
	illness.bindEvent();
}
var illness = {
	status : true, //判断编辑状态
	type : "0", //传入详情页面状态  1为详细状态  0为初始状态
	item1 : [],
	item2 : [],
	item3 : [],
	viewid : "com.sunnercn.illnessChange.illnessChangeController",
	init : function() {
		//初始化界面
		illness.initPage();
		if(summer.pageParam.type && summer.pageParam.type==="1"){
			//详情初始化
			illness.infoInitCallAction();	
		}else{
			//新增初始化
			illness.initCallAction();
		}
	},
	bindEvent : function() {
		//动态绑定
		$(".select_type").unbind().on("change",function(){
			var tag=$(this).attr("tag");
			var id="#illness_list";
			if(tag=="0"){
				$("#illness_list1").show();
				$("#illness_list2").hide();
			}else if(tag=="1"){
				$("#illness_list2").show();
			}else{
				return;
			}
			illness.changeSelect(id,tag);
		});
	
		$("#header_back").click(function() {//返回
			lastPageRefresh("refresh","illnessChange","list");
			summer.closeWin();
		});
		//保存按钮
		$("#bottom_submit").click(function() {
			illness.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function() {
			var bool = $confirm("您确定取消编辑吗？");
			if (bool) {
				illness.setStatus(false);
			}
		});
		//编辑按钮
		$("#bottom_update").click(function() {
			//可编辑
			illness.setStatus(true);
			illness.type = "1";
			$(".disabled").attr("disabled",false);
		});
		//删除按钮
		$("#bottom_delete").click(function() {
			var bool = $confirm("您确定要删除吗？");
			if (bool) {
				illness.delete();
			}
		});
	},
	setStatus : function(status){
		if(status){
			$(".status3").show();//显示取消、保存
			$(".status2").hide();//隐藏编辑、删除
		}else{
			$(".status3").hide();//隐藏取消、保存
			$(".status2").show();//显示编辑、删除
		}
	},
	initPage : function() {
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		//批次号
		$("#body_batch").text(logininfo.henneryinfo.batch);
		//批次pk
		$("#body_batch").attr("pk_batch",logininfo.henneryinfo.pk_batch);
		//鸡场名称
		$("#body_henner_name").text(logininfo.henneryinfo.hennery_name);
		//鸡场pk
		$("#body_henner_name").attr("pk_hennery", logininfo.henneryinfo.pk_hennery);
		//填报日期
		$("#body_create_date").text(getNowFormatDate());
		//日龄
		$("#body_days").text(logininfo.henneryinfo.days);
	},
	initCallAction : function() {//新增初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var json = {
			logininfo : logininfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(illness.viewid,"init",json,"initAddcallBack");
	},
	infoInitCallAction : function(){//详情初始化接口
		if(summer.pageParam.pk_illness_change){
			illness.pk_illness_change=summer.pageParam.pk_illness_change
			$("#body_create_date").attr("pk_illness_change",illness.pk_illness_change);
		}
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var json = {
			logininfo : logininfo,
			pk_illness_change : illness.pk_illness_change,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(illness.viewid,"infoInit",json,"infoInitcallBack");
	},
	save : function() {
		if ("0" == illness.type) {
			illness.add();
			//新增保存
		} else {
			illness.update();
			//修改保存
		}
	},
	add : function() {//新增
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		//鸡场名称
		var hennery_name=$("#body_henner_name").text();
		//鸡场pk
		var pk_hennery=$("#body_henner_name").attr("pk_hennery");
		//创建日期
		var create_date=$("#body_create_date").text();
		//病变数量
		var illness_num=$("#body_num").val();
		//日龄
		var days=$("#body_days").text();
		//批次号
		var batch=$("#body_batch").text();
		//批次pk
		var pk_batch=$("#body_batch").attr("pk_batch");
		//病变名称
		var illness_item1=$("#illness_type0").val();
		var illness_item2=$("#illness_type1").val();
		var illness_item3=$("#illness_type2").val();
		//病变类型
		var pk_illness_item1=$("#illness_type0").find("option:selected").attr("id");
		var pk_illness_item2=$("#illness_type1").find("option:selected").attr("id");
		var pk_illness_item3=$("#illness_type2").find("option:selected").attr("id");
		
		//校验
		if(!illness_num || illness_num==""){
			alert("请填写数量！");
		}else if(!pk_illness_item1 || !pk_illness_item2){
			alert("请选择病变情况！");
		}/*else if(pk_illness_item2){
			if(pk_illness_item1 && pk_illness_item2 && (!pk_illness_item3)){
			}
		}*/
		var billinfo = {
			hennery_name :hennery_name,
			pk_hennery : pk_hennery,
			create_date : create_date,
			illness_num : illness_num,
			batch : batch,
			days:days,
			pk_batch : pk_batch,
			illness_item1 : illness_item1,
			illness_item2 : illness_item2,
			illness_item3 : illness_item3,
			pk_illness_item1 : pk_illness_item1,
			pk_illness_item2 : pk_illness_item2,
			pk_illness_item3 : pk_illness_item3,
		}
		var json = {
			billinfo : billinfo,
			logininfo : logininfo
		}
		illness.addCallAction(json);
	},
	addCallAction : function(json) {//新增接口
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(illness.viewid,"add",json,"addcallBack");
	},
	update : function() {//修改
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		//主键
		var pk_illness_change=$("#body_create_date").attr("pk_illness_change");
		//病变名称
		var illness_item1=$("#illness_type0").val();
		var illness_item2=$("#illness_type1").val();
		var illness_item3=$("#illness_type2").val();
		//病变类型
		var pk_illness_item1=$("#illness_type0").find("option:selected").attr("id");
		var pk_illness_item2=$("#illness_type1").find("option:selected").attr("id");
		var pk_illness_item3=$("#illness_type2").find("option:selected").attr("id");
		//病变数量
		var illness_num=$("#body_num").val();
		var billinfo = {
			pk_illness_change : pk_illness_change,
			illness_num : illness_num,
			illness_item1 : illness_item1,
			illness_item2 : illness_item2,
			illness_item3 : illness_item3,
			pk_illness_item1 : pk_illness_item1,
			pk_illness_item2 : pk_illness_item2,
			pk_illness_item3 : pk_illness_item3,
		}
		var json = {
			billinfo : billinfo,
			logininfo : logininfo
		}
		illness.updateCallAction(json);
	},
	updateCallAction : function(json) {//修改接口
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(illness.viewid,"update",json,"updatecallBack");
	},
	delete : function() {//删除
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		//主键
		var pk_illness_change=$("#body_create_date").attr("pk_illness_change");
		var json = {
			logininfo : logininfo,
			pk_illness_change : pk_illness_change
		}
		illness.deleteCallAction(json);
	},
	deleteCallAction : function(json) {//删除接口
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(illness.viewid,"delete",json,"deletecallBack");
	},
	initLoadInfo : function(data) {//新增初始化成功回调加载一级下来选数据
		var illness_item1 = data.illness_item1;
		$("#body_create_date").val(data.create_date);
		$("#illness_type0").html("");
		var html = '<option value="请选择" id="" name="">请选择</option>'
		for (var i = 0; i < illness_item1.length; i++) {
			html+='<option value="'+illness_item1[i].illness_item1+'" '
			+'id="'+illness_item1[i].pk_illness_item1+'" name="">'+illness_item1[i].illness_item1+'</option>'
		}	
		$("#illness_type0").html(html);
	},
	infoLoadData : function(data){//详情初始化成功回调加载数据
		$("#body_create_date").val(data.create_date);
		$("#body_num").val(data.illness_num);
		$("#body_days").text(data.days);
		$("#body_henner_name").text(data.hennery_name);
		//构建病变情况（一级）
		illness.append(data.illness_item1,0);
		//赋值，存全局
		$("#illness_type0").val(data.illness_name1);
		illness.item1=data.illness_item1;
		
		//构建病变情况（二级）
		if(data.illness_item2){
			$("#illness_list1").show();
			illness.append(data.illness_item2,1);
			//赋值，存全局
			$("#illness_type1").val(data.illness_name2);
			illness.item2=data.illness_item2;
		}
		//判断是否有病变情况（三级）
		if(data.illness_item3){
			$("#illness_list2").show();
			illness.append(data.illness_item3,2);
			//构建三级
			$("#illness_type2").val(data.illness_name3);
			//赋值，存全局
			illness.item3=data.illness_item3;
		}
	},
	changeSelect : function(id,tag){//下级下拉选初始化
		var illness_item=$(id+tag).find("option:selected").attr("id");
		var json = {
			illness_item : illness_item,
			tag : tag
		}
		callAction(illness.viewid,"getItem",json,"changeSelectcallBack");
	},
	append : function(billinfo,no){
		$("#illness_type"+no).html("");
		var html = '<option value="请选择" id="" name="">请选择</option>'
		for (var i = 0; i < billinfo.length; i++) {
			html+='<option value="'+billinfo[i].illness_item+'" '
			+'id="'+billinfo[i].pk_illness_item+'" name="">'+billinfo[i].illness_item+'</option>'
		}	
		$("#illness_type"+no).html(html);
	},
}


function changeSelectcallBack(args){
	if(!args.data){
		$("#illness_list2").hide();
		return;
	}
	var illness_item2=args.data.illness_item2;
	var illness_item3=args.data.illness_item3;
	if(illness_item2){
		illness.append(illness_item2,1);
	}else if(illness_item3){
		illness.append(illness_item3,2);
	}
}

function addcallBack(args){
	summer.hideProgress();
	if (args.status == "0") {
		illness.setStatus(false);//显示编辑，取消	
		$(".disable").attr("disabled", true);//不可编辑
		$("#body_create_date").attr("pk_illness_change",args.data.pk_illness_change);
		illness.pk_illness_change=args.data.pk_illness_change;
		illness.infoInitCallAction();
	} else {
		alert("保存失败" + args.message);
	}
}


function updatecallBack(args){//修改回调
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		illness.infoInitCallAction();
		illness.type="0"; //设置为新增状态
		illness.setStatus(false); //true 显示取消、保存，隐藏编辑、删除
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("修改失败" + args.message);
	}
}


function deletecallBack(args){//删除回调
	summer.hideProgress();
	if(args.status == "0"){
		illness.setStatus(true);
		illness.type="0";
		lastPageRefresh("refresh","illnessChange","list");
		summer.closeWin();
	}else{
		alert("删除失败"+args.message);
	}	
}


function initAddcallBack(args) {//新增初始化回调函数
	summer.hideProgress();
	if (args.status == "0") {
		illness.initLoadInfo(args.data);
	} else {
		alert("初始化失败：" + args.message);
	}
}

function infoInitcallBack(args){//详情初始化回调函数
	summer.hideProgress();
	if (args.status == "0") {
		illness.infoLoadData(args.data);
		illness.setStatus(false);//显示编辑，取消	
		$(".disabled").attr("disabled",true);
	} else if (args.status == "1"){
		alert("初始化失败：" + args.message);
		lastPageRefresh("refresh","illnessChange","list");
		summer.closeWin();
	} else {
		alert(args.message);
		lastPageRefresh("refresh","illnessChange","list");
		summer.closeWin();
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(arg));
}