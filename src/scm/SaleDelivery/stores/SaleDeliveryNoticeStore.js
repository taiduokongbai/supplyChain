import { message } from '../../../base/components/AntdComp';
import SelectTableStore from '../../../base/stores/SelectTableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { SaleDeliveryFetch } from '../../consts/SaleDeliveryUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

export class SaleDeliveryNoticeStore extends TableStore {
    pages = {
        page: 1,
        pageSize: 15
    };

    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['10', '15', '20', '50'];

    @action.bound
    clear() {
        this.dataSource = [];
        this.pages = {
            page: 1,
            pageSize: 15
        };
        this.paging = {
            total: 0,
            current: 1,
            pageSize: 15,
        };
    }

    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
        return SaleDeliveryFetch.saleDeliveryNoticeList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }
    @action.bound
    fetchDelete(pm = {}) {
        this.loading = true;
        return SaleDeliveryFetch.saleDeliveryNoticeDelete(pm).then(json => {
            this.loading = false;
            return json;
        }).then(json => {
            if (json.status == 2000) {
                message.success('删除成功!');
                this.fetchTableList();
            }
        })
    }
};
let saleDeliveryNoticeStore = new SaleDeliveryNoticeStore();
let searchBarStore = new SearchBarStore();

export { saleDeliveryNoticeStore, searchBarStore };