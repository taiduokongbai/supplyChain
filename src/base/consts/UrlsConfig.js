
const cfg = __baseConfig__;
/*const prefix = window.LUX_URL || 'http://172.16.8.235:9099'; //服务器*/
// const prefix = window.LUX_URL || 'http://172.16.8.235:9099'; //服务器
const prefix = window.LUX_URL || 'http://localhost:9099'; //服务器
const prefixScm = prefix + '/scm'; //服务器
const prefixPub = prefix + '/pub'; //服务器
const prefixEc = prefix + '/ec'; //服务器
const prefixEcWeb = window.LUX_EC_WEB + '/mwc2m-ec-web'; //电商前台导购
const prefixEcf = prefix + '/sm/ecf'; //服务器
const prefix_route = window.LUX_ROUTE || ''; //打包专用

const prefixCh = cfg.prefixCh;

const prefixMsgScm = prefix + cfg.prefixScm; //首页消息提醒
const prefixMsgPub = prefix + cfg.prefixCh; //首页消息提醒
const prefixMsgEc = prefix + cfg.prefixEc; //首页消息提醒
const prefixMsgOa = prefix + cfg.prefixOa; //首页消息提醒



export { prefix, prefixScm, prefixPub, prefixEc, prefix_route, prefixCh, prefixEcWeb, prefixMsgScm, prefixMsgPub, prefixMsgEc, prefixMsgOa, prefixEcf };