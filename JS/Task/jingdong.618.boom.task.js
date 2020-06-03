/**
 * 
 */

 
const $ = new Env('京东618炸弹')
$.VAL_url = $.getdata('chavy_url_jd816')
$.VAL_body = $.getdata('chavy_body_jd816')
$.VAL_headers = $.getdata('chavy_headers_jd816')

!(async () => {
  $.log('', `🔔 ${$.name}, 开始!`, '')
  await boom()
  await showmsg()
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.msg($.name, $.subt, $.desc), $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
  })

function boom() {
  return new Promise((resove) => {
    $.post(taskurl('cakebaker_pk_getCakeBomb'), (error, response, data) => {
      try {
        if (error) throw new Error(error)
        const _data = JSON.parse(data)
        const _issuc = _data.code === 0 && _data.data && _data.data.bizCode === 0
        $.boom = { isSuc: _issuc, ..._data.data.result }
        $.log('', `❕ ${JSON.stringify(data)}`, '')
      } catch (e) {
        $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, `data = ${data}`, '')
      } finally {
        resove()
      }
    })
  })
}

function taskurl(fid, body = '{}') {
  const url = { url: `https://api.m.jd.com/client.action` }
  url.headers = JSON.parse($.VAL_headers)
  url.body = `functionId=${fid}&body=${body}&client=wh5&clientVersion=1.0.0`
  return url
}

function showmsg() {
  return new Promise((resove) => {
    $.subt = `我方: ${$.boom.groupLevel || '❓'}层, 对方: ${$.boom.opponentLevel || 0}层, 炸掉: ${$.boom.destroyLevel || 0}层`
    $.desc = $.boom.tip || '提示: 无!'
    resove()
  })
}

// prettier-ignore
function Env(t){this.name=t,this.logs=[],this.isSurge=(()=>"undefined"!=typeof $httpClient),this.isQuanX=(()=>"undefined"!=typeof $task),this.log=((...t)=>{this.logs=[...this.logs,...t],t?console.log(t.join("\n")):console.log(this.logs.join("\n"))}),this.msg=((t=this.name,s="",i="")=>{this.isSurge()&&$notification.post(t,s,i),this.isQuanX()&&$notify(t,s,i),this.log("==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),t&&this.log(t),s&&this.log(s),i&&this.log(i)}),this.getdata=(t=>this.isSurge()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):void 0),this.setdata=((t,s)=>this.isSurge()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):void 0),this.get=((t,s)=>this.send(t,"GET",s)),this.wait=((t,s=t)=>i=>setTimeout(()=>i(),Math.floor(Math.random()*(s-t+1)+t))),this.post=((t,s)=>this.send(t,"POST",s)),this.send=((t,s,i)=>{if(this.isSurge()){const e="POST"==s?$httpClient.post:$httpClient.get;e(t,(t,s,e)=>{s.body=e,s.statusCode=s.status,i(t,s,e)})}this.isQuanX()&&(t.method=s,$task.fetch(t).then(t=>{t.status=t.statusCode,i(null,t,t.body)},t=>i(t.error,t,t)))}),this.done=((t={})=>$done(t))}