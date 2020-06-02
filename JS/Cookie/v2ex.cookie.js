/**
 * V2EX 签到
 * 
 * https://github.com/chavyleung/scripts/blob/master/v2ex/quanx/v2ex.cookie.js
 * 
 * 
 * MITM = *.v2ex.com
 * ^https:\/\/www\.v2ex\.com\/mission\/daily url script-request-header v2ex.cookie.js
 * 
 * 访问: https://www.v2ex.com/mission/daily 提示: Cookie [V2EX] 写入成功  签到成功可能没有提示
 */


const cookieName = 'V2EX'
const cookieKey = 'chavy_cookie_v2ex'
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