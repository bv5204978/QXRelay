/**
 * 腾讯.微信.小程序.安徽电信.查询
 * 
 * @shuangfan 2020.9.3
 * https://github.com/bv5204978/QXRelay/blob/master/JS/CT/tx.wx.10000q.ct.js
 * 
 * 
 * MITM = ahxcx.10006.info
 * ^http:\/\/ahxcx\.10006\.info\/xcxahwx\/detailinfo2\.do url script-request-body JS/CT/tx.wx.10000q.ct.js
 * 
 * 微信.公众号.小程序.安徽电信.查询
 */




var task_name = "微信.电信.查询"

const isRequest = typeof $request != "undefined"
// const isResponse = typeof $response != "undefined"

if (isRequest) {
    getToken()

    $done({})
} else {
    signIn()
}



function getToken() {

    // const cookieVal = $request.headers['Cookie']
    const urlVal = $request.url

    console.log(`urlVal: ${urlVal}`)

    var msg = "NONE"
    let b = $prefs.setValueForKey(urlVal, `${task_name}.url`)

    if (b) {
        msg = `查询Url保存成功 \n${urlVal}`
    } else {
        msg = "查询Url保存失败"
    }

    console.log(`${task_name}: ${msg}`)
    $notify(task_name, "", msg)
}



function signIn() {

    let urlVal = $prefs.valueForKey(`${task_name}.url`)

    if (urlVal == null) {

        console.log(`${task_name} 请先获取Url`)
        $notify(task_name, "", "请先获取Url")

        return
    }


    var url = {
        url: urlVal,
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }
    }

    $task.fetch(url).then(response => {
        let body = JSON.parse(response.body)

        let ll = data.object.ll.ll[1]
        
        let msg = `话费  已用:${body.object.leftFlow} 余额:${body.object.leftBalance}\n流量  已用:${ll.ratable_total}${ll.ratable_used} 剩余:${ll.ratable_left}${ll.ratable_unit}`

        console.log(`${task_name}:\n查询成功\n${response.body}`)
        $notify(task_name, "", msg)
    }, reason => {
        console.log(`${task_name}:\n查询失败\n${reason.error}`)
        $notify(task_name, "查询失败", reason.error)
    })
}