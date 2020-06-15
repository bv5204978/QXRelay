/**
 * 
 */

 
const $ = new Env('京东618')
$.VAL_url = $.getdata('chavy_url_jd816')
$.VAL_body = $.getdata('chavy_body_jd816')
$.VAL_headers = $.getdata('chavy_headers_jd816')
$.VAL_isSignShop = $.getdata('CFG_618_isSignShop') || 'true'
$.VAL_isJoinBrand = $.getdata('CFG_618_isJoinBrand') || 'false'
$.VAL_radommsMin = $.getdata('CFG_618_radomms_min') || '2000'
$.VAL_radommsMax = $.getdata('CFG_618_radomms_max') || '5000'

!(async () => {
  $.log('', `🔔 ${$.name}, 开始!`, '')
  await getData()
  await getActs()
  await getShops()
  await execActs()
  showmsg()
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.msg($.name, $.subt, $.desc), $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
  })

function getData() {
  return new Promise((resove) => {
    $.post(taskurl('cakebaker_getHomeData'), (error, response, data) => {
      try {
        if (error) throw new Error(error)
        const _info = JSON.parse(data).data.result.cakeBakerInfo
        $.secretp = _info.secretp
        if (!$.secretp) throw new Error('获取 secretp 失败!')
        $.log(`❕ ${$.name}, 获取密钥!`)
        $.log(`   密钥 = ${$.secretp.slice(0, 10)}...`)
        $.log(`   等级 = ${_info.raiseInfo.scoreLevel}`)
        $.log(`   分数 = ${_info.raiseInfo.totalScore} => ${_info.raiseInfo.nextLevelScore}`)
        $.log(`   延时 = ${$.VAL_radommsMin} => ${$.VAL_radommsMax} 毫秒`, '')
      } catch (e) {
        $.log(`❗️ ${$.name}, 获取密钥!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, `data = ${data}`, '')
      } finally {
        resove()
      }
    })
  })
}

function getShops() {
  return new Promise((resove) => {
    $.post(taskurl('cakebaker_bigBrandHomeData'), (error, response, data) => {
      try {
        $.log(`❕ ${$.name}, 获取商店!`)
        if (error) throw new Error(error)
        $.shopActs = []
        JSON.parse(data).data.result.bigBrandList.forEach((_shopa) => {
          const _shopact = {
            _raw: _shopa,
            id: _shopa.venderId,
            name: _shopa.name
          }
          $.shopActs.push(_shopact)
        })
        $.log(`   商店数量 = ${$.shopActs.length}`, '')
      } catch (e) {
        $.log(`❗️ ${$.name}, 获取商店!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, `data = ${data}`, '')
      } finally {
        resove()
      }
    })
  })
}

function getActs() {
  return new Promise((resove) => {
    $.post(taskurl('cakebaker_getTaskDetail'), (error, response, data) => {
      try {
        $.log(`❕ ${$.name}, 获取活动!`)
        if (error) throw new Error(error)
        $.acts = []
        JSON.parse(data).data.result.taskVos.forEach((_a) => {
          const _act = {
            _raw: _a,
            id: _a.taskId,
            name: _a.taskName,
            times: _a.times,
            maxTimes: _a.maxTimes,
            waitDuration: _a.waitDuration === 0 ? 1 : _a.waitDuration,
            isProd: _a.productInfoVos ? true : false,
            isBrand: _a.shoppingActivityVos && _a.taskId === 42 ? true : false,
            tasks: []
          }
          const _vo = _a[Object.keys(_a).find((key) => (_a[key] && _a[key].itemId) || (_a[key] && _a[key][0] && _a[key][0].itemId))]
          if (Array.isArray(_vo)) {
            _vo.forEach((_task) => _act.tasks.push({ _raw: _task, id: _task.itemId, name: _task.title || _task.shopName || _task.taskName || '未知名称' }))
          } else {
            _act.tasks = Array(_act.maxTimes - _act.times).fill({ _raw: _vo, id: _vo.itemId, name: _act.name })
          }
          $.acts.push(_act)
        })
        if (!$.acts) throw new Error('获取活动失败!')
        $.log(`   活动数量 = ${$.acts.length}`, '')
      } catch (e) {
        $.log(`❗️ ${$.name}, 获取活动!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, `data = ${data}`, '')
      } finally {
        resove()
      }
    })
  })
}

async function execActs() {
  $.log(`❕ ${$.name}, 执行活动!`)
  for (let _actIdx = 0; _actIdx < $.acts.length; _actIdx++) {
    const _act = $.acts[_actIdx]
    $.log(`   ${_actIdx + 1}. ${_act.name} (${_act.times}/${_act.maxTimes})`)
    if (_act.times === _act.maxTimes) {
      $.log(`      @跳过: 全部完成!`, '')
      continue
    }
    // 跳过：邀请好友、加入战队
    if ([2, 12].includes(_act.id)) {
      $.log('      跳过!', '')
      continue
    }
    // 甄选优品
    else if (_act.isProd) {
      await getProdAct(_act)
      for (let subactIdx = 0; subactIdx < _act.subacts.length; subactIdx++) {
        const subact = _act.subacts[subactIdx]
        $.log(`      ${subactIdx + 1}. ${subact.name} (${subact.times}/${subact.maxTimes})`)
        if (subact.times === subact.maxTimes) {
          $.log(`         @跳过: 全部完成!`, '')
          continue
        }
        for (let subataskIdx = 0; subataskIdx < subact.tasks.length; subataskIdx++) {
          const subatask = subact.tasks[subataskIdx]
          $.log(`         ${subataskIdx + 1}. ${subatask.name.slice(0, 15)}...`)
          if (subatask._raw.status && subatask._raw.status === 2) {
            $.log(`         @跳过: 已经做过!`, '')
            continue
          }
          await sendtask(subact, subatask, true)
          $.log(`         @认领任务: ${subatask.isClaimSuc ? '🟢' : '🔴'}`)
          if (subatask.isskip) {
            $.log(`         @跳过: ${subatask.msg}`)
            const randomms = genRadomms()
            $.log(`         @等待: 8 秒 + ${randomms} 毫秒`, '')
            await new Promise($.wait(8000 + randomms))
          } else {
            const randomms = genRadomms()
            $.log(`         @等待: ${subact.waitDuration} 秒 + ${randomms} 毫秒`)
            await new Promise($.wait(subact.waitDuration * 1000 + randomms))
            await sendtask(subact, subatask)
            $.log(`         @完成任务: ${subatask.isExecSuc ? '🟢' : '🔴'}`)
            $.log(`         @等待: 5 秒 + ${randomms} 毫秒`, '')
            await new Promise($.wait(5000 + randomms))
          }
        }
      }
    }
    // 开通会员
    else if (_act.isBrand) {
      if ($.VAL_isJoinBrand === 'true' || $.VAL_isJoinBrand === true) {
        for (let taskIdx = 0; taskIdx < _act.tasks.length; taskIdx++) {
          const task = _act.tasks[taskIdx]
          $.log(`      ${taskIdx + 1}. ${task.name}`)
          await joinBrand(task)
          $.log(`         @加入会员: ${task.isJoinSuc ? '🟢' : '🔴'}`)
          const randomms = genRadomms()
          $.log(`         @等待: ${_act.waitDuration} 秒 + ${randomms} 毫秒`)
          await new Promise($.wait(_act.waitDuration * 1000 + randomms))
          await brandAward(task)
          $.log(`         @完成任务: ${task.isAwardSuc ? '🟢' : '🔴'}`)
          $.log(`         @等待: 5 秒 + ${randomms} 毫秒`, '')
          await new Promise($.wait(5000 + randomms))
        }
      } else {
        $.log(`         @跳过: BoxJs 设置为 关闭 品牌会员!`, '')
      }
    }
    // 普通任务
    else {
      for (let taskIdx = 0; taskIdx < _act.tasks.length; taskIdx++) {
        const task = _act.tasks[taskIdx]
        $.log(`      ${taskIdx + 1}. ${task.name}`)
        if (task._raw.status && task._raw.status === 2) {
          $.log(`         @跳过: 已经做过!`, '')
          continue
        }
        await sendtask(_act, task, true)
        $.log(`         @认领任务: ${task.isClaimSuc ? '🟢' : '🔴'}`)
        if (task.isskip || task.ishot) {
          $.log(`         @跳过: ${task.msg}`)
          const randomms = genRadomms()
          $.log(`         @等待: 8 秒 + ${randomms} 毫秒`, '')
          await new Promise($.wait(8000 + randomms))
        } else {
          const randomms = genRadomms()
          $.log(`         @等待: ${_act.waitDuration} 秒 + ${randomms} 毫秒`)
          await new Promise($.wait(_act.waitDuration * 1000 + randomms))
          await sendtask(_act, task)
          $.log(`         @完成任务: ${task.isExecSuc ? '🟢' : '🔴'}`)
          $.log(`         @等待: 5 秒 + ${randomms} 毫秒`, '')
          await new Promise($.wait(5000 + randomms))
        }
      }
    }
  }

  // 商店签到
  $.log(`   ${$.acts.length + 1}. 商店签到 (${$.shopActs.length})`)
  if ($.VAL_isSignShop === 'true' || $.VAL_isSignShop === true) {
    for (let _shopIdx = 0; _shopIdx < $.shopActs.length; _shopIdx++) {
      const shop = $.shopActs[_shopIdx]
      $.log(`      ${_shopIdx + 1}. ${shop.name}`)
      await signshop(shop)
      shop.msg = /,/.test(shop.msg) ? shop.msg.split(',')[1] : shop.msg
      $.log(`         @签到: ${shop.isSuc ? '🟢 已领取!' : shop.code === 402 ? '⚪️ 无效活动!' : `🔴 ${shop.msg}`}`)
      const randomms = genRadomms()
      $.log(`         @等待: 8 秒 + ${randomms} 毫秒`, '')
      await new Promise($.wait(8000 + randomms))
    }
  } else {
    $.log(`         @跳过: BoxJs 设置为 关闭 商店签到!`, '')
  }
}

// 商品类活动
function getProdAct(act) {
  return new Promise((resove) => {
    const body = { taskIds: act.tasks.map((task) => task.id).toString() }
    $.post(taskurl('cakebaker_getFeedDetail', JSON.stringify(body)), (error, response, data) => {
      try {
        const _result = JSON.parse(data).data.result
        const _vo = _result[Object.keys(_result).find((key) => Array.isArray(_result[key] && _result[key][0] && _result[key][0].productInfoVos))]
        act.subacts = []
        _vo.forEach((_suba) => {
          const _subact = {
            _raw: _suba,
            id: _suba.taskId,
            name: _suba.taskName,
            times: _suba.times,
            maxTimes: _suba.maxTimes,
            waitDuration: _suba.waitDuration === 0 ? 1 : _suba.waitDuration,
            isProd: _suba.productInfoVos ? true : false,
            tasks: []
          }
          _suba.productInfoVos.slice(0, 5).forEach((_prodvo) => {
            const _taskname = _prodvo.skuName || _prodvo.title || _prodvo.shopName || _prodvo.taskName || '未知名称'
            _subact.tasks.push({
              _raw: _prodvo,
              id: _prodvo.itemId,
              name: _taskname
            })
          })
          act.subacts.push(_subact)
        })
      } catch (e) {
        $.log(`❗️ ${$.name}, 执行商品类活动!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, `data = ${data}`, '')
      } finally {
        resove()
      }
    })
  })
}

function sendtask(act, task, isClaim = false) {
  return new Promise((resove) => {
    const body = {
      taskId: act.id,
      itemId: task.id,
      actionType: isClaim ? 1 : undefined,
      safeStr: JSON.stringify({ secretp: $.secretp })
    }
    $.post(taskurl('cakebaker_ckCollectScore', JSON.stringify(body)), (error, response, data) => {
      try {
        const _data = JSON.parse(data)
        const _issuc = _data.data.bizCode === 0 || _data.data.bizCode === -5 || _data.data.bizCode === -15
        if (isClaim) task.isClaimSuc = _issuc
        else task.isExecSuc = _issuc
        task.isskip = _data.data.bizCode === -5
        task.ishot = _data.data.bizCode === -15
        task.msg = _data.data.bizMsg || '无'
      } catch (e) {
        if (isClaim) task.isClaimSuc = false
        else task.isExecSuc = false
        task.isskip = false
        task.ishot = false
        task.msg = error || e
      } finally {
        resove()
      }
    })
  })
}

function signshop(shop) {
  return new Promise((resove) => {
    const body = { channel: 2, venderId: shop.id }
    $.post(taskurl('interact_center_sign_collectGift', JSON.stringify(body)), (error, response, data) => {
      try {
        const _data = JSON.parse(data)
        shop.isSuc = _data.code === 407000005 || _data.code === 200 ? true : false
        shop.code = _data.code
        shop.msg = _data.msg
      } catch (e) {
        shop.isSuc = false
        shop.msg = error || e
      } finally {
        resove()
      }
    })
  })
}

function joinBrand(task) {
  return new Promise((resove) => {
    const body = {
      venderId: task._raw.copy1,
      shopId: task._raw.copy1,
      bindByVerifyCodeFlag: 1,
      registerExtend: {},
      writeChildFlag: 0,
      channel: 4032
    }
    const joinurl = `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=${encodeURIComponent(JSON.stringify(body))}&client=H5&clientVersion=8.5.6&uuid=88888`
    const url = { url: joinurl, headers: JSON.parse($.VAL_headers) }
    delete url.headers['Content-Length']
    $.get(url, (error, response, data) => {
      try {
        const _data = JSON.parse(data)
        task.isJoinSuc = _data.busiCode === '0'
        task.msg = _data.message || '无'
      } catch (e) {
        task.isJoinSuc = false
        task.msg = error || e
      } finally {
        resove()
      }
    })
  })
}
function brandAward(task) {
  return new Promise((resove) => {
    const body = { venderId: task._raw.copy1, itemId: task.id }
    $.post(taskurl('cakebaker_taskBigBrandAward', JSON.stringify(body)), (error, response, data) => {
      try {
        const _data = JSON.parse(data)
        const _issuc = _data.data.bizCode === 0 || _data.data.bizCode === -5 || _data.data.bizCode === -15
        task.isAwardSuc = _issuc
        task.msg = _data.data.bizMsg || '无'
      } catch (e) {
        task.isAwardSuc = false
        task.msg = error || e
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

function genRadomms() {
  const max = $.VAL_radommsMax * 1
  const min = $.VAL_radommsMin * 1
  return parseInt(Math.random() * (max - min + 1) + min, 10)
}

function showmsg() {}

// prettier-ignore
function Env(t){this.name=t,this.logs=[],this.isSurge=(()=>"undefined"!=typeof $httpClient),this.isQuanX=(()=>"undefined"!=typeof $task),this.log=((...t)=>{this.logs=[...this.logs,...t],t?console.log(t.join("\n")):console.log(this.logs.join("\n"))}),this.msg=((t=this.name,s="",i="")=>{this.isSurge()&&$notification.post(t,s,i),this.isQuanX()&&$notify(t,s,i);const e=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t&&e.push(t),s&&e.push(s),i&&e.push(i),console.log(e.join("\n"))}),this.getdata=(t=>this.isSurge()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):void 0),this.setdata=((t,s)=>this.isSurge()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):void 0),this.get=((t,s)=>this.send(t,"GET",s)),this.wait=((t,s=t)=>i=>setTimeout(()=>i(),Math.floor(Math.random()*(s-t+1)+t))),this.post=((t,s)=>this.send(t,"POST",s)),this.send=((t,s,i)=>{if(this.isSurge()){const e="POST"==s?$httpClient.post:$httpClient.get;e(t,(t,s,e)=>{s&&(s.body=e,s.statusCode=s.status),i(t,s,e)})}this.isQuanX()&&(t.method=s,$task.fetch(t).then(t=>{t.status=t.statusCode,i(null,t,t.body)},t=>i(t.error,t,t)))}),this.done=((t={})=>$done(t))}