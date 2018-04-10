import moment from "moment";
import SelectTableStore from '../../../base/stores/SelectTableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import TreeSelectStore from '../../../base/stores/TreeSelectStore'
import { MaterialFetch } from '../../../base/consts/BusinessUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

export class MaterialListStore extends TableStore {
    constructor(props, context) {
        super(props, context)
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
    pageSizeOptions= ['10', '15','20', '30', '50'];
    @observable statusMaterial = '';
    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...params };
        return MaterialFetch.materiallList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }
    @action
    fetchMatrialDetele(pm = {}){
        this.loading = true;
        return MaterialFetch.materialDetele(pm)
        .then(json=>{
            if(json.status === 2000){
                runInAction(()=>{
                    this.fetchTableList();
                })
            }
            return json
        })
    }
    isAuto(pm={}){
        return MaterialFetch.isAuto(pm).then(json=>{
            runInAction(()=>{
                this.statusMaterial = json.data;
            })
            return json
        })
    }
}
//物料分类materialType
export class MaterialTypeStore extends TreeSelectStore {
    keyName = 'categoryCode';
    LabelName = 'categoryName';
    @action.bound
    buildTree() {
        let data = this.selectList,
            key = this.keyName,
            name = this.LabelName,
            disabledNode = this.disabledNode;

        if (Array.isArray(data.slice())) {
            let loop = data => data.slice().map((item) => {
                item.key = item[key] + '';
                item.value = item[key] + '';
                item.label = item[name];
                if (item.isUse!=1) {
                    item.disabled=true;
                 }
                if (item.children) loop(item.children);
                return item;
            });
            return loop(data);
        }
    };
    @action
    fetchSelectList(value, pm) {
        return MaterialFetch.materialType(pm)
            .then(this.updateSelectList);
    }
    get Props(){
        let p = super.Props;
        p.style = {
            width: '240px'
        }
        return p;
    }
}
let materialListStore = new MaterialListStore();
let searchBarStore = new SearchBarStore();
let materialTypeStore = new MaterialTypeStore();
export { materialListStore, searchBarStore, materialTypeStore }