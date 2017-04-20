
var feedConfirmation = {
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
				"viewid" : "com.sunnercn.feed.TransferEntryController", //后台带包名的Controller名
				"action" : "query", //方法名,
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
			feedConfirmation.confirmClick();	
		});
		$(".ti-home").unbind().on("click",function(){
			//保存按钮
			summer.openWin({
                "id" : 'home',
                "url" : 'html/main.html'
            });
		});
		

	},
	confirmClick :function(){
		var array = [];
		$(".sk-checked").each(function(){
			if($(this).prop('checked')){
				var pk_inbill= $(this).attr("pk_inbill");
				var i = $(this).attr("turns");
				var str = "#select"+i+" option:selected";
				var pk_silo = $(str).attr("pk_silo");
			    var silo_name=$("#select"+i).val();
			    if( pk_silo && pk_silo.length>=0){
			    	var obj={
						pk_inbill:pk_inbill,
						pk_silo:pk_silo,
						silo_name:silo_name
					}
					array.push(obj);
			    }
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
					"viewid" : "com.sunnercn.feed.TransferEntryController", //后台带包名的Controller名
					"action" : "confirm", //方法名,
					"params" : json, //自定义参数
					"callback" : "confirmcallBack()", //请求回来后执行的ActionID
					"error" : "erresg()"//失败回调的ActionId
				});
			
		}else{
			alert("请先选择料塔！");
		}
		
	},
	loadPage:function(data){
		var inbill = data.billinfo.inbill;
		if(inbill.length>0){
			feedConfirmation.initBillList(inbill);
		}else{
			$("#inbillListul").html("<div>当前无物流将要到货</div>");
		}
		if(inbill.length<=0){
			$("#inbillListul").html("");
		}
	},
	initBillList:function(list){
		$("#inbillListul").html("");
		var html = "";
		for(var i=0;i<list.length;i++){
			html +='<li class="applyli">'
				 + '	<div class="um-list-item"style="padding: 0;" >'
				 + '		<div class="w50 h90" style="text-align: center;"><input name="checkbox" type="checkbox" pk_inbill="'+list[i].pk_inbill+'" class="sk-checked" turns="'+i+'" value=""></div>'
				 + '		<div class="um-list-item-inner">'
				 + '	 		<div class="um-list-item-left" style="width: 60%">'
				 + '				<div class="che">车牌号：<span>'+list[i].carno+'</span></div>'
				 + '				<div class="feed">料号：<span>'+list[i].feed_type_name+'</span></div>'
				 + '				<div class="zhong">数量：<span id="'+list[i].silo_name+'">'+list[i].num+'吨</span></div>'
				 + '			</div>'
				 + '			<div class="um-list-item-right">'
				 + '				<select id="select'+i+'" class ="siloSelect" style="height:25px;"></select>'
				 + '			</div>'
				 + '		</div>'
				 + '	</div>'
				 + '</li>';

		}
		$("#inbillListul").html(html);
		feedConfirmation.initsiloSelect();
		for(var i=0;i<list.length;i++){
			if(list[i].silo_name){
				$("#select"+i).val(list[i].silo_name);
			}
		}
					
	},
	initsiloSelect:function(){
		var logininfo = $cache.read("logininfo");
		var json = JSON.parse(logininfo);
		var siloinfoList = json.siloinfo;
		$(".siloSelect").html("");
		var optionhtml= '<option>-请选择料塔-</option>';
		for(var i=0;i<siloinfoList.length;i++){
			optionhtml+='<option pk_silo="'+siloinfoList[i].pk_silo+'">'+siloinfoList[i].silo_name+'</option>'
		}
		$(".siloSelect").append(optionhtml);
	},
};
/**
 * 接口回调模块 
 */
function callBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		feedConfirmation.loadPage(arg.data);
	}else if(arg.status == "2"){
		$("#inbillListul").html("");
		alert(arg.message);
	}else{
		$("#inbillListul").html("");
		alert("初始化失败："+arg.message);
	}	
}
function confirmcallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		feedConfirmation.init();
		alert("确认成功")
	}else{
		alert("确认失败："+arg.message);
	}
}
function updatecallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		alert("修改成功");
	}else{
		alert("修改失败："+arg.message);
	}
}
function erresg(arg){
	summer.hideProgress();
	alert("系统运行异常："+JSON.stringify(args));
}


summerready = function () {    
    
    feedConfirmation.init();
	feedConfirmation.bindEvent();
};