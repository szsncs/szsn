summerready = function() {
	$service.writeConfig({
		"host" : "192.168.201.142", //向configure中写入host键值
		"port" : "8869"//向configure中写入port键值
	});
}


var image;
var image2;
function pic() {
	$camera.open({
		"bindfield" : "image",
		"compressionRatio" : "0.3",
		"callback" : function(args) {
			$alert(args.compressImgPath);
			image2 = args.compressImgPath;
		}
	});
}

function open11() {
	$alert("1");
	$camera.openPhotoAlbum({
		"compressionRatio" : 0.8,
		callback : "mycb33()"
	});
}

function mycb33(args) {
	image2 = arrgs.imgPath;
}

function up() {
	$alert(image2);
	$service.callAction({
		"viewid" : "com.yonyou.example.ReturnStrController", //后台带包名的Controller名
		"action" : "Return", //方法名,
		"params" : "{a:1, b:2}", //自定义参数，json格式
		"mauploadpath" : image2,
		"autoDataBinding" : false, //请求回来的数据会在Context中，是否进行数据绑定，默认不绑定
		"contextmapping" : "filedNameOrFieldPath", //将返回结果映射到指定的Context字段上，支持fieldName和xx.xxx.fieldName字段全路径，如未指定contextmapping则替换整个Context
		"callback" : "ok()", //请求成功后回调js方法
		"error" : "error()"//请求失败回调的js方法
	});
}

function ok(arrgs) {
	$alert(arrgs.test);
	if (arrgs.test) {
		$('.pic').attr('src', arrgs.test);
	} else {
		$alert("无base64");
	}
}

function toNC() {
	$service.callAction({
		"viewid" : "com.yonyou.example.ReturnStrController", //后台带包名的Controller名
		"action" : "uploadimg", //方法名,
		"params" : "{a:1, b:2}", //自定义参数，json格式
		"mauploadpath" : image2,
		"autoDataBinding" : false, //请求回来的数据会在Context中，是否进行数据绑定，默认不绑定
		"contextmapping" : "filedNameOrFieldPath", //将返回结果映射到指定的Context字段上，支持fieldName和xx.xxx.fieldName字段全路径，如未指定contextmapping则替换整个Context
		"callback" : "toNCok()", //请求成功后回调js方法
		"error" : "error()"//请求失败回调的js方法
	});
}

function toNCok() {
	$alert("上传NC成功");
}

function toMAok(arrgs) {
	if (arrgs.test) {
		$('.pic').attr('src', arrgs.test);
	} else {
		$alert("无base64");
	}
}

function toMA() {
	$service.callAction({
		"viewid" : "com.yonyou.example.ReturnStrController", //后台带包名的Controller名
		"action" : "downloadimg", //方法名,
		"params" : "{a:1, b:2}", //自定义参数，json格式
		"mauploadpath" : image2,
		"autoDataBinding" : false, //请求回来的数据会在Context中，是否进行数据绑定，默认不绑定
		"contextmapping" : "filedNameOrFieldPath", //将返回结果映射到指定的Context字段上，支持fieldName和xx.xxx.fieldName字段全路径，如未指定contextmapping则替换整个Context
		"callback" : "toMAok()", //请求成功后回调js方法
		"error" : "error()"//请求失败回调的js方法
	});
}

function error(arrgs) {
	$alert("error:" + arrgs.err_msg);
}