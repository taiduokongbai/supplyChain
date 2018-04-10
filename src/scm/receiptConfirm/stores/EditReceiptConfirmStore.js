import moment from "moment";
import ReceiptConfirmFetch from './ReceiptConfirmUrls';
import { PurchaseOrgStore, ReceiveAddressStore, ReceiptReceiverStore} from '../../data/DropDownStore';
let { observable, action, computed, runInAction, toJS } = mobx;
 
import TableStore from '../../../base/stores/TableStore'; 
import TableEditStore from '../../../base/stores/TableEditStore'; 

//收货确认单编辑-表单
export class EditReceiptConfirmStore {
    @observable loading = false;
    contactsName = "";
    receiveAddressName = "";
    initDetail = {
        receiveAffirmCode: "",
        receiveStatus: 0,
        sourceOrderCode: "",
        sourceOrderType: 0,
        supplierName: "",
        deptCode: "",
        purchaserCode: "",
        reveiver: "",
        reveiverName: "",
        planReceiveDate: null,
        receiveAddress: "",
        receiveAddressName: "",
        remark: "",
        // detailList: [],
    };
    @observable detail = { ...this.initDetail };
    @action
    resetDetail() {
        this.detail = { ...this.initDetail };
    }
    @action
    setReceiptConfirmDetail(detail) {
        this.detail = Object.assign({}, this.detail, detail);
    }
    @action.bound
    clearFrom(json) {
        if (json.status === 2000) {
            runInAction(() => {
                this.resetDetail();
                receiptConfirmDetailStore.clear();
            })
        };
        runInAction(() => {
            this.loading = false;
        })
        return json;
    }
    @action
    fetchReceiptConfirmDetail(pm) {
        this.loading = true;
        this.resetDetail();
        return ReceiptConfirmFetch.receiptConfirmDetail(pm).then(json => {
            if (json.status === 2000) {
                let { sourceOrderCode,
                    sourceOrderType,
                    supplierName,
                    deptCode,
                    purchaserCode,
                    reveiver,
                    reveiverName,
                    planReceiveDate,
                    remark,
                    receiveAddress,
                    receiveAddressName,
                    receiveStatus,
                    receiveAffirmCode,
                    // detailList,
                } = json.data;
                runInAction(() => {
                    json.data.detailList.map(item => { item.accAmount='0.00' })
                    json.data.planReceiveDate = moment(json.data.planReceiveDate);
                    if (json.data.reveiver == "") {
                        this.contactsName = json.data.reveiverName;
                    } 
                    if (json.data.receiveAddress == "") {
                        this.receiveAddressName = json.data.receiveAddressName;
                    }
                    this.detail = { ...this.detail, ...json.data };
                    receiptConfirmDetailStore.dataSource = this.detail.detailList.slice();
                });
                purchaseOrgStore.fetchSelectList(deptCode);
                purchaserStore.fetchSelectList(purchaserCode);
                if (reveiver) {
                    receiverStore.fetchSelectList(reveiver);
                } else {
                    receiverStore.fetchSelectList('', { status:1});
                }
                if (receiveAddress) {
                    receivingAddressStore.fetchSelectList({ addressCode: receiveAddress});
                } else {
                    receivingAddressStore.fetchSelectList({ addressCode: receiveAddress, status: 1 });
                }
                
            };
            runInAction(() => {
                this.loading = false;
            })
            return json;
        })
    }
    @action
    fetchReceiptConfirmSubmit(pm) {
        this.loading = true;
        return ReceiptConfirmFetch.receiptConfirmEdit(pm).then(this.clearFrom)
    }
}
//收货确认单编辑-物料明细
export class ReceiptConfirmDetailStore extends TableEditStore {
    constructor(pStore) {
        super();
    }
    recordKey = 'lineNo';
    inputCell = ['number'];
    disableds = [ ];
    initRecord = {
        "lineNo": "",
        "materialCode": "",
        "materialName": "",
        "materialSpec": "",
        "model": "",
        "planReceiveNumber": "",
        "receiveNumber": "",
        "number": "",
        "unit": "",
        "accAmount": 0,
    };
    //点击保存，不弹窗
    @action.bound
    handleSave() {
        if (!this.beforeEvent('save')) return;
        this.loading = true;
        delete this.editingRecord.isNewRow;
        let list = this.dataSource.slice();
        list[this.editingIndex] = this.editingRecord;
        expenseDetailStore.preId = this.editingIndex;
        this.dataSource = list;
        // expenseDetailStore.dataSource = list[this.editingIndex].costList.slice();
        this.editingRecord = {};
        this.editingIndex = null;
        this.loading = false;
        this.afterEvent('save');
    }
    //点击保存，并弹费用明细框
    @action.bound
    handleSave2() {
        if (!this.beforeEvent('save')) return;
        this.loading = true;
        delete this.editingRecord.isNewRow;
        let list = this.dataSource.slice();
        list[this.editingIndex] = this.editingRecord;
        expenseDetailStore.preId = this.editingIndex;
        this.dataSource = list;
        expenseDetailStore.dataSource = list[this.editingIndex].costList.slice();
        this.editingRecord = {};
        this.editingIndex = null;
        this.loading = false;
        this.afterEvent('save');
        expenseDetailStore.setVisible(true);
    }
    @action
    setDataSourceList(costList, sum) {
        this.loading = true;
        this.dataSource[expenseDetailStore.preId].accAmount = sum.toFixed(2);
        this.dataSource[expenseDetailStore.preId].costList = costList.slice();
        this.loading = false;
    }    
    get Props() {
        let p = super.Props;
        p.handleSave = this.handleSave;
        p.handleSave2 = this.handleSave2;
        return p;
    }
}
export class ExpenseDetailStore  extends TableEditStore {
    constructor(pStore) {
        super();
    }
    @observable visible = false;
    preId;
    recordKey = 'costCode';
    inputCell = ['money','costRemark'];
    disableds = [];
    initRecord = {
        "id": "",
        "costCode": "",
        "money": "",
        "costRemark": "",
    };
    title = '费用明细';
    width = 620;
    className = "expense-detail-cont";
    @action
    setVisible(value) {
        this.visible = value;
    };
}

const editReceiptConfirmStore = new EditReceiptConfirmStore();
const purchaseOrgStore = new PurchaseOrgStore();
const purchaserStore = new ReceiptReceiverStore();
const receiverStore = new ReceiptReceiverStore();
const receivingAddressStore = new ReceiveAddressStore();
const receiptConfirmDetailStore = new ReceiptConfirmDetailStore();
const expenseDetailStore = new ExpenseDetailStore();

export {
    editReceiptConfirmStore,
    purchaseOrgStore,
    purchaserStore,
    receiverStore,
    receivingAddressStore,
    receiptConfirmDetailStore,
    expenseDetailStore
};