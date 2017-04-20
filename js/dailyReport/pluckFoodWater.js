summerready = function() {
	pluckFoodWater.init();
	pluckFoodWater.bindEvent();
}
var pluckFoodWater = {
	status:true,
	savestatus:"1",
	initdata:{},
	showstatus:"1",
	viewid : "com.sunnercn.dailydata.PluckFoodWaterController",
	/**
	 *初始化 
	 */
	init : function() {
		//初始化界面
		pluckFoodWater.initpage();
		if(summer.pageParam.type){
			if(summer.pageParam.type==="1"){
				//加载历史表头鸡类信息
				pluckFoodWater.initInfoLoad();
			}else{
				//加载表头鸡类信息
				pluckFoodWater.initLoadData();
			}
		}
		
	},
	bindEvent:function(){
		//返回按钮
		$("#pfw_back").click(function(){
			lastPageRefresh("refresh","dailyReport","dailyReportList");
			summer.closeWin();
		});
		//刷新按钮
		$("#pfw_refresh").click(function(){
			pluckFoodWater.init();
		});
		//主页按钮
		$("#home").click(function(){ 
			summer.openWin({
					"id" : 'main',
					"url" : 'html/main.html',
			});
		});
		//保存按钮
		$("#pfw_submit").click(function(){
			pluckFoodWater.save();
		});
		//取消按钮
		$("#pfw_cancel").click(function(){
			var bool = $confirm("您确定取消编辑吗？");
			if(bool){
				pluckFoodWater.status=false;
				pluckFoodWater.setStatus();
				pluckFoodWater.initInfoLoad();
			}
			
		});
		//编辑按钮
		$("#pfw_update").click(function(){
			//可编辑
			$(".disable").attr("disabled",false);
			pluckFoodWater.status=true;
			pluckFoodWater.setStatus();
			pluckFoodWater.savestatus="2";
		});
		//删除按钮
		$("#pfw_delete").click(function(){
			var bool = $confirm("您确定要删除吗？");
				if(bool){
				pluckFoodWater.delete();
			}
		});
		//列表按钮
		$(".um_list").click(function(){
			summer.openWin({
				"id" : 'dailyReportList',
				"url" : 'html/dailyReport/dailyReportList.html',
				"pageParam" : {
					"type" : "FoodAndWater",
					"consumeType" : "'F','W'"
				}
			});
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
	initInfoLoad : function(){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var date=summer.pageParam.date;
			var batch=summer.pageParam.batch;
			var json = {
				date:date,
				batch:batch,
				logininfo : lonininfo,
			}
			summer.showProgress({
				"title" : "加载中..."
			});
			callAction(pluckFoodWater.viewid,"pluckFoodWaterInfo",json,"callBack");
	},
	infoLoadAction : function(){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json = {
				date:$("#pfw_date").text(),
				batch:$("#pfw_batch").text(),
				logininfo : lonininfo,
			}
			summer.showProgress({
				"title" : "加载中..."
			});
			callAction(pluckFoodWater.viewid,"pluckFoodWaterInfo",json,"callBack");
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
			callAction(pluckFoodWater.viewid,"pluckFoodWaterInit",json,"callBack");
	},
	save : function(){
		if(pluckFoodWater.savestatus=="1"){
			pluckFoodWater.submit();//新增保存
		}else{
			pluckFoodWater.update();//修改保存
		}
	},
	submit:function(){//提交
		var array= [];
		$(".pfw_num").each(function(){
			var val= $(this).val()?$(this).val():"0";
			var house_name=$(this).attr("house");
			var food_num=$(this).attr("food-num");
			var water_num=$(this).attr("water-num");
			//var feed_name=$(".select-feed-type").val();
			var select_feed_type=$(this).attr("select_feed_type");
			var feed_name=$("."+select_feed_type).val();
			if(feed_name=="请选择"){
				feed_name="";
			}
			var food_type="F";
			var water_type="W";
			var obj = {
				pk_henhouse:$(this).attr("id"),//鸡舍pk
				henhouse_name:$("#"+house_name).text(),//鸡舍名称
				alive_num:$(this).text(),//存栏数
				pluck_food:$("#"+food_num).val(),//采食量
				pluck_water:$("#"+water_num).val(),//采水量
				food_type:food_type,//食物类型：F
				water_type:water_type,//水类型：W
				pk_feed_type:$("."+select_feed_type).find("option:selected").attr("id"),//饲料类型pk
				feed_type_name:feed_name//饲料类型
			};
			array.push(obj);
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_chicktype = $("#pfw_type").attr("pk_chicktype");
			var chicktype_name= $("#pfw_type").text();
			var busi_date=$(".busi_date").val();
			var create_date=$(".create_date").text();
			var json={
				billinfo:array,
				logininfo:lonininfo,
				busi_date:busi_date,
				create_date:create_date,
				pk_chicktype:pk_chicktype,//鸡类
				chicktype_name:chicktype_name//鸡类名称
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
	        callAction(pluckFoodWater.viewid,"addPluckFoodWater",json,"addCallBack");
		}else{
			alert("请先输入进雏数量！");
		}
	},
	update : function(){
		var array= [];
		$(".daily_num").each(function(){
			var val= $(this).val()?$(this).val():"0";
			var pk_daily=$(this).attr("pk_daily");//采集表pk
			var type=$(this).attr("daily_type");//采集类型
			var alive_numId=$(this).attr("alive_num");//获取存栏数id
			var alive_num=$("#"+alive_numId).text()//存栏数
			//var feed_name=$(".select-feed-type").val();
			var select_feed_type=$(this).attr("select_feed_type");
			var feed_name=$("."+select_feed_type).val();
			if(feed_name=="请选择"){
				feed_name="";
			}
			var obj = {
				pk_daily_consumption:pk_daily,//采集表pk
				pk_henhouse:$("#"+alive_numId).attr("id"),//鸡舍pk
				henhouse_name:$("#"+alive_numId).attr("henhouse_name"),//鸡舍名称
				alive_num:alive_num,//存栏数
				consumption_num:val,//采集数量
				daily_consumption_type:type,//采集类型
				pk_feed_type:$("."+select_feed_type).find("option:selected").attr("id"),//饲料类型pk
				feed_type_name:feed_name//饲料类型
			};
			array.push(obj);
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_chicktype = $("#pfw_type").attr("pk_chicktype");
			var chicktype_name= $("#pfw_type").text();
			var json={
				billinfo:array,
				logininfo:lonininfo,
				pk_chicktype:pk_chicktype,//鸡类
				chicktype_name:chicktype_name//鸡类名称
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
	        callAction(pluckFoodWater.viewid,"updatePluckFoodWater",json,"updateCallBack");
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
	        callAction(pluckFoodWater.viewid,"deletePluckFoodWater",json,"deleteCallBack");
		}else{
			alert("数据出错，请重新登录！");
		}
	},
	setStatus : function(){
		if(pluckFoodWater.status){
			$(".status3").show();//显示取消、保存
			$(".status2").hide();//隐藏编辑、删除
		}else{
			$(".status3").hide();//隐藏取消、保存
			$(".status2").show();//显示编辑、删除
		}
	},
	initpageTitalInfo : function(data){
		//存货种类
		$("#pfw_type").text(data.chicktype_name);
		$("#pfw_type").attr("pk_chicktype",data.pk_chicktype);
		$("#pfw_date").text(data.create_date);
		//$("#pfw_date").val(data.create_date);
		$("#pfw_age").text(data.days);
		//业务时间
		$(".busi_date").val(data.busi_date);
		
	},
	initpage : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		if(summer.pageParam.type && summer.pageParam.type=="makeup"){//补录状态时业务时间可以修改
			$(".busi_date").attr("disabled",false);
		}
		//表头批次号
		$("#pfw_batch").text(logininfo.henneryinfo.batch);
		//鸡场名称
		$("#pfw_hennery").text(logininfo.henneryinfo.hennery_name);
		$("#pfw_hennery").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);
		//日龄
		$("#pfw_age").text(logininfo.henneryinfo.days);
		//将列表至空
		$(".pfw-list-item").html("");
		var html="";
		for (var i = 0; i < logininfo.henhouseinfo.length; i++) {
		 	var billinfo =logininfo.henhouseinfo; 
			html+='<div   class="um-list-item">'
				+'		<div class="um-list-item-inner">'
				+'		<div class="um-list-item-body f14 " >'
				+'		<div class="l-t-info l-t-top"  style="float: left; height: 60px;" >'
				+'		<span id="house-name'+i+'">'+billinfo[i].henhouse_name+'</span>'
				+'		</div>'
				+'		<div class="l-t-info l-t-top" style="float: left;height: 60px;">'
				+'		<span style="width: 40%" house="house-name'+i+'" food-num="wk-food-num'+i+'" water-num="wk-water-num'+i+'" ' 
				+'      class="pfw_num focusevet alive_edit_status" select_feed_type="select-feed-type'+i+'"   id="'+billinfo[i].pk_henhouse+'" henhouse_name="'+billinfo[i].henhouse_name+'">0</span>'
				+'		羽'
				+'		</div>'
				+'		<div class="l-t-info" style="float: left">'
				+'			<div class="pluck-food" ><span>采食</span><input alive_num="'+billinfo[i].pk_henhouse+'" '
				+'				select_feed_type="select-feed-type'+i+'" class="input-width focusevet status daily_num disable"'
		        +'				daily_type="F" id="wk-food-num'+i+'"  type="number" value="0.00" />斤</div>'
				+'			<div class="pluck-water"><span>采水</span><input alive_num="'+billinfo[i].pk_henhouse+'"'
				+'		 		class="input-width focusevet daily_num status disable"  daily_type="W" id="wk-water-num'+i+'"'
				+'		 		type="number" value="0.00" />斤</div>'
		    	+'			<div class="pluck-feed">'
                +'				<span class="feed_siliao">饲料</span>'
				+'		        <select name="feed-type" id="feed_type" class="select-feed-type'+i+' select-feed-type disable">'
				+'				<option value="feed_type0">-请选择-</option>'
				+'				</select>'
				+'				</div>'
			    +'		</div>'
		        +'	</div>'
				+'	</div>'
				+'	</div>'
		
		};
		$(".pfw-list-item").html(html);
		//存栏数标签不可编辑
		$(".alive_edit_status").attr("disabled", true);
		pluckFoodWater.initFeedtypeSelect();
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
		if(billinfo && billinfo.length>0){
			//日龄
			$("#tital_age").text(billinfo[0].days);
			for(var i=0;i<data.billinfo.length;i++){
				$("#"+billinfo[i].pk_henhouse).text(billinfo[i].alive_num);//存栏数
				var food_num=$("#"+billinfo[i].pk_henhouse).attr("food-num");
				var water_num=$("#"+billinfo[i].pk_henhouse).attr("water-num");
				$("#"+food_num).removeClass("status");
				$("#"+water_num).removeClass("status");
			}
			//不可编辑
			$(".status").attr("disabled",true);
			for(var j=0;j<data.billinfo.length;j++){
				if(!billinfo[j].pk_daily_consumption){//采集表PK为空时返回
					pluckFoodWater.status=true;
					pluckFoodWater.setStatus();
					pluckFoodWater.savestatus="1";
					return;
				}
				pluckFoodWater.status=false;
				pluckFoodWater.setStatus();
				//不可编辑
				$(".disable").attr("disabled",true);
				var food_num=$("#"+billinfo[j].pk_henhouse).attr("food-num");
				var water_num=$("#"+billinfo[j].pk_henhouse).attr("water-num");
				if(billinfo[j].daily_consumption_type==$("#"+food_num).attr("daily_type")){//判断采集类型是否为"F"
					$("#"+food_num).attr("pk_daily",billinfo[j].pk_daily_consumption);
					$("#"+food_num).val(billinfo[j].consumption_num);
					if(billinfo[j].feed_type_name){
						$(".select-feed-type"+j).val(billinfo[j].feed_type_name);
					}
				}
				if(billinfo[j].daily_consumption_type==$("#"+water_num).attr("daily_type")){//判断采集类型是否为"W"
					$("#"+water_num).attr("pk_daily",billinfo[j].pk_daily_consumption);
					$("#"+water_num).val(billinfo[j].consumption_num);
				}
			}
		}
	}
	
}	
function callBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	if(args.status == "0"){
		pluckFoodWater.initpageTitalInfo(args.data);
		pluckFoodWater.initlist(args.data);
		pluckFoodWater.initdata=args.data;
	}else if (args.status == "1"){
		alert("初始化失败" + args.message);
	} else {
		alert(args.message);
	}	
}


function erresg(args){
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(args));
}

function addCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		pluckFoodWater.showstatus="2";
		pluckFoodWater.infoLoadAction();
		//不可编辑
		$(".disable").attr("disabled",true);
		pluckFoodWater.savestatus="1";
		alert("保存成功");
	}else{
		alert("保存失败"+args.message);
	}	
}

function updateCallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		pluckFoodWater.infoLoadAction();
		pluckFoodWater.status=true;
		pluckFoodWater.setStatus();
		alert("修改成功");
	}else{
		alert("修改失败"+args.message);
	}	
}

function deleteCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		/*pluckFoodWater.init();
		pluckFoodWater.status=true;
		pluckFoodWater.setStatus();*/
		pluckFoodWater.savestatus="1";
		lastPageRefresh("refresh","dailyReport","dailyReportList");
		summer.closeWin();
	}else{
		alert("删除失败"+args.message);
	}	
}