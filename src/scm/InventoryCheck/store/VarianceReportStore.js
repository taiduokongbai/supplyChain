/**
 * 盘点差异报告详情 store
 */
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { CheckFetch } from "../../consts/CheckUrls";
let { observable, action, computed, runInAction, toJS } = mobx;

// 盘点差异报告 表格
export class VarianceReportStore extends TableStore {
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
        _searchBarStore.setLoading(true);
        let pm = { ...this.pages, ..._searchBarStore.Pm, ...params };
        if (pm.status) {
            pm.status *= 1;
        }
        if (pm.warehouseName) {
            pm.warehouseCode = pm.warehouseName;
        }
        return CheckFetch.reportList(pm).then(this.updateTableList)
            .then(json => {
                _searchBarStore.setLoading(false);
                return json;
            })
    }
}

// 盘点差异报告详情  表单store
export class VarianceReportDetailStore {
    constructor() {
        this._materialDetailStore = new MaterialDetailStore();
    }
    @observable loading = false;

    initial = {
        id: '',
        stocktakeReportCode: "",
        stocktakeTaskCode: "",
        solutionCode: "",
        solutionName: "",
        isBlindStocktake: "",
        warehouseName: "",
        materialCategoryName: "",
        locationNameStart: "",
        locationNameEnd: "",
        materialName: "",
        status: "",
        remarks: "",
    }

    @observable reportDetail = { ...this.initial };
    @computed get getDetail() {
        return this.reportDetail;
    }
    @action
    setReportDetail = (val) => {
        this.reportDetail = Object.assign({}, this.reportDetail, val)
    }
    @action
    resetReportDetail = () => {
        this.reportDetail = { ...this.initial }
    }
    @action
    getReportDetails = (pm = {}) => {
        this.loading = true;
        return CheckFetch.getReportDetails(pm).then(json => {
            if (json.status === 2000 && json.data) {
                this.setReportDetail(json.data);
            }
            this.loading = false;
        })
    }
    @action
    updateInventory = (pm = {}) => {
        this.loading = true;
        return CheckFetch.updateInventory(pm)
    }
    @action
    shutDown = (pm = {}) => {
        this.loading = true;
        return CheckFetch.shutDown(pm)
    }
}

// 盘点差异报告详情——物料明细表格 store
export class MaterialDetailStore extends TableStore {
    @observable search_pm = {};

    @action
    setSearch_pm = (val) => {
        this.search_pm = Object.assign({}, this.search_pm, val)
    }
    @action
    resetSearch_pm = () => {
        this.search_pm = {}
    }
    //select 筛选
    @observable searchKey = 'all';
    @computed get Pm() {
        let _pm = {};
        _pm[this.searchKey] = true;
        return _pm;
    }
    @action setSearchVal(key) {
        this.searchKey = key;
    };



    @action
    fetchTableList = (params = {}) => {
        this.loading = true;
        let { reportDetail } = _varianceReportDetailsStore;
        let searchPm = { id: reportDetail.id, stocktakeReportCode: reportDetail.stocktakeReportCode };
        let pm = { ...this.pages, ...this.Pm, ...searchPm, ...params };
        if (pm.all) {
            delete pm.all;
        }
        return CheckFetch.getMaterialList(pm).then(this.updateTableList)
    }

    @action.bound
    updateTableList(json) {
        if (json.status === 2000) {
            let { list, total, page, pageSize } = json.data;
            if(list.length > 0) {
                list.map((item, index)=>{
                    item.rowNumber = index + 1;
                })
            }
            this.dataSource = list;
            this.pages = {
                page,
                pageSize
            };
            this.paging = {
                total,
                current: page,
                pageSize
            }
        };
        this.loading = false;
        return json;
    }
}

let _varianceReportStore = new VarianceReportStore();
let _searchBarStore = new SearchBarStore();
let _varianceReportDetailsStore = new VarianceReportDetailStore();
export { _varianceReportStore, _searchBarStore, _varianceReportDetailsStore }