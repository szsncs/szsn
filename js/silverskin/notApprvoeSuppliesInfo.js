summerready = function() {
	notApprInfo.init();
	notApprInfo.bindEvent();
}
var notApprInfo = {
	pk_total_info_h:"",
	initdata:{},
	type:"3",
	viewid : "com.sunnercn.silverskin.SilverskinApplyController",
	/**
	 * 初始化
	 */
	init : function() {
		//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
		notApprInfo.initpage();
		//2.判断 是否为新增（type==3）查看 type==1
		var type=summer.pageParam.type; 
		notApprInfo.type = type; 
		if(type =="1"){ //查看
			
			var pk_total_info_h = summer.pageParam.pk_apply; 
			if (pk_total_info_h && pk_total_info_h.length>0){
				notApprInfo.pk_total_info_h =pk_total_info_h;
				notApprInfo.initLoadData(pk_total_info_h);
			}else{
				alert("数据出错，请重新登录！");
			}
		}else if(type == "3"){
			//新增
			notApprInfo.pk_total_info_h ="";
		}
		//设置页面状态
		notApprInfo.setPageStatus(type);
	},
	/**
	 * 初始化接口请求
	 */
	initLoadData:function(pk_total_info_h){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var totalinfo ={
			pk_total_info_h:pk_total_info_h
		};
		var json = {
			logininfo:lonininfo,
			totalinfo:totalinfo
		}
		summer.showProgress({
            "title" : "加载中..."
        });
        callAction(notApprInfo.viewid,"initSilverskinInfo",json,"callBack");
	},
	/**
	 * 事件绑定
	 */
	bindEvent : function() {
		//返回按钮
		$(".sk_back").click(function(){
			lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
			summer.closeWin();
		});
		//提交按钮
		$(".sk_submit").click(function(){
			notApprInfo.submit();
		});
		//收回按钮
		$("#btn-callback").click(function(){
			var bool = $confirm("您确定收回吗？");
			if(bool){
				notApprInfo.unSubmit();
			}
		});
		//删除按钮
		$("#btn-del").click(function(){
			lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
			notApprInfo.delete();
		});
		//编辑 按钮
		$("#btn-edit").click(function(){
			notApprInfo.edit();
		});
		// 取消按钮
		$("#btn-cancle").click(function(){
			notApprInfo.cancle();
		});
		// 保存按钮
		$("#btn-save").click(function(){
			notApprInfo.save();
		});		
		//敲击按键时触发
		$(".applyNum").bind("keypress", function(event) {
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
		//失去焦点是触发
		$(".applyNum").bind("blur", function(event) {
			var value = $(this).val(),
			    reg = /\.$/;
			if (reg.test(value)) {
				value = value.replace(reg, "");
				$(this).val(value);
			}
		})		
	},
	save:function(){
		var pk = notApprInfo.pk_total_info_h;
		if(pk && pk.length>0){
			//修改保存
			notApprInfo.update();
		}else{
			// 新增保存
			notApprInfo.apply();
		}
	},

	/**
	 *编辑取消 
	 */
	cancle:function(){
		var bool = $confirm("您确定取消编辑吗？");
		if(bool){
			if(notApprInfo.type == "3"){
				summer.closeWin();
			}else{
				var data = notApprInfo.initdata;
				//取消编辑 要刷新
				notApprInfo.initlist(data);
				notApprInfo.setPageStatus("2");
			}	
		}
	},
	/**
	 *编辑点击 
	 */
	edit:function(){
		notApprInfo.setPageStatus("3");
	},
	/**
	 *  删除 
	 */
	delete:function(){
		var pk_total_info_h = notApprInfo.pk_total_info_h ;
		if (pk_total_info_h && pk_total_info_h.length>0){
			var totalinfo ={
				pk_total_info_h:pk_total_info_h
			};
			var json = {
				
				totalinfo:totalinfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
	        callAction(notApprInfo.viewid,"deleteSilverskinTotal",json,"deletecallBack");
		}else{
			alert("数据出错，请重新登录！");
		}
	},
	/**
	 *提交 
	 */
	submit:function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var pk_total_info_h = notApprInfo.pk_total_info_h ;
		if (pk_total_info_h && pk_total_info_h.length>0){
			var totalinfo ={
				pk_total_info_h:pk_total_info_h
			};
			var json = {
				logininfo:lonininfo,
				totalinfo:totalinfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
	        callAction(notApprInfo.viewid,"submitSilverskinTotal",json,"submitcallBack");
		}else{
			alert("数据出错，请重新登录！");
		}
	},
	/**
	 *收回
	 */
	unSubmit:function(){
		var totalinfo ={
			pk_total_info_h:notApprInfo.pk_total_info_h
		};
		var json = {			
			totalinfo:totalinfo
		}
		summer.showProgress({
            "title" : "加载中..."
        });
        callAction(notApprInfo.viewid,"unSubmitSilverskinTotal",json,"unSubmitcallBack");
	},
	/**
	 *初始化界面
	 */
	initpage:function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		//表头批次号
		$("#sk_batch").text(logininfo.henneryinfo.batch);
		//鸡场名称
		$("#sk_hennery").text(logininfo.henneryinfo.hennery_name);
		$("#total_hennery").text(logininfo.henneryinfo.hennery_name);
		//申请时间
		var myDate = new Date();
		var date = myDate.toLocaleDateString();  
		$("#sk_date").text(date);
		//将列表至空
		$(".sk-list-item").html("");
		var html="";
		for (var i = 0; i < logininfo.henhouseinfo.length; i++) {
		 	var billinfo =logininfo.henhouseinfo; 
			html+='<div href="#"  class="um-list-item"> '
				+'	<div class="um-list-item-inner">'
				+'		<div class="um-list-item-body">'
				+'			<div class="um-row f14">'
				+'				<div class="um-xs-6">'
				+'					鸡舍：<span>'+billinfo[i].henhouse_name+'</span>'
				+'				</div>'
				+'				<div class="um-xs-6">'
				//+'					数量：<input type="number"class="apply_num" id="'+billinfo[i].pk_henhouse+'" henhouse_name="'+billinfo[i].henhouse_name+'" value="0" style="width: 30%"/>吨'
				+ '			数量：<input type="number" class="disable applyNum apply_num" id="'+billinfo[i].pk_henhouse+'" henhouse_name="'+billinfo[i].henhouse_name+'"  value="0" style="width: 42%;height:25px;" onblur="if(value ==\'\'){value=\'0\'}" '
				+ '			onfocus="if(value ==\'0\'){value =\'\'}"'
			    + '			onkeyup="value=value.replace(\/[^\\d\\.]/g,\'\')" onblur="value=value.replace(\/[^\\d\\.]/g,\'\')"/>吨'
				+'				</div>'
				+'			</div>'
				+'		</div>'
				+'	</div>'
				+'	</div>';
		
		};
		$(".sk-list-item").html(html);
		
	},
	/**
	 * 新增保存
	 */
	apply:function(){
		var array= [];
		$(".apply_num").each(function(){
			var val= $(this).val()?$(this).val():"0";
			var obj = {
				pk_henhouse:$(this).attr("id"),
				henhouse_name:$(this).attr.henhouse_name,
				apply_num:$(this).val()
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
	        callAction(notApprInfo.viewid,"applySilverskinTotal",json,"applycallBack");
		}else{
			alert("请先输入申请数量！");
		}
		
	},
	/**
	 * 修改保存
	 */
	update:function(){
		var array= [];
		$(".apply_num").each(function(){
			var data = notApprInfo.initdata;
			for(var i=0;i< data.billinfo.length;i++){
				var item = data.billinfo[i];
				if(item.pk_henhouse == $(this).attr("id")){
					if($(this).val() != item.apply_num){
						var pk_material_apply = $(this).attr("pk_material") ? $(this).attr("pk_material") : 0;
						var obj = {
							pk_henhouse:$(this).attr("id"),
							henhouse_name:$(this).attr("henhouse_name"),
							pk_material_apply:pk_material_apply,
							apply_num:$(this).val()
						};
						array.push(obj);
					}
				}
			}
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_total_info_h = notApprInfo.pk_total_info_h;
			var json={
				billinfo:array,
				pk_total_info_h:pk_total_info_h,
				logininfo:lonininfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
	        callAction(notApprInfo.viewid,"updateSilverskinTotal",json,"updatecallBack");
		}else{
			alert("请先修改申请数量！");
		}
	},
	/**
	 *设置界面状态 1未收回 2已收回 3 编辑或新增 
	 */
	setPageStatus:function(type){
		for(var i=1;i<4;i++){
			 $(".status"+i).hide();
		} 
		$(".status"+type).show();
		if(type ==3){
			//可编辑
			$(".apply_num").attr("disabled",false);
		}else{
			//不可编辑
			$(".apply_num").attr("disabled",true);
		}
		
	},
	/**
	 *未收回数据填充 
	 */
	initlist : function(data) {
		var sub_status= data.sub_status;
		if(sub_status == "Y"){
			//Y 已提交 对应状态1
			notApprInfo.setPageStatus("1");
		}else {
			notApprInfo.setPageStatus("2");
		}
		$("#sk_date").text(data.totaldate);
		$("#totalNum").text(data.totalinfo[0].total_num);
		var billinfo = data.billinfo;
		if(billinfo && billinfo.length>0)
		{
			for(var i=0;i<data.billinfo.length;i++){
				var id =data.billinfo[i].pk_henhouse;
				$("#"+id).val(data.billinfo[i].apply_num);
				$("#"+id).attr("pk_material",data.billinfo[i].pk_material_apply);
			}
		}
	}
};

/**
 * 初始化接口成功回调
 */
function callBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		notApprInfo.initlist(arg.data);
		notApprInfo.initdata =arg.data;
	}else{
		lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
		alert("初始化失败"+arg.message);
	}	
}
/**
 * 收回接口成功回调
 */
function unSubmitcallBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		notApprInfo.setPageStatus("2");
	}else if(arg.status == "2"){
		lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
		alert(arg.message);
	}else{
		lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
		alert("收回失败"+arg.message);
	}	
}
/**
 * 提交接口成功回调
 */
function submitcallBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		notApprInfo.setPageStatus("1");
	}else{
		lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
		alert("提交失败"+arg.message);
	}	
}
/**
 * 删除接口成功回调
 */
function deletecallBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		alert("删除成功");		
		var jsfun = 'update();';
		var id = "/silverskin/notApprvoeSupplies.html"
		summer.execScript({
		    winId: id,
		    script: jsfun
		});
		summer.closeWin();
	}else{
		lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
		alert("删除失败"+arg.message);
	}	
}
/**
 * 新增接口成功回调
 */
function applycallBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		alert("保存成功");
		notApprInfo.pk_total_info_h =arg.data.pk_total_info_h;
		notApprInfo.initLoadData(arg.data.pk_total_info_h);
	}else{
		lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
		alert("保存失败"+arg.message);
	}	
}
/**
 * 更新接口成功回调
 */
function updatecallBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		alert("保存成功");
		notApprInfo.pk_total_info_h =arg.data.pk_total_info_h;
		notApprInfo.initLoadData(arg.data.pk_total_info_h);
	}else{
		lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
		alert("保存失败"+arg.message);
	}	
}

/**
 * 接口失败回调
 */
function erresg(arg){
	summer.hideProgress();
	lastPageRefresh("refresh","silverskin","notApprvoeSupplies");
	alert("系统运行异常"+arg.message);
}
