import moment from "moment";
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import PurchaseReturnFetch from './PurchaseReturnUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

//采购列表
export class PurReturnListStore extends TableStore{
    constructor(props, context) {
        super(props, context);
        this.fetchTableList = this.fetchTableList.bind(this);
    }
    pages = {
        page: 1,
        pageSize: 15
    };
    pageSizeOptions = ['10','15', '20', '50'];
    //改变状态
    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        if (searchBarStore.Pm.orderStatus === null) {
            delete searchBarStore.Pm.orderStatus
        }
        if (searchBarStore.Pm.orderDate === '') {
            delete searchBarStore.Pm.orderDate
        }
        let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
        return PurchaseReturnFetch.purchaseReturnList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }
    @action
    fetchPurReturnDelete(pm = {}) {
        // this.loading = true;
        return PurchaseReturnFetch.purchaseReturnDelete(pm).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.fetchTableList();
                })
            };
            // runInAction(() => {
            //     this.loading = false;
            // })
            return json;
        })
    }
    @action
    fetchPurReturnCodeRule(pm = {}) {
        return PurchaseReturnFetch.purReturnCodeRule(pm).then(json => {
            if (json.status === 2000) {
                
            };
            return json;
        })
    }
};
let purReturnListStore = new PurReturnListStore();
let searchBarStore = new SearchBarStore();

export { purReturnListStore, searchBarStore };