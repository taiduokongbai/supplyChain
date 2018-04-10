import { prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';

const selfmadecomponentputInv = 'selfmadecomponentputInv';
const basic = 'basic';
const page = { page: 1, pageSize: 10 };

const SelfMadeInUrls = {
    SELF_MADE_IN_LIST: `${prefixScm}/${selfmadecomponentputInv}/getList`,
    SELF_MADE_IN_DETAIL: `${prefixScm}/${selfmadecomponentputInv}/get`,
    SELF_MADE_IN_ADD: `${prefixScm}/${selfmadecomponentputInv}/add`,
    SELF_MADE_IN_EDIT: `${prefixScm}/${selfmadecomponentputInv}/update`,
    SELF_MADE_IN_DEL: `${prefixScm}/${selfmadecomponentputInv}/delete`,
    SELF_MADE_IN_CLOSE: `${prefixScm}/${selfmadecomponentputInv}/close`,
    SELF_MADE_IN_RECEIVE: `${prefixScm}/${selfmadecomponentputInv}/receive`,
    SELF_MADE_IN_PRE_RECEIVE_ADD: `${prefixScm}/${selfmadecomponentputInv}/addPreReceive`,
    SELF_MADE_IN_PRE_RECEIVE_DEL: `${prefixScm}/${selfmadecomponentputInv}/deletePreReceive`,
    SELF_MADE_IN_SALE_LIST: `${prefixScm}/${selfmadecomponentputInv}/getSaleOrderList`,
    SELF_MADE_IN_PLAN_LIST: `${prefixScm}/${selfmadecomponentputInv}/getPlanDisConsoleList`,
    SELF_MADE_IN_PLAN_DETAIL: `${prefixScm}/${selfmadecomponentputInv}/getPlanDisConsoleDetail`,
    ISAUTO: `${prefixPub}/codeRule/isAuto`,
    RECEIVE_LOG_LIST: `${prefixScm}/${basic}/getReceiveList`,
    GET_UNLOCK_LIST_FORIN: `${prefixScm}/inventory/freightSpace/getUnlockListForIn`, // 根据仓库编码获取仓位

};

export default SelfMadeInUrls ;

const SelfMadeInFetch = {
    //列表
    selfMadeInList: (pm = {}) => ReqApi.get({
        url: SelfMadeInUrls.SELF_MADE_IN_LIST,
        pm: Object.assign({}, page, pm)
    }),
    //删除
    selfMadeInDelete: (pm = {}) => ReqApi.post({
        url: SelfMadeInUrls.SELF_MADE_IN_DEL,
        pm
    }),
    //详情
    selfMadeInDetail: (pm = {}) => ReqApi.get({
        url: SelfMadeInUrls.SELF_MADE_IN_DETAIL,
        pm
    }),
    //新增
    selfMadeInAdd: (pm = {}) => ReqApi.post({
        url: SelfMadeInUrls.SELF_MADE_IN_ADD,
        pm
    }),
    //编辑
    selfMadeInEdit: (pm = {}) => ReqApi.post({
        url: SelfMadeInUrls.SELF_MADE_IN_EDIT,
        pm
    }),
    //关闭
    selfMadeInClose: (pm = {}) => ReqApi.post({
        url: SelfMadeInUrls.SELF_MADE_IN_CLOSE,
        pm
    }),
    //来源订单
    selfMadeInSaleList: (pm = {}) => ReqApi.get({
        url: SelfMadeInUrls.SELF_MADE_IN_SALE_LIST,
        pm: Object.assign({}, page, pm)
    }),
    //计划单列表
    planOrderList: (pm = {}) => ReqApi.get({
        url: SelfMadeInUrls.SELF_MADE_IN_PLAN_LIST,
        pm: Object.assign({}, page, pm)
    }),
    //计划单明细
    planOrderDetail: (pm = {}) => ReqApi.get({
        url: SelfMadeInUrls.SELF_MADE_IN_PLAN_DETAIL,
        pm
    }),
    //编码规则
    codeRule: (pm = {}) => ReqApi.get({
        url: SelfMadeInUrls.ISAUTO,
        pm
    }),
    //收货记录
    receiveLog: (pm = {}) => ReqApi.get({
        url: SelfMadeInUrls.RECEIVE_LOG_LIST,
        pm
    }),
    //预收货新增
    selfMadeInPreReceiveAdd: (pm = {}) => ReqApi.post({
        url: SelfMadeInUrls.SELF_MADE_IN_PRE_RECEIVE_ADD,
        pm
    }),
    //预收货删除
    selfMadeInPreReceiveDel: (pm = {}) => ReqApi.post({
        url: SelfMadeInUrls.SELF_MADE_IN_PRE_RECEIVE_DEL,
        pm
    }),
    //收货
    selfMadeInReceive: (pm = {}) => ReqApi.post({
        url: SelfMadeInUrls.SELF_MADE_IN_RECEIVE,
        pm
    }),
    //仓位
    getUnlockListForIn: (pm = {}) => ReqApi.post({
        url: SelfMadeInUrls.GET_UNLOCK_LIST_FORIN,
        pm
    }),
}
export { SelfMadeInFetch }