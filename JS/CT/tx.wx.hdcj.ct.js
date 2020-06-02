/**
 * 腾讯.微信.小程序.活动抽奖 签到
 * 
 * https://github.com/zZPiglet/Task/blob/master/WeChatLottery/WeChatLottery.js
 * 
 * 
 * MITM = new.api.hdcj.9w9.com
 * ^https:\/\/new\.api\.hdcj\.9w9\.com\/api\/sign\/sign url script-request-body WeChatLottery.js
 * 
 * 进入"活动抽奖"，手动签到一次或点击"已签到"，若弹出"首次写入活动抽奖 Token 成功"即可正常食用
 */


/*
微信小程序"活动抽奖"自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"活动抽奖"，手动签到一次或点击"已签到"，若弹出"首次写入活动抽奖 Token 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"活动抽奖 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

注意⚠️：此脚本仅能用于在 2020.03.01（再以前未尝试）至 2020.03.18 之间获取过 token 的用户。

Author: t.me/makexp
Modified by zZPiglet

Quantumult X (TestFlight 195+, App Store 1.0.6+):
[task_local]
1 0 * * * WeChatLottery.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery.js

[rewrite_local]
^https:\/\/new\.api\.hdcj\.9w9\.com\/api\/sign\/sign url script-request-body WeChatLottery.js
or remote
^https:\/\/new\.api\.hdcj\.9w9\.com\/api\/sign\/sign url script-request-body https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery.js

Surge 4.0+:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery.js
http-request ^https:\/\/new\.api\.hdcj\.9w9\.com\/api\/sign\/sign requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery.js,script-update-interval=0


All app:
[mitm]
hostname = new.api.hdcj.9w9.com

获取完 Token 后可不注释 rewrite / mitm，Token 更新时会弹窗。若因 mitm 导致该小程序网络不稳定，可注释掉 mtim。
*/

/*
t.me/makexp 写法：
const userCheckinURL = 'https://new.api.hdcj.9w9.com/api/sign/sign';
const userCookieKey  = 'cjzs_userCookieKey';
const userAgentKey   = 'cjzs_userAgentKey';
const userTokenKey   = 'cjzs_userTokenKey';
const userRefererKey = 'cjzs_userReferKey';
const userBodyKey    = 'cjzs_userBodyKey';
let userBody = '';

let isGetCookie = typeof $request !== 'undefined';

if (isGetCookie) {
    // 获取 Cookie
    if ($request.headers['api-token']) {
        //var usercookie = $request.headers['Cookie'];
        var userAgent  = $request.headers['User-Agent'];
        var userToken  = $request.headers['api-token'];
        var userReferer= $request.headers['Referer'];

         userBody   = $request.body;
        //console.log(userBody);
        //$prefs.setValueForKey(usercookie, userCookieKey);
        $prefs.setValueForKey(userAgent, userAgentKey);
        $prefs.setValueForKey(userToken, userTokenKey);
        $prefs.setValueForKey(userReferer, userRefererKey);
        $prefs.setValueForKey(userBody, userBodyKey);
        $notify("成功获取活动抽奖 Cookie 🎉", "", "请禁用该脚本")
    }
    $done({});
} else {
    // 签到
    var request = {
        url: userCheckinURL,
        method: 'POST',
        headers: {
            'app-version': '3.3.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cotent-Type': 'application/json',
            'Content-Type': 'application/json',
            'api-token': $prefs.valueForKey(userTokenKey),
            'Cache-Control': 'no-cache',
            'Referer': $prefs.valueForKey(userRefererKey),
            'Host': 'new.api.hdcj.9w9.com',
            'User-Agent': $prefs.valueForKey(userAgentKey),
            'Accept-Language' : 'en-us',
            'Accept' : 'application/vnd.lumen.v2+json',
            'Content-Length' : 'en-us',
        },
        body: $prefs.valueForKey(userBodyKey)

    };
//console.log(request);
    $task.fetch(request).then(response => {
        const obj = JSON.parse(response.body);
        if (obj.result == "success") {
            $notify("活动抽奖", "", "签到成功！");
        } else {
            $notify("活动抽奖", "", obj.result);
        }
        $prefs.setValueForKey(obj.data, userDataKey);
    }, reason => {
        $notify("活动抽奖", "", reason.error)
    });
}
*/

const CheckinURL = 'https://new.api.hdcj.9w9.com/api/sign/sign';
const DataURL = 'https://new.api.hdcj.9w9.com/api/sign/sign_data';
const TokenName = '活动签到';
const TokenKey = 'wclottery';
const RefererKey = 'ltyRKey';
const AgentKey = 'ltyAKey'
const BodyKey = 'ltyBKey'
const datainfo = {}
const $cmp = compatibility();

async function Sign() {
    await Checkin()
    await GetData()
    await notify()
}

if ($cmp.isRequest) {
    GetToken()
    $cmp.end()
} else {
    Sign()
    $cmp.end()
}

function GetToken() {
    if ($request.headers['api-token']) {
        var TokenValue = $request.headers['api-token'];
        var RefererValue = $request.headers['Referer'];
        var AgentValue = $request.headers['User-Agent'];
        var BodyValue = $request.body;
        $cmp.write(RefererValue, RefererKey);
        $cmp.write(AgentValue, AgentKey)
        $cmp.write(BodyValue, BodyKey);
        if ($cmp.read(TokenKey) != (undefined || null)) {
            if ($cmp.read(TokenKey) != TokenValue) {
                var token = $cmp.write(TokenValue, TokenKey);
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "");
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "");
                }
            }
        } else {
            var token = $cmp.write(TokenValue, TokenKey);
            if (!token) {
                $cmp.notify("首次写入" + TokenName + " Token 失败‼️", "", "");
            } else {
                $cmp.notify("首次写入" + TokenName + " Token 成功 🎉", "", "");
            }
        }
    } else {
        $cmp.notify("写入" + TokenName + "Token 失败‼️", "", "配置错误, 无法读取请求头, ");
    }
}

function Checkin() {
    return new Promise(resolve => {
        let headersCommon = {
            "Accept": "application/vnd.lumen.v2+json",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-us",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Length": "100",
            "Content-Type": "application/json",
            "Cotent-Type": "application/json",
            "Host": "new.api.hdcj.9w9.com",
            "Referer": $cmp.read("ltyRKey"),
            "User-Agent": $cmp.read("ltyAKey"),
            "api-token": $cmp.read("wclottery"),
            "app-version": "3.4.1",
        }
        let LotteryCheckin = {
            url: CheckinURL,
            headers: headersCommon,
            body: $cmp.read("ltyBKey")
        };
        $cmp.post(LotteryCheckin, function (error,response, data) {
            try{
                if (error) {
                    datainfo.error = 0
                    datainfo.errormessage = error
                } else {
                    const obj1 = JSON.parse(data)
                    if (obj1.result == "success") {
                        datainfo.success = 0
                    } else if (obj1.result == "今天已签到过了~") {
                        datainfo.success = 2
                    } else if (obj1.code == 30001) {
                        datainfo.error = 2
                    }else {
                        console.log("wclottery failed response : \n" + data)
                        datainfo.error = 3
                        datainfo.errormessage = data
                    }
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动签到"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function GetData() {
    return new Promise(resolve => {
        let headersCommon = {
            "Accept": "application/vnd.lumen.v2+json",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-us",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Length": "100",
            "Content-Type": "application/json",
            "Cotent-Type": "application/json",
            "Host": "new.api.hdcj.9w9.com",
            "Referer": $cmp.read("ltyRKey"),
            "User-Agent": $cmp.read("ltyAKey"),
            "api-token": $cmp.read("wclottery"),
            "app-version": "3.4.1",
        }
        let LotteryData = {
            url: DataURL,
            headers: headersCommon,
            body: $cmp.read("ltyBKey")
        };
        $cmp.post(LotteryData, function (error, response, data) {
            try {
                const obj2 = JSON.parse(data)
                datainfo.days = obj2.result.cycle
                datainfo.luckcoin = obj2.result.sign_lucky[datainfo.days - 1];
                datainfo.allluckcoin = obj2.result.lucky_count;
                datainfo.luckmoney = obj2.result.money;
                resolve ('done')
            } catch (e) {
                $cmp.notify("活动签到"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })

}

function notify() {
    return new Promise(resolve => {
       try {
           if (datainfo.success == 0) {
               let msg1 = "签到获得 " + datainfo.luckcoin + " 币，共有 " + datainfo.allluckcoin + " 币及 " + datainfo.luckmoney + " 元。💰";
               $cmp.notify("活动签到 - 签到成功！🎉", "", msg1)
           } else if (datainfo.success == 2) {
               const msg2 = "今日获得 " + datainfo.luckcoin + " 币，共有 " + datainfo.allluckcoin + " 币及 " + datainfo.luckmoney + " 元。💰"
               $cmp.notify("活动签到 - 重复签到！😊", "", msg2)
           } else if (datainfo.error == 0) {
               $cmp.notify("活动签到 - 签到接口请求失败", "", datainfo.errormessage)
           } else if (datainfo.error == 2) {
               $cmp.notify("活动签到 - Token 失效❗️", "", "请重新获取 Token❗️")
           } else if (datainfo.error == 3) {
               $cmp.notify("活动签到 - 签到失败‼️", "", datainfo.errormessage)
           }
           resolve('done')
       } catch (e) {
           $cmp.notify("通知模块 " + e.name + "‼️", JSON.stringify(e), e.message)
           resolve('done')
       }
    });
}

function compatibility() {
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
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, post, end }
};
