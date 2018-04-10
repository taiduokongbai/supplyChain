import moment from "moment";
let { observable, action, computed, runInAction, toJS } = mobx;
import { SaleDeliveryFetch } from '../../consts/SaleDeliveryUrls';
import { SourceOrderStore, DeliverySiteStore, DeliveryWareHouseStore, ContactsStore, RecSiteStore} from '../../data/DropDownStore';
import { SaleDeliveryNoticeFormStore, AddSaleDeliveryNoticeDetailStore } from './AddSaleDeliveryNoticeStore';

//编辑表单
export class EditSaleDeliveryNoticeStore extends SaleDeliveryNoticeFormStore {
    constructor() {
        super();
        this.sourceOrderStore = new SourceOrderStore();
        this.wareHouseStore = new DeliveryWareHouseStore();
        this.siteStore = new DeliverySiteStore();
        this.contactsStore = new ContactsStore();
        // this.recSiteStore = new RecSiteStore();
        this.detailStore = new EditSaleDeliveryNoticeDetailStore(this);
    }
    @action.bound
    fetchDetail(pm) {
        this.loading = true;
        this.resetDetail();
        return SaleDeliveryFetch.saleDeliveryNoticeDetail(pm).then(json => {
            if (json.status === 2000) {
                let {
                    sourceOrderCode,
                    shipSiteCode,
                    customerCode,
                    receivePerson,
                    receiveSiteCode,
                    shipAddressDetl,
                    list,
                    orderType,
                } = json.data;
                json.data.shipDate = json.data.shipDate ? moment(json.data.shipDate) : moment();
                json.data.planDate = moment(json.data.planDate);
                this.detail = { ...this.detail, ...json.data };
                list.map(item => { 
                    item.beginShipQty = item.shipQty;
                    item.endShipQty = item.shipQty;
                    return item;
                });
                this.shipAddressDetl = shipAddressDetl;
                this.detailStore.resetDetail(list);
                this.detailStore.orderType = orderType;
                this.sourceOrderStore.fetchSelectList(sourceOrderCode);
                this.siteStore.fetchSelectList(shipSiteCode);
                this.wareHouseStore.fetchSelectList('', { siteCode: shipSiteCode });
                this.contactsStore.fetchSelectList(receivePerson, { bpCode: customerCode });
                // this.recSiteStore.fetchSelectList(receiveSiteCode, { bpCode: customerCode });
            };
            this.loading = false;
            return json;
        })
    }
    @action fetchSubmit(pm) {
        this.loading = true;
        return SaleDeliveryFetch.saleDeliveryNoticeEdit(pm).then(json => {
            this.loading = false;
            return json;
        });
    }
}
export class EditSaleDeliveryNoticeDetailStore extends AddSaleDeliveryNoticeDetailStore { }

const editSaleDeliveryNoticeStore = new EditSaleDeliveryNoticeStore();
const sourceOrderStore = editSaleDeliveryNoticeStore.sourceOrderStore;
const siteStore = editSaleDeliveryNoticeStore.siteStore;
const wareHouseStore = editSaleDeliveryNoticeStore.wareHouseStore;
const contactsStore = editSaleDeliveryNoticeStore.contactsStore;
// const recSiteStore = editSaleDeliveryNoticeStore.recSiteStore;
const editSaleDeliveryNoticeDetailStore = editSaleDeliveryNoticeStore.detailStore;

export {
    editSaleDeliveryNoticeStore,
    sourceOrderStore,
    siteStore,
    wareHouseStore,
    contactsStore,
    // recSiteStore,
    editSaleDeliveryNoticeDetailStore,
};