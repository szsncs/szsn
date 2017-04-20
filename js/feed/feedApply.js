

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
			"viewid" : "com.sunnercn.feed.FeedApplyController", //后台带包名的Controller名
			"action" : "initFeedInfo", //方法名,
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
		$(".sk_back").click(function(){
			var jsfun = 'update();';
			var id = "/feed/feedSummary.html"
			summer.execScript({
			    winId: id,
			    script: jsfun
			});
			summer.closeWin();
		});
		
		//提交按钮
		$(".sk_submit").click(function(){
			feedApply.submit();
		});
		//收回按钮
		$("#btn-callback").click(function(){
			var bool = $confirm("您确定收回吗？");
			if(bool){
				feedApply.unSubmit();
			}
		});
		//删除按钮
		$("#btn-del").click(function(){
			feedApply.delete();
		});
		//编辑 按钮
		$("#btn-edit").click(function(){
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
				"viewid" : "com.sunnercn.feed.FeedApplyController", //后台带包名的Controller名
				"action" : "deleteFeedTotal", //方法名,
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
		var pk_total_info_h = feedApply.pk_total_info_h ;
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
			$service.callAction({
				"viewid" : "com.sunnercn.feed.FeedApplyController", //后台带包名的Controller名
				"action" : "submitFeedTotal", //方法名,
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
			"viewid" : "com.sunnercn.feed.FeedApplyController", //后台带包名的Controller名
			"action" : "unSubmitFeedTotal", //方法名,
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
		for (var i = 0; i < logininfo.siloinfo.length; i++) {
		 	var siloinfo =logininfo.siloinfo; 
			html +='<div class="listitembody" turn="'+i+'">'
				 + '	<div class="listitembody_left">'
				 + '			<div class="item-name item-name'+i+'" id="'+siloinfo[i].pk_silo+'" turn="'+i+'">'+siloinfo[i].silo_name+'</div>'
				 + '		</div>'
				 + '	<div class="listitembody_right1">'
				 + '		<div id="sumRewardMoneyBlock" class="right-title">'
				 + '			<div "left-silo"><span class="fd_silo">料&nbsp;&nbsp;&nbsp;&nbsp;号&nbsp;:&nbsp;</span><select class="disable fd-select fd_name" id="fd-select'+i+'" ></select></div>'
				 + '		</div>'
				 + '	</div>'
				 + '	<div class="listitembody_right1">'
				 + '		<div id="sumRewardMoneyBlock" class="right-title">'
				 + '			<div class="left-silo">申请量：<input class="disable applyNum" id="fd-num'+i+'" type="number"  value="0" style="width: 42%;height:25px;" onblur="if(value==\'\'){value=\'0\'}" '
				 + '			onfocus="if(this.value==\'0\'){this.value =\'\'}"'
				 + '			onkeyup="value=value.replace(\/[^\\d\\.]/g,\'\')" onblur="value=value.replace(\/[^\\d\\.]/g,\'\')"/>吨</div>'
				 + '		</div>'
				 + '	</div>'
				 + '</div>';
		};
		$("#soliList").html(html);
		feedApply.initFeedtypeSelect();
	},
	initFeedtypeSelect:function(){
		var logininfo = $cache.read("logininfo");
		var json = JSON.parse(logininfo);
		var feedtypeList = json.feedinfo;
		$(".fd-select").html("");
		var optionhtml= '<option>-请选择料号-</option>';
		for(var i=0;i<feedtypeList.length;i++){
			optionhtml+='<option pk_feed_type="'+feedtypeList[i].pk_feed_type+'" value="'+feedtypeList[i].feed_type_name+'">'+feedtypeList[i].feed_type_name+'</option>'
		}
		$(".fd-select").append(optionhtml);
		$("#fd-select0").bind("change",function(){ 
			if($("#fd-select0").val()!="-请选择料号-"){
		      $(".fd-select").val($("#fd-select0").val());
			}			
		  });
	},
	/**
	 * 新增保存
	 */
	apply:function(){
		var array= [];
		var error = false;
		$(".listitembody").each(function(){
			var turn= $(this).attr("turn");
			var pk_material= $("#fd-select"+turn).find("option:selected").attr("pk_feed_type");
			if(!pk_material ||pk_material.length==0){
				error = true;
			}
			var apply_num =$("#fd-num"+turn).val();
			var obj= {
				pk_material:pk_material,
				material_name:$("#fd-select"+turn).find("option:selected").text(),
				pk_silo:$(".item-name"+turn).attr("id"),
				silo_name: $(".item-name"+turn).text(),
				apply_num:apply_num,
				memo:$("#fd-reason"+turn).val()
			}
			array.push(obj);
			
		});
		if(error){
			alert("请选择料号");
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
				"viewid" : "com.sunnercn.feed.FeedApplyController", //后台带包名的Controller名
				"action" : "applyFeedTotal", //方法名,
				"params" : json, //自定义参数
				"callback" : "applycallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		}else{
			alert("数据出错，请刷新后重试");
		}
		
	},
	/**
	 * 修改保存
	 */
	update:function(){
		var array= [];
		var error = false;
		$(".listitembody").each(function(){
			var data = feedApply.initdata;
			var turn= $(this).attr("turn");
			for(var i=0;i< data.billinfo.length;i++){
				var item = data.billinfo[i];				
				if(item.pk_silo ==$(".item-name"+turn).attr("id")){
					var bool = item.material_name !=$("#fd-select"+turn).find("option:selected").text();
					if($("#fd-num"+turn).val()!= item.apply_num || bool){						
						var pk_material_apply = $("#fd-num"+turn).attr("pk_material");
						var pk_material= $("#fd-select"+turn).find("option:selected").attr("pk_feed_type");
						if(!pk_material ||pk_material.length==0){
							error = true;
						}
						
						var obj = {
							pk_material_apply:pk_material_apply,
							pk_material:$("#fd-select"+turn).find("option:selected").attr("pk_feed_type"),
							material_name:$("#fd-select"+turn).find("option:selected").text(),
							pk_silo:$(".item-name"+turn).attr("id"),
							silo_name: $(".item-name"+turn).text(),
							apply_num:$("#fd-num"+turn).val(),
							memo:$("#fd-reason"+turn).val()							
						};
						array.push(obj);
					}
				}
			}
		});
		if(error){
			alert("请选择料号");
			return;
		}
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
				"viewid" : "com.sunnercn.feed.FeedApplyController", //后台带包名的Controller名
				"action" : "updateFeedSilverskinTotal", //方法名,
				"params" : json, //自定义参数
				"callback" : "updatecallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
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
		$("#sk_date").text(data.totaldate);
		$("#totalNum").text(data.totalinfo[0].total_num);
		var billinfo = data.billinfo;
		if(billinfo && billinfo.length>0){
			for(var i=0;i<data.billinfo.length;i++){
				var id =data.billinfo[i].pk_silo;
				var turn =$("#"+id).attr("turn");
				$("#fd-num"+turn).attr("pk_material",data.billinfo[i].pk_material_apply);
				 //类型
				$("#fd-select"+turn).val(data.billinfo[i].material_name);
				$("#fd-num"+turn).val(data.billinfo[i].apply_num);
				$("#fd-reason"+turn).val(data.billinfo[i].memo);
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
		//alert(arg.message);
		alert("初始化失败");
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
	}else if(arg.status == "2"){
		alert(arg.message);
	}else{
		alert(arg.message);
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
		alert("提交成功");
	}else{
		alert("提交失败");
		//alert(arg.message);
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
		var id = "/feed/feedSummary.html"
		summer.execScript({
		    winId: id,
		    script: jsfun
		});
		summer.closeWin();
	}else{
		alert("删除失败");
		//alert(arg.message);
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
	}else{
		alert("保存失败");
		//alert(arg.message);
	}	
}
/**
 * 更新接口成功回调
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
		//alert(arg.message);
	}	
}

/**
 * 接口失败回调
 */
function erresg(arg){
	summer.hideProgress();
	alert("失败");
	alert(JSON.stringify(arg));
}
$(document).ready(function(){
	
});

summerready = function() {
	feedApply.init();
	feedApply.bindEvent();
}