/**
 * ??
 * 
 * ??
 * 
 * 
 * MITM = ??
 * ??
 */

 
??

中青看点极速版
https://github.com/Sunert/Scripts/blob/master/Task/youth.js

# # 解锁 TikTok (AppStore 亚8.4.0 其他14.0.0)
# api*.tiktokv.com
# (.*video_id=\w{32})(.*watermark=)(.*) url 302 $1
# (?<=(carrier|account|sys|sim)_region=)CN url 307 JP
# (?<=version_code=)\d{1,}.\d{1}\.\d{1} url 307 14.0.0