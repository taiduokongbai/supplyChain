/**
 *  库存盘点——盘点方案
 */
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import SelectStore from "../../../base/stores/SelectStore";
import TreeSelectStore from "../../../base/stores/TreeSelectStore";
import { prefix, prefixScm, prefixPub } from '../../../base/consts/UrlsConfig';

import { CheckFetch } from "../../consts/CheckUrls";
import MaterialClassifyUrls from "../../consts/MaterialClassifyUrls";
import { ReqApi } from '../../../base/services/ReqApi';

let { observable, action, computed, runInAction, toJS } = mobx;

// 盘点方案列表store
export class CheckPlan extends TableStore {
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
    fetchTableList = (params) => {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
        if (pm.warehouseName) {
            pm.warehouseCode = pm.warehouseName;
        }
        if (pm.status) {
            pm.status *= 1;
        }
        return CheckFetch.stockTakeList(pm).then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json;
            })
    }

    @action
    delete = (pm = {}) => {
        this.loading = true;
        return CheckFetch.delete(pm).then(json => {
            if (json.status === 2000) {
                this.fetchTableList()
            }
            return json;
        })
    }

}

// 盘点方案modal-- 公共
export class CheckPlanModal {
    width = '735px'
    // visible
    @observable visible = false;
    @action
    setVisible = (bool) => {
        this.visible = bool;
    }

    loading
    @observable loading = false;
    @action
    setLoading = (bool) => {
        this.loading = bool;
    }

    // details
    initialData = {
        id: '',
        solutionCode: '',
        solutionName: '',
        isBlindStocktake: 0,
        warehouseCode: '',
        warehouseId: '',
        locationCodeStart: '',
        locationCodeEnd: '',
        materialCategoryCode: '',
        materialCode: '',
        remarks: '',
    }
    @observable details = { ...this.initialData }
    @computed get getDetail() {
        return this.details;
    }
    @action
    setDetails = (val) => {
        this.details = Object.assign({}, this.details, val)
    }
    @action
    resetDetails = () => {
        this.details = { ...this.initialData }
    }

    save = (data) => {
        this.setLoading(true);
        if (!data.id) {
            delete data.solutionCode;
        }
        return CheckFetch.stockTakeSave(data)
    }

}

// 新建盘点方案modal
export class AddCheckPlanStore extends CheckPlanModal {
    constructor() {
        super();
        this._warehouseStore = new WareHouseStore();                // 所属仓库
        this._positionFromStore = new PositionFromStore();          // 仓位从
        this._materialclassifyStore = new MaterialClassifyStore();  // 物料分类
        this._materialStore = new MaterialStore();                  // 物料
    }
    title = '新建盘点方案';
    curModal = 'add'
}

// 编辑盘点方案modal
export class EditCheckPlanStore extends CheckPlanModal {
    constructor() {
        super();
        this._warehouseStore = new WareHouseStore();
        this._positionFromStore = new PositionFromStore();
        this._materialclassifyStore = new MaterialClassifyStore();
        this._materialStore = new MaterialStore();
    }
    title = '编辑盘点方案';
    curModal = 'edit'

    @action
    getDetailsInfo = (pm) => {
        this.setLoading(true);
        return CheckFetch.getDetails(pm).then(json => {
            if (json.status === 2000) {
                this.setDetails(json.data);
                if (json.data.warehouseId) {
                    this._positionFromStore.fetchSelectList({ stockId: json.data.warehouseId })
                }
                if (json.data.materialCategoryCode) {
                    this._materialStore.fetchSelectList({ categoryCode: json.data.materialCategoryCode })
                }
            }
            this.setLoading(false);
            return json;
        })

    }
}

// 所属仓库 treeSelect
export class WareHouseStore extends TreeSelectStore {
    keyName = "value";
    LabelName = "text";
    @action
    fetchTreeSelectList = (pm = {}) => {
        return CheckFetch.getEnabledTree(pm).then(this.updateSelectList)
    }

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            this.setList(json.data.list);
        };
        this.loading = !this.loading;
        return json;
    }

    disabledNode(item) {
        return item.attribute.isStock == 0;
    }
}

// 仓位 select
export class PositionFromStore extends SelectStore {
    keyName = "locationCode";
    labelName = "locationCode";
    @action
    fetchSelectList = (pm = {}) => {
        this.loading = true;
        return CheckFetch.getEnabledListByStockId(pm).then(this.updateSelectList)
    }
}

// 物料分类 treeSelect
export class MaterialClassifyStore extends TreeSelectStore {
    keyName = "categoryCode";
    LabelName = "categoryName";
    @action
    fetchTreeSelectList = (pm = {}) => {
        this.loading = true;
        return CheckFetch.getComboBoxList(pm).then(this.updateSelectList);
    }

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            this.setList(json.data);
        };
        this.loading = !this.loading;
        return json;
    }
}

// 物料 select 
export class MaterialStore extends SelectStore {
    keyName = "materialCode";
    labelName = "materialName";
    @action
    fetchSelectList = (pm = {}) => {
        return CheckFetch.getMaterial(pm).then(this.updateSelectList)
    }
}

export class CheckPlanDetailsStore {
    @observable visible = false;
    @observable loading = false;
    initial = {
        id: '',
        solutionCode: '',
        solutionName: '',
        status: 0,
        isBlindStocktake: 0,
        warehouseName: '',
        locationNameStart: '',
        locationNameEnd: '',
        materialCategoryName: '',
        materialName: '',
        pushdownByCode: '',
        pushdownByName: '',
        pushdownDatetime: '',
        updateByName: '',
        updateDate: '',
        remarks: ''
    }
    @observable details = { ...this.initial };
    @computed get getDetail() {
        return this.details;
    }
    @action
    setDetails = (val) => {
        this.details = Object.assign({}, this.details, val);
    }
    @action
    resetDetails = () => {
        this.details = { ...this.initial }
    }
    @action
    getDetails = (pm = {}) => {
        this.loading = true;
        return CheckFetch.getDetails(pm).then(json => {
            if (json.status === 2000 && json.data) {
                this.setDetails(json.data);
            }
            this.loading = false;
        })
    }

    @action
    pushDown = (pm = {}) => {
        this.loading = true;
        return CheckFetch.pushDown(pm).then(json => {
            if (json.status === 2000 && json.data) {
                //this.setDetails(json.data);
            }
            this.loading = false;
            return json;
        })
    }
}

let searchBarStore = new SearchBarStore();
let checkplan_store = new CheckPlan();
let _addCheckPlanStore = new AddCheckPlanStore();
let _editCheckPlanStore = new EditCheckPlanStore();
let _checkplan_details = new CheckPlanDetailsStore();
export { checkplan_store, searchBarStore, _addCheckPlanStore, _editCheckPlanStore, _checkplan_details }
