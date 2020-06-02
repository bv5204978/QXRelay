/**
 * https://raw.githubusercontent.com/chavyleung/scripts/master/mcdd/mcdd.js
 */


const chavy = init()
const cookieName = '叮咚买菜'
const KEY_homeurl = 'chavy_home_url_mcdd'
const KEY_homeheader = 'chavy_home_header_mcdd'

const signinfo = {}
let VAL_homeurl = chavy.getdata(KEY_homeurl)
let VAL_homeheader = chavy.getdata(KEY_homeheader)

;(exec = async () => {
  chavy.log(`🔔 ${cookieName} 开始签到`)
  await signapp()
  await getlottery()
  if (signinfo.draw_num > 0) for (let i = 0; i < signinfo.draw_num; i++) await lotteryapp(i)
  await browseapp()
  await getinfo()
  showmsg()
  chavy.done()
})().catch((e) => chavy.log(`❌ ${cookieName} 签到失败: ${e}`), chavy.done())

function getinfo() {
  return new Promise((resolve, reject) => {
    const url = { url: VAL_homeurl, headers: JSON.parse(VAL_homeheader) }
    chavy.get(url, (error, response, data) => {
      try {
        signinfo.info = JSON.parse(data)
        if (typeof signinfo.is_today_sign === 'undefined') signinfo.is_today_sign = signinfo.info.data.user_sign.is_today_sign
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `获取信息: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getinfo - 获取信息失败: ${e}`)
        chavy.log(`❌ ${cookieName} getinfo - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function signapp() {
  return new Promise((resolve, reject) => {
    const url = { url: `https://ddxq.mobi/api/v2/user/signin/`, headers: JSON.parse(VAL_homeheader) }
    url.headers['Accept'] = '*/*'
    url.headers['Origin'] = 'https://activity.m.ddxq.mobi'
    url.headers['Accept-Encoding'] = 'gzip, deflate, br'
    url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    url.headers['Host'] = 'ddxq.mobi'
    url.headers['Connection'] = 'keep-alive'
    url.headers['Referer'] = 'https://activity.m.ddxq.mobi/'
    url.headers['Content-Length'] = '129'
    url.headers['Accept-Language'] = 'zh-cn'
    url.body = VAL_homeurl.split('?')[1]
    chavy.post(url, (error, response, data) => {
      try {
        signinfo.signapp = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} signapp - 签到失败: ${e}`)
        chavy.log(`❌ ${cookieName} signapp - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function getlottery() {
  return new Promise((resolve, reject) => {
    const getlotteryurl = `https://maicai.api.ddxq.mobi/lottery/index?${VAL_homeurl.split('?')[1]}&event_id=5dbacee44df3e3ed628ce721`
    const url = { url: getlotteryurl, headers: JSON.parse(VAL_homeheader) }
    url.headers['Origin'] = 'https://activity.m.ddxq.mobi'
    url.headers['Connection'] = 'keep-alive'
    url.headers['Accept'] = '*/*'
    url.headers['Referer'] = 'https://activity.m.ddxq.mobi/'
    url.headers['Host'] = 'maicai.api.ddxq.mobi'
    url.headers['Accept-Encoding'] = 'gzip, deflate, br'
    url.headers['Accept-Language'] = 'zh-cn'
    chavy.get(url, (error, response, data) => {
      try {
        signinfo.lotteryinfo = JSON.parse(data)
        if (typeof signinfo.draw_num === 'undefined') signinfo.draw_num = signinfo.lotteryinfo.data.draw_num
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `获取抽奖: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getlottery - 获取抽奖失败: ${e}`)
        chavy.log(`❌ ${cookieName} getlottery - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function lotteryapp(cnt) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const lotteryappurl = `https://maicai.api.ddxq.mobi/lottery/draw?${VAL_homeurl.split('?')[1]}&event_id=5dbacee44df3e3ed628ce721`
      const url = { url: lotteryappurl, headers: JSON.parse(VAL_homeheader) }
      url.headers['Origin'] = 'https://activity.m.ddxq.mobi'
      url.headers['Connection'] = 'keep-alive'
      url.headers['Accept'] = '*/*'
      url.headers['Referer'] = 'https://activity.m.ddxq.mobi/'
      url.headers['Host'] = 'maicai.api.ddxq.mobi'
      url.headers['Accept-Encoding'] = 'gzip, deflate, br'
      url.headers['Accept-Language'] = 'zh-cn'
      chavy.get(url, (error, response, data) => {
        try {
          if (!signinfo.lottery) signinfo.lottery = []
          signinfo.lottery.push(JSON.parse(data))
          resolve()
        } catch (e) {
          chavy.msg(cookieName, `获取抽奖: 失败`, `说明: ${e}`)
          chavy.log(`❌ ${cookieName} lotteryapp - 获取抽奖失败: ${e}`)
          chavy.log(`❌ ${cookieName} lotteryapp - response: ${JSON.stringify(response)}`)
          resolve()
        }
      })
    }, cnt * 5000)
  })
}

function browseapp() {
  return new Promise((resolve, reject) => {
    const browseappurl = `https://maicai.api.ddxq.mobi/point/completeTask`
    const url = { url: browseappurl, headers: JSON.parse(VAL_homeheader) }
    url.body = `${VAL_homeurl.split('?')[1]}&station_id=5500fe01916edfe0738b4e43&task_type=21`
    url.headers['Accept'] = '*/*'
    url.headers['Origin'] = 'https://maicai.m.ddxq.mobi'
    url.headers['Accept-Encoding'] = 'gzip, deflate, br'
    url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    url.headers['Host'] = 'maicai.api.ddxq.mobi'
    url.headers['Connection'] = 'keep-alive'
    url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 xzone/9.7.5 station_id/5500fe01916edfe0738b4e43'
    url.headers['Referer'] = 'https://maicai.m.ddxq.mobi/?v=1.30.0'
    url.headers['Content-Length'] = '152'
    url.headers['Accept-Language'] = 'zh-cn'
    chavy.post(url, (error, response, data) => {
      try {
        signinfo.browseapp = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `浏览商品: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} browseapp - 浏览商品失败: ${e}`)
        chavy.log(`❌ ${cookieName} browseapp - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function showmsg() {
  let subTitle, detail
  if (signinfo.signapp.code == 0) {
    if (signinfo.is_today_sign === false) subTitle = '签到: 成功'
    else subTitle = '签到: 重复'
    detail = `积分: ${signinfo.info.data.point_num} (+${signinfo.signapp.data.point}), 价值: ${signinfo.info.data.point_money}`
  } else {
    subTitle = '签到: 失败'
    detail = `编码: ${signinfo.signapp.code}, 说明: ${signinfo.signapp.message}`
    chavy.log(`❌ ${cookieName} showmsg - 签到失败: ${JSON.stringify(signinfo.signapp)}`)
  }

  if (signinfo.lotteryinfo.code == 0) {
    if (signinfo.draw_num == 0) subTitle += '; 抽奖: 已转'
    else subTitle += `; 抽奖: ${signinfo.draw_num}次`
  } else {
    subTitle = '抽奖: 失败'
    detail = `编码: ${signinfo.lotteryinfo.code}, 说明: ${signinfo.lotteryinfo.message}`
    chavy.log(`❌ ${cookieName} showmsg - 抽奖失败: ${JSON.stringify(signinfo.lotteryinfo)}`)
  }

  if (signinfo.browseapp.code == 0) {
    subTitle += '; 浏览任务: 成功'
  } else if (signinfo.browseapp.code == -1) {
    subTitle += '; 浏览任务: 重复'
  } else {
    subTitle = '浏览任务: 失败'
    detail = `编码: ${signinfo.browseapp.code}, 说明: ${signinfo.browseapp.msg}`
    chavy.log(`❌ ${cookieName} showmsg - 浏览任务失败: ${JSON.stringify(signinfo.browseapp)}`)
  }

  if (signinfo.lottery) {
    detail += '\n查看抽奖详情\n'
    for (let i = 0; i < signinfo.lottery.length; i++) {
      if (signinfo.lottery[i].code == 0) detail += `\n抽奖 (${i + 1}): ${signinfo.lottery[i].data.prize.title}`
      else detail += `\n抽奖 (${i + 1}): ${signinfo.lottery[i].msg}`
    }
  }

  chavy.msg(cookieName, subTitle, detail)
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
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}