import moment from "moment";
import PurchaseReturnFetch from './PurchaseReturnUrls';
import { SupplierStore, PurOrderStore, EmployeesStore, PurReturnSiteStore, DeptStore, PurOrgStore, WarehouseStore, ReceivingAddressStore, ReceiverStore, PaymentStore, InvoiceTypeStore, SettleMethodStore, CurrencyStore, SelectMaterialStore, MaterialStore, MaterialAllUnitStore } from '../../data/DropDownStore';
import { PurReturnFormBaseStore, AddPurReturnDetailStore, AddMaterialStore, SelectMaterialStore2 } from './AddPurchaseReturnStore';
let { observable, action, computed, runInAction, toJS } = mobx;
 
import SelectTableStore from '../../../base/stores/SelectTableStore';
import TableStore from '../../../base/stores/TableStore'; 

//编辑采购表单
export class PurReturnEditStore extends PurReturnFormBaseStore {
    constructor() {
        super();
        this.supplierStore = new SupplierStore();
        this.deptStore = new DeptStore();
        this.purOrderStore = new PurOrderStore();
        this.employeesStore = new EmployeesStore();
        this.siteStore = new PurReturnSiteStore();
        this.warehouseStore = new WarehouseStore();
        this.receivingAddressStore = new ReceivingAddressStore();
        this.receiverStore = new ReceiverStore();
        this.invoiceTypeStore = new InvoiceTypeStore();
        this.paymentStore = new PaymentStore();
        this.settleMethodStore = new SettleMethodStore();
        this.currencyStore = new CurrencyStore();
        this.purReturnDetailStore = new EditPurReturnDetailStore();
    }
    @action fetchPurReturnDetail(pm) {
        this.loading = true;
        this.setDisableds(['supplierCode', 'orderType', 'purchaseOrderCode','taxFlag']);
        this.resetDetail();
        return PurchaseReturnFetch.purchaseReturnDetail(pm).then(json => {
            if (json.status === 2000) {
                let {
                    purchaseOrderCode,
                    supplierCode,
                    siteCode,
                    invoiceType,
                    paymentTerm,
                    paymentMethod,
                    currency,
                    deptCode,
                    empCode,
                    warehouseCode,
                    receivingAddress,
                    receiverCode,
                    list
                 } = json.data;
                runInAction(() => {
                    json.data.orderDate = moment(json.data.orderDate);
                    json.data.planReturnDate = moment(json.data.planReturnDate);
                    this.detail = { ...this.detail, ...json.data };
                    this.purReturnDetailStore.dataSource = list;
                });
                if (deptCode) {
                    this.deptStore.fetchSelectList(deptCode);
                } else {
                    this.deptStore.fetchSelectList(deptCode, {status:1});
                }
                if (warehouseCode) {
                    this.warehouseStore.fetchSelectList(siteCode, warehouseCode, {warehouseName:warehouseCode});
                } else {
                    this.warehouseStore.fetchSelectList(siteCode, warehouseCode, {status:1});
                }
                if (receiverCode) {
                    this.receiverStore.fetchSelectList(supplierCode, receiverCode, {status:-1});
                } else {
                    this.receiverStore.fetchSelectList(supplierCode, receiverCode, {status:1});
                }
                if (paymentMethod) {
                    this.settleMethodStore.fetchSelectList('', { settleCode:paymentMethod });
                } else {
                    this.settleMethodStore.fetchSelectList('', { settleCode:paymentMethod,status:1});
                }
                if (invoiceType) {
                    this.invoiceTypeStore.fetchSelectList('', {catCode: invoiceType });
                } else {
                    this.invoiceTypeStore.fetchSelectList('', {catCode: invoiceType,status:1 });
                }
                if (paymentTerm) {
                    this.paymentStore.fetchSelectList('', {catCode: paymentTerm });
                } else {
                    this.paymentStore.fetchSelectList('', { catCode: paymentTerm, status:1 });
                }
                if (empCode) {
                    this.employeesStore.fetchSelectList(empCode);
                } else {
                    this.employeesStore.fetchSelectList('', {status:1});
                }
                this.supplierStore.fetchSelectList(supplierCode, {status:-1});
                this.siteStore.fetchSelectList(siteCode, {siteName:siteCode});
                this.receivingAddressStore.fetchSelectList(supplierCode,'', { addressCode:receivingAddress,status:-1 });
                this.currencyStore.fetchSelectList();
                this.purOrderStore.fetchSelectList(supplierCode, purchaseOrderCode, {receiveStatus:'1,2,3'})
            };
            runInAction(() => {
                this.loading = false;
            })
            return json;
        })
    }
    @action purReturnSubmit(pm) {
        this.loading = true;
        return PurchaseReturnFetch.purchaseReturnEdit(pm).then(this.clearFrom)
    }
}
//采购退货单新增-物料明细
export class EditPurReturnDetailStore extends AddPurReturnDetailStore { }

const selectMaterialStore2 = new SelectMaterialStore2();
selectMaterialStore2.getPurchaseDetailList=function(){
    this.loading = true;
    return PurchaseReturnFetch.purchaseDetail({orderCode:purReturnEditStore.detail.purchaseOrderCode})
        .then(json => {
            if (json.status === 2000) {
                let { dataSource } = purReturnEditStore.purReturnDetailStore;
                let list = dataSource.slice().length > 0 && dataSource.slice().map(item => item.sourceLineNum);
                let data = [];
                if (Array.isArray(json.data.list)) {
                    json.data.list.forEach(item => {
                        if (!list.includes(item.lineNum)&&(item.receivedQty-item.returnedQty)>0) {
                            data.push(item);
                        }
                    });
                };
                this.dataSource = data;
                this.loading = false;
                return json
            }
        })
}
//新增物料
export class AddMaterialStore2 extends  AddMaterialStore{
    constructor() {
        super();
        this.selectMaterialStore = new SelectMaterialStore();
        this.selectMaterialStore2 = selectMaterialStore2;
        this.materialAllUnitStore = new MaterialAllUnitStore();
    }
}

//编辑物料
export class EditMaterialStore extends AddMaterialStore2 {
    title = '编辑行';
}
const purReturnEditStore = new PurReturnEditStore();

const supplierStore = purReturnEditStore.supplierStore;
const deptStore = purReturnEditStore.deptStore;
const purOrderStore = purReturnEditStore.purOrderStore;
const employeesStore = purReturnEditStore.employeesStore;
const siteStore = purReturnEditStore.siteStore;
const warehouseStore = purReturnEditStore.warehouseStore;
const receivingAddressStore = purReturnEditStore.receivingAddressStore;
const receiverStore = purReturnEditStore.receiverStore;
const invoiceTypeStore = purReturnEditStore.invoiceTypeStore;
const paymentStore = purReturnEditStore.paymentStore;
const settleMethodStore = purReturnEditStore.settleMethodStore;
const currencyStore = purReturnEditStore.currencyStore;

const editPurReturnDetailStore = purReturnEditStore.purReturnDetailStore;
const addMaterialStore = new AddMaterialStore2();
const editMaterialStore = new EditMaterialStore();

export {
    purReturnEditStore,
    supplierStore,
    deptStore,
    purOrderStore,
    employeesStore,
    siteStore,
    warehouseStore,
    receivingAddressStore,
    receiverStore,
    invoiceTypeStore,
    paymentStore,
    settleMethodStore,
    currencyStore,
    editPurReturnDetailStore,
    addMaterialStore,
    editMaterialStore
};