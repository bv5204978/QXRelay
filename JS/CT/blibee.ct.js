/**
 * blibee便利蜂 签到 20.10.24
 * 
 * https://github.com/zZPiglet/Task/blob/master/Blibee/Blibee.js
 * 
 * 
 * MITM = h5.bianlifeng.com
 * ^https:\/\/h5\.bianlifeng\.com\/meepo\/taskCenter\/home\/v\d url script-request-header Blibee.js
 * 
 * 小程序 或 APP 进入"便利蜂"，点击"签到赚礼金"
 */


/*
便利蜂便利店目前开店城市：北京市、天津市、南京市、常州市、嘉兴市、上海市、无锡市、苏州市、金华市、深圳市、合肥市、扬州市、宁波市、廊坊市、济南市、青岛市、温州市、杭州市
便利蜂的门店主要分布于北京、天津、上海、南京等8个大中城市在内的华北、华东都市圈，并正在加速完成对这两大城市群的高密度渗透。

在这些城市居住并想使用此脚本的可以走我 aff 下载便利蜂，(可能)会有一些优惠券，当然目前来看新用户优惠活动暂未结束(50 元券包)，但是推广方得到的好像没啥了（写脚本时发现只给 5.9 折门店蒸包折扣券，然而并不吃。。）
aff：
http://be3.cc/s/mhndZwo
或
https://d.bianlifeng.com/c/a/s4?type=pages&path=%2Fpages%2FdistributeManager%2Findex%3Fp%3D%252Fpages%252FinviteNewUserCity%252Findex%253FshareCode%253D3130056365815256%2526baseCode%253D31%2526floor%253DNaN%2526entrySource%253Dfacecode%26source%3D31&webview=1&url=https%3A%2F%2Fh5.bianlifeng.com%2Fbond%2FinviteCity%2Findex%3FshareCode%3D3130056365815256%26baseCode%3D31%26floor%3DNaN%26entrySource%3Dfacecode&appViewName=InviteNewUserCity&il=true&source=poster_share&defaultNavBar=true

便利蜂 app 或微信小程序"便利蜂"自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"便利蜂"，点击"签到赚礼金"，若弹出"首次写入便利蜂 Cookie 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
若 Cookie 失效，请确认配置后重新进入"便利蜂"，点击"签到赚礼金"，若弹出"更新便利蜂 Cookie 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"便利蜂 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author: zZPiglet

----------
最新版本：
- 2020/06/29:
增加签到得会员信息判断，修复自动领取任务错误，尝试修复不会完成任务。
鉴于目前礼金有效期为获取后一年，兑换蜂蜜或优惠券有效期为兑换后一周，故取消自动兑换的计划，请使用时先手动兑换优惠。
- 2020/04/29：
增加自动签到领礼金（礼金可兑换蜂蜜付款时抵扣，或兑换门店满减券），增加自动领取所有任务，增加自动完成除消费、邀请类任务。
脚本中使用了我的邀请签到 aff（每日最多 5 次 1～6 礼金），若不希望使用，可将 shareCode 改空。
已知 bug：通知数值不正确，未完成任务不通知（但有日志）。不影响正常运行，后续改正。
待办：修改 bug，自动兑换判断。
----------

Quantumult X (TestFlight 190+, App Store 1.0.5+):
[task_local]
1 0 * * * Blibee.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Blibee/Blibee.js

[rewrite_local]
^https:\/\/h5\.bianlifeng\.com\/meepo\/taskCenter\/home\/v\d url script-request-header Blibee.js
or remote
^https:\/\/h5\.bianlifeng\.com\/meepo\/taskCenter\/home\/v\d url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/Blibee/Blibee.js

Surge 4.0+:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Blibee/Blibee.js
http-request ^https:\/\/h5\.bianlifeng\.com\/meepo\/taskCenter\/home\/v\d script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Blibee/Blibee.js


All apps:
[mitm]
hostname = h5.bianlifeng.com

获取完 Cookie 后可不注释 rewrite / hostname，Cookie 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。
*/


const version = '/v1'
const shareCode = '3570065352703791'
const homeURL = 'https://h5.bianlifeng.com/meepo/taskCenter/home' + version
const signInURL = 'https://h5.bianlifeng.com/meepo/taskCenter/today/signIn' + version
const receiveURL = 'https://h5.bianlifeng.com/meepo/taskCenter/task/receive' + version
const finishURL = 'https://order-api.blibee.com/meepo/taskCenter/task/finish' + version
const cookieName = '便利蜂'
const cookieKey = 'blibee'
const deviceKey = 'blibee_deviceid'
const tokenKey = 'blibee_token'
const userKey = 'blibee_userid'
const regex = /__DEVICEID__=(\S*);\s__LOGIN_MINI__=;\s__TOKEN__=(\S*);\s__USERID__=(\S*)/
const datainfo = {}
const undoList = new Array()
const descList = new Array()
let ValidCookie = true
const $cmp = compatibility()

async function Sign() {
    await Valid()
    if (ValidCookie) {
        if (datainfo.today) {
            datainfo.isSign = true
        } else {
            await signIn()
        }
        await receive()
        await checkfinish()
        await finish()
        await result()
        await notify()
    } else {
        $cmp.notify(cookieName + ' Cookie 失效❗️', '', '脚本终止，请重新获取 Cookie')
    }

}

if ($cmp.isRequest) {
    GetCookie()
    $cmp.done()
} else {
    makeHeaders()
    Sign()
    $cmp.done()
}

function GetCookie() {
    if ($request && $request.method == 'POST') {
        let cookieKeyValue = $request.headers['Cookie']
        if ($cmp.read(cookieKey) != (undefined || null)) {
            if ($cmp.read(cookieKey) != cookieKeyValue) {
                let cookie = $cmp.write(cookieKeyValue, cookieKey)
                if (!cookie) {
                    $cmp.notify("更新" + cookieName + " Cookie 失败‼️", "", "")
                } else {
                    let deviceKeyValue = regex.exec(cookieKeyValue)[1]
                    let tokenKeyValue = regex.exec(cookieKeyValue)[2]
                    let userKeyValue = regex.exec(cookieKeyValue)[3]
                    $cmp.write(deviceKeyValue, deviceKey)
                    $cmp.write(tokenKeyValue, tokenKey)
                    $cmp.write(userKeyValue, userKey)
                    $cmp.notify("更新" + cookieName + " Cookie 成功 🎉", "", "")
                }
            }
        } else {
            let cookie = $cmp.write(cookieKeyValue, cookieKey);
            if (!cookie) {
                $cmp.notify("首次写入" + cookieName + " Cookie 失败‼️", "", "")
            } else {
                let deviceKeyValue = regex.exec(cookieKeyValue)[1]
                let tokenKeyValue = regex.exec(cookieKeyValue)[2]
                let userKeyValue = regex.exec(cookieKeyValue)[3]
                $cmp.write(deviceKeyValue, deviceKey)
                $cmp.write(tokenKeyValue, tokenKey)
                $cmp.write(userKeyValue, userKey)
                $cmp.notify("首次写入" + cookieName + " Cookie 成功 🎉", "", "")
            }
        }
    } else {
        $cmp.notify("写入" + cookieName + " Cookie 失败‼️", "", "配置错误, 无法读取请求头。")
    }
}

function makeHeaders() {
    datainfo.headers1 = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cookie': $cmp.read('blibee'),
        'Referer': 'https://h5.bianlifeng.com/bond/taskCenterNew?shareInfoFromH5=1&shareCode=' + shareCode + '&token=' + $cmp.read('blibee_token') + '&deviceId=' + $cmp.read('blibee_deviceid') + '&userId=' + $cmp.read('blibee_userid'),
        'deviceid': $cmp.read('blibee_deviceid'),
        'token': $cmp.read('blibee_token'),
    }
    datainfo.headers2 = {
        'deviceid': $cmp.read('blibee_deviceid'),
        'token': $cmp.read('blibee_token'),
        'ws_user_id': $cmp.read('blibee_userid'),
    }
}

function Valid() {
    return new Promise(resolve => {
        const home = {
            url: homeURL,
            headers: datainfo.headers1,
            body: '{"all":true,"page":{"pageSize":10,"pageNo":1}}'
        }
        $cmp.post(home, function (error, response, data) {
            try{
                if (response.status == 200) {
                    const homeobj = JSON.parse(data)
                    if (homeobj.status == '0') {
                        datainfo.pointUnit = homeobj.data.pointUnit
                        datainfo.today = homeobj.data.signInTaskVo.todayCheckIn
                        datainfo.signid = homeobj.data.signInTaskVo.userSignInId
                        datainfo.tasklist = homeobj.data.taskListVo.taskItemVos
                    } else {
                        ValidCookie = false
                    }
                } else {
                    ValidCookie = false
                }
                resolve()
            } catch (e) {
                $cmp.notify(cookieName + "任务主页" + e.name + "‼️", JSON.stringify(e), e.message)
                resolve()
            }
        })
    })
}

function signIn() {
    return new Promise(resolve => {
        const today = {
            url: signInURL + '?userSignInId=' + datainfo.signid + '&shareId=' + shareCode,
            headers: datainfo.headers1
        }
        $cmp.get(today, function(error, response, data) {
            try{
                if (error) {
                    datainfo.error = 1
                    datainfo.errormessage = error
                } else {
                    datainfo.signIn = JSON.parse(data)
                }
                resolve()
            } catch (e) {
                $cmp.notify(cookieName + "签到" + e.name + "‼️", JSON.stringify(e), e.message)
                resolve()
            }
        })
    })
}

function receive() {
    return new Promise(resolve => {
        datainfo.receiveCnt = 0
        datainfo.receiveFail = 0
        for (let task of datainfo.tasklist) {
            let taskStatus = task.status
            let actionName = task.actionName
            let param = JSON.stringify(task.param)
            param = param ? param : '{}'
            let taskName = task.taskName
            if (taskStatus == "init") {
                const bodyValue = '{"actionName":"' + actionName+ '","param":' + param + '}'
                const receive = {
                    url: receiveURL,
                    headers: datainfo.headers1,
                    body: bodyValue
                }
                $cmp.post(receive, function(error, response, data) {
                    try{
                        const receiveobj = JSON.parse(data)
                        if (receiveobj.status == '0') {
                            datainfo.receiveCnt += 1
                        } else {
                            datainfo.receiveFail += 1
                            $cmp.log(cookieName + " 接" + taskName + "任务失败：" + receiveobj.msg)
                        }
                    } catch (e) {
                        $cmp.notify(cookieName + "接" + taskName + "任务" + e.name + "‼️", JSON.stringify(e), e.message)
                    }
                })
            }
        }
        resolve()
    })
}

function checkfinish() {
    return new Promise(resolve => {
        const home = {
            url: homeURL,
            headers: datainfo.headers1,
            body: '{"all":true,"page":{"pageSize":10,"pageNo":1}}'
        }
        $cmp.post(home, function (error, response, data) {
            try{
                const homeobj = JSON.parse(data)
                datainfo.unfinishlist = homeobj.data.taskListVo.taskItemVos
                resolve()
            } catch (e) {
                $cmp.notify(cookieName + "任务情况" + e.name + "‼️", JSON.stringify(e), e.message)
                resolve()
            }
        })
    })
}

function finish() {
    return new Promise(resolve => {
        for (let task of datainfo.unfinishlist) {
            let taskStatus = task.status
            let taskId = task.taskId
            let taskName = task.taskName
            let taskDesc = task.desc
            if (taskStatus == 'doing') {
                const finish = {
                    url: finishURL + '?taskId=' + taskId,
                    headers: datainfo.headers2
                }
                $cmp.get(finish, function (error, response, data) {
                    try {
                        const finishobj = JSON.parse(data)
                        if (finishobj.status == '0') {
                            datainfo.finishPoints += Number(finishobj.data.pointAmount)
                        } else {
                            $cmp.log(cookieName + ' ' + taskName + "任务未完成：" + taskDesc)
                            undoList[datainfo.finishFail] = taskName
                            descList[datainfo.finishFail] = taskDesc
                            datainfo.finishFail += 1
                        }
                    } catch (e) {
                        $cmp.notify(cookieName + "做" + taskName + "任务" + e.name + "‼️", JSON.stringify(e), e.message)
                    }
                })
            }
        }
        resolve()
    })
}

function result() {
    return new Promise(resolve => {
        const home = {
            url: homeURL,
            headers: datainfo.headers1,
            body: '{"all":true,"page":{"pageSize":10,"pageNo":1}}'
        }
        $cmp.post(home, function (error, response, data) {
            const homeobj = JSON.parse(data)
            try{
                datainfo.allpoints = homeobj.data.myPoint
                datainfo.topDesc = homeobj.data.taskListVo.topDesc
                resolve()
            } catch (e) {
                $cmp.notify(cookieName + "结果主页" + e.name + "‼️", JSON.stringify(e), e.message)
                resolve()
            }
        })
    })
}

function notify() {
    return new Promise(resolve => {
        try {
            let Title = cookieName + ' - '
            let subTitle = ''
            let detail = ''
            let errormessage = ''
            if (datainfo.error) {
                $cmp.log("blibee failed response: \n" + datainfo.errormessage)
                Title += '签到接口请求失败️'
                errormessage += '\n签到接口请求失败,详情请看日志。'
            } else if (datainfo.isSign) {
                Title += '重复签到！😊'
            } else {
                if (datainfo.signIn.status == '0') {
                    Title += '签到成功！🎉'
                    detail += datainfo.signIn.data.pointAmount ? '签到获得 ' + datainfo.signIn.data.pointAmount + ' ' + datainfo.pointUnit + '，' : datainfo.signIn.data.desc + '，'
                } else {
                    $cmp.log("blibee failed response: \n" + JSON.stringify(datainfo.signIn))
                    Title += '签到失败‼️'
                    errormessage += '\n签到失败，详情请看日志。'
                }
            }
            if (datainfo.receiveCnt) {
                subTitle += '领取任务 ' + datainfo.receiveCnt + ' 个 '
            }
            if (datainfo.receiveFail) {
                errormessage = '\n领取任务失败 ' + datainfo.receiveFail + ' 个，详情请看日志。'
            }
            if (datainfo.finishPoints) {
                detail += '任务获得 ' + datainfo.finishPoints + ' ' + datainfo.pointUnit + '，'
            }
            if (datainfo.finishFail) {
                errormessage += '\n未完成任务：'
                for (let i = 0; i < datainfo.finishFail; i++) {
                    errormessage += '\n' + undoList[i] + '：' + descList[i]
                }
            }
            subTitle += datainfo.topDesc
            detail += '账户共有 ' + datainfo.allpoints + ' ' + datainfo.pointUnit + '。'
            $cmp.notify(Title, subTitle, detail + errormessage)
            resolve()
        } catch (e) {
            $cmp.notify("通知模块 " + e.name + "‼️", JSON.stringify(e), e.message)
            resolve()
        }
    })
}

function compatibility(){const e="undefined"!=typeof $request,t="undefined"!=typeof $httpClient,r="undefined"!=typeof $task,n="undefined"!=typeof $app&&"undefined"!=typeof $http,o="function"==typeof require&&!n,s=(()=>{if(o){const e=require("request");return{request:e}}return null})(),i=(e,s,i)=>{r&&$notify(e,s,i),t&&$notification.post(e,s,i),o&&a(e+s+i),n&&$push.schedule({title:e,body:s?s+"\n"+i:i})},u=(e,n)=>r?$prefs.setValueForKey(e,n):t?$persistentStore.write(e,n):void 0,d=e=>r?$prefs.valueForKey(e):t?$persistentStore.read(e):void 0,l=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),f=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.get(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.get(e))},p=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.post(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request.post(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.post(e))},a=e=>console.log(e),y=(t={})=>{e?$done(t):$done()};return{isQuanX:r,isSurge:t,isJSBox:n,isRequest:e,notify:i,write:u,read:d,get:f,post:p,log:a,done:y}}