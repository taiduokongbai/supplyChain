import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { InventoryFetch } from '../../consts/InventoryUrls';
import { message } from '../../../base/components/AntdComp';

let { observable, action, computed, runInAction, toJS } = mobx;

//仓库列表
export class WareHouseListStore extends TableStore {
     pages = {
        page: 1,
        pageSize: 15
    };

    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['10', '15','20', '30', '50'];
    //改变状态
    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
        return InventoryFetch.stockPageList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }

    //删除
    @action
    fetchWareHouseDelete(id) {
        this.loading = true;
        let pm = { ids: [id] };
        return InventoryFetch.stockRemove(pm).then(json => {
            if (json.status === 2000) {
                this.fetchTableList();
                message.success('删除成功!');
            } else {
                runInAction(()=>{
                    this.loading=false;
                });
            };

            return json;
        })
    }

    //启用
    @action
    fetchWareHouseStart = (id) => {
        this.loading = true;
        let pm = { ids: [id] };
        return InventoryFetch.stockEnabled(pm).then(json => {
            if (json.status === 2000) {
                this.fetchTableList();
                message.success('启用成功!');
            } else {
                runInAction(()=>{
                    this.loading=false;
                });
            };
            return json;
        })
    }

    //禁用
    @action
    fetchWareHouseForbidden = (id) => {
        this.loading = true;
        let pm = { ids: [id] };
        return InventoryFetch.stockDisabled(pm).then(json => {
            if (json.status === 2000) {
                this.fetchTableList();
                message.success('禁用成功!');
            } else {
                runInAction(()=>{
                    this.loading=false;
                });
            };
            return json;
        })
    }
};
let wareHouseListStore = new WareHouseListStore();
let searchBarStore = new SearchBarStore();

export { searchBarStore, wareHouseListStore };