
var silverskinConfirmation = {
	data:{},
	init:function(){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json = {
				logininfo:lonininfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.silverskin.TransferEntryController", //后台带包名的Controller名
				"action" : "confirmInitSilverskin", //方法名,
				"params" : json, //自定义参数
				"callback" : "callBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		
	},
	bindEvent:function(){
		$(".um-back").click(function(){
			summer.closeWin();
		});
		$("#feedConfirm").unbind().on("click",function(){
			//保存按钮
			silverskinConfirmation.confirmClick();	
		});
		$(".ti-home").unbind().on("click",function(){
			//保存按钮
			summer.openWin({
                "id" : 'home',
                "url" : 'html/main.html'
            });
		});
		
		$(".confirm_num").on('keyup', function(event) {
			var $amountInput = $(this);
			//响应鼠标事件，允许左右方向键移动
			event = window.event || event;
			if (event.keyCode == 37 | event.keyCode == 39) {
				return;
			}
			//先把非数字的都替换掉，除了数字和.
			$amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
			//只允许一个小数点
			replace(/^\./g, "").replace(/\.{2,}/g, ".").
			//只能输入小数点后两位
			replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
		});
		$(".confirm_num").on('blur', function() {
			var $amountInput = $(this);
			//最后一位是小数点的话，移除
			$amountInput.val(($amountInput.val().replace(/\.$/g, "")));
		});
		

	},
	confirmClick :function(){
		var array = [];
		var isPlan;
		if($(".um-tabbar").find(".active a").html().trim()==="期初申请"){
			isPlan = ".plan";
		}else{
			isPlan = ".supplement";
		}
		$(isPlan).each(function(){
			if($(this).find(".sk-checked")[0].checked){
				var pk_inbill = $(this).find(".um-check-inline input").attr('pk_inbill');
				var num = $(this).find(".confirm_num").val();
			 	var obj={
					pk_inbill:pk_inbill,						
					num:num
				}
				array.push(obj); 
			}
		});
		if(array.length>0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json={
				billinfo:array,
				logininfo:lonininfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			//确认收货 请求
			$service.callAction({
				"viewid" : "com.sunnercn.silverskin.TransferEntryController", //后台带包名的Controller名
				"action" : "confirmSilverskin", //方法名,
				"params" : json, //自定义参数
				"callback" : "confirmcallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
			
		}else{
			UM.alert("请先选择确认信息！");
		}
		
	},
	loadPage:function(data){
		var inbill = data;
		if(inbill.length>0){
			silverskinConfirmation.initBillList(inbill);
		}else{
			$("#inbillListul").html("");
			$("#inbillListul").html("<div>当前无物流将要到货</div>");
		}
	},
	initBillList:function(list){
		$("#inbillListul").html("");
		var html = "";
		for(var i=0;i<list.length;i++){
			 html +='<li class="applyli '+list[i].isPlan+'">'
				  +'<div class="um-list-item">'
				  +'<div class="w50">'
				  +'<label class="um-check-inline">'
                  +'<input name="um-checkbox-inline" type="checkbox" pk_inbill="'+list[i].pk_inbill+'" class="sk-checked"  value="">'
                  +'<span class="um-icon-checkbox um-css3-vc"></span>'
                  +'</label>'
				  +'</div>'
				  +'<div class="um-list-item-inner">'
				  +'<div class="um-list-item-left">'
				  +'<div class="feed feed_date">'
				  +'到货时间:<span>'+list[i].dbizdate+'</span>'
				  +'</div>'
				  +'<div class="che">'
				  +'车牌号：<span>'+list[i].carno+'</span>'
				  +'</div>'
				  +'<div class="feed">'
				  +'实到货量：<span>'+list[i].num+'</span>吨'
				  +'</div>'
				  +'</div>'
				  +'<div class="um-list-item-right">'
				  +'<div class="feed">'
				  +'<span></span>'
				  +'</div>'
				  +'<div class="feed">'
				  +'应到货量：<span>'+list[i].plannum+'</span>吨'
				  +'</div>'
				  +'<div class="feed">'
				  +'确认货量：'
				  +'<input type="number" class="confirm_num" value="0" placeholder="请输入确认收货量">'
				  +'吨'
				  +'</div>'
				  +'</div>'
				  +'</div>'
				  +'</div>'
				  +'</li>';
		}
		$("#inbillListul").html(html);	
		
		var isPlan;
		if($(".um-tabbar").find(".active a").html().trim()==="期初申请"){
			isPlan = ".supplement";
		}else{
			isPlan = ".plan";
		}	
		$(isPlan).hide();
		$("#plan").on('click',function(){
			$(".plan").show();
			$(".supplement").hide();
		});
		$("#supplement").on('click',function(){
			$(".plan").hide();
			$(".supplement").show();
		});
	},
	
};
/**
 * 接口回调模块 
 */
function callBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		var inbill= arg.data.billinfo.inbill;
		if(inbill && inbill.length>0){
			silverskinConfirmation.loadPage(inbill);
		}
	}else{
		UM.alert("初始化失败");
	}	
}
/*function callBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		var inbill= arg.data.billinfo.inbill;
		if(inbill && inbill.length>0){
			silverskinConfirmation.loadPage(inbill);
		}	
	}else{
		$("#inbillListul").html("");
		alert("初始化失败");
		alert(args.message);
	}	
}*/
function confirmcallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		silverskinConfirmation.init();
		UM.alert("确认成功");
	}else{
		$("#inbillListul").html("");
		UM.alert("确认失败");
	}
}

function erresg(arg){
	summer.hideProgress();
	UM.alert("系统运行异常");
}


summerready = function () {    
    
    silverskinConfirmation.init();
	silverskinConfirmation.bindEvent();
};