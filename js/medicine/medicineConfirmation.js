summerready = function () {    
    
    medicineConfirmation.init();
	medicineConfirmation.bindEvent();
};
var medicineConfirmation = {
	data:{},
	viewid : "com.sunnercn.medicine.MedicineController",
	init:function(){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json = {
				logininfo:lonininfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
	        callAction(medicineConfirmation.viewid,"confirmInitMedicine",json,"callBack");
	},
	bindEvent:function(){
		$(".um-back").click(function(){
			summer.closeWin();
		});
		$("#medicineConfirm").unbind().on("click",function(){
			//确认按钮
			medicineConfirmation.confirmClick();	
		});
	},
	confirmClick :function(){
		var array = [];
		var checkBoxs = $(".md-checked");
		var l = 0;
		$(".md-checked").each(function(){
			if($(this).prop('checked')){
				var pk_inbill= $(this).attr("pk_inbill");
				var inbill_bs = [];
				$(this).parent().parent().next().find("li .confirm_num").each(function(){
					var pk_inbill_b = $(this).attr("pk_inbill_b");
					var num = $(this).val();
					var inbill_b ={
						pk_inbill_b:pk_inbill_b,
						num:num
					}
					inbill_bs.push(inbill_b);
				});
			    var obj={
					pk_inbill:pk_inbill,
					inbill_bs:inbill_bs			
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
			callAction(medicineConfirmation.viewid,"confirmMedicine",json,"confirmcallBack");
		}else{
			UM.alert("请先选择确认信息！");
		}
		
	},
	loadPage:function(data){
		var inbill = data;
		if(inbill.length>0){
			medicineConfirmation.initBillList(inbill);
		}else{
			$("#medicineList").html("");
			$("#medicineList").html("<div>当前无物流将要到货</div>");
		}
	},
	initBillList:function(list){
		$("#medicineList").html("");
		var html = "";
		html+='<div class="um-sortlist" id="sortList" >'
			+'	<ul class="um-sortlist-content">';
		for(var i=0;i<list.length;i++){
		
			html+='			<li class="um-sortlist-group '+list[i].isNormalMedicine+'">'
				+'				<a class="um-box-vc um-sortlist-title">'
                +'               	<label class="um-check-inline">'
                +'                  	<input name="um-checkbox-inline" class="md-checked" type="checkbox" id="confirmnum'+i+'" pk_inbill="'+list[i].pk_inbill+'">'
                +'                  	<span class="um-icon-checkbox um-css3-vc"></span>'
                +'             		</label>'
				+'					<div class="carNo">'
				+'						<p style="left:10px;">车号：<span>'+list[i].carno+'</span></p>'
				+'						<p style="right:0">申请日期：<span>'+list[i].inbill_time+'</span></p>'
				+'					</div>'
				+'				</a>'
				+'				<ul class="um-list um-no-active">';
				for(var j=i;j<list.length;j++){
				html+='		<li class="um-sortlist-row">'
					+'					<a href="#" class="um-list-item um-swipe-action">'
					+'						<div calss="medicineCount">'
					+'							<p class="medicineName">药名：<span>'+list[j].medicine_type_name+'</span></p>'
					+'						</div>	'
					+'						<div calss="medicineCountTwo">'
					+'							<p class="medicineNum">应到：<span class="shouldNum">'+list[j].num+'</span>'+list[j].medicine_measname+'</p>'
					+'							<p class="medicineNum">实到：<input type="number" class="confirm_num focusevet" pk_inbill_b='+list[j].pk_inbill_b+' value="'+list[j].num+'" placeholder="请输入确认收货量">'
					+'							<span>'+list[j].medicine_measname+'</span></p>'
					+'						</div>	'
					+'					</a>'
					+'				</li>';
					if(!(j+1<list.length&&list[j+1].pk_inbill===list[j].pk_inbill)){
						i=j;
						break;
					}
				}
				html+='</ul>'
				+'</li>';
		}
			html+='</ul>'
				+'</div>';
		$("#medicineList").html(html);	
		//下拉菜单
		 $(".um-sortlist-title").on("click",function(){
	    	$(this).next().slideToggle(400);
	    });
	    $(".um-check-inline").on("click",function(event){
	    	event.stopPropagation();
	    });	
	    $(".isCritical").hide();
	    $("#normal").on("click",function(){
	    	$(".isNormalMedicine").show();
	    	$(".isCritical").hide();
	    });	
	    $("#notNormal").on("click",function(){
	    	$(".isNormalMedicine").hide();
	    	$(".isCritical").show();
	    });
	},
	
};
/**
 * 接口回调模块 
 */
function callBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(args.status == "0"){
		var inbill= args.data.billinfo.inbill;
		if(inbill && inbill.length>0){
			medicineConfirmation.loadPage(inbill);
		}
		if(inbill.length<=0){
			$("#medicineList").html("");
		}	
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
function confirmcallBack(arg){
	summer.hideProgress();
	if(arg.status == "0"){
		UM.alert("确认成功");
		medicineConfirmation.init();
	}else{
		$("#medicineList").html("");
		UM.alert(arg.message);
		UM.alert("确认失败");
	}
}

function erresg(arg){
	summer.hideProgress();
	UM.alert(JSON.stringify(arg));
	UM.alert("连接超时！请重试");
}


