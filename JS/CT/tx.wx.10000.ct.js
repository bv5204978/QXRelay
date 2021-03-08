/**
 * 腾讯.微信.公众号.安徽电信.抽奖
 * 
 * @shuangfan 2020.5.19
 * https://github.com/bv5204978/QXRelay/blob/master/JS/CT/tx.wx.10000.ct.js
 * 
 * 
 * MITM = ahds.10006.info
 * ^http:\/\/ahds\.10006\.info\/ahdxcj\/cj\.do url script-request-body JS/CT/tx.wx.10000.ct.js
 * 
 * 微信.公众号.安徽电信.充值办理.领优惠券.幸运大转盘.抽奖
 */


 

var task_name = "微信.电信.抽奖"

const isRequest = typeof $request != "undefined"
// const isResponse = typeof $response != "undefined"

if (isRequest) {
    getToken()

    $done({})
} else {
    signIn()
}



function getToken() {

    const cookieVal = $request.headers['Cookie']
    const bodyVal = $request.body

    console.log(`cookieVal: ${cookieVal}\nbodyVal: ${bodyVal}`)

    var msg = "NONE"
    if (cookieVal != null && bodyVal != null) {
        let c = $prefs.setValueForKey(cookieVal, `${task_name}.cookie`)
        let b = $prefs.setValueForKey(bodyVal, `${task_name}.body`)

        if (c && b) {
            msg = `获取Cookie: 成功 \n${cookieVal}\n${bodyVal}`
        } else {
            msg = "Cookie 保存失败"
        }
    } else {
        msg = "Cookie 获取失败，可能需要更新脚本"
    }

    console.log(`${task_name}: ${msg}`)
    $notify(task_name, "", msg)
}



function signIn() {

    let cookieVal = $prefs.valueForKey(`${task_name}.cookie`)
    let bodyVal = $prefs.valueForKey(`${task_name}.body`)

    if (cookieVal == null || bodyVal == null) {

        console.log(`${task_name} 请先获取Cookie`)
        $notify(task_name, "", "请先获取Cookie")

        return
    }


    var url = {
        url: 'http://ahds.10006.info/ahdxcj/cj.do',
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: cookieVal
        },
        "body": bodyVal
    }
    
    $task.fetch(url).then(response => {
        let body = JSON.parse(response.body)

        let code = body["code"].toString()
        let result = body["result"]
        let name = body["name"]

        // if (code == 0 && result != 8) {

        // }
        
        let msg = "抽奖结果 ==> " + name
        
        console.log(`${task_name}:\n抽奖结果: 成功\n${response.body}`)
        $notify(task_name, "抽奖结果: 成功", msg)

        $done();
    }, reason => {
        console.log(`${task_name}:\n抽奖结果: 失败\n${reason.error}`)
        $notify(task_name, "抽奖结果: 失败", reason.error)

        $done();
    })
}
