// /**
//  * 翼支付.签到 
//  * APP 翼支付 左上角分省频道 签到有礼+每七日一宝箱(签到积分兑权益金 宝箱开权益金)活动截止到23.12.31
//  * 
//  * @fan 2023.4.30
//  * https://github.com/bv5204978/QXRelay/blob/master/JS/CT/yzf.ct.js
//  * 
//  * 
//  * MITM = yzfhb.ah163.net
//  * ^https:\/\/yzfhb\.ah163\.net\/yzfSign2023\/(yzfsignmessage\/generateCheckCode|yzfyearsign\/sign) url script-request-header https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/CT/yzf.ct.js
//  *
//  * 5 0 * * * https://raw.githubusercontent.com/bv5204978/QXRelay/master/JS/CT/yzf.ct.js, tag=翼支付.签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/10000.png, enabled=true
//  * 
//  */




// const taskName = '翼支付.签到'
// const key = 'FAN_yzf'

// const isRequest = typeof $request != "undefined"

// //是否开宝箱
// var isBox = false

// !(async function () {
//     if (isRequest) {
//         const msg = getToken()
//         $notify(taskName, '', msg)
//         $done({})
//     } else {
//         const msg = await sign()
//         const box = await bbox()
//         $notify(taskName, '', msg + box)
//         $done()
//     }
// })()

// function getToken() {
//     const cookieValue = $request.headers['Cookie']

//     if (cookieValue != null) {

//         const map = { 'cookie': cookieValue }
//         const str = JSON.stringify(map)
//         const svk = $prefs.setValueForKey(str, key)

//         console.log(`🅵🅰🅽\n${taskName} cookie: ${cookieValue}`)
//         return svk ? 'cookie写入成功' : 'cookie写入失败'
//     } else {
//         console.log(`🅵🅰🅽\n${taskName} cookie: ${cookieValue}`)
//         return 'cookie获取失败'
//     }
// }

// function sign() {
//     return new Promise((resolve) => {

//         const str = $prefs.valueForKey(key)

//         if (str == null) {
//             resolve(`请先获取cookie`)
//         }

//         const map = JSON.parse(str)

//         const cookieValue = map['cookie']

//         const url = 'https://yzfhb.ah163.net/yzfSign2023/yzfyearsign/sign'

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
//                 resolve(`签到失败: ${body.msg}`)
//             }
//             resolve(`签到失败: ${response.statusCode}`)

//         }, reason => {
//             console.log(`🅵🅰🅽\n${taskName} ${url} 请求失败: ${reason.error}`)
//             resolve(`请求失败: ${reason.error}`)
//         })

//     })
// }


// function bbox() {
//     return new Promise((resolve) => {

//         if (!isBox) resolve('')

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
//                 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Bestpay/10.66.80 hybridVersion/3.0 /sa-sdk-ios',
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






// /**
//  * 每周Epic游戏限免提醒。
//  * @author: Peng-YM
//  * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/epic.js
//  * 📌 注意 rsshub.app 需要代理访问，将下面的配置加到分流规则中：
//  * 1. QX
//  * host, rsshub.app, proxy
//  * !如果本地分流有了rsshub的配置， 则不需要添加此配置， 否则有几率导致任务卡死， 从而展示活跃状态。
//  * 2. Loon & Surge
//  * domain, rsshub.app, proxy
//  * 去除获取介绍的接口，接口修改为中文
//  */
// const $ = API("epic");
// checkUpdate().then(() => $done());

// async function checkUpdate() {
//     const html = await $.http.get({
//         url: "https://rsshub.app/epicgames/freegames/zh-CN"
//     })
//         .then((resp) => resp.body);
//     const itemRegex = new RegExp(/<item>[\s\S]*?<\/item>/g);
//     html.match(itemRegex).forEach(async (item) => {
//         let name = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)[1];
//         let url = item.match(/<link>([\s\S]*?)<\/link>/)[1];
//         let imgurl = item.match(/<img src=\"(.*)\" referrerpolicy/)[1];
//         let notificationURL = {
//             "open-url": url,
//             "media-url": imgurl
//         }
//         let time = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)[1];
//         let description = item.match(/<p>([\s\S]*?)<\/p>/)[1];
//         $.notify(
//             `🎮 [Epic 限免]  ${name}`,
//             `⏰ 发布时间: ${formatTime(time)}`,
//             `💡 游戏简介:\n${description}`,
//             notificationURL
//         );
//     });
// }

// function formatTime(timestamp) {
//     const date = new Date(timestamp);
//     return `${date.getFullYear()}年${
//         date.getMonth() + 1
//     }月${date.getDate()}日${date.getHours()}时`;
// }

// // prettier-ignore
// /*********************************** API *************************************/
// function ENV(){const e="undefined"!=typeof $task,t="undefined"!=typeof $loon,s="undefined"!=typeof $httpClient&&!t,i="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:e,isLoon:t,isSurge:s,isNode:"function"==typeof require&&!i,isJSBox:i,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}function HTTP(e={baseURL:""}){const{isQX:t,isLoon:s,isSurge:i,isScriptable:n,isNode:o}=ENV(),r=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;const u={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(l=>u[l.toLowerCase()]=(u=>(function(u,l){l="string"==typeof l?{url:l}:l;const h=e.baseURL;h&&!r.test(l.url||"")&&(l.url=h?h+l.url:l.url);const a=(l={...e,...l}).timeout,c={onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{},...l.events};let f,d;if(c.onRequest(u,l),t)f=$task.fetch({method:u,...l});else if(s||i||o)f=new Promise((e,t)=>{(o?require("request"):$httpClient)[u.toLowerCase()](l,(s,i,n)=>{s?t(s):e({statusCode:i.status||i.statusCode,headers:i.headers,body:n})})});else if(n){const e=new Request(l.url);e.method=u,e.headers=l.headers,e.body=l.body,f=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s})}).catch(e=>s(e))})}const p=a?new Promise((e,t)=>{d=setTimeout(()=>(c.onTimeout(),t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)),a)}):null;return(p?Promise.race([p,f]).then(e=>(clearTimeout(d),e)):f).then(e=>c.onResponse(e))})(l,u))),u}function API(e="untitled",t=!1){const{isQX:s,isLoon:i,isSurge:n,isNode:o,isJSBox:r,isScriptable:u}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>{if(o){return{fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(i||n)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),o){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache,null,2);s&&$prefs.setValueForKey(e,this.name),(i||n)&&$persistentStore.write(e,this.name),o&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root,null,2),{flag:"w"},e=>console.log(e)))}write(e,t){if(this.log(`SET ${t}`),-1!==t.indexOf("#")){if(t=t.substr(1),n||i)return $persistentStore.write(e,t);if(s)return $prefs.setValueForKey(e,t);o&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),n||i?$persistentStore.read(e):s?$prefs.valueForKey(e):o?this.root[e]:void 0)}delete(e){if(this.log(`DELETE ${e}`),-1!==e.indexOf("#")){if(e=e.substr(1),n||i)return $persistentStore.write(null,e);if(s)return $prefs.removeValueForKey(e);o&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t="",l="",h={}){const a=h["open-url"],c=h["media-url"];if(s&&$notify(e,t,l,h),n&&$notification.post(e,t,l+`${c?"\n多媒体:"+c:""}`,{url:a}),i){let s={};a&&(s.openUrl=a),c&&(s.mediaUrl=c),"{}"===JSON.stringify(s)?$notification.post(e,t,l):$notification.post(e,t,l,s)}if(o||u){const s=l+(a?`\n点击跳转: ${a}`:"")+(c?`\n多媒体: ${c}`:"");if(r){require("push").schedule({title:e,body:(t?t+"\n":"")+s})}else console.log(`${e}\n${t}\n${s}\n\n`)}}log(e){this.debug&&console.log(`[${this.name}] LOG: ${this.stringify(e)}`)}info(e){console.log(`[${this.name}] INFO: ${this.stringify(e)}`)}error(e){console.log(`[${this.name}] ERROR: ${this.stringify(e)}`)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){s||i||n?$done(e):o&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}stringify(e){if("string"==typeof e||e instanceof String)return e;try{return JSON.stringify(e,null,2)}catch(e){return"[object Object]"}}}(e,t)}
// /*****************************************************************************/
