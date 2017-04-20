summerready = function(){
	consumable.init();
	consumable.BindEvent();
}	
var consumable={
	select : [],
	i : 0,
	type : "0",
	init:function(){
		consumable.initPage();
		consumable.initAdd();
	},
	BindEvent:function(){
		//返回按钮
		$("#tital_back").click(function() {
			lastPageRefresh("refresh","consumable","list");
			summer.closeWin();
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
		//加载计量单位
		$(".select_consumable").unbind().on('click',function() {
			var select_type=$(this).attr("id");
			$("#"+select_type).change(function(){
				consumable.changeSelect(consumable.select,select_type);
			});
		});
		
		$("#main_plus").unbind().on("click",function(){
			var select_list=$("#select_type"+consumable.i).attr("select_list");
			$(consumable.addLi()).insertAfter("#"+select_list);
			consumable.i++;
			consumable.addSecond(consumable.select);
			consumable.loadMeasname();
			consumable.plusMinusAction();
		});
		$("#main_minus").unbind().on("click",function(){
			var val=$("#select_type"+consumable.i).val();
			if(consumable.i==0 && "请选择"!=val){
				alert("不允许删除！");
				return;
			}
			var select_list=$("#select_type"+consumable.i).attr("select_list");
			$("#"+select_list).remove();
			consumable.i--;
		});
		
	},
	loadMeasname : function(){
		$(".select_consumable").unbind().on('click',function() {
			var select_type=$(this).attr("id");
			$("#"+select_type).change(function(){
				consumable.changeSelect(consumable.select,select_type);
			});
		});
	},
	
	plusMinusAction : function(){
		
		$("#main_plus").unbind().on("click",function(){
			var select_list=$("#select_type"+consumable.i).attr("select_list");
			$(consumable.addLi()).insertAfter("#"+select_list);
			consumable.i++;
			consumable.addSecond(consumable.select);
			consumable.loadMeasname();
			consumable.plusMinusAction();
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
	addLi : function(){
		var no=consumable.i+1;
		//consumable.html(no);
		return consumable.html(no);
	},
	addSecond : function(select){
		//设备类型
		$("#select_type"+consumable.i).html("");
		var html='<option  selected="selected" >请选择</option>';
		var name_spec;
		for(var i=0;i<select.length;i++){
			if(!select[i].spec){
				name_spec=""+select[i].material_name;
			}else{
				name_spec=""+select[i].material_name+"/"+select[i].spec;
			}
			html+='<option value="'+select[i].material_name+'"'
			+' id="'+select[i].pk_material+'">'+name_spec+'</option>'
		}
		$("#select_type"+consumable.i).html(html);
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
	sumbitCallAction : function(json){//调用新增服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "add", //方法名,
			"params" : json, //自定义参数
			"callback" : "savecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
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
	updateCallAction : function(json){//调用修改服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "update", //方法名,
			"params" : json, //自定义参数
			"callback" : "updatecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
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
			"callback" : "commitcallBack()", //请求回来后执行的ActionID
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
			"callback" : "unCommitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
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
		$("#main_batch").attr("pk_batch",logininfo.henneryinfo.pk_batch);//批次pk
		$("#main_batch").text(logininfo.henneryinfo.batch);//批次号
		$("#main_henner_name").text(logininfo.henneryinfo.hennery_name);//鸡场名称
		$("#mainhenner_name").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);//鸡场pk
		$("#main_create_date").text(getNowFormatDate());//填报日期
		consumable.setPageStatus("3");
	},
	initAdd : function(){//新增初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var json = {
			logininfo : logininfo,
		}
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "addInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "addInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initInfo : function(){//详情初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var pk_consumable_h=$("#main_create_date").attr("pk_consumable_h");
		var json = {
			logininfo : logininfo,
			pk_consumable_h : pk_consumable_h
		}
		$service.callAction({
			"viewid" : "com.sunnercn.consumable.ConsumableController", //后台带包名的Controller名
			"action" : "queryInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "queryInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
		
	},
	initSelect : function(materialinfo){//初始化易耗品下拉选
		var no=consumable.i
		//设备类型
		$("#select_type"+no).html("");
		var html='<option  selected="selected" >请选择</option>';
		var name_spec;
		for(var i=0;i<materialinfo.length;i++){
			if(!materialinfo[i].spec){
				name_spec=""+materialinfo[i].material_name;
			}else{
				name_spec=""+materialinfo[i].material_name+"/"+materialinfo[i].spec;
			}
			html+='<option value="'+materialinfo[i].material_name+'"'
			+' id="'+materialinfo[i].pk_material+'">'+name_spec+'</option>'
		}
		$("#select_type"+no).html(html);
	},
	changeSelect : function(select,select_type){
		var pk_material=$("#"+select_type).find("option:selected").attr("id");//获得易耗品pk
		var main_measname=$("#"+select_type).attr("main_measname");
		for(var i=0;i<select.length;i++){
			if(pk_material==select[i].pk_material){
				$("#"+main_measname).text(select[i].measname);
			}
		}
	},
	loadListInfo : function(data){
		if("Y"==data.commit_flag && "Y"==data.confirm_flag){
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
	setSelectVal : function(selectVal){//易耗品赋值
		for(var i=0 ; i < selectVal.length ; i++){
			$("#select_type"+i).val(selectVal[i].material_name);//易耗品赋值
			var main_measname=$("#select_type"+i).attr("main_measname");//获取计量单位id
			$("#"+main_measname).val(selectVal[i].measname);//计量单位赋值
			$("#"+main_measname).attr("pk_measdoc",selectVal[i].pk_measdoc);//添加计量单位pk
			$("#"+main_measname).attr("spec",selectVal[i].spec);//添加规格
			
		}
	},
	setSelect : function(select){//将列表存入缓存中
		consumable.select=select;
		console.log(consumable.select);
		/*for(var i=0;i<select.length;i++){
			var json = {
				material_name : select.material_name,
				pk_material : select.pk_material,
				material_spec : select.material_spec,
				measname : select.measname,
				pk_measdoc:select.pk_measdoc
			}
			consumable.select.push(json)
			console.log(consumable.select);
		}*/
	},
	loadSelect : function(select){//加载选择项
		$("#select_consumable").html("");
		var html='<option  selected="selected" >请选择</option>';
		var name_spec;
		for(var i=0;i<select.length;i++){
			if(!select[i].spec){
				name_spec=""+select[i].material_name;
			}else{
				name_spec=""+select[i].material_name+"/"+select[i].spec;
			}
			//name_spec=""+select[i].material_name+select[i].material_spec;
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
				+'					<div class="um-list-item-inner" style="width: 40%;">'
				+'						<div class="um-list-item-left pl15">'
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
	initLoadInfo:function(data){//加载界面数据
		$("#main_create_date").val(data.create_date);
		consumable.initSelect(data.materialinfo);//初始化选择项
		consumable.setMeasname(data.materialinfo)//赋值计量单位
		consumable.setSelect(data.materialinfo);//将选择项存入缓存中
	},
	setMeasname : function(materialinfo){
		var no=consumable.i
		var main_measname=$("#select_type"+no).attr("main_measname");//获取计量单位id
		$("#"+main_measname).text(materialinfo.measname);//赋值计量单位名称
		$("#"+main_measname).attr("pk_measdoc",materialinfo.pk_measdoc);//赋值计量单位pk
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
			+'							<div class="um-input-text equipment_type" >'
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
			+'						<div class="um-list-item-left pl15" style="width:40%;">'
			+'							数量：'
			+'						</div>'
			+'						<div class="um-list-item-right">'
			+'							<input id="main_num'+no+'" class="form-control" >'
			+'						</div>'
			+'					</div>'
			+'					<div class="um-list-item-inner">'
			+'						<div class="um-list-item-left pl15" style="width:40%;">'
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

/*$(function(){
	$(".select_consumable").unbind().on('click',function() {
		var select_type=$(this).attr("id");
		$("#"+select_type).change(function(){
			consumable.changeSelect(consumable.select,select_type);
		});
	});
});*/

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


function queryInitcallBack(args) {//详情初始化回调
	if (args.status == "0") {
		consumable.loadListInfo(args.data);
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
		$("#main_create_date").attr("pk_consumable_h",args.data.pk_consumable);
		$(".disable").attr("disabled", true);//不可编辑
		consumable.initInfo();
		//lastPageRefresh("refresh","consumable","list");
	} else {
		alert("保存失败" + args.message);
	}
}

function updatecallBack(args){//修改回调
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		consumable.type="0"; //设置为新增状态
		$(".disable").attr("disabled", true);//不可编辑
		consumable.initInfo(data);
	} else {
		alert("修改失败" + args.message);
	}
}

function addInitcallBack(args) {//初始化回调
	if (args.status == "0") {
		consumable.initLoadInfo(args.data);
	} else {
		alert("初始化失败" + args.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(arg));
}