import moment from "moment";
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import ReceiptConfirmFetch from './ReceiptConfirmUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

//采购列表
export class ReceiptConfirmListStore extends TableStore{
    constructor(props, context) {
        super(props, context);
        this.fetchTableList = this.fetchTableList.bind(this);
    }
    pages = {
        page: 1,
        pageSize: 15
    };

    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['10', '15', '20', '30', '50'];
    //改变状态
    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        if (searchBarStore.Pm.receiveStatus === null) {
            delete searchBarStore.Pm.receiveStatus
        }
        let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
        return ReceiptConfirmFetch.receiptConfirmList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }
};
let receiptConfirmListStore = new ReceiptConfirmListStore();
let searchBarStore = new SearchBarStore();

export { receiptConfirmListStore, searchBarStore };