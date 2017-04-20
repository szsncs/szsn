summerready = function() {
	weekWeight.init();
	weekWeight.bindEvent();
}
var weekWeight = {
	status:true,
	savestatus:"1",
	initdata:{},
	/**
	 *初始化 
	 */
	init : function() {
		//初始化界面
		weekWeight.initpage();

		//加载历史表头鸡类信息
		weekWeight.initLoadData();
		
	},
	bindEvent:function(){
		//返回按钮
		$("#top_back").click(function(){
			summer.closeWin();
		});
		//刷新按钮
		$("#top_refresh").click(function(){
			weekWeight.init();
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
				weekWeight.initLoadData();
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
			if($(this).val()==""){$(this).val("0")}
		});
		//获取焦点是触发
		$(".focusevet").bind("focus", function() {
			if($(this).val()=="0"){$(this).val("")}
		});
		
		//焦点事件
		$(".daily_num").on('keyup', function(event) {
			var $amountInput = $(this);
			//响应鼠标事件，允许左右方向键移动
			event = window.event || event;
			if (event.keyCode == 37 | event.keyCode == 39) {
				return;
			}
			//先把非数字的都替换掉，除了数字和.
			$amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
			//只允许一个小数点
			replace(/^\./g, "").replace(/\.{2,}/g, ".").
			//只能输入小数点后两位
			replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
		});
		$(".daily_num").on('blur', function() {
			var $amountInput = $(this);
			//最后一位是小数点的话，移除
			$amountInput.val(($amountInput.val().replace(/\.$/g, "")));
		});
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
		$service.callAction({
				"viewid" : "com.sunnercn.dailydata.WeeklyWeighController", //后台带包名的Controller名
				"action" : "weeklyWeightInit", //方法名,
				"params" : json, //自定义参数
				"callback" : "callBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
		});
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
		var first=0;
		$(".daily_num").each(function(){
			var val= $(this).val();
			first++;
			if(val && val>0){
				var alive_num=$(this).attr("alive_num");
				var num=$("#"+alive_num).text();
				var obj = {
					pk_henhouse:$(this).attr("id"),//鸡舍pk
					henhouse_name:$(this).attr("henhouse_name"),//鸡舍名称
					alive_num:num,//存栏数
					ave_weight:val	//每羽重量
				};
			array.push(obj);
			}
		});
		if(array.length > 0){
			if(array.length<first){
				var bool = $confirm("是否确定保存!");
				if(bool){
					weekWeight.submitInfo(array);
				}
			}else{
				var bool = $confirm("是否确定保存！");
				if(bool){
					weekWeight.submitInfo(array);
				}
			}
		}else{
			alert("请先输入进雏数量！");
		}
	},
	submitInfo : function(array){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var pk_chicktype = $("#tital_type").attr("pk-chicktype");
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
		$service.callAction({
			"viewid" : "com.sunnercn.dailydata.WeeklyWeighController", //后台带包名的Controller名
			"action" : "addWeeklyWeight", //方法名,
			"params" : json, //自定义参数
			"callback" : "addCallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	update : function(){
		var update=[];
		var insert=[];
		var jsonUpdate={};
		var jsonInsert={};
		var first=0;
		$(".daily_num").each(function(){
			first++;
			var billinfo=weekWeight.initdata.billinfo;
			var val= $(this).val();
			var dmo_type=$(this).attr("dmo_type");
			var id=$(this).attr("id");
			for(var i=0;i<billinfo.length;i++){
				if(id && id==billinfo[i].pk_henhouse){
					if(val==billinfo[i].ave_weight ){
						break;
					}else{
						if(val && val>0 && "update"===dmo_type){
							var alive_num=$(this).attr("alive_num");
							var num=$("#"+alive_num).text();
							var obj = {
								pk_henhouse:$(this).attr("id"),//鸡场pk
								henhouse_name:$(this).attr("henhouse_name"),//鸡场名称
								alive_num:num,//存栏数
								ave_weight:val,//每羽重量
								pk_weekly_weigh:$(this).attr("pk_weekly_weigh")//周称重pk
							};
						update.push(obj);
						break;
					}
				}
				}else{
					if(val && val>0 && "insert"===dmo_type){
						$(this).attr("dmo_type","update");
						var alive_num=$(this).attr("alive_num");
						var num=$("#"+alive_num).text();
						var obj = {
							pk_henhouse:$(this).attr("id"),//鸡场pk
							henhouse_name:$(this).attr("henhouse_name"),//鸡场名称
							alive_num:num,//存栏数
							ave_weight:val,//每羽重量
						};
					insert.push(obj);
					break;
					};
				}
			}
			jsonUpdate = {
				update:update
			}
			jsonInsert = {
				insert:insert
			}
		});
		if((update.length > 0 || update.length <= 0) && (insert.length > 0 || insert.length <= 0)){
			var array=update.length+insert.length;
			if(array.length<first){
				var bool = $confirm("存在未填写的进雏数，确定要保存吗？");
				if(bool){
					weekWeight.updateInfo(jsonUpdate,jsonInsert);
				}
			}else{
				var bool = $confirm("是否确定修改！");
				if(bool){
					weekWeight.updateInfo(jsonUpdate,jsonInsert);
				}
			}
		}else{
			var bool = $confirm("是否确定修改！");
		}
	},
	updateInfo : function(array){
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
		$service.callAction({
			"viewid" : "com.sunnercn.dailydata.WeeklyWeighController", //后台带包名的Controller名
			"action" : "updateWeeklyWeight", //方法名,
			"params" : json, //自定义参数
			"callback" : "updateCallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
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
			$service.callAction({
				"viewid" : "com.sunnercn.dailydata.WeeklyWeighController", //后台带包名的Controller名
				"action" : "deleteWeeklyWeight", //方法名,
				"params" : json, //自定义参数
				"callback" : "deleteCallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});	
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
		if(summer.pageParam.list_status==null){
			$(".um_list").show();
		}
		if(summer.pageParam.type=="3"){
			$(".um_list").hide();
			//可编辑
			$(".busi_date").attr("disabled",false);
		}
		if(summer.pageParam.list_status=="1"){
			$("#home").show();
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
				+'		<span id="house_name'+i+'">'+billinfo[i].henhouse_name+'</span>'
				+'		</div>'
				+'		<div class="l-t-info" style="float: left">'
				+'		<span style="width: 50%"  '
				+'		 class="alive_num alive_edit_status" id="alive_num'+i+'" '
				+' 		 />'
				+'		羽'
				+'		</div>'
				+'		<div class="l-t-info" style="float: left">'
				+'		<input type="number" value="0" henhouse_name="'+billinfo[i].henhouse_name+'" style="width: 55%;height:25px;"'
				+'		 id="'+billinfo[i].pk_henhouse+'" alive_num="alive_num'+i+'"  dmo_type="insert" class="primary_key daily_num focusevet disable"/>'
				+'			克'
				+'			</div>'
				+'			</div>'
				+'			</div>'
				+'		</div>'
		
		};
		$(".info_list_item").html(html);
		//存栏数标签不可编辑
		$(".alive_edit_status").attr("disabled", true);
		weekWeight.initFeedtypeSelect();
	},
	initFeedtypeSelect : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		//饲料类型
		$(".select-feed-type").html("");
		var html='<option  selected="selected" >请选择</option>';
		for(var i=0;i<logininfo.feedinfo.length;i++){
			var feedinfo=logininfo.feedinfo;
			html+='<option value="'+feedinfo[i].feed_type_name+'" id="'+feedinfo[i].pk_feed_type+'">'+feedinfo[i].feed_type_name+'</option>'
		}
		$(".select-feed-type").html(html);

	},
	initlist : function(data){
		var billinfo = data.billinfo;
		weekWeight.initdata=billinfo;//将数据存在本地
		if(billinfo && billinfo.length>0){
			weekWeight.status=false;
			weekWeight.setStatus();
			for(var i=0;i<data.billinfo.length;i++){
				var alive_num=$("#"+billinfo[i].pk_henhouse).attr("alive_num");
				$("#"+alive_num).text(billinfo[i].alive_num);//存栏数
			}
			for(var i=0;i<data.billinfo.length;i++){
				//不可编辑
				$(".disable").attr("disabled",true);
				var pk_weekly_weigh=$("#"+billinfo[i].pk_henhouse).attr("pk_weekly_weigh",billinfo[i].pk_weekly_weigh);//获取鸡场pk
				$("#"+billinfo[i].pk_henhouse).val(billinfo[i].ave_weight);//添加重量
				if(billinfo[i].ave_weight>0){
					$("#"+billinfo[i].pk_henhouse).attr("dmo_type","update");
				}
			}
		}
	}
	
}	
function callBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	//alert(JSON.stringify(args));
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
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		weekWeight.showstatus="2";
		weekWeight.initLoadData();
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
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		weekWeight.initLoadData();
		weekWeight.status=true;
		weekWeight.setStatus();
		alert("修改成功");
	}else{
		alert("修改失败"+args.message);
	}	
}

function deleteCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		weekWeight.init();
		weekWeight.status=true;
		weekWeight.setStatus();
		weekWeight.savestatus="1";
		alert("删除成功");
	}else{
		alert("删除失败"+args.message);
	}	
}	