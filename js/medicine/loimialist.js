summerready = function() {
	list.init();
	list.bindEvent();
}; 
var list = {
	initdata : {},
	viewid : "com.sunnercn.medicine.LoimiaApplyController",
	init : function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo : lonininfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(list.viewid,"loimiaList",json,"callBack");
	},
	initpage : function(data) {
		var billinfo=data;
		//将列表至空
		$(".loimia_list").html("");
		var html="";
		if(billinfo  && billinfo.length>0){//判断有无列表信息
			for(var i=0;i<billinfo.length;i++){//循环添加列表
				var html="";
					
					html+='<a href="#"  class="um-list-item list_item" item_batch="batch'+i+'" item_date="date'+i+'" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner daily_info">'
					+'			<div class="um-list-item-body id="item_body" daily_status="approve_status'+i+'" ">'
					+'				<h4 class="um-media-heading f16">批次号：<span id="batch'+i+'" isprescribe="'+billinfo[i].isprescribe+'" pk_loimia_info="'+billinfo[i].pk_loimia_info+'">'+billinfo[i].batch+'</span>'
					+'			<span class="approve_status" id="approve_status'+i+'" style="color:#00BB9C">已审核</span></h4>'
				    +'				<div class="um-row f16 ">'
				    +'					<div class="list_type" >'
				    +'						填报日期：<span id="date'+i+'">'+billinfo[i].create_date+'</span>'
					+'					</div>'
					+'					<div class="list_num" >'
					+'						日龄：<span id="days'+i+'">'+billinfo[i].days+'</span>'
					+'					</div>'
					+'				</div>'
					+'				</div>'
					+'			</div>'
					+'		</div> </a>'
				$(".loimia_list").append(html);
				if("N"==billinfo[i].isprescribe){//判断审核状态为空时将字体变为红色
					$("#approve_status"+i).text("未审核");
					$("#approve_status"+i).css('color','red');
				}
			}
			list.clickList();
		}else{//无列表信息弹出提示并绘制空列表
			html+='<a href="#"  class="um-list-item list_item" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner">'
					+'			<div class="um-list-item-body">'
					+'				<h4 class="um-media-heading f18" style="color:red">无列表信息</h4>'
					+'			</div>'
					+'		</div> </a>'
					$(".loimia_list").html(html);
		}
	},
	bindEvent : function() {
		$(".header_back").click(function() {
			summer.closeWin();
		});
		//新增按钮
		$(".loimia_add").click(function() {
			summer.openWin({
				"id" : 'loimiaInfo',
				"url" : 'html/medicine/loimiaInfo.html',
				"pageParam" : {
					"type" : "0", //传入详情页面状态  1为详细状态  0为初始状态
				}
			});
		});
	},
	clickList : function(jsonArray) {
		$(".list_item").click(function(){
			var item_date=$(this).attr("item_date"); //获取日期id
			var date=$("#"+item_date).text(); //填报日期
			var item_batch=$(this).attr("item_batch");//获取批次id
			var pk_loimia_info=$("#"+item_batch).attr("pk_loimia_info");//pk
			var isprescribe=$("#"+item_batch).attr("isprescribe");//开药标志			
			var batch=$("#"+item_batch).text();//批次
			
			summer.openWin({
					"id" : 'loimiaInfo',
					"url" : 'html/medicine/loimiaInfo.html',
					"pageParam" : {
						"date" : date, //填报日期
						"batch": batch, //批次号
						"pk_loimia_info":pk_loimia_info, //pk
 						"isprescribe":isprescribe, //开药标志
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
	list.init();
}
function callBack(args) {
	summer.hideProgress();
	if (args.status == "0") {
		//初始化界面
		list.initpage(args.data);
	} else if (args.status == "1"){
		alert("初始化失败：" + args.message);
		lastPageRefresh("refresh","html","main");
		summer.closeWin();
	} else {
		alert(args.message);
		lastPageRefresh("refresh","html","main");
		summer.closeWin();
	}
}

function erresg(args) {
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(args));
}

