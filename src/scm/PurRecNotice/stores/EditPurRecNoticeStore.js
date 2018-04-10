import moment from "moment";
let { observable, action, computed, runInAction, toJS } = mobx;
import { PurRecFetch } from '../../consts/PurRecUrls';
import { PurRecNoticeSourceOrderStore, DeliveryWareHouseStore, EmployeeStore} from '../../data/DropDownStore';
import { PurRecNoticeFormStore, AddPurRecNoticeDetailStore } from './AddPurRecNoticeStore';

//编辑表单
export class EditPurRecNoticeStore extends PurRecNoticeFormStore {
    constructor() {
        super();
        this.sourceOrderStore = new PurRecNoticeSourceOrderStore();
        this.wareHouseStore = new DeliveryWareHouseStore();
        this.employeeStore = new EmployeeStore();
        this.employeeStore.keyName = "empName";
        this.detailStore = new EditPurRecNoticeDetailStore(this);
    }
    @action.bound
    fetchDetail(pm) {
        this.loading = true;
        this.resetDetail();
        return PurRecFetch.purRecNoticeDetail(pm).then(json => {
            if (json.status === 2000) {
                let {
                    sourceOrderCode,
                    supplierCode,
                    stockCode,
                    receivePerson,
                    receiveSiteCode,
                    receiveAddressDetl,
                    list,
                    orderType,
                } = json.data;
                json.data.planDate = moment(json.data.planDate);
                this.detail = { ...this.detail, ...json.data };
                list.map(item => { 
                    item.beginReceiveQty = item.receiveQty;
                    item.endReceiveQty = item.receiveQty;
                    return item;
                });
                this.receiveAddressDetl = receiveAddressDetl;
                this.detailStore.resetDetail(list);
                this.detailStore.orderType = orderType;
                this.sourceOrderStore.fetchSelectList(sourceOrderCode);
                this.wareHouseStore.fetchSelectList(stockCode, { siteCode: receiveSiteCode });
                this.employeeStore.fetchSelectList({ employeeName: receivePerson, page:1 ,pageSize: 10});
            };
            this.loading = false;
            return json;
        })
    }
    @action fetchSubmit(pm) {
        this.loading = true;
        return PurRecFetch.purRecNoticeEdit(pm).then(json => {
            this.loading = false;
            return json;
        });
    }
}
export class EditPurRecNoticeDetailStore extends AddPurRecNoticeDetailStore { }

const editPurRecNoticeStore = new EditPurRecNoticeStore();
const sourceOrderStore = editPurRecNoticeStore.sourceOrderStore;
const wareHouseStore = editPurRecNoticeStore.wareHouseStore;
const employeeStore = editPurRecNoticeStore.employeeStore;
const editPurRecNoticeDetailStore = editPurRecNoticeStore.detailStore;

export {
    editPurRecNoticeStore,
    sourceOrderStore,
    wareHouseStore,
    employeeStore,
    editPurRecNoticeDetailStore,
};