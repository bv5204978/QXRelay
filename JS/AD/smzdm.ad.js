/**
 * 什么值得买.主屏 20.3.7
 * 
 * https://github.com/primovist/ScriptsForSurge/blob/master/Scripts/SMZDM.js
 * 
 * 
 * MITM = homepage-api.smzdm.com
 * ^https?:\/\/homepage-api\.smzdm\.com\/home\?ad url script-response-body JS/AD/smzdm.ad.js
 */

 
let body = JSON.parse($response.body);
if (body.data.hasOwnProperty('banner')) {
  delete body.data.banner.big_banner;
  delete body.data.banner.tonglan_banner;
  delete body.data.banner.calendar_banner;
}
if (body.data.hasOwnProperty('big_banner')) {
  delete body.data.big_banner;
}
if (body.data.hasOwnProperty('notice')) {
  delete body.data.notice;
}
body.data.rows = body.data.rows.filter(function(item) {
  if (item.article_channel_id == -1 || item.model_type == "ads") {
    return false;
  }
  return true;
});
$done({
  body: JSON.stringify(body)
})