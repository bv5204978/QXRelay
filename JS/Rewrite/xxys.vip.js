/**
 * 小小影视vip 20.8.14
 * 
 * @shuangfan
//  * https://github.com/NobyDa/Script/blob/master/QuantumultX/File/xxys.js
//  * new https://github.com/Sunert/Scripts/blob/master/Script/xxys.js
 * 
 * 
 * MITM = *.xxjjappss.com
 * ^https:\/\/[a-zA-z0-9]+\.xxjjappss\.com\/(ucp\/index|vod\/reqplay|getGlobalData) url script-response-body https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/Rewrite/xxys.vip.js
 * 
 * 商店下载easyknowlege 
 */

 
const path1 = "/ucp/index";
const path2 = "/vod/reqplay/";

const ad = "/getGlobalData";

let obj = JSON.parse($response.body);

if ($request.url.indexOf(path1) != -1) {
	obj.data.user["isvip"] = "1";
	obj.data.user["avatar_url"] = "https://raw.githubusercontent.com/bv5204978/QXRelay/master/Resource/jpg.jpg";
	obj.data.user["goldcoin"] = "233";

	obj.data.uinfo["down_daily_remainders"] = "233";
	obj.data.uinfo["play_daily_remainders"] = "233";
	obj.data.uinfo["goldcoin"] = "233";

	obj.data.uinfo["curr_group"] = obj.data.groups[obj.data.groups.length - 1];
}

if ($request.url.indexOf(path2) != -1) {
	obj.retcode = "0";
	obj.data.lastplayindex = "1";
	if (obj.data.hasOwnProperty("httpurl_preview")) {
		var playurl = obj.data["httpurl_preview"];
		obj.data["httpurl"] = playurl;
	};
}

if ($request.url.indexOf(ad) != -1) {
	delete obj.data.adrows
	delete obj.data.adgroups
	delete obj.data.iOS_adgroups
	delete obj.data.Android_adgroups
}

$done({ body: JSON.stringify(obj) });



/*
// const path1 = "/init";
// const path2 = "/comment/listing";
*/