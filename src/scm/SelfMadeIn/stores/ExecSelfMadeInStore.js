
import { message } from '../../../base/components/AntdComp';
import TableEditStore from '../../../base/stores/TableEditStore';
import SelectStore from '../../../base/stores/SelectStore';
import TableStore from '../../../base/stores/TableStore';
import { SelfMadeInFetch } from '../../consts/SelfMadeInUrls';
// import { PositionFromStore } from '../../InventoryCheck/store/CheckPlanStore'

let { observable, action, computed, runInAction, toJS } = mobx;



//执行主页面
export class ExecSelfMadeInStore{
    constructor() {
        this.detailStore = new DetailStore(this);
        this.receiveStore = new ReceiveStore(this);
        this.preRecStore = new PreRecStore(this);
    }
    
    @observable detail = {};
    @observable loading = false;

    @action.bound fetchDetail(pm) {
        this.loading = true;
        this.detailStore.loading = true;
        this.receiveStore.loading = true;
        return SelfMadeInFetch.selfMadeInDetail(pm)
            .then(json => {
                if (json.status == 2000) {
                    this.detail = json.data;
                    this.detailStore.updateTableList(json);
                    this.receiveStore.updateTableList(json);
                    this.preRecStore.locationStore.fetchSelectList({ stockId: json.data.stockId });
                }
                return json;
            }).then(json => {
                this.loading = false;
            });
    }

    fetchClose(pm) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInClose(pm).then((json) => {
            this.loading = false;
            return json;
        });
    }

    fetchReceive(pm) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInReceive(pm).then((json) => {
            this.loading = false;
            return json;
        });
    }
    fetchDelete(pm) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInPreReceiveDel(pm).then((json) => {
            this.loading = false;
            return json;
        });
    }
};
//明细信息
export class DetailStore extends TableStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
    }
    @action.bound updateTableList(json) {
        if (json.status === 2000) {
            let { detailList, total, page, pageSize } = json.data;
            this.dataSource = detailList;
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
};
//预收货信息
export class ReceiveStore extends TableStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
    }
    @action.bound updateTableList(json) {
        if (json.status === 2000) {
            let { preDetailList, total, page, pageSize } = json.data;
            this.dataSource = preDetailList;
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
};


// 仓位 select
export class PositionFromStore extends SelectStore {
    keyName = "code";
    labelName = "code";

    dropdownClassName = 'select-auto-complete';
    dropdownStyle = { width: 290 };
    dropdownMatchSelectWidth = false;
    optionLabelProp = 'value';

    getOption(item, index) {
        return (
            <div className='auto-complete-option'>
                <span>{item.code}</span >
                <span>{item.name ? '[' + item.name + ']' : ''}</span>
                <span>{item.stockName}</span>
            </div>
        );
    }
    @action
    fetchSelectList = (pm = {}) => {
        this.loading = true;
        return SelfMadeInFetch.getUnlockListForIn(pm)
            .then(this.updateSelectList)
    }

    get Props() {
        let p = super.Props;
        p.optionLabelProp = this.optionLabelProp;
        p.dropdownMatchSelectWidth = this.dropdownMatchSelectWidth;
        return p;
    }
}
//预收货弹窗
export class PreRecStore extends TableEditStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
        this.locationStore = new PositionFromStore();
    }
    initDetail = {
        materialCode: "",
        materialName: "",
        unitCode: "",
        unitName: "",
        planQty: "",
        preReceiveQty: "",
    };
    title = '预收货';
    width = 628;
    className = "selfMadeIn-preRec";

    @observable loading = false;
    @observable visible = false;
    @observable detail = this.initDetail;

    @action setVisible(value) {
        this.onCancel();
        this.visible = value;
    };

    @action resetDetail() {
        this.detail = { ...this.initDetail };
        this.dataSource = [];
    }
    @action setDetail(detail) {
        this.loading = true;
        this.dataSource = [];
        this.detail = Object.assign({}, this.detail, detail);
        this.loading = false;
    };
    @action.bound
    fetchSubmit(pm) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInPreReceiveAdd(pm).then((json) => {
            this.loading = false;
            return json;
        });
    }
    //表格编辑部分
    recordKey = 'line';
    inputCell = ['batchCode', 'qty'];
    selectCell = ['locationCode'];
    
    initRecord = {
        "line": "",
        "locationCode": "",
        "stockCode": "",
        "stockName": "",
        "batchCode": "",
        "qty": "",
    };
    @action.bound
    beforeEvent(type) {
        if (type == 'add') {
            let { stockCode, stockName } = this.pStore.detail;
            this.initRecord.stockCode = stockCode;
            this.initRecord.stockName = stockName;
        }
        if (type == 'save') {
            let { planQty, preReceiveQty } = this.detail;
            let { qty } = this.editingRecord;
            let num = Number(qty);
            this.dataSource.slice().forEach(item => {
                if (item[this.recordKey] != this.editingRecord[this.recordKey]){
                    num += Number(item.qty);
                }
            });
            if (num > (Number(planQty) - Number(preReceiveQty))) {
                message.error("预收货数量之和不能大于计划数量与现有已预收货数量之差！");
                return
            }
        }
        return true;
    }

};

let execSelfMadeInStore = new ExecSelfMadeInStore();
export { execSelfMadeInStore };