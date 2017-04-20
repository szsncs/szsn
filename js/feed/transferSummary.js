summerready = function() {
	feedSummary.isupdate=false;
	feedSummary.init();
	feedSummary.bindEvent();
}; 
var feedSummary = {
	isupdate:false,
	initdata : {},
	viewid : "com.sunnercn.feed.SurplusFeedTransferController",
	init : function() {
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo : lonininfo
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(feedSummary.viewid,"initTotalInfo",json,"callBack");
	},
	bindEvent : function() {
		$(".um-back").click(function() {
			summer.closeWin();
		});
		//刷新按钮
		$(".top_refresh").click(function(){
			feedSummary.isupdate=true;
			feedSummary.init();
		});
		//新增按钮
		$("#surplus_add").click(function() {
			//type 1 为查看 3为新增
			summer.openWin({
				"id" : 'feedTransfer',
				"url" : 'html/feed/feedTransfer.html',
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
			material_name : "料号",
			surplus_num : "剩余量(吨)"
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
				var apply_date = "申请时间:" + billinfo[i].surplus_date;
				var obj = {
					sub_status : sub_status,
					apply_date : apply_date,
					row : row
				}
				arr.push(obj);
			}
			var arr2 = arr.concat();
			if(feedSummary.isupdate){
				if(viewModel.datas().length >0){
					viewModel.datas.removeAll();
				}				
				for(var i =0;i<arr2.length;i++){
					viewModel.datas.push(arr2[i]);
				}
			}else{
				feedSummary.initList(arr);	
			}			
		} else {
			var arrNo = [];
			var obj = {				
				apply_date : "当前没有未审批的申请单，请新增",		
				sub_status : "",
				row : []		
			}
			arrNo.push(obj);	
			if(feedSummary.isupdate){
				if(viewModel.datas().length >0){
					viewModel.datas.removeAll();
				}				
				for(var i =0;i<arrNo.length;i++){
					viewModel.datas.push(arrNo[i]);
				}
			}else{
				feedSummary.initList(arrNo);	
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
	/*	listgroup.on("pullDown", function(sender) {
			feedSummary.init();
		});*/
		/*listgroup.on("pullUp", function(sender) {
			//update();
		});*/
		listgroup.on("itemSwipeLeft", function(sender, args) {
			//这里可以处理行左滑事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
			//sender.showItemMenu(args.$target);
		});
		listgroup.on("itemDelete", function(sender, args) {
			//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
			/*args.$target.slideUp(500,function(){

			 });*/
		});
		listgroup.on("itemClick", function(sender, args) {
			//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
			// alert("您点击的是第" + (args.groupIndex+1) + "分组,第" + (args.childIndex+1) + "行");
			var dataArr = feedSummary.initdata.billinfo;
			var pk_total_info_h = dataArr[args.groupIndex].pk_total_info_h;
			summer.openWin({
				"id" : 'feedApply',
				"url" : 'html/feed/feedTransfer.html',
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
function update(){
	feedSummary.isupdate = true;
	feedSummary.init();
}
/**
 * 接口回调模块
 */
function callBack(args) {
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if (args.status == "0") {
		feedSummary.initListDataSource(args.data);
		feedSummary.initdata = args.data;
	} else if(args.status == "1"){
		alert("初始化失败:"+args.message);
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
	//alert(JSON.stringify(args));
	alert("系统运行异常");
}


$(document).ready(function() {
	//feedSummary.initList();
});

