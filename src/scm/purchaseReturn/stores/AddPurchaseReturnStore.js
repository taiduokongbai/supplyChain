import moment from "moment";
import PurchaseReturnFetch from './PurchaseReturnUrls';
import { SupplierStore, PurOrderStore, EmployeesStore, PurReturnSiteStore,DeptStore, PurOrgStore,WarehouseStore,ReceivingAddressStore,ReceiverStore,PaymentStore,InvoiceTypeStore,SettleMethodStore, CurrencyStore, SelectMaterialStore, MaterialStore, MaterialAllUnitStore} from '../../data/DropDownStore';
let { observable, action, computed, runInAction, toJS } = mobx;
 
import SelectTableStore from '../../../base/stores/SelectTableStore';
import TableStore from '../../../base/stores/TableStore'; 

//采购退货基础表单
export class PurReturnFormBaseStore {
    @observable loading = false;
    initDetail = {
        orderStatus: 0,
        purchaseType: '0',
        purchaseOrderCode: "",
        supplierCode: "",
        orderType: '1',
        orderDate: moment(),
        receivingAddress: "",
        receivingAddressDetl: "",
        receiverCode: "",
        receiverName: "",
        receiverTel: "",
        deptCode: "",
        planReturnDate: null,
        siteCode: "",
        warehouseCode: "",
        empCode: "",
        paymentTerm: "",
        paymentMethod: "",
        invoiceType: "102",
        currency: "CH78",
        taxFlag: 1,
        taxRate: "17",
        freightAmount: "",
        remark: "",
        returnReason: "",
        list: []
    };

    @observable detail = { ...this.initDetail };
    @observable disableds = [];
    @action
    resetDetail() {
        this.detail = { ...this.initDetail };
    }

    @action
    setPurReturnDetail(detail) {
        this.detail = Object.assign({}, this.detail, detail);
    }

    @action
    setDisableds(list) {
        this.disableds = list;
    }
    @action.bound
    clearFrom(json) {
        if (json.status === 2000) {
            runInAction(() => {
                this.resetDetail();
                this.purReturnDetailStore.clear();
            })
        };
        runInAction(() => {
            this.loading = false;
        })
        return json;
    }
}

//新增采购退货单
export class PurReturnAddStore extends PurReturnFormBaseStore {
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
        this.purReturnDetailStore = new AddPurReturnDetailStore();
    }
    @action
    getCurrentUser() {
        PurchaseReturnFetch.getCurrentUser().then(json => {
            if (json.status === 2000) {
                let { deptCode, empCode } = json.data;
                runInAction(() => {
                    this.detail = { ...this.detail, ...{deptCode,empCode} };
                });
                this.deptStore.fetchSelectList(deptCode, {status:1});
                this.employeesStore.fetchSelectList(empCode, {status:1});
            }
        })
    }
    @action
    resetDetail() {
        this.detail = { ...this.initDetail };
        this.purReturnDetailStore.clear();
    }
    @action
    purchaseDetail(orderCode) {
        return PurchaseReturnFetch.purchaseDetail({orderCode})
    }
    @action
    addressDetail(id) {
        return PurchaseReturnFetch.addressDetail({id})
    }
    @action
    initData() {
        this.getCurrentUser();
        this.supplierStore.fetchSelectList('', {status:1,briefCode:'',supplierType:1});
        this.siteStore.fetchSelectList('', {status:1});
        this.invoiceTypeStore.fetchSelectList('', {status:1});
        this.paymentStore.fetchSelectList('', {status:1}).then(json => {
            if (json.status === 2000) {
                if (json.data.catList.length > 0) {
                    let list = json.data.catList[0];
                    runInAction(() => {
                        this.detail = { ...this.detail, ...{paymentTerm:list.catCode} };
                    });
                }
            }
        });
        this.settleMethodStore.fetchSelectList('', {status:1}).then(json => {
            if (json.status === 2000) {
                if (json.data.list.length > 0) {
                    let list = json.data.list[0];
                    runInAction(() => {
                        this.detail = { ...this.detail, ...{paymentMethod:list.settleCode} };
                    });
                }
            }
        });
        this.currencyStore.fetchSelectList('');
    }
    @action purReturnSubmit(pm) {
        this.loading = true;
        return PurchaseReturnFetch.purchaseReturnAdd(pm).then(this.clearFrom);
    }
}

//采购退货新增-物料明细
export class AddPurReturnDetailStore extends TableStore {
    @observable dataSource = [];
    @observable paging = {
        total: 0,
        current: 1,
        pageSize: 10
    };
    editingIndex;
    //转化行数据
    changeDetail(data) {
        // //税额
        // data.taxMoney = (data.valuationNumber * data.unitPrice * data.tax / 100).toFixed(2);
        // //价税合计
        // data.taxMoneyTotal = (data.valuationNumber * data.unitPrice).toFixed(2);
        // //金额
        // data.money = (data.taxMoneyTotal - data.taxMoney).toFixed(2);
        // return data;
    }
    @action.bound
    onMaterialAdd(data) {
        let list = this.dataSource.slice();
        let id = -1;
        if (list[0] && list[0].id < 0) {
            id = list[0].id - 1;
        };
        data.id = id;
        list.splice(0, 0, data);
        this.dataSource = list;
    }
    @action.bound
    onMaterialEdit(data) {
        let list = this.dataSource.slice();
        // data = this.changeDetail(data);
        list[this.editingIndex] = data;
        this.dataSource = list;
    }
    @action.bound
    onMaterialDelete(index) {
        let { page, pageSize } = this.pages;
        let list = this.dataSource.slice();
        let realIndex = index;
        if (page && page != 1) {
            realIndex = (page - 1) * pageSize + index;
            if (index == 0 && list.length - 1 == realIndex) {
                this.pages.page = page - 1;
            }
        };
        let newList = [...list];
        newList.splice(realIndex, 1);
        this.dataSource = newList;

    }
    @action.bound
    setEditingIndex(index) {
        let { page, pageSize } = this.pages;
        if (page && page != 1) {
            index = (page - 1) * pageSize + index;
        };
        this.editingIndex = index;
    }
}

export class SelectMaterialStore2 extends SelectTableStore{
    selectedRowKeys = [];
    @action
    getPurchaseDetailList() {
        this.loading = true;
        return PurchaseReturnFetch.purchaseDetail({orderCode:purReturnAddStore.detail.purchaseOrderCode})
            .then(json => {
                if (json.status === 2000) {
                    let { dataSource } = purReturnAddStore.purReturnDetailStore;
                    let list = dataSource.slice().length > 0 ? dataSource.slice().map(item => item.sourceLineNum):[];
                    let data = [];
                    if (json.data&&Array.isArray(json.data.list)) {
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
    @action
    fetchTableList() {
        this.loading = false;
    }
   
}
//新增物料
export class AddMaterialStore {
    constructor() {
        this.selectMaterialStore = new SelectMaterialStore();
        this.selectMaterialStore2 = new SelectMaterialStore2();
        this.materialAllUnitStore = new MaterialAllUnitStore();
    }
    initDetail = {
        id: "",
        lineNum: "",
        materialQuality: "",
        standardCode:"",
        materialCode: "",
        materialName: "",
        materialSpec: "",
        materialModel: "",
        returnQty: "0.00",
        purchaseUnit: "",
        purchaseUnitName: "",
        priceQty: "0.00",
        priceUnit: "",
        priceUnitDetl: "",
        price: "0.00",
        taxAmount: "0.00",
        netAmount: "0.00",
        taxRate: "",
        // totalAmount: "",
        // returnStatus: "0",
        // returnedQty: "",
        sourceLineNum: null,
        remark: "",
    };
    title = '添加行';
    width = 800;
    className = "purReturnOrder-detail-line";

    @observable loading = false;
    @observable visible = false;
    @observable disableds = [];
    @observable priceUnit = '';
    @observable detail = this.initDetail;
    
    @action
    setPriceUnit(value) {
        this.priceUnit = value;
    };
    @action
    setVisible(value) {
        this.visible = value;
    };
    @action
    setDisableds(list) {
        this.disableds = list;
    };
    @action
    resetDetail() {
        this.detail = { ...this.initDetail };
        this.disableds = [];
    }
    @action
    setMaterialDetail(detail) {
        this.detail = Object.assign({}, this.detail, detail);
    };
}

//编辑物料
export class EditMaterialStore extends AddMaterialStore {
    title = '编辑行';
}

const purReturnAddStore = new PurReturnAddStore();

const supplierStore = purReturnAddStore.supplierStore;
const deptStore = purReturnAddStore.deptStore;
const purOrderStore = purReturnAddStore.purOrderStore;
const employeesStore = purReturnAddStore.employeesStore;
const siteStore = purReturnAddStore.siteStore;
const warehouseStore = purReturnAddStore.warehouseStore;
const receivingAddressStore = purReturnAddStore.receivingAddressStore;
const receiverStore = purReturnAddStore.receiverStore;
const invoiceTypeStore = purReturnAddStore.invoiceTypeStore;
const paymentStore = purReturnAddStore.paymentStore;
const settleMethodStore = purReturnAddStore.settleMethodStore;
const currencyStore = purReturnAddStore.currencyStore;

const addPurReturnDetailStore = purReturnAddStore.purReturnDetailStore;
const addMaterialStore = new AddMaterialStore();
const editMaterialStore = new EditMaterialStore();


export {
    purReturnAddStore,
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
    addPurReturnDetailStore,
    addMaterialStore,
    editMaterialStore,
};