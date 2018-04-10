import TableStore from '../../../base/stores/TableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import { OtherOutBoundFetch } from '../../consts/InventoryUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

//物料选择弹窗的 Store
class MaterialPopStore {
    @observable visible = false;
    @observable loading = false;
    width = 950;

    @action
    setVisible = (flag) => {
        this.visible = flag;
    }
}

//物料选择弹窗的table
export class MaterialChooseTableStore extends TableStore {

    pages = {
        page: 1,
        pageSize: 5
    };

    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['5', '10', '15','20', '30', '50'];
    //改变状态
    @action
    fetchTableList(params) {
        this.loading = true;
        searchMaterialStore.setLoading(true);
        // let time = {};
        // if(searchMaterialStore.Pm.allotTime){
        //     time = {allotDateStart:toJS(searchMaterialStore.Pm.allotTime)[0],allotDateEnd:toJS(searchMaterialStore.Pm.allotTime)[1]};
        // }
        // let pm = { ...this.pages, ...(searchMaterialStore.Pm.allotTime ? time:searchMaterialStore.Pm), ...params };
        let pm = { ...this.pages, ...searchMaterialStore.Pm, ...params,...{status:1,usingWarehouse:0} };
        return OtherOutBoundFetch.materialGetList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchMaterialStore.setLoading(false);
                return json
            });
    }

    get Props() {
        let p = super.Props;
        p.rowKey = "materialCode";
        return p;
    }
};


let materialPopStore = new MaterialPopStore();
let searchMaterialStore = new SearchBarStore();
let materialChooseTableStore = new MaterialChooseTableStore();

export {
    materialPopStore,
    searchMaterialStore,
    materialChooseTableStore
}