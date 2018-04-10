/**
 * 盘点作业单 store
 */
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { WorkSheetCheck } from '../../consts/CheckUrls';
let { observable, action, computed, runInAction, toJS, useStrict } = mobx;
// 盘点作业单 表单store
export class InventoryWorkSheetStore extends TableStore {
    @observable isCurrentOpen=false
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
    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
        return WorkSheetCheck.workSheetCheckList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                this.isCurrentOpen=true
                return json
            });
    }
}

let inventoryWorkSheetStore = new InventoryWorkSheetStore();
let searchBarStore=new SearchBarStore();

export {inventoryWorkSheetStore,searchBarStore }