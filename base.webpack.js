/*
更改这里的配置需要重新打包,重启mynode服务
true 为本地70服务
false 为开发环境联224
*/
var isLocal_70 = !(/production/i.test(process.env.NODE_ENV));//true;
//是否需要把代码发送给服务端用git
var sendServer = (/production/i.test(process.env.NODE_ENV));//false;
//是否需要压缩
var isUglifyJs = (/production/i.test(process.env.NODE_ENV));//false;

console.log("isLocal_70: "+isLocal_70+"=====================================");
console.log("sendServer: "+sendServer+"=====================================");
console.log("isUglifyJs: "+isUglifyJs+"=====================================");


exports.cfg = {
    //webpack使用
    isUglifyJs: isUglifyJs,
    //webpack使用   
    prefix: sendServer?"/sm/scm/":"/",
    //基础目录
    prefixCh: sendServer?"/sm/pub/":"/",
    //mynode使用
    formatUrl: (url)=>isLocal_70?("http://10.99.2.70:9098"+url.toLowerCase()):("http://172.16.8.170"+url),
}
