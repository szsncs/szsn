summerready = function() {
	loimiaInfo.init();
	loimiaInfo.bindEvent();
}
var loimiaInfo = {
	image : "", //图片路径
	status : true, //判断编辑状态
	type : "0", //传入详情页面状态  1为详细状态  0为初始状态

	bindEvent : function() {//绑定事件
		
		$("#header_photo").click(function() {//拍照按钮
			//点击显示/隐藏，再点击隐藏/显示
			$("#photo_select").toggle();
			
			$("#photo").unbind().on('click',function() {//拍照
				$("#photo_select").hide();
				loimiaInfo.openPhoto();
			});
		
			$("#album").unbind().on('click',function() {//相册
				$("#photo_select").hide();
				loimiaInfo.openAlbum();
			});
		});
		
		
		
		$(".click_body").click(function() {//拍照按钮
			//点击显示/隐藏，再点击隐藏/显示
			$("#photo_select").hide();
		});
		
		$("body").click(function(){
			$("#photo_select").hide();
		});
		
		$("#header_back").click(function() {//返回
			summer.closeWin();
		});
		//保存按钮
		$("#bottom_submit").click(function() {
			loimiaInfo.update();
		});
		//取消按钮
		$("#bottom_cancel").click(function() {
			var bool = $confirm("您确定取消编辑吗？");
			if (bool) {
				loimiaInfo.setStatus(false);
			}
		});
		//编辑按钮
		$("#bottom_update").click(function() {
			//可编辑
			$(".disable").attr("disabled", false);
			loimiaInfo.setStatus(true);
			loimiaInfo.type = "1";
		});
		//删除按钮
		$("#bottom_delete").click(function() {
			var bool = $confirm("您确定要删除吗？");
			if (bool) {
				loimiaInfo.delete();
			}
		});
	},
	init : function() {
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var billinfo = {
			pk_loimia_info : summer.pageParam.pk_loimia_info,
		}
		var json = {
			billinfo : billinfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.medicine.LoimiaApplyController", //后台带包名的Controller名
			"action" : "loimiaInit", //方法名,
			"params" : json, //自定义参数
			"callback" : "loimiaInitcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	initPage : function(data) {
		
		var billinfo=data.billinfo;//后台传入数据
		
		var pk_loimia_info=billinfo.pk_loimia_info;//疫情pk
		var body_henner_name=billinfo.hennery_name;//鸡场名称
		var body_create_date=billinfo.create_date;//填报日期
		var body_batch=billinfo.batch;//批次号
		var body_loimiaInfo=billinfo.info;//疫情情况
		var body_days=billinfo.days;//日龄
		var isprescribe=billinfo.isprescribe;//开药标志
		var image=billinfo.loimia_img;//图片
		loimiaInfo.image=image;
		$("#body_henner_name").text(body_henner_name);//从缓存里获取鸡场名称
		$("#body_create_date").text(body_create_date);//填报日期
		$("#body_batch").text(body_batch);//批次号
		$("#body_days").text(body_days);//日龄
		$("#body_loimiaInfo").text(body_loimiaInfo);//疫情情况
		if(!pk_loimia_info){//判断按钮状态 
			loimiaInfo.setStatus(true); //true 显示取消、保存，隐藏编辑、删除
			loimiaInfo.type="0"; //设置为新增状态
			return;
		}
		loimiaInfo.setStatus(false);
		$("#body_loimiaInfo").attr("pk_loimia_info",pk_loimia_info);//疫情pk
		try {
			$("#body_picture").attr("src", image);//疫情图片
		} catch (err) {
			throw new error("图片加载失败！");
		}
		$("#body_loimiaInfo").attr("isprescribe", isprescribe);//开药标志
		
		
	},
	/*save : function() {//判断保存是提交还是修改
		if(summer.pageParam.type){//判断从列表界进入type值为1 ，从列表新增进入type值为0
			loimiaInfo.type=summer.pageParam.type;
		}
		if("1"==loimiaInfo.type){
			loimiaInfo.submit();//新增保存
		}else{
			loimiaInfo.update();//修改保存
		}
	},
	sumbit : function() {//提交
		var info=$("#body_loimiaInfo").text();//疫情情况
		var loimia_img=$("#body_picture").attr("src");//疫情图片
		var billinfo = {
			info : info,
			loimia_img : loimia_img,
		}
		var json = {
			logininfo : logininfo,
			billinfo : billinfo,
		}
		if(!image){
			alert("请上传照片")
		}else{
			loimiaInfo.sumbitCallAction(json);
		}
	},
	sumbitCallAction : function(json){//调用新增服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.medicine.LoimiaApplyController", //后台带包名的Controller名
			"action" : "loimiaAdd", //方法名,
			"mauploadpath" : image,
			"params" : json, //自定义参数
			"callback" : "loimiaAddcallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},*/
	update : function() {//修改
		var info=$("#body_loimiaInfo").val();//疫情情况
		var loimia_img=$("#body_picture").attr("src");//疫情图片
		var pk_loimia_info=$("#body_loimiaInfo").attr("pk_loimia_info");//疫情pk
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var billinfo = {
			info : info,
			loimia_img : loimia_img,
			pk_loimia_info : pk_loimia_info,
		}
		var json = {
			logininfo : logininfo,
			billinfo : billinfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.medicine.LoimiaApplyController", //后台带包名的Controller名
			"action" : "loimiaUpdate", //方法名,
			"mauploadpath" : loimiaInfo.image,
			"params" : json, //自定义参数
			"callback" : "loimiaUpdatecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
		//loimiaInfo.updateCallAction(json);
	},
	updateCallAction : function(json){//调用修改服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.medicine.LoimiaApplyController", //后台带包名的Controller名
			"action" : "loimiaUpdate", //方法名,
			"mauploadpath" : loimiaInfo.image,
			"params" : json, //自定义参数
			"callback" : "loimiaUpdatecallBack()", //请求回来后执行的ActionID
			"error" : "erresg()"//失败回调的ActionId
		});
	},
	delete : function() {//删除
		//获取缓存数据
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		
		var pk_loimia_info=$("#body_loimiaInfo").attr("pk_loimia_info");//疫情pk
		var billinfo = {
			pk_loimia_info : pk_loimia_info,
		}
		var json = {
			logininfo : logininfo,
			billinfo : billinfo,
		}
		loimiaInfo.deleteCallAction(json);
	},
	deleteCallAction : function(json){//调用删除服务
		summer.showProgress({
			"title" : "加载中..."
		});
		$service.callAction({
			"viewid" : "com.sunnercn.medicine.LoimiaApplyController", //后台带包名的Controller名
			"action" : "loimiaDelete", //方法名,
			"params" : json, //自定义参数
			"callback" : "loimiaDeletecallBack()", //请求回来后执行的ActionID
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
	
	openPhoto : function() {//打开相机
		$camera.open({
			"bindfield" : "image",
			"compressionRatio" : "0.3",
			"callback" : "openPhotoCallBack()"
		});
	},
	openAlbum : function() {//打开相册
		$camera.openPhotoAlbum({
			"compressionRatio" : 0.3,
			callback : "openAlbumCallBack()"
		});
	},
}

/*$(function(){
	$("#photo").unbind().on('click',function() {//拍照
		$("#photo_select").hide();
		loimiaInfo.openPhoto();
	});
	$("#album").unbind().on('click',function() {//相册
		$("#photo_select").hide();
		loimiaInfo.openAlbum();
	});
});*/
	


function loimiaDeletecallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		loimiaInfo.init();
		$("#body_loimiaInfo").val("");
		$("#body_picture").attr("src","");
		loimiaInfo.setStatus(true);
		loimiaInfo.type="0";
		$(".disable").attr("disabled", false);//不可编辑
	}else{
		alert("删除失败"+args.message);
	}	
}

function loimiaUpdatecallBack(args){
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		loimiaInfo.init(data);
		loimiaInfo.setStatus(false); //true 显示取消、保存，隐藏编辑、删除
		loimiaInfo.type="0"; //设置为新增状态
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("修改失败" + args.message);
	}
}

function loimiaAddcallBack(args){
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		loimiaInfo.init(data);
		$("#body_loimiaInfo").attr("pk_loimia_info",data.pk_loimia_info);//疫情pk
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("保存失败" + args.message);
	}
}

function loimiaInitcallBack(args) {
	summer.hideProgress();
	if (args.status == "0") {
		loimiaInfo.initPage(args.data);
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("初始化失败" + args.message);
	}
}

function erresg(args) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(args));
}


function openPhotoCallBack(args){
	loimiaInfo.image = args.compressImgPath;
	$("#body_picture").attr("src", loimiaInfo.image);//疫情图片
}


function openAlbumCallBack(args) {
	loimiaInfo.image = args.compressImgPath;
	$("#body_picture").attr("src", loimiaInfo.image);//疫情图片
}

