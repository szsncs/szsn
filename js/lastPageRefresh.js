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
