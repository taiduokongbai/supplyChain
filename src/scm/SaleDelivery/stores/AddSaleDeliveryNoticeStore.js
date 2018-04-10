import moment from "moment";
import { message } from '../../../base/components/AntdComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { SaleDeliveryFetch } from '../../consts/SaleDeliveryUrls';
import { SourceOrderStore, DeliverySiteStore, DeliveryWareHouseStore, ContactsStore, RecSiteStore } from '../../data/DropDownStore';
import TableEditStore from '../../../base/stores/TableEditStore';


export class SaleDeliveryNoticeFormStore {
    @observable loading = false;
    @observable shipAddressDetl;

    initDetail = {
        orderCode: "",
        orderStatus: 0,
        customerCode: "",
        customerName: "",
        planDate: null,
        receiveSiteCode: "",
        receiveSiteName: "",
        receiveAddressDetl: "",
        receivePerson: "",
        receivePersonTel: "",
        sourceOrderCode: "",
        sourceJobOrderCode: "",
        pushdownStatus: "",
        shipDate: moment(),
        shipSiteCode: "",
        shipSiteName: "",
        stockCode: "",
        stockName: "",
        shipAddressDetl: "",
        orderType:0,
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
export class AddSaleDeliveryNoticeStore extends SaleDeliveryNoticeFormStore {
    constructor() {
        super();
        this.sourceOrderStore = new SourceOrderStore();
        this.wareHouseStore = new DeliveryWareHouseStore();
        this.siteStore = new DeliverySiteStore();
        this.contactsStore = new ContactsStore();
        // this.recSiteStore = new RecSiteStore();
        this.detailStore = new AddSaleDeliveryNoticeDetailStore(this);
    }
    @action initData() {
        this.sourceOrderStore.fetchSelectList('');
        this.siteStore.fetchSelectList('');
    }
    @action fetchSubmit(pm) {
        this.loading = true;
        return SaleDeliveryFetch.saleDeliveryNoticeAdd(pm).then(json => {
            this.loading = false;
            return json;
        });
    }
    @action fetchCodeRule(pm) {
        return SaleDeliveryFetch.codeRule(pm);
    }
}
//明细
export class AddSaleDeliveryNoticeDetailStore extends TableEditStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
    }
    @observable orderType;
    recordKey = 'id';
    inputCell = ['endShipQty'];
    
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
            let { openQty, endShipQty } = this.editingRecord;
            if (Number(endShipQty) > Number(openQty)) {
                message.warning('发货数量不可以大于未清数量！');
                return false
            } else {
                this.editingRecord = Object.assign({}, this.editingRecord, { endShipQty: Number(endShipQty).toFixed(2)})
            }
        }
        return true;
    }
}

const addSaleDeliveryNoticeStore = new AddSaleDeliveryNoticeStore();
const sourceOrderStore = addSaleDeliveryNoticeStore.sourceOrderStore;
const siteStore = addSaleDeliveryNoticeStore.siteStore;
const wareHouseStore = addSaleDeliveryNoticeStore.wareHouseStore;
const contactsStore = addSaleDeliveryNoticeStore.contactsStore;
// const recSiteStore = addSaleDeliveryNoticeStore.recSiteStore;
const addSaleDeliveryNoticeDetailStore = addSaleDeliveryNoticeStore.detailStore;

export {
    addSaleDeliveryNoticeStore,
    sourceOrderStore,
    siteStore,
    wareHouseStore,
    contactsStore,
    // recSiteStore,
    addSaleDeliveryNoticeDetailStore,
};