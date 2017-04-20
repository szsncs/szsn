summerready = function() {
	inchcik.init();
	inchcik.bindEvent();
}
var inchcik = {
	status:true,
	savestatus:"1",
	initdata:{},
	viewid : "com.sunnercn.henneryinfo.InChickController",
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
		
		//失去焦点是触发
		$(".focusevet").bind("blur", function() {
			var val=$(this).val();
			if(val==""){
				$(this).val("0")
			}
		});
		//获取焦点是触发
		$(".focusevet").bind("focus", function() {
			var val=parseInt($(this).val());
			if(val=="0"){
				$(this).val("")
			}
		});
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
			callAction(inchcik.viewid,"inChickInfoInit",json,"callBack");
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
        callAction(inchcik.viewid,"addInChickInfo",json,"addCallBack");
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
	        callAction(inchcik.viewid,"updateInChickInfo",json,"updateCallBack");
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
	        callAction(inchcik.viewid,"deleteInChickInfo",json,"deleteCallBack");
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
	if(args.status == "0"){
		inchcik.initpageTitalInfo(args.data);
		inchcik.initlist(args.data);
		inchcik.initdata=args.data;
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


function erresg(args){
	summer.hideProgress();
	alert("系统运行异常"+JSON.stringify(args));
}

function addCallBack(args){
	summer.hideProgress();
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