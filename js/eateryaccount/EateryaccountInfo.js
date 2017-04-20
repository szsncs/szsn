summerready = function() {
	canteen.init();
	canteen.BindEvent();
}
var canteen = {
	type : "1",
	init : function() {
		canteen.initPage();
		canteen.initList();
	},
	BindEvent : function() {
		//返回按钮
		$("#tital_back").click(function() {
			lastPageRefresh("refresh","eateryaccount","EateryaccountFirstList");
			summer.closeWin();
		});
		//保存按钮
		$("#bottom_submit").click(function() {
			canteen.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function() {
			var bool = $confirm("您确定取消编辑吗？");
			if (bool) {
				canteen.setStatus(false);
			}
		});
		//编辑按钮
		$("#bottom_update").click(function() {
			//可编辑
			$(".disable").attr("disabled", false);
			canteen.type = "1";
			canteen.setStatus(true);
		});
		//删除按钮
		$("#bottom_delete").click(function() {
			var bool = $confirm("您确定要删除吗？");
			if (bool) {
				canteen.delete();
			}
		});
	},
	save : function() {//判断保存是提交还是修改
		if("0"==canteen.type){
			canteen.submit();//新增保存
		}else{
			canteen.update();//修改保存
		}
	},
	submit : function() {//提交
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var array= [];
		$(".accountingNum").each(function(){
			var money=$(this).val();
			var pk_costsubj=$(this).attr("item_pk");
			var costsubj_type=$(this).attr("costsubj_type")
			var costsubj_name=$(this).attr("item_name");
			var obj = {
				money : money,
				pk_costsubj : pk_costsubj,
				costsubj_type : costsubj_type,
				costsubj_name : costsubj_name
			}
			array.push(obj);
		});
		var json = {
			billinfo:array,
			logininfo:logininfo
		}
		canteen.sumbitCallAction(json);
	
	},
	sumbitCallAction : function(json){//调用新增服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.eateryaccount.EateryAccountController", //后台带包名的Controller名
			"action" : "add", //方法名,
			"params" : json, //自定义参数
			"callback" : "savecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	update : function() {//修改
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var array= [];
		$(".accountingNum").each(function(){
			var pk_eatery_account=$(this).attr("pk_eatery_account");
			var money=$(this).val();
			var obj = {
				pk_eatery_account : pk_eatery_account,
				money : money
			}
			array.push(obj);
		});
		var json = {
			billinfo : array,
			logininfo : logininfo,
		}
		canteen.updateCallAction(json);
	},
	updateCallAction : function(json){//调用修改服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.eateryaccount.EateryAccountController", //后台带包名的Controller名
			"action" : "update", //方法名,
			"params" : json, //自定义参数
			"callback" : "updatecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	delete : function() {//删除
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);	
		var array= [];
		$(".accountingNum").each(function(){
			var pk_eatery_account=$(this).attr("pk_eatery_account");
			var obj = {
				pk_eatery_account : pk_eatery_account,
			}
			array.push(obj);
		});
		var json = {
			billinfo : array,
			logininfo : logininfo,
		} 
		canteen.deleteCallAction(json);
	},
	deleteCallAction : function(json){//调用删除服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.eateryaccount.EateryAccountController", //后台带包名的Controller名
			"action" : "delete", //方法名,
			"params" : json, //自定义参数
			"callback" : "deletecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	setStatus : function(status){
		if(status){
			$(".status3").show();//显示取消、保存
			$(".status2").hide();//隐藏编辑、删除
		}else{
			$(".status3").hide();//隐藏取消、保存
			$(".status2").show();//显示编辑、删除
		}
	},
	initPage : function() {
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		$("#head_batch").text(logininfo.henneryinfo.batch);//批次号
		$("#head_henner_name").text(logininfo.henneryinfo.hennery_name)//鸡场名称
		$("#head_henner_name").attr("pk_hennery",logininfo.henneryinfo.pk_hennery);//鸡场pk
	},
	initList : function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var json = {
			logininfo : logininfo,
			create_date : summer.pageParam.date
		}
		$service.callAction({
			"viewid" : "com.sunnercn.eateryaccount.EateryAccountController", //后台带包名的Controller名
			"action" : "queryInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "queryInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initInfo : function(){
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var json = {
			logininfo : logininfo,
		}
		$service.callAction({
			"viewid" : "com.sunnercn.eateryaccount.EateryAccountController", //后台带包名的Controller名
			"action" : "addInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "addInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initLoadInfo : function(data) {
		
		$(".disable").attr("disabled", false);//不可编辑
		$(".isNormalCanteen").html("");
		var isNormalHtml=""; //收入
		$(".isCritical").html("");
		var isCriticalHtml="";//支出
		$(".isStock").html("");
		var isStockHtml="";//本月库存
		billinfo=data.billinfo;
		$("#head_create_date").text(billinfo[0].create_date);
		if(!billinfo || billinfo.length<=0){
			$(".isNormalCanteen").html("加载失败！");
			$(".isCritical").html("加载失败！");
			$("isStock").html("加载失败！");
		}
		var Smoney;
		var Zmoney;
		var Qmoney;
		for (var i = 0; i < billinfo.length; i++) {
			if("S"==billinfo[i].costsubj_type){
				if(billinfo[i].money){
					Smoney=billinfo[i].money;
				}
			isNormalHtml+='	<li>'
						+'		<div class="um-list-item">'
						+'			<div class="um-list-item-inner">'
						+'				<div class="um-list-item-left pl15">'
						+'					'+billinfo[i].costsubj_name+'：'
						+'				</div>'
						+'				<div class="um-list-item-right">'
						+'					<input type="number" class="form-control accountingNum disable" costsubj_type="S" id="item'+i+'" item_pk="'+billinfo[i].pk_costsubj+'"'
						+'					item_name="'+billinfo[i].costsubj_name+'" value="'+Smoney+'" pk_eatery_account="'+billinfo[i].pk_eatery_account+'" placeholder="请输入'+billinfo[i].costsubj_name+'收入">'
						+'				</div>'
						+'			</div>'
						+'		</div>'
						+'	</li>'
			}else if("Z"==billinfo[i].costsubj_type){
				if(billinfo[i].money){
						Zmoney=billinfo[i].money;
					}
				isCriticalHtml+='	<li>'
						+'		<div class="um-list-item">'
						+'			<div class="um-list-item-inner">'
						+'				<div class="um-list-item-left pl15">'
						+'					'+billinfo[i].costsubj_name+'：'
						+'				</div>'
						+'				<div class="um-list-item-right">'
						+'					<input type="number" class="form-control accountingNum disable" costsubj_type="Z" id="item'+i+'" item_pk="'+billinfo[i].pk_costsubj+'"'
						+'					item_name="'+billinfo[i].costsubj_name+'" value="'+Zmoney+'" pk_eatery_account="'+billinfo[i].pk_eatery_account+'" placeholder="请输入'+billinfo[i].costsubj_name+'收入">'
						+'				</div>'
						+'			</div>'
						+'		</div>'
						+'	</li>'
			}else if("Q"==billinfo[i].costsubj_type){
				if(billinfo[i].money){
						Qmoney=billinfo[i].money;
					}
				isStockHtml+='	<li>'
						+'		<div class="um-list-item">'
						+'			<div class="um-list-item-inner">'
						+'				<div class="um-list-item-left pl15">'
						+'					'+billinfo[i].costsubj_name+'：'
						+'				</div>'
						+'				<div class="um-list-item-right">'
						+'					<input type="number" class="form-control accountingNum disable" costsubj_type="Q" id="item'+i+'" item_pk="'+billinfo[i].pk_costsubj+'"'
						+'					item_name="'+billinfo[i].costsubj_name+'" value="'+Qmoney+'" pk_eatery_account="'+billinfo[i].pk_eatery_account+'" placeholder="请输入'+billinfo[i].costsubj_name+'收入">'
						+'				</div>'
						+'			</div>'
						+'		</div>'
						+'	</li>'
			}
			$(".isNormalCanteen").html(isNormalHtml);
			$(".isCritical").html(isCriticalHtml);
			$("isStock").html(isStockHtml);
			if(billinfo[i].money){
				$(".disable").attr("disabled", true);//不可编辑
				canteen.setStatus(false);
			}
		}
	}
}


/**
 * 接口回调模块
 */
function deletecallBack(args){//删除回调
	summer.hideProgress();
	if(args.status == "0"){
		canteen.setStatus(true);
		canteen.type="0";
		$(".disable").attr("disabled", false);//可编辑
		canteen.initInfo();
	}else{
		alert("删除失败"+args.message);
	}	
}


function savecallBack(args){
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		canteen.setStatus(false);//显示编辑，取消		
		$(".disable").attr("disabled", true);//不可编辑
		canteen.initList();
	} else {
		alert("保存失败" + args.message);
	}
}

function addInitcallBack(args) {//初始化回调
	if (args.status == "0") {
		canteen.setStatus(true); //true 显示取消、保存，隐藏编辑、删除
		canteen.initLoadInfo(args.data);
	} else {
		alert("初始化失败" + args.message);
	}
}

function updatecallBack(args){//修改回调
	var data=args.data
	if (args.status == "0") {
		canteen.setStatus(false); //true 显示取消、保存，隐藏编辑、删除
		$(".disable").attr("disabled", true);//不可编辑
		canteen.initList(data);
	} else {
		alert("修改失败" + args.message);
	}
}

function queryInitcallBack(args) {//初始化回调
	summer.hideProgress();
	if (args.status == "0") {
		canteen.initLoadInfo(args.data);
	} else {
		alert("初始化失败" + args.message);
	}
}

function erresg(arg) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(arg));
}