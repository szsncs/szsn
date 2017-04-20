summerready = function() {
	loimiaInfo.init();
	loimiaInfo.bindEvent();
}
var loimiaInfo = {
	image : "", //图片路径
	status : true, //判断编辑状态
	type : "0", //传入详情页面状态  1为详细状态  0为初始状态
	viewid : "com.sunnercn.medicine.LoimiaApplyController",
	bindEvent : function() {//绑定事件
		$("#header_back").click(function() {//返回
			lastPageRefresh("refresh","medicine","loimialist");
			summer.closeWin();
		});
		$("#header_photo").click(function() {//拍照按钮
			//点击显示/隐藏，再点击隐藏/显示
			loimiaInfo.openPhoto();
		});
		
		$(".click_body").click(function() {//拍照按钮
			//点击显示/隐藏，再点击隐藏/显示
			$("#photo_select").hide();
		});
		
		$(".body_page").click(function(){
			$("#photo_select").hide();
		});
		//保存按钮
		$("#bottom_submit").click(function() {
			loimiaInfo.save();
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
	cameraBtn : function(){
		$("#photo").on('click',function() {//拍照
			$("#photo_select").hide();
			loimiaInfo.openPhoto();
		});
		
		$("#album").on('click',function() {//相册
			$("#photo_select").hide();
			loimiaInfo.openAlbum();
		});
	},
	init : function() {
		loimiaInfo.initPage()
	},
	initPage : function() {
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		$("#body_henner_name").text(lonininfo.henneryinfo.hennery_name);//鸡场名称
		$("#body_henner_name").attr("pk_hennery",lonininfo.henneryinfo.pk_hennery);//鸡场pk
		$("#body_create_date").text(getNowFormatDate());//填报日期
		$("#body_batch").text(lonininfo.henneryinfo.batch);//批次号
		$("#body_days").text(lonininfo.henneryinfo.days);//日龄
	},
	save : function() {//判断保存是提交还是修改
		if("0"==loimiaInfo.type){
			loimiaInfo.submit();//新增保存
		}else{
			loimiaInfo.update();//修改保存
		}
	},
	submit : function() {//提交
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var info=$("#body_loimiaInfo").val();//疫情情况
		if(!info){
			info="";
		}
		var loimia_img=$("#body_picture").attr("src");//疫情图片
		if(""==loimia_img || !loimia_img){
			alert("请上传图片！");
			return;
		}
		var billinfo = {
			info : info,
			loimia_img : loimia_img,
		}
		var json = {
			logininfo : logininfo,
			billinfo : billinfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callActionContainsFile(loimiaInfo.viewid,"loimiaAdd",loimiaInfo.image,json,"loimiaAddcallBack");
	},
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
		loimiaInfo.updateCallAction(json);
	},
	updateCallAction : function(json){//调用修改服务
		summer.showProgress({
			"title" : "加载中..."
		});
		callActionContainsFile(loimiaInfo.viewid,"loimiaUpdate",loimiaInfo.image,json,"loimiaUpdatecallBack");
	},
	delete : function() {//删除
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
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(loimiaInfo.viewid,"loimiaDelete",json,"loimiaDeletecallBack");
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
			"callback" : function(args){
				loimiaInfo.image = args.compressImgPath;
				$("#body_picture").attr("src", loimiaInfo.image);//疫情图片
			}
		});
	},
	openAlbum : function() {//打开相册
		$camera.openPhotoAlbum({
			"compressionRatio" : "0.3",
			callback : function(args){
				loimiaInfo.image = args.compressImgPath;
				$("#body_picture").attr("src", loimiaInfo.image);//疫情图片
			}
		});
	},
}
function loimiaDeletecallBack(args){
	summer.hideProgress();
	if(args.status == "0"){
		/*loimiaInfo.init();
		$("#body_loimiaInfo").val("");
		$("#body_picture").attr("src","");
		loimiaInfo.setStatus(true);
		loimiaInfo.type="0";
		$(".disable").attr("disabled", false);//不可编辑*/
		lastPageRefresh("refresh","medicine","loimialist");
		summer.closeWin();
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
		loimiaInfo.setStatus(false);//显示编辑，取消		
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
		loimiaInfo.initPage();
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

