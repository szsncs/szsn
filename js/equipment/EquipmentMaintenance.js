summerready = function(){
	Equipment.init();
	Equipment.BindEvent();
}	
var Equipment={
	i : 0,
	pk_equipment:"",
	image : "", //图片路径
	type : "0",
	init:function(){
		Equipment.initPage();
		Equipment.initAdd();
	},
	BindEvent:function(){
		//返回按钮
		$("#tital_back").click(function() {
			lastPageRefresh("refresh","equipment","EquipmentFirstList");
			summer.closeWin();
		});
		//保存按钮
		$("#bottom_submit").click(function() {
			Equipment.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function() {
			var bool = $confirm("您确定取消编辑吗？");
			if (bool) {
				Equipment.setStatus(false);
			}
		});
		//编辑按钮
		$("#bottom_update").click(function() {
			//可编辑
			$(".disable").attr("disabled", false);
			Equipment.setStatus(true);
			Equipment.type = "1";
		});
		//删除按钮
		$("#bottom_delete").click(function() {
			var bool = $confirm("您确定要删除吗？");
			if (bool) {
				Equipment.delete();
			}
		});
		
		$("#select_type").change(function(){
			Equipment.changeSelect();
		});
		
		$(".select_plus").unbind().on("click",function(){
			
			var equip=$(this).attr("equip");
			$(Equipment.addLi()).insertAfter("#"+equip);
			Equipment.addSecond(Equipment.pk_equipment);
			Equipment.plusMinusAction()
		});
		$(".select_minus").unbind().on("click",function(){
			var val=$("#select_type").val();
			if("请选择"==val){
				alert("请选择设备类别！");
				return;
			}
			var equip=$(this).attr("equip");
			$("#"+equip).remove();
		});
		
	},
	plusMinusAction : function(){
		
		$(".select_plus").unbind().on("click",function(){
			var equip=$(this).attr("equip");
			$(Equipment.addLi()).insertAfter("#"+equip);
			Equipment.addSecond(Equipment.pk_equipment);
			Equipment.plusMinusAction();
		});
		$(".select_minus").unbind().on("click",function(){
			var val=$("#select_type").val();
			if("请选择"==val){
				alert("请选择设备类别！");
				return;
			}
			var equip=$(this).attr("equip");
			$("#"+equip).remove();
		});
	}, 
	addLi : function(){
		var html="";
		var no=++Equipment.i
		html+='<li class="equips" id="equip'+no+'">'
			+'			<div class="um-list-item">'
			+'				<div class="um-list-item-inner">'
			+'					<div class="um-list-item-left pl15" style="width: 30%;">'
			+'						设备名称：'
			+'					</div>'
			+'					<div class="um-list-item-right">'
			+'						<div class="um-input-text equipment_type" >'
			+'							<span> <a href="#" class="ti-minus minus select_minus" equip="equip'+no+'"  id="select_minus'+no+'"></a> </span>'
			+'							<select style="width: 55%;background: #FFFFFF;" class="select_border select_equip disable" id="select_second_type'+no+'">'
			+'								<option  selected="selected" >请选择</option>'
			+'							</select>'
			+'							<span> <a href="#" class="ti-plus plus select_plus" equip="equip'+no+'" id="select_plus'+no+'"></a> </span>'
			+'						</div>'
			+'					</div>'
			+'				</div>'
			+'			</div>'
			+'		</li>'
		return html;
	},
	loadSecondSelect : function(data){//加载设备子项下拉选
		var second=data.second;
		//设备类型
		$("#select_second_type"+Equipment.i).html("");
		var html='<option  selected="selected" >请选择</option>';
		for(var i=0;i<second.length;i++){
			html+='<option value="'+second[i].equip_name+'" id="'+second[i].pk_equip+'">'+second[i].equip_name+'</option>'
		}
		$("#select_second_type"+Equipment.i).html(html);
		
	},
	addSecond : function(pk_equip){
		var json = {
			pk_equip : pk_equip,
		}
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "queryEquip", //方法名,
			"params" : json, //自定义参数
			"callback" : "changeSelectcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	save:function(){
		if("0"==Equipment.type){
			Equipment.submit();//新增保存
		}else{
			Equipment.update();//修改保存
		}
	},
	submit : function() {//提交
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);//登录信息
		var array= [];
		var equip_name=$("#select_type").val();//设备类型名称
		var pk_equip=$("#select_type").find("option:selected").attr("id");//设备pk
		
		$(".select_equip").each(function(){
			var equip_name=$(this).val();//子项名称
			var pk_equip=$(this).find("option:selected").attr("id");//子项pk	
			var obj = {
				pk_equip : pk_equip,
				equip_name : equip_name
			}
			array.push(obj);
		});
		var json = {
			pk_equip:pk_equip,
			equip_name:equip_name,
			billinfo:array,
			logininfo:logininfo
		}
		Equipment.sumbitCallAction(json);
	
	},
	sumbitCallAction : function(json){//调用新增服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "add", //方法名,
			"params" : json, //自定义参数
			"callback" : "savecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	delete:function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);	
		var pk_equip_maint_h=$("#head_create_date").attr("pk_equip_maint_h");
		var json = {
			pk_equip_maint_h : pk_equip_maint_h,
			logininfo : logininfo,
		} 
		Equipment.deleteCallAction(json);
	},
	deleteCallAction : function(json){//调用删除服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "delete", //方法名,
			"params" : json, //自定义参数
			"callback" : "deletecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	update:function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var array= [];
		var equip_name=$("#select_type").val();
		var pk_equip=$("#select_type").find("option:selected").attr("id");
		var img=$("#body_picture").attr("src");
		var pk_equip_maint_h=$("#head_create_date").attr("pk_equip_maint_h");
		var date=$("#head_create_date").val();
		$(".select_equip").each(function(){
			var equip_name=$("#select_second_type").val();
			var pk_equip=$("#select_second_type").find("option:selected").attr("id");	
			var obj = {
				pk_equip : pk_equip,
				equip_name : equip_name
			}
			array.push(obj);
		});
		var json = {
			date:date,
			img:img,
			pk_equip:pk_equip,
			equip_name:equip_name,
			pk_equip_maint_h:pk_equip_maint_h,
			billinfo:array,
			logininfo:logininfo
		}
		Equipment.updateCallAction(json);
	},
	updateCallAction : function(json){//调用修改服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "update", //方法名,
			"params" : json, //自定义参数
			"callback" : "updatecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
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
	initPage:function(){//界面初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		//$("#head_batch").text(logininfo.henneryinfo.batch);//批次号
		$("#head_henner_name").val(logininfo.henneryinfo.hennery_name)//鸡场名称
		$("#head_henner_name").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);//鸡场pk
	},
	initAdd : function(){//新增初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var json = {
			logininfo : logininfo,
		}
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "addInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "addInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initInfo : function(){//详情初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var pk_equip_maint_h=$("#head_create_date").attr("pk_equip_maint_h");
		var json = {
			logininfo : logininfo,
			pk_equip_maint_h : pk_equip_maint_h
		}
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "queryInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "queryInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
		
	},
	changeSelect : function(){//子项初始化
		var pk_equip=$("#select_type").find("option:selected").attr("id");
		Equipment.pk_equipment=pk_equip;
		var json = {
			pk_equip : pk_equip,
		}
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "queryEquip", //方法名,
			"params" : json, //自定义参数
			"callback" : "changeSelectcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});	
	},
	initSelect : function(data){//初始化设备类型下拉选
		var billinfo=data.billinfo
		//设备类型
		$("#select_type").html("");
		var html='<option  selected="selected" >请选择</option>';
		for(var i=0;i<billinfo.length;i++){
			html+='<option value="'+billinfo[i].equip_name+'" id="'+billinfo[i].pk_equip+'">'+billinfo[i].equip_name+'</option>'
		}
		$("#select_type").html(html);
	},
	initLoadInfo:function(data){//加载界面数据
		$("#head_create_date").val(data.create_date);
		if(data.img){
			$("#body_picture").attr("src",data.img);
		}
		if(data.pk_equip_maint_h){
			$("#head_create_date").attr("pk_equip_maint_h",data.pk_equip_maint_h);
		}
		Equipment.initSelect(data);
	},
}

/**
 * 接口回调模块
 */

function lastPageRefresh(jsfun,url,html){
	var jsfun = ""+jsfun+"();";
	var id = "/"+url+"/"+html+".html"
	summer.execScript({
	    winId: id,
	    script: jsfun
	});
}

function changeSelectcallBack(args){//改变设备类别
	Equipment.loadSecondSelect(args.data);
}

function queryInitcallBack(args) {//详情初始化回调
	if (args.status == "0") {
		Equipment.initInfo(args.data);
	} else {
		alert("初始化失败" + args.message);
	}
}

function deletecallBack(args){//删除回调
	summer.hideProgress();
	if(args.status == "0"){
		Equipment.setStatus(true);
		$(".disable").attr("disabled", false);//可编辑
		Equipment.type="0";
		lastPageRefresh("refresh","equipment","EquipmentFirstList");
		summer.closeWin();
	}else{
		alert("删除失败"+args.message);
	}	
}

function savecallBack(args){
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		$("#head_create_date").attr("pk_equip_maint_h",args.data.pk_equip_maint_h);
		Equipment.setStatus(false);//显示编辑，取消		
		$(".disable").attr("disabled", true);//不可编辑
		//Equipment.initInfo();
		lastPageRefresh("refresh","equipment","EquipmentFirstList");
		summer.closeWin();
	} else {
		alert("保存失败" + args.message);
	}
}

function updatecallBack(args){//修改回调
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		Equipment.setStatus(false); //true 显示取消、保存，隐藏编辑、删除
		Equipment.type="0"; //设置为新增状态
		$(".disable").attr("disabled", true);//不可编辑
		Equipment.initInfo(data);
	} else {
		alert("修改失败" + args.message);
	}
}

function addInitcallBack(args) {//初始化回调
	if (args.status == "0") {
		Equipment.initLoadInfo(args.data);
	} else {
		alert("初始化失败" + args.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(arg));
}