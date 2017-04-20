summerready = function() {
	daily_list.init();
	daily_list.bindEvent();
}; 

var daily_list = {
	initdata : {},
	init : function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo : lonininfo,
			type : summer.pageParam.type,
			consumeType : summer.pageParam.consumeType
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.dailydata.DailyReportListController", //后台带包名的Controller名
			"action" : "ListInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "callBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initpage : function(data) {
		var billinfo=data.billinfo;
		//将列表至空
		$(".daily_list").html("");
		var html="";
		if(billinfo.length>0){//判断有无列表信息
			for(var i=0;i<billinfo.length;i++){//循环添加列表
				var html="";
				html+='<a href="#"  class="um-list-item list_item" item_approve="approve_status'+i+'" item_batch="batch'+i+'" item_date="date'+i+'" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner daily_info">'
					+'			<div class="um-list-item-body id="item_body" daily_status="approve_status'+i+'" ">'
					+'				<h4 class="um-media-heading f16">业务时间：<span id="date'+i+'" pk_daily="'+billinfo[i].pk_weekly_weigh+'">'+billinfo[i].committime+'</span>'
					+'		<span class="approve_status" status="Y" id="approve_status'+i+'">已审核</span></h4>'
					+'				<div class="um-row f16 ">'
					+'					<div class="list_batch">'
					+'						批次号：<span id="batch'+i+'">'+billinfo[i].batch+'</span>'
					+'					</div>'
					+'				</div>'
					+'			</div>'
					+'		</div> </a>'
				$(".daily_list").append(html);
				if(!billinfo[i].commitstatus){//判断审核状态为空时将字体变为红色
					$("#approve_status"+i).text("未审核");
					$("#approve_status"+i).attr("status","N");
					$("#approve_status"+i).css('color','red');
				}
			}
			daily_list.clickList();
		}else{//无列表信息弹出提示并绘制空列表
			html+='<a href="#"  class="um-list-item list_item" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner">'
					+'			<div class="um-list-item-body">'
					+'				<h4 class="um-media-heading f18" style="color:red">无列表信息</h4>'
					+'			</div>'
					+'		</div> </a>'
					$(".daily_list").html(html);
		}
	},
	bindEvent : function() {
		$(".header_back").click(function() {
			summer.closeWin();
		});
		//刷新按钮
		$(".header_refresh").click(function(){
			daily_list.init();
		});
		//新增按钮
		$(".daily_add").click(function() {
			summer.openWin({
				"id" : 'weekWeighing',
				"url" : 'html/dailyReport/weekly/weekWeighing.html',
				"pageParam" : {
					"type" : "0", //传入详情页面状态  1为详细状态  0为初始状态
				}
			});
		});
		//补录按钮
		$(".header_makeup").click(function() {
			summer.openWin({
				"id" : 'weekWeighing',
				"url" : 'html/dailyReport/weekly/weekWeighing.html',
				"pageParam" : {
					"type" : "2", //传入详情页面状态  1为详细状态  0为初始状态
				}
			});
		});
	},
	clickList : function(jsonArray) {
		$(".list_item").click(function(){
			var item_date=$(this).attr("item_date");
			var date=$("#"+item_date).text();
			var pk_weekly_weigh=$("#"+item_date).attr("pk_daily");
			var item_batch=$(this).attr("item_batch");
			var batch=$("#"+item_batch).text();
			var item_approve=$(this).attr("item_approve");
			var status=$("#"+item_approve).attr("status");
			summer.openWin({
					"id" : 'weekWeighingInfo',
					"url" : 'html/dailyReport/weekly/weekWeighingInfo.html',
					"pageParam" : {
						"date" : date, //填报日期
						"batch": batch, //批次号
						"pk_weekly_weigh":pk_weekly_weigh, //pk
						"status":status,
 						"type" : "1" //传入详情页面状态  1为详细状态  0为初始状态
					}
				});
			});
		}
	}
/**
 * 接口回调模块
 */

function refresh(){
	daily_list.init();
}

function callBack(arg) {
	summer.hideProgress();
	if (arg.status == "0") {
		//初始化界面
		daily_list.initpage(arg.data);
	} else {
		alert("系统运行异常"+arg.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(arg));
}

