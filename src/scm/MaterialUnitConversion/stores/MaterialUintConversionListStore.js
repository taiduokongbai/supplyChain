import moment from "moment";
import SelectTableStore from '../../../base/stores/SelectTableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { MaterialFetch } from '../../../base/consts/BusinessUrls';
let { observable, action, computed, runInAction, toJS } = mobx;
export class MaterialUintConversionListStore extends TableStore {
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
    pageSizeOptions = ['10', '15', '20', '30', '50'];
    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...params };
        return MaterialFetch.materialUintCoversionList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }
    @action
    fetchMatrialUintConversionDetele(pm = {}) {
        this.loading = true;
        return MaterialFetch.materiallUintConversionDetele(pm)
            .then(json => {
                if (json.status === 2000) {
                    runInAction(() => {
                        this.fetchTableList();
                    })
                }
                return json
            })
    }
    @action.bound
    setEditingIndex(index) {
        let { page, pageSize } = this.pages;
        if (page && page != 1) {
            index = (page - 1) * pageSize + index;
        };
        this.editingIndex = index;
    }
}
export class BaseMaterialUintConversionStore {
    initDetail = {
        id: "",
        materialCode: "",
        materialName: "",
        measureUnitCode: "",
        businessNumber: "",
        businessUnitName: "",
        baseNumber: "",
        baseUnitName: ""
    }
    @observable detail = this.initDetail;
    @action resetDetail() {
        this.detail = { ...this.initDetail };
    }
    @action.bound clearFrom(json) {
        if (json.status === 2000) {
            runInAction(() => {
                this.resetDetail();
            })
        }
        runInAction(() => {
            this.loading = false;
        })
        return json;
    }
}
export class My_select_material_store extends SelectTableStore {
    pages = {page: 1, pageSize: 5};
    //materialList
    selectedRowKeys = [];
    //异步请求
    @action fetchTableList() {
        this.loading = true;
        this.searchBarStore.setLoading(true);
        let p = { ...this.pages, ...this.searchBarStore.Pm };
        return MaterialFetch.materialList(p)
            .then(this.updateTableList)
            .then(json => {
                this.searchBarStore.setLoading(false);
                return json
            });
    }
}

export class AddMaterialUintConversionStore extends BaseMaterialUintConversionStore {
    constructor(props, context) {
        super(props, context);
        this.selectMaterialStore = new My_select_material_store();
    }
    width = 700;
    title = "新建物料单位换算";
    
    @observable loading = false;
    @observable visible = false;
    @action setVisible = (value) => {
        this.visible = value;
    }
    @action resetDetail() {
        this.detail = { ...this.initDetail };
    }
    @action setMaterialUintConversionDetail(detail) {
        this.detail = Object.assign({}, this.detail, detail);
    };
    @action
    fetchMaterialUintConversionSubmit(pm) {
        // this.loading = true;
        return MaterialFetch.materiallUintConversionAdd(pm).then(this.clearFrom)
    }
}
export class EditMaterialUintConversionStore extends AddMaterialUintConversionStore {
    title = "编辑物料单位换算";
    @action
    fetchMaterialUintConversionSubmit(pm) {
        this.loading = true;
        return MaterialFetch.materiallUintConversionEdit(pm).then(this.clearForm)
    }

}
let searchBarStore = new SearchBarStore();
let materialUintConversionListStore = new MaterialUintConversionListStore();
let addMaterialUintConversionStore = new AddMaterialUintConversionStore();
let editMaterialUintConversionStore = new EditMaterialUintConversionStore();
export { materialUintConversionListStore, searchBarStore, addMaterialUintConversionStore, editMaterialUintConversionStore }