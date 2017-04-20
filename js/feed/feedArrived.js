
var feedArrived = {
	viewid : "com.sunnercn.feed.TransferEntryController",
	init:function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo:lonininfo
		}
		summer.showProgress({
            "title" : "加载中..."
        });
        callAction(feedArrived.viewid,"queryAll",json,"callBack");
	},
	bindEvent:function(){
		$(".um-back").click(function(){
			summer.closeWin();
		});
		$(".ti-home").click(function(){
			summer.closeWin();
		});
	},
	initListDataSource:function(data){
		var applyinfo  = data.billinfo.applyinfo;
		var arr = [];
		var arrItem = {
			apply_num:"申请量(吨)",
			sign_num:"到货量(吨)",	
			feed_type_name:"料号"
		};
		if(applyinfo&& applyinfo.length>0){
			
			for(var i=0;i< applyinfo.length;i++){
				var row = applyinfo[i].feed_data;
				row.unshift(arrItem);
				var pk_apply ="订单号:"+ applyinfo[i].apply_no;
				var obj={
					pk_apply:pk_apply,
					row:row
				}
				arr.push(obj);
			}
			feedArrived.initList(arr);
		}else{
			alert("无物流信息");
		}
	},
	initList:function(jsonArray){
        		var ViewModel = function () {          
        		};
        		var viewModel = new ViewModel();
        		//jsonArray= arr;
        		viewModel.datas = ko.observableArray(jsonArray);
        		ko.applyBindings(viewModel);
        		//构造控件实例
        		var listgroup = UM.listgroup("#listgroup");			
        		//添加控件方法
        		listgroup.on("pullDown", function (sender) {
        			//这是可以编写列表下拉加载逻辑，参数sender即为当前列表实例对象
        			/*var item = {
        				"gname": "新增类别",
        				"row": [{
        					"name1": "S510",
	        					"name2": "64T",
	        					"name3": "18T",
        						"descri": "这是一段关于应用的描述,可以点击进入查看详情",
        						"img": "../../img/app_store.png",
        						"update": 3,
        						"company": "中东xxxx公司",
        						"downloads": 2200
        				}]
        			};
        			viewModel.datas.unshift(item); */
        	
        			sender.refresh(); 
        		});
        		listgroup.on("pullUp", function (sender) {
        			
        			//这是可以编写列表上拉刷新逻辑，参数sender即为当前列表实例对象
        			/*var item = {
        				"pk_apply": "新增类别",
        				"row": [{
							apply_num:"申请量",
							sign_num:"到货量",	
							feed_type_name:"料号",
							num:"1"
						},{
							apply_num:"申请量",
							sign_num:"到货量",	
							feed_type_name:"料号",
							num:"1"
						},{
							apply_num:"申请量",
							sign_num:"到货量",	
							feed_type_name:"料号",
							num:"1"
						}]
        			};
        			viewModel.datas=arr;*/
        			sender.refresh(); 
        		});
        		listgroup.on("itemSwipeLeft", function (sender, args) {
        			//这里可以处理行左滑事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
        			//sender.showItemMenu(args.$target);
        		});
        		listgroup.on("itemDelete", function (sender, args) {
        			//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
        			/*args.$target.slideUp(500,function(){
        
        			 });*/
        		});
        		listgroup.on("itemClick", function (sender, args) {
        			//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
        			// alert("您点击的是第" + (args.groupIndex+1) + "分组,第" + (args.childIndex+1) + "行");
        			summer.openWin({
                        "id" : 'confirmEdit',
                        "url" : 'html/feed/feedDetails.html',
                        "pageParam" : {
                            "count" : args.groupIndex
                        }
                    });
        			
        		});
        		listgroup.on("tapHold", function () {
        			//这里可以处理长按事件;
        			//console.log("您刚才长按了列表！");
        		});
	}

};

/**
 * 接口回调模块 
 */
function callBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(args.status == "0"){
		feedArrived.initListDataSource(args.data);
		$cache.write("arriveData", JSON.stringify(args.data));
		
	}else if(args.status == "1"){
		alert("初始化失败:"+args.message);
		//lastPageRefresh("refresh","html","main");
		summer.closeWin();
	} else {
		alert(args.message);	
		//lastPageRefresh("refresh","html","main");
		summer.closeWin();
	}		
}

function erresg(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	alert("系统运行异常");
}
$(document).ready(function(){
	//feedArrived.initList();
});


summerready = function () {    
    
    feedArrived.init();
	feedArrived.bindEvent();
};