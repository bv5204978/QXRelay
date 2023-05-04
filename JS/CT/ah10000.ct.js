/**
 * 安徽掌上10000 
 * APP 安徽掌上10000 1.权益会员翻牌周三四五(流量)
 * 
 * 
 * @fan 2023.5.3
 * https://github.com/bv5204978/QXRelay/blob/master/JS/CT/ah10000.ct.js
 * 
 * 
 * MITM = qy.ah.189.cn
 * ^https:\/\/qy\.ah\.189\.cn\/member\/qyMemberDay\/index\.html url script-request-header https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/CT/ah10000.ct.js
 * 
 * 5 0 * * * https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/CT/ah10000.ct.js, tag=安徽掌上10000, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/10000.png, enabled=true
 * 
 */




const taskName = '安徽10000'
const key = 'FAN_ah10000'

const isRequest = typeof $request != "undefined"


!(async function () {
    if (isRequest) {
        const msg = getToken()
        $notify(taskName, '', msg)
        $done({})
    } else {

        let date = new Date()
        const weekday = date.getDay()
        if (weekday >= 3 && weekday <= 5) {
            const lotterymsg = await lottery()
            $notify(taskName, '', lotterymsg)
        }

        $done()
    }
})()

function getToken() {
    const cookieValue = $request.headers['Cookie']

    if (cookieValue != null) {

        const map = { 'cookie': cookieValue, 'referer': $request.url }
        const str = JSON.stringify(map)
        const svk = $prefs.setValueForKey(str, key)

        console.log(`🅵🅰🅽\n${taskName} cookie: ${cookieValue}`)
        return svk ? 'cookie写入成功' : 'cookie写入失败'
    } else {
        console.log(`🅵🅰🅽\n${taskName} cookie: ${cookieValue}`)
        return 'cookie获取失败'
    }
}

// 权益会员
function lottery() {
    return new Promise((resolve) => {

        const str = $prefs.valueForKey(key)

        if (str == null) {
            resolve(`请先获取cookie`)
        }

        const map = JSON.parse(str)

        const cookieValue = map['cookie']
        const refererValue = map['referer']

        const url = 'https://qy.ah.189.cn/member/qyMemberDay/lottery'

        const req = {
            url: url,
            method: 'POST',
            headers: {
                'Cookie': cookieValue,
                'Referer': refererValue
            },
            body: ''
        }

        $task.fetch(req).then(response => {
            console.log(`🅵🅰🅽\n${taskName} ${url} 请求成功: ${response.body}`)

            if (response.statusCode == 200) {
                const body = JSON.parse(response.body)

                if (body.code == 200) {
                    resolve(`${body.msg}`)
                }
                resolve(`翻牌失败: ${body.msg}`)
            }
            resolve(`翻牌失败: ${response.statusCode}`)

        }, reason => {
            console.log(`🅵🅰🅽\n${taskName} ${url} 请求失败: ${reason.error}`)
            resolve(`请求失败: ${reason.error}`)
        })

    })
}



// function tempSign() {
//     return new Promise((resolve) => {

//         const str = $prefs.valueForKey(key)

//         if (str == null) {
//             resolve(`请先获取cookie`)
//         }

//         const map = JSON.parse(str)

//         const cookieValue = map['cookie']
//         const refererValue = map['referer']

//         const url = 'https://qy.ah.189.cn/member/gardenParty/doSign'

//         const req = {
//             url: url,
//             method: 'POST',
//             headers: {
//                 'Cookie': cookieValue,
//                 'Referer': refererValue
//             },
//             body: ''
//         }

//         $task.fetch(req).then(response => {
//             console.log(`🅵🅰🅽\n${taskName} ${url} 请求成功: ${response.body}`)

//             if (response.statusCode == 200) {
//                 const body = JSON.parse(response.body)

//                 if (body.code == 200) {
//                     resolve(`${body.msg}`)
//                 }
//                 resolve(`翻牌失败: ${body.msg}`)
//             }
//             resolve(`翻牌失败: ${response.statusCode}`)

//         }, reason => {
//             console.log(`🅵🅰🅽\n${taskName} ${url} 请求失败: ${reason.error}`)
//             resolve(`请求失败: ${reason.error}`)
//         })

//     })
// }




// function bbox() {
//     return new Promise((resolve) => {

//         if (!isBox) resolve()

//         const str = $prefs.valueForKey(key)

//         if (str == null) {
//             resolve(`请先获取cookie`)
//         }

//         const map = JSON.parse(str)

//         const cookieValue = map['cookie']

//         const url = 'https://yzfhb.ah163.net/yzfSign2023/yzfyearsign/receiveLxBx'

//         const req = {
//             url: url,
//             method: 'GET',
//             headers: {
//                 'Cookie': cookieValue,
//             },
//             body: ''
//         }

//         $task.fetch(req).then(response => {
//             console.log(`🅵🅰🅽\n${taskName} ${url} 请求成功: ${response.body}`)

//             if (response.statusCode == 200) {
//                 const body = JSON.parse(response.body)

//                 if (body.code == 200) {
//                     box = body.lxxb + 1 >= 7
//                     resolve(`${body.msg}`)
//                 }
//                 resolve(`开宝箱失败: ${body.msg}`)
//             }
//             resolve(`开宝箱失败: ${response.statusCode}`)

//         }, reason => {
//             console.log(`🅵🅰🅽\n${taskName} ${url} 请求失败: ${reason.error}`)
//             resolve(`开宝箱请求失败: ${reason.error}`)
//         })

//     })
// }
