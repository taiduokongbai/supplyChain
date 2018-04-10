import { prefixScm } from '../../base/consts/UrlsConfig';
import { prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';

const page = { page: 1, pageSize: 15 };
let inventory = 'inventory';
let stock = 'stock';
let stocktake = 'stocktake';
let solution = 'solution';
let task = 'task';
let report = 'report';
let materialcategory = 'materialcategory';

const CheckFetch = {
    //盘点方案列表
    stockTakeList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${solution}/getList`,
        pm: Object.assign({}, page, pm)
    }),
    //盘点差异列表
    reportList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${report}/getList`,
        pm: Object.assign({}, page, pm)
    }),
    //新建盘点方案，所属仓库treeSelect
    getEnabledTree: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stock}/getEnabledTree`,
        pm: Object.assign({}, pm)
    }),
    //新建盘点方案，仓位select
    getEnabledListByStockId: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stock}/location/getEnabledListByStockId`,
        pm: Object.assign({}, pm)
    }),
    //新建/编辑盘点方案 保存
    stockTakeSave: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${inventory}/${stocktake}/${solution}/save`,
        pm: Object.assign({}, pm)
    }),
    //物料分类 treeSelect
    getComboBoxList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${materialcategory}/getComboBoxList`,
        pm: Object.assign({}, pm)
    }),
    //物料查询 select
    getMaterial: (pm={}) => ReqApi.get({
        url: `${prefixScm}/basic/getMaterialAll`,
        pm: Object.assign({}, pm)
    }), 
    //编辑盘点方案  获取盘点方案详情
    getDetails: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${solution}/getDetail`,
        pm: Object.assign({}, pm)
    }),
    //盘点方案详情  下推按钮
    pushDown: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${solution}/pushdown`,
        pm: Object.assign({}, pm)
    }),
    //盘点方案列表  删除按钮
    delete: (pm={}) => ReqApi.post({
        url: `${prefixScm}/${inventory}/${stocktake}/${solution}/remove`,
        pm: Object.assign({}, pm)
    }), 
    //盘点差异报告 详情 
    getReportDetails: (pm={}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${report}/getDetail`,
        pm: Object.assign({}, pm)
    }), 
    //盘点差异报告详情， 物料明细列表
    getMaterialList: (pm={}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${report}/getMaterialList`,
        pm: Object.assign({}, page, pm)
    }), 
    //更新库存
    updateInventory: (pm={}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${report}/updateInventory`,
        pm: Object.assign({}, pm)
    }), 
    //关闭盘点差异报告
    shutDown: (pm={}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${report}/shutdown`,
        pm: Object.assign({}, pm)
    }),  
}

const WorkSheetCheck = {
    //盘点作业单列表
    workSheetCheckList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/getList`,
        pm: Object.assign({}, page, pm)
    }),
    //详情盘点作业单物料明细
    impWorkSheetTableCheck: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/getMaterialList`,
        pm
    }),
    //盘点作业单仓位下拉
    shippingSpaceSelect: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/freightSpace/getFreightSpaceScope`,
        pm
    }),
    //执行盘点作业单号详情查询
    impWorkSheetDetails: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/getDetail`,
        pm
    }),
    //物料明细单条删除
    impDete: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/remove`,//仓位列表删除
        pm
    }),
    //盘点作业单号详情关闭
    detailsShutDown: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/shutdown`,
        pm
    }),
    //盘点作业单号详情完成关闭
    detailsComplete: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/complete`,
        pm
    }),
    //执行盘点作业单号开始盘点
    impStartCheck: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/startStocktake`,
        pm
    }),
    //执行盘点作业单保存
    impSaveCheck: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/save`,
        pm
    }),
     //执行盘点作业单添加行物料下拉
    impMaterialCheck: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/basic/getMaterialAll`,
        pm
    }),
     //执行盘点作业单物料明细
    impWorkSheetAllTableCheck: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/getMaterialAllList`,
        pm
    }),
     //执行盘点作业单是否可以添加行
    impWorkSheetAddLine: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${inventory}/${stocktake}/${task}/isNotExsitInInventory`,
        pm
    }),
}


export { CheckFetch, WorkSheetCheck };