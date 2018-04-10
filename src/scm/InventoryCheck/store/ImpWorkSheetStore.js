import TableStore from '../../../base/stores/TableStore';
import { WorkSheetCheck } from '../../consts/CheckUrls';
import { ShippingSpaceStore, MaterialSelectStore } from '../../data/DropDownStore'
import { Form } from '../../../base/components/AntdComp';
import ImpWorkSheetTableComp from '../comp/ImpWorkSheetTableComp'
let { observable, action, computed, runInAction, toJS, useStrict } = mobx;
export class ImpBaseWorkSheetStore {
    @observable spinLoading = false;
    @observable impDetail = {
        id: "",
        stocktakeTaskCode: "",
        isBlindStocktake: 0,
        solutionCode: "",
        solutionName: "",
        pushdownByName: "",
        pushdownDatetime: "",
        warehouseName: "",
        locationName: "",
        materialCategoryName: "",
        materialCode: "",
        materialName: "",
        remarks: "",
        status:2
    }
    @action.bound
    fetchImpDetails(pm) {
        this.spinLoading = true;
        return WorkSheetCheck.impWorkSheetDetails(pm).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.impDetail = json.data
                })
            }
            runInAction(() => {
                this.spinLoading = false;
            })
            return json;
        });
    }
}
//执行盘点作业单 store
export class ImpWorkSheetStore extends ImpBaseWorkSheetStore {
    constructor() {
        super();
        this.impWorkSheetTableStore = new ImpWorkSheetTableStore()
    }
    @observable startCheck = true;
}
//执行作业单表格 store
export class ImpWorkSheetTableStore extends TableStore {
    @observable changeOpration = 'table-thead-center add-table-operation-hidden';
    @observable Comp = Form.create({ wrappedComponentRef: true })(ImpWorkSheetTableComp);
    @observable dataSource = [];
    @observable paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
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
    @action.bound
    pageOnChange(page) {
        if (this.loading) return;
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
        this.Comp = Form.create({ wrappedComponentRef: true })(ImpWorkSheetTableComp);
        this.loading = true;
        this.fetchTableList();
    };
    editingIndex;
    //转化行数据
    @action
    getTableList(pm) {
        this.loading = true;
        this.dataSource = [];
        return WorkSheetCheck.impWorkSheetAllTableCheck(pm)
            .then(this.updateWorkSheetTableList)
            .then(json => {
                this.loading = false;
                return json
            });
    }
    @action.bound
    updateWorkSheetTableList(json) {
        if (json.status === 2000) {
            let { list, total, page, pageSize } = json.data;
            let newDataSoure = list;
            for (let i = 1; i <= newDataSoure.length; i++) {
                let newItem = Object.assign(newDataSoure[i - 1], { lineNumber: i })
                this.dataSource.push(newItem)
            }
            // this.dataSource=list
        };
        this.loading = false;
        return json;
    }
    @action.bound
    onMaterialAdd(data) {
        let list = this.dataSource.slice();
        let id = "-1";
        if (list[list.length - 1] && list[list.length - 1].id < 0) {
            id = list[list.length - 1].id - 1;
        };
        data.id = id;
        list.push(data)
        this.dataSource = [];
        for (let i = 1; i <= list.length; i++) {
            let newItem = Object.assign(list[i - 1], { lineNumber: i })
            this.dataSource.push(newItem)
        }
        let {page, pageSize} = this.pages;
        if (this.dataSource && this.dataSource.length > 0) {
            let _page = Math.ceil(this.dataSource.length / pageSize);
            this.paging = {
                ...this.paging,
                current: _page
            };
        }
        this.Comp = Form.create({ wrappedComponentRef: true })(ImpWorkSheetTableComp);
    }
    @action.bound
    onMaterialEdit(data) {
        let list = this.dataSource.slice();
        list[this.editingIndex] = data;
        this.dataSource = list;
    }
    @action.bound
    onMaterialDelete(index) {
        let { current, pageSize } = this.paging;
        let {page} = this.pages;
        let list = this.dataSource.slice();
        let realIndex = index;
        if (current && current != 1) {
            realIndex = (current - 1) * pageSize + index;
            if (index == 0 && list.length - 1 == realIndex) {
                this.pages.page = page - 1;
            }
        };
        let newList = [...list];
        newList.splice(realIndex, 1);
        this.dataSource = [];
        let tableList = [];
        for (let i = 1; i <= newList.length; i++) {
            let newItem = Object.assign(newList[i - 1], { lineNumber: i })
            tableList.push(newItem)
        }
        this.dataSource = tableList;
        this.Comp = Form.create({ wrappedComponentRef: true })(ImpWorkSheetTableComp);
        // this.dataSource = newList;
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
    fetchTableDel(pm) {
        return WorkSheetCheck.impDete(pm).then(json => {
            return json;
        });
    }
}
//添加行
export class AddDialogLineStore {
    initDetail = {
        locationName: "",
        materialCode: "",
        materialName: "",
        batchCode: "",
        actualStocktakeQty: "",
        accountQty: "",
        inventoryStatus: "",
        isManual: 0,
        inventoryUnitName:"",
        inventoryUnit:"",
        differenceQty:""
    };
    title = '添加行';
    width = 384;
    className = "imp-add-dialog";

    @observable loading = false;
    @observable visible = false;


    @observable detail = this.initDetail;

    @action setVisible(value) {
        this.visible = value;
    };

    @action resetDetail() {
        this.detail = { ...this.initDetail };
    }
    @action setMaterialDetail(detail) {
        this.detail = Object.assign({}, this.detail, detail);
    };
}
//详情作业单
export class DetailSheetStore extends ImpBaseWorkSheetStore {
    constructor() {
        super();
    }
}
//详情作业单表格
export class DetailWorkSheetTableStore extends TableStore {
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
        let pm = { ...this.pages, ...params };
        if (pm.id == undefined) {
            pm.id = detailSheetStore.impDetail.id;
            pm.stocktakeTaskCode = detailSheetStore.impDetail.stocktakeTaskCode
        }
        return WorkSheetCheck.impWorkSheetTableCheck(pm)
            .then(this.fetchDetailsTableList)
            .then(json => {
                return json
            });
    }
    @action.bound
    fetchDetailsTableList(json) {
        if (json.status === 2000) {
            let { list, total, page, pageSize } = json.data;
             this.dataSource = [];
             let newDataSoure=list;
            for (let i = 1; i <= newDataSoure.length; i++) {
                let newItem = Object.assign(newDataSoure[i - 1], { lineNumber: (page - 1) * pageSize + i })
                this.dataSource.push(newItem)
            }
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
let impWorkSheetStore = new ImpWorkSheetStore()
let addTableLineStore = impWorkSheetStore.impWorkSheetTableStore
let addDialogLineStore = new AddDialogLineStore()
let shippingSpaceStore = new ShippingSpaceStore();
let detailSheetStore = new DetailSheetStore();
let detailWorkSheetTableStore = new DetailWorkSheetTableStore();
let materialSelectStore = new MaterialSelectStore();
export { impWorkSheetStore, addTableLineStore, addDialogLineStore, shippingSpaceStore, detailSheetStore, detailWorkSheetTableStore, materialSelectStore }