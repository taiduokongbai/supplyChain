import TableEditStore from '../../../base/stores/TableEditStore';
import { PlanDisplanFetch } from '../../consts/PlanDispatchUrls';
import PlanTableEditComp from '../comp/EditPlanDispatchComp';
import { Form, message } from '../../../base/components/AntdComp';
import { DatePickerDialog } from './AddPlanDispatchStore'
let { observable, action, computed, runInAction, toJS, useStrict } = mobx;

export class EditDetailStore {
    @observable spinLoading = false;
    @observable editDetail = {
        planOrderCode: "",
        planOrderStatus: 1,
        sellOrderCodeDisplay: "",
        contractCode: "",
        customerName: "",
        materialName: "",
        planQty: "",
        predictProvideDate: "",
        sellQty: "",
    }
    @action.bound
    fetchDeskDetails(pm,isSubmit) {
        isSubmit? this.spinLoading = true:this.spinLoading = false
        return PlanDisplanFetch.getPlanDeskDetail(pm).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.editDetail = json.data
                })
            }
            runInAction(() => {
                this.spinLoading = false;
            })
            return json;
        });
    }
}
class EditInfoStore extends TableEditStore {
    constructor() {
        super();
    }
    @observable Comp = Form.create({ wrappedComponentRef: true })(PlanTableEditComp);
    recordKey = 'id';
    inputCell = ['qty', 'predictWorkhours'];
    selectCell = ['planMode'];
    datePickerCell = ['predictReceiveDate'];
    isChanged = false;//表格是否编辑
    @observable selectRows = [];
    @observable selectedRowKeys = [];
    pageChangeVal = {}; // 翻页时参数
    init_searchPm = {
        materialCode: '',       // 物料编码
        materialCategory: '',     // 物料分类
        materialSymbol: '',     // 物料代号
        materialName: '',       // 物料名称
        materialSpec: '',       // 物料规格
        materialTexture: '',    // 材料
        materialDesc: '',        // 描述
        preReceiveDateStart:'', //计划到货日期开始
        preReceiveDateEnd:'', //计划到货日期结束
    }

    @observable input_filter = false;
    searchPm = { ...this.init_searchPm }

    setSearchPm = (params = {}) => {
        this.searchPm = Object.assign({}, this.searchPm, params)
    }

    resetSearchPm = () => {
        this.searchPm = this.init_searchPm;
    }
    @action
    fetchTableList(params = {}) {
        this.loading = true;
        let pm = Object.assign({}, { planOrderCode: editDetailStore.editDetail.planOrderCode }, this.searchPm, params);
        pm.materialPlanAttribute || pm.materialPlanAttribute == 0 ? null : delete pm.materialPlanAttribute;
        pm.planMode ? null : delete pm.planMode;
        pm.submitStatus ? null : delete pm.submitStatus;
        pm = {...pm, ...this.pages}
        return PlanDisplanFetch.getPlanDeskDetailTable(pm)
            .then(this.updateTableList)
            .then(json => {
                // this.editDataSource=json.data.list
                return json
            });
    }
    @action.bound
    pageOnChange(page){
        this.pageChangeVal = page;
        if(this.isChanged || this.selectedRowKeys.length){
            confirmSaveStore.visible = true;
        }else {
            this.pageChangeHandle()
        }
    }
    @action.bound
    pageChangeHandle = () => {
        if(this.loading) return;
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
        this.isChanged = false;
        this.selectRows = this.selectedRowKeys = [];
        this.loading = true;
        this.fetchTableList()
    }
    @action
    save = (params = {}) => {
        let pm = {
            planOrderCode: editDetailStore.editDetail.planOrderCode,
            list: this.dataSource
        }
        return PlanDisplanFetch.save(pm).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.isChanged = false;
                })
            }
            return json;
        })
    }
    @action
    onSubmit = (params = {}) => {
        if (this.selectRows.length) {
            let newList=[];
            this.selectRows.forEach(item => {
                this.dataSource.forEach(dItem => {
                    item.id == dItem.id ? newList.push(dItem) : null
                })
            })
            let pm = {
                planOrderCode: editDetailStore.editDetail.planOrderCode,
                list: newList
            }
            return PlanDisplanFetch.submit(pm).then(json => {
                if (json.status === 2000) {
                    runInAction(()=>{
                     this.selectRows = [];
                    })
                    message.success('数据提交成功！')
                    this.fetchTableList();
                }
                return json;
            })
        } else {
            message.info('请选择要提交的数据!')
        }
    }
}
class ConfirmSaveDialog {
    title = '';
    width = '420px';
    @observable visible = false;
    @observable loading = false;
}
class EditDatePickerDialog extends DatePickerDialog { }
let editInfoStore = new EditInfoStore();
let editDetailStore = new EditDetailStore();
let editDatePickerDialog = new EditDatePickerDialog();
let confirmSaveStore = new ConfirmSaveDialog();
export { 
    editInfoStore, 
    editDetailStore, 
    editDatePickerDialog,
    confirmSaveStore 
}