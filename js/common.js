/*
* 服务地址http://172.20.4.101:9939/cpu-ma/
 远程调试端口 8839
* */

/*********************************** Global Variable&&Constant Define ***********************************/
var G_Obsolete_API = "此API为全局function，为避免命名冲突污染，即将废弃 --by gct，请使用新的API:";

(function(w){
	/********************* class declare *****************************/
	var c = function(){
	}
	//====================内部方法
	//获取用户信息
	function getAuth() {
		//  ||后边是第一次登录之后信息的临时存储，为方便公用
		var userinfo = summer.getStorage("userinfo");
		if ( !userinfo ){
			return "";
		}
		var u_logints = userinfo.u_logints;
		var u_usercode = userinfo.u_usercode;
		var tenantid = userinfo.tenantid;
		var token = userinfo.token;
		var auth = "u_logints="+u_logints+";u_usercode="+ u_usercode+";token="+token+";tenantid="+tenantid;
		return auth;
	}
	
	//====================接口定义
	//请求接口
	c.prototype.ajaxRequest = function(url, method, content, bodyParam, callBack,error) {
		//var common_url='http://10.11.67.56:9999/cpu-ma/'
		var common_url='http://172.20.4.101:9939/cpu-ma/'
		var headers = {};
		if (content != null){
			if(typeof content == "string"){
				headers["Content-Type"] = content;
			}else if(typeof content == "object"){
				headers = content;
			}
		}
		var auth = getAuth();
		if(auth){
			headers["Authority"] = auth;
		}

		if (!error){
			error = function(response){
				console.log(response.status);
				alert("状态："+response.status+"\n错误："+response.error);
			}
		}
		summer.ajax({
			type : method.toLowerCase(),
			url : common_url+url,
			param : bodyParam,
			header : headers
		},function(response){
			 callBack(JSON.parse(response.data));
		},function(response){
			error(response);
		})
		
	}
	
	//自定义弹窗
	c.prototype.toast = function(msg,flag){
		if(msg==undefined || msg==""){
			return false;
		}
		if($("#jqAlert").length>0){
			return false;
		}
		$("<div id='jqAlert'><div>"+msg+"</div></div>").appendTo("body");
		if(flag!=undefined){
			$("#jqAlert").prepend("<p class='check icon icon-check'></p>");
			$("#jqAlert .check").css({
				"line-height":"60px",
				"color":"#fff",
				"font-size":"64px",
				"text-align":"center"
			});
			$("#jqAlert").css({"border-radius":"8px"});
		}else{
			$("#jqAlert").css({"border-radius":"5px"});
		}
		$("#jqAlert").css({
			"background-color":"rgba(0,0,0,0.6)",
			"color":"#fff",
			"opacity":0,
			"text-align":"center",
			"font-size":"16px",
			"padding":"10px 20px",
			"max-width":"80%",
			"position":"fixed",
			"z-index":999,
			"left":"50%",
			"top":"50%",
			"-webkit-transform":"translate(-50%,-50%)",
			"transform":"translate(-50%,-50%)",
			"margin-top":"20px"
		}).animate({marginTop:0,opacity:1},'fast');
		setTimeout(function(){
			$("#jqAlert").animate({marginTop:"30px",opacity:0},'fast',function(){
				$(this).remove();
			});
		},1500);
	}
	
	//SHA1加密算法
	c.prototype.SHA1 = function (msg) {
		function rotate_left(n, s) {
			var t4 = ( n << s ) | (n >>> (32 - s));
			return t4;
		};
		function lsb_hex(val) {
			alert("lsb_hex() is called in common.js");
			var str = "";
			var i;
			var vh;
			var vl;

			for (i = 0; i <= 6; i += 2) {
				vh = (val >>> (i * 4 + 4)) & 0x0f;
				vl = (val >>> (i * 4)) & 0x0f;
				str += vh.toString(16) + vl.toString(16);
			}
			return str;
		};

		function cvt_hex(val) {
			var str = "";
			var i;
			var v;

			for (i = 7; i >= 0; i--) {
				v = (val >>> (i * 4)) & 0x0f;
				str += v.toString(16);
			}
			return str;
		};


		function Utf8Encode(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		};

		var blockstart;
		var i, j;
		var W = new Array(80);
		var H0 = 0x67452301;
		var H1 = 0xEFCDAB89;
		var H2 = 0x98BADCFE;
		var H3 = 0x10325476;
		var H4 = 0xC3D2E1F0;
		var A, B, C, D, E;
		var temp;

		msg = Utf8Encode(msg);

		var msg_len = msg.length;

		var word_array = new Array();
		for (i = 0; i < msg_len - 3; i += 4) {
			j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
				msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
			word_array.push(j);
		}

		switch (msg_len % 4) {
			case 0:
				i = 0x080000000;
				break;
			case 1:
				i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
				break;

			case 2:
				i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
				break;

			case 3:
				i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
				break;
		}

		word_array.push(i);

		while ((word_array.length % 16) != 14) word_array.push(0);

		word_array.push(msg_len >>> 29);
		word_array.push((msg_len << 3) & 0x0ffffffff);


		for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

			for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
			for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

			A = H0;
			B = H1;
			C = H2;
			D = H3;
			E = H4;

			for (i = 0; i <= 19; i++) {
				temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 20; i <= 39; i++) {
				temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 40; i <= 59; i++) {
				temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 60; i <= 79; i++) {
				temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			H0 = (H0 + A) & 0x0ffffffff;
			H1 = (H1 + B) & 0x0ffffffff;
			H2 = (H2 + C) & 0x0ffffffff;
			H3 = (H3 + D) & 0x0ffffffff;
			H4 = (H4 + E) & 0x0ffffffff;

		}

		var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

		return temp.toLowerCase();

	}
	
	w.common = new c();
})(window)


/*********************************** Global method Define ***********************************/

//请求接口
function ajaxRequest(url, method, content, bodyParam, callBack,error) {
    return common.ajaxRequest(url, method, content, bodyParam, callBack,error);
}

//SHA1加密算法
function SHA1(msg) {
	alert(G_Obsolete_API + ",请使用common.SHA1()");
	return common.SHA1(msg);
}

//自定义弹窗
function jqAlert(msg,flag){
	alert(G_Obsolete_API + ",请使用common.toast()");
	return common.toast(msg,flag)
}


(function(summer,com){
	//define cacheManager object
	if(!common) common = {};
	common.cacheManager = {
		_duration: 30000,
		setCache: function(key, data, duration){
			try{
				var _obj = {
					data: data,
					tenantid: common.G_CurUserInfo.tenantid,
					usercode: common.G_CurUserInfo.u_usercode,
					level: "",
					datetime: (new Date()).getTime(),
					duration: duration || this._duration
				}
				summer.setStorage(key, _obj);
			}catch(e){
				alert("ERR100:setCache出错了\n" + e);
			}
		},
		getCache: function(key){
			try{
				var old = null;//旧数据
				try{
					old = summer.getStorage(key);
				}catch(e){
					alert("ERR104:缓存数据转json出错了,\n仅支持json数据缓存\n" + e);
					return null;
				}
				if(old == null) return;
				var tid = old.tenantid;
				var ucode = old.usercode;
				if(tid == common.G_CurUserInfo.tenantid && ucode == common.G_CurUserInfo.u_usercode){
					var oldT = old.datetime;
					var dur = old.duration;
					if((new Date()).getTime() - parseInt(oldT) <= parseInt(dur)){
						return old.data;
					}else{
						summer.rmStorage(key);
						return null;
					}
				}else{
					//缓存数据不是当前租户下当前用户的缓存
					return null;
				}
			}catch(e){
				alert("ERR103:getCache出错了\n" + e);
			}
		}
	}
})(summer,common);

summer.on('init', function () {
	try{
		common.G_CurUserInfo = summer.getStorage("userinfo");
	}catch (e){
		alert(e);
	}

})