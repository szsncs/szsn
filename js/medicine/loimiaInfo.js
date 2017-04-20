
summerready = function() {
	loimian.type=summer.pageParam.type;
	loimian.init();
	loimian.bindEvent();
}

var loimian = {
	g_pathArr : [],
	pk_file : [],
	viewid : "com.sunnercn.medicine.LoimiaApplyController",
	type : "0",
	bindEvent : function() {//绑定事件
		$("#plus").click(function(){
			loimian.actionsheet();
		    loimian.plusImg();
		})
			
		setInterval("loimian.plusImg();",500);
			
		//动态绑定 
		$(".select_type").unbind().on("change",function(){
			var tag=$(this).attr("tag");
			var id="#illness_list";
			if($("#illness_type0").val()=="请选择" || tag=="0"  ){
				$("#illness_list1").show();
				$("#illness_list2").hide();
			}else if(tag=="1"){
				$("#illness_list2").show();
			}else{
				return;
			}
			loimian.changeSelect(id,tag);
		});
		
		$(".hennery_tital").click(function(){
			//$(".hennery_tital").find("i").attr("class","um-listgroup-collapsed");
			$(this).next().stop().slideToggle(400);
		})
		$(".loimia_tital").click(function(){
			$(this).next().stop().slideToggle(400);
		})
		$(".loimia_photo").click(function(){
			$(this).next().stop().slideToggle(400);
		})
		
		$("#header_back").click(function() {//返回
			lastPageRefresh("refresh","medicine","loimialist");
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
			loimian.save();
		});
		//取消按钮
		$("#bottom_cancel").click(function() {
			var bool = $confirm("您确定取消编辑吗？");
			if (bool) {
				if(loimian.type == "0"){
					lastPageRefresh("refresh","medicine","loimialist");
					summer.closeWin();
				}else{
					//取消编辑 要刷新
					loimian.initInfoLoadCallAction();
					loimian.setStatus(false);
				}
			}
		});
		//编辑按钮
		$("#bottom_update").click(function() {
			//可编辑
			$(".disable").attr("disabled",false);
			//显示删除按钮
			$(".close").show();
			$("#plus").show();
			loimian.g_pathArr=[];
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
	actionsheet : function(){
		UM.actionsheet({
	        title: '选择照片',
	        items: [ '拍照','从图库中选择'],
	        callbacks: [loimian.openCamera,loimian.openAlbum]
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
		if(loimian.type==="1"){
			//加载历史表头鸡类信息
			loimian.initInfoLoadCallAction();
		}else{
			//新增初始化
			loimian.initLoad();
		}
	},
	initInfoLoadCallAction : function(){//详情初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		if(summer.pageParam.pk_loimia_info){
			loimian.pk_loimia_info=summer.pageParam.pk_loimia_info
		}else{
			loimian.pk_loimia_info=$("#body_batch").attr("pk_loimia_info");//疫情pk
		}
		var billinfo = {
			pk_loimia_info : loimian.pk_loimia_info,
		}
		var json = {
			logininfo : logininfo,
			billinfo : billinfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(loimian.viewid,"loimiaInfoInit",json,"loimiaInitcallBack");
	},
	infoLoadData : function(data){//详情初始化成功回调加载数据
		var billinfo=data.billinfo;//后台传入数据
		loimian.initSelect();//鸡舍
		$("#body_num").val(billinfo.illness_num);//病变数量
		$("#body_henner_name").text(billinfo.hennery_name);//从缓存里获取鸡场名称
		$("#body_create_date").text(billinfo.create_date);//填报日期
		$("#body_batch").text(billinfo.batch);//批次号
		$("#body_days").text(billinfo.days);//日龄
		$("#question").text(billinfo.info);//疫情描述
		
		
		//设置疫情描述长度
		 var length = billinfo.info.length;
         $('#txtShow').text(length+'/200');
		
		var pk_henhouse=billinfo.pk_henhouses;
		var pk_henhouses=pk_henhouse.split(',');
		for(var i=0;i<pk_henhouses.length;i++){
			$("#"+pk_henhouses[i]).attr("selected","selected");
		}
		//构建病变情况（一级）
		loimian.append(data.illness_item1,0);
		//赋值，存全局
		$("#illness_type0").val(billinfo.illness_name1);
		loimian.item1=data.illness_item1;
		if(!billinfo.pk_loimia_info){//判断按钮状态 
			loimian.setStatus(true); //true 显示取消、保存，隐藏编辑、删除
			loimian.type="0"; //设置为新增状态
			return;
		}
		loimian.setStatus(false);
		$("#body_batch").attr("pk_loimia_info",billinfo.pk_loimia_info);//疫情pk
		$("#body_batch").attr("isprescribe", billinfo.isprescribe);//开药标志
		//构建病变情况（二级）
		if(data.illness_item2){
			$("#illness_list1").show();
			loimian.append(data.illness_item2,1);
			//赋值，存全局
			$("#illness_type1").val(billinfo.illness_name2);
			loimian.item2=data.illness_item2;
		}
		//判断是否有病变情况（三级）
		if(data.illness_item3){
			$("#illness_list2").show();
			loimian.append(data.illness_item3,2);
			//构建三级
			$("#illness_type2").val(billinfo.illness_name3);
			//赋值，存全局
			loimian.item3=data.illness_item3;
		}
		if(!data.imgPath || data.imgPath.length < 1){
			alert("本条数据没有图片可供展示！")
		}
		try {
			loimian.setPicture(data.imgPath);//疫情图片
			loimian.setEditStatus();//设置编辑状态
			loimian.plusImg();
		} catch (err) {
			throw new error("图片加载失败！");
		}
	},
	plusImg : function(){
		/**
		 * add by 肖朔 
		 */
		$(".con-con img").not(".close").on("click",function(){
			loimian.imgShow("#outerdiv", "#innerdiv", "#bigimg", $(this));
		});
	},
	setEditStatus : function(){
		if(loimian.type){
			if(loimian.type==="1"){
				loimian.setStatus(false);
				//不可编辑
				$(".disable").attr("disabled",true);
				//隐藏删除按钮
				$(".close").hide();
				$("#plus").hide();
			}
		}
	},
	/**
	 *add by 肖朔 
	 */
	imgShow : function (outerdiv, innerdiv, bigimg, _this){  
	    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性  
	    $(bigimg).attr("src", src);//设置#bigimg元素的src属性  
	        /*获取当前点击图片的真实大小，并显示弹出层及大图*/  
	    $("<img/>").attr("src", src).load(function(){  
	        var windowW = $(window).width();//获取当前窗口宽度  
	        var windowH = $(window).height();//获取当前窗口高度  
	        var realWidth = this.width;//获取图片真实宽度  
	        var realHeight = this.height;//获取图片真实高度  
	        var imgWidth, imgHeight;  
	        var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放  
	          
	        if(realHeight>windowH*scale) {//判断图片高度  
	            imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放  
	            imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度  
	            if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度  
	                imgWidth = windowW*scale;//再对宽度进行缩放  
	            }  
	        } else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度  
	            imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放  
	                        imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度  
	        } else {//如果图片真实高度和宽度都符合要求，高宽不变  
	            imgWidth = realWidth;  
	            imgHeight = realHeight;  
	        }  
	        $(bigimg).css("width",imgWidth);//以最终的宽度对图片缩放  
	        var w = (windowW-imgWidth)/2;//计算图片与窗口左边距  
	        var h = (windowH-imgHeight)/2;//计算图片与窗口上边距  
	        $(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性  
	        $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
	    });  
	    $(outerdiv).click(function(){//再次点击淡出消失弹出层  
	        $(this).fadeOut("fast");  
	    });  
	},
	initLoad : function(){//新增初始化
		loimian.initPage();
		loimian.initCallAction();
	},
	initCallAction : function() {//新增初始化
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var json = {
			logininfo : logininfo,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callAction(loimian.viewid,"loimiaInit",json,"initAddcallBack");
	},
	initPage : function() {
		var data = $cache.read("logininfo");
		var lonininfo = JSON.parse(data);		
		$("#body_henner_name").text(lonininfo.henneryinfo.hennery_name);//鸡场名称
		$("#body_henner_name").attr("pk_hennery",lonininfo.henneryinfo.pk_hennery);//鸡场pk
		$("#body_create_date").text(getNowFormatDate());//填报日期
		$("#body_batch").text(lonininfo.henneryinfo.batch);//批次号
		$("#body_days").text(lonininfo.henneryinfo.days);//日龄
		loimian.initSelect();//鸡舍
		loimian.setPage();
	},
	initSelect : function(){
		var logininfostr = $cache.read("logininfo");
		var logininfo = JSON.parse(logininfostr);
		var billinfo =logininfo.henhouseinfo;
		$(".select_house").html("");
		var html='';
			for (var i = 0; i < billinfo.length; i++) {
					html+='<option value="'+billinfo[i].henhouse_name+'" style="text-align:right" id="'+billinfo[i].pk_henhouse+'">'+billinfo[i].henhouse_name+'</option>'
				};
		$(".select_house").html(html);
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
		var info=$.trim($("#question").val().replace(/[\r\n]/g,""));//疫情情况
		var illness_num=$("#body_num").val();//病变数量
		//病变名称
		var illness_item1=$("#illness_type0").val();
		var illness_item2=$("#illness_type1").val();
		var illness_item3=$("#illness_type2").val();
		//病变类型
		var pk_illness_item1=$("#illness_type0").find("option:selected").attr("id");
		var pk_illness_item2=$("#illness_type1").find("option:selected").attr("id");
		var pk_illness_item3=$("#illness_type2").find("option:selected").attr("id");
		
		//鸡舍
		var henhouses=[];
		var dummyId=$(".select_house option:selected");
		for(var i=0;i<dummyId.length;i++){
			henhouses.push(dummyId[i].getAttribute("id"));
		}
		//校验
		if(!illness_num || illness_num==""){
			alert("请填写数量！");
			return
		}else if(!pk_illness_item1 || !pk_illness_item2){
			alert("请选择病变情况！");
			return
		}
		if(!dummyId || dummyId.length<1){
			alert("请选择鸡舍！");
			return
		}
		if(""==info || !info){
			alert("请输入疫情描述");
			return;
		}
		var loimian_img=loimian.g_pathArr.toString();
		if(!loimian.g_pathArr || loimian.g_pathArr.length<1){
			alert("请上传图片！");
			return;
		}
		var billinfo = {
			illness_num : illness_num,
			illness_item1 : illness_item1,
			illness_item2 : illness_item2,
			illness_item3 : illness_item3,
			pk_illness_item1 : pk_illness_item1,
			pk_illness_item2 : pk_illness_item2,
			pk_illness_item3 : pk_illness_item3,
			info : info,
			henhouses : henhouses.toString()
		}
		var json = {
			logininfo : logininfo,
			billinfo : billinfo,
			imgInfo : loimian.g_pathArr,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callActionContainsFile(loimian.viewid,"loimiaAdd",loimian_img,json,"loimiaAddcallBack");

	},
	update : function() {//修改
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);
		var pk_loimia_info=$("#body_batch").attr("pk_loimia_info");//疫情pk
		var info=$.trim($("#question").val().replace(/[\r\n]/g,""));//疫情情况
		var illness_num=$("#body_num").val();//病变数量
		//病变名称
		var illness_item1=$("#illness_type0").val();
		var illness_item2=$("#illness_type1").val();
		var illness_item3=$("#illness_type2").val();
		//病变类型
		var pk_illness_item1=$("#illness_type0").find("option:selected").attr("id");
		var pk_illness_item2=$("#illness_type1").find("option:selected").attr("id");
		var pk_illness_item3=$("#illness_type2").find("option:selected").attr("id");
		var henhouses=[];
		var dummyId=$(".select_house option:selected");
		for(var i=0;i<dummyId.length;i++){
			henhouses.push(dummyId[i].getAttribute("id"));
		}
		//校验
		if(!illness_num || illness_num==""){
			alert("请填写数量！");
		}else if(!pk_illness_item1 || !pk_illness_item2){
			alert("请选择病变情况！");
		}
		if(""==info || !info){
			alert("请输入疫情描述");
			return;
		}
		var loimian_img=loimian.g_pathArr.toString();
		var billinfo = {
			illness_num : illness_num,
			illness_item1 : illness_item1,
			illness_item2 : illness_item2,
			illness_item3 : illness_item3,
			pk_illness_item1 : pk_illness_item1,
			pk_illness_item2 : pk_illness_item2,
			pk_illness_item3 : pk_illness_item3,
			info : info,
			pk_loimia_info : pk_loimia_info,
			henhouses : henhouses.toString()
		}
		var json = {
			logininfo : logininfo,
			billinfo : billinfo,
			pk_files : loimian.pk_file,
		}
		summer.showProgress({
			"title" : "加载中..."
		});
		callActionContainsFile(loimian.viewid,"loimiaUpdate",loimian_img,json,"loimiaUpdatecallBack");
	},
	delete : function() {//删除
		var data = $cache.read("logininfo");
		var logininfo = JSON.parse(data);		
		var pk_loimia_info=$("#body_batch").attr("pk_loimia_info");//疫情pk
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
	initFirstSelect : function(data) {//新增初始化成功回调加载一级下来选数据
		var illness_item1 = data.illness_item1;
		$("#body_create_date").val(data.create_date);
		$("#illness_type0").html("");
		var html = '<option value="请选择" id="" name="">请选择</option>'
		for (var i = 0; i < illness_item1.length; i++) {
			html+='<option value="'+illness_item1[i].illness_item1+'" '
			+'id="'+illness_item1[i].pk_illness_item1+'" name="">'+illness_item1[i].illness_item1+'</option>'
		}	
		$("#illness_type0").html(html);
	},
	changeSelect : function(id,tag){//下级下拉选初始化
		var illness_item=$(id+tag).find("option:selected").attr("id");
		var json = {
			illness_item : illness_item,
			tag : tag
		}
		callAction(loimian.viewid,"getChildren",json,"changeSelectcallBack");
	},
	append : function(billinfo,no){
		$("#illness_type"+no).html("");
		var html = '<option value="请选择" id="" name="">请选择</option>'
		for (var i = 0; i < billinfo.length; i++) {
			html+='<option value="'+billinfo[i].illness_item+'" '
			+'id="'+billinfo[i].pk_illness_item+'" name="">'+billinfo[i].illness_item+'</option>'
		}	
		$("#illness_type"+no).html(html);
	},
	setPicture : function(imgPath){ //填充图片
		$(".img_con").remove();
		var picDiv='';
		for(var i=0;i<imgPath.length;i++){
			picDiv+='<div class="con  img_con">'
			+'<div class="con-con">'
            +'<img  src="'+imgPath[i].img_path+'">'
            +'<img src="../../img/close.png" class="close  img_file" pk_file="'+imgPath[i].pk_file+'"'
            +' onClick="closePic(this);">'
            +'</div></div>';
		}
		$("#plus").before(picDiv);
		
		
		var plus = $("#ibox .con-con .font");
		var close = $(".close");
		var img = $("#ibox img");
	    var phei = 80;
	    var pwid = 80;
	    img.css({"width":80,"height":80});
	    close.css({"width":21,"height":21});
	    plus.css({"width":pwid,"height":phei});
		
		var len=$("#ibox .con").length-1;
        $('#picShow').text(len+'/8');
        if(len==8){
            $("#plus").addClass("none");
        }
	},
	openCamera : function(){
		summer.openCamera({
	        compressionRatio : 0.5,
	        callback : function(args){
            var imgPath = args.compressImgPath;
		    loimian.g_pathArr.push(imgPath);
            var picDiv='<div class="con  img_con">'
                +'<div class="con-con">'
                +'<img  src="'+imgPath+'">'
                +'<img src="../../img/close.png" class="close  img_file" onClick="closePic(this);">'
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
	openAlbum : function(){
		summer.openPhotoAlbum({
		    compressionRatio : 0.5,
		    callback :  function (args){
            var imgPath = args.compressImgPath;
		   loimian.g_pathArr.push(imgPath);
            var picDiv='<div class="con  img_con">'
                +'<div class="con-con">'
                +'<img  src="'+imgPath+'">'
                +'<img src="../../img/close.png" class="close  img_file" onClick="closePic(this);">'
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


function initAddcallBack(args) {//新增初始化回调函数
	summer.hideProgress();
	if (args.status == "0") {
		loimian.initFirstSelect(args.data);
	} else {
		alert("初始化失败：" + args.message);
		summer.closeWin();
	}
}
function changeSelectcallBack(args){
	if(!args.data){
		$("#illness_list2").hide();
		return;
	}
	var illness_item2=args.data.illness_item2;
	var illness_item3=args.data.illness_item3;
	if(illness_item2){
		loimian.append(illness_item2,1);
	}else if(illness_item3){
		loimian.append(illness_item3,2);
	}
}
function closePic(obj){
	UM.confirm({
	    title: '友情提示：',
	    text: '您确定要删除图片吗？',
	    btnText: ["取消", "确定"],
	    overlay: true,
	    ok: function () {
	        var src=$(obj).prev("img").attr("src");
	        var pk_file=$(obj).prev("img").next().attr("pk_file");
	        
	        loimian.pk_file.push(pk_file);
		    loimian.g_pathArr.remove(src);
		    
		    $(obj).parent().parent(".con").remove();
		    var len=$("#ibox .con").length-1;
		    $('#picShow').text(len+'/8');
		    $("#plus").removeClass("none");
	    },
	    cancle: function () {
	      return;  
		}
	});
}

function loimiaDeletecallBack(args){//删除回调
	summer.hideProgress();
	if(args.status == "0"){
		alert("删除成功");
		lastPageRefresh("refresh","medicine","loimialist");
		summer.closeWin();
	}else{
		alert("删除失败"+args.message);
		lastPageRefresh("refresh","medicine","loimialist");
		summer.closeWin();
	}	
}

function loimiaAddcallBack(args){//保存成功回调
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		alert("保存成功");
		loimian.type="1";
		loimian.setStatus(false);//显示编辑，取消		
		$("#body_batch").attr("pk_loimia_info",data.pk_loimia_info);//疫情pk
		loimian.initInfoLoadCallAction();
	} else {
		alert("保存失败" + args.message);
		lastPageRefresh("refresh","medicine","loimialist");
		summer.closeWin();
	}
}

function loimiaUpdatecallBack(args){//修改回调
	summer.hideProgress();
	var data=args.data
	if (args.status == "0") {
		loimian.initInfoLoadCallAction();
		loimian.setStatus(false); //显示编辑，取消
		alert("修改成功");
		$(".disable").attr("disabled", true);//不可编辑
	} else {
		alert("修改失败" + args.message);
		lastPageRefresh("refresh","medicine","loimialist");
		summer.closeWin();
	}
}

function loimiaInitcallBack(args) {//详情初始化回调
	summer.hideProgress();
	if (args.status == "0") {
		loimian.infoLoadData(args.data);
	} else {
		alert("初始化失败" + args.message);
		lastPageRefresh("refresh","medicine","loimialist");
		summer.closeWin();
	}
}

function erresg(args) {
	summer.hideProgress();
	alert("系统运行异常" + JSON.stringify(args));
	lastPageRefresh("refresh","medicine","loimialist");
	summer.closeWin();
}


function indexOf(val){
	for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
}
function remove(val){
	var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
}
