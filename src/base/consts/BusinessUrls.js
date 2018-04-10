import { prefix, prefix2, prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';
import MaterialClassifyUrls from '../../scm/consts/MaterialClassifyUrls';
const page = { page: 1, pageSize: 15 };
const bp = 'bp';
const maindata = 'maindata';
const basic = 'basic';
const codeRule='codeRule';
const prefix3 = 'http://10.99.2.70:9095'; //服务器
const prefix4 = 'http://10.99.2.70:9097'; //服务器

const BusinessUrls = {
    BUSINESS_LIST: `${prefix}/${maindata}/${bp}/getbusinesspartnerlist`,
    BUSINESS_BASE: `${prefix}/${maindata}/${bp}/getbusinesspartner`,
    BUSINESS_CONTACTLIST: `${prefix}/${maindata}/${bp}/getContactsList`,
    BUSINESS_ADDRESSLIST: `${prefix}/${maindata}/${bp}/getaddresslist`,


    MATERIAL_ADD: `${prefixScm}/maindata/material/add`,//物料新增
    MATERIAL_DELETE: `${prefixScm}/maindata/material/delete`,//物料删除
    MATERIAL_GETDETAIL: `${prefixScm}/maindata/material/getDetail`,//获取物料详情
    MATERIAL_GETLIST: `${prefixScm}/maindata/material/getList`,//获取物料列表
    MATERIAL_ISDISABLE: `${prefixScm}/maindata/material/isDisable`,//物料启用/禁用
    MATERIAL_UPDATE: `${prefixScm}/maindata/material/update`,//物料更新
    MATERIALINVENTORY_UPDATE: `${prefixScm}/maindata/materialInventory/update`, //物料库存信息更新
    MATERIALPLAN_UPDATE: `${prefixScm}/maindata/materialPlan/update`, //物料计划信息更新
    MATERIALPRODUCE_UPDATE: `${prefixScm}/maindata/materialProduce/update`,//物料生产信息更新
    MATERIALPURCHASE_UPDATE: `${prefixScm}/maindata/materialPurchase/update`,//物料采购信息更新
    MATERIALSELL_UPDATE: `${prefixScm}/maindata/materialSell/update`,//物料销售信息更新
    MEASURE_GETLIST: `${prefixPub}/${basic}/measure/getList`,//单位下拉框
    MEASURE_GETALL: `${prefixPub}/${basic}/measure/getAll`,//单位下拉框

    GET_FILEDETAILLIST: `${prefixScm}/maindata/material/getFileDetailList`,
    DELETE_FILEDETAIL: `${prefixScm}/maindata/material/deleteFileDetail`,
    ADD_FILEDETAIL: `${prefixScm}/maindata/material/addFileDetail`,//物料附件添加

    //销售价格单
    SALEPRICE_ADD: `${prefixScm}/salePrice/add`,//新增
    SALEPRICE_UPDATE: `${prefixScm}/salePrice/update`,//修改
    SALEPRICE_DELETE: `${prefixScm}/salePrice/delete`,//删除
    SALEPRICE_GETLIST: `${prefixScm}/salePrice/getList`,//查询列表
    SALEPRICE_GETDETAIL: `${prefixScm}/salePrice/getDetail`,//查询明细
    SALEPRICE_STATUS: (status) => `${prefixScm}/salePrice/${status}`,
    SALEPRICE_SUBMIT: `${prefixScm}/salePrice/submit`,//提交
    SALEPRICE_REPEAL: `${prefixScm}/salePrice/repeal`,//撤回
    SALEPRICE_REJECT: `${prefixScm}/salePrice/reject`,//驳回
    GETMATERIAL_ORLIST: `${basic}/getMaterialOrList`,//弹窗销售物料查询
    CHECKORDERSTATUS: `${prefixScm}/salePrice/checkOrderStatus`,//盘点失效日期
    IMPORT_EXCEL: `${prefixScm}/salePrice/importExcel`,//导入

    // SALEPRICE_ADD:`${prefixScm}/salesprice/add`,//新增
    // SALEPRICE_UPDATE:`${prefixScm}/salesprice/update`,//修改
    // SALEPRICE_DELETE:`${prefixScm}/salesprice/delete`,//删除
    // SALEPRICE_GETLIST:`${prefixScm}/salesprice/getList`,//查询列表
    // SALEPRICE_GETDETAIL:`${prefixScm}/salesprice/getDetail`,//查询明细
    // SALEPRICE_STATUS: (status) => `${prefixScm}/salesprice/${status}`, //状态

    // GETMATERIAL_ORLIST:`${prefixScm}/${basic}/getMaterialOrList`,//弹窗销售物料查询
    MATERIAL_IMPORTEXCEL: `${prefixScm}/maindata/material/importExcel`,//物料导入
    MATERIAL_EXPORTEXCEL: `${prefixScm}/maindata/material/exportExcel`,//物料导出

    MATERIAL_UINT_GETLIST: `${prefixScm}/material/unitConversion/getList`,//获取物料单位换算列表
    MATERIAL_UINT_DELETE: `${prefixScm}/material/unitConversion/delete`,//删除物料单位换算列表
    MATERIAL_UINT_ADD: `${prefixScm}/material/unitConversion/add`,//新建物料单位换算列表
    MATERIAL_UINT_UPDATE: `${prefixScm}/material/unitConversion/update`,//新建物料单位换算列表
    GET_MATERIALLIST: `${prefixScm}/${basic}/getMaterialOrList`,
    GET_UNITBY_MATERIALCODE: `${prefixScm}/${basic}/getUnitByMaterialCode`,//根据物理code获取基本单位和业务单位
    ISAUTO:`${prefixPub}/${codeRule}/isAuto`,//编码规则


    SCM_MATERIALCHECK_FINDLIST: `${prefixScm}/materialcheck/findList`,//查询物料可用性检查信息
    SCM_MATERIALCHECK_SAVE: `${prefixScm}/materialcheck/save`, //物料可用性检测保存
    SCM_MATERIALCHECK_UPDATEDETAIL: `${prefixScm}/materialcheck/updateDetail`, //更新明细表检查标识
    SCM_MATERIALCHECK_REFRESH: `${prefixScm}/materialcheck/refresh`,//更新明细表检查标识
    SCM_MATERIALCHECK_GET: `${prefixScm}/materialcheck/get`,//查询物料可用性检查信息


};
const MaterialFetch = {
    //物料列表
    materiallList: (pm = {}) => ReqApi.get({
        url: BusinessUrls.MATERIAL_GETLIST,
        pm: Object.assign({}, page, pm)
    }),
    //删除物料
    materialDetele: (pm = {}) => ReqApi.get({
        url: BusinessUrls.MATERIAL_DELETE,
        pm
    }),
    //物料分类
    materialType: (pm = {}) => ReqApi.get({
        url: MaterialClassifyUrls.GET_COMBOBOX_LIST,
        pm: Object.assign(page, pm)
    }),
    //物料新建
    materialAdd: (pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIAL_ADD,
        pm
    }),
    //编辑物料
    materialEdit: (pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIAL_UPDATE,
        pm
    }),
    //物料详情
    materialDetail: (pm = {}) => ReqApi.get({
        url: BusinessUrls.MATERIAL_GETDETAIL,
        pm,
        callBack:true
    }),
    //库存
    materialDetailKC: (pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIALINVENTORY_UPDATE,
        pm
    }),
    //生产
    materialDetailSC: (pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIALPRODUCE_UPDATE,
        pm
    }),
    //销售
    materialDetailSX: (pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIALSELL_UPDATE,
        pm
    }),
    //采购
    materialDetailCG: (pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIALPURCHASE_UPDATE,
        pm
    }),
    //计划
    materialDetailJH: (pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIALPLAN_UPDATE,
        pm
    }),
    //附件列表
    materiallFJInfoList: (pm = {}) => ReqApi.get({
        url: BusinessUrls.GET_FILEDETAILLIST,
        pm
    }),
    //删除附件
    materialFJDelete: (pm = {}) => ReqApi.get({
        url: BusinessUrls.DELETE_FILEDETAIL,
        pm
    }),
    //添加附件
    materialFJadd: (pm = {}) => ReqApi.get({
        url: BusinessUrls.ADD_FILEDETAIL,
        pm
    }),
    //启用/禁用
    materialisDisable: (pm = {}) => ReqApi.get({
        url: BusinessUrls.MATERIAL_ISDISABLE,
        pm
    }),
    //物料单位换算列表
    materialUintCoversionList: (pm = {}) => ReqApi.get({
        url: BusinessUrls.MATERIAL_UINT_GETLIST,
        pm: Object.assign({}, page, pm)
    }),
    //物料单位换算删除materiallUintConversionDetele
    materiallUintConversionDetele: (pm = {}) => ReqApi.get({
        url: BusinessUrls.MATERIAL_UINT_DELETE,
        pm
    }),
    //物料单位换算新建
    materiallUintConversionAdd: (pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIAL_UINT_ADD,
        pm
    }),
    //编辑物料单位换算
    materiallUintConversionEdit:(pm = {}) => ReqApi.post({
        url: BusinessUrls.MATERIAL_UINT_UPDATE,
        pm
    }),
    //物料列表
    materialList: (pm = {}) => ReqApi.get({
        url: BusinessUrls.GET_MATERIALLIST,
        pm: { ...page, ...pm }
    }),
    //物料详情里面的单位换算列表
    materialDetailUintCoversionList: (pm = {}) => ReqApi.get({
        url: BusinessUrls.MATERIAL_UINT_GETLIST,
        pm: Object.assign({},pm)
    }),
    //默认单位
    materialDefaultMeasure: (pm = {}) => ReqApi.get({
        url: BusinessUrls.MEASURE_GETLIST,
        pm
    }),
    //根据物理code获取基本单位和业务单位
    getUnitByMaterialCode: (pm = {}) => ReqApi.get({
        url: BusinessUrls.GET_UNITBY_MATERIALCODE,
        pm
    }),
    //编码规则
    isAuto:(pm={})=>ReqApi.get({
        url: BusinessUrls.ISAUTO,
        pm:{businessIndex:10}
    })
}
export default BusinessUrls;
export { MaterialFetch };