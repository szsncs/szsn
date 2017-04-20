summerready = function() {
	daily_list.isupdate=false;
	daily_list.init();
	daily_list.bindEvent();
}; 

var daily_list = {
	isupdate:false,
	initdata : {},
	viewid : "com.sunnercn.dailydata.DailyReportListController",
	init : function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo : lonininfo,
			type : summer.pageParam.type,
			busi_date : summer.pageParam.date,
			pk_daily : summer.pageParam.pk_daily
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(daily_list.viewid,"SecondListInit",json,"callBack");
	},
	initpage : function(data) {
		var billinfo=data.billinfo;
		//将列表至空
		$(".daily_list").html("");
		var html="";
		if(billinfo.length>0){//判断有无列表信息
			for(var i=0;i<billinfo.length;i++){//循环添加列表
				var html="";
				html+='<a href="#"  class="um-list-item list_item" item_batch="batch'+i+'" item_date="date'+i+'" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner daily_info">'
					+'			<div class="um-list-item-body id="item_body" daily_status="approve_status'+i+'" ">'
					+'				<h4 class="um-media-heading f16">业务日期：<span id="date'+i+'" pk_daily="'+billinfo[i].pk_death_elimination+'">'+billinfo[i].committime+'</span>'
					+'		<span class="approve_status" id="approve_status'+i+'">已审核</span></h4>'
					+'		<h4 class="um-media-heading f16">填报时间：<span>'+billinfo[i].create_time+'</span></h4>'
					+'				<div class="um-row f16 ">'
					+'					<div class="list_batch">'
					+'						鸡舍：<span id="batch'+i+'" batch="'+billinfo[i].batch+'"'
					+'  						pk_henhouse="'+billinfo[i].pk_henhouse+'">'+billinfo[i].henhouse_name+'</span>'
					+'					</div>'
				    +'				<div class="um-row f16 ">'
				    +'					<div class="list_type" style="float: left">'
				    +'						类型：<span id="second_type'+i+'">'+billinfo[i].death_elimination_type+'</span>'
					+'					</div>'
					+'					<div class="list_num" style="float: left">'
					+'						数量：<span id="second_num'+i+'">'+billinfo[i].death_num+'</span>'
					+'					</div>'
					+'				</div>'
					+'				</div>'
					+'			</div>'
					+'		</div> </a>'
				$(".daily_list").append(html);
				if(!billinfo[i].commitstatus){//判断审核状态为空时将字体变为红色
					$("#approve_status"+i).text("未审核");
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
			lastPageRefresh("refresh","dailyReport","dailyReportList");
			summer.closeWin();
		});
		//刷新按钮
		$(".header_refresh").click(function(){
			daily_list.isupdate=true;
			daily_list.init();
		});
	},
	
	clickList : function(jsonArray) {
		$(".list_item").click(function() {
			var item_date = $(this).attr("item_date");
			var date = $("#" + item_date).text();
			var pk_daily = $("#" + item_date).attr("pk_daily");
			var item_batch = $(this).attr("item_batch");
			var batch = $("#" + item_batch).attr("batch");
			summer.openWin({
				"id" : 'deathElimination',
				"url" : 'html/dailyReport/deathElimination.html',
				"pageParam" : {
					"date" : date,
					"batch" : batch,
					"pk_daily" : pk_daily,
					"type" : "1",
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
	} else if (args.status == "1"){
		alert("初始化失败" + args.message);
	} else {
		alert(args.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(arg));
}

