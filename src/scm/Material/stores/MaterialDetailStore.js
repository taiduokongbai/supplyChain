import moment from "moment";
import { message } from '../../../base/components/AntdComp';
import SelectTableStore from '../../../base/stores/SelectTableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import TableEditStore from '../../../base/stores/TableEditStore';
import { MaterialFetch } from '../../../base/consts/BusinessUrls';
import { MaterialBaseStore } from './MaterialAddStore';
import { MaterialListStore } from './MaterialListStore';
import { converByte } from '../../../base/consts/Utils';
import MeasureStore from '../../../base/stores/MeasureStore';
import SelectStore from '../../../base/stores/SelectStore';
let { observable, action, computed, runInAction, toJS, autorun } = mobx;
export class MaterialDetailStore extends MaterialBaseStore {
    constructor() {
        super();
        // this.measureStore = new MeasureStore();
        this.materialListStore = new MaterialListStore();
    }
    initDataSource = {
        materialInventoryList: [{
            id: "",
            materialCode: "",
            type: "0",
            usingWarehouse: "1",
            // InventoryUnitName: "",
            usingBatch: "0",
            usingExpiration: "0",
            shelfLife: "",
            // inventoryDimensionality: "",
            // inventoryUnitSystem: "",
            inventoryUnit: "",
        }],
        materialSellList: [{
            id: "",
            materialCode: "",
            minOrder: "",
            allowSell: "0",
            sellUnitName: "",
            sellDimensionality: "",
            sellUnitSystem: "",
            sellUnit: "",

        }],
        materialPurchaseList: [{
            id: "",
            materialCode: "",
            allowPurchase: "0",
            purchaseUnitName: "",
            purchaseDimensionality: "",
            purchaseUnitSystem: "",
            purchaseUnit: "",

        }],
        scmMaterialProduceList: [{
            id: "",
            materialCode: "",
            produceUnitName: "",
            issueWay: "0",
            allowOverquota: "1",
            minIssue: "",
            produceDimensionality: "",
            produceUnitSystem: "",
            produceUnit: "",
        }],
        materialPlanList: [{
            planStrategy: "",
            fixDispatchAdvance: "",
            fixMakeAdvance: "",
            fixPurchaseAdvance: "",
            id: "",
            materialCode: "",
            materialProperty: "0",
            maxInventory: "",
            maxOrderQuantity: "",
            minBatch: "",
            minInventory: "",
            minOrderQuantity: "",
            safeInventory: "",
            repMethod: "",
            orderPeriod: "",
            planUintName: "",
            planUint: ""
        }]
    };
    @observable detail = { ...this.initDataSource, ...this.detail };

    @observable materialInventoryList = [];
    @action
    fetchMaterialDetail(pm) {
        this.loading = true;
        this.setMaterialDetail();
        return MaterialFetch.materialDetail(pm).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    let { materialInventoryList, materialSellList, materialPurchaseList, scmMaterialProduceList, materialPlanList } = json.data;
                    this.detail = Object.assign({}, this.detail, this.dataSource, json.data)
                    materialDetailDWStore.fetchTableList({ materialCode: this.detail.materialCode })
                })
                // this.measureStore.fetchSelectList();
            }
            runInAction(() => {
                this.loading = false
            })
        })
    }
}
//
export class MaterialDetailDWListStore extends SelectStore {
    keyName = 'unitCode';
    labelName = 'unitName';
    getOption(item, index) {
        return (
            <div>
                {item[this.labelName]}
                {item.symbol ? <a>[{item.symbol}]</a> : null}
            </div>

        )
    }
    getLabelName(value) {
        let selectList = this.selectList.slice();
        if (selectList.length > 0) {
            selectList.forEach(item => {
                if (item[this.keyName] === value) {
                    if (item.symbol) {
                        value = item[this.labelName] + `[${item.symbol}]`;
                    } else {
                        value = item[this.labelName] + '';
                    }
                }
            })
        }
        return value;
    }
    @action
    fetchSelectList(pm) {
        return MaterialFetch.getUnitByMaterialCode(pm).then(this.updateSelectList);
    }
}
// let initMeasure = autorun(() => {
//     if (!materialDetailDWListStore.selectList.slice().length > 0) {
//         materialDetailDWListStore.fetchSelectList();
//     }
// });
// initMeasure();
export class MaterialDetailKCStore {
    @observable usingWarehouse = true;
    @action
    fetchMaterialKCSubmit(pm) {
        this.loading = true;
        return MaterialFetch.materialDetailKC(pm);
    }
}
//materialDetailSCStore
export class MaterialDetailSCStore {
    @action
    fetchMaterialSCSubmit(pm) {
        this.loading = true;
        return MaterialFetch.materialDetailSC(pm);
    }
}
//materialDetailSXStore
export class MaterialDetailSXStore {
    @action
    fetchMaterialSXSubmit(pm) {
        this.loading = true;
        return MaterialFetch.materialDetailSX(pm);
    }
}
//materialDetailCGStore
export class MaterialDetailCGStore {
    @action
    fetchMaterialCGSubmit(pm) {
        this.loading = true;
        return MaterialFetch.materialDetailCG(pm);
    }
}
//materialDetailJHStore
export class MaterialDetailJHStore {
    @action
    fetchMaterialJHSubmit(pm) {
        this.loading = true;
        return MaterialFetch.materialDetailJH(pm);
    }
}
//materialDetailFJStore
export class MaterialDetailFJStore {
    @observable fileList = [];
    @action
    fetchTableList(params) {
        let pm = { ...this.pages, ...params };
        return MaterialFetch.materiallFJInfoList(pm)
            .then(json => {
                if (json.status === 2000) {
                    /* runInAction(()=>{
                        let {list} = json.data;
                        this.fileList = list;
                    }) */
                    let a = json.data.list ? json.data.list : [];
                    if (a.length > 0) {
                        a.map((item, index) => {
                            item.uid = index;
                            return item;
                        })
                    }
                    this.setFileList(a)
                }
            });
    }
    @action
    fetchMatrialDetele(pm = {}) {
        this.loading = true;
        return MaterialFetch.materialFJDelete(pm)
            .then(json => {
                if (json.status === 2000) {
                    runInAction(() => {
                        this.fetchTableList();
                    })
                }
                return json
            })
    }
    @action
    fetchMaterialFJadd(pm = {}) {
        return MaterialFetch.materialFJadd(pm).then(json => {
            return json
        })
    }
    @action
    fetchMaterialisDisable(pm = {}) {
        return MaterialFetch.materialisDisable(pm).then(json => {
            // if(json.status === 2000){
            //     materialListStore.fetchTableList();
            // }
            return json
        })
    }
    @action
    setFileList(fileList) {
        fileList.length > 0 ? fileList.map((item, index) => {
            var mb = new RegExp('MB\\)$');
            const kb = new RegExp('KB\\)$');
            item.name = item.name ? item.name : item.fileName;
            item.size = item.size ? item.size : item.filesize;
            if (item.response) {
                item.url = item.response.data.fileURL;
                // item.name += ' (' + item.response.data.filesize + ')';
            }
            if (!mb.test(item.name)||!kb.test(item.name)) {
                let a = item.size;
                item.name += ' (' + converByte(Number(a)) + ')';
            }
            item.url = item.url ? item.url : item.fileURL;
            return item;
        }) : null;
        this.fileList = fileList;
    }

    @action
    setFilesList_upload = (fileList) => {
        fileList.length > 0 ? fileList.map((item, index) => {
            var mb = new RegExp('MB\\)$');
            item.name = item.name ? item.name : item.fileName;
            item.size = item.size ? item.size : item.filesize;
            if (item.response) {
                item.url = item.response.data.fileURL;
            }
            item.url = item.url ? item.url : item.fileURL;
            return item;
        }) : null;
        this.fileList = fileList;
    }
}
const measurestoreBusiness = new MeasureStore();
const measurestoreBase = new MeasureStore();
//单位换算
export class MaterialDetailDWStore extends TableEditStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
        this.measurestoreBusiness = measurestoreBusiness;
        this.measurestoreBase = measurestoreBase;
    }
    recordKey = 'id';
    selectBusinessDWCell = ['businessUnitName'];
    selectBaseDWCell = ['measureUnitName'];
    inputNumberCell = ['businessNumber', 'measureNumber'];
    // 初始化数据
    initRecord = {
        "id": "",
        "businessNumber": "",
        "businessUnit": "",
        "measureNumber": "",
        "measureUnit": "",
    };
    currentIndex = '';
    flag = '';
    setIndex = (index) => {
        this.currentIndex = index;
    };
    @action
    fetchTableList(params) {
        // this.loading = true;
        let pm = { ...params };
        return MaterialFetch.materialDetailUintCoversionList(pm)
            .then(this.updateTableList)
            .then(json => {
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
    @action
    setRecord = (record) => {
        let newRecord = {
            "id": record.id,
            "businessNumber": record.businessNumber,
            "businessUnit": record.businessUnit,
            "measureNumber": record.measureNumber,
            "measureUnit": record.measureUnit,
        }
        this.loading = true;
        // console.log('record--', record);
        this.editingRecord = Object.assign({}, this.editingRecord, newRecord);
        this.loading = false;
    };
    //点击添加
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
            this.onEdit(newRecord, 0);
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.loading = false;
        this.flag = true;
        this.afterEvent('add');
    }
    //点击编辑
    @action.bound
    onEdit(record, index) {
        if (!this.beforeEvent('edit')) return;
        this.loading = true;
        let { page, pageSize } = this.pages;
        if (page && page != 1) {
            index = (page - 1) * pageSize + index;
        };
        if (this.editingIndex == null) {
            this.editingIndex = index;
            // console.log('record---', record);
            this.editingRecord = record;
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.flag = false;
        this.loading = false;
        this.afterEvent('edit');
    }
    //点击保存，需重写
    @action.bound
    handleSave(data) {
        if (!this.beforeEvent('save')) return;
        // this.loading = true;
        
        let list = this.dataSource.slice();
        let newBusinessUnit = {}, newBase = {}, newStr = {}, newArr = [], endData = {};
        newBusinessUnit = { ...data.businessUnit }
        newBase = { ...data.measureUnit }
        newStr.businessNumber = data.businessNumber;
        newStr.measureNumber = data.measureNumber;
        // newStr.businessUnit = newBusinessUnit.meaCode;
        newStr.measureUnit = newBase.meaCode;

        if (this.editingRecord.businessNumber) {
            if (newBusinessUnit.dimensionality === 1 || newBusinessUnit.dimensionality === 0) {
                if (newBusinessUnit.meaCode == '') {
                    newStr.businessUnit = newBusinessUnit.meaSystem;
                } else {
                    newStr.businessUnit = newBusinessUnit.meaCode;
                }
            } else {
                newStr.businessUnit = newBusinessUnit.meaCode;
            }
        } else {
            if (newBusinessUnit.dimensionality === 1 || newBusinessUnit.dimensionality === 0) {
                newStr.businessUnit = newBusinessUnit.meaSystem;
            } else {
                newStr.businessUnit = newBusinessUnit.meaCode;
            }
        }
        newArr.push(newStr);
        if (this.flag) {
            endData = Object.assign({}, { list: newArr }, { materialCode: materialDetailStore.detail.materialCode });
            MaterialFetch.materiallUintConversionAdd(endData).then(json => {
                if (json.status === 2000) {
                    runInAction(() => {
                        this.editingRecord = {};
                        this.editingIndex = null;
                        this.loading = false;
                        this.flag = '';
                        this.afterEvent('save');
                    });
                    delete this.editingRecord.isNewRow;
                    this.fetchTableList({ page: 1, pageSize: 10, materialCode: materialDetailStore.detail.materialCode });
                    materialDetailDWListStore.fetchSelectList({ materialCode: materialDetailStore.detail.materialCode });
                }else if(json.status===3502){
                }
            });
        } else {
            endData = Object.assign({},
                newStr,
                { id: this.editingRecord.id });
            MaterialFetch.materiallUintConversionEdit(endData).then(json => {
                if (json.status === 2000) {
                    runInAction(() => {
                        this.editingRecord = {};
                        this.editingIndex = null;
                        this.loading = false;
                        this.flag = '';
                        this.afterEvent('save');
                    });
                    materialDetailDWListStore.fetchSelectList({ materialCode: materialDetailStore.detail.materialCode });
                    this.fetchTableList({ materialCode: materialDetailStore.detail.materialCode });
                    
                }
            });
        }

    }
    //点击删除
    @action.bound
    onDelete(record, index) {
        if (!this.beforeEvent('delete')) return;
        this.loading = true;
        // let { page, pageSize } = this.pages;
        // let list = this.dataSource.slice();
        // let realIndex = index;
        // if (page && page != 1) {
        //     realIndex = (page - 1) * pageSize + index;
        //     if (index == 0 && list.length - 1 == realIndex) {
        //         this.pages.page = page - 1;
        //     }
        // };
        MaterialFetch.materiallUintConversionDetele({ id: record.id }).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.editingRecord = {};
                    this.editingIndex = null;
                    this.loading = false;
                    this.flag = '';
                    this.afterEvent('save');
                });
                this.fetchTableList({ materialCode: materialDetailStore.detail.materialCode });
                materialDetailDWListStore.fetchSelectList({ materialCode: materialDetailStore.detail.materialCode });
            }
        });
        // list.splice(realIndex, 1);
        // this.dataSource = list;
        this.loading = false;
        this.afterEvent('delete');
    }
    get Props() {
        return Object.assign({
            selectBusinessDWCell: this.selectBusinessDWCell,
            selectBaseDWCell: this.selectBaseDWCell,
        }, super.Props);
    }
    @action
    setEditRecord = () => {
        this.editingRecord = {};
        this.editingIndex = null;
    }
}

let materialDetailStore = new MaterialDetailStore();
// let measureStore = materialDetailStore.measureStore;
let materialDetailKCStore = new MaterialDetailKCStore();
let materialDetailSCStore = new MaterialDetailSCStore();
let materialDetailSXStore = new MaterialDetailSXStore();
let materialDetailCGStore = new MaterialDetailCGStore();
let materialDetailJHStore = new MaterialDetailJHStore();
let materialDetailDWStore = new MaterialDetailDWStore();
let materialDetailFJStore = new MaterialDetailFJStore();
let materialDetailDWListStore = new MaterialDetailDWListStore();




export {
    materialDetailStore,
    // measureStore,
    materialDetailKCStore,
    materialDetailSCStore,
    materialDetailSXStore,
    materialDetailCGStore,
    materialDetailJHStore,
    materialDetailDWStore,
    materialDetailFJStore,
    materialDetailDWListStore
}