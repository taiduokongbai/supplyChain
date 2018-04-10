import SearchBarStore from '../../../base/stores/SearchBarStore';
import {StorageBinFetch } from '../../consts/InventoryUrls';
let { observable, action, computed, runInAction, toJS, useStrict} = mobx;
//useStrict(true);
export class StorageBinListTreeStore {
    @observable loading = false;
    treeData = [];
    @observable stockIds=[];
    @action
    fetchTreeList(pm) {
        this.loading = true;
        this.treeData = [];
        return StorageBinFetch.storageBinListTree(pm)
            .then(json => {
                if (json.status == 2000) {
                    this.treeData = [json.data.list];
                }
                runInAction(() => {
                    this.loading = false;
                })
            });
    }
   
};


let storageBinListTreeStore = new StorageBinListTreeStore();

export { storageBinListTreeStore }