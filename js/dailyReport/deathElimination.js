summerready = function() {
	deathElimination.init();
	deathElimination.bindEvent();
}
var deathElimination = {
	status:true,
	liststatus:"1",
	savestatus:"1",
	init : function() {
		deathElimination.initPage();
		deathElimination.initLoadData();
	},
	bindEvent:function(){
		//返回按钮
		$(".death_back").click(function(){
			summer.closeWin();
		});
		//提交按钮
		$("#bottom_submit").click(function(){
			deathElimination.save();
		});
		//修改按钮
		$("#bottom_update").click(function(){
			$(".disable").attr("disabled",false);
			$(".disable").css('color','black');
			deathElimination.status=false;
			deathElimination.setStatus();
			deathElimination.savestatus="2";
		});
		//主页按钮
		$("#home").click(function(){ 
			summer.openWin({
					"id" : 'main',
					"url" : 'html/main.html',
			});
		});
		//取消
		$("#bottom_cancel").click(function(){
			var bool = $confirm("您确定取消编辑吗？");
			if(bool){
				deathElimination.status=true;
				deathElimination.setStatus();
				deathElimination.savestatus="1";
				deathElimination.initLoadData();
			}
		});
		//列表按钮
		$(".um_list").click(function(){
			summer.openWin({
				"id" : 'dailyReportList',
				"url" : 'html/dailyReport/dailyReportList.html',
				"pageParam" : {
					"type" : "death",
				}
			});
		});
		//焦点事件
		$("#death_num").on('keyup', function(event) {
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
		$("#death_num").on('blur', function() {
			var $amountInput = $(this);
			//最后一位是小数点的话，移除
			$amountInput.val(($amountInput.val().replace(/\.$/g, "")));
		});
	},
	save : function(){
		if(deathElimination.savestatus=="1"){
			deathElimination.submit();//新增保存
		}else{
			deathElimination.update();//修改保存
		}
	},
	submit:function(){//提交
		var array= [];
		var pk_henhouse=$(".select_house option:selected").attr("id");
		var henhouse_name=$(".select_house").val();
		var death_elimination_num=$(".death_elimination_num").val();
		var death_elimination_type=$('input:radio:checked').val();
		var obj = {
			pk_henhouse:pk_henhouse,
			henhouse_name:henhouse_name,//鸡舍名称
			death_elimination_num:death_elimination_num,
			death_elimination_type:death_elimination_type,
		};
		array.push(obj);
		
		if(array.length > 0){
			if(obj.pk_henhouse==null){
				alert("请选择鸡舍！");
				return;
			}
			if(obj.death_elimination_type==null){
				alert("请选择死淘类型！");
				return;
			}
			if(obj.death_elimination_num==""){
				alert("请输入进雏数量！");
				return;
			}
			
			var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json={
				billinfo:array,//死淘类型、死淘数量
				logininfo:lonininfo,//登录信息
				pk_chicktype:$(".death_type").attr("pk-chicktype"),//存货种类pk
				chicktype_name:$(".death_type").text()//存货种类名称
				
			}
			summer.showProgress({
	            "title" : "加载中..."
	        });
			$service.callAction({
				"viewid" : "com.sunnercn.henneryinfo.DeathEliminationController", //后台带包名的Controller名
				"action" : "addDeathElimination", //方法名,
				"params" : json, //自定义参数
				"callback" : "addDeathElimination()", //请求回来后执行的ActionID
				"error" : "erresg()"//失败回调的ActionId
			});
		}
	},
	update:function(){
		var array= [];
		var pk_henhouse=$(".select_house option:selected").attr("id");
		var henhouse_name=$(".select_house").val();
		var death_elimination_num=$(".death_elimination_num").val();
		var death_elimination_type=$('input:radio:checked').val();
		var pk_death_elimination=$(".death_batch").attr("pk_death_elimination");
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var json={
			logininfo:logininfo,
			pk_henhouse:pk_henhouse,
			henhouse_name:henhouse_name,//鸡舍名称
			death_elimination_num:death_elimination_num,
			death_elimination_type:death_elimination_type,
			pk_death_elimination:pk_death_elimination
		}
		summer.showProgress({
            "title" : "加载中..."
        });
		$service.callAction({
			"viewid" : "com.sunnercn.henneryinfo.DeathEliminationController", //后台带包名的Controller名
			"action" : "updateDeathElimination", //方法名,
			"params" : json, //自定义参数
			"callback" : "updateDeathEliminationcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initPage : function(data) {
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		//$(".um_list").show();
		if(!summer.pageParam.list_status){
			$(".um_list").show();
		}
		if(summer.pageParam.list_status=="2"){
			//二级列表进入
			$("#home").show();
		}
		if(summer.pageParam.list_status=="1"){
			//一级列表进入
			$(".um_list").hide();
		}
		//批次号
		$(".death_batch").text(logininfo.henneryinfo.batch);
		//鸡场名称
		$(".death_hennery").text(logininfo.henneryinfo.hennery_name);
		$(".death_hennery").attr("pk-hennery",logininfo.henneryinfo.pk_hennery);
		$(".class").find("input:radio").prop('checked', false);
		deathElimination.initSelect();
		$("#death_num").val("");	
	},
	initSelect : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		$(".select_house").html("");
		var html='<option value="house0" selected="selected" style="text-align:right">请选择</option>';
			for (var i = 0; i < logininfo.henhouseinfo.length; i++) {
					var billinfo =logininfo.henhouseinfo;
					html+='<option value="'+billinfo[i].henhouse_name+'" style="text-align:right" id="'+billinfo[i].pk_henhouse+'">'+billinfo[i].henhouse_name+'</option>'
				};
		$(".select_house").html(html);
	},
	initLoadData : function(){
		var data = $cache.read("logininfo");
			var lonininfo = JSON.parse(data);
			var json = {
				date:summer.pageParam.date,
				batch:summer.pageParam.batch,
				pk_daily:summer.pageParam.pk_daily,
				logininfo : lonininfo
			}
			summer.showProgress({
				"title" : "加载中..."
			});
			$service.callAction({
					"viewid" : "com.sunnercn.henneryinfo.DeathEliminationController", //后台带包名的Controller名
					"action" : "deathEliminationInit", //方法名,
					"params" : json, //自定义参数
					"callback" : "initLoadDatacallBack()", //请求回来后执行的ActionID
					"error" : "erresg()"//失败回调的ActionId
			});
	},
	initlist : function(data){
		
		$("#chick-house option").text(data.henhouse_name);//鸡舍名称
		$("#chick-house").attr("pk_henhouse",data.pk_henhouse);//鸡舍pk
		$("#death_num").val(data.death_num);
		if(summer.pageParam.list_status){
			deathElimination.setStatus(summer.pageParam.list_status);
			//不可编辑
			$(".disable").attr("disabled",true);
			$(".disable").css('color','gray');
		}
		//主键
		//$(".death_batch").attr(data.)
		//填报时间
		$(".death_date").text(data.date);
		//业务时间
		$(".busi_date").val(data.busi_date);
		if(summer.pageParam.type=="3"){
			$(".busi_date").attr("disabled",false);
			$(".um_list").hide();
		}
		//存货种类
		$(".death_type").text(data.chicktype_name);
		$(".death_type").attr("pk-chicktype",data.pk_chicktype);
		$(".radio_death[value="+data.death_elimination_type+"]").attr("checked",true); 
		$(".death_batch").attr("pk_death_elimination",data.pk);//添加主键
	},
	setStatus : function(status){
		if(status){
			$(".status2").show();//显示取消、修改
			$(".status1").hide();//隐藏提交
		}else{
			$(".status2").hide();//隐藏取消、修改
			$(".status1").show();//显示编提交
		}
	},
}

function initLoadDatacallBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		deathElimination.initSelect();
		deathElimination.initlist(args.data);
	}else{
		alert(args.message);
		alert("初始化失败");
	}	
}

function updateDeathEliminationcallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		deathElimination.initLoadData();
		alert("修改成功");
	}else{
		alert("修改失败"+args.message);
	}	
}

function deathEliminationcallBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		deathElimination.initPage(args.data);
	}else{
		alert(args.message);
		alert("初始化失败");
	}	
}

function addDeathElimination(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		deathElimination.init();
		deathElimination.savestatus="1";
		alert("保存成功");
	}else{
		//alert(args.message);
		alert("保存失败")
	}	
}

function erresg(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	alert("系统运行异常");
}