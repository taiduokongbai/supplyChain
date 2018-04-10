import moment from "moment";
import { message } from '../../../base/components/AntdComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { SelfMadeInFetch } from '../../consts/selfMadeInUrls';
import { SelfMadeInSourceOrderStore, SelfMadeInPlanOrderStore } from '../../data/DropDownStore';
import TableEditStore from '../../../base/stores/TableEditStore';
import TableStore from '../../../base/stores/TableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import { WareHouseStore } from '../../InventoryCheck/store/CheckPlanStore'

export class SelfMadeInFormStore {
    @observable loading = false;
    @observable shipAddressDetl;

    initDetail = {
        orderCode: "",
        orderStatus: "",
        
        receiveSiteCode: "",
        receiveSiteName: "",
        
        stockCode: "",
        stockName: "",
        sourceOrderType: "",
        sourceOrderCode: "",
        createDate: "",
        createByName: "",
        remarks: "",
        detailList: [],
        preDetailList:[],
    };
    @observable detail = { ...this.initDetail };
        
    @computed get getDetail() {
        return this.detail;
    }
    @action resetDetail() {
        this.detail = { ...this.initDetail };
    }
    @action setDetail(detail) {
        this.detail = Object.assign({}, this.detail, detail);
    }
}
//新增
export class AddSelfMadeInStore extends SelfMadeInFormStore {
    constructor() {
        super();
        this.sourceOrderStore = new SelfMadeInSourceOrderStore();
        this.planOrderStore = new SelfMadeInPlanOrderStore();
        this.wareHouseStore = new WareHouseStore();
        this.wareHouseStore.keyName = 'id';
        this.detailStore = new AddSelfMadeInDetailStore(this);
    }
    @action initData() {
        this.wareHouseStore.fetchTreeSelectList();
    }
    @action fetchSubmit(pm) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInAdd(pm).then(json => {
            this.loading = false;
            return json;
        });
    }
    @action fetchCodeRule(pm) {
        return SelfMadeInFetch.codeRule(pm);
    }
}

//明细
class AddSelfMadeInDetailStore extends TableStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
        this.addLineStore = new AddLineStore(this);
    }
    
    delDatas = [];
    @observable dataSource = [];

    @action
    resetDetail(list) {
        this.pages = {
            page: 1,
            pageSize: 10
        };
        this.paging = {
            total: 0,
            current: 1,
            pageSize: 10,
        };
        this.dataSource = list || [];
        this.delDatas = [];
    }

    @action.bound
    onMaterialAdd(data) {
        let list = this.dataSource.slice();
        data.sourceOrderLineNo = data.lineNo;
        data.orderStatus = 1;
        data.planQty = data.inventoryQty;
        data.unitCode = data.inventoryUnitCode;
        data.unitName = data.inventoryUnitName;
        list.splice(0, 0, data);
        this.dataSource = list;
    }
    @action.bound
    onMaterialDelete(index) {
        let { page, pageSize } = this.pages;
        let list = this.dataSource.slice();
        let realIndex = index;
        if (page && page != 1) {
            realIndex = (page - 1) * pageSize + index;
            if (index == 0 && list.length - 1 == realIndex) {
                this.pages.page = page - 1;
            }
        };
        //将删除项保存起来
        let delData = list[realIndex];
        delData.delFlag = 1;
        if (!this.delDatas.map(d => d.id).includes(delData.id)) {
            this.delDatas.push(delData);
        }
        
        let newList = [...list];
        newList.splice(realIndex, 1);
        this.dataSource = newList;

    }
};

//新增行 Modal
class AddLineStore extends TableStore{
    constructor(pStore) {
        super();
        this.pStore = pStore;
        this.searchBarStore = new SearchBarStore();
    }

    title = '自制件选择';
    width = 1100;
    className = "SelfMadeIn-detail-line";
    
    orderCode = null;
    @observable visible = false;
    @action setVisible(value) {
        this.visible = value;
    };

    selectedRowKeys = [];
    @action fetchTableList(orderCode) {
        this.loading = true;
        if (orderCode) this.orderCode = orderCode;
        this.searchBarStore.setLoading(true);
        let p = {
            ...this.pages, 
            ...this.searchBarStore.Pm,
            orderCode: this.orderCode,
        };
        return SelfMadeInFetch.planOrderDetail(p)
            .then(this.updateTableList)
            .then(json => {
                this.searchBarStore.setLoading(false);
                return json
            });
    }
}  
const addSelfMadeInStore = new AddSelfMadeInStore();
export { addSelfMadeInStore };

    
//编辑表单
export class EditSelfMadeInStore extends AddSelfMadeInStore {
    @action.bound
    fetchDetail(pm) {
        this.loading = true;
        this.resetDetail();
        return SelfMadeInFetch.selfMadeInDetail(pm).then(json => {
            if (json.status === 2000) {
                let {
                    sourceOrderType,
                    stockCode,
                    receiveSiteCode,
                    sourceOrderCode,
                    detailList,
                } = json.data;
                json.data.stockCode = [receiveSiteCode, stockCode].join('-');
                this.detail = { ...this.detail, ...json.data };
                this.detailStore.resetDetail(detailList);
                this.sourceOrderStore.loading = true;
                this.sourceOrderStore.selectList = [{ orderCode: sourceOrderCode, list: detailList }];
                this.sourceOrderStore.loading = false;
                if (sourceOrderType == '1') {
                    this.detailStore.addLineStore.fetchTableList(sourceOrderCode);
                }
            };
            this.loading = false;
            return json;
        })
    }
    @action fetchSubmit(pm) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInEdit(pm).then(json => {
            this.loading = false;
            return json;
        });
    }
}
const editSelfMadeInStore = new EditSelfMadeInStore();
export { editSelfMadeInStore };