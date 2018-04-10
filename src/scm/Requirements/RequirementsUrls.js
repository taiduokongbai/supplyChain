//采购需求单
import { prefix, prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import {ReqApi} from '../../base/services/ReqApi';
let purchaseRequirement='purchaseRequirement';
const page  = { page: 1, pageSize: 10 };

const RequirementsFetch = {
    //列表
    requirementsList: (pm = {}) => ReqApi.get({
        url:`${prefixScm}/${purchaseRequirement}/getList`,
        pm: Object.assign({},page,pm)
    }),
    //获取所有站点
    siteList: (pm = {}) => ReqApi.get({
        url:`${prefixPub}/basic/site/getList`,
        pm
    }),
    //获取供应商下拉列表
    supplierList: (pm = {}) => ReqApi.get({
        url:`${prefixScm}/maindata/supplier/getSupplierList`,
        pm
    }),

    //获取当前登录信息
    login: (pm = {}) => ReqApi.get({
        url:`${prefixPub}/login/currentUserInfo`,
        pm
    }),
    //获取当前登录者所属部门
    deptList: (pm = {}) => ReqApi.get({
        url:`${prefixPub}/dept/getOrgList`,
        pm
    }),
    //获取当前登录者员工
    empList: (pm = {}) => ReqApi.get({
        url:`${prefixPub}/employees/list`,
        pm
    }),

    ComAddrBySiteList: (pm = {}) => ReqApi.get({
        url:`${prefixPub}/basic/site/getComAddrBySite`,
        pm
    }),
   //确认
   confrim: (pm = {}) => ReqApi.post({
        url:`${prefixScm}/${purchaseRequirement}/confirm`,
        pm
    }),
   
   //供应商对应价格表
   ExistPriceList: (pm={}) => ReqApi.post({
        url:`${prefixScm}/${purchaseRequirement}/existPrice`,
        pm
    }),
    //批量关闭
    CloseTableList: (pm={}) => ReqApi.get({
        url:`${prefixScm}/${purchaseRequirement}/batchColse`,
        pm
    }),
    //多物料表 采购单位
    unitList: (pm={}) => ReqApi.get({
        url:`${prefixScm}/basic/getUnitByMaterialCode`,
        pm
    }),
}
export { RequirementsFetch };    
