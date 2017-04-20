summerready = function(){
	consumable.init();
	consumable.BindEvent();
}	
var consumable={
	select : [],
	i:0,	
	type : "1",
	init:function(){
		consumable.initPage();
		consumable.initInfo();
	},
	BindEvent:function(){
		//返回按钮
		$("#tital_back").click(function() {
			lastPageRefresh("refresh","consumable","list");
			summer.closeWin();
		});
		$("#mainer_photo").click(function() {//拍照按钮
			//点击显示/隐藏，再点击隐藏/显示
			$("#photo_select").toggle();
		});
		
		$("#photo").on('click',function() {//拍照
			$("#photo_select").hide();
			consumable.openPhoto();
		});
		
		$("#album").on('click',function() {//相册
			$("#photo_select").hide();
			consumable.openAlbum();
		});
		
		//保存按钮
		$("#bottom_submit").click(function() {
			consumable.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function() {
			var bool = $confirm("您确定取消编辑吗？");
			if (bool) {
				consumable.setPageStatus("2");
			}
		});
		//编辑按钮
		$("#bottom_update").click(function() {
			//可编辑
			$(".disable").attr("disabled", false);
			consumable.setPageStatus("3");
			consumable.type = "1";
		});
		//删除按钮
		$("#bottom_delete").click(function() {
			var bool = $confirm("您确定要删除吗？");
			if (bool) {
				consumable.delete();
			}
		});
		
		$("#main_plus").unbind().on("click",function(){
			var select_list=$("#select_type"+consumable.i).attr("select_list");
			$(consumable.addLi()).insertAfter("#"+select_list);
			consumable.addSecond(consumable.select);
			consumable.plusMinusAction();
			consumable.i++;
		});
		$("#main_minus").unbind().on("click",function(){
			var val=$("#select_type"+consumable.i).val();
			if("请选择"==val){
				alert("请选择易耗品！");
				return;
			}
			var select_list=$("#select_type"+consumable.i).attr("select_list");
			$("#"+select_list).remove();
			consumable.i--;
		});
		
		
	},
	plusMinusAction : function(){//对动态添加的+-好进行按钮绑定
		
		$("#main_plus").unbind().on("click",function(){
			var select_list=$("#select_type"+consumable.i).attr("select_list");
			$(consumable.addLi()).insertAfter("#"+select_list);
			consumable.addSecond(consumable.select);
			consumable.plusMinusAction();
			consumable.i++;
		});
		$("#main_minus").unbind().on("click",function(){
			var val=$("#select_type"+consumable.i).val();
			if("请选择"==val){
				alert("请选择易耗品！");
				return;
			}
			var select_list=$("#select_type"+consumable.i).attr("select_list");
			$("#"+select_list).remove();
			consumable.i--;
		});
	},
	save:function(){
		if("0"==consumable.type){
			consumable.submit();//新增保存
		}else{
			consumable.update();//修改保存
		}
	},
	submit : function() {//提交
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);//登录信息
		var array= [];
		$(".select_consumable").each(function(){
			var material_name=$(this).val();//易耗品名称
			var pk_material=$(this).find("option:selected").attr("id");//易耗品pk	
			var main_measname=$(this).attr("main_measname");//计量单位id
			var measname=$("#"+main_measname).text();
			var pk_measdoc=$("#"+main_measname).attr("pk_measdoc");//计量单位pk
			var spec=$("#"+main_measname).attr("spec");//添加规格
			var main_num=$(this).attr("main_num");//数量id
			var num=$("#"+main_num).val();
			var obj = {
				material_name : material_name,
				pk_material : pk_material,
				measname : measname,
				pk_measdoc:pk_measdoc,
				spec:spec,
				num : num
			}
			array.push(obj);
		});
		var json = {
			billinfo:array,
			logininfo:logininfo
		}
		consumable.sumbitCallAction(json);
	
	},
	delete:function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);	
		var pk_consumable_h=$("#main_create_date").attr("pk_consumable_h");
		var json = {
			pk_consumable_h : pk_consumable_h,
			logininfo : logininfo,
		} 
		consumable.deleteCallAction(json);
	},
	commit : function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);	
		var pk_consumable_h=$("#main_create_date").attr("pk_consumable_h");
		var json = {
			pk_consumable_h : pk_consumable_h,
			logininfo : logininfo,
		} 
		consumable.commitCallAction(json);
	},
	commitCallAction : function(json){//调用删除服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "commit", //方法名,
			"params" : json, //自定义参数
			"callback" : "deletecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	unCommit : function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);	
		var pk_consumable_h=$("#main_create_date").attr("pk_consumable_h");
		var json = {
			pk_consumable_h : pk_consumable_h,
			logininfo : logininfo,
		} 
		consumable.unCommitCallAction(json);
	},
	unCommitCallAction : function(json){//调用删除服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "unCommit", //方法名,
			"params" : json, //自定义参数
			"callback" : "deletecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	update:function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var array= [];
		var pk_consumable_h=$("#main_create_date").attr("pk_consumable_h");
		$(".select_consumable").each(function(){
			var material_name=$(this).val();//易耗品名称
			var pk_material=$(this).find("option:selected").attr("id");//易耗品pk	
			var main_measname=$(this).attr("main_measname");//计量单位id
			var measname=$("#"+main_measname).text();
			var pk_measdoc=$("#"+main_measname).attr("pk_measdoc");//计量单位pk
			var spec=$("#"+main_measname).attr("spec");//添加规格
			var main_num=$(this).attr("main_num");//数量id
			var num=$("#"+main_num).val();
			var obj = {
				material_name : material_name,
				pk_material : pk_material,
				measname : measname,
				pk_measdoc:pk_measdoc,
				spec:spec,
				num : num
		}
		array.push(obj);
		});
		var json = {
			pk_consumable_h:pk_consumable_h,
			billinfo:array,
			logininfo:logininfo
		}
		consumable.updateCallAction(json);
	},
	
	
	
	/*setStatus : function(status){
		if(status){
			$(".status3").show();//显示取消、保存
			$(".status2").hide();//隐藏编辑、删除
		}else{
			$(".status3").hide();//隐藏取消、保存
			$(".status2").show();//显示编辑、删除
		}
	},*/
	setPageStatus:function(type){
		for(var i=1;i<4;i++){
			 $(".status"+i).hide();
		} 
		$(".status"+type).show();
		if(type ==3){
			//可编辑
			$(".disable").attr("disabled",false);
		}else{
			//不可编辑
			$(".disable").attr("disabled",true);
		}
	},
	initPage:function(){//界面初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		$("#main_henner_name").val(logininfo.henneryinfo.hennery_name)//鸡场名称
		$("#main_henner_name").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);//鸡场pk
	},
	createSecondSelect : function(children,second){//根据设备表子表数量来构建表体
		$(".firstList").html("");
		var html="";
		for(var i=0;i<children.length;i++){
			consumable.i=i;
			html+='<li class="equips" id="equip'+i+'">'
				+'		<div class="um-list-item">'
				+'			<div class="um-list-item-inner">'
				+'				<div class="um-list-item-left pl15" style="width: 30%;">'
				+'					设备名称：'
				+'				</div>'
				+'				<div class="um-list-item-right">'
				+'					<div class="um-input-text consumable_type" >'
				+'						<span> <a href="#" class="ti-minus select_minus minus "  equip="equip'+i+'" id="select_minus'+i+'"></a> </span>'
			    +'					<select style="width: 55%;" class="select_border select_equip disable equip'+i+'" equip="equip'+i+'"'
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
		consumable.addSecondSelect(second);//添加二级选择项
		consumable.plusMinusAction();//动态绑定按钮
	},
	addLi : function(){
		var no=consumable.i
		consumable.html(no);
		return html;
	},
	setSelectVal : function(selectVal){//易耗品赋值
		for(var i=0 ; i < selectVal.length ; i++){
			$("#select_type"+i).val(selectVal[i].material_name);//易耗品赋值
			var main_measname=$("#select_type"+i).attr("main_measname");//获取计量单位id
			$("#"+main_measname).val(selectVal[i].measname);//计量单位赋值
			$("#"+main_measname).attr("pk_measdoc",selectVal[i].pk_measdoc);//添加计量单位pk
			$("#"+main_measname).attr("spec",selectVal[i].spec);//添加规格
			
		}
	},
	initLoadInfo:function(data){//加载界面数据
		if("Y"==commit_flag && "Y"==confirm_flag){
			//Y 已提交 对应状态1
			consumable.setPageStatus("1");
		}else {
			// 为提交 对应状态2
			consumable.setPageStatus("2");
		}
		$("#main_create_date").val(data.create_date);//业务日期
		$("#main_create_date").attr("pk_consumable_h",data.pk_consumable_h);//pk
		$("#main_create_date").attr("commit_flag",data.commit_flag);//提交标志
		$("#main_create_date").attr("confirm_flag",data.confirm_flag);//确认标志
		$("#main_batch").text(data.batch);//批次号
		$("#main_henner_name").val(data.hennery_name);//鸡场名称
		consumable.createSelect(data.billinfo)//构建易耗品选择项列表
		consumable.loadSelect(data.materialinfo)//加载选择项
		consumable.setSelect(data.materialinfo);//将列表存入缓存中
		consumable.setSelectVal(data.billinfo);//易耗品赋值
	},
	setSelect : function(select){//将列表存入缓存中
		for(var i;i<select;i++){
			var json = {
				material_name : select.material_name,
				pk_material : select.pk_material,
				material_spec : select.material_spec,
				measname : select.measname,
				pk_measdoc:select.pk_measdoc
			}
			consumable.select.push(json)
		}
	},
	loadSelect : function(select){//加载选择项
		$("#select_consumable").html("");
		var html='<option  selected="selected" >请选择</option>';
		var name_spec;
		for(var i=0;i<select.length;i++){
			name_spec=""+select[i].material_name+select[i].material_spec;
			html+='<option value="'+select[i].material_name+'" id="'+select[i].pk_material+'">'+name_spec+'</option>'
		}
		$("#select_consumable").html(html);
	},
	createSelect : function(select){//构建易耗品选择项列表
		$("#select_top").html("");
		var html="";	
		for(var i=0 ; i < select.length ; i++){
			var no=i
			html+='<div id="select_list'+no+'">'
				+'			<li>'
				+'				<div class="um-list-item">'
				+'					<div class="um-list-item-inner">'
				+'						<div class="um-list-item-left pl15">'
				+'							易耗品名：'
				+'						</div>'
				+'						<div class="um-list-item-right">'
				+'							<div class="um-input-text consumable_type" >'
				+'								<select  class="select_border select_consumable disable" '
				+'									select_list="select_list'+no+'" id="select_type'+no+'"'
				+'									main_num="main_num'+no+'" main_measname="main_measname'+no+'"	>'
				+'									<option  selected="selected" >请选择</option>'
				+'								</select>'
				+'							</div>'
				+'						</div>'
				+'					</div>'
				+'				</div>'
				+'			</li>'
				+'			<li>'
				+'				<div class="um-list-item">'
				+'					<div class="um-list-item-inner">'
				+'						<div class="um-list-item-left pl15" style="width: 40%;">'
				+'							数量：'
				+'						</div>'
				+'						<div class="um-list-item-right">'
				+'							<input id="main_num'+no+'" class="form-control" >'
				+'						</div>'
				+'					</div>'
				+'					<div class="um-list-item-inner">'
				+'						<div class="um-list-item-left pl15" style="width: 40%;">'
				+'							单位：'
				+'						</div>'
				+'						<div class="um-list-item-right">'
				+'							<span id="main_measname'+no+'" class="form-control" >'
				+'						</div>'
				+'					</div>'
				+'				</div>'
				+'			</li>'
				+'		</div>'
		}
		$("#select_top").html(html);
	},
	initNewSelect : function(data){
		var billinfo=data.billinfo
		//设备类型
		$("#select_type").html("");
		var html='<option  selected="selected" >请选择</option>';
		var name_spec;
		for(var i=0;i<billinfo.length;i++){
			var name_spec=""+select[i].material_name+select[i].material_spec;
			html+='<option value="'+billinfo[i].material_name+'" id="'+billinfo[i].pk_material+'">'+billinfo[i].material_name+'</option>'
		}
		$("#select_type").html(html);
	},
	addSecond : function(pk_equip){//添加二级列表选择项
		var json = {
			pk_equip : pk_equip,
		}
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
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
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
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
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
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
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "update", //方法名,
			"mauploadpath" : consumable.image,
			"params" : json, //自定义参数
			"callback" : "updatecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initInfo : function(){//详情初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var pk_material=summer.pageParam.pk_material;
		var json = {
			logininfo : logininfo,
			pk_material : pk_material
		}
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "queryInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "queryInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
		
	},
	initupdateInfo : function(){//详情初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var pk_material=$("#main_create_date").attr("pk_material");
		var json = {
			logininfo : logininfo,
			pk_material : pk_material
		}
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "queryInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "queryInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
		
	},
	changeSelect : function(select,select_type){//子项初始化
		var pk_material=$("#"+select_type).find("option:selected").attr("id");//获得易耗品pk
		var main_measname=$("#"+select_type).attr("main_measname");
		for(var i=0;i<select.length;i++){
			if(pk_material==select[i].pk_material){
				$("#"+main_measname).val(select[i].measname);
			}
		}
		
	},
	html : function(no){
		var html="";
		html+='<div id="select_list'+no+'">'
			+'			<li>'
			+'				<div class="um-list-item">'
			+'					<div class="um-list-item-inner">'
			+'						<div class="um-list-item-left pl15">'
			+'							易耗品名：'
			+'						</div>'
			+'						<div class="um-list-item-right">'
			+'							<div class="um-input-text consumable_type" >'
			+'								<select  class="select_border select_consumable disable" '
			+'									select_list="select_list'+no+'" id="select_type'+no+'"'
			+'									main_num="main_num'+no+'" main_measname="main_measname'+no+'"	>'
			+'									<option  selected="selected" >请选择</option>'
			+'								</select>'
			+'							</div>'
			+'						</div>'
			+'					</div>'
			+'				</div>'
			+'			</li>'
			+'			<li>'
			+'				<div class="um-list-item">'
			+'					<div class="um-list-item-inner">'
			+'						<div class="um-list-item-left pl15" style="width: 40%;">'
			+'							数量：'
			+'						</div>'
			+'						<div class="um-list-item-right">'
			+'							<input id="main_num'+no+'" class="form-control" >'
			+'						</div>'
			+'					</div>'
			+'					<div class="um-list-item-inner">'
			+'						<div class="um-list-item-left pl15" style="width: 40%;">'
			+'							单位：'
			+'						</div>'
			+'						<div class="um-list-item-right">'
			+'							<span id="main_measname'+no+'" class="form-control" >'
			+'						</div>'
			+'					</div>'
			+'				</div>'
			+'			</li>'
			+'		</div>'
			return html;
	}
	
}

/**
 * 接口回调模块
 */

$(function(){
	$(".select_consumable").on('click',function() {
		var select_type=$(this).attr("id");
		$("#"+select_type).change(function(){
			consumable.changeSelect(consumable.select,select_type);
		});
	});
});

function commitcallBack(){
	summer.hideProgress();
	if(arg.status == "0"){
		consumable.setPageStatus("1");
		alert("提交成功");
	}else{
		alert("提交失败");
	}
}

function unCommitcallBack(){
	summer.hideProgress();
	if(arg.status == "0"){
		consumable.setPageStatus("2");
	}else{
		alert(arg.message);
	}	
}

function lastPageRefresh(jsfun,url,html){
	var jsfun = ""+jsfun+"();";
	var id = "/"+url+"/"+html+".html"
	summer.execScript({
	    winId: id,
	    script: jsfun
	});
}



function changeSelectcallBack(args){//改变设备类别
	consumable.loadSecondSelect(args.data);
}

function queryInitcallBack(args) {//详情初始化回调
	if (args.status == "0") {
		consumable.initLoadInfo(args.data);
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("初始化失败" + args.message);
	}
}

function deletecallBack(args){//删除回调
	summer.hideProgress();
	if(args.status == "0"){
		consumable.type="0";
		lastPageRefresh("refresh","consumable","list");
		summer.closeWin();
	}else{
		alert("删除失败"+args.message);
	}	
}

function savecallBack(args){
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		$("#main_create_date").attr("pk_consumable_h",args.data.consumable);
		consumable.initupdateInfo();
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("保存失败" + args.message);
	}
}

function updatecallBack(args){//修改回调
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		consumable.type="0"; //设置为新增状态
		consumable.initupdateInfo(data);
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("修改失败" + args.message);
	}
}

function addInitcallBack(args) {//初始化回调
	if (args.status == "0") {
		consumable.initNewSelect(args.data);
	} else {
		alert("初始化失败" + args.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(arg));
}