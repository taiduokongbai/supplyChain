import moment from "moment";
import TableStore from '../../../base/stores/TableStore';
import PurchaseReturnFetch from './PurchaseReturnUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

//采购列表
export class PurReturnViewStore{
    @observable loading = false;
    detail = {};
    //改变状态
    @action
    fetchPurReturnStatus(status,pm = {}) {
        // this.loading = true;
        return PurchaseReturnFetch.purchaseReturnStatus(status,pm)
            .then(json => {
                if (json.status === 2000) {
                    
                };
                runInAction(() => {
                    // this.loading = false;
                })
                return json
            });
    }
    @action
    fetchPurReturnView(pm = {}) {
        this.loading = true;
        this.detail = {};
        return PurchaseReturnFetch.purchaseReturnDetail(pm).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.detail = { ...json.data };
                })
            };
            runInAction(() => {
                this.loading = false;
            })
            return json;
        })
    }
};
let purReturnViewStore = new PurReturnViewStore();

export { purReturnViewStore };