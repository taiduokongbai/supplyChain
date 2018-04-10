import moment from "moment";
import AutoCompleteStore from '../../base/stores/AutoCompleteStore';
import SelectStore from '../../base/stores/SelectStore';
import TreeSelectStore from '../../base/stores/TreeSelectStore';
import { PurchaseFetch } from '../consts/PurchaseUrls';
import { InventoryFetch,AllotFetch } from '../consts/InventoryUrls'
import PurchaseReturnFetch from '../purchaseReturn/stores/PurchaseReturnUrls';
import { SaleDeliveryFetch } from '../consts/SaleDeliveryUrls';
import ReceiptConfirmFetch from '../receiptConfirm/stores/ReceiptConfirmUrls';
import SelectTableStore from '../../base/stores/SelectTableStore';
import { PurRecFetch } from '../consts/PurRecUrls';
import {WorkSheetCheck} from'../consts/CheckUrls'
import { Select } from 'antd';

let { observable, action, computed, runInAction, autorun } = mobx;

//单位下拉
export class MeasureStore extends SelectStore {
    keyName = 'meaCode';
    labelName = 'meaName';

    @action
    fetchSelectList(pm) {
        return PurchaseFetch.measureList(pm)
            .then(this.updateSelectList);
    }
}
const measureStore = new MeasureStore();

let initMeasure = autorun(() => {
    if (!measureStore.selectList.slice().length > 0) {
        measureStore.fetchSelectList();
    }
});
initMeasure();
export { measureStore };
//物料单位下拉
export class MaterialMeasureStore extends SelectStore {
    keyName = 'meaName';
    labelName = 'meaName';
    @action
    fetchSelectList(pm) {
        return PurchaseFetch.measureList(pm)
            .then(this.updateSelectList);
    }
}
const materialMeasureStore = new MaterialMeasureStore();

let initMeasurem = autorun(() => {
    if (!materialMeasureStore.selectList.slice().length > 0) {
        materialMeasureStore.fetchSelectList();
    }
});
initMeasurem();
export { materialMeasureStore };

//采购表单中的供应商下拉
export class SupplierStore extends AutoCompleteStore {
    keyName = "supplierCode";
    displayName = ["supplierCode", "supplierFull"];

    @action
    fetchSelectList(value, pm) {
        this.loading = true;
        return PurchaseFetch.supplierList({ supplierCode: value, supplierFull: value,...pm })
            .then(this.updateSelectList);
    }

}
//采购表单中的采购组织下拉
export class PurOrgStore extends AutoCompleteStore {
    keyName = "orgCode";
    displayName = ["orgCode", "orgName"];

    @action
    fetchSelectList(value,pm) {
        return PurchaseFetch.purOrgList({ orgCode: value, orgName:value, ...pm })
            .then(this.updateSelectList);
    }
}
//收货确认单中的采购组织下拉
export class PurchaseOrgStore extends AutoCompleteStore {
    keyName = "orgCode";
    displayName = ["orgCode", "orgName"];

    @action
    fetchSelectList(value,pm) {
        return ReceiptConfirmFetch.purOrgList({orgCode: value, orgName:value, ...pm })
            .then(this.updateSelectList);
    }
}
//收货确认单中的采购人下拉
// export class PurchaserStore extends AutoCompleteStore {
//     keyName = "empCode";
//     displayName = ["empCode", "empName"];

//     @action
//     fetchSelectList(value,pm) {
//         return ReceiptConfirmFetch.purchaserList({deptCode:'0', employeeCode: value, employeeName:value, ...pm })
//             .then(this.updateSelectList);
//     }
// }
//收货确认单中的收货人下拉
export class ReceiptReceiverStore extends AutoCompleteStore {
    keyName = "empCode";
    displayName = ["empCode", "empName"];

    @action
    fetchSelectList(value,pm) {
        return ReceiptConfirmFetch.purchaserList({ deptCode:'0',employeeCode: value, employeeName:value, ...pm })
            .then(this.updateSelectList);
    }
}
//收货确认单中的收货地址下拉
export class ReceiveAddressStore extends AutoCompleteStore {
    keyName = 'addressCode';
    displayName = ["detailAddress"];
    format="{0}"
    @action
    fetchSelectList(pm) {
        return ReceiptConfirmFetch.receivingAddressList({ ...pm })
            .then(this.updateSelectList);
    }
    
}

//物料选择-下拉表格
export class SelectMaterialStore extends SelectTableStore {
    selectedRowKeys = [];
    //异步请求
    @action fetchTableList() {
        this.loading = true;
        this.searchBarStore.setLoading(true);
        let p = { ...this.pages, ...this.searchBarStore.Pm };
        return PurchaseFetch.materialList(p)
            .then(this.updateTableList)
            .then(json => {
                this.searchBarStore.setLoading(false);
                return json
            });
    }
}
//物料选择
export class MaterialStore extends AutoCompleteStore {
    keyName = "materialCode";
    displayName = ["materialCode", "materialName"];

    @action
    fetchSelectList(value, pm) {
        this.loading = true;
        return PurchaseFetch.materialList({ materialCode: value, ...pm })
            .then(this.updateSelectList);
    }
};

// 仓库下拉
export class WareHouseStore extends SelectStore{
    //传ID

    keyName = 'id';
    labelName = 'stockName';

    @action
    fetchSelectList(pm) {
        return InventoryFetch.stocklist(pm)
           .then((json) =>{
            json.data.list.map((object) => {
                object.id = String(object.id);
            });
                this.updateSelectList(json)
            });
    }
};
//采购退货单--源订单号下拉
export class PurOrderStore extends AutoCompleteStore {
    keyName = "orderCode";
    displayName = ["orderCode"];
    format = "{0}";

    @action
    fetchSelectList(supplierCode,value,pm) {
        return PurchaseReturnFetch.purOrderList({ supplierNickName:supplierCode,orderCode:value,orderStatus:2,receiveStatus:'2,3',...pm })
            .then(this.updateSelectList);
    }
}
//采购退货单--所有部门下拉
export class DeptStore extends AutoCompleteStore {
    keyName = "orgCode";
    displayName = ["orgCode","orgName"];

    @action
    fetchSelectList(value,pm) {
        return PurchaseReturnFetch.deptList({ orgCode:value, ...pm })
            .then(this.updateSelectList);
    }
}

//采购退货单--所有员工下拉
export class EmployeesStore extends AutoCompleteStore {
    keyName = "empCode";
    displayName = ["empCode","empName"];

    @action
    fetchSelectList(value,pm) {
        return PurchaseReturnFetch.employeesList({ deptCode: '0', employeeCode:value, ...pm })
            .then(this.updateSelectList);
    }
}

//采购退货单--发货站点下拉
export class PurReturnSiteStore extends AutoCompleteStore {
    keyName = "siteCode";
    displayName = ["siteCode","siteName"];

    @action
    fetchSelectList(value,pm) {
        return PurchaseReturnFetch.siteList({ siteCode:value, ...pm })
            .then(this.updateSelectList);
    }
}

//销售发货通知单-来源订单下拉
export class SourceOrderStore extends AutoCompleteStore {
    keyName = "orderCode";
    displayName = ["orderCode"];
    format = "{0}";

    @action
    fetchSelectList(value, pm) {
        this.loading = true;
        return SaleDeliveryFetch.saleDeliveryNoticeSaleList({ orderCode: value, ...pm })
            .then(this.updateSelectList);
    }

}
//销售发货通知单-发货站点下拉
export class DeliverySiteStore extends AutoCompleteStore {
    keyName = "siteCode";
    displayName = ["siteCode", "siteName"];

    @action
    fetchSelectList(value, pm) {
        this.loading = true;
        return SaleDeliveryFetch.siteList({ siteCode: value, siteName: value, ...pm })
            .then(this.updateSelectList);
    }
}
//仓库下拉
export class DeliveryWareHouseStore extends AutoCompleteStore {
    keyName = "stockCode";
    displayName = ["stockCode","stockName"];

    @action
    fetchSelectList(value, pm) {
        this.loading = true;
        return SaleDeliveryFetch.wareHouseList({ WarehouseCode: value, WarehouseName: value, ...pm })
            .then(this.updateSelectList);
    }
}
//采购退货单--发货仓库下拉 (缺接口)
export class WarehouseStore extends AutoCompleteStore {
    keyName = "stockCode";
    displayName = ["stockCode","stockName"];

    @action
    fetchSelectList(siteCode,value,pm) {
        return PurchaseReturnFetch.warehouseList({ siteCode:siteCode, warehouseCode:value, ...pm })
            .then(this.updateSelectList);
    }
}

//采购退货单--收货地址下拉
export class ReceivingAddressStore extends AutoCompleteStore {
    keyName = "addressCode";
    displayName = ["detailAddress"];
    format = "{0}";
    @action
    fetchSelectList(bpCode,value,pm) {
        return PurchaseReturnFetch.receivingAddressList({ bpCode:bpCode, detailAddress:value, ...pm })
            .then(this.updateSelectList);
    }
}

//采购退货单--收货人下拉
export class ReceiverStore extends AutoCompleteStore {
    keyName = "contactsCode";
    displayName = ["contactsCode","contactsName"];
    @action
    fetchSelectList(bpCode,value,pm) {
        return PurchaseReturnFetch.receiverList({ bpCode:bpCode, contactsCode:value, ...pm })
            .then(this.updateSelectList);
    }
}

//采购退货单--付款条件下拉
export class PaymentStore extends AutoCompleteStore {
    keyName = "catCode";
    displayName = ["catName"];
    format = "{0}";

	@action
	    fetchSelectList(value,pm) {
	        return PurchaseReturnFetch.getSubjectList({ subCode:'C013', catName:value, ...pm })
	        .then((json) => {
	            if (json.status === 2000) {
	                this.setList(json.data.catList);
	            };
	            this.loading = false;
	            return json;
	        });
	    }
}
//销售发货通知单-联系人下拉
export class ContactsStore extends AutoCompleteStore {
    keyName = "contactsName";
    displayName = ["contactsCode", "contactsName"];
	@action
    fetchSelectList(value, pm) {
        this.loading = true;
        return SaleDeliveryFetch.contactsList({ contactsCode: value, contactsName: value, ...pm })
            .then(this.updateSelectList);
    }
}

//采购退货单--发票类型下拉
export class InvoiceTypeStore extends AutoCompleteStore {
    keyName = "catCode";
    displayName = ["catName"];
    format = "{0}";
	@action
    fetchSelectList(value,pm) {
        return PurchaseReturnFetch.getSubjectList({ subCode:'C021', catName:value, ...pm })
        .then((json) => {
            if (json.status === 2000) {
                this.setList(json.data.catList);
            };
            this.loading = false;
            return json;
        });
    }
}
//销售发货通知单-收货站点下拉
export class RecSiteStore extends AutoCompleteStore {
    keyName = "addressCode";
    displayName = ["addressCode", "addressName"];

    @action
    fetchSelectList(value, pm) {
        this.loading = true;
        return SaleDeliveryFetch.receiveSiteList({ addressCode: value, addressName: value, ...pm })
            .then(this.updateSelectList);
    }
}


//采购退货单--结算方式下拉
export class SettleMethodStore extends AutoCompleteStore {
    keyName = "settleCode";
    displayName = ["settleName"];
    format = "{0}";

	@action
    fetchSelectList(value,pm) {
        return PurchaseReturnFetch.settleList({ settleName:value,...pm })
            .then(this.updateSelectList);
    }
}
//获取直接调拨单类型
export class AllotTypeStore extends SelectStore {
    keyName = 'busCode';
    labelName = 'busName';

    @action
    fetchSelectList(pm) {
        return AllotFetch.getAllotOrderTypeList(pm)
            .then(this.updateSelectList);
    }
};
//采购退货单--币种下拉
export class CurrencyStore extends AutoCompleteStore {
    keyName = "curCode";
    displayName = ["curName"];
    format = "{0}";

    @action
    fetchSelectList(pm) {
        return PurchaseReturnFetch.currencyList({ ...pm })
            .then(this.updateSelectList);
    }
}
//获取公司员工列表
export class EmployeeStore extends AutoCompleteStore {
    format = "{0}";
    keyName = "empCode";
    displayName = ["empName"];

    @action
    fetchSelectList(pm) {
        return AllotFetch.getEmployeesList({deptCode:0, ...pm })
            .then(this.updateSelectList);
    }
}
//采购退货单--物料单位下拉
export class MaterialAllUnitStore extends SelectStore {
    keyName = 'unitCode'//'materialUnitCode';
    labelName = 'unitName'//'materialUnitName';

    @action
    fetchSelectList(pm) {
        return PurchaseReturnFetch.materialAllUnit(pm)
            .then(this.updateSelectList);
    }
}
// const materialAllUnitStore = new MaterialAllUnitStore();
//站点树选择
export class SiteStore extends TreeSelectStore {
    keyName = 'value';
    LabelName = 'text';
    allowClear = true;

    // disabledNode(item) {
    //     return item.attribute.isStock == 0
    // };

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            this.setList(json.data.list);
        };
        this.loading = !this.loading;
        return json;
    }

    @action
    fetchSelectList(pm) {
        return AllotFetch.getStockTree(pm)
            .then(this.updateSelectList);
    }
}

//获取仓位类型
export class BinLocationStore extends SelectStore{
    //传ID
    keyName = 'stockCode';
    labelName = 'stockName';

    @action
    fetchSelectList(pm) {
        return InventoryFetch.stocklist(pm)
            .then(this.updateSelectList);
    }
}

//获取仓位类型AutoCompleteStore
export class AllotLocationStore extends AutoCompleteStore{

    //传ID
    format = "{0}";
    keyName = "locationCode";
    displayName = ["locationCode"];

    @action
    fetchSelectList(pm) {
        return AllotFetch.getLocationList(pm)
            .then(this.updateSelectList);
    }

}


//采购收货通知单-来源订单下拉
export class PurRecNoticeSourceOrderStore extends AutoCompleteStore {
    keyName = "orderCode";
    displayName = ["orderCode"];
    format = "{0}";

    @action
    fetchSelectList(value, pm) {
        this.loading = true;
        return PurRecFetch.purRecNoticePurList({ orderCode: value, ...pm })
            .then(this.updateSelectList);
    }

}





//仓位下拉
export class ShippingSpaceStore extends SelectStore {
    keyName = 'code';
    labelName = 'code';
    @action
    fetchSelectList(pm) {
        return WorkSheetCheck.shippingSpaceSelect(pm)
            .then(this.updateSelectList);




    }
}

//物料下拉
export class MaterialSelectStore extends SelectStore {
    keyName = 'materialCode';
    labelName = 'materialName';
    @action
    fetchSelectList(pm) {
        return WorkSheetCheck.impMaterialCheck(pm)
            .then(this.updateSelectList);
    }
}

import { SelfMadeInFetch } from '../consts/SelfMadeInUrls'


export class SelfMadeInSourceOrderStore extends AutoCompleteStore {
    keyName = "orderCode";
    displayName = ["orderCode"];
    format = "{0}";

    @action
    fetchSelectList(value, pm) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInSaleList({ orderCode: value,...pm })
            .then(this.updateSelectList);
    }
}


export class SelfMadeInPlanOrderStore extends SelectTableStore {
    selectedRowKeys = [];
    @action fetchTableList() {
        this.loading = true;
        this.searchBarStore.setLoading(true);
        let p = { ...this.pages, ...this.searchBarStore.Pm };
        return SelfMadeInFetch.planOrderList(p)
            .then(this.updateTableList)
            .then(json => {
                this.searchBarStore.setLoading(false);
                return json
            });
    }

}

export class StdUnitStore extends AutoCompleteStore {
    keyName = "meaCode";
    displayName = ["meaName","symbol"];

    @action
    fetchSelectList(pm) {
        return PurchaseFetch.measureList(pm)
            .then(this.updateSelectList);
    }
}