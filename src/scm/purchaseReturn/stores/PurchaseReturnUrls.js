//采购退货单
import { prefix, prefixScm, prefixPub } from '../../../base/consts/UrlsConfig';
import {ReqApi} from '../../../base/services/ReqApi';
const purchasereturn = 'purchaseReturn';
const page = { page: 1, pageSize: 10 };

const PurchaseReturnUrls = {
    PURCHASERETURN_LIST:`${prefixScm}/${purchasereturn}/getList`,
    GETDETAILBYCODE:`${prefixScm}/${purchasereturn}/getDetailByCode`,
    PURCHASERETURN_DEL: `${prefixScm}/${purchasereturn}/delete`,
    ADD_PURCHASERETURN: `${prefixScm}/${purchasereturn}/add`,
    UPDATE_PURCHASERETURN: `${prefixScm}/${purchasereturn}/update`,
    PURCHASERETURN_STATUS: (status) => `${prefixScm}/${purchasereturn}/${status}`, 
    CAN_PURCHASERETURN_EDIT: `${prefixScm}/${purchasereturn}/beforeEdit`,
};
const PurchaseReturnFetch = {
    //采购退货单列表
    purchaseReturnList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${purchasereturn}/getList`,
        pm: Object.assign({},page,pm)
    }),
    //删除采购退货单
    purchaseReturnDelete: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${purchasereturn}/delete`,
        pm
    }),
    //获取单条采购退货单
    purchaseReturnDetail: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${purchasereturn}/getDetailByCode`,
        pm
    }),
    //新建采购退货单
    purchaseReturnAdd: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${purchasereturn}/add`,
        pm
    }),
    //更新采购退货单
    purchaseReturnEdit: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${purchasereturn}/update`,
        pm
    }),
   //源单号下拉
   purOrderList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/purchase/getList`,
        pm: Object.assign({},page,pm)
    }),
   //部门下拉
   deptList: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/dept/getOrgList`,
        pm: Object.assign({},page,pm)
   }),
   //员工下拉
   employeesList: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/employees/list`,
        pm: Object.assign({},page,pm)
   }),
   //站点下拉
   siteList: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/basic/site/getList`,
        pm: Object.assign({},page,pm)
   }),
   //仓库下拉
   warehouseList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/basic/getWarehouseList`,
        pm: Object.assign({},page,pm)
    }),
   //收货地址下拉
   receivingAddressList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/basic/getAddressList`,
        pm: Object.assign({},page,pm)
   }),
   //收货人下拉
   receiverList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/basic/getContactsList`,
        pm: Object.assign({},page,pm)
   }),
   //付款条件，发票类型下拉
   getSubjectList: (pm = {}) => ReqApi.post({
        url: `${prefixPub}/basic/subject/getList`,
        pm: Object.assign({},page,pm)
   }),
   //结算方式下拉
   settleList: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/basic/settle/getList`,
        pm: Object.assign({},page,pm)
   }),
    //币种下拉
    currencyList: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/basic/currency/getAll`,
        pm
    }),
    //获取当前登陆人信息
    getCurrentUser: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/login/currentUserInfo`,
        pm
    }),
    //获取采购订单详情
    purchaseDetail: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/purchase/getDetailByCode`,
        pm
    }),
    //物料单位
    materialAllUnit: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/basic/getUnitByMaterialCode`,//${prefixPub}/basic/measure/getAll
        pm
    }),
    //状态改变
    purchaseReturnStatus: (status, pm = {}) => ReqApi.get({
        url: `${prefixScm}/purchaseReturn/${status}`,
        pm,
        callBack: true
    }),
    //编码规则
    purReturnCodeRule: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/codeRule/isAuto`,
        pm
    }),
    //地址详情
    addressDetail: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/maindata/bp/getAddress`,
        pm
    }),
}
export default PurchaseReturnFetch;