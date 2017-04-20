summerready = function() {
	estimateAlive.init();
	estimateAlive.bindEvent();
}
var estimateAlive = {
	status:true,
	savestatus:"1",
	initdata:{},
	//consumestatus:["E"],
	/**
	 *初始化 
	 */
	init : function() {
		//初始化界面
		estimateAlive.initpage();
		//加载表头鸡类信息
		estimateAlive.initLoadData();
	},
	bindEvent:function(){
		//返回按钮
		$("#top_back").click(function(){
			summer.closeWin();
			/*	
			if(estimateAlive.savestatus=="2"){
				var bool = $confirm("当前正在编辑您确定返回吗？");
				if(bool){
					summer.closeWin();
				}
			}else{
				summer.closeWin();
			}*/
		});
		//刷新按钮
		$("#top_refresh").click(function(){
			estimateAlive.init();
		});
	
		//保存按钮
		$("#btn-save").click(function(){
			estimateAlive.save();
		});
		//取消按钮
		$("#btn-cancle").click(function(){
			var bool = $confirm("您确定取消编辑吗？");
			if(bool){
				estimateAlive.status=false;
				estimateAlive.setStatus();
				estimateAlive.initLoadData();
			}
			
		});
		//编辑按钮
		$("#btn-edit").click(function(){
			//可编辑
			$(".disable").attr("disabled",false);
			estimateAlive.status=true;
			estimateAlive.setStatus();
			estimateAlive.savestatus="2";
		});
		//删除按钮
		$("#btn-del").click(function(){
			var bool = $confirm("您确定要删除吗？");
				if(bool){
				estimateAlive.delete();
			}
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
		
		$(".daily_num").on('keyup', function(event) {
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
		$(".daily_num").on('blur', function() {
			var $amountInput = $(this);
			//最后一位是小数点的话，移除
			$amountInput.val(($amountInput.val().replace(/\.$/g, "")));
		});
	},
	initLoadData : function(){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var json = {
			logininfo : lonininfo,
			//consumestatus:estimateAlive.consumestatus
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.dailydata.EstimateAliveController", //后台带包名的Controller名
			"action" : "estimateAliveInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "callBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	save : function(){
		if(estimateAlive.savestatus=="1"){
			estimateAlive.submit();//新增保存
		}else{
			estimateAlive.update();//修改保存
		}
	},
	submit:function(){//提交
		var array= [];
		$(".daily_num").each(function(){
			var val= $(this).val()?$(this).val():"0";
			//var consume=$(this).attr("consume");
			var house_name=$(this).attr("house_name");
			//var daily_consumption_type="E";
			//var consumption_num = $("#"+consume).val();
			var obj = {
				pk_henhouse:$(this).attr("id"),
				henhouse_name:house_name,
				inchick_num:$(this).val(),
			};
			array.push(obj);
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_chicktype = $("#tital_type").attr("pk-chicktype");
			var chicktype_name= $("#tital_type").text();
			var json={
				billinfo:array,
				logininfo:lonininfo,
				pk_chicktype:pk_chicktype,
				chicktype_name:chicktype_name
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.dailydata.EstimateAliveController", //后台带包名的Controller名
				"action" : "addEstimateAlive", //方法名,
				"params" : json, //自定义参数
				"callback" : "addCallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		}else{
			alert("请先输入进雏数量！");
		}
	},
	update : function(){
		var array= [];
		$(".daily_num").each(function(){
			var val= $(this).val()?$(this).val():"0";//获取数量
			var pk_daily=$(this).attr("pk_daily");//获取pk
			var house_name=$(this).attr("house_name");//获取存栏数id
			var id=$(this).attr("id");//存栏数
			//var feed_name=$(".select-feed-type").val();
			var obj = {
				pk_daily_consumption:pk_daily,//日常消耗pk
				pk_henhouse:id,//鸡舍pk
				henhouse_name:house_name,//鸡舍名称
				alive_num:val,//存栏数
			};
			array.push(obj);
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_chicktype = $("#tital_type").attr("pk_chicktype");
			var chicktype_name= $("#tital_type").text();
			var json={
				billinfo:array,
				logininfo:lonininfo,
				pk_chicktype:pk_chicktype,//鸡类
				chicktype_name:chicktype_name//鸡类名称
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.dailydata.EstimateAliveController", //后台带包名的Controller名
				"action" : "updateEstimateAlive", //方法名,
				"params" : json, //自定义参数
				"callback" : "updateCallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		}else{
			alert("请先输入进雏数量！");
		}
	},
	delete : function(){
		var array= [];
		$(".daily_num").each(function(){
			var pk_daily=$(this).attr("pk_daily");//采集表pk
			var obj = {
				pk_daily_consumption:pk_daily,//采集表pk
			};
			array.push(obj);
		});
		if(array.length > 0){
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json={
				billinfo:array,
				logininfo:lonininfo
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.dailydata.EstimateAliveController", //后台带包名的Controller名
				"action" : "deleteEstimateAlive", //方法名,
				"params" : json, //自定义参数
				"callback" : "deleteCallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});	
		}else{
			alert("数据出错，请重新登录！");
		}
	},
	setStatus : function(){
		if(estimateAlive.status){
			$(".status3").show();//显示取消、保存
			$(".status2").hide();//隐藏编辑、删除
		}else{
			$(".status3").hide();//隐藏取消、保存
			$(".status2").show();//显示编辑、删除
		}
	},
	initpageTitalInfo : function(data){
		//存货种类
		$("#tital_type").text(data.chicktype_name);
		$("#tital_type").attr("pk_chicktype",data.pk_chicktype);
		//填报时间
		$("#tital_date").text(data.create_date);
		
	},
	initpage : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		//表头批次号
		$("#tital_batch").text(logininfo.henneryinfo.batch);
		//日龄
		$("#tital_age").text(logininfo.henneryinfo.days);
		//鸡场名称
		$("#tital_hennery").text(logininfo.henneryinfo.hennery_name);
		$("#tital_hennery").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);
		//将列表至空
		$(".info_list_item").html("");
		var html="";
		for (var i = 0; i < logininfo.henhouseinfo.length; i++) {
		 	var billinfo =logininfo.henhouseinfo; 
				html+='<div   class="um-list-item">'
				+'		<div class="um-list-item-inner">'
				+'		<div class="um-list-item-body f14 ">'
				+'		<div class="l-t-info" style="float: left;" >'
				+'		<span id="house-name'+i+'">'+billinfo[i].henhouse_name+'</span>'
				+'		</div>'
				+'		<div class="l-t-info" style="float: left">'
				+'      <span> &nbsp;</span>'
				+'		</div>'
				+'		<div class="l-t-info" style="float: left">'
				+'		<input type="number" value="0" style="width: 55%;height: 25px;" id="'+billinfo[i].pk_henhouse+'"  house_name="'+billinfo[i].henhouse_name+'"  class="consume daily_num focusevet disable" onfocus="if(this.value==\'0\'){this.value=\'\'}" onblur="if(this.value==\'\'){this.value=\'0\'}"/>'
				+'			羽'
				+'			</div>'
				+'			</div>'
				+'			</div>'
				+'		</div>'
		
		};
		$(".info_list_item").html(html);
	},
	
	initlist : function(data){
		var billinfo = data.billinfo;
		if(billinfo && billinfo.length>0){
			for(var i=0;i<data.billinfo.length;i++){
				$("#"+billinfo[i].pk_henhouse).val(billinfo[i].alive_num);//存栏数
			}
			for(var i=0;i<data.billinfo.length;i++){
				if(!billinfo[i].pk_henhouse){//采集表PK为空时返回
					estimateAlive.status=true;
					estimateAlive.setStatus();
					estimateAlive.savestatus="1";
					return;
				}
				estimateAlive.status=false;
				estimateAlive.setStatus();
				//不可编辑
				$(".disable").attr("disabled",true);
				$("#"+billinfo[i].pk_henhouse).attr("pk_daily",billinfo[i].pk_alive_data)
				$("#"+billinfo[i].pk_henhouse).val(billinfo[i].alive_num);//添加消耗数量
			}
		}
	}
	
}	
function callBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		estimateAlive.initpageTitalInfo(args.data);
		estimateAlive.initlist(args.data);
		estimateAlive.initdata=args.data;
	}else{
		alert(args.message);
		alert("初始化失败");
	}	
}


function erresg(args){
	summer.hideProgress();
	alert(JSON.stringify(args));
	alert("系统运行异常");
}

function addCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		estimateAlive.initLoadData();
		//不可编辑
		$(".disable").attr("disabled",true);
		estimateAlive.savestatus="1";
		alert("保存成功");
	}else{
		alert(args.message);
		alert("保存失败");
	}	
}

function updateCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		estimateAlive.initLoadData();
		estimateAlive.status=true;
		estimateAlive.setStatus();
		alert("修改成功");
	}else{
		alert(args.message);
		alert("修改失败");
	}	
}

function deleteCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		estimateAlive.init();
		estimateAlive.status=true;
		estimateAlive.setStatus();
		estimateAlive.savestatus="1";
		alert("删除成功");
	}else{
		alert(args.message);
		alert("删除失败");
	}	
}