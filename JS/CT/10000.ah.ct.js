/**
 * 流量来啦.签到(小程序)
 * 
 * @fan 2022.11.25
 * https://github.com/bv5204978/QXRelay/blob/master/JS/CT/llll.ct.js
 * 
 * 
 * MITM = llhb.ah163.net
 * ^https:\/\/llhb\.ah163\.net\/ah_red_come\/app\/getJscode2Session url script-response-body https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/CT/llll.ct.js
 * 
 * 5 0 * * * https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/CT/llll.ct.js, tag=流量来啦, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/10000.png, enabled=true
 * 
 */
/**
 * 微信内部 wx.login 获取5分钟实效授权code 请求 getJscode2Session 获取 userSign 签到接口所需 token(4d)
 * {"code":"061Nc40w3RsICZ2gqw0w3TT1SR1Nc40E","queryDate":"2022-11-22 23:37:40","brand":"iPhone","model":"iPhone 13 Pro<iPhone14,2>"}
 * {"code":0,"msg":"操作成功","data":{"date":"2022-11-22 23:37:58","openid":"oOawA5Pnp4BnQebjIR0NVwoOFIHU","terminal":null,"user":{"seqid":"C6765843ABF31E11E053F50710ACFAA0","phone":"17334503449","reccount":19,"createTime":"2021-07-08 16:54:13","areacode":null,"remark":null,"openid":"oOawA5Pnp4BnQebjIR0NVwoOFIHU","nickname":"霜繁","headurl":"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI9l8cIb5kqD9X0CzYXTkH6iatCtsib4Ceib28iaVAr7kMzl6VH37LIgOIetPZ82e4F7xx9UPBI3Z3Esw/132","basecount":20,"packagecount":5,"basepackagecount":5,"senddaycount":5,"basesenddaycount":5,"robpackagecount":6,"robbasepackagecount":5,"friendcount":1,"selfcount":1,"baseselfcount":5,"basefriendcount":1,"citycode":"557","cityname":"宿州市","brand":null,"model":null},"token":"251205c761fe4284981bbb8e8d4baaf9"}}
 * 
 * isSign 同查询 {"code":0,"msg":"查询成功","data":1}
 * 
 */


//
const taskName = '10000.安徽.签到'

const llllKey = 'FAN_LLLL'

const isRequest = typeof $request != "undefined"


!(async function () {
    if (isRequest) {
        const msg = getToken()
        console.log(`${taskName}\n${msg}`)
        $notify(taskName, '', msg)
        $done({})
    } else {
        const msg = await sign()
        console.log(`${taskName}\n${msg}`)
        $notify(taskName, "", msg)
        $done()
    }
})()


function getToken() {
    const body = $response.body

    const bodystr = $.Decrypt(body)
    const body2 = JSON.parse(bodystr)

    const tokenValue = body2['data']['token']

    const llllValue = { 'token': tokenValue }
    const llllStr = JSON.stringify(llllValue)
    const llll = $prefs.setValueForKey(llllStr, llllKey)

    console.log(`${taskName}\ntoken: ${tokenValue}`)

    return llll ? 'token写入成功' : 'token写入失败'
}



function sign() {
    return new Promise((resolve) => {

        const llllValue = $prefs.valueForKey(llllKey)

        if (llllValue != null) {
            const tokenValue = JSON.parse(llllValue)['token']

            const url = 'https://llhb.ah163.net/ah_red_come/app/userSign'

            const para = { 'queryDate': timeStr(), 'phone': tokenValue }
            const body = { 'para': $.Encrypt(JSON.stringify(para)) }

            const req = {
                url: url,
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(body)
            }

            $task.fetch(req).then(response => {
                console.log(`${taskName}\n请求结果: ${response.body}`)

                if (response.statusCode == 200) {

                    try {
                        const bodyStr = $.Decrypt(response.body)
                        console.log(`${taskName}\n请求结果: ${bodyStr}`)

                        const body = JSON.parse(bodyStr)
                        resolve(`${body.msg}`)
                    } catch (error) {
                        resolve(`签到失败: ${error}`)
                    }

                } else {
                    resolve(`签到失败: status: ${response.status}`)
                }

            }, reason => {
                resolve(`请求失败: ${reason.error}`)
            })
        } else {
            resolve(`请先获取token`)
        }
    })

}





// time(); "2018-08-09 18:25:54"
function timeStr(time = +new Date()) {
    var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
    return date.toJSON().substr(0, 19).replace('T', ' ');
}




