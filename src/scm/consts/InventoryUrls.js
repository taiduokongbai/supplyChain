/**
 * Created by MW on 2017/4/20.
 */
import { prefixScm } from '../../base/consts/UrlsConfig';
import { prefixPub } from '../../base/consts/UrlsConfig';
import {ReqApi} from '../../base/services/ReqApi';
const page  = { page: 1, pageSize: 15 };
let inventory = 'inventory';
let out = 'out';
let exec = 'exec';
let allocate = 'allocate';

let put = 'put';
let freightspace = 'freightSpace'

const Urls = {

    //EMPLOYEE_ADD: `${prefixScm}/${employees}/modify`,

    // --出库单 url--
    INVENTORYRECORD: `${prefixScm}/${inventory}/inventoryRecord/getList`,//获取库存明细账列表
    GETLIST: `${prefixScm}/${inventory}/getList`,//获取库存选择列表
    SALE_GETLIST: `${prefixScm}/${inventory}/${out}/getList`, //获取出库单列表(带分页)
    OUT_GETORDERINFO: `${prefixScm}/${inventory}/${out}/getOrderInfo`, //出库单据订单信息查询
    OUT_GETDETAIL: `${prefixScm}/${inventory}/${out}/getDetail`, //出库单据详情主信息查询
    ALLOCATE_GETINVENTORYLIST: `${prefixScm}/${inventory}/${out}/${exec}/${allocate}/getInventoryList`, //出库单执行操作分配时获取库存列表
    ALLOCATE_GETORDERDETAIL: `${prefixScm}/${inventory}/${out}/${exec}/${allocate}/getOrderDetail`, //出库单执行操作分配时获取订单详情
    ORDERINFO_ALLOCATESAVE: `${prefixScm}/${inventory}/${out}/${exec}/orderInfo/allocateSave`, //出库单执行操作时订单分配保存操作
    ALLOCATEINFO_DELETE: `${prefixScm}/${inventory}/${out}/${exec}/allocateInfo/delete`, //出库单执行操作分配信息删除操作
    GETALLOCATEINFO: `${prefixScm}/${inventory}/${out}/getAllocateInfo`, //出库单据分配信息查询
    SHIPPING: `${prefixScm}/${inventory}/${out}/${exec}/shipping`, //出库单执行操作发货
    SALE_OUT_INVENTORY_DELETE: `${prefixScm}/${inventory}/${out}/delete`, //单条出库单删除
    SALE_OUT_INVENTORY_ADD: `${prefixScm}/${inventory}/${out}/add`,  //出库单新建时保存操作
    ISLOCK: `${prefixScm}/${inventory}/${out}/islock`, //点击执行时判断当前单据是否锁定
    GET_SALEORDER:`${prefixScm}/sale/getSaleOrder`, //根据源单据号获取源单据详情(销售出库单)
    SALE_SALEORDER_LIST:`${prefixScm}/sale/getSaleOrderList`,  //获取源单据列表(销售出库单)
    PURCAHSE_RETURN_GET_DETAIL:`${prefixScm}/purchaseReturn/getDetailByCode`,  //根据源单据号获取源单据详情(采购退货出库单)
    PURCAHSE_RETURN_GET_DETAILS:`${prefixScm}/purchaseReturn/getDetailByCodeForOut`,  //根据源单据号获取源单据详情(采购退货出库单)Sw
    PURCHASE_RETURN_GETLIST:`${prefixScm}/purchaseReturn/getList`,  //获取源单据列表(采购退货出库单)
    PRODUCE_PICKING_GETDETAIL:`${prefixScm}/produce/picking/getDetail`, //根据源单据号获取源单据详情(生产领料单)
    PRODUCT_PICKING_GETLIST:`${prefixScm}/produce/picking/getList`, //获取源单据列表(生产领料单)
    PUB_BASIC_BUSINESS_GETLIST:`${prefixPub}/basic/business/getList`,//获取单据类型
    CLOSE:`${prefixScm}/${inventory}/${out}/close`, //关闭


    SALES_DELIVERY_FINDLIST:`${prefixScm}/saledelivery/getCodeList`,  //获取源单据列表(销售出库单)Sw
    SALES_DELIVERY_GET:`${prefixScm}/saledelivery/get`,  //根据源单据号获取源单据详情(销售出库单)Sw
    SALES_DELIVERY_GETDetail:`${prefixScm}/saledelivery/getDetailByCode`,  //根据源单据号获取源单据详情(销售出库单)Sw


    // ---- 采购入库单 url ----------
    GET_PRE_PUT_INFO: `${prefixScm}/${inventory}/${put}/getPrePutInfo`,   // 入库单据预收货信息查询
    PRE_PUT_INFO_DELETE: `${prefixScm}/${inventory}/${put}/exec/prePutInfo/delete`, // 入库单据执行操作预收货信息删除操作
    GET_FREIGHT_SPACE: `${prefixScm}/${inventory}/${freightspace}/getBySiteCode`, // 根据仓库编码获取仓位
    GET_UNLOCK_LIST_FORIN: `${prefixScm}/${inventory}/${freightspace}/getUnlockListForIn`, // 根据仓库编码获取仓位-----其他入库单/销售退货入库单
    GET_PURCHASELIST:`${prefixScm}/${inventory}/${put}/getList`,//采购入库单主界面
    GET_DETAIL: `${prefixScm}/${inventory}/${put}/getDetail`, // 入库单据主信息查询
    GET_ORDER_INFO: `${prefixScm}/${inventory}/${put}/getOrderInfo`, // 入库单据订单信息查询
    RECEIVE: `${prefixScm}/${inventory}/${put}/exec/receive`, // 入库单据执行操作收货
    PRE_PUT_SAVE: `${prefixScm}/${inventory}/${put}/exec/orderInfo/prePutSave`, //入库单据执行操作订单信息预收货保存操作
    GET_PURCHASE_DETAILBYCODE: `${prefixScm}/purchasereceive/getDetailByCode`, //采购入库单主界面查询源单信息
    GET_PURCHASE_DELETE: `${prefixScm}/${inventory}/${put}/delete`, // 入库单据删除操作
    PUT_CLOASE: `${prefixScm}/${inventory}/${put}/close`, // 生产入库单执行界面关闭操作
    GET_PURCHASE_GETLIST: `${prefixScm}/purchasereceive/getCodeList`, //采购入库单新建时查询源单列表
    GET_PURCHASE_SAVE: `${prefixScm}/${inventory}/${put}/add`, // 入库单据保存操作




    // ---- 仓位 url ----------
    INVENTORY_FREIGHTSPACE_GETLIST: `${prefixScm}/${inventory}/freightSpace/getList`, //获取出库单列表(带分页)
    INVENTORY_FREIGHTSPACE_GETDETAIL: `${prefixScm}/${inventory}/freightSpace/getDetail`, //获取单条仓位详情
    INVENTORY_FREIGHTSPACE_ADD: `${prefixScm}/${inventory}/freightSpace/add`, //仓位新增
    INVENTORY_FREIGHTSPACE_DELETE: `${prefixScm}/${inventory}/freightSpace/delete`, //仓位删除
    INVENTORY_FREIGHTSPACE_UPDATE: `${prefixScm}/${inventory}/freightSpace/update`,//仓位更新
    INVENTORY_FREIGHTSPACE_ISDISABLE: `${prefixScm}/${inventory}/freightSpace/isDisable`,//仓位启用禁用
    PUB_BASIC_SITE_GETLIST: `${prefixPub}/basic/site/getList`,//获取站点
    SCM_INVENTORY_FREIGHTSPACE_IMPORTEXCEL: `${prefixScm}/inventory/freightSpace/importExcel`,//获取站点

    // -----------------------------



    // --------------销售退货入库单---------------
     GET_RETURN_SIDE: `${prefixScm}/saleReturn/getSaleReturnDetail`, //销售退货入库单主界面查询源单信息和销售退货入库单新建时查询源单订单信息
     GET_RETURN_LIST: `${prefixScm}/saleReturn/getSaleReturnList`, //销售退货入库单新建时查询源单列表

     // --------------生产退料单---------------
    GET_PRODUCTION_SIDE: `${prefixScm}/productionReturn/getDetail`, // 生产退料单主界面查询源单信息和生产退料单新建时查询源单订单信息
    GET_PRODUCTION_LIST: `${prefixScm}/productionReturn/getList`, // 生产退料单新建时查询源单列表

    // --------------生产入库单---------------
    GET_NEW_SIDE: `${prefixScm}/productionorder/getDetail`, //生产入库单主界面查询源单信息和生产入库单新建时查询源单订单信息
    GET_NEW_LIST: `${prefixScm}/productionorder/getList`, //生产入库单新建时查询源单列表
    GET_NEW_SITE: `${prefixPub}/basic/site/getList`, //生产入库新建时选择站点
    GET_TAKE_ISLOCK: `${prefixScm}/${inventory}/${put}/islock`, //点击执行时判断当前单据是否锁定






    // --------------其他出库---------------
    PUB_DEPT_GET_ORG_LIST: `${prefixPub}/dept/getOrgList`,  //部门枚举
    PUB_EMPLOYEES_LIST: `${prefixPub}/employees/list`,  //员工枚举

    PUB_BASIC_BUSINESS_GET_LIST: `${prefixPub}/basic/business/getList`,  //单据类型枚举

    SCM_MAIN_DATA_MATERIAL_GET_LIST: `${prefixScm}/maindata/material/getList`,  //物料查询
    SCM_INVENTORY_PUT_GET_ORDER_INFO: `${prefixScm}/inventory/put/getOrderInfo`,  //物料 信息列表查询

    SCM_INVENTORY_OUT_GET_ORDER_INFO: `${prefixScm}/inventory/out/getOrderInfo`,  //订单信息 查询列表
    SCM_INVENTORY_OUT_GET_DETAIL: `${prefixScm}/inventory/out/getDetail`,  //基本信息 主单据明细(常规信息)查询

    SCM_INVENTORY_OUT_OTHER_SAVE: `${prefixScm}/inventory/out/otherSave`,  //新增编辑出库提交






    // --------------其他入库单---------------
     PUB_BASIC_BUSCODE: `${prefixPub}/basic/business/getList`,//主表获取业务类型查询
     GET_MINDATA_LIST: `${prefixScm}/maindata/material/getList`, //其他入库单弹窗物料列表查询
     OTHER_SAVE: `${prefixScm}/inventory/put/otherSave`, // 其他入库单 新增或编辑  单据保存

     //------------------编码规则--------------
     GET_CODERULE: `${prefixPub}/codeRule/isAuto`,//编码规则

     //------------------库存调整单--------------
     GET_ADJUST_LIST: `${prefixScm}/inventory/adjust/getAdjustList`, //库存调整单主列表查询
     GET_ADJUSTDETAIL_LIST: `${prefixScm}/inventory/adjust/getAdjustDetail`, //库存调整单详情查询

     //------------------直接调拨单--------------
      GET_DIRECTTRANSFER_LIST: `${prefixScm}/inventory/allot/getList`, //直接调拨单主列表查询
      GET_DIRECTTRANSFER_DETAIL: `${prefixScm}/inventory/allot/getDetail`, //查询单据头信息（基本信息）
      GET_DIRECTTRANSFER_GETAllTOUTRECORDS: `${prefixScm}/inventory/allot/getAllotOutRecords`, //调出记录查询

    //库存调整新增
    SCM_INVENTORY_ADJUST_GETALLINVENTORY: `${prefixScm}/inventory/adjust/getAllInventory`,//库存调整单详情查询

    SCM_INVENTORY_FREIGHT_SPACE_GET_LIST: `${prefixScm}/inventory/freightSpace/getListForAdjust`,//仓位自动补全

    SCM_INVENTORY_ADJUST_GET_TEMP_ADJUST_LIST: `${prefixScm}/inventory/adjust/getTempAdjustList`,//临时调整单列表

    SCM_INVENTORY_ADJUST_CONFIRM_ADJUSTMENT: `${prefixScm}/inventory/adjust/confirmAdjustment`,//大保存

    SCM_INVENTORY_ADJUST_CLEAR_ADJUSTMENT_BILLS: `${prefixScm}/inventory/adjust/clearAdjustmentBills`,//新增前删除数据


    SCM_INVENTORY_ADJUST_CREATE_ADJUST_BILL: `${prefixScm}/inventory/adjust/createAdjustBill`,//第一步保存


    SCM_INVENTORY_ADJUST_REMOVE: `${prefixScm}/inventory/adjust/remove`,//批量删除

    SCM_INVENTORY_ADJUST_ADD_MATERIAL_TO_ADJUSTMENT_BILLS: `${prefixScm}/inventory/adjust/addMaterialToAdjustmentBills`//仓位自动补全

};

const InventoryFetch = {
    //仓库列表
    stockPageList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/inventory/stock/pageList`,
        pm: Object.assign({}, page, pm)
    }),
    //仓库列表删除
    stockRemove: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/inventory/stock/remove`,
        pm: pm
    }),
    //仓库启用
    stockEnabled: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/inventory/stock/enabled`,
        pm: pm
    }),
    //仓库列表禁用
    stockDisabled: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/inventory/stock/disabled`,
        pm: pm
    }),

    //获取当前仓位信息
    stockLocationInfo: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/inventory/stock/location/info`,
        pm: pm
    }),

    //新增仓位
    stockLocationAdd: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/inventory/stock/location/add`,
        pm: pm
    }),

    //编辑仓位
    stockLocationEdit: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/inventory/stock/location/edit`,
        pm: pm
    }),

    //获取所属仓库列表
    stocklist: () => ReqApi.get({
        url: `${prefixScm}/inventory/stock/list`,
    }),
}

const StorageBinFetch = {
    //仓位URL
    storageBinList: (pm = {}) =>
        ReqApi.get({
            url: `${prefixScm}/${inventory}/stock/location/pageList`, //获取仓库单列表(带分页)
            pm: Object.assign({}, page, pm)
        }),
    storageBinListTree:(pm = {}) => ReqApi.get({
            url: ` ${prefixScm}/${inventory}/stock/tree`,//获取仓位左侧列表
            pm
        }),  
    storageBinListDete:(pm = {}) => ReqApi.post({
            url: ` ${prefixScm}/${inventory}/stock/location/remove`,//仓位列表删除
            pm
        }), 
    storageBinListEnabled:(pm = {}) => ReqApi.post({
            url: ` ${prefixScm}/${inventory}/stock/location/enabled`,//仓位列表启用
            pm
        }),
    storageBinListDisabled:(pm = {}) => ReqApi.post({
            url: ` ${prefixScm}/${inventory}/stock/location/disabled`,//仓位列表禁用
            pm
        }), 
}

// 直接调拨单
const AllotFetch = {
    //获取直接调拨单列表
    getAllotList:(pm ={}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/pageList`,
        pm
    }),

    //获取直接调拨单详情-基本信息
    getAllotDetails:(pm ={}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/getDetail`,
        pm
    }),

    //获取直接调拨单详情-明细列表
    getAllotDetailsList:(pm ={}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/detail/mxPageList`,
        pm
    }),

    //获取直接调拨单详情-调出记录
    getAllotDetailsOutRecord:(pm ={}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/detail/getAllotOutRecords`,
        pm
    }),

    //获取直接调拨单详情-调入记录
    getAllotDetailsInRecord:(pm ={}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/detail/getAllotInRecords`,
        pm
    }),

    // 新建直接调拨单刚进入时，清除临时表数据
    delAllAllotInfo:() => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/del`,
    }),

    //获取直接调拨单类型
    getAllotOrderTypeList: (pm ={}) => ReqApi.get({
        url: ` ${prefixPub}/basic/business/getList`,
        pm
    }),

    //获取所有员工
    getEmployeesList: (pm ={}) => ReqApi.get({
        url: ` ${prefixPub}/employees/list`,
        pm
    }),

    //获取当前登录人
    getWithToken: (pm ={}) => ReqApi.get({
        url: ` ${prefixPub}/employees/getWithToken`,
        pm
    }),

    //获取所有站点树
    getStockTree: (pm ={}) => ReqApi.get({
        url: `  ${prefixScm}/${inventory}/stock/getEnabledTree`,
        pm
    }),

    //获取物料列表
    getMaterialList: (pm ={}) => ReqApi.get({
        url: `  ${prefixScm}/${inventory}/usablePageListByStockId`,
        pm
    }),

    //第一步首次保存
    addOneStepFirst:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/add/step1`,
        pm
    }),

    //非第一步首次保存
    addOther:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/add/stepOther`,
        pm
    }),

    //直接调拨单——每步
    getDetail:(pm = {}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/add/stepOther/getDetail`,
        pm
    }),

    //直接调拨单——一步二步——调出、调入信息列表
    getMxPageList:(pm = {}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/add/step12/mxPageList`,
        pm
    }),

    //获取仓位列表
    getLocationList: (pm ={}) => ReqApi.get({
        url: `  ${prefixScm}/${inventory}/stock/location/getUnlockEnabledListByStockId`,
        pm
    }),

    //新建直接调拨单——第一步——二次——明细新增
    addOneStep:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/add/step1/add`,
        pm
    }),

    //新建直接调拨单——第一步——二次——明细编辑
    editOneStep:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/add/step1/edit`,
        pm
    }),

    //新建直接调拨单——第一步——二次——明细编辑
    delOneStep:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/add/step1/del`,
        pm
    }),

    //预收货列表
    getAdvanceList:(pm = {}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/add/pre/pageList`,
        pm
    }),

    //预收货列表---新增
    addAdvanceList:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/add/pre/add`,
        pm
    }),

    //预收货列表---编辑
    editAdvanceList:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/add/pre/edit`,
        pm
    }),

    //预收货列表---删除
    delAdvanceList:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/add/pre/del`,
        pm
    }),

    //调拨信息列表 --- 第三步
    getAllMxPageList:(pm = {}) => ReqApi.get({
        url: ` ${prefixScm}/${inventory}/allot/add/step3/mxPageList`,
        pm
    }),

    //直接调拨单新建确认接口
    allotConfirm:(pm = {}) => ReqApi.post({
        url: ` ${prefixScm}/${inventory}/allot/confirm`,
        pm
    }),
}

//其他出库单
const OtherOutBoundFetch = {
    //仓库列表
    materialGetList: (pm = {}) => ReqApi.get({
        url: Urls.SCM_MAIN_DATA_MATERIAL_GET_LIST,
        pm: Object.assign({}, page, pm)
    }),
}
export { Urls ,InventoryFetch ,StorageBinFetch ,AllotFetch ,OtherOutBoundFetch };