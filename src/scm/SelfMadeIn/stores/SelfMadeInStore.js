import { message } from '../../../base/components/AntdComp';
import SelectTableStore from '../../../base/stores/SelectTableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { SelfMadeInFetch } from '../../consts/SelfMadeInUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

export class SelfMadeInStore extends TableStore {
    constructor(props, context) {
        super(props, context);
        this.searchBarStore = new SearchBarStore();
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
        this.searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...this.searchBarStore.Pm, ...params };
        if (pm.orderStatus == null) {
            delete pm.orderStatus;
        };
        return SelfMadeInFetch.selfMadeInList(pm)
            .then(this.updateTableList)
            .then(json => {
                this.searchBarStore.setLoading(false);
                return json
            });
    }
    @action.bound
    fetchDelete(pm = {}) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInDelete(pm).then(json => {
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
let selfMadeInStore = new SelfMadeInStore();
export { selfMadeInStore };