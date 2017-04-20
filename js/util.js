/**
 * 调用接口方法 对$summer.callAction({})的封装 
 * @param {Object} viewid
 * 			后台带包名的Controller名
 * @param {Object} action
 * 			方法名
 * @param {Object} params
 * 			自定义参数
 * @param {Object} callback
 * 			成功回调函数
 */
function callAction(viewid,action,params,callback){
	$service.callAction({
		"viewid" : viewid, //后台带包名的Controller名
		"action" : action, //方法名
		"params" : params, //自定义参数
		"callback" : callback+"()", //成功回调函数
		"error" : "erresg()",//失败回调函数
		"timeout":"40"//超时40s
	});
}
/**
 * 调用接口方法 对$summer.callAction({})的封装 
 * @param {Object} viewid
 * 			后台带包名的Controller名
 * @param {Object} action
 * 			方法名
 * @param {Object} filepath
 * 			文件路径
 * @param {Object} params
 * 			自定义参数
 * @param {Object} callback
 * 			成功回调函数
 */
function callActionContainsFile(viewid,action,filepath,params,callback){
	$service.callAction({
		"viewid" : viewid, //后台带包名的Controller名
		"action" : action, //方法名,
		"mauploadpath" : filepath,
		"params" : params, //自定义参数
		"callback" : callback+"()", //请求回来后执行的ActionID
		"error" : "erresg()",//失败回调的ActionId
		"timeout":"40"//超时40s
	});
}

/**
 * 关闭刷新方法
 * @param {Object} jsfun 
 * 					调用刷新方法名
 * @param {Object} url 
 * 					包名
 * @param {Object} html 
 * 					文件名
 */
function lastPageRefresh(jsfun,url,html){
	var jsfun = ""+jsfun+"();";
	var id = "/"+url+"/"+html+".html"
	summer.execScript({
	    winId: id,
	    script: jsfun
	});
}
/**
 * 获取手机时间
 * 年-月-日 
 */
function getNowFormatDate() {//获取年月日
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            /*+ " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();*/
    return currentdate;
}
/**
 * 获取手机时间
 * 年-月-日 时:分:秒
 */
function getNowFormatDateTime() {//获取年月日 时分秒
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

/**
 *物理返回键监听 
 */
function onDeviceReady(fun,url,html) { 
	// 按钮事件 
	document.addEventListener("backbutton", eventBackButton(fun,url,html), false); // 返回键 
} 

function eventBackButton(fun,url,html) { 
	lastPageRefresh(fun,url,html);
	summer.closeWin();
}

/**
 * 跨界面刷新方法
 * @param {Object} jsfun 
 * 					调用刷新方法名
 * @param {Object} url 
 * 					包名
 * @param {Object} html 
 * 					文件名
 */
function lastPageRefresh(jsfun,url,html){
	var jsfun = ""+jsfun+"();";
	var id = "/"+url+"/"+html+".html"
	summer.execScript({
	    winId: id,
	    script: jsfun
	});
}

/**
 * 四舍五入
 */
function round(num,d){
 
	//Step1:将num放大10的d次方倍
	 
	num*=Math.pow(10,d);
	 
	//Step2:对num四舍五入取整
	 
	num = Math.round(num);
	 
	//Step：返回num缩小10的d次方倍，获得最终结果
	 
	return num/Math.pow(10,d);
 
}
