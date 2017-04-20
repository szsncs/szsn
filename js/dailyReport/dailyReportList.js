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
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(daily_list.viewid,"ListInit",json,"callBack");
	},
	initpage : function(data) {
		var billinfo=data.billinfo;
		//将列表至空
		$(".daily_list").html("");
		var html="";
		var pk_daily;
		if(billinfo.length>0){//判断有无列表信息
			for(var i=0;i<billinfo.length;i++){//循环添加列表
				pk_daily=billinfo[i].pk_daily;
				var html="";
				html+='<a href="#"  class="um-list-item list_item" item_batch="batch'+i+'" item_date="date'+i+'" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner daily_info">'
					+'			<div class="um-list-item-body id="item_body" daily_status="approve_status'+i+'" ">'
					+'				<h4 class="um-media-heading f16">业务日期：<span id="date'+i+'" pk_daily="'+pk_daily+'">'+billinfo[i].committime+'</span>'
					+'		<span class="approve_status" id="approve_status'+i+'">已审核</span></h4>';
					if(billinfo[i].create_time){
						html+='<h4 class="um-media-heading f16">业务时间：<span >'+billinfo[i].create_time+'</span></h4>';
					}
					html+='				<div class="um-row f16 ">'
					+'					<div class="list_batch">'
					+'						批次号：<span id="batch'+i+'">'+billinfo[i].batch+'</span>'
					+'					</div>'
					+'				</div>'
					+'			</div>'
					+'		</div> </a>';
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
			summer.closeWin();
		});
		//刷新按钮
		$(".header_refresh").click(function(){
			daily_list.isupdate=true;
			daily_list.init();
		});
		//新增按钮
		$("#bottom_add").click(function() {
				var List_type = summer.pageParam.type;
				var url;
				if(daily_list.checkDate() && !(List_type=="984020")){
					alert("该日期下已有填报数据，无法新增");
					return;
				};
				if(List_type=="984020"){//死淘列表
					url="deathElimination";
				}else if(List_type=="984030"){//周称重列表
					url="weekWeighing";
				}else if(List_type=="984040"){//采食采水列表
					url="pluckFoodWater";
				}else if(List_type=="984050"){//用电列表
					url="useElectricity";
				}else if(List_type=="984060"){//用气列表
					url="useGas";
				};
			//code   makeup为补录    add为新增
			summer.openWin({
				"id" : 'dailyReportAdd',
				"url" : 'html/dailyReport/'+url+'.html',
				"pageParam" : {
					"type" : "add"
				}
			});
		});
		
		
		//补录按钮 TODO 需要校验是否允许补录
		$("#bottom_makeup").click(function() {
			UM.confirm({
			    title: '友情提示：',
			    text: '您确定要补录信息吗？',
			    btnText: ["取消", "确定"],
			    overlay: true,
			    ok: function () {
			        var List_type = summer.pageParam.type;
					var url;
					if(List_type=="984020"){//死淘列表
						url="deathElimination";
					}else if(List_type=="984030"){//周称重列表
						url="weekWeighing";
					}else if(List_type=="984040"){//采食采水列表
						url="pluckFoodWater";
					}else if(List_type=="984050"){//用电列表
						url="useElectricity";
					}else if(List_type=="984060"){//用气列表
						url="useGas";
					};
					//code   makeup为补录    add为新增
					summer.openWin({
						"id" : 'dailyReportMakeup',
						"url" : 'html/dailyReport/'+url+'.html',
						"pageParam" : {
							"type" : "makeup"
						}
					});
			    },
			    cancle: function () {
					
			    }
			});
			
		});
	},
	/**
	 *校验列表单据时间和新增时间做比较，等于当前时间不允许新增 
	 */
	checkDate : function(){
		//获取系统时间
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var sysdate=lonininfo.sysdate;
		var bool=false;
		$(".list_item").each(function(){
			var item_date=$(this).attr("item_date");
			var date=$("#"+item_date).text();
			if(date==sysdate){
				bool = true;
				return false;//跳出循环
			}else{
				bool = false;
			}
		});
		return bool
	},
	clickList : function(jsonArray) {
		$(".list_item").click(function(){
			var item_date=$(this).attr("item_date");
			var date=$("#"+item_date).text();
			var pk_daily=$("#"+item_date).attr("pk_daily");
			var item_batch=$(this).attr("item_batch");
			var batch=$("#"+item_batch).text();
			
				var List_type = summer.pageParam.type;
				var url;
				if(List_type=="984020"){//死淘列表
					url="secondList";
				}else if(List_type=="984030"){//周称重列表
					url="weekWeighing";
				}else if(List_type=="984040"){//采食采水列表
					url="pluckFoodWater";
				}else if(List_type=="984050"){//用电列表
					url="useElectricity";
				}else if(List_type=="984060"){//用气列表
					url="useGas";
				};
				
				summer.openWin({
					"id" : 'secondList',
					"url" : 'html/dailyReport/'+url+'.html',
					"pageParam" : {
						"date" : date,
						"batch": batch,
						"pk_daily":pk_daily,
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
	} else if(arg.status == "1"){
		alert("初始化失败:"+arg.message);
		//lastPageRefresh("refresh","html","main");
		summer.closeWin();
	} else {
		alert(arg.message);	
		//lastPageRefresh("refresh","html","main");
		summer.closeWin();
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常:"+arg.message);
}

