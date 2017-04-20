var silvSummary = {
	isupdate:false,
	initdata : {},
	viewid : "com.sunnercn.silverskin.SilverskinApplyController",
	init : function() {
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo : lonininfo
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(silvSummary.viewid,"initTotalInfo",json,"callBack");
	},
	bindEvent : function() {
		$(".um-back").click(function() {
			summer.closeWin();
		});
		//刷新按钮
		$(".sk_refresh").click(function(){
			silvSummary.isupdate=true;
			silvSummary.init();
		});
		//新增按钮
		$(".fd_add").click(function() {
			//type 1 为查看 3为新增
			summer.openWin({
				"id" : 'feedApply',
				"url" : 'html/silverskin/notApprvoeSuppliesInfo.html',
				"pageParam" : {
					"type" : "3"
				}
			});
		});
	},
	initListDataSource : function(data) {
		var billinfo = data.billinfo;
		var arr = [];
		var arrItem = {
			material_name : "种类",
			apply_num : "申请量(吨)"
		};
		if (billinfo && billinfo.length > 0) {
			
			for (var i = 0; i < billinfo.length; i++) {
				var row = billinfo[i].totalinfo;
				row.unshift(arrItem);
				var sub_status = billinfo[i].sub_status;
				if(sub_status && sub_status=="Y"){
					sub_status ="已提交";
				}else{
					sub_status ="未提交";
				}
				var apply_date = "申请时间:" + billinfo[i].apply_date;
				var obj = {
					sub_status : sub_status,
					apply_date : apply_date,
					row : row
				}
				arr.push(obj);
			}
			var arr2 = arr.concat();
			if(silvSummary.isupdate){
				if(viewModel.datas().length >0){
					viewModel.datas.removeAll();
				}
				
				for(var i =0;i<arr2.length;i++){
					viewModel.datas.push(arr2[i]);
				}
			}else{
				silvSummary.initList(arr);	
			}			
		} else {
			var arrNo = [];
			var obj = {				
				apply_date : "当前没有未审批的申请单，请新增",	
				sub_status : "",
				row : []			
			}
			arrNo.push(obj);	
			if(silvSummary.isupdate){
				if(viewModel.datas().length >0){
					viewModel.datas.removeAll();
				}				
				for(var i =0;i<arrNo.length;i++){
					viewModel.datas.push(arrNo[i]);
				}
			}else{
				silvSummary.initList(arrNo);	
			}
			
		}
	},
	initList : function(jsonArray) {
		//Knockout数据绑定
		viewModel.datas = ko.observableArray(jsonArray);
		ko.applyBindings(viewModel);
		//构造控件实例
		var listgroup = UM.listgroup("#listgroup");
		//添加控件方法
		
		listgroup.on("itemSwipeLeft", function(sender, args) {
			//这里可以处理行左滑事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
		});
		listgroup.on("itemDelete", function(sender, args) {
			//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
		});
		listgroup.on("itemClick", function(sender, args) {
			//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
			var dataArr = silvSummary.initdata.billinfo;
			var pk_total_info_h = dataArr[args.groupIndex].pk_total_info_h;
			summer.openWin({
				"id" : 'silverskinApply',
				"url" : 'html/silverskin/notApprvoeSuppliesInfo.html',
				"pageParam" : {
					"pk_apply" : pk_total_info_h,
					"type" : "1"
				}
			});
		});
		listgroup.on("tapHold", function() {
			//这里可以处理长按事件;
			//console.log("您刚才长按了列表！");
		});
	}
};
var ViewModel = function() {};
var viewModel = new ViewModel();
function refresh(){
	silvSummary.isupdate = true;
	silvSummary.init();
}
/**
 * 接口回调模块
 */
function callBack(args) {
	summer.hideProgress();
	if (args.status == "0") {
		silvSummary.initListDataSource(args.data);
		silvSummary.initdata = args.data;
	} else if (args.status == "1"){
		alert("初始化失败：" + args.message);
		//lastPageRefresh("refresh","html","main");
		summer.closeWin();
	} else {
		alert(args.message);
		//lastPageRefresh("refresh","html","main");
		summer.closeWin();
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常："+JSON.stringify(args));
}

summerready = function() {
	silvSummary.isupdate=false;
	silvSummary.init();
	silvSummary.bindEvent();
}; 