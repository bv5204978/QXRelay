/**
 * 什么值得买 签到
 * 
 * https://github.com/chavyleung/scripts/blob/master/smzdm/quanx/smzdm.cookie.js
 * 
 * 
 * MITM = *.smzdm.com
 * ^https:\/\/www\.smzdm\.com\/?.? url script-request-header smzdm.cookie.js
 * 
 * 访问并登录: https://zhiyou.smzdm.com/user/login   打开浏览器访问: https://www.smzdm.com
 */


const cookieName = '什么值得买'
const cookieKey = 'chavy_cookie_smzdm'
const cookieVal = $request.headers['Cookie']

if (cookieVal) {
  let cookie = $prefs.setValueForKey(cookieVal, cookieKey)
  if (cookie) {
    let msg = `${cookieName}`
    $notify(msg, 'Cookie写入成功', '详见日志')
    console.log(msg)
    console.log(cookieVal)
  }
}

$done({})