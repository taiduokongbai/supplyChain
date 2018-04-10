import { prefix, prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';

const basic = 'basic';
const site = 'site';
const address = 'address';
const inventory = 'inventory';
const stock = 'stock';
const plan='plan';
const dispatchingConsole='dispatchingConsole';
const page = { page: 1, pageSize: 10 };

const PlanDisplanUrls = {
    GET_PLAN_DESK_LIST: `${prefixScm}/${plan}/${dispatchingConsole}/pageList`,//计划单列表
    DEL_PLAN_DESK_LIST: `${prefixScm}/${plan}/${dispatchingConsole}/del`,//计划单列表删除
    GET_PLAN_DESK_DETAIL: `${prefixScm}/${plan}/${dispatchingConsole}/getDetail`,//计划单详情
    GET_PLAN_DESK_DETAIL_TABLE: `${prefixScm}/${plan}/${dispatchingConsole}/distributionPageList`,//计划单详情计划明细信息
    GET_PD_LIST: `${prefixScm}/${plan}/${dispatchingConsole}/distributionPageList`,     // 计划分配表格
    GET_SALE_ORDER_LIST: `${prefixScm}/sale/getDetailListForPlan`,   // 获取有效的销售订单列表
    FIX: `${prefixScm}/${plan}/${dispatchingConsole}/fix`,     // 固定
    SAVE: `${prefixScm}/${plan}/${dispatchingConsole}/save`,    // 保存
    SUBMIT: `${prefixScm}/${plan}/${dispatchingConsole}/submit`,    // 提交
    CODE_RULE: `${prefixPub}/codeRule/isAuto`,     // 编码规则
}

const PlanDisplanFetch = {
    GET_CODE_RULE: (pm={}) => ReqApi.get({   // 计划分配表格
        url: PlanDisplanUrls.CODE_RULE,
        pm
    }),
    getPDList: (pm = {}) => ReqApi.get({   // 计划分配表格
        url: PlanDisplanUrls.GET_PD_LIST,
        pm
    }),
    getPlanDeskList: (pm = {}) => ReqApi.get({ // 计划单列表
        url: PlanDisplanUrls.GET_PLAN_DESK_LIST,
        pm
    }),
     delPlanDeskList:(pm = {}) => ReqApi.post({
        url: PlanDisplanUrls.DEL_PLAN_DESK_LIST,//计划单列表删除
        pm
    }),
     getPlanDeskDetail:(pm = {}) => ReqApi.get({
        url: PlanDisplanUrls.GET_PLAN_DESK_DETAIL,//计划单详情
        pm
    }),
    getPlanDeskDetailTable:(pm = {}) => ReqApi.get({
        url: PlanDisplanUrls.GET_PLAN_DESK_DETAIL_TABLE,//计划单详情计划明细信息
        pm
    }),
    getSaleOrderList: (pm ={}) => ReqApi.get({   // 获取有效销售订单列表
        url: PlanDisplanUrls.GET_SALE_ORDER_LIST,
        pm
    }),
    fix: (pm={}) => ReqApi.post({     // 固定
        url: PlanDisplanUrls.FIX,
        pm
    }),
    save: (pm={}) => ReqApi.post({
        url: PlanDisplanUrls.SAVE,
        pm
    }),
    submit: (pm={}) => ReqApi.post({
        url: PlanDisplanUrls.SUBMIT,
        pm
    })
}

export default PlanDisplanUrls;
export { PlanDisplanFetch };