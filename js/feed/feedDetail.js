
var feedDetails = {
	data:{},
	viewid : "com.sunnercn.feed.TransferEntryController",
	init:function(){
		var groupIndex=summer.pageParam ;
		var arriveData = $cache.read("arriveData");
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		if(!groupIndex || !arriveData){
			alert("数据出错");
		}else{
			var arriveDataObj = JSON.parse(arriveData);
			if(arriveDataObj.billinfo.applyinfo.length> groupIndex.count){
				var pk_apply = arriveDataObj.billinfo.applyinfo[groupIndex.count].pk_apply;
				var billinfo={
					pk_apply:pk_apply
				}
				var json= {
					lonininfo:lonininfo,
					billinfo:billinfo
				}
				summer.showProgress({
		            "title" : "加载中..."
		        });
		        callAction(feedDetails.viewid,"detailInfo",json,"callBack");
			}
		}
	},
	bindEvent:function(){
		$(".um-back").click(function(){
			summer.closeWin();
		});
		$("#feedConfirm").unbind().on("click",function(){
			//保存按钮
			feedDetails.confirmClick();	
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
		$(".applyli").each(function(){
			var pk_inbill= $(this).attr("pk_inbill");
			var i = $(this).attr("listNum");
			var str = "#select"+i+" option:selected";
			var pk_silo = $(str).attr("pk_silo");
		    var silo_name=$("#select"+i).val();
		    if( pk_silo && pk_silo.length>=0){
		    	for(var i =0;i<feedDetails.data.length;i++){
		    		if(feedDetails.data[i].pk_inbill ==pk_inbill){
		    			if(feedDetails.data[i].silo_name !=silo_name){
			    			var obj={
								pk_inbill:pk_inbill,
								pk_silo:pk_silo,
								silo_name:silo_name
							}
							array.push(obj);
		    			}
		    		}
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
	        var groupIndex=summer.pageParam ;
			var arriveData = $cache.read("arriveData");
			if(!groupIndex || !arriveData){
				//确认收货 请求
				callAction(feedDetails.viewid,"confirm",json,"confirmcallBack");
			}else{
				//已到货查询修改请求
				callAction(feedDetails.viewid,"update",json,"updatecallBack");
			}
		}else{
			alert("请先选择料塔！");
		}
		
	},
	loadPage:function(data){
		var inbill = data.billinfo.inbill;
		if(inbill.length>0){
			feedDetails.initBillList(inbill);
		}else{
			alert("无物流将要到货");
		}
	},
	initBillList:function(list){
		$("#inbillListul").html("");
		var html = "";
		for(var i=0;i<list.length;i++){
			html +='<li class="applyli" listNum ='+i+' pk_inbill='+list[i].pk_inbill +'><div class="um-list-item">'
				 + '	 <div class="um-list-item-inner">'
				 + '	 	<div class="um-list-item-left" style="width: 50%">'
				 + '			<div class="che">车牌号：<span>'+list[i].carno+'</span></div>'
				 + '				<div class="feed">料号：<span>'+list[i].feed_type_name+'</span></div>'
				 + '				<div class="zhong">数量：<span select="select'+i+'" feed_silo_name="'+list[i].silo_name+'" id="'+list[i].carno+'">'+list[i].num+'吨</span></div>'
				 + '		</div>'
				 + '		<div class="um-list-item-right">'
				 + '			<select id="select'+i+'"  class ="siloSelect" style="height:25px;"></select>'
				 + '		</div>'
				 + ' </div></div>'
				 + '</li>'
		}
		$("#inbillListul").html(html);
		feedDetails.initsiloSelect();
		for(var i=0;i<list.length;i++){
			if(list[i].silo_name){
				if(" "===list[i].carno){
					alert("没有车牌号不允许修改，请联系管理员");
					return;
				}
				var select=$("#"+list[i].carno).attr("select");
				$("#"+select).val(list[i].silo_name);
				$("#"+select).attr("silo_name",list[i].silo_name);
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
	if(arg.status == "0"){
		feedDetails.loadPage(arg.data);
		feedDetails.data = arg.data.billinfo.inbill;
	}else{
		alert("初始化失败"+args.message);
	}	
}
function confirmcallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		feedDetails.init();
	}else{
		alert("确认失败"+arg.message);
	}
}
function updatecallBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		alert("修改成功");
	}else{
		alert("修改失败"+arg.message);
	}
}
function erresg(arg){
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(args));
}


summerready = function () {    
    
    feedDetails.init();
	feedDetails.bindEvent();
};