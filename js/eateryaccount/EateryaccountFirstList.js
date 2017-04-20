summerready = function() {
	eateryaccount.init();
	eateryaccount.bindEvent();
}; 

var eateryaccount = {
	now_date : "",
	init : function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo : lonininfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.eateryaccount.EateryAccountController", //后台带包名的Controller名
			"action" : "listInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "callBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initpage : function(data) {
		eateryaccount.now_date=data.create_date;
		var billinfo=data.billinfo;
		//将列表至空
		$(".eateryaccount").html("");
		var html="";
		if(!billinfo || billinfo.length>0){//判断有无列表信息
			for(var i=0;i<billinfo.length;i++){//循环添加列表
				var html="";
				html+='<a href="#"  class="um-list-item list_item" item_in_money="in_money'+i+'" item_out_money="out_money'+i+'"  item_date="date'+i+'" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner daily_info">'
					+'			<div class="um-list-item-body id="item_body" daily_status="approve_status'+i+'" ">'
					+'				<h4 class="um-media-heading f16">业务时间：<span class="create_date" id="date'+i+'" >'+billinfo[i].create_date+'</span>'
					+'		</h4>'
				    +'				<div class="um-row f16 ">'
				    +'					<div class="list_type" style="float: left; margin-left:0px">'
				    +'						收入：<span id="in_money'+i+'">'+billinfo[i].in_money+'</span>'
					+'					</div>'
					+'					<div class="list_num" style="float: left;margin-left:30px">'
					+'						支出：<span id="out_money'+i+'">'+billinfo[i].out_money+'</span>'
					+'					</div>'
					+'				</div>'
					+'			</div>'
					+'		</div> </a>'
				$(".eateryaccount").append(html);
			}
			eateryaccount.clickList();
		}else{//无列表信息弹出提示并绘制空列表
			html+='<a href="#"  class="um-list-item list_item" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner">'
					+'			<div class="um-list-item-body">'
					+'				<h4 class="um-media-heading f18" style="color:red">无列表信息</h4>'
					+'			</div>'
					+'		</div> </a>'
					$(".eateryaccount").html(html);
		}
	},
	bindEvent : function() {
		$(".header_back").click(function() {
			summer.closeWin();
		});
		//新增按钮
		$(".daily_add").click(function() {
			$(".create_date").each(function(){
				var item_date=$(".list_item").attr("item_date");
				if(item_date){
					var date=$("#"+item_date).text();
					if(date==eateryaccount.now_date){
						alert("当前填报日期已有数据，无法新增！");
						return;
					}
				}
			});
			summer.openWin({
				"id" : 'eateryaccount',
				"url" : 'html/eateryaccount/Eateryaccount.html',
			});
		});
	},
	clickList : function(jsonArray) {
		$(".list_item").click(function(){
			var item_date=$(this).attr("item_date");
			var date=$("#"+item_date).text();//填报日期
			summer.openWin({
				"id" : 'EateryaccountInfo',
				"url" : 'html/eateryaccount/EateryaccountInfo.html',
				"pageParam" : {
						"date" : date, //填报日期
					}
			});
		});
	}
}
/**
 * 接口回调模块
 */
function refresh(){
	eateryaccount.init();
}

function callBack(arg) {
	summer.hideProgress();
	if (arg.status == "0") {
		//初始化界面
		eateryaccount.initpage(arg.data);
	} else {
		alert("系统运行异常"+arg.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(arg));
}

