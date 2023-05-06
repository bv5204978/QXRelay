/**
 * 安徽电信公众号.签到
 * 微信公众号 安徽电信 福利专区 个人中心 签到有礼(签到金币兑流量)
 * 
 * 
 * @fan 2023.5.3
 * https://github.com/bv5204978/QXRelay/blob/master/JS/CT/ah10000wx.ct.js
 * 
 * 
 * MITM = wx.ah.189.cn
 * https:\/\/wx\.ah\.189\.cn\/hd\/ahwxboot\/qdyl\/qd url script-request-body https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/CT/ah10000wx.ct.js
 * 
 * 5 0 * * * https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/CT/ah10000wx.ct.js, tag=安徽电信公众号.签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/10000.png, enabled=true
 * 
 */




const taskName = '安徽10000WX.签到'
const key = 'FAN_ah10000wx'

const isRequest = typeof $request != "undefined"


!(async function () {
    if (isRequest) {
        const msg = getToken()
        $notify(taskName, '', msg)
        $done({})
    } else {
        const msg = await sign()
        $notify(taskName, '', msg)
        $done()
    }
})()

function getToken() {
    const cookieValue = $request.headers['Cookie']
    const bodyValue = $request.body

    if (cookieValue != null && bodyValue != null) {

        const map = { 'cookie': cookieValue, 'body': bodyValue}
        const str = JSON.stringify(map)
        const svk = $prefs.setValueForKey(str, key)

        console.log(`🅵🅰🅽\n${taskName} cookie: ${cookieValue} body: ${bodyValue}`)
        return svk ? 'cookie&body写入成功' : 'cookie&body写入失败'
    } else {
        console.log(`🅵🅰🅽\n${taskName} cookie: ${cookieValue} body: ${bodyValue}`)
        return 'cookie&body获取失败'
    }
}

function sign() {
    return new Promise((resolve) => {

        const str = $prefs.valueForKey(key)

        if (str == null) {
            resolve(`请先获取cookie&body`)
        }

        const map = JSON.parse(str)

        const cookieValue = map['cookie']
        const bodyValue = map['body']

        const url = 'https://wx.ah.189.cn/hd/ahwxboot/qdyl/qd'

        const req = {
            url: url,
            method: 'POST',
            headers: {
                'Content-Type' : `application/x-www-form-urlencoded; charset=UTF-8`,
                'Cookie': cookieValue,
            },
            body: bodyValue
        }

        $task.fetch(req).then(response => {
            console.log(`🅵🅰🅽\n${taskName} ${url} 请求成功: ${response.body}`)

            if (response.statusCode == 200) {
                const body = JSON.parse(response.body)

                if (body.code == 200) {
                    resolve(`签到成功`)
                }
                resolve(`签到失败: ${body.msg}`)
            }
            resolve(`签到失败: ${response.statusCode}`)

        }, reason => {
            console.log(`🅵🅰🅽\n${taskName} ${url} 请求失败: ${reason.error}`)
            resolve(`请求失败: ${reason.error}`)
        })

    })
}
