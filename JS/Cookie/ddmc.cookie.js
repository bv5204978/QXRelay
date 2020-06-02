/**
 * 叮咚买菜 签到 3.6
 * 
 * https://github.com/chavyleung/scripts/blob/master/mcdd/mcdd.cookie.js
 * 
 * 
 * MITM = maicai.api.ddxq.mobi
 * ^https:\/\/maicai.api.ddxq.mobi\/point\/home url script-request-header mcdd.cookie.js
 * 
 * 打开 APP, 访问下我的>积分
 */

 
const chavy = init()
const cookieName = '叮咚买菜'
const KEY_homeurl = 'chavy_home_url_mcdd'
const KEY_homeheader = 'chavy_home_header_mcdd'

if ($request && $request.method != 'OPTIONS') {
  try {
    chavy.log(`🔔 ${cookieName} 开始获取: Cookies`)
    const VAL_homeurl = $request.url
    const VAL_homeheader = JSON.stringify($request.headers)
    if (VAL_homeurl) {
      chavy.setdata(VAL_homeurl, KEY_homeurl)
      chavy.log(`❕ ${cookieName} VAL_homeurl: ${VAL_homeurl}`)
    }
    if (VAL_homeheader) {
      chavy.setdata(VAL_homeheader, KEY_homeheader)
      chavy.log(`❕ ${cookieName} VAL_homeheader: ${VAL_homeheader}`)
    }
    chavy.msg(cookieName, `获取Cookie: 成功`, ``)
  } catch (e) {
    chavy.msg(cookieName, `获取Cookie: 失败`, e)
    chavy.log(`❌ ${cookieName} 获取Cookie: 失败: ${e}`)
  }
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
chavy.done()