/**
 *  计划分配
 */
import { message, Form } from '../../../base/components/AntdComp';
import { PlanDisplanFetch } from "../../consts/PlanDispatchUrls";
import TableEditStore from '../../../base/stores/TableEditStore';
import TableStore from "../../../base/stores/TableStore";
import SearchBarStore from '../../../base/stores/SearchBarStore';
import { PDEditTableComp } from "../comp/PDEditTableComp";
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
let { observable, action, computed, runInAction, toJS } = mobx;
// 计划分配store
export class AddPlanDispatchStore {
    thisComp = {};
    details_init = {
        planOrderCode: '单据号自动生成',     // 计划单编号 & 单据号
        sellOrderCode: '',     // 销售订单编号
        sellDetailLineNum: '', // 订单明细行号
        contractCode: '',      // 合同编号
        customerName: '',      // 客户名称
        materialName: "",      // 产品名称
        materialCode: "",      // 产品编码
        sellQty: null,         // 销售数量
        unitName: '',          // 单位
        predictProvideDate: "",// 预计交货日期
        sumPlanQty: null,      // 累计计划数量
        planQty: 0,         // 计划数量 = 销售数量 - 累计计划数量
        id: '',                // 销售订单id--标识
        isFixed: false         // 是否固定
    }
    fixedFlag = false;     // 点击固定按钮 标记
    newCreateFlag = false;    // 重新创建  标记
    @observable _submitPopVisible = false;   // 提交 popComfirm
    @observable loading = false;
    selectRows = [];
    @observable selectedRowKeys = [];
    @observable details_info = { ...this.details_init }
    @computed get getDetail() {
        return this.details_info;
    }
    @action
    setDetails = (params = {}) => {
        this.details_info = Object.assign({}, this.details_info, params)
        this.setFormItemVal()
    }
    @action
    resetDetails = () => {
        this.details_info = { ...this.details_init }
    }
    @action
    fix = (params = {}) => {
        this.fixedFlag = true;
        _pdEditTableStore.resetSearchPm();
        return PlanDisplanFetch.fix(params).then(json => {
            if (json.status === 2000 && json.data) {
                this.setDetails({ planOrderCode: json.data.planOrderCode, isFixed: true })
                _pdEditTableStore.fetchTableList()
            }
            return json;
        })
    }
    @action
    save = (params = {}) => {
        this.loading = true;
        let { dataSource } = _pdEditTableStore;
        let pm = {
            planOrderCode: this.details_info.planOrderCode,
            list: dataSource
        }
        return PlanDisplanFetch.save(pm).then(json => {
            if (json.status === 2000) {
                _pdEditTableStore.changedFlag = false;
            }
            return json;
        })
    }
    @action
    submit = () => {
        let selectRows = this.selectRows;
        let { dataSource } = _pdEditTableStore,
            newList = [],
            pm = {};
        selectRows.forEach(item => {
            dataSource.forEach(dItem => {
                item.id == dItem.id ? newList.push(dItem) : null
            })
        })
        pm = {
            planOrderCode: this.details_info.planOrderCode,
            list: newList
        }
        return PlanDisplanFetch.submit(pm).then(json => {
            if (json.status === 2000) {
                this.selectRows = [];
                _pdEditTableStore.fetchTableList()
                message.success('数据提交成功！')
            }
            this.loading = false;
            return json;
        })
    }
    dataInitialAct = () => {
        this.newCreateFlag = true;
        runInAction(() => {
            this.resetDetails();
            _pdEditTableStore.dataSource = []
        })
        this.thisComp.props ? this.setFormItemVal() : null;
    }
    setFormItemVal = () => {
        this.thisComp.props.form.setFieldsValue({
            sellOrderCode: this.details_info.sellOrderCode,
        })
    }
    getCodeRule = (pm = {}) => {
        return PlanDisplanFetch.GET_CODE_RULE(pm).then(json => {
            if (json.status === 2000) {
                this.dataInitialAct();
                store.dispatch(TabsAct.TabAdd({
                    title: "计划分配",
                    key: "AddPlanDispatchCont"
                }));
            }
        })
    }

}
// 计划分配 可编辑表格 store
export class PDEditTableStore extends TableEditStore {
    constructor(pStore) {
        super();
    }
    thisComp = {}
    @observable Comp = Form.create({ wrappedComponentRef: true })(PDEditTableComp);
    recordKey = 'materialCode';
    inputCell = ['qty', 'predictWorkhours'];
    selectCell = ['planMode'];
    datePickerCell = ['predictReceiveDate'];
    changedFlag = false;     // 表格数据 是否有变更  未保存
    unidiedTimeDate = '';   // 统一设置 预计到货日期
    pageChangeVal = {};   // 翻页时 参数
    init_searchPm = {
        materialCode: '',       // 物料编码
        materialCategory: '',     // 物料分类
        materialSymbol: '',     // 物料代号
        materialName: '',       // 物料名称
        materialSpec: '',       // 物料规格
        materialTexture: '',    // 材料
        materialDesc: '',        // 描述
        preReceiveDateStart: '',  // 预计到货日期
        preReceiveDateEnd: '',
    }
    searchPm = { ...this.init_searchPm };
    @computed get getSearchPm() {
        return this.searchPm;
    }
    @action
    setSearchPm = (params = {}) => {
        this.searchPm = Object.assign({}, this.searchPm, params)
    }
    @action
    resetSearchPm = () => {
        this.searchPm = { ...this.init_searchPm };
    }
    @action
    fetchTableList(params = {}) {
        this.loading = true;
        let { details_info, changedFlag } = _add_PlanDispatch_Store;
        let pm = Object.assign({}, { planOrderCode: details_info.planOrderCode }, this.searchPm, params);
        pm.materialPlanAttribute || pm.materialPlanAttribute == 0 ? null : delete pm.materialPlanAttribute;
        pm.planMode ? null : delete pm.planMode;
        pm.submitStatus ? null : delete pm.submitStatus;
        pm = {...pm, ...this.pages}
        return PlanDisplanFetch.getPDList(pm)
            .then(this.updateTableList)
            .then(json => {
                return json
            });
    }
    @action.bound
    pageOnChange(page) {
        this.pageChangeVal = page;
        if (_pdEditTableStore.changedFlag || _add_PlanDispatch_Store.selectedRowKeys.length) {   // 表格数据有变更， 为保存
            _confirmStore.visible = true;
        } else {
            this.pageChangeHandle();
        }
    };
    @action.bound
    pageChangeHandle = () => {
        if (this.loading) return;
        let page = this.pageChangeVal;
        if (typeof page === "number") {
            this.pages = {
                ...this.pages,
                page
            };
            this.paging = {
                ...this.paging,
                current: page
            };
        } else {
            this.pages = {
                ...this.pages,
                ...page
            };
            this.paging = {
                ...this.paging,
                current: page.page,
                pageSize: page.pageSize
            };

        };
        this.dataSource = [];
        _pdEditTableStore.changedFlag = false;
        _add_PlanDispatch_Store.selectRows = _add_PlanDispatch_Store.selectedRowKeys = [];
        this.loading = true;
        this.fetchTableList();
    }
}
//销售订单 modal 列表 store 
export class SaleOrderList extends TableStore {
    title = '选择销售订单';
    width = '966px';
    className = 'planDistribution-saleOrderList';
    pages = {
        page: 1,
        pageSize: 5
    };
    paging = {
        total: 0,
        current: 1,
        pageSize: 5,
    };
    pageSizeOptions = ['5', '10', '15', '20', '30', '50'];
    @observable visible = false;
    @action
    visibleHandler = (bool) => {
        this.visible = bool
    }
    @action
    fetchTableList = (params = {}) => {
        this.loading = true;
        _searchBarStore.setLoading(true);
        let pm = { ...this.pages, ..._searchBarStore.Pm, ...params };
        if (pm.preProvideDate && pm.preProvideDate.length > 0) {
            pm.preProvideDateStart = pm.preProvideDate[0];
            pm.preProvideDateEnd = pm.preProvideDate[1];
            delete pm.preProvideDate;
        }
        return PlanDisplanFetch.getSaleOrderList(pm).then(this.updateTableList)
            .then(json => {
                _searchBarStore.setLoading(false);
                return json;
            })
    }

}
//批量录入时间
export class DatePickerDialog {
    title = '批量录入默认时间';
    width = '420px';
    @observable visible = false;
    @observable loading = false;
    @observable dateVal = '';
}

class ConfirmSaveDialog {
    title = '';
    width = '420px';
    @observable visible = false;
    @observable loading = false;
}

let _add_PlanDispatch_Store = new AddPlanDispatchStore();
let _pdEditTableStore = new PDEditTableStore();
let _saleOrderListStore = new SaleOrderList();
let _searchBarStore = new SearchBarStore();
let _datePickerDialogStore = new DatePickerDialog();
let _confirmStore = new ConfirmSaveDialog()
export {
    _add_PlanDispatch_Store,
    _pdEditTableStore,
    _saleOrderListStore,
    _searchBarStore,
    _datePickerDialogStore,
    _confirmStore
}