import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Button, Breadcrumb, Modal } from '../../base/components/AntdComp';
import { removeTabs } from '../../base/consts/Utils';
import TabsAct from '../actions/TabsAct';

//收货确认单
import ReceiptConfirmComp from '../receiptConfirm/comps/ReceiptConfirmComp';
import EditReceiptConfirmComp from '../receiptConfirm/comps/EditReceiptConfirmComp';
import ReceiptConfirmViewComp from '../receiptConfirm/comps/ReceiptConfirmViewComp';

//采购退货单
import PurchaseReturnComp from '../purchaseReturn/comps/PurchaseReturnComp';
import AddPurchaseReturnComp from '../purchaseReturn/comps/AddPurchaseReturnComp';
import EditPurchaseReturnComp from '../purchaseReturn/comps/EditPurchaseReturnComp';
import PurchaseReturnViewComp from '../purchaseReturn/comps/PurchaseReturnViewComp';


import BusinessCont from './RenterModule/BusinessCont';
import BusinessPartnerCont from './RenterModule/BusinessPartnerCont';
import BusinessEditCont from './RenterModule/BusinessEditCont';
import SupplierCont from './RenterModule/SupplierCont';
import CustomerCont from './RenterModule/CustomerCont';
import AddSupplierCont from '../dialogconts/RenterModule/AddSupplierCont';
import EditSupplierCont from '../dialogconts/RenterModule/EditSupplierCont';
import AddCustomerCont from '../dialogconts/RenterModule/AddCustomerCont';
import EditCustomerCont from '../dialogconts/RenterModule/EditCustomerCont';
import SupplierViewCont from './RenterModule/SupplierViewCont';
import CustomerViewCont from './RenterModule/CustomerViewCont';


import AddPurchaseCont from './OrderModule/AddPurchaseCont';
import EditPurchaseCont from './OrderModule/EditPurchaseCont';
//新增生产订单
import AddProductionCont from '../dialogconts/OrderModule/AddProductionCont';
//编辑生产订单
import EditProductionCont from '../dialogconts/OrderModule/EditProductionCont';
//新增生产领料订单
import AddProducRecCont from '../dialogconts/OrderModule/AddProducRecCont';
//编辑生产领料订单
import EditProducRecCont from '../dialogconts/OrderModule/EditProducRecCont';
//新增生产退料订单
import AddProductionReturnCont from '../dialogconts/OrderModule/AddProductionReturnCont';
import EditProductionReturnCont from '../dialogconts/OrderModule/EditProductionReturnCont';

import PurchaseCont from './OrderModule/PurchaseCont';
import PurchaseReturnCont from './OrderModule/PurchaseReturnCont';
// import AddPurchaseReturnComp from '../components/OrderModule/AddPurchaseReturnComp';
import PurchaseViewCont from './OrderModule/PurchaseViewCont';
import PurRetViewCont from './OrderModule/PurchaseReturnViewCont';
import PurchasePriceCont from './OrderModule/PurchasePriceCont';
import AddPurchasePriceCont from './OrderModule/AddPurchasePriceCont';
import EditPurchasePriceCont from './OrderModule/EditPurchasePriceCont';
import PurchasePriceViewCont from './OrderModule/PurchasePriceViewCont';

import ProductionCont from './OrderModule/ProductionCont';
import ProductionReceiveCont from './OrderModule/ProductionReceiveCont';
import ProductionReturnCont from './OrderModule/ProductionReturnCont';
import ProductionViewCont from "./OrderModule/ProductionViewCont";
import ProductionReceiveViewCont from "./OrderModule/ProductionReceiveViewCont";
import ProductionReturnViewCont from "./OrderModule/ProductionReturnViewCont";
import AddPurRetCont from './OrderModule/AddPurRetCont'; //采购退货单新增
import EditPurRetCont from './OrderModule/EditPurRetCont'; //采购退货单新增
import RequirementsComp from '../Requirements/RequirementsComp';//采购需求单
import RequirementsNextComp from '../Requirements/RequirementsNextComp';
import RequirementsConfrimComp from '../Requirements/RequirementsConfrimComp';
//物料
import MaterialCont from './MaterialModule/MaterialCont';
import AddMaterialCont from './MaterialModule/AddMaterialCont';
import EditMaterialCont from './MaterialModule/EditMaterialCont';
import MaterialViewCont from './MaterialModule/MaterialViewCont';

//Bom数据
import BomListCont from './BomModule/BomListCont';
import BomAddCont from './BomModule/BomAddCont';
import BomEditCont from './BomModule/BomEditCont';
import BomDetailCont from './BomModule/BomDetailCont';
import BomCopyCont from './BomModule/BomCopyCont';
import BomUpgradeCont from './BomModule/BomUpgradeCont';

//销售订单
import SaleOrderListCont from './SaleModule/SaleOrderListCont';
import SaleOrderAddCont from './SaleModule/SaleOrderAddCont';
import SaleOrderEditCont from './SaleModule/SaleOrderEditCont';
import SaleOrderDetailCont from './SaleModule/SaleOrderDetailCont';
//销售退货单
import SaleReturnListCont from './SaleModule/SaleReturnListCont';
import SaleReturnAddCont from './SaleModule/SaleReturnAddCont';
import SaleReturnDetailCont from './SaleModule/SaleReturnDetailCont';
import SaleReturnEditCont from './SaleModule/SaleReturnEditCont';
//销售价格单
import SalePriceListCont from './SaleModule/SalePriceListCont';
import SalePriceAddCont from './SaleModule/SalePriceAddCont';
import SalePriceDetailCont from './SaleModule/SalePriceDetailCont';
import SalePriceEditCont from './SaleModule/SalePriceEditCont';

//主数据 —— 物料分类
import MaterialClassifyCont from './MaterialModule/MaterialClassifyCont';
//主数据-物料
import MaterialListComp from '../Material/comps/MaterialListComp';
import MaterialAddComp from '../Material/comps/MaterialAddComp';
import MaterialEditComp from '../Material/comps/MaterialEditComp';
import MaterialDetailComp from '../Material/comps/MaterialDetailComp';
//主数据-物料单位换算
import MaterialUintConversionListComp from '../MaterialUnitConversion/comps/MaterialUintConversionListComp';
//供应商商品目录


//供应商商品目录
import SupplierGoodsComp from '../SupplierGoods/comps/SupplierGoodsComp';

//采购收货通知单
import PurRecNoticeComp from '../PurRecNotice/comps/PurRecNoticeComp';
import AddPurRecNoticeComp from '../PurRecNotice/comps/AddPurRecNoticeComp';
import EditPurRecNoticeComp from '../PurRecNotice/comps/EditPurRecNoticeComp';
import PurRecNoticeViewComp from '../PurRecNotice/comps/PurRecNoticeViewComp';
//销售发货通知单
import SaleDeliveryNoticeComp from '../SaleDelivery/comps/SaleDeliveryNoticeComp';
import AddSaleDeliveryNoticeComp from '../SaleDelivery/comps/AddSaleDeliveryNoticeComp';
import EditSaleDeliveryNoticeComp from '../SaleDelivery/comps/EditSaleDeliveryNoticeComp';
import SaleDeliveryNoticeViewComp from '../SaleDelivery/comps/SaleDeliveryNoticeViewComp';

//产品设计BOM
import ProDesignBomComp from '../ProDesignBom/comp/ProDesignBomComp';
import ImportProDesignBomComp from '../ProDesignBom/comp/ImportProDesignBomComp';
import AddProDesignBomComp from '../ProDesignBom/comp/AddProDesignBomComp';
import ImportProDesignBomDetailsComp from '../ProDesignBom/Comp/ImportProDesignBomDetailsComp';
import EditProDesignBomComp from '../ProDesignBom/comp/EditProDesignBomComp';





//---------------------库存 start -----------------------------

import SaleCarryOutCont from './InventoryModule/SaleCarryOutCont'
import PurchaseListCont from './InventoryModule/PurchaseListCont'
import AddPurchaseListCont from './InventoryModule/AddPurchaseListCont'
import StorageCont from "./InventoryModule/StorageCont"
import PurchaseEidtCont from './InventoryModule/PurchaseEidtCont'
import SalesStoreHouseCont from './InventoryModule/SalesStoreHouseCont'
import NewSalesStoreHouseCont from './InventoryModule/NewSalesStoreHouseCont'
import InstantInventoryCont from './InventoryModule/InstantInventoryCont'
import InventoryBreakdownCont from './InventoryModule/InventoryBreakdownCont'
import SalesOutboundDetailsCont from './InventoryModule/SalesOutboundDetailsCont'
import ReceiptDetailsCont from './InventoryModule/ReceiptDetailsCont'

import SalesReturnStoreCont from './InventoryModule/SalesReturnStoreCont'
import SalesReturnListCont from './InventoryModule/SalesReturnListCont'
import SalesReturnDetailsCont from './InventoryModule/SalesReturnDetailsCont'
import AddReturnSalesListCont from './InventoryModule/AddReturnSalesListCont'
import ReturnMaterialCont from './InventoryModule/ReturnMaterialCont'
import NewPurchaseReturnCont from './InventoryModule/NewPurchaseReturnCont'
import PurchaseReturnOutboundDetailsCont from './InventoryModule/PurchaseReturnOutboundDetailsCont'
import ProductionIssueCont from './InventoryModule/ProductionIssueCont'
import ProductionIssueOutboundDetailsCont from './InventoryModule/ProductionIssueOutboundDetailsCont'
import NewProductionIssueCont from './InventoryModule/NewProductionIssueCont'
import ProductionListCont from './InventoryModule/ProductionListCont'
import ProductionDetailsCont from './InventoryModule/ProductionDetailsCont'

import WareHousingCont from './InventoryModule/WareHousingCont'
import WareHousingDetailsCont from './InventoryModule/WareHousingDetailsCont'
import AddWareHousingCont from './InventoryModule/AddWareHousingCont'

import ProductionStorageCont from './InventoryModule/ProductionStorageCont'
import PurchaseReturnOutCarryOutCont from './InventoryModule/PurchaseReturnOutCarryOutCont'
import ProductionSendMaterialCarryOutCont from './InventoryModule/ProductionSendMaterialCarryOutCont'
import AddInventoryProductionCont from './InventoryModule/AddInventoryProductionCont'
import PurchaseReturnHouseCont from './InventoryModule/PurchaseReturnCont'

import OtherWarehouseCarryOutCont from './InventoryModule/OtherWarehouseCarryOutCont'
import OtherWareHousePageCont from './InventoryModule/OtherWareHousePageCont'
import OtherWareHousePageDetailsCont from './InventoryModule/OtherWareHousePageDetailsCont'
import AddOtherWareHousePageCont from './InventoryModule/AddOtherWareHousePageCont'


import OtherOutboundOrderCont from './InventoryModule/OtherOutboundOrderCont'
import OtherOutboundOrderAddCont from './InventoryModule/OtherOutboundOrderAddCont';
import OtherOutboundOrderEditCont from './InventoryModule/OtherOutboundOrderEditCont';
import OtherWarehouseEditCont from './InventoryModule/OtherWarehouseEditCont'
import OtherOutboundOrderCarryOutCont from './InventoryModule/OtherOutboundOrderCarryOutCont'
import OtherOutboundOrderDetailsCont from './InventoryModule/OtherOutboundOrderDetailsCont'
import AdjustmentListCont from './InventoryModule/AdjustmentListCont'
import AdjustmentMoveDetailsCont from './InventoryModule/AdjustmentMoveDetailsCont';
import InventoryAdjustmentAddCont from './InventoryModule/InventoryAdjustmentAddCont';

import DirectTransferListCont from './InventoryModule/DirectTransferListCont'
import DirectTransferDetailsCont from './InventoryModule/DirectTransferDetailsCont'
import NewDirectTransferCont from './InventoryModule/NewDirectTransferCont'

import WareHouseListComp from '../WareHouse/comp/WareHouseListComp'
import StorageBinListComp from '../StorageBin/comp/StorageBinListComp'
import AddWareHouseCont from "../WareHouse/comp/AddWareHouseCont";


import AllotListComp from '../Allot/comp/AllotListComp'
import AllotDetailsComp from '../Allot/comp/AllotDetailsComp'
import AddAllotComp from '../Allot/comp/AddAllotComp'
//自制件入库单
import SelfMadeInComp from '../SelfMadeIn/comps/SelfMadeInComp'
import AddSelfMadeInComp from '../SelfMadeIn/comps/AddSelfMadeInComp'
import EditSelfMadeInComp from '../SelfMadeIn/comps/EditSelfMadeInComp'
import SelfMadeInViewComp from '../SelfMadeIn/comps/SelfMadeInViewComp'
import ExecSelfMadeInComp from '../SelfMadeIn/comps/ExecSelfMadeInComp'
//---------------------库存 end -----------------------------

import CheckPlanComp from "../InventoryCheck/comp/CheckPlanComp";  // 库存盘点方案
import VarianceReportComp from "../InventoryCheck/comp/VarianceReportComp"; // 盘点差异报告
import InventoryWorkSheetComp from "../InventoryCheck/comp/InventoryWorkSheetComp"; // 盘点作业单
import ImpWorkSheetComp from "../InventoryCheck/comp/ImpWorkSheetComp"; // 执行盘点作业单
import DetailWorkSheetComp from "../InventoryCheck/comp/DetailWorkSheetComp"; // 盘点作业单详情
import VarianceReportDetailsComp from "../InventoryCheck/comp/VarianceReportDetailsComp"; // 盘点差异报告详情
import CheckPlanDetailsComp from "../InventoryCheck/comp/CheckPlanDetailsComp"; // 盘点方案详情

//可用性检查
import MaterialAvailabilityCheckComp from "../MaterialAvailabilityCheck/comps/MaterialAvailabilityCheckComp";
import MaterialAvailabilityCheckConfigComp from "../MaterialAvailabilityCheck/comps/MaterialAvailabilityCheckConfigComp";





//---------------------库存 end -----------------------------
import AddPlanDispatchCont from "../PlanDispatch/comp/AddPlanDispatchComp"; //计划调度单 -- 计划分配
import PlanDeskListComp from "../PlanDispatch/comp/PlanDeskListComp";  // 计划单列表
import EditPlanDeskComp from "../PlanDispatch/comp/EditPlanDeskComp";  // 计划单详情、编辑
//报表管理
import ReportIndexComp from "../ReportManage/comps/ReportIndexComp";
import SaleReportComp from "../ReportManage/comps/SaleReportComp";
import PurchaseReportComp from "../ReportManage/comps/PurchaseReportComp";
const confirm = Modal.confirm;


const TabPane = Tabs.TabPane;
class TabsCont extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            visiable: false,
        }
    }
    onEdit = (targetKey, action) => {
        let closeConfirmTabs = [];
        let contentTabs=[];
        for (let [k, v] of Object.entries(this.props.tabsData)) {
            if (v.closeConfirm == true) {
                closeConfirmTabs.push(k)
            }
            if(v.content){
                contentTabs.push(v.content);
            }
        }
        let remove = () => this[action](targetKey);
        if (closeConfirmTabs.includes(targetKey)) {
            confirm({
                title: '关闭标签页',
                content: contentTabs[closeConfirmTabs.indexOf(targetKey)],
                onOk() {
                    remove();
                },
            });
        } else remove();
    }
    remove = (targetKey) => {
        removeTabs(targetKey, this.props);
    }
    getContent = (tab) => {
        switch (tab.key) {
            case "receiptConfirm":
                return <ReceiptConfirmComp />
                break;
            case "editReceiptConfirm":
                return <EditReceiptConfirmComp />
                break; 
            case "receiptConfirmView":
                return <ReceiptConfirmViewComp />
                break;
            //采购退货单
            case "purchaseReturn":
                return <PurchaseReturnComp />;
                break;
            case "addPurchaseReturn":
                return <AddPurchaseReturnComp />;
                break;
            case "editPurchaseReturn":
                return <EditPurchaseReturnComp />;
                break;
            case "purchaseReturnView":
                return <PurchaseReturnViewComp />;
                break;
                
            case "customer":
                return <CustomerCont />
                break;
            case "supplier":
                return <SupplierCont />
                break;
            case 'business':
                return <BusinessCont />
                break;
            case "businessPartner":
                return <BusinessPartnerCont />
                break;
            case "editBusiness":
                return <BusinessEditCont />
                break;
            case "AddSupplier":
                return <AddSupplierCont />
                break;
            case "EditSupplier":
                return <EditSupplierCont />
                break;
            case "AddCustomer":
                return <AddCustomerCont />
                break;
            case "EditCustomer":
                return <EditCustomerCont />
                break;
            case "supplierViewCont":
                return <SupplierViewCont />
                break;
            case "customerViewCont":
                return <CustomerViewCont />
                break;

            case "addPurchase":
                return <AddPurchaseCont />
                break;
            case "editPurchase":
                return <EditPurchaseCont />
                break;
            // case "addPurchaseReturn":
            //     return <AddPurchaseReturnComp />
            //     break;
            case 'addProductionCont':
                return <AddProductionCont />
                break;
            case 'addInventoryProductionCont':
                return <AddInventoryProductionCont />
                break;
            case 'editProductionCont':
                return <EditProductionCont />
                break;
            case 'addProducRec':
                return <AddProducRecCont />
                break;
            case 'editProducRec':
                return <EditProducRecCont />
                break;
            // case 'addProOrderRet':
            //     return <AddProOrderRetCont />
            //     break;
            case "purchase":
                return <PurchaseCont />
                break;

            case "purchasereturn":
                return <PurchaseReturnCont />
                break;
            case "addPurRet":
                return <AddPurRetCont />
                break;
            case "editPurRet":
                return <EditPurRetCont />
                break;
            case "purchaseViewCont":
                return <PurchaseViewCont tag={tab.tag || {}}/>
                break;
            case "purRetViewCont":
                return <PurRetViewCont />
                break;
            case "purchasePrice":
                return <PurchasePriceCont />
                break;
            case "addPurchasePrice":
                return <AddPurchasePriceCont />
                break;
            case "editPurchasePrice":
                return <EditPurchasePriceCont />
                break;
            case "purchasePriceView":
                return <PurchasePriceViewCont tag={tab.tag || {}}/>
                break;
            case "production":
                return <ProductionCont />
                break;
            case "productionReceive":
                return <ProductionReceiveCont />
                break;
            case "productionReturn":
                return <ProductionReturnCont />
                break;
            case "addProductionReturnCont":
                return <AddProductionReturnCont />
                break;
            case "editProductionReturnCont":
                return <EditProductionReturnCont />
            case "productionViewCont":
                return <ProductionViewCont />
                break;
            case "productionReceiveViewCont":
                return <ProductionReceiveViewCont />
                break;
            case "productionReturnViewCont":
                return <ProductionReturnViewCont />
            case "material":
                return <MaterialCont />
                break;
            case "materialAdd":
                return <AddMaterialCont />
                break;
            case "materialEdit":
                return <EditMaterialCont />
                break;
            case "materialView":
                return <MaterialViewCont />
                break;
            case "bomList":
                return <BomListCont />
                break;
            case "bomAdd":
                return <BomAddCont />
                break;
            case 'bomEdit':
                return <BomEditCont />
                break;
            case 'bomDetail':
                return <BomDetailCont />
                break;
            case 'bomCopy':
                return <BomCopyCont />
                break;
            case 'bomUpgrade':
                return <BomUpgradeCont />
                break;
            case 'saleOrderList':
                return <SaleOrderListCont />
                break;
            case 'saleOrderAdd':
                return <SaleOrderAddCont />
                break;
            case 'saleOrderDetail':
                return <SaleOrderDetailCont />
                break;
            case 'saleOrderEdit':
                return <SaleOrderEditCont />
                break;
            case "saleReturnList":
                return <SaleReturnListCont />
                break;
            case "saleReturnAdd":
                return <SaleReturnAddCont />
                break;
            case 'saleReturnEdit':
                return <SaleReturnEditCont />
                break;
            case 'saleReturnDetail':
                return <SaleReturnDetailCont />
                break;
            case "salePriceList":
                return <SalePriceListCont />
                break;
            case "salePriceAdd":
                return <SalePriceAddCont />
                break;
            case 'salePriceEdit':
                return <SalePriceEditCont />
                break;
            case 'salePriceDetail':
                return <SalePriceDetailCont />
                break;

            case 'inventoryOtherWarehouseCarryOutCont':
                return <OtherWarehouseCarryOutCont />
                break;
            case 'inventoryOtherWareHousePageDetailsCont':  // 其他入库单-详情
                return <OtherWareHousePageDetailsCont />
                break;
            case 'inventoryAddOtherWareHousePageCont':   // 其他入库单-新增
                return <AddOtherWareHousePageCont />
                break;
            case 'inventoryOtherWareHousePageCont':   // 其他入库单
                return <OtherWareHousePageCont />
                break;

            case 'MaterialClassifyCont':  // 物料分类
                return <MaterialClassifyCont />
                break;

            case 'materialList'://主数据-物料
                return <MaterialListComp />
                break;
            case 'addMaterial'://新建物料
                return <MaterialAddComp />
                break;
            case 'editMaterial':
                return <MaterialEditComp />
                break;
            case 'detailMaterial':
                return <MaterialDetailComp />
                break;
            case 'requirements'://采购需求单
                return <RequirementsComp />
                break;
            case 'requirementsNext':
                return <RequirementsNextComp />
                break;
            case 'requirementsConfrim':
                return <RequirementsConfrimComp />
                break;

            case 'materialUintConversionList':
                return <MaterialUintConversionListComp />
                break;



























            //---------------------库存 start -----------------------------

            case "inventorySaleCarryOut": //销售出库单执行
                return <SaleCarryOutCont />;
            case "inventoryStorage":     //仓位
                return <StorageCont />;
            case "inventoryPurchaseListCont":    //采购入库单
                return <PurchaseListCont />;
            case "inventoryAddPurchaseListCont":     //新建采购入库单
                return <AddPurchaseListCont />;
            case "inventoryPurchaseEidt":    //采购入库库执行
                return <PurchaseEidtCont />;
            case "inventorySalesStoreHouse":     //销售出库单
                return <SalesStoreHouseCont />;
            case "inventoryNewSalesStoreHouse":  //新建销售出库单
                return <NewSalesStoreHouseCont />;
            case "inventoryInstantInventory":    //即时库存
                return <InstantInventoryCont />;
            case "inventoryInventoryBreakdown":  //库存明细账
                return <InventoryBreakdownCont />;
            case "inventorySalesOutboundDetails":    //销售出库单详情
                return <SalesOutboundDetailsCont />;
            case "inventoryReceiptDetailsCont":  //采购入库单详情
                return <ReceiptDetailsCont />;
            case "inventorySalesReturnStoreCont":    //销售退货入库单执行
                return <SalesReturnStoreCont />;
            case "inventorySalesReturnListCont":     //销售退货入库单
                return <SalesReturnListCont />;
            case "inventorySalesReturnDetailsCont":  //销售退货入库单详情
                return <SalesReturnDetailsCont />;
            case "inventoryAddReturnSalesListCont":  //新建销售退货入库单
                return <AddReturnSalesListCont />;
            case "inventoryPurchaseReturnHouse":      //采购退货出库单
                return <PurchaseReturnHouseCont />;
            case "inventoryReturnMaterialCont":  //生产退料单执行
                return <ReturnMaterialCont />;
            case "inventoryNewPurchaseReturn":   //新建采购退货出库单
                return <NewPurchaseReturnCont />;
            case "inventoryPurchaseReturnOutboundDetails":   //采购退货出库单详情
                return <PurchaseReturnOutboundDetailsCont />;
            case "inventoryProductionIssue":     //生产发料单
                return <ProductionIssueCont />;
            case "inventoryProductionIssueOutboundDetails":  //生产发料单详情页面
                return <ProductionIssueOutboundDetailsCont />;
            case "inventoryNewProductionIssue":      //新建生产发料单
                return <NewProductionIssueCont />;
            case "inventoryProductionListCont":  //生产退料单
                return <ProductionListCont />;
            case "inventoryProductionDetailsCont":   //生产退料单详情
                return <ProductionDetailsCont />;
            case "inventoryAddInventoryProductionCont":   //新建生产退料单
                return <AddInventoryProductionCont />;
            case "inventoryWareHousingCont":     //生产入库单
                return <WareHousingCont />;
            case "inventoryWareHousingDetailsCont":  //生产入库单详情
                return <WareHousingDetailsCont />;
            case "inventoryAddWareHousingCont":  //新建生产入库单
                return <AddWareHousingCont />;
            case "inventoryProductionStorageCont":   //生产入库单执行
                return <ProductionStorageCont />;
            case "inventoryPurchaseReturnOutCarryOut":   //采购退货出库单执行
                return <PurchaseReturnOutCarryOutCont />;
            case "inventoryProductionSendMaterialCarryOut":  //生产发料单执行
                return <ProductionSendMaterialCarryOutCont />;
            case "inventoryOtherWarehouseEditCont":  // 其他入库单 编辑
                return <OtherWarehouseEditCont />



            case "inventoryOtherOutbound":
                return <OtherOutboundOrderCont />;    //其他出库单
            case "inventoryOtherOutboundOrderCarryOut": //其它出库单执行
                return <OtherOutboundOrderCarryOutCont />;
            case "inventoryOtherOutboundOrderDetails":    //其他出库单详情
                return <OtherOutboundOrderDetailsCont />



            case "inventoryOtherOutboundAdd": //其他出库单新增
                return <OtherOutboundOrderAddCont />;
            case "inventoryOtherOutboundEdit": //编辑其他出库单据
                return <OtherOutboundOrderEditCont />;

            case "AdjustmentListCont": //库存调整单
                return <AdjustmentListCont />;
            case "inventoryAdjustmentAdd": //库存调整
                return <InventoryAdjustmentAddCont />;

            case "AdjustmentMoveDetailsCont": //仓位移动详情
                return <AdjustmentMoveDetailsCont />;






            case "inventoryDirectTransferList": //直接调拨单
                return <DirectTransferListCont />;
            case "inventoryDirectTransferDetails": //直接调拨单详情
                return <DirectTransferDetailsCont />;
            case "inventoryNewDirectTransfer": //新建直接调拨单
                return <NewDirectTransferCont />;
            case "inventoryWareHouse": // 仓库
                return <WareHouseListComp />;

            case "inventoryStorageBin": //仓位
                return <StorageBinListComp />;

            case "AddWareHouseCont": // 新增仓库
                return <AddWareHouseCont />;
            case "inventoryAllotList": // 直接调拨单重写（列表）
                return <AllotListComp />;
            case "inventoryAllotDetails": // 直接调拨单重写（详情）
                return <AllotDetailsComp />;
            case "inventoryAddAllot": // 直接调拨单重写（新建）
                return <AddAllotComp />;
            case "inventoryAllotList": // 直接调拨单重写（列表）
                return <AllotListComp />;
            case "inventoryAllotDetails": // 直接调拨单重写（详情）
                return <AllotDetailsComp />;
            case "inventoryAddAllot": // 直接调拨单重写（新建）
                return <AddAllotComp />;

               case "inventoryCheckPlan": // 库存盘点方案
                return <CheckPlanComp />;
            case "inventoryVarianceReport": // 盘点差异报告
                return <VarianceReportComp />;
            case "inventoryWorkSheet": // 盘点作业单
                 return <InventoryWorkSheetComp />;
            case "impWorkSheetComp": // 执行盘点作业单
                 return <ImpWorkSheetComp />;
            case "detailWorkSheetComp": // 盘点作业单详情
                 return <DetailWorkSheetComp />;
            case "varianceReportDetails": // 盘点差异报告详情
                return <VarianceReportDetailsComp />
            case "CheckPlanDetailsComp":  // 盘点方案详情
                return <CheckPlanDetailsComp />
            case "selfMadeInList":  // 自制件入库单
                return <SelfMadeInComp />
            case "addSelfMadeIn":  // 自制件入库单
                return <AddSelfMadeInComp />
            case "editSelfMadeIn":  // 自制件入库单
                return <EditSelfMadeInComp />
            case "selfMadeInView":  // 自制件入库单
                return <SelfMadeInViewComp />
            case "execSelfMadeIn":  // 自制件入库单
                return <ExecSelfMadeInComp />
                //---------------------库存 end -----------------------------
            //供应商商品目录
            case "supplierGoods":
                return <SupplierGoodsComp />;
                break;
            //销售发货通知单
            case "saleDeliveryNoticeList":
                return <SaleDeliveryNoticeComp />;
                break;
            case "addSaleDeliveryNotice":
                return <AddSaleDeliveryNoticeComp />;
                break;
            case "editSaleDeliveryNotice":
                return <EditSaleDeliveryNoticeComp />;
                break;
            case "saleDeliveryNoticeView":
                return <SaleDeliveryNoticeViewComp  tag={tab.tag||{}}/>;
                break;

            //采购收货通知单
            case "purRecNoticeList":
                return <PurRecNoticeComp />;
                break;
            case "addPurRecNotice":
                return <AddPurRecNoticeComp />;
                break;
            case "editPurRecNotice":
                return <EditPurRecNoticeComp />;
                break;
            case "purRecNoticeView":
                return <PurRecNoticeViewComp />;
                break;
            case "planDeskList": //计划单列表
                return <PlanDeskListComp />;
            case "AddPlanDispatchCont": //新建计划分配
                return <AddPlanDispatchCont />;
            case "editPlanDeskComp": //计划单详情、编辑
                return <EditPlanDeskComp />;

            case "proDesignBom":
                 return <ProDesignBomComp tag={tab.tag || {}}/>;
                break;  
            case "importProDesignBom":
                 return <ImportProDesignBomComp tag={tab.tag || {}}/>;
                break;
            case "addProDesignBom":
                return <AddProDesignBomComp tag={tab.tag || {}}/>;
                break;
            case "importProDesignBomDetails":
                 return <ImportProDesignBomDetailsComp tag={tab.tag || {}}/>;
            case "editProDesignBom":
                  return <EditProDesignBomComp tag={tab.tag || {}}/>;


            //可用性检查
            case "materialAvailabilityCheck":
                return <MaterialAvailabilityCheckComp />;
                break;

            case "materialAvailabilityCheckConfig":
                return <MaterialAvailabilityCheckConfigComp />;
                break;
            //报表管理
            case "reportIndex":
                return <ReportIndexComp />;
                break;
            case "saleReport":
                return <SaleReportComp />;
                break;
            case "purchaseReport":
                return <PurchaseReportComp />;
                break;
            default:
                return null;
        }
    }

    closeOtherTab=(e)=>{
        this.props.closeOtherTab();
    }
    render() {
        const { tabs, activeKey, tabChange, tabsData } = this.props;
        let _breadcrums = undefined;
        if (activeKey) {
            _breadcrums = tabsData[activeKey] ? tabsData[activeKey].breadcrum : undefined;
        }





        return (
            <div>
                <div className="ew-breadcrumb">
                    {/*<div className="breadcrum-inner">*/}
                    {/*<Breadcrumb separator=">">*/}
                    {/*<Breadcrumb.Item>你所在的位置</Breadcrumb.Item>*/}
                    {/*{*/}
                    {/*_breadcrums != undefined ? _breadcrums.map((item, index) => {*/}
                    {/*return (<Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>)*/}
                    {/*}) : null*/}
                    {/*}*/}
                    {/*</Breadcrumb>*/}
                    {/*</div>*/}
                </div>
                <div className="ew-tabs">
                    <Tabs
                        tabBarExtraContent={
                            <div className="close-close-other-tab-btn" onClick={this.closeOtherTab}>关闭其他页签</div>
                        }
                        animated={false}
                        hideAdd
                        onChange={tabChange}
                        activeKey={activeKey}
                        type="editable-card"
                        onEdit={this.onEdit}
                    >
                        {
                            tabs.map(pane =>
                                <TabPane tab={pane.title} key={pane.key}>
                                    {this.getContent(pane)}
                                </TabPane>
                            )
                        }
                    </Tabs>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return state.TabsRedu.toJS();
}
const mapDispatchToProps = (dispatch) => ({
    tabChange: (activeKey) => {
        dispatch(TabsAct.TabChange(activeKey));
    },
    tabRemove: (key, activeKey) => {
        dispatch(TabsAct.TabRemove(key, activeKey));
    },
    closeOtherTab: () => {
        dispatch(TabsAct.removeOther());
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(TabsCont);