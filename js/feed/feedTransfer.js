summerready = function() {
	feedApply.init();
	feedApply.bindEvent();
}

var feedApply = {
	pk_total_info_h:"",
	initdata:{},
	type:"3",
	/**
	 * 初始化
	 */
	init : function() {
		//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
		feedApply.initpage();
		//2.判断 是否为新增（type==3）查看 type==1
		var type=summer.pageParam.type; 
		feedApply.type = type; 
		if(type =="1"){ //查看
			
			var pk_total_info_h = summer.pageParam.pk_apply; 
			if (pk_total_info_h && pk_total_info_h.length>0){
				feedApply.pk_total_info_h =pk_total_info_h;
				feedApply.initLoadData(pk_total_info_h);
			}else{
				alert("数据出错，请重新登录！");
			}
		}else if(type == "3"){
			//新增
			feedApply.pk_total_info_h ="";
		}
		//设置页面状态
		feedApply.setPageStatus(type);
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
		$service.callAction({
			"viewid" : "com.sunnercn.feed.SurplusFeedTransferController", //后台带包名的Controller名
			"action" : "initSurplusFeedInfo", //方法名,
			"params" : json, //自定义参数
			"callback" : "callBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	/**
	 * 事件绑定
	 */
	bindEvent : function() {
		//返回按钮
		$(".top_back").click(function(){
			var jsfun = 'update();';
			var id = "/feed/transferSummary.html"
			summer.execScript({
			    winId: id,
			    script: jsfun
			});
			summer.closeWin();
		});
		
		//提交按钮
		$(".top_submit").click(function(){
			feedApply.submit();
		});
		//收回按钮
		$("#btn-callback").click(function(){
			feedApply.unSubmit();
		});
		//删除按钮
		$("#btn-del").click(function(){
			feedApply.delete();
		});
		//编辑 按钮
		$("#btn-edit").click(function(){
			//允许编辑
			$(".transfer_num").attr("disabled",false);
			feedApply.edit();
		});
		// 取消按钮
		$("#btn-cancle").click(function(){
			feedApply.cancle();
		});
		// 保存按钮
		$("#btn-save").click(function(){
			feedApply.save();
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
		})	;
	},
	save:function(){
		var pk = feedApply.pk_total_info_h;
		if(pk && pk.length>0){
			//修改保存
			feedApply.update();
		}else{
			// 新增保存
			feedApply.apply();
		}
	},
	/**
	 *编辑取消 
	 */
	cancle:function(){
		var bool = $confirm("您确定取消编辑吗？");
		if(bool){
			if(feedApply.type == "3"){
				summer.closeWin();
			}else{
				var data = feedApply.initdata;
				//取消编辑 要刷新
				feedApply.initlist(data);
				feedApply.setPageStatus("2");
			}	
		}
	},
	/**
	 *编辑点击 
	 */
	edit:function(){
		feedApply.setPageStatus("3");
	},
	/**
	 *  删除 
	 */
	delete:function(){
		var pk_total_info_h = feedApply.pk_total_info_h ;
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
			$service.callAction({
				"viewid" : "com.sunnercn.feed.SurplusFeedTransferController", //后台带包名的Controller名
				"action" : "deleteSurplusFeedTotal", //方法名,
				"params" : json, //自定义参数
				"callback" : "deletecallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
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
		var array= [];
		
		$(".transfer_num").each(function(){
			var surplus= $(this).val();//剩余数量
			if(!surplus || surplus==0){
				return true;
			}
			var pk_material=$(".select-feed-type option:selected").attr("id")
			var item_name =$(this).attr("item_name");
			var pk_silo=$("."+item_name).attr("id");
			var obj= {
				surplus_num:surplus,
				pk_material:$(".select-feed-type option:selected").attr("id"),//饲料类型pk
				material_name:$(".select-feed-type").val(),
				pk_silo:pk_silo,
				silo_name: $("#"+pk_silo).text()
			}
			array.push(obj);
			
		});
		
		var pk_total_info_h = feedApply.pk_total_info_h ;
		var pk_material=$(".select-feed-type option:selected").attr("id")//饲料pk
		if (pk_total_info_h && pk_total_info_h.length>0){
			var totalinfo ={
				pk_total_info_h:pk_total_info_h
			};
			var json = {
				billinfo:array,
				logininfo:lonininfo,
				totalinfo:totalinfo,
				pk_material:pk_material
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.feed.SurplusFeedTransferController", //后台带包名的Controller名
				"action" : "submitSurplusFeedTotal", //方法名,
				"params" : json, //自定义参数
				"callback" : "submitcallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		}else{
			alert("数据出错，请重新登录！");
		}
	},
	/**
	 *收回
	 */
	unSubmit:function(){
		var totalinfo ={
			pk_total_info_h:feedApply.pk_total_info_h
		};
		var json = {			
			totalinfo:totalinfo
		}
		summer.showProgress({
            "title" : "加载中..."
        });
		$service.callAction({
			"viewid" : "com.sunnercn.feed.SurplusFeedTransferController", //后台带包名的Controller名
			"action" : "unSubmitSurplusFeedTotal", //方法名,
			"params" : json, //自定义参数
			"callback" : "unSubmitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	/**
	 *初始化界面
	 */
	initpage:function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		$("#tital_date").text(getNowFormatDate());
		//表头批次号
		$("#tital_batch").text(logininfo.henneryinfo.batch);
		//鸡场名称
		$("#tital_hennery").text(logininfo.henneryinfo.hennery_name);
		$("#tital_hennery").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);
		//日龄
		$("#tital_age").text(logininfo.henneryinfo.days);
		//将列表至空
		$(".info_list_item").html("");
		var html="";
		for (var i = 0; i < logininfo.siloinfo.length; i++) {
		 	var siloinfo =logininfo.siloinfo; 
		 	 
		 	html +=' <div   class="um-list-item" >'
				 +'			<div class="um-list-item-inner">'
				 +'				<div class="um-list-item-body f16 ">'
				 +'					<div class="l-t-info" style="float: left;" >'
				 +'						<span class="item-name'+i+'" transfer="transfer_num'+i+'" surplus="surplus'+i+'" id='+siloinfo[i].pk_silo+' turn="'+i+'">'+siloinfo[i].silo_name+'</span>'
				 +'					</div>'
				 +'					<div class="l-t-info" style="float: left">'
				 +'						&nbsp;'
				 +'					</div>'
				 +'					<div class="l-t-info" style="float: left">'
				 +'						<input type="number" class="transfer_num applyNum" turn="'+i+'" pk_silo="'+siloinfo[i].pk_silo+'" value="0" transfer_num="transfer_num'+i+'" id="surplus'+i+'" item_name="item-name'+i+'" style="width: 52%;height:25px;" onfocus="if(this.value==\'0\'){this.value=\'\'}" onblur="if(this.value==\'\'){this.value=\'0\'}"/>'
				 +'						吨'
				 +'					</div>'
				 +'				</div>'
				 +'			</div>'
				 +'		</div>'
		};
		$(".info_list_item").html(html);
		feedApply.initFeedtypeSelect();
	},
	initFeedtypeSelect:function(){
		var logininfo = $cache.read("logininfo");
		var json = JSON.parse(logininfo);
		var feedtypeList = json.feedinfo;
		//饲料类型
		$(".select-feed-type").html("");
		var html='<option selected="selected" >-请选择料号-</option>';
		for(var i=0;i<feedtypeList.length;i++){
			var feedinfo=logininfo.feedinfo;
			html+='<option value="'+feedtypeList[i].feed_type_name+'" id="'+feedtypeList[i].pk_feed_type+'">'+feedtypeList[i].feed_type_name+'</option>'
		}
		$(".select-feed-type").html(html);
	},
	/**
	 * 修改保存
	 */
	update:function(){
		var array= [];
		$(".transfer_num").each(function(){
			var surplus_num= $(this).val()?$(this).val():"0";//剩余数量
			var item_name=$(this).attr("item_name");//获取料塔class
			var pk_silo=$("."+item_name).attr("id");//料塔pk
			var silo_name=$("."+item_name).text();//料塔名称
			var pk_material_apply=$(this).attr("pk_material");//物资明细pk
			var material_name=$(".select-feed-type").val();//饲料名称
			var pk_material=$(".select-feed-type option:selected").attr("id")//饲料pk
			var obj = {
				pk_material_apply:pk_material_apply,
				pk_material:pk_material,
				surplus_num:surplus_num,
				pk_silo:pk_silo,
				silo_name:silo_name,
				material_name:material_name,
			};
			array.push(obj);
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_total_info_h = feedApply.pk_total_info_h;
			var json={
				billinfo:array,
				pk_total_info_h:pk_total_info_h,
				logininfo:lonininfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.feed.SurplusFeedTransferController", //后台带包名的Controller名
				"action" : "updateSurplusFeedTotal", //方法名,
				"params" : json, //自定义参数
				"callback" : "updatecallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		}else{
			alert("请先修改申请数量！");
		}
	},
	/**
	 * 新增保存
	 */
	apply:function(){
		var array= [];
		var error = false;
		$(".transfer_num").each(function(){
			var surplus= $(this).val();//剩余数量
			var pk_material=$(".select-feed-type option:selected").attr("id")
			if(!pk_material ||pk_material.length==0){
				error = true;
			}
			var item_name =$(this).attr("item_name");
			var pk_silo=$("."+item_name).attr("id");
			var obj= {
				surplus_num:surplus,
				pk_material:$(".select-feed-type option:selected").attr("id"),//饲料类型pk
				material_name:$(".select-feed-type").val(),
				pk_silo:pk_silo,
				silo_name: $("#"+pk_silo).text()
			}
			array.push(obj);
			
		});
		if(error){
			alert("请选择饲料类型");
			return;
		}
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
				"viewid" : "com.sunnercn.feed.SurplusFeedTransferController", //后台带包名的Controller名
				"action" : "applySurplusFeedTotal", //方法名,
				"params" : json, //自定义参数
				"callback" : "applycallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		}else{
			alert("数据出错，请刷新后重试");
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
			$(".disable").attr("disabled",false);
			$("#totalinfo").hide();
		}else{
			//不可编辑
			$(".disable").attr("disabled",true);
			$("#totalinfo").show();
		}
		
	},
	
	inittotalinfo:function(data){
		$("#totalinfo").html("");
		var html ='<li><div class="um-list-item"><div class="um-list-item-inner">'
				 +'	<div class="um-list-item-left um-border-right">料号</div><div class="um-list-item-right">'
				 +'		<p>数量</p></div></div></div></li>';
		for(var i=0;i<data.length;i++){
				html +='<li><div class="um-list-item"><div class="um-list-item-inner">'
					 + '	<div class="um-list-item-left um-border-right">'+data[i].material_name+'</div><div class="um-list-item-right">'
				 	 + '		<p>'+data[i].total_num+'吨</p></div></div></div></li>';
		}
		
		$("#totalinfo").append(html);
		
	},
	/**
	 *未收回数据填充 
	 */
	initlist : function(data) {
		var sub_status= data.sub_status;
		if(sub_status == "Y"){
			//Y 已提交 对应状态1
			feedApply.setPageStatus("1");
		}else {
			// 为提交 对应状态2
			feedApply.setPageStatus("2");
		}
		$("#tital_date").text(data.totaldate);
	//	$("#totalNum").text(data.totalinfo[0].total_num);
		var billinfo = data.billinfo;
		if(billinfo && billinfo.length>0){
		for(var i=0;i<billinfo.length;i++){
			//不可编辑
			$(".transfer_num").attr("disabled",true);
			var material_name=billinfo[i].material_name;
			$(".select-feed-type").val(billinfo[i].material_name);
			$("#surplus"+i).attr("pk_material",data.billinfo[i].pk_material_apply);
			var id =data.billinfo[i].pk_silo;
			var surplus_num=$("#"+id).attr("surplus");
			$("#"+surplus_num).val(data.billinfo[i].surplus_num);
			}
		}
		feedApply.inittotalinfo(data.totalinfo);
	}
};

/**
 * 初始化接口成功回调
 */
function callBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		feedApply.initlist(arg.data);
		feedApply.initdata =arg.data;
	}else{
		alert("初始化失败");
		alert(arg.message);
	}	
}
/**
 * 收回接口成功回调
 */
function unSubmitcallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		feedApply.setPageStatus("2");
	}else{
		alert(arg.message);
		alert("收回失败");
	}	
}
/**
 * 提交接口成功回调
 */
function submitcallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		feedApply.setPageStatus("1");
	}else{
		alert(arg.message);
		alert("提交失败");
	}	
}
/**
 * 删除接口成功回调
 */
function deletecallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		alert("删除成功");
	
		var jsfun = 'update();';
		var id = "/feed/transferSummary.html"
		summer.execScript({
		    winId: id,
		    script: jsfun
		});
		summer.closeWin();
	}else{
		alert("删除失败");
		alert(arg.message);
	}	
}
/**
 * 新增接口成功回调
 */
function applycallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		alert("保存成功");
		feedApply.pk_total_info_h =arg.data.pk_total_info_h;
		feedApply.initLoadData(arg.data.pk_total_info_h);
		//不可编辑
		$(".transfer_num").attr("disabled",true);
	}else{
		alert("保存失败");
		alert(arg.message);
	}	
}
/**
 * 修改接口成功回调
 */
function updatecallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		alert("保存成功");
		feedApply.pk_total_info_h =arg.data.pk_total_info_h;
		feedApply.initLoadData(arg.data.pk_total_info_h);
	}else{
		alert("保存失败");
		alert(arg.message);
	}	
}

/**
 * 接口失败回调
 */
function erresg(arg){
	summer.hideProgress();
	alert(JSON.stringify(arg));
	alert("系统运行异常");
}
$(document).ready(function(){
	
});