import { prefixMsgPub, prefixMsgScm, prefixMsgEc, prefixMsgOa } from '../../base/consts/UrlsConfig'
//所有侧栏菜单数据

//管理模块
let manageModule = [
    {
        "level": 1,
        "resourceCode": "organi",
        "resourceName": "组织架构",
        "font": "c2m-zuzhijiagou",
        "menuList": [
            {
                "resourceCode": "department",
                "resourceName": "部门",
            },
            {
                "resourceCode": "position",
                "resourceName": "职位",
            }
        ]
    },
    {
        "level": 1,
        "resourceCode": "member",
        "resourceName": "员工管理",
        "font": "c2m-yuangongguanli",
    },
    {
        "level": 1,
        "resourceCode": "authority",
        "resourceName": "权限管理",
        "font": "c2m-quanxianguanli",
    },
    {
        "level": 1,
        "resourceCode": "system",
        "resourceName": "系统设置",
        "font": "c2m-xitongshezhi",
        "menuList": [
            {
                "resourceCode": "coderule",
                "resourceName": "编码规则",
            },
            {
                "resourceCode": "basedata",
                "resourceName": "基础数据",
                "menuList": [
                    {
                        "resourceCode": "minzu",
                        "resourceName": "民族",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "xingbie",
                        "resourceName": "性别",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "yuyan",
                        "resourceName": "语言",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "hunyin",
                        "resourceName": "婚姻",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "zhengjian",
                        "resourceName": "证件类型",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "renzhi",
                        "resourceName": "任职类型",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "xuexing",
                        "resourceName": "血型",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "zaizhi",
                        "resourceName": "在职状态",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "xueli",
                        "resourceName": "学历",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "hangye",
                        "resourceName": "行业",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "companysize",
                        "resourceName": "公司规模",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "companynature",
                        "resourceName": "公司类别",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "companycategory",
                        "resourceName": "公司性质",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "managementtype",
                        "resourceName": "经营类型",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "country",
                        "resourceName": "国家",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "province",
                        "resourceName": "省份",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "city",
                        "resourceName": "城市",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "county",
                        "resourceName": "区县",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "inventorystatus",
                        "resourceName": "库存状态",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "invoicetype",
                        "resourceName": "发票类型",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "zhifu",
                        "resourceName": "支付条款",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "shoufu",
                        "resourceName": "收付款条件",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "accountmethod",
                        "resourceName": "结算方式",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "deliverymethod",
                        "resourceName": "配送方式",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "valuation",
                        "resourceName": "计价元素",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "currency",
                        "resourceName": "币种",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "businesstype",
                        "resourceName": "业务类型",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "meterage",
                        "resourceName": "计量单位",
                        "hidden": true,
                    }
                ]
            },
            {
                "resourceCode": "address",
                "resourceName": "地址管理",
            },
            {
                "resourceCode": "site",
                "resourceName": "站点管理",
            },
        ]
    }
];

//供应链模块
let supplyModule = [
    {
        "level": 1,
        "resourceCode": "inventoryManage",
        "resourceName": "库存管理",
        "font": "c2m-kucunguanli1",
        "menuList": [
            {
                "resourceCode": "inventoryPurchase",
                "resourceName": "入库管理",
                "menuList": [
                    {
                        "resourceCode": "inventoryPurchaseListCont",
                        "resourceName": "采购入库单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryPurchaseEidt",
                                "resourceName": "执行采购入库单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryAddPurchaseListCont",
                                "resourceName": "新建采购入库单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryReceiptDetailsCont",
                                "resourceName": "采购入库单详情",
                                "hidden": true,

                            },
                        ]
                    },
                    {
                        "resourceCode": "inventorySalesReturnListCont",
                        "resourceName": "销售退货入库单",
                        "menuList": [
                            {
                                "resourceCode": "inventorySalesReturnStoreCont",
                                "resourceName": "执行销售退货入库单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryAddReturnSalesListCont",
                                "resourceName": "新建销售退货入库单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventorySalesReturnDetailsCont",
                                "resourceName": "销售退货入库单详情",
                                "hidden": true,

                            },
                        ]
                    },
                    {
                        "resourceCode": "inventoryWareHousingCont",
                        "resourceName": "生产入库单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryProductionStorageCont",
                                "resourceName": "执行生产入库单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryAddWareHousingCont",
                                "resourceName": "新建生产入库单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryWareHousingDetailsCont",
                                "resourceName": "生产入库单收货详情",
                                "hidden": true,

                            },
                        ]
                    },
                    {
                        "resourceCode": "inventoryProductionListCont",
                        "resourceName": "生产退料单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryReturnMaterialCont",
                                "resourceName": "执行生产退料单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryAddInventoryProductionCont",
                                "resourceName": "新建生产退料单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryProductionDetailsCont",
                                "resourceName": "生产退料单详情",
                                "hidden": true,

                            },
                        ]
                    },
                    {
                        "resourceCode": "selfMadeInList",
                        "resourceName": "自制件入库单",
                        "menuList": [
                            {
                                "resourceCode": "selfMadeInView",
                                "resourceName": "自制件入库单详情",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "addSelfMadeIn",
                                "resourceName": "新建自制件入库单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "editSelfMadeIn",
                                "resourceName": "编辑自制件入库单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "execSelfMadeIn",
                                "resourceName": "执行自制件入库单",
                                "hidden": true,
                            },
                        ]
                    },
                    {
                        "resourceCode": "inventoryOtherWareHousePageCont",
                        "resourceName": "其他入库单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryOtherWareHousePageDetailsCont",
                                "resourceName": "其他入库单详情",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryAddOtherWareHousePageCont",
                                "resourceName": "新建其他入库单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryOtherWarehouseEditCont",
                                "resourceName": "编辑其他入库单",
                                "hidden": true,

                            },
                            {
                                "resourceCode": "inventoryOtherWarehouseCarryOutCont",
                                "resourceName": "执行其他入库单",
                                "hidden": true,
                            },
                        ]
                    },
                ]
            },
            {
                "resourceCode": "inventoryOutbound",
                "resourceName": "出库管理",
                "menuList": [
                    {
                        "resourceCode": "inventorySalesStoreHouse",
                        "resourceName": "销售出库单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryNewSalesStoreHouse",
                                "resourceName": "新建销售出库单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventorySaleCarryOut",
                                "resourceName": "执行销售出库单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventorySalesOutboundDetails",
                                "resourceName": "销售出库单详情",
                                "hidden": true,
                            },
                        ]
                    },
                    {
                        "resourceCode": "inventoryPurchaseReturnHouse",
                        "resourceName": "采购退货出库单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryNewPurchaseReturn",
                                "resourceName": "新建采购退货出库单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventoryPurchaseReturnOutCarryOut",
                                "resourceName": "执行采购退货出库单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventoryPurchaseReturnOutboundDetails",
                                "resourceName": "采购退货出库单详情",
                                "hidden": true,
                            },
                        ]
                    },
                    {
                        "resourceCode": "inventoryProductionIssue",
                        "resourceName": "生产发料单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryNewProductionIssue",
                                "resourceName": "新建生产发料单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventoryProductionSendMaterialCarryOut",
                                "resourceName": "执行生产发料单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventoryProductionIssueOutboundDetails",
                                "resourceName": "生产发料单详情",
                                "hidden": true,
                            },
                        ]
                    },
                    {
                        "resourceCode": "inventoryOtherOutbound",
                        "resourceName": "其他出库单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryOtherOutboundAdd",
                                "resourceName": "新建其他出库单据",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventoryOtherOutboundEdit",
                                "resourceName": "编辑其他出库单据",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventoryOtherOutboundOrderCarryOut",
                                "resourceName": "执行其他出库单据",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventoryOtherOutboundOrderDetails",
                                "resourceName": "其他出库单据详情",
                                "hidden": true,
                            },
                        ]
                    },
                ]
            },
            {
                "resourceCode": "inventoryAllot",
                "resourceName": "库存调拨",
                "menuList": [
                    {
                        "resourceCode": "inventoryAllotList",
                        "resourceName": "直接调拨单",
                        "menuList": [
                            {
                                "resourceCode": "inventoryAddAllot",
                                "resourceName": "新建直接调拨单",
                                "hidden": true,
                            },
                            {
                                "resourceCode": "inventoryAllotDetails",
                                "resourceName": "直接调拨单详情",
                                "hidden": true,
                            },
                        ]
                    },
                ]
            },
            {
                "resourceCode": "inventoryAdjustment",
                "resourceName": "库存调整",
                "menuList": [
                    {
                        "resourceCode": "AdjustmentListCont",
                        "resourceName": "库存调整单",
                    },
                ]
            },
            {
                "resourceCode": "inventoryCheck",
                "resourceName": "库存盘点",
                "menuList": [
                    {
                        "resourceCode": "inventoryCheckPlan",
                        "resourceName": "盘点方案",
                    },
                    {
                        "resourceCode": "inventoryWorkSheet",
                        "resourceName": "盘点作业单",
                    },
                    {
                        "resourceCode": "inventoryVarianceReport",
                        "resourceName": "盘点差异报告",
                    },
                ]
            },
            {
                "resourceCode": "inventorySearch",
                "resourceName": "库存查询",
                "menuList": [
                    {
                        "resourceCode": "inventoryInstantInventory",
                        "resourceName": "即时库存",

                    },
                    {
                        "resourceCode": "inventoryInventoryBreakdown",
                        "resourceName": "库存明细账",

                    },
                ]
            },
            {
                "resourceCode": "inventorySettings",
                "resourceName": "基础设置",
                "menuList": [
                    {
                        "resourceCode": "inventoryWareHouse",
                        "resourceName": "仓库",

                    },
                    {
                        "resourceCode": "inventoryStorageBin",
                        "resourceName": "仓位",

                    },
                ]
            },
        ]
    },
    {
        "level": 1,
        "resourceCode": "purchaseManage",
        "resourceName": "采购管理",
        "font": "c2m-caigouguanli",
        "menuList": [
            {
                "resourceCode": "supplier",
                "resourceName": "供应商",
                "menuList": [
                    {
                        "resourceCode": "AddSupplier",
                        "resourceName": "新建供应商",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "EditSupplier",
                        "resourceName": "编辑供应商",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "supplierViewCont",
                        "resourceName": "供应商详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "purchasePrice",
                "resourceName": "采购价格清单",
                "menuList": [
                    {
                        "resourceCode": "addPurchasePrice",
                        "resourceName": "新建采购价格清单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editPurchasePrice",
                        "resourceName": "编辑采购价格清单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "purchasePriceView",
                        "resourceName": "采购价格清单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "requirements",
                "resourceName": "采购需求单",
                 "menuList": [
                    {
                        "resourceCode": "requirementsNext",
                        "resourceName": "采购需求单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "requirementsConfrim",
                        "resourceName": "采购需求单",
                        "hidden": true,
                    }
                ]
            },
            {
                "resourceCode": "purchase",
                "resourceName": "采购订单",
                "menuList": [
                    {
                        "resourceCode": "addPurchase",
                        "resourceName": "新建采购订单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editPurchase",
                        "resourceName": "编辑采购订单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "purchaseViewCont",
                        "resourceName": "采购订单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "purRecNoticeList",
                "resourceName": "收货通知单",
                "menuList": [
                    {
                        "resourceCode": "addPurRecNotice",
                        "resourceName": "新建收货通知单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editPurRecNotice",
                        "resourceName": "编辑收货通知单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "purRecNoticeView",
                        "resourceName": "收货通知单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "receiptConfirm",
                "resourceName": "收货确认单",
                "menuList": [
                    {
                        "resourceCode": "editReceiptConfirm",
                        "resourceName": "执行收货确认单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "receiptConfirmView",
                        "resourceName": "收货确认单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "purchaseReturn",
                "resourceName": "采购退货单",
                "menuList": [
                    {
                        "resourceCode": "addPurRet",
                        "resourceName": "新建采购退货单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editPurRet",
                        "resourceName": "编辑采购退货单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "purRetViewCont",
                        "resourceName": "采购退货单详情",
                        "hidden": true,
                    },
                ]
            },
        ]
    },
    {
        "level": 1,
        "resourceCode": "saleManage",
        "resourceName": "销售管理",
        "font": "c2m-xiaoshouguanli",
        "menuList": [
            {
                "resourceCode": "saleOrderList",
                "resourceName": "销售订单",
                "menuList": [
                    {
                        "resourceCode": "saleOrderAdd",
                        "resourceName": "新建销售订单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "saleOrderEdit",
                        "resourceName": "编辑销售订单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "saleOrderDetail",
                        "resourceName": "销售订单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "saleDeliveryNoticeList",
                "resourceName": "发货通知单",
                "menuList": [
                    {
                        "resourceCode": "addSaleDeliveryNotice",
                        "resourceName": "新建发货通知单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editSaleDeliveryNotice",
                        "resourceName": "编辑发货通知单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "saleDeliveryNoticeView",
                        "resourceName": "发货通知单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "saleReturnList",
                "resourceName": "销售退货单",
                "menuList": [
                    {
                        "resourceCode": "saleReturnAdd",
                        "resourceName": "新建销售退货单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "saleReturnEdit",
                        "resourceName": "编辑销售退货单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "saleReturnDetail",
                        "resourceName": "销售退货单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "salePriceList",
                "resourceName": "销售价格清单",
                "menuList": [
                    {
                        "resourceCode": "salePriceAdd",
                        "resourceName": "新建销售价格清单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "salePriceEdit",
                        "resourceName": "编辑销售价格清单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "salePriceDetail",
                        "resourceName": "销售价格清单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "customer",
                "resourceName": "客户",
                "menuList": [
                    {
                        "resourceCode": "AddCustomer",
                        "resourceName": "新建客户",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "EditCustomer",
                        "resourceName": "编辑客户",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "customerViewCont",
                        "resourceName": "客户详情",
                        "hidden": true,
                    },
                ]
            },
        ]
    },
    {
        "level": 1,
        "resourceCode": "planManage",
        "resourceName": "计划管理",
        "font": "c2m-jihuaguanli",
        "menuList": [
            {
                "resourceCode": "planDeskList",
                "resourceName": "计划调度台",
                "menuList": [
                    {
                        "resourceCode": "AddPlanDispatchCont",
                        "resourceName": "计划分配",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editPlanDeskComp",
                        "resourceName": "计划单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "materialAvailabilityCheckConfig",
                "resourceName": "物料可用性检查",
                "menuList": [
                    {
                        "resourceCode": "materialAvailabilityCheck",
                        "resourceName": "监控条件配置",
                        "hidden": true,
                    },
                ]
            }
        ]
    },
    {
        "level": 1,
        "resourceCode": "proManage",
        "resourceName": "生产管理",
        "font": "c2m-shengchanguanli1",
        "menuList": [
            {
                "resourceCode": "production",
                "resourceName": "生产订单",
                "menuList": [
                    {
                        "resourceCode": "addProductionCont",
                        "resourceName": "新建生产订单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editProductionCont",
                        "resourceName": "编辑生产订单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "productionViewCont",
                        "resourceName": "生产订单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "productionReceive",
                "resourceName": "生产领料申请单",
                "menuList": [
                    {
                        "resourceCode": "addProducRec",
                        "resourceName": "新建生产领料单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editProducRec",
                        "resourceName": "编辑生产领料单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "productionReceiveViewCont",
                        "resourceName": "生产领料单详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "productionReturn",
                "resourceName": "生产退料申请单",
                "menuList": [
                    {
                        "resourceCode": "addProductionReturnCont",
                        "resourceName": "新建生产退料单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editProductionReturnCont",
                        "resourceName": "编辑生产退料单",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "productionReturnViewCont",
                        "resourceName": "生产退料单详情",
                        "hidden": true,
                    },
                ]
            },
        ]
    },
    {
        "level": 1,
        "resourceCode": "mainData",
        "resourceName": "主数据",
        "font": "c2m-zhushuju",
        "menuList": [
            {
                "resourceCode": "materialList",
                "resourceName": "物料",
                "menuList": [
                    {
                        "resourceCode": "addMaterial",
                        "resourceName": "新建物料",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editMaterial",
                        "resourceName": "编辑物料",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "detailMaterial",
                        "resourceName": "物料详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "materialUintConversionList",
                "resourceName": "物料单位换算",
            },
            {
                "resourceCode": "MaterialClassifyCont",
                "resourceName": "物料分类",
            },
            {
                "resourceCode": "bomList",
                "resourceName": "BOM",
                "menuList": [
                    {
                        "resourceCode": "bomAdd",
                        "resourceName": "新建BOM",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "bomEdit",
                        "resourceName": "编辑BOM",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "bomDetail",
                        "resourceName": "BOM详情",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "bomCopy",
                        "resourceName": "复制BOM",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "bomUpgrade",
                        "resourceName": "升级BOM",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "proDesignBom",
                "resourceName": "产品设计BOM",
                "menuList": [
                    {
                        "resourceCode": "importProDesignBom",
                        "resourceName": "导入产品设计BOM",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "addProDesignBom",
                        "resourceName": "新建产品设计BOM",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "importProDesignBomDetails",
                        "resourceName": "产品设计BOM详情",
                        "hidden": true,
                    },
                    {
                        "resourceCode": "editProDesignBom",
                        "resourceName": "编辑产品设计BOM",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "business",
                "resourceName": "商业伙伴",
                "menuList": [
                    {
                        "resourceCode": "businessPartner",
                        "resourceName": "商业伙伴详情",
                        "hidden": true,
                    },
                ]
            },
            {
                "resourceCode": "supplierGoods",
                "resourceName": "供应商商品目录",
            },
        ]
    },
    {
        "level": 1,
        "resourceCode": "reportManage",
        "resourceName": "报表管理",
        "font": "c2m-baobiaoguanli",
        "menuList": [
            {
                "resourceCode": "reportIndex",
                "resourceName": "报表主页",
            },
            {
                "resourceCode": "saleReport",
                "resourceName": "销售订单报表",
            },
            {
                "resourceCode": "purchaseReport",
                "resourceName": "采购订单报表",
            },
        ]
    }
];
//审批模块
let examineModule = [
    {
        "level": 1,
        "resourceCode": "archive",
        "resourceName": "审批归档",
        "font": "c2m-shenpiguidang",
        "menuList": [
            {
                "resourceCode": "approveForme",
                "resourceName": "待我审批",
                "hidden": true,
            },
        ]
    },
    {
        "level": 1,
        "resourceCode": "approve",
        "resourceName": "审批表管理",
        "font": "c2m-shenpibiaoguanli",
        "menuList": [
            {
                "resourceCode": "flowform",
                "resourceName": "表单流程列表",
                "hidden": true,
            },
            {
                "resourceCode": "flowconfig",
                "resourceName": "流程配置",
                "hidden": true,
            },
        ]
    }
  /*  {
        "level": 1,
        "resourceCode": "trash",
        "resourceName": "回收站",
        "font": "c2m-huishouzhan",
    }*/
];
//电商模块
let shopModule = [
    {
        "level": 1,
        "resourceCode": "esm",
        "resourceName": "电商管理",
        "font": "iconfont icon-dianshangguanlishouye",
        "menuList": [
            {
                "resourceCode": "esmcenter",
                "resourceName": "首页",
                "menuList": []
            }
        ],
    },
    {
        "level": 1,
        "resourceCode": "goods",
        "resourceName": "商品管理",
        "font": "icon-shangpinguanli",
        "menuList": [
            {
                "resourceCode": "commoditymaterial",
                "resourceName": "物料库",
                "menuList": [
                    {
                        "resourceCode": "addGoods",
                        "resourceName": "上架销售",
                        "hidden": true,
                    }
                ]
            }, {
                "resourceCode": "CommodityList",
                "resourceName": "商品列表",
                "menuList": [
                    {
                        "resourceCode": "editGoods",
                        "resourceName": "商品编辑",
                        "hidden": true,
                    },
                ]
            },
        ],
    },
    {
        "level": 1,
        "resourceCode": "sale",
        "resourceName": "销售管理",
        "font": "icon-xiaoshouguanli",
        "menuList": [
            {
                "resourceCode": "saleOrder",
                "resourceName": "销售订单管理",
                "menuList": [
                    {
                        "resourceCode": "SalerDetailsCont",
                        "resourceName": "销售订单详情",
                        "hidden": true,
                    },
                ]
            }, {
                "resourceCode": "quoteManage",
                "resourceName": "报价管理",
                "menuList": [
                    {
                        "resourceCode": "quoteDetail",
                        "resourceName": "报价单详情",
                        "hidden": true,
                    }, {
                        "resourceCode": "repostQuote",
                        "resourceName": "重新报价",
                        "hidden": true,
                    },
                ]
            }, {
                "resourceCode": "customerInquiry",
                "resourceName": "客户询价申请",
            }, {
                "resourceCode": "shipNotice",
                "resourceName": "发货通知",
                "menuList": [
                    {
                        "resourceCode": "shipNoticeView",
                        "resourceName": "发货通知单详情",
                        "hidden": true,
                    },
                ]
            },
        ],
    },
    {
        "level": 1,
        "resourceCode": "purchaseManagement",
        "resourceName": "采购管理",
        "font": "icon-caigouguanli",
        "menuList": [
            {
                "resourceCode": "purchaseOrder",
                "resourceName": "采购订单管理",
                "menuList": [
                    {
                        "resourceCode": "PurchaseDetailsCont",
                        "resourceName": "采购订单详情",
                        "hidden": true,
                    },
                ]
            }, {
                "resourceCode": "inquiryManage",
                "resourceName": "询价管理",
                "menuList": [
                    {
                        "resourceCode": "releaseInquiry",
                        "resourceName": "待发布询价单",
                        "hidden": true,
                    }, {
                        "resourceCode": "inquiryResult",
                        "resourceName": "询价结果",
                        "hidden": true,
                    }, {
                        "resourceCode": "inquiryResultDetail",
                        "resourceName": "询价结果详情",
                        "hidden": true,
                    }, {
                        "resourceCode": "submitPurchaseOrder",
                        "resourceName": "提交采购订单",
                        "hidden": true,
                    }, {
                        "resourceCode": "comparePrice",
                        "resourceName": "比价",
                        "hidden": true,
                    }, {
                        "resourceCode": "comparePriceDetail",
                        "resourceName": "比价详情",
                        "hidden": true,
                    },
                ]
            }, {
                "resourceCode": "supplierManage",
                "resourceName": "供应商管理",
            }, {
                "resourceCode": "receiveNotice",
                "resourceName": "送货通知单",
                "menuList": [
                    {
                        "resourceCode": "addReceiveNotice",
                        "resourceName": "新建送货通知单",
                        "hidden": true,
                    }, {
                        "resourceCode": "receiveNoticeView",
                        "resourceName": "送货通知单详情",
                        "hidden": true,
                    }, {
                        "resourceCode": "editReceiveNotice",
                        "resourceName": "编辑送货通知单",
                        "hidden": true,
                    },
                ]
            },
        ],
    }
];

//所有菜单权限数据
let allMenusData = [
    {
        "resourceCode": "manageModule",
        "resourceName": "管理",
        "module": "pub",
        "menuList": manageModule
    },
    {
        "resourceCode": "examineModule",
        "resourceName": "审批",
        "module": "oa",
        "menuList": examineModule
    },
    {
        "resourceCode": "supplyModule",
        "resourceName": "供应链",
        "module": "scm",
        "menuList": supplyModule
    },
    {
        "resourceCode": "shopModule",
        "resourceName": "电商",
        "module": "ec",
        "menuList": shopModule
    },
    {
        "resourceCode": "apsModule",
        "resourceName": "APS",
        "url": '#',
        "menuList": []
    },
];
export { allMenusData }


//获取用户有权限的顶部导航
let getNavs = (poses) => {
    let loop = (data, index) => {
        let list = [];
        data.forEach((d, i) => {
            let item = Object.assign({}, d);
            item.hasAuth = false;
            let pos = index + "-" + i;
            poses.forEach(p => {
                if (p.startsWith(pos)) item.hasAuth = true;
            })
            if (item.menuList && item.menuList.length > 0) {
                item.menuList = loop(item.menuList, pos);
            }
            list.push(item);
        })
        return list;
    }
    return loop(allMenusData, "0");
};
export { getNavs };

//获取用户有权限的侧栏菜单数据
let getMenus = (poses, module) => {
    let loop = (data, index) => {
        let list = [];
        data.forEach((d, i) => {
            let item = Object.assign({}, d);
            item.hasAuth = false;
            let pos = index + "-" + i;
            poses.forEach(p => {
                if (p.slice(2).startsWith(pos)) item.hasAuth = true;
            })
            if (item.menuList && item.menuList.length > 0) {
                item.menuList = loop(item.menuList, pos);
            }
            list.push(item);
        });
        return list;
    }
    let index = allMenusData.map(m => m.resourceCode).indexOf(module);
    return loop(allMenusData[index].menuList, index);
};
export { getMenus };

//获取有权限的标签页数据 
let getTabs = (poses, tabsData, module) => {
    let menus = getMenus(poses, module);
    let newTabsData = {};
    let loop = (data) => {
        data.forEach((item, index) => {
            if (item.hasAuth) {
                if (item.resourceCode in tabsData) {
                    newTabsData[item.resourceCode] = tabsData[item.resourceCode]
                }
                if (item.menuList && item.menuList.length > 0) {
                    item.menuList.forEach(m => {
                        if (m.hidden && m.resourceCode in tabsData) {
                            newTabsData[m.resourceCode] = tabsData[m.resourceCode]
                        }
                    })
                    loop(item.menuList);
                }
            }
        })
    }
    loop(menus);
    return newTabsData;
};
export { getTabs };

//获取左侧菜单树组件
import { Menu } from '../components/AntdComp';

let getMenusComp = (menus) => {
    let loop = (data) => {
        if (Array.isArray(data)) {
            return data.map((item, index) => {
                if (item.hasAuth && !item.hidden) {
                    if (item.menuList && item.menuList.length > 0) {
                        item.menuList = item.menuList.filter(m => !m.hidden);
                    };
                    if (item.menuList && item.menuList.length > 0) {
                        return <Menu.SubMenu key={item.resourceCode} title={
                            <span>
                                {
                                    item.font?<i className={`c2mfont menu-c2m-font ${item.font}`} />:null
                                }
                                <span className="nav-text">{item.resourceName}</span>
                            </span>
                        }>
                            {loop(item.menuList)}
                        </Menu.SubMenu>
                    } else {
                        if (item.level == 1) {
                            return <Menu.Item
                                className="menu-root-one"
                                key={item.resourceCode}
                                title={item.resourceName}
                            >
                                <span>
                                    <i className={`c2mfont menu-c2m-font ${item.font || ''}`} />
                                    <span className="nav-text">{item.resourceName}</span>
                                </span>
                            </Menu.Item>
                        } else {
                            return <Menu.Item key={item.resourceCode} title={item.resourceName}>{item.resourceName}</Menu.Item>
                        }
                    }
                }
            })
        } else {
            return []
        }
    }
    return loop(menus);
}

export { getMenusComp };

//获取URL
let getUrl = (item, module) => {
    let getModule = {
        "pub": `${prefixMsgPub}R/main/index?tab=`,
        "oa": `${prefixMsgOa}oa.html?tab=`,
        "scm": `${prefixMsgScm}scm.html?tab=`,
        "ec": `${prefixMsgEc}shop.html?tab=`,
    };
    let url = item.url || ((item.resourceCode && getModule[module]) ? `${getModule[module]}${item.resourceCode}` : '#');

    if (item.menuList && item.menuList.length > 0) {
        url = getUrl(item.menuList[0], module);
    }
    return url;
}
let getUrls = (tree) => {
    let loop = (data) => data.map(item => {
        if (item.module) {
            item.url = getUrl(item, item.module);
        };
        if (item.menuList && item.menuList.length > 0) {
            if (item.module) {
                item.menuList.map(m => {
                    m.module = item.module;
                    return item;
                })
            }
            loop(item.menuList);
        };
        return item;
    })
    return loop(tree);
}
export { getUrls };
