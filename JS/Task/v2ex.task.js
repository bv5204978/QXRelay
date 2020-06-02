/**
 * https://github.com/chavyleung/scripts/blob/master/v2ex/quanx/v2ex.js
 */

 
const cookieName = 'V2EX'
const cookieKey = 'chavy_cookie_v2ex'
const cookieVal = $prefs.valueForKey(cookieKey)

function sign() {
  let url = {
    url: `https://www.v2ex.com/mission/daily`,
    method: 'GET',
    headers: {
      Cookie: cookieVal
      // Referer: 'https://www.v2ex.com/'
    }
  }
  $task.fetch(url).then((response) => {
    let data = response.body
    if (data.indexOf('每日登录奖励已领取') >= 0) {
      let title = `${cookieName}`
      let subTitle = `签到结果: 签到跳过`
      let detail = `今天已经签过了`
      console.log(`${title}, ${subTitle}, ${detail}`)
      $notify(title, subTitle, detail)
    } else {
      signMission(data.match(/<input[^>]*\/mission\/daily\/redeem\?once=(\d+)[^>]*>/)[1])
    }
  })
}

function signMission(code) {
  let url = {
    url: `https://www.v2ex.com/mission/daily/redeem?once=${code}`,
    method: 'GET',
    headers: { 
      Cookie: cookieVal,
      Referer: 'https://www.v2ex.com/mission/daily'
     }
  }
  $task.fetch(url).then((response) => {
    let data = response.body
    if (data.indexOf('每日登录奖励已领取') >= 0) {
      let title = `${cookieName}`
      let subTitle = `签到结果: 签到成功`
      let detail = ``
      console.log(`${title}, ${subTitle}, ${detail}`)
      $notify(title, subTitle, detail)
    } if (data.indexOf('奇奇怪怪') >= 0) {
      let title = `${cookieName}`
      let subTitle = `签到结果: 签到失败`
      let detail = `请尝试退出账号重新登录`
      console.log(`签到失败: ${cookieName}, data: ${data}`)
      $notify(title, subTitle, detail)
    } else {
      let title = `${cookieName}`
      let subTitle = `签到结果: 签到失败`
      let detail = `详见日志`
      console.log(`签到失败: ${cookieName}, data: ${data}`)
      $notify(title, subTitle, detail)
    }
  })
}

sign({})