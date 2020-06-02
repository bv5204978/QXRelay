/**
 * 
 */


const chavy = init()
const cookieName = '苏宁易购'
const KEY_loginurl = 'chavy_login_url_suning'
const KEY_loginbody = 'chavy_login_body_suning'
const KEY_loginheader = 'chavy_login_header_suning'
const KEY_signurl = 'chavy_sign_url_suning'
const KEY_signheader = 'chavy_sign_header_suning'
const KEY_signweburl = 'chavy_signweb_url_suning'
const KEY_signweburlBarry = 'snyg_userTokenKey'
const KEY_signwebheader = 'chavy_signweb_header_suning'
const KEY_signgameurl = 'chavy_signgame_url_suning'
const KEY_signgameheader = 'chavy_signgame_header_suning'
const KEY_signgetgameurl = 'chavy_signgetgame_url_suning'
const KEY_signgetgameheader = 'chavy_signgetgame_header_suning'
const KEY_runflag = 'chavy_runflag_suning'

const signinfo = {}
let VAL_loginurl = chavy.getdata(KEY_loginurl)
let VAL_loginbody = chavy.getdata(KEY_loginbody)
let VAL_loginheader = chavy.getdata(KEY_loginheader)
let VAL_signurl = chavy.getdata(KEY_signurl)
let VAL_signheader = chavy.getdata(KEY_signheader)
let VAL_signweburl = chavy.getdata(KEY_signweburl)
let VAL_signweburlBarry = chavy.getdata(KEY_signweburlBarry)
let VAL_signwebheader = chavy.getdata(KEY_signwebheader)
let VAL_signgameurl = chavy.getdata(KEY_signgameurl)
let VAL_signgameheader = chavy.getdata(KEY_signgameheader)
let VAL_signgetgameurl = chavy.getdata(KEY_signgetgameurl)
let VAL_signgetgameheader = chavy.getdata(KEY_signgetgameheader)
let VAL_runflag = chavy.getdata(KEY_runflag)

;(sign = async () => {
  chavy.log(`🔔 ${cookieName}`)
  await loginapp()
  if (VAL_signurl) await signapp()
  await getinfo()
  if (VAL_signweburl || VAL_signweburlBarry) await signweb(), await getwebinfo()
  if (VAL_signgameurl && VAL_signgetgameurl) await signgame(), await getgameinfo()
  showmsg()
  chavy.done()
})().catch((e) => chavy.log(`❌ ${cookieName} 签到失败: ${e}`), chavy.done())

function loginapp() {
  return new Promise((resolve, reject) => {
    const url = { url: VAL_loginurl, body: VAL_loginbody, headers: JSON.parse(VAL_loginheader) }
    // chavy.log(`❕ ${cookieName} loginapp - VAL_runflag: ${VAL_runflag}`)
    // if (VAL_runflag) delete url.headers['Cookie']
    // else chavy.setdata('true', KEY_runflag)
    chavy.post(url, (error, response, data) => {
      resolve()
    })
  })
}

function signapp() {
  return new Promise((resolve, reject) => {
    const url = { url: VAL_signurl, headers: JSON.parse(VAL_signheader) }
    delete url.headers['Cookie']
    chavy.get(url, (error, response, data) => {
      try {
        chavy.log(`❕ ${cookieName} signapp - response: ${JSON.stringify(response)}`)
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

function signgame() {
  return new Promise((resolve, reject) => {
    const url = { url: VAL_signgameurl, headers: JSON.parse(VAL_signgameheader) }
    delete url.headers['Cookie']
    chavy.get(url, (error, response, data) => {
      try {
        chavy.log(`❕ ${cookieName} signgame - response: ${JSON.stringify(response)}`)
        signinfo.signgame = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `天天低价: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} signgame - 签到失败: ${e}`)
        chavy.log(`❌ ${cookieName} signgame - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function signweb() {
  return new Promise((resolve, reject) => {
    let url = null
    if (VAL_signweburl) {
      url = { url: VAL_signweburl, headers: JSON.parse(VAL_signwebheader) }
      delete url.headers['Cookie']
      url.headers['Host'] = 'luckman.suning.com'
      url.headers['Referer'] = 'https: //luckman.suning.com/luck-web/sign/app/index_sign.htm?wx_navbar_transparent=true'
      url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 SNEBUY-APP 8.5.0 SNCLIENT-WAP'
    } else if (VAL_signweburlBarry) {
      url = { url: VAL_signweburlBarry, headers: {} }
      url.headers['Cookie'] = chavy.getdata('snyg_userCookieKey')
      url.headers['Accept'] = 'application/json'
      url.headers['Accept-Encoding'] = 'gzip, deflate, br'
      url.headers['Connection'] = 'keep-alive'
      url.headers['Referer'] = 'https://luckman.suning.com/luck-web/sign/app/index_sign.htm?wx_navbar_transparent=true'
      url.headers['Host'] = 'luckman.suning.com'
      url.headers['User-Agent'] = chavy.getdata('snyg_userAgentKey')
      url.headers['Accept-Language'] = 'en-us'
      url.headers['X-Requested-With'] = 'XMLHttpRequest'
    }
    chavy.get(url, (error, response, data) => {
      try {
        chavy.log(`❕ ${cookieName} signweb - response: ${JSON.stringify(response)}`)
        signinfo.signweb = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `每日红包: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} signweb - 每日红包失败: ${e}`)
        chavy.log(`❌ ${cookieName} signweb - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function getwebinfo() {
  return new Promise((resolve, reject) => {
    const timestamp = Math.round(new Date().getTime()).toString()
    const VAL_webinfourl = `https://luckman.suning.com/luck-web/sign/api/query/detail/record_sign.do?terminal=app&channel=sign&_=${timestamp}`
    const url = { url: VAL_webinfourl, headers: JSON.parse(VAL_signheader) }
    delete url.headers['Cookie']
    url.headers['Host'] = 'luckman.suning.com'
    chavy.get(url, (error, response, data) => {
      try {
        chavy.log(`❕ ${cookieName} getwebinfo - response: ${JSON.stringify(response)}`)
        signinfo.webinfo = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `领红包结果: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getwebinfo - 领红包失败: ${e}`)
        chavy.log(`❌ ${cookieName} getwebinfo - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function getgameinfo() {
  return new Promise((resolve, reject) => {
    const url = { url: VAL_signgetgameurl, headers: JSON.parse(VAL_signgetgameheader) }
    delete url.headers['Cookie']
    chavy.get(url, (error, response, data) => {
      try {
        chavy.log(`❕ ${cookieName} getgameinfo - response: ${JSON.stringify(response)}`)
        signinfo.gameinfo = JSON.parse(data.match(/\((.*)\)/)[1])
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `查询天天低价: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getgameinfo - 查询天天低价失败: ${e}`)
        chavy.log(`❌ ${cookieName} getgameinfo - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function getinfo() {
  return new Promise((resolve, reject) => {
    const timestamp = Math.round(new Date().getTime()).toString()
    const url = { url: `https://sign.suning.com/sign-web/m/newsign/getDiamondInfo.do?_=${timestamp}`, headers: JSON.parse(VAL_signheader) }
    delete url.headers['Cookie']
    chavy.get(url, (error, response, data) => {
      try {
        chavy.log(`❕ ${cookieName} getinfo - info: ${JSON.stringify(response)}`)
        signinfo.info = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `获取签到信息: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getinfo - 获取签到信息失败: ${e}`)
        chavy.log(`❌ ${cookieName} getinfo - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function showmsg() {
  let subTitle = ''
  let detail = ''
  let moreDetail = ''
  if (signinfo.signapp && signinfo.signapp.code == '1') {
    if (signinfo.signapp.data.todayFirstSignFlag == true) subTitle = '签到: 成功'
    else subTitle = '签到: 重复'
    for (myinfo of signinfo.info.data) {
      detail += detail == '' ? '总共: ' : ', '
      detail += myinfo.showLabel
    }
    if (signinfo.signapp.data.prizeLists) {
      detail += `, 说明: 还有${signinfo.signapp.data.remainingPoint}云钻待领取`
      const prizeLists = signinfo.signapp.data.prizeLists
      const customerDays = signinfo.signapp.data.customerDays
      const prize = prizeLists[customerDays - 1]
      moreDetail += moreDetail == '' ? '' : '\n'
      moreDetail += '\n💎 每日签到: '
      for (res of prize) moreDetail += `\n${res.prizeName}: ${res.prizeContent}`
    }
  } else {
    subTitle = '签到: 失败'
    chavy.log(`❌ ${cookieName} showmsg - 每日签到: ${JSON.stringify(signinfo.signapp)}`)
  }

  subTitle += subTitle == '' ? '' : ', '
  if (signinfo.signweb) {
    if (signinfo.signweb.respCode == '1') {
      subTitle += '红包: 成功'
    } else if (signinfo.signweb.respCode == '70512') {
      subTitle += '红包: 重复'
    } else {
      subTitle += '红包: 失败'
      chavy.log(`❌ ${cookieName} showmsg - 每日红包 - signweb: ${JSON.stringify(signinfo.signweb)}`)
    }
  } else {
    subTitle += '红包: 失败'
    chavy.log(`❌ ${cookieName} showmsg - 每日红包 - signweb: ${JSON.stringify(signinfo.signweb)}`)
  }

  subTitle += subTitle == '' ? '' : ', '
  if (signinfo.signgame && signinfo.signgame.code == '1') {
    if (signinfo.signgame.data.resultCode == 'SG0000') {
      subTitle += '低价: 成功'
    } else if (signinfo.signgame.data.resultCode == 'SG0103') {
      subTitle += '低价: 重复'
    } else {
      subTitle += '低价: 失败'
      chavy.log(`❌ ${cookieName} showmsg - 每日红包 - signgame: ${JSON.stringify(signinfo.signgame)}`)
    }
  } else {
    subTitle += '低价: 失败'
    chavy.log(`❌ ${cookieName} showmsg - 每日红包 - signgame: ${JSON.stringify(signinfo.signgame)}`)
  }

  if (signinfo.webinfo && signinfo.webinfo.respData) {
    const currentIndex = signinfo.webinfo.respData.currentIndex
    const detailTreeMap = signinfo.webinfo.respData.detailTreeMap
    const currentMap = detailTreeMap[currentIndex]
    if (currentMap.signMark == true) {
      moreDetail += moreDetail == '' ? '' : '\n'
      moreDetail += '\n🧧 每日红包: '
      for (res of currentMap.resList) moreDetail += `\n${res.remark}: ${res.amount}`
    } else {
      chavy.log(`❌ ${cookieName} showmsg - 每日红包 - webinfo: ${JSON.stringify(signinfo.webinfo)}`)
    }
  } else {
    chavy.log(`❌ ${cookieName} showmsg - 每日红包 - webinfo: ${JSON.stringify(signinfo.webinfo)}`)
  }

  if (signinfo.signgame && signinfo.gameinfo && signinfo.gameinfo.code == 1) {
    if (signinfo.gameinfo.data.resultCode == 0000) {
      moreDetail += moreDetail == '' ? '' : '\n'
      moreDetail += '\n💰 天天低价: '
      for (d of signinfo.gameinfo.data.result.datas)
        if (d.obj) moreDetail += `\n${d.obj.couponRuleName} (${d.obj.remainValue}元)`
        else moreDetail += `\n${d.basePrizeEntity.prizeName} (${d.basePrizeEntity.prizeRules})`
    } else {
      chavy.log(`❌ ${cookieName} showmsg - 天天低价 - gameinfo: ${JSON.stringify(signinfo.gameinfo)}`)
    }
  } else {
    chavy.log(`❌ ${cookieName} showmsg - 天天低价 - gameinfo: ${JSON.stringify(signinfo.gameinfo)}`)
  }

  if (moreDetail) detail += `\n查看签到详情\n${moreDetail}`
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