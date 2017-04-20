summerready = function () {    
    
    medicineReceive.init();
	medicineReceive.bindEvent();
};
var medicineReceive = {
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
				"viewid" : "com.sunnercn.medicine.MedicineRecieveController", //后台带包名的Controller名
				"action" : "receiveInitMedicine", //方法名,
				"params" : json, //自定义参数
				"callback" : "callBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		
	},
	bindEvent:function(){
		$(".um-back").click(function(){
			summer.closeWin();
		});
		$("#medicineReceive").on("click",function(){
			//确认按钮
			medicineReceive.confirmClick();	
		});
	},
	confirmClick :function(){
		var flag = true;
		var array = [];
		//确认按钮
		var medicineKind = $("#tabbar li.active").text().trim();
		var select = medicineKind === "日常药" ?"\.isNormalMedicine" : "\.isCritical";
		$(".daylist").each(function(){
			var days = $(this).find("p.day").find("span").text().trim();
			var bills = [];
			$(this).find("li.chickenhouse").each(function(){
				var pk_chickhouse = $(this).find("p.chick-house").find("span").attr("pk_chickhouse");
				var medicine_array = [];
				$(this).find("li"+select).each(function(){
					var medicine_id = $(this).find("p.medicine-name").find("span").attr("invbasdoc");
					var medicineNum = $(this).find(".menum").text();
					var pk_fmeas = $(this).find(".fmeas").attr("pk_fmeas");
					var medicine_info={
						"medicine_id":medicine_id,
						"medicineNum":medicineNum,
						"pk_fmeas":pk_fmeas
					}
					medicine_array.push(medicine_info);
				});
				if(medicine_array.length<1){
					flag = false;
				}
				var objs={
					"pk_chickhouse":pk_chickhouse,
					"medicine_array":medicine_array,
					"isNormalMedicine":medicineKind === "日常药" ?"isNormalMedicine" : "isCritical"
				}						
				bills.push(objs);
			});
			var obj={
				//pk_inbill:pk_inbill,
				"days":days,
				"bills":bills
			}						
			array.push(obj);  
		});
		if(!flag){
			UM.alert("该类药今天已经领取过！");
		}else if(array.length>0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json={
				billinfo:array,
				logininfo:lonininfo
			}
			summer.showProgress({
	           "title" : "加载中..."
	        });
	       
			//领取药品请求
				$service.callAction({
					"viewid" : "com.sunnercn.medicine.MedicineRecieveController", //后台带包名的Controller名
					"action" : "receiveMedicine", //方法名,
					"params" : json, //自定义参数
					"callback" : "confirmcallBack()", //请求回来后执行的ActionID
					"error" : "erresg()"//失败回调的ActionId
				});
			
		}else{
			UM.alert("无药可领！！");
		}
	},
	loadPage:function(data){
		var inbill = data;
		if(inbill.length>0){
			medicineReceive.initBillList(inbill);
		}else{
			$("#medicineList").html("");
			$("#medicineList").html("<div>当前无药品将要领取</div>");
		}
	},
	initBillList:function(list){
		$("#medicineList").html("");
		var html = "";
		html+='<div class="um-sortlist" id="sortList" >'
			+'	<ul class="um-sortlist-content">';
		for(var i = 0;i<list.length;i++){
		html+='		<li class="um-sortlist-group daylist">'
			+'			<a class="um-box-vc um-sortlist-title">'
			+'				<div calss="days" style="width: 800px;">'
			+'					<p class="count">'
			+'					批次：<span>'+list[i].batch+'</span>'
			+'					</p>'
			+'					<p class="day">'
			+'					日龄<span>'+list[i].days+'</span>天'
			+'					</p>'
			+'				</div> </a>'
			+'			<ul class="um-list um-no-active">'
				for(var j = i;j<list.length;j++){
		html+='				<li class="um-sortlist-row chickenhouse">'
			+'					<a href="#" class="um-list-item um-swipe-action chick-houses">'
			+'						<div calss="chickMedicine" style="width: 800px;">'
			+'							<p class="chick-house">'
			+'							鸡舍：<span pk_chickhouse="'+list[j].pk_chickhouse+'">'+list[j].chickhouse+'</span>'
			+'							</p>'
			+'							<p class="chick-num">'
			+'							当前羽数：<span>'+list[j].chicknum+'</span>'
			+'							</p>'
			+'						</div> </a>'
			+'					<ul class="um-list um-no-active">'
					for(var k=j ; k<list.length;k++){
		html+='<li class="um-sortlist-row medicineCount '+list[k].isNormalMedicine+'">'
			+'<a href="#" class="um-list-item um-swipe-action">'
			+'<div style="width: 800px;">'
			+'<p class="medicine-name">'
			+'药名：<span invbasdoc="'+list[k].medicine_id+'">'+list[k].medicineName+'</span>'
			+'</p>'
			+'<p class="medicine-num">'
			+'药量：<span class="menum">'+list[k].medicineNum+'</span><span class="fmeas" pk_fmeas="'+list[k].pk_fmeas+'">'+list[k].fmeasname
			+'</span></p>'
			+'</div> </a>'
			+'</li>'
						if(!(k+1<list.length&&list[k+1].pk_chickhouse===list[k].pk_chickhouse)){
							j = k;
							break;
						}
				}
		html+='</ul>'
			+'</li>'
					if(!(j+1<list.length&&list[j+1].days===list[j].days)){
						i=j;
						break;
					}
				}
		html+='</ul>'
			+'</li>'
			}
		html+='</ul>'
			+'</div>'
		$("#medicineList").html(html);	
		//下拉菜单
		$(".um-sortlist-title").on("click",function(){
	    	$(this).next().slideToggle(400);
	    });
	    $(".chick-houses").on("click",function(){
	    	$(this).next().slideToggle(400);
	    });
	    $(".um-check-inline").on("click",function(event){
	    	event.stopPropagation();
	    });	
	    
	    $("#chickenhouse").on("click",function(){
			var medicineKind = $("#tabbar li.active").text().trim();
			if(medicineKind === "日常药"){
				$(".isNormalMedicine").show();
				$(".isCritical").hide();
			}else{
				$(".isNormalMedicine").hide();
				$(".isCritical").show();
			}
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
		var inbill= arg.data.billinfo.inbill;
		if(inbill && inbill.length>0){
			medicineReceive.loadPage(inbill);
			$(".isCritical").hide();
		}
		if(inbill.length<=0){
			$("#medicineList").html("");
		}	
	}else{
		UM.alert("初始化失败");
		UM.alert(arg.message);
	}	
}
function confirmcallBack(arg){
	summer.hideProgress();
	//alert(JSON.stringify(arg));
	if(arg.status == "0"){
		medicineReceive.init();
		UM.alert("领取成功");
	}else{
		$("#medicineList").html("");
		UM.alert(arg.message);
		UM.alert("领取失败");
	}
}

function erresg(arg){
	summer.hideProgress();
	UM.alert(JSON.stringify(arg));
	UM.alert("连接超时！请重试");
}


