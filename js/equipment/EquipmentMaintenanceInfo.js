summerready = function(){
	Equipment.init();
	Equipment.BindEvent();
}	
var Equipment={
	pk_equipment:"",
	i:0,	
	image : "", //图片路径
	type : "1",
	init:function(){
		Equipment.initPage();
		Equipment.initAdd();
		Equipment.initInfo();
	},
	BindEvent:function(){
		//返回按钮
		$("#tital_back").click(function() {
			lastPageRefresh("refresh","equipment","EquipmentFirstList");
			summer.closeWin();
		});
		$("#header_photo").click(function() {//拍照按钮
			//点击显示/隐藏，再点击隐藏/显示
			$("#photo_select").toggle();
		});
		
		$("#photo").on('click',function() {//拍照
			$("#photo_select").hide();
			Equipment.openPhoto();
		});
		
		$("#album").on('click',function() {//相册
			$("#photo_select").hide();
			Equipment.openAlbum();
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
			var pk_equipment=$("#select_type").find("option:selected").attr("id");
			//Equipment.addSecond(Equipment.pk_equipment);
			Equipment.addSecond(pk_equipment);
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
			Equipment.i--
		});
		
		
	},
	plusMinusAction : function(){//对动态添加的+-好进行按钮绑定
		
		$(".select_plus").unbind().on("click",function(){
			var equip=$(this).attr("equip");
			$(Equipment.addLi()).insertAfter("#"+equip);
			var pk_equipment=$("#select_type").find("option:selected").attr("id");
			//Equipment.addSecond(Equipment.pk_equipment);
			Equipment.addSecond(pk_equipment);
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
			Equipment.i--;
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
			var equip_name=$("#select_second_type").val();//子项名称
			var pk_equip=$("#select_second_type").find("option:selected").attr("id");//子项pk	
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
	
	update:function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var array= [];
		var equip_name=$("#select_type").val();
		var pk_equip=$("#select_type").find("option:selected").attr("id");
		var pk_equip_maint_h=$("#head_create_date").attr("pk_equip_maint_h");
		var date=$("#head_create_date").val();
		var img=$("#body_picture").attr("src");
		$(".select_equip").each(function(){
			var equip_name=$(this).val();
			var pk_equip=$(this).find("option:selected").attr("id");	
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
		$("#head_henner_name").val(logininfo.henneryinfo.hennery_name)//鸡场名称
		$("#head_henner_name").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);//鸡场pk
	},
	loadSecondSelect : function(data){//加载设备二级下拉选
		var second=data.second;
		var children=data.children;
		if(second && children){
			//根据设备表子表数量来构建表体并添加选择项
			Equipment.createSecondSelect(children,second);
			//填充对应的选择值
			Equipment.fillChildrenValue(children);
		}else{
			//添加二级选择先项
			Equipment.loadaddSecondSelect(second);
		}
	},
	createSecondSelect : function(children,second){//根据设备表子表数量来构建表体
		$(".firstList").html("");
		var html="";
		for(var i=0;i<children.length;i++){
			Equipment.i=i;
			html+='<li class="equips" id="equip'+i+'">'
				+'		<div class="um-list-item">'
				+'			<div class="um-list-item-inner">'
				+'				<div class="um-list-item-left pl15" style="width: 30%;">'
				+'					设备名称：'
				+'				</div>'
				+'				<div class="um-list-item-right">'
				+'					<div class="um-input-text equipment_type" >'
				+'						<span> <a href="#" class="ti-minus select_minus minus "  equip="equip'+i+'" id="select_minus'+i+'"></a> </span>'
			    +'					<select style="width: 55%;background: #FFFFFF;" class="select_border select_equip disable equip'+i+'" equip="equip'+i+'"'
			    +'					 id="select_second_type'+i+'">'
				+'							<option value="" name="" selected="selected" >请选择</option>'
				+'						</select>'
				+'						<span> <a href="#" class="ti-plus select_plus plus " equip="equip'+i+'" id="select_plus'+i+'"></a> </span>'
				+'					</div>'
				+'				</div>'
				+'			</div>'
				+'		</div>'
				+'	</li>'
		}	
		$(".firstList").html(html);
		Equipment.addSecondSelect(second);//添加二级选择项
		Equipment.plusMinusAction();//动态绑定按钮
	},
	fillChildrenValue : function(children){//填充对应的选择值
		for(var i=0;i<children.length;i++){
			var name=children[i].equip_name;
			$("#select_second_type"+i).val(name);
		}
	},
	addSecondSelect : function(second){
		//设备类型
		$(".select_equip").html("");
		var html='<option  selected="selected" >请选择</option>';
		for(var i=0;i<second.length;i++){
			html+='<option value="'+second[i].equip_name+'" id="'+second[i].pk_equip+'">'+second[i].equip_name+'</option>'
		}
		$(".select_equip").html(html);
	},
	loadaddSecondSelect : function(second){
		//设备类型
		$("#select_second_type"+Equipment.i).html("");
		var html='<option  selected="selected" >请选择</option>';
		for(var i=0;i<second.length;i++){
			html+='<option value="'+second[i].equip_name+'" id="'+second[i].pk_equip+'">'+second[i].equip_name+'</option>'
		}
		$("#select_second_type"+Equipment.i).html(html);
	},
	addLi : function(){
		var no=++Equipment.i;
		var html="";
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
	initSelect : function(billinfo){//初始化设备类型下拉选
		//设备类型
		$("#select_type").val(billinfo.equip_name);
	},
	initLoadInfo:function(data){//加载界面数据
		$("#header_photo").show();
		var billinfo=data.billinfo[0];
		$("#head_create_date").val(billinfo.create_date);//业务日期
		if(billinfo.img){
			$("#body_picture").attr("src",billinfo.img);//图片
		}
		if(billinfo.pk_equip_maint_h){
			$("#head_create_date").attr("pk_equip_maint_h",billinfo.pk_equip_maint_h);//pk
		}
		if(billinfo.isflag){
			$("#body_picture").attr("isflag",billinfo.isflag);//图片标志
		}
		Equipment.initSelect(billinfo);//一级赋值
		Equipment.loadSecondSelect(data)//二级赋值
	},
	openPhoto : function() {//打开相机
		$camera.open({
			"bindfield" : "image",
			"compressionRatio" : "0.3",
			"callback" : "openPhotoCallBack()"
		});
	},
	openAlbum : function() {//打开相册
		$camera.openPhotoAlbum({
			"compressionRatio" : 0.3,
			callback : "openAlbumCallBack()"
		});
	},
	initNewSelect : function(data){
		var billinfo=data.billinfo
		//设备类型
		$("#select_type").html("");
		var html='<option  selected="selected" >请选择</option>';
		for(var i=0;i<billinfo.length;i++){
			html+='<option value="'+billinfo[i].equip_name+'" id="'+billinfo[i].pk_equip+'">'+billinfo[i].equip_name+'</option>'
		}
		$("#select_type").html(html);
	},
	addSecond : function(pk_equip){//添加二级列表选择项
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
	sumbitCallAction : function(json){//调用新增服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "save", //方法名,
			"params" : json, //自定义参数
			"callback" : "savecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
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
	updateCallAction : function(json){//调用修改服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "update", //方法名,
			"mauploadpath" : Equipment.image,
			"params" : json, //自定义参数
			"callback" : "updatecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
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
		var pk_equip_maint_h=summer.pageParam.pk_equip_maint_h;
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
	initupdateInfo : function(){//详情初始化
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

function openPhotoCallBack(args){
	$alert(args.compressImgPath);
	Equipment.image = args.compressImgPath;
	$("#body_picture").attr("src", Equipment.image);//疫情图片
}


function openAlbumCallBack(args) {
	$alert(args.compressImgPath);
	Equipment.image = args.compressImgPath;
	$("#body_picture").attr("src", Equipment.image);//疫情图片
}


function changeSelectcallBack(args){//改变设备类别
	Equipment.loadSecondSelect(args.data);
}

function queryInitcallBack(args) {//详情初始化回调
	if (args.status == "0") {
		Equipment.setStatus(false);
		Equipment.initLoadInfo(args.data);
		$(".disable").attr("disabled", true);//不可编辑
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
		Equipment.setStatus(false);//显示编辑，取消		
		Equipment.initupdateInfo();
		$(".disable").attr("disabled", true);//不可编辑
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
		Equipment.initupdateInfo(data);
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("修改失败" + args.message);
	}
}

function addInitcallBack(args) {//初始化回调
	if (args.status == "0") {
		Equipment.initNewSelect(args.data);
	} else {
		alert("初始化失败" + args.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(arg));
}