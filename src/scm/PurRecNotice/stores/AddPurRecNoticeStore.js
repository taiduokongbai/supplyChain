import moment from "moment";
import { message } from '../../../base/components/AntdComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { PurRecFetch } from '../../consts/PurRecUrls';
import { PurRecNoticeSourceOrderStore, DeliveryWareHouseStore, EmployeeStore } from '../../data/DropDownStore';
import TableEditStore from '../../../base/stores/TableEditStore';


export class PurRecNoticeFormStore {
    @observable loading = false;
    @observable receiveAddressDetl;
    
    initDetail = {
        orderCode: "",
        orderStatus: 0,
        supplierCode: "",
        supplierName: "",
        planDate: null,
        receiveSiteCode: "",
        receiveSiteName: "",
        receiveAddressDetl: "",
        receivePersonCode: "",
        receivePerson: "",
        receivePersonTel: "",
        sourceOrderCode: "",
        sourceJobOrderCode: "",
        pushdownStatus: "",
        stockCode: "",
        stockName: "",
        orderType: 0,
        purchaseType: 0,
        remarks: "",
        list: [],
    };
    @observable detail = { ...this.initDetail };

    @computed get getDetail() {
        return this.detail;
    }
    @action resetDetail() {
        this.detail = { ...this.initDetail };
    }
    @action setDetail(detail) {
        this.detail = Object.assign({}, this.detail, detail);
    }
}
//新增
export class AddPurRecNoticeStore extends PurRecNoticeFormStore {
    constructor() {
        super();
        this.sourceOrderStore = new PurRecNoticeSourceOrderStore();
        this.wareHouseStore = new DeliveryWareHouseStore();
        this.employeeStore = new EmployeeStore();
        this.employeeStore.keyName = "empName";
        this.detailStore = new AddPurRecNoticeDetailStore(this);
    }
    @action initData() {
        this.sourceOrderStore.fetchSelectList('');
        this.employeeStore.fetchSelectList({ employeeName: '', page: 1, pageSize: 10 })
    }
    @action fetchSubmit(pm) {
        this.loading = true;
        return PurRecFetch.purRecNoticeAdd(pm).then(json => {
            this.loading = false;
            return json;
        });
    }
    @action fetchCodeRule(pm) {
        return PurRecFetch.codeRule(pm);
    }
}
//明细
export class AddPurRecNoticeDetailStore extends TableEditStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
    }
    @observable orderType;

    recordKey = 'id';
    inputCell = ['endReceiveQty'];

    @action
    resetDetail(list) {
        this.editingRecord = {};
        this.editingIndex = null;
        this.pages = {
            page: 1,
            pageSize: 10
        };
        this.paging = {
            total: 0,
            current: 1,
            pageSize: 10,
        };
        this.dataSource = list || [];
    }
    
    beforeEvent(type) {
        if (type == 'save') {
            let { openQty, endReceiveQty } = this.editingRecord;
            if (Number(endReceiveQty) > Number(openQty)) {
                message.warning('收货数量不可以大于未清数量！');
                return false
            } else {
                this.editingRecord = Object.assign({}, this.editingRecord, { endReceiveQty: Number(endReceiveQty).toFixed(2)})
            }
        }
        return true;
    }
}

const addPurRecNoticeStore = new AddPurRecNoticeStore();
const sourceOrderStore = addPurRecNoticeStore.sourceOrderStore;
const wareHouseStore = addPurRecNoticeStore.wareHouseStore;
const employeeStore = addPurRecNoticeStore.employeeStore;
const addPurRecNoticeDetailStore = addPurRecNoticeStore.detailStore;

export {
    addPurRecNoticeStore,
    sourceOrderStore,
    wareHouseStore,
    employeeStore,
    addPurRecNoticeDetailStore,
};