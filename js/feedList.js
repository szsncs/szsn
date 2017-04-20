//here is your code...
summerready = function () {
		feedList.bindEvent();
		//加载第一个页面
		feedList.init();
	//$summer.byId("content").innerHTML += "<h1 style='text-align: center'>Hello friends, welcome to touch the summer frame!</h1><h2 style='text-align: center'>The frame update at " +(new Date()).toLocaleString()+"</h2>";
};
/**
 * author:zhangjlt
 * date:2016年8月22日22:30:42
 */
var feedList = {
	/**
	 * bindEvent 页面事件
	 */
	bindEvent: function () {
		// 返回 关闭win
		$("#feedback").click(function(){
			summer.closeWin();
		});
		// 订单详情  需要判断权限 /*只有一个 直接展示详情 多个显示列表*/
		$("#order-details").click(function(){
			summer.openWin({
                "id" : 'feedDetails',
                "url" : 'html/feed/feedDetails.html'
            });
		});
		// 申请汇总
		$("#Application-summary").click(function(){
			summer.openWin({
                "id" : 'feedSummary',
                "url" : 'html/feed/feedSummary.html'
            });
		});
		//到货确认
		$("#arrival-confirmation").click(function(){
			summer.openWin({
                "id" : 'feedConfirmation',
                "url" : 'html/feed/feedConfirmation.html'
            });
		});
		// 饲料申请
		$("#apply").click(function(){
			summer.openWin({
                "id" : 'feedApply',
                "url" : 'html/feed/feedApply.html'
            });
		});

	},
	init:function(){
		var role =$cache.read("role");
		if(role == "1"){
		    $("#changzhang").show();
		    $("#siyangyuan").hide();
		}else{
		    $("#changzhang").hide();
		    $("#siyangyuan").show();
		}
	},
};

	
