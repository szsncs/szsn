summerready = function() {
	inchcik.init();
	inchcik.bindEvent();
}
var inchcik = {
	status:true,
	savestatus:"1",
	initdata:{},
	/**
	 *初始化 
	 */
	init : function() {
		//初始化界面
		inchcik.initpage();
		//加载表头鸡类信息
		inchcik.initLoadData();
	},
	bindEvent:function(){
		//返回按钮
		$("#top_back").click(function(){
			summer.closeWin();
		});
		//刷新按钮
		$("#top_refresh").click(function(){
			inchcik.init();
		});
		
		//保存按钮
		$("#bottom_submit").click(function(){
			inchcik.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function(){
			var bool = $confirm("您确定取消编辑吗？");
			if(bool){
				inchcik.status=false;
				inchcik.setStatus();
				inchcik.initLoadData();
			}
			
		});
		//编辑按钮
		$("#bottom_update").click(function(){
			$(".inchick_num").each(function(){
				if("insert"===$(this).attr("dmo_type")){
					$(this).attr("disabled",false);
				}
			})
			//可编辑
			//$(".disable").attr("disabled",false);
			inchcik.status=true;
			inchcik.setStatus();
			inchcik.savestatus="2";
		});
		//删除按钮
		/*$("#bottom_delete").click(function(){
			var bool = $confirm("您确定要删除吗？");
			if(bool){
				inchcik.delete();
			}
		});*/
		
		// TODO
		//失去焦点是触发
		$(".focusevet").bind("blur", function() {
			if($(this).val()==""){$(this).val("0")}
		});
		//获取焦点是触发
		$(".focusevet").bind("focus", function() {
			if($(this).val()=="0"){$(this).val("")}
		});
		
		$(".inchick_num").on('keyup', function(event) {
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
		$(".inchick_num").on('blur', function() {
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
			}
			summer.showProgress({
				"title" : "加载中..."
			});
			$service.callAction({
					"viewid" : "com.sunnercn.henneryinfo.InChickController", //后台带包名的Controller名
					"action" : "inChickInit", //方法名,
					"params" : json, //自定义参数
					"callback" : "callBack()", //请求回来后执行的ActionID
					"error" : "erresg()"//失败回调的ActionId
			});
	},
	save : function(){
		if(inchcik.savestatus=="1"){
			inchcik.submit();//新增保存
		}else{
			inchcik.update();//修改保存
		}
	},
	submit:function(){//提交
		var array= [];
		var first=0;
		$(".inchick_num").each(function(){
			var val= $(this).val();
			first++;
			if(val && val>0){
				var house_name=$(this).attr("house");
				var dmo_type=$(this).attr("dmo_type");
				var obj = {
					pk_henhouse:$(this).attr("id"),
					henhouse_name:$("#"+house_name).text(),
					inchick_num:$(this).val(),
					dmo_type:dmo_type
				};
			array.push(obj);
			}
		});
		if(array.length > 0){
			if(array.length<first){
				var bool = $confirm("是否确定保存！");
				if(bool){
					inchcik.submitInfo(array);
				}
			}else{
				var bool = $confirm("是否确定保存！");
				if(bool){
					inchcik.submitInfo(array);
				}
			}
		}else{
			alert("请先输入进雏数量！");
		}
	},
	submitInfo : function(array){
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var pk_chicktype = $("#tital_type").attr("pk_chicktype");
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
			"viewid" : "com.sunnercn.henneryinfo.InChickController", //后台带包名的Controller名
			"action" : "addInChickInfo", //方法名,
			"params" : json, //自定义参数
			"callback" : "addCallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	update : function(){
		var update=[];
		var insert=[];
		var jsonUpdate={};
		var jsonInsert={};
		var first=0;
		$(".inchick_num").each(function(){
			first++;
			var billinfo=inchcik.initdata.billinfo;
			var val= $(this).val();
			var id= $(this).attr("id");
			var dmo_type=$(this).attr("dmo_type");
			for(var i=0;i<billinfo.length;i++){
				if(id && id==billinfo[i].pk_henhouse){
					if(val==billinfo[i].inchick_num ){
						break;
					}else{
						if(val && val>0 && "update"==dmo_type){
							var house_name=$(this).attr("house");
							var pk_inchick=$(this).attr("pk_inchick");
							var obj = {
								pk_inchick:pk_inchick,
								pk_henhouse:$(this).attr("id"),
								henhouse_name:$("#"+house_name).text(),
								inchick_num:val,
								dmo_type:dmo_type,
							};
						update.push(obj);
						break;
					}
				}
				}else{
					if(val && val>0 && "insert"==dmo_type){
						$(this).attr("dmo_type","update");
						var house_name=$(this).attr("house");
						var pk_inchick=$(this).attr("pk_inchick");
						var obj = {
							pk_inchick:pk_inchick,
							pk_henhouse:$(this).attr("id"),
							henhouse_name:$("#"+house_name).text(),
							inchick_num:val,
							dmo_type:dmo_type,
						};
					insert.push(obj);
					break;
					};
				}
			}
			jsonUpdate = {
				update:update
			}
			jsonInsert = {
				insert:insert
			}
		});
		if((update.length > 0 || update.length <= 0) && (insert.length > 0 || insert.length <= 0)){
			var array=update.length+insert.length;
			if(array.length<first){
				var bool = $confirm("是否确定修改!");
				if(bool){
					inchcik.updateInfo(jsonUpdate,jsonInsert);
				}
			}else{
				var bool = $confirm("是否确定修改！");
				if(bool){
					inchcik.updateInfo(jsonUpdate,jsonInsert);
				}
			}
		}else{
			var bool = $confirm("是否确定修改！");
		}
	},
	updateInfo : function(jsonUpdate,jsonInsert){
		var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var pk_chicktype = $("#tital_type").attr("pk_chicktype");
			var chicktype_name= $("#tital_type").text();
			var json={
				update:jsonUpdate,
				insert:jsonInsert,
				logininfo:lonininfo,
				pk_chicktype:pk_chicktype,//鸡类
				chicktype_name:chicktype_name//鸡类名称
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.henneryinfo.InChickController", //后台带包名的Controller名
				"action" : "updateInChickInfo", //方法名,
				"params" : json, //自定义参数
				"callback" : "updateCallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
	},
	/*delete : function(){
		var array= [];
		$(".inchick_num").each(function(){
			var pk_inchick=$(this).attr("pk_alive");//采集表pk
			var obj = {
				pk_inchick:pk_inchick,//采集表pk
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
				"viewid" : "com.sunnercn.henneryinfo.InChickController", //后台带包名的Controller名
				"action" : "deleteInChickInfo", //方法名,
				"params" : json, //自定义参数
				"callback" : "deleteCallBack()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});	
		}else{
			alert("数据出错，请重新登录！");
		}
	},*/
	setStatus : function(){
		if(inchcik.status){
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
				+'		<input type="number" value="0" style="width: 50%;height:25px;" house="house-name'+i+'" inchick_num="inchick_num'+i+'"'
				+'		class="inchick_num daily_num focusevet disable" dmo_type="insert" id="'+billinfo[i].pk_henhouse+'" '
				+' 		henhouse_name="'+billinfo[i].henhouse_name+'"/>'
				+'		羽'
				+'		</div>'
				+'			</div>'
				+'			</div>'
				+'		</div>'
		
		};
		$(".info_list_item").html(html);
		
	},
	initlist : function(data){
		var billinfo = data.billinfo;
		inchcik.initdata=billinfo;//将数据存在本地
		if(billinfo && billinfo.length>0){
			for(var i=0;i<data.billinfo.length;i++){
				$("#"+billinfo[i].pk_henhouse).val(billinfo[i].inchick_num);//进雏
				$("#"+billinfo[i].pk_henhouse).attr("dmo_type","update");
				$("#"+billinfo[i].pk_henhouse).attr("pk_inchick",billinfo[i].pk_inchick);
			}
			for(var j=0;j<data.billinfo.length;j++){
				if(!billinfo[j].pk_inchick){//采集表PK为空时返回
					inchcik.status=true;
					inchcik.setStatus();
					inchcik.savestatus="1";
					return;
				}
				inchcik.status=false;
				inchcik.setStatus();
			}
			//不可编辑
			$(".disable").attr("disabled",true);
		}
	}
	
}	
function callBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		inchcik.initpageTitalInfo(args.data);
		inchcik.initlist(args.data);
		inchcik.initdata=args.data;
	}else{
		alert(args.message);
		alert("初始化失败");
	}	
}


function erresg(args){
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(args));
}

function addCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		inchcik.initLoadData();
		//不可编辑
		inchcik.savestatus="1";
		alert("保存成功");
	}else{
		alert("保存失败"+args.message);
	}	
}

function updateCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		inchcik.initLoadData();
		alert("修改成功");
	}else{
		alert("修改失败"+args.message);
	}	
}

function deleteCallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		inchcik.init();
		inchcik.status=true;
		inchcik.setStatus();
		inchcik.savestatus="1";
		alert("删除成功");
	}else{
		alert("删除失败"+args.message);
	}	
}	