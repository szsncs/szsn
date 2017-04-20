/*全局变量生命区*/
/*存放图片路径*/


summerready = function() {
	loimian.init();
	loimian.bindEvent();
}
var loimian = {
	g_pathArr : [],
	viewid : "com.sunnercn.medicine.LoimiaApplyController",
	bindEvent : function() {//绑定事件
		$("#plus").click(function(){
			UM.actionsheet({
		        title: '选择照片',
		        items: [ '拍照','从图库中选择'],
		        callbacks: [loimian.openCamera,loimian.openAlbum]
		    });
		})
		
		$("#header_back").click(function() {//返回
			alert("1");
			summer.closeWin();
		});
		$("#header_photo").click(function() {//拍照按钮
			//点击显示/隐藏，再点击隐藏/显示
			loimian.openPhoto();
		});
		$(".body_page").click(function(){
			$("#photo_select").hide();
		});
		//保存按钮
		$("#bottom_submit").click(function() {
			loimian.update();
		});
		//取消按钮
		$("#bottom_cancel").click(function() {
			var bool = $confirm("您确定取消编辑吗？");
			if (bool) {
				loimian.setStatus(false);
			}
		});
		//编辑按钮
		$("#bottom_update").click(function() {
			//可编辑
			$(".disable").attr("disabled", false);
			loimian.setStatus(true);
			loimian.type = "1";
		});
		//删除按钮
		$("#bottom_delete").click(function() {
			var bool = $confirm("您确定要删除吗？");
			if (bool) {
				loimian.delete();
			}
		});
	},
	setPage : function(){//设置页面
		$("#question").on("input propertychange",function(){
	        var length = $(this).val().length;
	        $('#txtShow').text(length+'/200');
	    });
	    var plus = $("#ibox .con-con .font");
	    var phei = plus.parent().width()-2;
	    var pwid = plus.parent().width()-2;
	    plus.css({"width":pwid,"height":phei});
	},
	init : function() {
		loimian.initPage();
		if(summer.pageParam.type){
			if(summer.pageParam.type==="1"){
				//加载历史表头鸡类信息
				loimian.initInfoLoad();
			}else{
				loimian.initLoadData();
			}
		}
	},
	initInfoLoad : function(){//详情初始化
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		var date=summer.pageParam.date;
		var batch=summer.pageParam.batch;
		var json = {
			date:date,
			batch:batch,
			logininfo : lonininfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(loimian.viewid,"loimiaInit",json,"loimiaInitcallBack");
	},
	initLoadData : function(){//新增初始化
		loimian.initPage();
	},
	initPage : function() {
		loimian.setPage();
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);
		$("#body_henner_name").text(lonininfo.henneryinfo.hennery_name);//鸡场名称
		$("#body_henner_name").attr("pk_hennery",lonininfo.henneryinfo.pk_hennery);//鸡场pk
		$("#body_create_date").text(getNowFormatDate());//填报日期
		$("#body_batch").text(lonininfo.henneryinfo.batch);//批次号
		$("#body_days").text(lonininfo.henneryinfo.days);//日龄
	},
	save : function() {//判断保存是提交还是修改
		if("0"==loimian.type){
			loimian.submit();//新增保存
		}else{
			loimian.update();//修改保存
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
		callActionContainsFile(loimian.viewid,"loimiaAdd",loimian.image,json,"loimiaAddcallBack");
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
		loimian.updateCallAction(json);
	},
	updateCallAction : function(json){//调用修改服务
		summer.showProgress({
			"title" : "加载中..."
		});
		callActionContainsFile(loimian.viewid,"loimiaUpdate",loimian.image,json,"loimiaUpdatecallBack");
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
		callAction(loimian.viewid,"loimiaDelete",json,"loimiaDeletecallBack");
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
	openCamera : function(){
		summer.openCamera({
        compressionRatio : 0.5,
        callback : function(args){
            var imgPath = args.compressImgPath;
            loimian.g_pathArr.push(imgPath);
            var picDiv='<div class="con">'
                +'<div class="con-con">'
                +'<img src="'+imgPath+'">'
                +'<img src="../../img/close.png" class="close" onClick="closePic(this);">'
                +'</div></div>';
            $("#plus").before(picDiv);
            var len=$("#ibox .con").length-1;
            $('#picShow').text(len+'/8');
            if(len==8){
                $("#plus").addClass("none");
            }
        }
    })
	},
	openAlbum : function(){
		summer.openPhotoAlbum({
        compressionRatio : 0.5,
        callback : function (args){
            var imgPath = args.compressImgPath;
            loimian.g_pathArr.push(imgPath);
            var picDiv='<div class="con">'
                +'<div class="con-con">'
                +'<img src="'+imgPath+'">'
                +'<img src="../../img/close.png" class="close" onClick="closePic(this);">'
                +'</div></div>';
            $("#plus").before(picDiv);
            var len=$("#ibox .con").length-1;
            $('#picShow').text(len+'/8');
            if(len==8){
                $("#plus").addClass("none");
            }
        }
    });
	},
}
function closePic(obj){
    var src=$(obj).prev("img").attr("src");
    loimian.g_pathArr.remove(src);
    $(obj).parent().parent(".con").remove();
    var len=$("#ibox .con").length-1;
    $('#picShow').text(len+'/4');
    $("#plus").removeClass("none");
}

//此处为友人才专用upload， 带参数和header的请求,上传图片
function uploadHr(){
    var question=$.trim($("#question").val());
    if(question==""){
        common.toast("问题不能为空");
        return false;
    }
    summer.showProgress({
        title :'加载中...'
    });
    save("");
    /*if(!loimian.g_pathArr||loimian.g_pathArr.length<1){//判断是否选取图片，没有选取图片，不用上传
        save("");
    }else{
        //用户验证字段
        var userinfo = JSON.parse(localStorage.getItem("userinfo"));
        var u_logints = userinfo.u_logints;
        var u_usercode = userinfo.u_usercode;
        var tenantid = userinfo.tenantid;
        var token = userinfo.token;
        var auth = "u_logints="+u_logints+";u_usercode="+ u_usercode+";token="+token+";tenantid="+tenantid;
        var random = createUUID();
        //多图文上传方法调用,i和num是用来判断是否是最后一个，是否进行内容的保存
        for(var i=0,length=loimian.g_pathArr.length;i<length;i++){
            manyfileupload({
                random:random,
                fileURL:loimian.g_pathArr[i],
                auth:auth,
                num:length,
                i:(i+1)
            });
        }
    }*/
}
function loimiaDeletecallBack(args){//删除回调
	summer.hideProgress();
	if(args.status == "0"){
		lastPageRefresh("refresh","medicine","loimialist");
		summer.closeWin();
	}else{
		alert("删除失败"+args.message);
	}	
}

function loimiaUpdatecallBack(args){//修改回调
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		loimian.init(data);
		loimian.setStatus(false); //true 显示取消、保存，隐藏编辑、删除
		loimian.type="0"; //设置为新增状态
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("修改失败" + args.message);
	}
}

function loimiaInitcallBack(args) {//初始化回调
	summer.hideProgress();
	if (args.status == "0") {
		loimian.initPage(args.data);
	} else {
		alert("初始化失败" + args.message);
	}
}

function erresg(args) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(args));
}

function manyfileupload(obj){//多图文上传方法
    var fileURL = obj.fileURL;
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    var headers={'Authority':obj.auth};
    var params = {};
    params.filepath = obj.random;
    params.groupname = "question";
    params.url = "true";
    params.permission = "read";

    options.headers = headers;
    options.params = params;
    options.httpMethod = "POST";
    var ft = new FileTransfer();
    var SERVER = upload_url+"file/upload"
    ft.upload(fileURL, encodeURI(SERVER), function(ret){
        if(obj.num==obj.i){
            save(params.filepath);
        }
    }, function(err){
        summer.hideProgress();
        common.toast("失败"+ JSON.stringify(err));
    }, options);
}

function save(filepath){//保存提问
    var question=$.trim($("#question").val());
    var askJson={
        "question":question,
        "filepath":filepath
    };
    var url="usercenter/feedback";
    common.ajaxRequest(url,"post","application/x-www-form-urlencoded",askJson,function(data){
        if(data.status=='success'){
            common.toast("提交成功",true);
            setTimeout(function(){
                summer.closeWin();
            },2000);
        }else{
            common.toast('提交失败');
        }
        summer.hideProgress();
    });
}
//关闭win
function closeWin(){
    summer.closeWin();
}
//数组新增remove方法
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};