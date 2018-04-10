import { fromJS, Record, List } from "immutable";
import { TABSREDU } from "../consts/ActTypes";

let initState = fromJS({
    activeKey: "",
    openKeys: [],
    tabs: [],
    tabsData: {},
    menusData: [],
});

const TabsRedu = (state = initState, action) => {
    switch (action.type) {
        case TABSREDU:
            return action.state;
        default:
            return state;
    }
}
export default TabsRedu;

let tabsData = {
    /**************************************     库存导航        ******************************************/
    //基础设置
    "inventoryWareHouse": { title: "仓库", pkey: ["inventoryManage", "inventorySettings"], breadcrum: ["库存管理", "基础设置", "仓库"] },
    "inventoryStorageBin": { title: "仓位", pkey: ["inventoryManage", "inventorySettings"], breadcrum: ["库存管理", "基础设置", "仓位"] },
    "inventoryStorage": { title: "仓位", pkey: ["inventoryManage", "inventorySettings"], breadcrum: ["库存管理", "基础设置", "仓位"] },
    //库存查询
    "inventoryInstantInventory": { title: "即时库存", pkey: ["inventoryManage", "inventorySearch"], breadcrum: ["库存管理", "库存查询", "即时库存"] },
    "inventoryInventoryBreakdown": { title: "库存明细账", pkey: ["inventoryManage", "inventorySearch"], breadcrum: ["库存管理", "库存查询", "库存明细账"] },
    //入库管理
    "inventoryPurchaseListCont": { title: "采购入库单", pkey: ["inventoryManage", "inventoryPurchase"], breadcrum: ["库存管理", "入库管理", "采购入库单"] },
    "inventoryAddPurchaseListCont": { title: "新建采购入库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "采购入库单", "新建采购入库单"] },
    "inventoryPurchaseEidt": { title: "执行采购入库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "采购入库单", "执行采购入库单"] },
    "inventoryReceiptDetailsCont": { title: "采购入库单详情", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "采购入库单", "采购入库单详情"] },
    //销售退货入库单
    "inventorySalesReturnListCont": { title: "销售退货入库单", pkey: ["inventoryManage", "inventoryPurchase"], breadcrum: ["库存管理", "入库管理", "销售退货入库单"] },
    "inventoryAddReturnSalesListCont": { title: "新建销售退货入库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "销售退货入库单", "新建销售退货入库单"] },
    "inventorySalesReturnStoreCont": { title: "执行销售退货入库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "销售退货入库单", "执行销售退货入库单"] },
    "inventorySalesReturnDetailsCont": { title: "销售退货入库单详情", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "销售退货入库单", "销售退货入库单详情"] },
    //生产退料单
    "inventoryProductionListCont": { title: "生产退料单", pkey: ["inventoryManage", "inventoryPurchase"], breadcrum: ["库存管理", "入库管理", "生产退料单"] },
    "inventoryAddInventoryProductionCont": { title: "新建生产退料单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "生产退料单", "新建生产退料单"] },
    "inventoryReturnMaterialCont": { title: "执行生产退料单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "生产退料单", "执行生产退料单"] },
    "inventoryProductionDetailsCont": { title: "生产退料单详情", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "生产退料单", "生产退料单详情"] },
    //生产入库单
    "inventoryWareHousingCont": { title: "生产入库单", pkey: ["inventoryManage", "inventoryPurchase"], breadcrum: ["库存管理", "入库管理", "生产入库单"] },
    "inventoryAddWareHousingCont": { title: "新建生产入库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "生产入库单", "新建生产入库单"] },
    "inventoryProductionStorageCont": { title: "执行生产入库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "生产入库单", "执行生产入库单"] },
    "inventoryWareHousingDetailsCont": { title: "生产入库单收货详情", pkey: ["inventoryManage"], breadcrum: ["库存管理", "入库管理", "生产入库单", "生产入库单收货详情"] },
    //其他入库单
    "inventoryOtherWareHousePageCont": { title: "其他入库单", pkey: ["inventoryManage", "inventoryPurchase"], breadcrum: ["库存管理", "入库管理", "其他入库单"] },
    "inventoryAddOtherWareHousePageCont": { title: "新建其他入库单", pkey: ["inventoryManage", "inventoryPurchase", "inventoryOtherWareHousePageCont"], breadcrum: ["库存管理", "入库管理", "其他入库单", "新建其他入库单"] },
    "inventoryOtherWarehouseEditCont": { title: "编辑其他入库单", pkey: ["inventoryManage", "inventoryPurchase", "inventoryOtherWareHousePageCont"], breadcrum: ["库存管理", "入库管理", "其他入库单", "编辑其他入库单"], closeConfirm: true ,content:'即将离开编辑页面，请确认是否取消已修改的内容？'},
    "inventoryOtherWarehouseCarryOutCont": { title: "执行其他入库单", pkey: ["inventoryManage", "inventoryPurchase", "inventoryOtherWareHousePageCont"], breadcrum: ["库存管理", "入库管理", "其他入库单", "执行其他入库单"] },
    "inventoryOtherWareHousePageDetailsCont": { title: "其他入库单详情", pkey: ["inventoryManage", "inventoryPurchase", "inventoryOtherWareHousePageCont"], breadcrum: ["库存管理", "入库管理", "其他入库单", "其他入库单详情"] },
    //自制件入库单
    "selfMadeInList": { title: "自制件入库单", pkey: ["inventoryManage", "inventoryPurchase"], breadcrum: ["库存管理", "入库管理", "自制件入库单"] },
    "addSelfMadeIn": { title: "新建自制件入库单", pkey: ["inventoryManage", "inventoryPurchase", "selfMadeInList"], breadcrum: ["库存管理", "入库管理", "自制件入库单", "新建自制件入库单"] },
    "editSelfMadeIn": { title: "编辑自制件入库单", pkey: ["inventoryManage", "inventoryPurchase", "selfMadeInList"], breadcrum: ["库存管理", "入库管理", "自制件入库单", "编辑自制件入库单"], closeConfirm: true,content:'即将离开编辑页面，请确认是否取消已修改的内容？' },
    "execSelfMadeIn": { title: "执行自制件入库单", pkey: ["inventoryManage", "inventoryPurchase", "selfMadeInList"], breadcrum: ["库存管理", "入库管理", "自制件入库单", "执行自制件入库单"] },
    "selfMadeInView": { title: "自制件入库单详情", pkey: ["inventoryManage", "inventoryPurchase", "selfMadeInList"], breadcrum: ["库存管理", "入库管理", "自制件入库单", "自制件入库单详情"] },
    //出库管理
    "inventorySalesStoreHouse": { title: "销售出库单", pkey: ["inventoryManage", "inventoryOutbound"], breadcrum: ["库存管理", "出库管理", "销售出库单"] },
    "inventorySaleCarryOut": { title: "执行销售出库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "销售出库单", "执行销售出库单"] },
    "inventoryNewSalesStoreHouse": { title: "新建销售出库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "销售出库单", "新建销售出库单"] },
    "inventorySalesOutboundDetails": { title: "销售出库单详情", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "销售出库单", "销售出库单详情"] },
    //采购退货出库单
    "inventoryPurchaseReturnHouse": { title: "采购退货出库单", pkey: ["inventoryManage", "inventoryOutbound"], breadcrum: ["库存管理", "出库管理", "采购退货出库单"] },
    "inventoryNewPurchaseReturn": { title: "新建采购退货出库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "采购退货出库单", "新建采购退货出库单"] },
    "inventoryPurchaseReturnOutCarryOut": { title: "执行采购退货出库单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "采购退货出库单", "执行采购退货出库单"] },
    "inventoryPurchaseReturnOutboundDetails": { title: "采购退货出库单详情", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "采购退货出库单", "采购退货出库单详情"] },
    //生产发料单
    "inventoryProductionIssue": { title: "生产发料单", pkey: ["inventoryManage", "inventoryOutbound"], breadcrum: ["库存管理", "出库管理", "生产发料单"] },
    "inventoryNewProductionIssue": { title: "新建生产发料单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "生产发料单", "新建生产发料单"] },
    "inventoryProductionSendMaterialCarryOut": { title: "执行生产发料单", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "生产发料单", "执行生产发料单"] },
    "inventoryProductionIssueOutboundDetails": { title: "生产发料单详情", pkey: ["inventoryManage"], breadcrum: ["库存管理", "出库管理", "生产发料单", "生产发料单详情"] },
    //其他出库单
    "inventoryOtherOutbound": { title: "其他出库单", pkey: ["inventoryManage", "inventoryOutbound"], breadcrum: ["库存管理", "出库管理", "其他出库单"] },
    "inventoryOtherOutboundAdd": { title: "新建其他出库单据", pkey: ["inventoryManage", "inventoryOutbound", "inventoryOtherOutbound"], breadcrum: ["库存管理", "出库管理", "其他出库单", "新建其他出库单据"] },
    "inventoryOtherOutboundEdit": { title: "编辑其他出库单据", pkey: ["inventoryManage", "inventoryOutbound", "inventoryOtherOutbound"], breadcrum: ["库存管理", "出库管理", "其他出库单", "编辑其他出库单据"], closeConfirm: true,content:'即将离开编辑页面，请确认是否取消已修改的内容？' },
    "inventoryOtherOutboundOrderCarryOut": { title: "执行其他出库单据", pkey: ["inventoryManage", "inventoryOutbound", "inventoryOtherOutbound"], breadcrum: ["库存管理", "出库管理", "其他出库单", "执行其他出库单据"] },
    "inventoryOtherOutboundOrderDetails": { title: "其他出库单据详情", pkey: ["inventoryManage", "inventoryOutbound", "inventoryOtherOutbound"], breadcrum: ["库存管理", "出库管理", "其他出库单", "其他出库单据详情"] },
    //库存调整
    "AdjustmentListCont": { title: "库存调整单", pkey: ["inventoryManage", "inventoryAdjustment"], breadcrum: ["库存管理", "库存调整", "库存调整单"] },
    //库存调拨
    "inventoryAllotList": { title: "直接调拨单", pkey: ["inventoryManage", "inventoryAllot"], breadcrum: ["库存管理", "库存调拨", "直接调拨单"] },
    "inventoryAddAllot": { title: "新建直接调拨单", pkey: ["inventoryManage", "inventoryAllot", "inventoryAddAllot"], breadcrum: ["库存管理", "库存调拨", "直接调拨单", "新建直接调拨单"] },
    "inventoryAllotDetails": { title: "直接调拨单详情", pkey: ["inventoryManage", "inventoryAllot", "inventoryAllotDetails"], breadcrum: ["库存管理", "库存调拨", "直接调拨单", "直接调拨单详情"] },
    //直接调拨单
    "inventoryDirectTransferList": { title: "直接调拨单", pkey: ["inventoryManage", "inventoryOutbound"], breadcrum: ["库存管理", "出库管理", "直接调拨单"] },
    "inventoryNewDirectTransfer": { title: "新建直接调拨单", pkey: ["inventoryManage", "inventoryOutbound", "inventoryDirectTransferList"], breadcrum: ["库存管理", "出库管理", "直接调拨单", "新建直接调拨单"] },
    "inventoryDirectTransferDetails": { title: "直接调拨单详情", pkey: ["inventoryManage", "inventoryOutbound", "inventoryDirectTransferList"], breadcrum: ["库存管理", "出库管理", "直接调拨单", "直接调拨单详情"] },
    //库存盘点
    "inventoryCheckPlan": { title: "盘点方案", pkey: ["inventoryManage", "inventoryCheck"], breadcrum: ["库存管理", "库存盘点", "盘点方案"] },
    "inventoryWorkSheet": { title: "盘点作业单", pkey: ["inventoryManage", "inventoryCheck"], breadcrum: ["库存管理", "库存盘点", "盘点作业单"] },
    "inventoryVarianceReport": { title: "盘点差异报告", pkey: ["inventoryManage", "inventoryCheck"], breadcrum: ["库存管理", "库存盘点", "盘点差异报告"] },
    //物料可用性检查
    "materialAvailabilityCheck": { title: "监控条件配置", pkey: ["inventoryManage","planManage","planDeskList","materialAvailabilityCheckConfig"], breadcrum: ["库存管理","计划管理","计划调度台","物料可用性检查","监控条件配置",] },
    "materialAvailabilityCheckConfig": { title: "物料可用性检查", pkey: ["inventoryManage","planManage","planDeskList"], breadcrum: ["库存管理","计划管理","计划调度台","物料可用性检查"] },

    /**************************************     采购管理        ******************************************/
    //供应商
    "supplier": { title: "供应商", pkey: ["purchaseManage"], breadcrum: ["采购管理", "供应商"] },
    "AddSupplier": { title: "新建供应商", pkey: ["purchaseManage"], breadcrum: ["采购管理", "新建供应商"] },
    "EditSupplier": { title: "编辑供应商", pkey: ["purchaseManage"], breadcrum: ["采购管理", "编辑供应商"] },
    "supplierViewCont": { title: "供应商详情", pkey: ["purchaseManage"], breadcrum: ["采购管理", "供应商详情"] },
    //采购订单
    "purchase": { title: "采购订单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购订单"] },
    "addPurchase": { title: "新建采购订单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "新建采购订单"] },
    "editPurchase": { title: "编辑采购订单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "编辑采购订单"] },
    "purchaseViewCont": { title: "采购订单详情", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购订单详情"] },
    //收货确认单
    "receiptConfirm": { title: "收货确认单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "收货确认单"] },
    "editReceiptConfirm": { title: "执行收货确认单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "执行收货确认单"] },
    "receiptConfirmView": { title: "收货确认单详情", pkey: ["purchaseManage"], breadcrum: ["采购管理", "收货确认单详情"] },

    //采购退货单 Sw
    "purchaseReturn": { title: "采购退货单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购退货单"] },
    "addPurchaseReturn": { title: "新增采购退货单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "新增采购退货单"] },
    "editPurchaseReturn": { title: "编辑采购退货单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "编辑采购退货单"] },
    "purchaseReturnView": { title: "采购退货单详情", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购退货单详情"] },
    //采购退货单
    // "purchasereturn": { title: "采购退货单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购退货单"] },
    // "addPurRet": { title: "新建采购退货单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "新建采购退货单"] },
    // "editPurRet": { title: "编辑采购退货单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "编辑采购退货单"] },
    // "purRetViewCont": { title: "采购退货单详情", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购退货单详情"] },
    //采购价格清单
    "purchasePrice": { title: "采购价格清单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购价格清单"] },
    "addPurchasePrice": { title: "新建采购价格清单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "新建采购价格清单"] },
    "editPurchasePrice": { title: "编辑采购价格清单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "编辑采购价格清单"] },
    "purchasePriceView": { title: "采购价格清单详情", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购价格清单详情"] },
    //采购收货通知单
    "purRecNoticeList": { title: "收货通知单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "收货通知单"] },
    "addPurRecNotice": { title: "新建收货通知单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "新建收货通知单"] },
    "editPurRecNotice": { title: "编辑收货通知单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "编辑收货通知单"] },
    "purRecNoticeView": { title: "收货通知单详情", pkey: ["purchaseManage"], breadcrum: ["采购管理", "收货通知单详情"] },
    //采购需求单
    "requirements": { title: "采购需求单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购需求单"] , closeConfirm: true ,content:'当前数据未保存，确定要关闭吗？'},
    "requirementsNext": { title: "采购需求单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购需求单"], closeConfirm: true ,content:'当前数据未保存，确定要关闭吗？' },
    "requirementsConfrim": { title: "采购需求单", pkey: ["purchaseManage"], breadcrum: ["采购管理", "采购需求单"] , closeConfirm: true ,content:'当前数据未保存，确定要关闭吗？'},
    
    /**************************************     销售管理        ******************************************/
    //客户
    "customer": { title: "客户", pkey: ["saleManage"], breadcrum: ["销售管理", "客户"] },
    "AddCustomer": { title: "新建客户", pkey: ["saleManage"], breadcrum: ["销售管理", "新建客户"] },
    "EditCustomer": { title: "编辑客户", pkey: ["saleManage"], breadcrum: ["销售管理", "编辑客户"] },
    "customerViewCont": { title: "客户详情", pkey: ["saleManage"], breadcrum: ["销售管理", "客户详情"] },
    //销售订单
    "saleOrderList": { title: "销售订单", pkey: ["saleManage"], breadcrum: ["销售管理", "销售订单"] },
    "saleOrderAdd": { title: "新建销售订单", pkey: ["saleManage"], breadcrum: ["销售管理", "新建销售订单"] },
    "saleOrderDetail": { title: "销售订单详情", pkey: ["saleManage"], breadcrum: ["销售管理", "销售订单详情"] },
    "saleOrderEdit": { title: "编辑销售订单", pkey: ["saleManage"], breadcrum: ["销售管理", "编辑销售订单"] },
    //销售退货单
    "saleReturnList": { title: "销售退货单", pkey: ["saleManage"], breadcrum: ["销售管理", "销售退货单"] },
    "saleReturnAdd": { title: "新建销售退货单", pkey: ["saleManage"], breadcrum: ["销售管理", "新建销售退货单"] },
    "saleReturnEdit": { title: "编辑销售退货单", pkey: ["saleManage"], breadcrum: ["销售管理", "编辑销售退货单"] },
    "saleReturnDetail": { title: "销售退货单详情", pkey: ["saleManage"], breadcrum: ["销售管理", "销售退货单详情"] },
    //销售价格单
    "salePriceList": { title: "销售价格清单", pkey: ["saleManage"], breadcrum: ["销售管理", "销售价格情单"] },
    "salePriceAdd": { title: "新建销售价格清单", pkey: ["saleManage"], breadcrum: ["销售管理", "新建销售价格清单"] },
    "salePriceEdit": { title: "编辑销售价格清单", pkey: ["saleManage"], breadcrum: ["销售管理", "编辑销售价格清单"] },
    "salePriceDetail": { title: "销售价格清单详情", pkey: ["saleManage"], breadcrum: ["销售管理", "销售价格清单详情"] },
    //销售发货通知单
    "saleDeliveryNoticeList": { title: "发货通知单", pkey: ["saleManage"], breadcrum: ["销售管理", "发货通知单"] },
    "addSaleDeliveryNotice": { title: "新建发货通知单", pkey: ["saleManage"], breadcrum: ["销售管理", "新建发货通知单"] },
    "editSaleDeliveryNotice": { title: "编辑发货通知单", pkey: ["saleManage"], breadcrum: ["销售管理", "编辑发货通知单"] },
    "saleDeliveryNoticeView": { title: "发货通知单详情", pkey: ["saleManage"], breadcrum: ["销售管理", "发货通知单详情"] },
    
    /**************************************     生产管理        ******************************************/
    //生产订单
    "production": { title: "生产订单", pkey: ["proManage"], breadcrum: ["生产管理", "生产订单"] },
    "addProductionCont": { title: "新建生产订单", pkey: ["proManage"], breadcrum: ["生产管理", "新建生产订单"] },
    "editProductionCont": { title: "编辑生产订单", pkey: ["proManage"], breadcrum: ["生产管理", "编辑生产订单"], closeConfirm: true ,content:'即将离开编辑页面，请确认是否取消已修改的内容？'},
    "productionViewCont": { title: "生产订单详情", pkey: ["proManage"], breadcrum: ["生产管理", "生产订单详情"] },
    //生产领料申请单
    "productionReceive": { title: "生产领料申请单", pkey: ["proManage"], breadcrum: ["生产管理", "生产领料申请单"] },
    "addProducRec": { title: "新建生产领料单", pkey: ["proManage"], breadcrum: ["生产管理", "新建生产领料单"] },
    "editProducRec": { title: "编辑生产领料单", pkey: ["proManage"], breadcrum: ["生产管理", "编辑生产领料单"], closeConfirm: true,content:'即将离开编辑页面，请确认是否取消已修改的内容？' },
    "productionReceiveViewCont": { title: "生产领料单详情", pkey: ["proManage"], breadcrum: ["生产管理", "生产领料单详情"] },
    //生产退料申请单
    "productionReturn": { title: "生产退料申请单", pkey: ["proManage"], breadcrum: ["生产管理", "生产退料申请单"] },
    "addProductionReturnCont": { title: "新建生产退料单", pkey: ["proManage"], breadcrum: ["生产管理", "新建生产退料单"] },
    "editProductionReturnCont": { title: "编辑生产退料单", pkey: ["proManage"], breadcrum: ["生产管理", "编辑生产退料单"], closeConfirm: true ,content:'即将离开编辑页面，请确认是否取消已修改的内容？'},
    "productionReturnViewCont": { title: "生产退料单详情", pkey: ["proManage"], breadcrum: ["生产管理", "生产退料单详情"] },

    /**************************************     主数据        ******************************************/
    //商业伙伴
    "business": { title: "商业伙伴", pkey: ["baseData"], breadcrum: ["主数据", "商业伙伴"] },
    "businessPartner": { title: "商业伙伴详情", pkey: ["baseData"], breadcrum: ["主数据", "商业伙伴详情"] },
    //物料分类
    "MaterialClassifyCont": { title: "物料分类", pkey: ["baseData"], breadcrum: ["主数据", "物料分类"] },
    //物料
    "materialList": { title: "物料列表", pkey: ["baseData"], breadcrum: ["主数据", "物料"] },
    "addMaterial": { title: "新建物料", pkey: ["baseData"], breadcrum: ["主数据", "新建物料"] },
    "editMaterial": { title: "编辑物料", pkey: ["baseData"], breadcrum: ["主数据", "编辑物料"] },
    "detailMaterial": { title: "物料详情", pkey: ["baseData"], breadcrum: ["主数据", "物料详情"] },
    //物料单位换算
    "materialUintConversionList": { title: "物料单位换算", pkey: ["baseData"], breadcrum: ["主数据", "物料单位换算"] },
    //BOM
    "bomList": { title: "BOM", pkey: ["baseData"], breadcrum: ["主数据", "BOM"] },
    "bomAdd": { title: "新建BOM", pkey: ["baseData"], breadcrum: ["主数据", "新建BOM"] },
    "bomEdit": { title: "编辑BOM", pkey: ["baseData"], breadcrum: ["主数据", "编辑BOM"] ,closeConfirm:true,content:'即将离开编辑页面，请确认是否取消已修改的内容？' },
    "bomDetail": { title: "BOM详情", pkey: ["baseData"], breadcrum: ["主数据", "BOM详情"] },
    "bomCopy": { title: "复制BOM", pkey: ["baseData"], breadcrum: ["主数据", "复制BOM"] },
    "bomUpgrade": { title: "升级BOM", pkey: ["baseData"], breadcrum: ["主数据", "升级BOM"] },
    //供应商商品目录
    "supplierGoods": { title: "供应商商品目录", pkey: ["purchaseManage"], breadcrum: ["采购管理", "供应商商品目录"] },
 	//计划单详情、编辑
    "editPlanDeskComp": {title: '计划单详情', pkey: ["planManage"], breadcrum: ["计划管理", "计划单详情"] ,closeConfirm:true,content:'即将离开编辑页面，请确认是否取消已修改的内容？' },
    //计划单列表
    "planDeskList": {title: '计划单列表', pkey: ["planManage"], breadcrum: ["计划管理", "计划单列表"] },
    // 计划调度单 -- 计划分配
    "AddPlanDispatchCont": {title: '计划分配', pkey: ["planManage"], breadcrum: ["计划管理", "计划分配"], closeConfirm:true ,content:'即将离开编辑页面，请确认是否取消已修改的内容？' },
    //报表管理
    "reportIndex": { title: '报表主页', pkey: ["reportManage"], breadcrum: ["报表管理", "报表主页"] },
    "saleReport": { title: '销售订单报表', pkey: ["reportManage"], breadcrum: ["报表管理", "销售订单报表"] },
    "purchaseReport": { title: '采购订单报表', pkey: ["reportManage"], breadcrum: ["报表管理", "采购订单报表"] },
    //产品设计BOM：
    "proDesignBom": { title: "产品设计BOM", pkey: ["baseData"], breadcrum: ["主数据", "产品设计BOM"] },
    "importProDesignBom": { title: "导入产品设计BOM", pkey: ["baseData"], breadcrum: ["主数据", "导入产品设计BOM"],closeConfirm:true,content:'一旦关闭，当前所有数据将无法保留，你确定要继续吗？' },
    "addProDesignBom": { title: "新建产品设计BOM", pkey: ["baseData"], breadcrum: ["主数据", "新建产品设计BOM"] },
    "importProDesignBomDetails": { title: "产品设计BOM详情", pkey: ["baseData"], breadcrum: ["主数据", "产品设计BOM详情"] },
    "editProDesignBom": { title: "编辑产品设计BOM", pkey: ["baseData"], breadcrum: ["主数据", "编辑产品设计BOM"] },

};
export { tabsData };