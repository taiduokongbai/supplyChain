import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { AllotFetch } from '../../consts/InventoryUrls';
import { AllotTypeStore } from '../../data/DropDownStore';

let { observable, action, computed, runInAction, toJS } = mobx;

export class AllotListStore extends TableStore {
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
        let time = {};
        if(searchBarStore.Pm.allotTime){
            time = {allotDateStart:toJS(searchBarStore.Pm.allotTime)[0],allotDateEnd:toJS(searchBarStore.Pm.allotTime)[1]};
        }
        let pm = { ...this.pages, ...(searchBarStore.Pm.allotTime ? time:searchBarStore.Pm), ...params };
        return AllotFetch.getAllotList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }
};
let allotListStore = new AllotListStore();
let searchBarStore = new SearchBarStore();
let allotTypeStore = new AllotTypeStore();

export { searchBarStore, allotListStore,allotTypeStore  };