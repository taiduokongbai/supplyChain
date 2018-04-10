import { message } from '../../../base/components/AntdComp';
import SelectTableStore from '../../../base/stores/SelectTableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { SupplierGoodsFetch } from '../../consts/SupplierGoodsUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

//供应商商品列表
export class SupGoodsListStore extends TableStore {
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

    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
        return SupplierGoodsFetch.supGoodsList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                this.onSelectChange([],[]);
                return json
            });
    }
    @action.bound
    fetchDelete(pm = {}) {
        this.loading = true;
        return SupplierGoodsFetch.supGoodsDelete(pm).then(json => {
            this.loading = false;
            if (json.status == 2000) {
                message.success('删除成功!');
                this.fetchTableList();
            };
        });
    }
 
    @action.bound
    onBatchEnable(ids = this.selectedRowKeys.slice().join(',')) {
        this.loading = true;
        let pm = { ids, status: 1 };
        return SupplierGoodsFetch.supGoodsEnable(pm).then(json => {
            this.loading = false;
            if (json.status == 2000) {
                this.fetchTableList();
            };
            return json;
        });
    }    
    @action.bound
    onBatchDisable(ids = this.selectedRowKeys.slice().join(',')) {
        this.loading = true;
        let pm = { ids, status:2 };
        return SupplierGoodsFetch.supGoodsEnable(pm).then(json => {
            this.loading = false;
            if (json.status == 2000) {
                this.fetchTableList();
            };
            return json;
        });
    }

    get Props() {
        let p = super.Props;
        p.rowSelection = this.rowSelection;
        return p;
    }

};
let supGoodsListStore = new SupGoodsListStore();
let searchBarStore = new SearchBarStore();

export { supGoodsListStore, searchBarStore };