import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import TableStore from '../../../base/stores/TableStore';
import TableEditStore from '../../../base/stores/TableEditStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import { AllotFetch } from '../../consts/InventoryUrls';
import { message } from '../../../base/components/AntdComp';
import { AllotTypeStore, EmployeeStore, SiteStore, AllotLocationStore} from '../../data/DropDownStore';
import { allotListStore } from '../store/AllotListStore'

let { observable, action, computed, runInAction, toJS } = mobx;

class AddAllotStore {
    @observable loading = false;
    @observable id = ''; //是否提交过给后台
    allotOutSiteId = ''; // 调出仓库
    allotOutSiteCode = ''; // 调出仓库
    allotInSiteId = ''; // 调入仓库 allotOutSiteCode = ''; // 调出仓库
    allotInSiteCode = ''; // 调入仓库
    allotInSiteName = ''; // 调入仓库
    @observable allotInfo = {
        allotOrderTypeCode: "",
        allotOrderTypeName: "",
        allotOutSiteId: "",
        allotOutSiteCode: "",
        allotOutSiteName: "",
        allotInSiteId: "",
        allotInSiteCode: "",
        allotInSiteName: "",
        allotProposerCode: "",
        allotProposerName: "",
        allotDate: "",
        remarks: ""
    }; //上部分信息
    @observable disAdvanceTableInfo = false;

    @action
    setLoading = (flag) => {
        this.loading = flag;
    };

    @action
    clear = () =>{
        this.allotOutSiteId = ''; // 调出仓库
        this.allotOutSiteCode = ''; // 调出仓库
        this.allotInSiteId = ''; // 调入仓库 allotOutSiteCode = ''; // 调出仓库
        this.allotInSiteCode = ''; // 调入仓库
        this.allotInSiteName = ''; // 调入仓库
        this.disAdvanceTableInfo = false;
        this.allotInfo = {
            allotOrderTypeCode: "",
            allotOrderTypeName: "",
            allotOutSiteId: "",
            allotOutSiteCode: "",
            allotOutSiteName: "",
            allotInSiteId: "",
            allotInSiteCode: "",
            allotInSiteName: "",
            allotProposerCode: "",
            allotProposerName: "",
            allotDate: "",
            remarks: ""
        }; //上部分信息
    };

    setOutSiteCode = (id,code) => {
        this.allotOutSiteId = id;
        this.allotOutSiteCode = code;
        inSiteStore.setListSelf();
        addOutInfoStore.submitValuesTop({allotOutSiteCode:code});
    };

    setInSiteCode = (id,code,name) => {
        this.allotInSiteId = id;
        this.allotInSiteCode = code;
        this.allotInSiteName = name;
        outSiteStore.setListSelf();
        addOutInfoStore.submitValuesTop({allotInSiteCode:code});
    };

    // 新建直接调拨单刚进入时，清除临时表数据
    @action
    delAllAllotInfo = () => {
        AllotFetch.delAllAllotInfo()
            .then(json => {
                if(json.status === 2000) {
                    runInAction(()=>{
                        this.id = '';
                    });
                }
            })
    };

    //获取当前联系人
    @action
    getCurrentUser = () => {
        AllotFetch.getWithToken()
            .then(json => {
                if(json.status === 2000) {
                    runInAction(()=>{
                        this.allotInfo.allotProposerCode = json.data.empCode;
                        this.allotInfo.allotProposerName = json.data.empName;
                        addOutInfoStore.submitValue.allotProposerCode = json.data.empCode;
                        addOutInfoStore.submitValue.allotProposerName = json.data.empName;
                    });
                }
            })
    };

    // 获取直接调拨单新建上部分的信息
    @action
    getDetail = (pm) => {
        AllotFetch.getDetail(pm)
            .then(json => {
                if(json.status === 2000) {
                    runInAction(()=>{
                        this.allotInfo = json.data;
                    });
                }
            })
    };

    // 第一步首次提交
    submitOneStepFirst = (pm) => {
        return AllotFetch.addOneStepFirst(pm)
            .then(json => {
                if(json.status === 2000) {
                    runInAction(()=>{
                        this.id = json.data.id;
                    });
                }
                return json
            })
    };

    // 非第一步首次提交
    submitOther = (pm) => {
        return AllotFetch.addOther(pm)
            .then(json => {
                return json
            })
    };

    // 最终确认提交
    allotConfirm = (pm) => {
        this.loading = true;
        return AllotFetch.allotConfirm(pm)
            .then(json => {
                if(json.status === 2000) {
                    runInAction(() => {
                        this.loading = false;
                    });
                    store.dispatch(TabsAct.TabRemove("inventoryAddAllot", "inventoryAllotList"));
                    store.dispatch(TabsAct.TabAdd({
                        title: "直接调拨单",
                        key: "inventoryAllotList"
                    }));
                    allotListStore.fetchTableList({ page: 1,pageSize: 15});
                } else {
                    runInAction(() => {
                        this.loading = false;
                    });
                }
                return json
            })
    }
}

//调出信息的 Store
class AddOutInfoStore extends TableEditStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
    }

    pageSizeOptions = ['5', '10', '15','20', '30', '50'];

    submitValue = {
        allotOrderTypeCode: '',
        allotOutSiteCode: '',
        allotInSiteCode: '',
        allotProposerCode: '',
        allotDate: '',
        remarks:''
    };

    clearSubmitValue = () => {
        this.submitValue = {
            allotOrderTypeCode: '',
            allotOutSiteCode: '',
            allotInSiteCode: '',
            allotProposerCode: '',
            allotDate: '',
            remarks:''
        };
    };

    @action
    fetchTableList() {
        let pm = Object.assign(this.pages,{allotId: addAllotStore.id});
        return AllotFetch.getMxPageList(pm)
            .then(this.updateTableList)
            .then(json => {
                this.setEditRecord();
                return json;
            });
    };

    submitValuesTop = (values) => {
        this.submitValue = Object.assign(this.submitValue,values);
        this.submitValue.allotDate = this.submitValue.allotDate?this.submitValue.allotDate.format('YYYY-MM-DD'):'';
    };

    recordKey = 'id';
    inputNumberCell = ['allotOutQty'];
    inputHandler = ['materialCode'];

    // 初始化数据
    initRecord={
        "id": "",
        "lineNo": "",
        "materialName": "",
        "materialCode": "",
        "materialSpec": "",
        "materialModel": "",
        "allotOutLocationName": "",
        "allotOutLocationCode": "",
        "allotOutBatchCode": "",
        "inventoryQty": "",
        "allotOutQty": "",
        "allotInQty":0,
        "unitName": "",
        "unitCode": "",
    };

    currentIndex = '';

    setIndex = (index) => {
        this.currentIndex = index;
    };

    @action
    setRecord = (record) => {
        let newRecord = {
            "materialName": record.materialName,
            "materialCode": record.materialCode,
            "materialSpec": record.materialSpec,
            "materialModel": record.materialModel,
            "allotOutLocationName": record.freightSpaceName,
            "allotOutLocationCode": record.freightSpaceCode,
            "allotOutBatchCode": record.batchCode,
            "inventoryQty": record.inventoryQty,
            "allotOutQty": "",
            "unitName": record.materialUnitName,
            "unitCode": record.materialUnitCode,
        }

        this.loading=true;
        this.editingRecord=Object.assign({},this.editingRecord,newRecord);
        this.loading=false;
    };

    //点击添加
    @action.bound
    onAdd() {
        if(!addAllotStore.allotOutSiteCode){
            message.error('请先选择调出仓库');
        } else {
            if (!this.beforeEvent('add')) return;
            this.loading = true;
            if (this.editingIndex == null) {
                let newRecord = this.getNewRecord();
                newRecord.isNewRow = true;
                let list = this.dataSource.slice();
                list.splice(0, 0, newRecord);
                this.dataSource = list;
                this.onEdit(newRecord,0);
            } else {
                message.warn("已有行处于编辑状态！")
            }
            this.loading = false;
            this.afterEvent('add');
        }
    }

    //点击保存，需重写
    @action.bound
    handleSave() {
        if (!this.beforeEvent('save')) return;
        this.loading = true;
        delete this.editingRecord.isNewRow;
        let list = this.dataSource.slice();
        if(addAllotStore.id){
            if(this.editingRecord.lineNo){
                AllotFetch.editOneStep({
                    id: this.editingRecord.id,
                    materialCode: this.editingRecord.materialCode,
                    allotOutLocationCode: this.editingRecord.allotOutLocationCode,
                    allotOutBatchCode: this.editingRecord.allotOutBatchCode,
                    allotOutQty: this.editingRecord.allotOutQty,
                    unitCode: this.editingRecord.unitCode
                }).then(json => {
                    if(json.status === 2000){
                        runInAction(() => {
                            this.editingRecord = {};
                            this.editingIndex = null;
                            this.loading = false;
                            this.afterEvent('save');
                        });
                        this.fetchTableList()
                        // .then(json => {
                        //     if(json.status === 2000){
                        //         // list[this.editingIndex] = this.editingRecord;
                        //         // this.dataSource = list;
                        //         runInAction(() => {
                        //             this.editingRecord = {};
                        //             this.editingIndex = null;
                        //             this.loading = false;
                        //             this.afterEvent('save');
                        //         });
                        //     }
                        //     });
                        }
                });
            } else {
                AllotFetch.addOneStep({
                    allotId: addAllotStore.id,
                    materialCode: this.editingRecord.materialCode,
                    allotOutSiteCode: addAllotStore.allotOutSiteCode,
                    allotOutLocationCode: this.editingRecord.allotOutLocationCode,
                    allotOutBatchCode: this.editingRecord.allotOutBatchCode,
                    allotOutQty: this.editingRecord.allotOutQty,
                    unitCode: this.editingRecord.unitCode
                }).then(json => {
                    if(json.status === 2000){
                        runInAction(() => {
                            this.editingRecord = {};
                            this.editingIndex = null;
                            this.loading = false;
                            this.afterEvent('save');
                        });
                        this.fetchTableList()
                        // .then(json => {
                        //     if(json.status === 2000){
                        //         // list[this.editingIndex] = this.editingRecord;
                        //         // this.dataSource = list;
                        //         runInAction(() => {
                        //             this.editingRecord = {};
                        //             this.editingIndex = null;
                        //             this.loading = false;
                        //             this.afterEvent('save');
                        //         });
                        //     }
                        // });
                    }
                });
            }
        } else {
            let endList = [{
                    materialCode: this.editingRecord.materialCode,
                    allotOutLocationCode: this.editingRecord.allotOutLocationCode,
                    allotOutBatchCode: this.editingRecord.allotOutBatchCode,
                    allotOutQty: this.editingRecord.allotOutQty,
                    unitCode: this.editingRecord.unitCode
            }];
            addAllotStore.submitOneStepFirst(Object.assign(this.submitValue,{list:endList}))
                .then((json) => {
                    if(json.status === 2000){
                        runInAction(() => {
                            this.editingRecord = {};
                            this.editingIndex = null;
                            this.loading = false;
                            this.afterEvent('save');
                        });
                        this.fetchTableList()
                        // .then(json => {
                        //     if(json.status === 2000){
                        //         // list[this.editingIndex] = this.editingRecord;
                        //         // this.dataSource = list;
                        //         runInAction(() => {
                        //             this.editingRecord = {};
                        //             this.editingIndex = null;
                        //             this.loading = false;
                        //             this.afterEvent('save');
                        //         });
                        //     }
                        // });
                    }
                });
        }
    }

    //点击删除
    @action.bound
    onDelete(index) {
        let { page, pageSize } = this.pages;
        let list = this.dataSource.slice();
        let realIndex = index;
        if (page && page != 1) {
            realIndex = (page - 1) * pageSize + index;
            if (index == 0 && list.length - 1 == realIndex) {
                this.pages.page = page - 1;
            }
        };
        if(addAllotStore.id){
            AllotFetch.delOneStep({id:list[realIndex].id})
                .then(json => {
                    if(json.status === 2000) {
                        this.fetchTableList();
                    }
                });
        } else {
            if (!this.beforeEvent('delete')) return;
            this.loading = true;
            list.splice(realIndex, 1);
            this.dataSource = list;
            setTimeout(() => {
                runInAction(() => {
                    this.loading = false;
                })
            }, 500);
            this.afterEvent('delete');
        }

    }

    get Props() {
        return Object.assign({
            inputHandler:this.inputHandler
        },super.Props);
    }

    @action
    setEditRecord = () => {
        this.editingRecord = {};
        this.editingIndex = null;
    }

}

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
        let time = {};
        if(searchMaterialStore.Pm.allotTime){
            time = {allotDateStart:toJS(searchMaterialStore.Pm.allotTime)[0],allotDateEnd:toJS(searchMaterialStore.Pm.allotTime)[1]};
        }
        let pm = { ...this.pages,...{stockId: addAllotStore.allotOutSiteId}, ...(searchMaterialStore.Pm.allotTime ? time:searchMaterialStore.Pm), ...params };
        return AllotFetch.getMaterialList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchMaterialStore.setLoading(false);
                return json
            });
    }
};

// 调入信息列表
class AllotInListStore extends TableStore {
    pages = {
        page: 1,
        pageSize: 10
    };

    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['5', '10', '15','20', '30', '50'];
    //改变状态
    @action
    fetchTableList() {
        this.loading = true;
        let pm = { ...this.pages,...{allotId: addAllotStore.id}};
        return AllotFetch.getMxPageList(pm)
            .then(this.updateTableList)
            .then(json => {
                return json
            });
    }
}

//预收货弹窗 Store
export class AdvancePopStore {
    @observable visible = false;
    @observable loading = false;
    @observable advanceInfo = {
                    materialCode: '',
                    unitName: '',
                    unitCode: '',
                    allotOutQty: 0,
                    materialName: '',
                    allotOutBatchCode: '',
                    allotInQty: 0
                };

    @action
    clear = () => {
        this.advanceInfo = {
            materialCode: '',
            unitName: '',
            unitCode: '',
            allotOutQty: 0,
            materialName: '',
            allotOutBatchCode: '',
            allotInQty: 0
        };
    };

    width = 750;
    title = "预收货";
    @action
    setVisible = (flag,id) => {
        this.loading = false;
        this.visible = flag;
        // if(!flag){
        //     // advanceTableInfoStore.fetchTableList();
        //     allotInListStore.fetchTableList();
        //     // advancePopTableStore.fetchTableList({allotId:addAllotStore.id, allotOutId:id, page: 1, pageSize: 15});
        // }
        // else {
        //     advanceTableInfoStore.fetchTableList();
        //     allotInListStore.fetchTableList();
        // }
    };

    @action
    setAdvanceInfo = (obj) => {
        this.advanceInfo = obj;
        advancePopTableStore.setIninRecord(obj.allotOutBatchCode);
        this.loading = true;
    }


}

//预收货Table Store
export class AdvancePopTableStore extends TableEditStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
    };

    pageSizeOptions = ['5', '10', '15','20', '30', '50'];

    @action
    fetchTableList(params) {
        // this.loading = true;
        let pm = { ...params };
        return AllotFetch.getAdvanceList(pm)
            .then(this.updateTableList)
            .then(json => {
                return json
            });
    }

    recordKey = 'id';
    inputCell = ['allotInBatchCode'];
    inputNumberCell = ['allotInQty'];
    autoCompleteCell = [ 'allotInLocationCode'];
    disableds = [ ];

    // 初始化数据
    initRecord={
        "id": "",
        "outLineNo": "",
        "allotInStockName": "",
        // "allotInLocationName": "",
        "allotInLocationCode": "",
        "allotInBatchCode": '',
        "allotInQty": 0
    };

    // oldRecord = {};

    setIninRecord = (allotInBatchCode) => {
        this.initRecord.allotInBatchCode = allotInBatchCode;
    };

    @action
    popSubmit = () => {
        let list = this.dataSource.slice();
        let total = (advancePopStore.advanceInfo.allotOutQty - advancePopStore.advanceInfo.allotInQty).toFixed(2),
            allAllotInQty = 0;
        list.map((item) => {
            allAllotInQty += item.allotInQty
        });
        if(list.length == 0){
            message.warn('没有预收货信息');
        } else if(total < allAllotInQty){
            message.warn('累计预收货数量不能超过计划数量');
        } else {
            let sendList = [];
            list.map((item) => {
                sendList.push({
                    allotOutId: advancePopStore.advanceInfo.id,
                    materialCode: advancePopStore.advanceInfo.materialCode,
                    allotInLocationCode: item.allotInLocationCode,
                    allotInBatchCode: item.allotInBatchCode,
                    allotInQty: item.allotInQty,
                    unitCode: advancePopStore.advanceInfo.unitCode
                });
            });
            AllotFetch.addAdvanceList({allotOutId: advancePopStore.advanceInfo.id,list: sendList})
                .then((json) => {
                    if (json.status === 2000) {
                        advancePopStore.setVisible(false);
                        allotInListStore.fetchTableList();
                        advanceTableInfoStore.fetchTableList();
                    }
                });
        }
    };

    // //点击添加
    @action.bound
    onAdd() {
        if (!this.beforeEvent('add')) return;
        this.loading = true;
        if (this.editingIndex == null) {
            let newRecord = this.getNewRecord();
            newRecord.isNewRow = true;
            let list = this.dataSource.slice();
            list.splice(0, 0, newRecord);
            this.dataSource = list;
            list[0].allotInStockName = addAllotStore.allotInSiteName;
            this.onEdit(newRecord,0);
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.loading = false;
        this.afterEvent('add');
    }

    @action
    setEditRecord = () => {
        this.editingRecord = {};
        this.editingIndex = null;
    }

}

//预收货信息列表
export class AdvanceTableInfoStore extends TableStore {
    paging = {
        total: 0,
        current: 1,
        pageSize: 10,
    };
    pageSizeOptions = ['5', '10', '15','20', '30', '50'];
    //改变状态
    @action
    fetchTableList() {
        this.loading = true;
        let pm = Object.assign(this.pages,{allotId:addAllotStore.id });
        return AllotFetch.getAdvanceList(pm)
            .then(this.updateTableList)
            .then(json => {
                runInAction(() => {
                    if(json.data.list.length == 0) {
                        addAllotStore.disAdvanceTableInfo = false;
                    } else {
                        addAllotStore.disAdvanceTableInfo = true;
                    }
                })
                return json
            });
    }

    //删除
    @action
    delAdvanceList(id) {
        this.loading = true;
        let pm = { id: id };
        return AllotFetch.delAdvanceList(pm).then(json => {
            if (json.status === 2000) {
                this.fetchTableList({allotId:addAllotStore.id,page: 1,pageSize: 15});
                allotInListStore.fetchTableList();
            };
            return json;
        })
    }
}

//调拨信息列表
export class AddAllotTableStore extends TableStore {
    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['5', '10', '15','20', '30', '50'];
    //改变状态
    @action
    fetchTableList() {
        this.loading = true;
        let pm = { ...this.pages,...{allotId: addAllotStore.id} };
        return AllotFetch.getAllMxPageList(pm)
            .then(this.updateTableList)
            .then(json => {
                return json
            });
    }
}

//调出仓库树
class OutSiteStore extends SiteStore {
    @observable newArr = [];

    disabledNode(item) {
        return item.attribute.isStock == 0 || item.value == addAllotStore.allotInSiteId;
    };

    @action
    setListSelf = () => {
        let data = this.selectList.slice(),
            key = this.keyName,
            name = this.LabelName;
        let loop = data => data.map((item) => {
            item.key = item[key] + '';
            item.value = item[key] + '';
            item.label = item[name];
            delete item.disabled;
            if (item.children) loop(item.children);
            return item;
        });
        this.setList(loop(data));
    }

}

//调入仓库树
class InSiteStore extends SiteStore {
    constructor(props){
        super(props);
    };

    @observable newArr = [];

    disabledNode(item) {
        return item.attribute.isStock == 0 || item.value == addAllotStore.allotOutSiteId;
    };

    @action
    setListSelf = () => {
        let data = this.selectList.slice(),
            key = this.keyName,
            name = this.LabelName;
        let loop = data => data.map((item) => {
            item.key = item[key] + '';
            item.value = item[key] + '';
            item.label = item[name];
            delete item.disabled;
            if (item.children) loop(item.children);
            return item;
        });
        this.setList(loop(data));
    }
}




//导出store
let addAllotStore = new AddAllotStore();
let allotTypeStore = new AllotTypeStore();
let employeeStore = new EmployeeStore();
let outSiteStore = new OutSiteStore();
let inSiteStore = new InSiteStore();
let allotLocationStore = new AllotLocationStore();

let materialPopStore = new MaterialPopStore();
let searchMaterialStore = new SearchBarStore();
let materialChooseTableStore = new MaterialChooseTableStore();

let advancePopStore = new AdvancePopStore();
let advancePopTableStore = new AdvancePopTableStore();

let addOutInfoStore = new AddOutInfoStore();
let allotInListStore = new AllotInListStore();

let addAllotTableStore = new AddAllotTableStore();

let advanceTableInfoStore = new AdvanceTableInfoStore();

export { addAllotStore, allotTypeStore, employeeStore,
    outSiteStore, inSiteStore,
    addOutInfoStore, materialPopStore ,searchMaterialStore, materialChooseTableStore,
    allotLocationStore, advancePopStore, advancePopTableStore,
    allotInListStore, advanceTableInfoStore, addAllotTableStore}