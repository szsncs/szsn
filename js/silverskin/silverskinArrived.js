
var silverskinArrived = {
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
				"action" : "arrivalInfoInit", //方法名,
				"params" : json, //自定义参数
				"callback" : "callBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		
	},
	bindEvent:function(){
		$(".um-back").click(function(){
			summer.closeWin();
		});
		
		$(".ti-home").unbind().on("click",function(){
			//保存按钮
			summer.openWin({
                "id" : 'home',
                "url" : 'html/main.html'
            });
		});
		$(".ti-home").click(function(){
			summer.closeWin();
		});
		// TODO
		//失去焦点是触发
		$(".focusevet").bind("blur", function() {
			if($(this).val()==""){$(this).val("0")}
		});
		//获取焦点是触发
		$(".focusevet").bind("focus", function() {
			if($(this).val()=="0"){$(this).val("")}
		});
		
		//敲击按键时触发
		$(".daily_num").bind("keypress", function(event) {
			var event = event || window.event;
			var getValue = $(this).val();
			//控制第一个不能输入小数点"."
			if (getValue.length == 0 && event.which == 46) {
				alert("第一位不能输入小数点！")
				event.preventDefault();
				return;
			}
			//控制只能输入一个小数点"."
			if (getValue.indexOf('.') != -1 && event.which == 46) {
				event.preventDefault();
				alert("只允许输入一个小数点！")
				return;
			}
			//控制只能输入的值
			if (event.which && (event.which < 48 || event.which > 57) && event.which != 8 && event.which != 46) {
				event.preventDefault();
				return;
			}
		})
		//失去焦点是触发
		$(".daily_num").bind("blur", function(event) {
			var value = $(this).val(),
			    reg = /\.$/;
			if (reg.test(value)) {
				value = value.replace(reg, "");
				$(this).val(value);
			}
		});

	},
	
	loadPage:function(data){
		var inbill = data.billinfo.inbill;
		if(inbill.length>0){
			silverskinArrived.initBillList(inbill);
		}else{
			alert("暂时没有谷皮将要到货");
		}
	},
	initBillList:function(list){
		if(list && list.length>0){
			var sqzl = 0;
			var dhzl = 0;
			var qrzl = 0;
			for(var i=0;i<list.length;i++){
				var html="";
				html+='<li class="applyli">'
				  +'<div class="um-list-item">'
				  +'<div class="um-list-item-inner">'
				  +'<div class="um-list-item-left">'
				  +'<div class="feed">'
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
				  +'确认货量：<span>'+list[i].checkednum+'</span>吨'
				  +'</div>'
				  +'</div>'
				  +'</div>'
				  +'</div>'
				  +'</li>';
				  var obj;
				  if(list[i].isPlan==="plan"){
				  	if(list[i].arrivetype==="4E"){
				  		obj = $("#4EPlaninbillListul");
				  	}else{
				  		obj = $("#45PlaninbillListul");
				  	}
				  }else{
				  	if(list[i].arrivetype==="4E"){
				  		obj = $("#4ESupplementinbillListul");
				  	}else{
				  		obj = $("#45SupplementinbillListul");
				  	}
				  }
				  obj.append(html);
				  var sqzl = obj.find("a i.sqzl");
				  var dhzl = obj.find("a i.dhzl");
				  var qrzl = obj.find("a i.qrzl");
				  sqzl.text(parseFloat(sqzl.text())+parseFloat(list[i].plannum));
				  dhzl.text(parseFloat(dhzl.text())+parseFloat(list[i].num));
				  qrzl.text(parseFloat(qrzl.text())+parseFloat(list[i].checkednum));
			}
		}
		$(".um-sortlist-title").on('click',function(){
    		$(this).parent().find("li").stop().toggle(400);
    	});
    	$("#45SupplementinbillListul").hide();
    	$("#4ESupplementinbillListul").hide();
    	$("#45SupplementinbillListul").find("li").hide();
    	$("#4ESupplementinbillListul").find("li").hide();
    	$("#4EPlaninbillListul").find("li").hide();
    	$("#45PlaninbillListul").find("li").hide();
		$("#plan").on('click',function(){
			$("#4EPlaninbillListul").show();
			$("#45PlaninbillListul").show();
			$("#45SupplementinbillListul").hide();
			$("#4ESupplementinbillListul").hide();
		});
		$("#supplement").on('click',function(){
			$("#4EPlaninbillListul").hide();
			$("#45PlaninbillListul").hide();
			$("#45SupplementinbillListul").show();
			$("#4ESupplementinbillListul").show();
		});
	},
	
};
/**
 * 接口回调模块 
 */
function callBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		silverskinArrived.loadPage(arg.data);
	}else{
		alert("初始化失败");
		alert(args.message);
	}	
}

function erresg(arg){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	alert("系统运行异常");
}


summerready = function () {    
    
    silverskinArrived.init();
	silverskinArrived.bindEvent();
};