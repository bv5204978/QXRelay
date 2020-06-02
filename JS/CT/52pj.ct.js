/**
 * 52pojie 签到
 * 
 * https://github.com/NobyDa/Script/blob/master/52pojie-DailyBonus/52pojie.js
 * 
 * 
 * MITM = www.52pojie.cn
 * https:\/\/www\.52pojie\.cn\/home\.php\? url script-request-header 52pojie.js
 * 
 * 手动登录 https://www.52pojie.cn
 */


/*
吾爱破解签到脚本

更新时间: 2020.5.12 18:25
脚本兼容: QuantumultX, Surge, Loon
电报频道: @NobyDa
问题反馈: @NobyDa_bot

说明：
手动登录 https://www.52pojie.cn 如通知成功获取cookie, 则可以使用此签到脚本.
获取Cookie后, 请将Cookie脚本禁用并移除主机名，以免产生不必要的MITM.

脚本将在每天上午9点执行。 您可以修改执行时间。

************************
Surge 4.2.0+ 脚本配置:
************************

[Script]
吾爱签到 = type=cron,cronexp=0 9 * * *,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/52pojie-DailyBonus/52pojie.js

吾爱获取Cookie = type=http-request,pattern=https:\/\/www\.52pojie\.cn\/home\.php\?,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/52pojie-DailyBonus/52pojie.js

[MITM] 
hostname= www.52pojie.cn

************************
QuantumultX 本地脚本配置:
************************

[task_local]
# 吾爱签到
0 9 * * * 52pojie.js

[rewrite_local]
# 获取Cookie
https:\/\/www\.52pojie\.cn\/home\.php\? url script-request-header 52pojie.js

[mitm] 
hostname= www.52pojie.cn

************************
Loon 2.1.0+ 脚本配置:
************************

[Script]
# 吾爱签到
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/52pojie-DailyBonus/52pojie.js

# 获取Cookie
http-request https:\/\/www\.52pojie\.cn\/home\.php\? script-path=https://raw.githubusercontent.com/NobyDa/Script/master/52pojie-DailyBonus/52pojie.js

[Mitm] 
hostname= www.52pojie.cn
*/

var $nobyda = nobyda();
var date = new Date()
if ($nobyda.isRequest) {
  GetCookie()
} else {
  checkin()
}

function checkin() {
  var bonus = {
    url: 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2&mobile=no',
    headers: {
      Cookie: $nobyda.read("CookieWA"),
    }
  };
  $nobyda.get(bonus, function(error, response, data) {
    if (error) {
      console.log(error);
      $nobyda.notify("吾爱破解", "签到请求失败 ‼️‼️", error)
    } else {
      if (data.match(/(ÒÑÍê³É|\u606d\u559c\u60a8)/)) {
        $nobyda.notify("吾爱破解", "", date.getMonth() + 1 + "月" + date.getDate() + "日, 签到成功 🎉")
      } else if (data.match(/(ÄúÒÑ|\u4e0b\u671f\u518d\u6765)/)) {
        $nobyda.notify("吾爱破解", "", date.getMonth() + 1 + "月" + date.getDate() + "日, 已签过 ⚠️")
      } else if (data.match(/(ÏÈµÇÂ¼|\u9700\u8981\u5148\u767b\u5f55)/)) {
        $nobyda.notify("吾爱破解", "", "签到失败, Cookie失效 ‼️‼️")
      } else {
        $nobyda.notify("吾爱破解", "", "脚本待更新 ‼️‼️")
      }
    }
    $nobyda.done();
  })
}

function GetCookie() {
  try {
    if ($request.headers && $request.url.match(/www\.52pojie\.cn/)) {
      var CookieName = "吾爱破解";
      var CookieKey = "CookieWA";
      var CookieValue = $request.headers['Cookie'];
      if ($nobyda.read(CookieKey)) {
        if ($nobyda.read(CookieKey) != CookieValue) {
          var cookie = $nobyda.write(CookieValue, CookieKey);
          if (!cookie) {
            $nobyda.notify("", "", "更新" + CookieName + "Cookie失败 ‼️");
          } else {
            $nobyda.notify("", "", "更新" + CookieName + "Cookie成功 🎉");
          }
        }
      } else {
        var cookie = $nobyda.write(CookieValue, CookieKey);
        if (!cookie) {
          $nobyda.notify("", "", "首次写入" + CookieName + "Cookie失败 ‼️");
        } else {
          $nobyda.notify("", "", "首次写入" + CookieName + "Cookie成功 🎉");
        }
      }
    } else {
      $nobyda.notify("写入Cookie失败", "", "请检查匹配URL或配置内脚本类型 ‼️");
    }
  } catch (eor) {
    $nobyda.notify("写入Cookie失败", "", "未知错误 ‼️")
    console.log(JSON.stringify(eor) + "\n" + eor + "\n" + JSON.stringify($request.headers))
  }
  $nobyda.done();
}

function nobyda() {
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message)
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key)
    if (isSurge) return $persistentStore.write(value, key)
  }
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
  }
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "GET"
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) $httpClient.get(options, (error, response, body) => {
      callback(error, adapterStatus(response), body)
    })
  }
  const done = (value = {}) => {
    if (isQuanX) isRequest ? $done(value) : null
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    isRequest,
    notify,
    write,
    read,
    get,
    done
  }
};