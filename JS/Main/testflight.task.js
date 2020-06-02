/**
 * TestFlight车位 定时任务
 * 20.3.13
 * 
 * https://github.com/nzw9314/QuantumultX/blob/master/Script/testflight.js
 * 
 * 
 * appkey 赋值 "app公测地址key" e.g. "xxx,xxx,xxx" 
 */
/**
 * 部分key示例
 * 
 * Quantumult X   VCIvwk2g
 * LOON   23LA2tmX
 * HTTP Catcher   4Qt2lIm5   抓包
 * JSBox   fHI8igli
 * 
 * Working Copy   ZzqOu8tX
 * 1.1.1.1   QKqitFwc
 * Kitsunebi   IdFRwmNy   vpn
 * 
 * Thor   wArXdacJ,2vnRvOTX,ftCqFe6D
 * Anubis   LzjySbQx
 * 
 * Pythonista 3   qDkBu2ur
 * LastPass   fy7LvHVA
 * 
 */


 /**
 * 参考chavyleung和NobyDa的写法
 * 写入要监测的公测tf appkey，当有空位的时候会弹出通知。
 * 建议task时间间隔小点。
 */
const sy = init()
const title = 'testfilght';
const url = "https://testflight.apple.com/join/";

/**
 * 填入要监测的appkey。从testfligt地址获取。
 * 例如"VCIvwk2g,wArXdacJ,2vnRvOTX,LzjySbQx,IdFRwmNy,qDkBu2ur,4Qt2lIm5,ZzqOu8tX,ftCqFe6D,fy7LvHVA,QKqitFwc"
*/
const appkey = "VCIvwk2g,23LA2tmX,4Qt2lIm5,fHI8igli";

//是否在没有tf位置的时候仍然弹出通知，默认不弹出,防止过多无用通知。
var isNOtify = false;
const fullstr = /(此 Beta 版本的测试员已满)|(此 Beta 版本目前不接受任何新测试员)/;
const appnamereg = /<title>加入 Beta 版“(.+)” - TestFlight - Apple<\/title>/;
var proarray = new Array();
getResult();

function getResult() {
    var upstr = '已有空位，抓紧上车';
    var apps = new Array(); //定义一数组
    apps = appkey.split(","); //字符分割
    var resultstr = false;
    var logdata={};
    for (var i = 0; i < apps.length; i++) {

        var p = new Promise(function (resolve) {
            var lol = {
                url: url + apps[i],
                headers: {
                    'User-Agent': '[{"key":"User-Agent","value":" Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2357.130 Safari/537.36 qblink wegame.exe QBCore/3.70.66.400 QQBrowser/9.0.2524.400","type":"text","enabled":true,"description":""},{"key":"X-Requested-With","value":" XMLHttpRequest","type":"text","enabled":false,"description":""}]',
                },
            };
            sy.get(lol, function (error, response, data) {
                try {
                    appnamereg.test(data);
                    var appname = appnamereg.exec(data);
                    if (!appname != null) {
                        var reg = /“.+”/
                        var item = reg.exec(appname[0]);
                        var name = item[0].replace('“', '').replace('”', '');
                        if (!fullstr.test(data)) {
                            logdata[name]={
                                'has':true,
                                'context':upstr + '👉:' + lol.url + '\n'
                            }
                            resultstr=true;
                        }
                        else{
                            logdata[name]={
                                'has':false,
                                'context':':暂无车位'+'\n'
                            }
                        }
                    }
                    resolve('done');
                }
                catch (errr) {
                    resolve('done');
                }

            });
        });


        proarray[i] = p;
    }
    Promise.all(proarray).then((result) => {
        var hastr='';
        var nostr='';
        for(var name in logdata){
            if(logdata[name].has){
                hastr=hastr+'[' + name + ']'+logdata[name].context;
            }
            else{
                nostr=nostr+'[' + name + ']'+logdata[name].context;
            }
        }
        if (resultstr) {
           
            sy.msgt('', '', hastr+nostr);
        }
        else{
            if(isNOtify){
                sy.msg('', '', hastr+nostr);
            }
        }
        sy.log(hastr+nostr);
         sy.done();
    }).catch((error) => {
        sy.log(error)
    });


}


function init() {
    isSurge = () => {
      return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
      return undefined === this.$task ? false : true
    }
    getdata = (key) => {
      if (isSurge()) return $persistentStore.read(key)
      if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
      if (isSurge()) return $persistentStore.write(key, val)
      if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
      if (isSurge()) $notification.post(title, subtitle, body)
      if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
      if (isSurge()) {
        $httpClient.get(url, cb)
      }
      if (isQuanX()) {
        url.method = 'GET'
        $task.fetch(url).then((resp) => cb(null, {}, resp.body))
      }
    }
    post = (options, callback) => {
      if (isQuanX()) {
        if (typeof options == "string") options = { url: options }
        options["method"] = "POST"
        $task.fetch(options).then(response => {
          response["status"] = response.statusCode
          callback(null, response, response.body)
        }, reason => callback(reason.error, null, null))
      }
      if (isSurge()) $httpClient.post(options, callback)
    }
    done = (value = {}) => {
      $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
  }