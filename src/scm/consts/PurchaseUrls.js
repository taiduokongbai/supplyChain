//采购订单
import { prefix, prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import {ReqApi} from '../../base/services/ReqApi';
const purchase = 'purchase';
const dept = 'dept';
const basic = 'basic';
const page  = { page: 1, pageSize: 10 };

const PurchaseUrls = {
    PURCHASE_LIST:`${prefixScm}/${purchase}/getList`,
    GETDETAILBYCODE:`${prefixScm}/${purchase}/getDetailByCode`,
    PURCHASE_DEL:`${prefixScm}/${purchase}/delete`,
    COSTCENTER_LIST:`${prefixPub}/${dept}/getOrgList`,
    GET_CONTACTLIST:`${prefixScm}/${basic}/getContactsList`,
    GET_SHIPPINGADDRESS_LIST:`${prefixScm}/${basic}/getAddressList`,
    GET_SUPPLIER_LIST:`${prefixScm}/${basic}/getSupplierList`,
    GET_MEASURELIST: `${prefixPub}/basic/measure/getAll`,
    ISBUYER: `${prefixScm}/${purchase}/currentUserIsBuyer`,
    GET_MATERIALLIST: `${prefixScm}/${basic}/getMaterialOrList`,
    ADD_PURCHASE: `${prefixScm}/${purchase}/add`,
    CAN_PURCHASE_EDIT: `${prefixScm}/${purchase}/beforeEdit`,
    UPDATE_PURCHASE: `${prefixScm}/${purchase}/update`,
    PURCHASE_STATUS: (status) => `${prefixScm}/${purchase}/${status}`,
    CURRENTUSERINFO: `${prefixPub}/login/currentUserInfo`,
    SETTLELIST: `${prefixPub}/${basic}/settle/getList`,
    GET_RECEIVEADDRESS_LIST: `${prefixPub}/${basic}/address/getSaleOrderAddress`,
    GET_EXPENSELIST: `${prefixPub}/${basic}/price/getAll`,
    SITE_DETAIL: `${prefixPub}/${basic}/site/getSiteByCode`,
    GET_MATERIALLUNIT: `${prefixScm}/basic/getUnitByMaterialCode`,
    GET_ADDRESSDETAIL: `${prefixScm}/maindata/bp/getAddress`,
};
const PurchaseFetch = {
    //采购订单列表
    purchaseList: (pm = {}) => ReqApi.get({
        url: PurchaseUrls.PURCHASE_LIST,
        pm: Object.assign({},page,pm)
    }),
    //删除采购订单
    purchaseDelete: (pm = {}) => ReqApi.get({
        url: PurchaseUrls.PURCHASE_DEL,
        pm
    }),
    //获取单条采购订单
    purchaseDetail: (pm = {}) => ReqApi.get({
        url: PurchaseUrls.GETDETAILBYCODE,
        pm
    }),
    //供应商下拉列表
    supplierList:(pm = {}) => ReqApi.post({
        url: PurchaseUrls.GET_SUPPLIER_LIST,
        pm: Object.assign({},page,pm)
    }),
    //采购组织下拉列表
    purOrgList: (pm = {}) => ReqApi.get({
        url: PurchaseUrls.COSTCENTER_LIST,
        pm: { orgType: "2", status: 1, ...pm }
    }),
    //新建采购订单
    purchaseAdd: (pm = {}) => ReqApi.post({
        url: PurchaseUrls.ADD_PURCHASE,
        pm
    }),
    //更新采购订单
    purchaseEdit: (pm = {}) => ReqApi.post({
        url: PurchaseUrls.UPDATE_PURCHASE,
        pm
    }),
    //单位列表
    measureList: (pm = {}) => ReqApi.post({
        url: PurchaseUrls.GET_MEASURELIST,
        pm
    }),
    //物料列表
    materialList: (pm = {}) => ReqApi.get({
        url: PurchaseUrls.GET_MATERIALLIST,
        pm: { ...page, status: 1, ...pm }
    }),
}
export default PurchaseUrls;
export { PurchaseFetch };    
