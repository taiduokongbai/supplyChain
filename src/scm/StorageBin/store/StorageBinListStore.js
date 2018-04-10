import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { storageBinListTreeStore } from './StorageBinListTreeStore';
let { observable, action, computed, runInAction, toJS, useStrict} = mobx;
import { InventoryFetch,StorageBinFetch } from '../../consts/InventoryUrls';
import { WareHouseStore } from '../../data/DropDownStore';
//useStrict(true);
export class StorageBinListStore extends TableStore {
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
    @action
    fetchTableList(params, flag) {
        this.loading = true;
        searchBarStore.setLoading(true);
        if (flag == 1) {
            let pm = { ...params }
            pm.stockIds = storageBinListTreeStore.stockIds.slice();
            return StorageBinFetch.storageBinList(pm)
                .then(this.updateTableList)
                .then(json => {
                    searchBarStore.setLoading(false);
                    return json
                });
        }else {
            let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
            pm.stockIds = storageBinListTreeStore.stockIds.slice();
            return StorageBinFetch.storageBinList(pm)
                .then(this.updateTableList)
                .then(json => {
                    searchBarStore.setLoading(false);
                    return json
                });
        }
    }
    @action 
    fetchTableDelet(pm) {
        this.loading = true;
        return StorageBinFetch.storageBinListDete(pm).then(json => {
            // if (json.status === 2000) {
            //     runInAction(() => {
            //         this.fetchTableList();
            //     })
            // }
            runInAction(()=>{
                this.loading=false;
            })
            return json;
        });
    }
    @action 
    fetchTableEnable(pm) {
        this.loading = true;
        return StorageBinFetch.storageBinListEnabled(pm).then(json => {
            // if (json.status === 2000) {
            //     runInAction(() => {
            //         this.fetchTableList();
            //     })
            // }
            runInAction(()=>{
                this.loading=false;
            })
            return json;
        });
    }
    @action 
    fetchTableDisabled(pm) {
        this.loading = true;
        return StorageBinFetch.storageBinListDisabled(pm).then(json => {
            // if (json.status === 2000) {
            //     runInAction(() => {
            //         this.fetchTableList();
            //     })
            // }
            runInAction(()=>{
                this.loading=false;
            })
            return json;
        });
    }
};

export class AddStorageBinStore {
    title = '新建仓位';
    @observable visible = false;
    @observable loading = false;
    @action
    setVisible = (flag) => {
        runInAction(() => {
            this.visible = flag;
        })
    }

    @action
    getWareHouse = () => {
        return InventoryFetch.stocklist()
    }

    @action
    save = (pm) => {
        this.loading = true;
        return InventoryFetch.stockLocationAdd(pm).then(json => {
            runInAction(() => {
                this.loading = false;
            })
            this.setVisible(false);
            return json;
        })
    }
};

export class EditStorageBinStore extends AddStorageBinStore {
    constructor(){
        super()
    }
    title = '编辑仓位';
    //初始化数据
    initDetail = {
        id:'',
        locationCode: "",
        locationName: "",
        stockId: "",
        stockName: "",
        remark: ""
    };
    @observable detail = this.initDetail;

    @action
    stockLocationInfo = (pm) => {
        this.loading = true;
        InventoryFetch.stockLocationInfo(pm).then(json => {
            if (json.status == 2000) {
                runInAction(() => {
                    this.detail = json.data;
                })
            }
            runInAction(() => {
                this.loading = false;
            })
        })
    }

    @action
    save = (pm) => {
        this.loading = true;
        return InventoryFetch.stockLocationEdit(pm).then(json => {
            runInAction(() => {
                this.loading = false;
            })
            this.setVisible(false);
            return json;
        })
    }

}

let storageBinListStore = new StorageBinListStore();
let searchBarStore = new SearchBarStore();
let addStorageBinStore = new AddStorageBinStore();
let editStorageBinStore = new EditStorageBinStore();
let wareHouseStore = new WareHouseStore();

export { storageBinListStore, searchBarStore, addStorageBinStore, editStorageBinStore, wareHouseStore}