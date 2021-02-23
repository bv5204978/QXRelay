/**
 * 小小影视vip 20.12.22
 * 
 * @shuangfan
//  * https://github.com/NobyDa/Script/blob/master/QuantumultX/File/xxys.js
//  * https://github.com/Sunert/Scripts/blob/master/Script/xxys.js
//  * https://raw.githubusercontent.com/photonmang/quantumultX/master/xxys.js
 * 
 * 
 * MITM = *.xxjjappss.com,*.xiaoxiaoapps.com,*.huaerdadi.com // *.xxjjappss.com,*.xjxjappss.com,*.huaerdadi.com
 * ^https:\/\/[a-z0-9]+\.(xxjjappss|xiaoxiaoapps|huaerdadi)\.com\/(ssp-svr\/ssp\/list3|vod\/reqplay|ucp\/index|getGlobalData) url script-response-body https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/Rewrite/xxys.vip.js
 * 
 * 商店下载easyknowlege 
 */


// ucp/index
// vod/reqplay
// getGlobalData

// ssp-svr/ssp/list3

const index = "ucp/index";
const reqplay = "vod/reqplay";

const global = "getGlobalData";

const ssp = "ssp-svr/ssp/list3";


let obj = JSON.parse($response.body);

if ($request.url.indexOf(index) != -1) {
	obj.data.user["isvip"] = "1";
	obj.data.user["avatar_url"] = "https://raw.githubusercontent.com/bv5204978/QXRelay/master/Resource/jpg.jpg";
	obj.data.user["goldcoin"] = "233";

	obj.data.uinfo["curr_group"] = "5"//obj.data.groups[obj.data.groups.length - 1];
	obj.data.uinfo["play_daily_remainders"] = "233";
	obj.data.uinfo["down_daily_remainders"] = "233";

	obj.data.uinfo["goldcoin"] = "233";
}

if ($request.url.indexOf(reqplay) != -1) {
	obj.retcode = "0";
	obj.data.lastplayindex = "1";
	if(obj.data.hasOwnProperty("httpurl_preview")){
		var playurl = obj.data["httpurl_preview"];
		obj.data["httpurl"] = playurl;
	};
}

if ($request.url.indexOf(global) != -1) {
	delete obj.data.adrows
	delete obj.data.adgroups
	delete obj.data.iOS_adgroups
	delete obj.data.Android_adgroups
}

if ($request.url.indexOf(ssp) != -1) {
	delete obj.data.pmap
}

$done({ body: JSON.stringify(obj) });
