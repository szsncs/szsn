summerready = function() {
	deathElimination.init();
	deathElimination.bindEvent();
}
var deathElimination = {
	status:true,
	liststatus:"1",
	savestatus:"1",
	viewid : "com.sunnercn.henneryinfo.DeathEliminationController",
	init : function() {
		deathElimination.initPage();
		if(summer.pageParam.type){
			if(summer.pageParam.type==="1"){
				deathElimination.initInfoLoadData();
			}else{
				deathElimination.initLoadData();
			}
		}
	},
	bindEvent:function(){
		//返回按钮
		$(".death_back").click(function(){
			var winId;
			if(summer.pageParam.type==="1"){
				winId="secondList";
			}else{
				winId="/dailyReport/dailyReportList.html";
			}
			summer.execScript({
				    winId: winId,
				    script: "refresh()",
			});
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
				deathElimination.initInfoLoadData();
			}
		});
		//焦点事件		
		$("#death_num").bind("keypress", function(event) {
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
		$("#death_num").bind("blur", function(event) {
			var value = $(this).val(),
			    reg = /\.$/;
			if (reg.test(value)) {
				value = value.replace(reg, "");
				$(this).val(value);
			}
		})	
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
	        callAction(deathElimination.viewid,"addDeathElimination",json,"addDeathElimination");
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
        callAction(deathElimination.viewid,"updateDeathElimination",json,"updateDeathEliminationcallBack");
	},
	initPage : function(data) {
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
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
		var billinfo =logininfo.henhouseinfo;
		var html='<option value="house0" selected="selected" style="text-align:right">请选择</option>';
			for (var i = 0; i < billinfo.length; i++) {
					html+='<option value="'+billinfo[i].henhouse_name+'" style="text-align:right" id="'+billinfo[i].pk_henhouse+'">'+billinfo[i].henhouse_name+'</option>'
				};
		$(".select_house").html(html);
	},
	initInfoLoadData : function(){
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
			callAction(deathElimination.viewid,"deathEliminationInfoInit",json,"initInfoLoadDatacallBack");
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
			callAction(deathElimination.viewid,"deathEliminationInit",json,"initLoadDatacallBack");
	},
	
	initlist : function(data){
		$("#chick-house").val(data.henhouse_name);//鸡舍名称
		$("#chick-house").attr("pk_henhouse",data.pk_henhouse);//鸡舍pk
		$("#death_num").val(data.death_num);//死淘数量
		//存货种类
		$(".death_type").text(data.chicktype_name);
		$(".death_type").attr("pk-chicktype",data.pk_chicktype);
		$(".radio_death[value="+data.death_elimination_type+"]").attr("checked",true); 
		$(".death_batch").attr("pk_death_elimination",data.pk);//添加主键
		//填报时间
		$(".death_date").text(data.date);
		//业务时间
		$("#body_busi_date").val(data.busi_date);
		if(summer.pageParam.type){
			if(summer.pageParam.type=="1"){
				deathElimination.setStatus(true);
				//不可编辑
				$(".disable").attr("disabled",true);
			}
			if(summer.pageParam.type=="makeup"){
				//可编辑
				$("#body_busi_date").attr("disabled",false);
			}
		}
	},
	setStatus : function(status){
		if(status){
			$(".status2").show();//显示修改
			$(".status1").hide();//隐藏取消、保存
		}else{
			$(".status2").hide();//隐藏修改
			$(".status1").show();//显示取消、保存
		}
	},
}

function initLoadDatacallBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	if(args.status == "0"){
		deathElimination.initSelect();
		deathElimination.initlist(args.data);
	}else{
		alert("初始化失败"+args.message);
	}	
}
function initInfoLoadDatacallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		deathElimination.initSelect();
		deathElimination.initlist(args.data);
	}else{
		alert("初始化失败"+args.message);
	}	
}
function updateDeathEliminationcallBack(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		deathElimination.initInfoLoadData();
		alert("修改成功");
	}else{
		alert("修改失败"+args.message);
	}	
}

function deathEliminationcallBack(args){
	summer.hideProgress();
	//1.从本地取数据 初始化表头和表体和汇总中鸡场名字
	if(args.status == "0"){
		deathElimination.initPage(args.data);
	}else if (args.status == "1"){
		alert("初始化失败" + args.message);
	} else {
		alert(args.message);
	}	
}

function addDeathElimination(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	if(args.status == "0"){
		deathElimination.initInfoLoadData();
		deathElimination.savestatus="1";
		alert("保存成功");
	}else{
		//alert(args.message);
		alert("保存失败"+args.message)
	}	
}

function erresg(args){
	summer.hideProgress();
	//alert(JSON.stringify(args));
	alert("系统运行异常"+JSON.stringify(args));
}