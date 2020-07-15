
/**
 * 节日提醒 定时任务
 * @shaungfan 20.7.15
 * 
 * 
 * imps 自定义节日
 * {"name":"节日名称", "start":"开始日期", "end":"结束日期(可省略)"}
 * 日期格式 xxxx-xx-xx
 */


let imps = [{"name":"霜繁的生日", "start":"2020-10-21"}]

var url = {
    url:"https://raw.githubusercontent.com/bv5204978/QXRelay/master/Api/holiday.json"
}

$task.fetch(url).then(response => {
    let data = JSON.parse(response.body)

    let imps_list = imps.concat(data)

    //当前时间
    let currDate = new Date()
    let curr = `${currDate.getFullYear()}-${("0" + (currDate.getMonth() + 1)).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`

    let currTime = new Date(curr).getTime()

    //排序
    imps_list.sort((a, b) => (new Date(a.start) - new Date(b.start)));
    
    var more = ""
    for (var i in imps_list) {
        var imp = imps_list[i]

        if (imp.end == undefined || imp.end.length == 0 || new Date(imp.end) < new Date(imp.start)) {
            imp.end = imp.start
        }

        let sTime = new Date(imp.start).getTime()
        let sDay = (sTime - currTime) / 1000 / 3600 / 24

        if (imp.start == imp.end) {
            if (sDay > 0 && sDay <= 30) {
                more = more + `\n距离【${imp.name}】还有【${sDay}】天`
            }
        } else {
            let eTime = new Date(imp.end).getTime()
            let eDay = (eTime - currTime) / 1000 / 3600 / 24

            if (sDay > 0 && sDay <= 30) {
                more = more + `\n距离【${imp.name}】还有【${sDay}】天, 为期${eDay - sDay + 1}天`
            } else if (eDay > 0) {
                more = more + `\n距离【${imp.name}】结束还有【${eDay}】天`
            }
        }
    }

    if (more.length > 0) {
        console.log(`倒数日:\n${more}`)
        // $notify("倒数日", more, "")
    }

}, reason => {
    console.log(`倒数日:\n${reason.error}`)
    $notify("倒数日", reason.error, "")
})