/**
 * qx 远程引用 Js 添加 ID ，暂不可用
 * 
 * 不可考
 * 
 * 
 * MITM = raw.githubusercontent.com
 * ^https:\/\/(raw.githubusercontent|\w+\.github)\.(com|io)\/.*\.js$ url script-response-body JS/qx.id.js
 */


var body = $response.body;
body = '\/*\n@supported 5BEA7224EDC2\n*\/\n' + body;
$done(body);