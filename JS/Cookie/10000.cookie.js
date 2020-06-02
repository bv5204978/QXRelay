/**
 * 电信营业厅 签到 20.5.6
 * 
 * https://github.com/chavyleung/scripts/blob/master/10000/10000.cookie.js
 * 
 * 
 * MITM = wapside.189.cn
 * ^https:\/\/wapside.189.cn:9001\/api\/home\/sign url script-request-body 10000.cookie.js
 * 
 * 打开 APP 手动签到一次: 访问下右下角 我 > 签到 (头像下面) 系统提示: 获取Cookie: 成功
 */

 
const cookieName = '电信营业厅'
const KEY_signheader = 'chavy_signheader_10000'
const KEY_signbody = 'chavy_signbody_10000'
const KEY_mobile = 'chavy_mobile_10000'
const chavy = init()
if (this.$request && this.$request.headers && this.$request.body) {
  const VAL_signheader = JSON.stringify($request.headers)
  const VAL_signbody = this.$request.body
  if (VAL_signheader) chavy.setdata(VAL_signheader, KEY_signheader)
  if (VAL_signbody) chavy.setdata(VAL_signbody, KEY_signbody)
  chavy.msg(cookieName, `获取Cookie: 成功`, ``)
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