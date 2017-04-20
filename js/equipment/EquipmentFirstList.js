summerready = function() {
	equipment.init();
	equipment.bindEvent();
}; 

var equipment = {
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
			"viewid" : "com.sunnercn.equipment.EquipMaintController", //后台带包名的Controller名
			"action" : "listInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "callBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initpage : function(data) {
		equipment.now_date=data.now_date;
		var billinfo=data.billinfo;
		//将列表至空
		$(".equipment").html("");
		var html="";
		if(!billinfo || billinfo.length>0){//判断有无列表信息
			for(var i=0;i<billinfo.length;i++){//循环添加列表
				var html="";
				html+='<a href="#"  class="um-list-item list_item" item_in_money="in_money'+i+'" item_out_money="out_money'+i+'"  item_date="date'+i+'" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner daily_info">'
					+'			<div class="um-list-item-body id="item_body" daily_status="approve_status'+i+'" ">'
					+'				<h4 class="um-media-heading f16">业务时间：<span class="create_date" pk_equip_maint_h="'+billinfo[i].pk_equip_maint_h+'" '
					+'		id="date'+i+'" >'+billinfo[i].create_date+'</span>'
					+'		<span class="approve_status" id="img_isflag'+i+'">已有照片</span></h4>'
					+'				<div class="um-row f16 ">'
					+'					<div class="list_equipment">'
					+'						设备名称：<span id="batch'+i+'">'+billinfo[i].equip_name+'</span>'
					+'					</div>'
					+'				</div>'
					+'			</div>'
					+'		</div> </a>'
				$(".equipment").append(html);
				if("N"==billinfo[i].isflag){//判断审核状态为空时将字体变为红色
					$("#img_isflag"+i).text("无图片");
					$("#img_isflag"+i).css('color','red');
				}
			}
			equipment.clickList();
		}else{//无列表信息弹出提示并绘制空列表
			html+='<a href="#"  class="um-list-item list_item" >'
					+'		<div class="um-list-item-media">'
					+'		</div>'
					+'		<div class="um-list-item-inner">'
					+'			<div class="um-list-item-body">'
					+'				<h4 class="um-media-heading f18" style="color:red">无列表信息</h4>'
					+'			</div>'
					+'		</div> </a>'
					$(".equipment").html(html);
		}
	},
	bindEvent : function() {
		$(".header_back").click(function() {
			summer.closeWin();
		});
		//新增按钮
		$(".other_add").click(function() {
			var item_date=$(".list_item").attr("item_date");
			if(item_date){
				var date=$("#"+item_date).text();
				if(date==equipment.now_date){
					alert("当前填报日期已有数据，无法新增！");
					return;
				}
			}
			summer.openWin({
				"id" : 'eateryaccount',
				"url" : 'html/equipment/EquipmentMaintenance.html',
			});
		});
	},
	clickList : function(jsonArray) {
		$(".list_item").click(function(){
			var item_date=$(this).attr("item_date");
			var pk_equip_maint_h=$("#"+item_date).attr("pk_equip_maint_h");
			summer.openWin({
				"id" : 'EquipmentMaintenanceInfo',
				"url" : 'html/equipment/EquipmentMaintenanceInfo.html',
				"pageParam" : {
						"pk_equip_maint_h" : pk_equip_maint_h, 
					}
			});
		});
	}
}
/**
 * 接口回调模块
 */
function refresh(){
	equipment.init();
}

function callBack(arg) {
	summer.hideProgress();
	if (arg.status == "0") {
		//初始化界面
		equipment.initpage(arg.data);
	} else {
		alert("系统运行异常"+arg.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(arg));
}

