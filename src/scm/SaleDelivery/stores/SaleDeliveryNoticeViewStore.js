import TableStore from '../../../base/stores/TableStore';
import { SaleDeliveryFetch } from '../../consts/SaleDeliveryUrls';
import { message } from '../../../base/components/AntdComp';
let { observable, action, computed, runInAction, toJS } = mobx;

export class SaleDeliveryNoticeViewStore extends TableStore {
    @observable detail = {};
    @action
    fetchList(pm) {
        this.loading = true;
        return SaleDeliveryFetch.saleDeliveryNoticeDetail(pm)
            .then(json => {
                if (json.status == 2000) {
                    this.detail = json.data;
                }
                return json;
            })
            .then(this.updateTableList);
    }
    fetchPushDown(pm) {
        this.loading = true;
        return SaleDeliveryFetch.saleDeliveryNoticePush(pm).then((json) => {
            this.loading = false;
            return json;
        });
    }
};
let saleDeliveryNoticeViewStore = new SaleDeliveryNoticeViewStore();


export { saleDeliveryNoticeViewStore };